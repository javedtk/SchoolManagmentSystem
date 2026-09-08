const timetableService = require('../services/timetable.service');

const getTimetableByClass = async (req, res, next) => {
  try {
    const timetable = await timetableService.getTimetableByClass(req.params.classId);
    return res.status(200).json(timetable);
  } catch (error) {
    next(error);
  }
};

const getTimetableByTeacher = async (req, res, next) => {
  try {
    let teacherId = req.user.profileId;
    if (req.user.role !== 'teacher' && req.params.teacherId) {
      teacherId = req.params.teacherId;
    }
    
    if (!teacherId) {
      return res.status(400).json({ message: 'teacherId is required.' });
    }

    const timetable = await timetableService.getTimetableByTeacher(teacherId);
    return res.status(200).json(timetable);
  } catch (error) {
    next(error);
  }
};

const createTimetableEntry = async (req, res, next) => {
  try {
    const entry = await timetableService.createTimetableEntry(req.body);
    return res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

const updateTimetableEntry = async (req, res, next) => {
  try {
    const entry = await timetableService.updateTimetableEntry(req.params.id, req.body);
    return res.status(200).json(entry);
  } catch (error) {
    next(error);
  }
};

const updateTeacherTimetable = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const result = await timetableService.updateTeacherTimetable(teacherId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteTimetableEntry = async (req, res, next) => {
  try {
    const result = await timetableService.deleteTimetableEntry(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTimetableByClass,
  getTimetableByTeacher,
  createTimetableEntry,
  updateTimetableEntry,
  updateTeacherTimetable,
  deleteTimetableEntry
};
