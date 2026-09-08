const { Timetable, Class, Subject, Teacher, User } = require('../models');

const getTimetableByClass = async (classId) => {
  return Timetable.findAll({
    where: { class_id: classId },
    include: [
      { model: Class, attributes: ['name', 'section'] },
      { model: Subject, attributes: ['name', 'code'] },
      {
        model: Teacher,
        include: [{ model: User, attributes: ['name'] }]
      }
    ],
    order: [['day'], ['period_no']]
  });
};

const getTimetableByTeacher = async (teacherId) => {
  return Timetable.findAll({
    where: { teacher_id: teacherId },
    include: [
      { model: Class, attributes: ['name', 'section'] },
      { model: Subject, attributes: ['name', 'code'] }
    ],
    order: [['day'], ['period_no']]
  });
};

const createTimetableEntry = async (entryData) => {
  if (Array.isArray(entryData)) {
    const sequelize = require('../config/db.config');
    return sequelize.transaction(async (t) => {
      const createdEntries = [];
      
      // Perform conflict checks for all entries first
      for (const data of entryData) {
        // Check if conflict exists for the class/day/period
        const conflictClass = await Timetable.findOne({
          where: {
            class_id: data.class_id,
            day: data.day,
            period_no: data.period_no
          },
          transaction: t
        });
        if (conflictClass) {
          throw { status: 400, message: `Conflict: Class already has a subject scheduled for day ${data.day}, period ${data.period_no}.` };
        }

        // Check if conflict exists for the teacher/day/period
        if (data.teacher_id) {
          const conflictTeacher = await Timetable.findOne({
            where: {
              teacher_id: data.teacher_id,
              day: data.day,
              period_no: data.period_no
            },
            transaction: t
          });
          if (conflictTeacher) {
            throw { status: 400, message: `Conflict: Teacher is already busy on day ${data.day}, period ${data.period_no}.` };
          }
        }

        // Check for duplicate day/period/class or day/period/teacher within the payload itself
        const selfDuplicate = entryData.filter(x => 
          x !== data && 
          x.day === data.day && 
          x.period_no === data.period_no && 
          (x.class_id === data.class_id || (x.teacher_id && x.teacher_id === data.teacher_id))
        );
        if (selfDuplicate.length > 0) {
          throw { status: 400, message: `Conflict: Duplicate slots defined for day ${data.day}, period ${data.period_no} in this request.` };
        }
      }

      // If no conflicts found, proceed to create all entries
      for (const data of entryData) {
        const entry = await Timetable.create(data, { transaction: t });
        createdEntries.push(entry);
      }
      return createdEntries;
    });
  } else {
    // Check if conflict exists for the class/day/period
    const conflictClass = await Timetable.findOne({
      where: {
        class_id: entryData.class_id,
        day: entryData.day,
        period_no: entryData.period_no
      }
    });
    if (conflictClass) {
      throw { status: 400, message: `Timetable slot conflict: Class already has a subject scheduled for day ${entryData.day}, period ${entryData.period_no}.` };
    }

    // Check if conflict exists for the teacher/day/period
    if (entryData.teacher_id) {
      const conflictTeacher = await Timetable.findOne({
        where: {
          teacher_id: entryData.teacher_id,
          day: entryData.day,
          period_no: entryData.period_no
        }
      });
      if (conflictTeacher) {
        throw { status: 400, message: `Timetable slot conflict: Teacher is already busy on day ${entryData.day}, period ${entryData.period_no}.` };
      }
    }

    return Timetable.create(entryData);
  }
};

const updateTimetableEntry = async (id, entryData) => {
  const entry = await Timetable.findByPk(id);
  if (!entry) {
    throw { status: 404, message: 'Timetable entry not found.' };
  }
  return entry.update(entryData);
};

const updateTeacherTimetable = async (teacherId, entries) => {
  const sequelize = require('../config/db.config');
  return sequelize.transaction(async (t) => {
    // Delete existing slots for this teacher
    await Timetable.destroy({
      where: { teacher_id: teacherId },
      transaction: t
    });

    const createdEntries = [];
    for (const data of entries) {
      // Ensure consistency of teacher_id
      data.teacher_id = Number(teacherId);

      // Check if conflict exists for the class/day/period (from other teachers)
      const conflictClass = await Timetable.findOne({
        where: {
          class_id: data.class_id,
          day: data.day,
          period_no: data.period_no
        },
        transaction: t
      });
      if (conflictClass) {
        throw { status: 400, message: `Conflict: Class already has a subject scheduled for day ${data.day}, period ${data.period_no}.` };
      }

      // Check for duplicate day/period within the payload itself for this teacher
      const selfDuplicate = entries.filter(x => 
        x !== data && 
        x.day === data.day && 
        x.period_no === data.period_no
      );
      if (selfDuplicate.length > 0) {
        throw { status: 400, message: `Conflict: You assigned this teacher to multiple slots on day ${data.day}, period ${data.period_no} in this request.` };
      }
    }

    // If no conflicts, create all
    for (const data of entries) {
      const entry = await Timetable.create(data, { transaction: t });
      createdEntries.push(entry);
    }

    return { message: 'Timetable updated successfully.', count: createdEntries.length };
  });
};

const deleteTimetableEntry = async (id) => {
  const entry = await Timetable.findByPk(id);
  if (!entry) {
    throw { status: 404, message: 'Timetable entry not found.' };
  }
  await entry.destroy();
  return { message: 'Timetable entry deleted successfully.' };
};

module.exports = {
  getTimetableByClass,
  getTimetableByTeacher,
  createTimetableEntry,
  updateTimetableEntry,
  updateTeacherTimetable,
  deleteTimetableEntry
};
