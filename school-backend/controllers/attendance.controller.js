const attendanceService = require('../services/attendance.service');

const markAttendance = async (req, res, next) => {
  try {
    const { attendanceRecords } = req.body;
    if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
      return res.status(400).json({ message: 'attendanceRecords array is required.' });
    }
    const result = await attendanceService.markAttendance(attendanceRecords, req.user.id);
    return res.status(200).json({ message: 'Attendance marked successfully.', result });
  } catch (error) {
    next(error);
  }
};

const getAttendanceHistory = async (req, res, next) => {
  try {
    const { class_id, date } = req.query;
    if (!class_id || !date) {
      return res.status(400).json({ message: 'class_id and date query parameters are required.' });
    }
    const history = await attendanceService.getAttendanceHistory(class_id, date);
    return res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};

const getStudentAttendanceReport = async (req, res, next) => {
  try {
    // If student, they can only view their own. If admin/teacher, they can pass studentId in query
    let studentId = req.user.profileId;
    if (req.user.role !== 'student' && req.params.studentId) {
      studentId = req.params.studentId;
    }

    if (!studentId) {
      return res.status(400).json({ message: 'studentId is required.' });
    }

    const report = await attendanceService.getStudentAttendanceReport(studentId);
    return res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAttendance,
  getAttendanceHistory,
  getStudentAttendanceReport
};
