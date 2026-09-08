const { Attendance, Student, User, Class } = require('../models');

const markAttendance = async (attendanceRecords, markedByUserId) => {
  const promises = attendanceRecords.map(async (record) => {
    // Check if attendance record already exists for the student and date
    const existing = await Attendance.findOne({
      where: {
        student_id: record.student_id,
        date: record.date
      }
    });

    if (existing) {
      return existing.update({
        status: record.status,
        marked_by: markedByUserId
      });
    } else {
      return Attendance.create({
        student_id: record.student_id,
        class_id: record.class_id,
        date: record.date,
        status: record.status,
        marked_by: markedByUserId
      });
    }
  });

  return Promise.all(promises);
};

const getAttendanceHistory = async (classId, date) => {
  return Attendance.findAll({
    where: { class_id: classId, date },
    include: [
      {
        model: Student,
        include: [{ model: User, attributes: ['name'] }]
      }
    ]
  });
};

const getStudentAttendanceReport = async (studentId) => {
  const records = await Attendance.findAll({
    where: { student_id: studentId },
    include: [{ model: Class, attributes: ['name', 'section'] }]
  });

  const total = records.length;
  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const leave = records.filter(r => r.status === 'leave').length;
  const percentage = total > 0 ? (present / total) * 100 : 100.00;

  return {
    percentage: parseFloat(percentage.toFixed(2)),
    summary: { total, present, absent, leave },
    records
  };
};

module.exports = {
  markAttendance,
  getAttendanceHistory,
  getStudentAttendanceReport
};
