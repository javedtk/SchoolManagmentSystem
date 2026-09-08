const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

// Mark daily attendance (super_admin or teacher)
router.post('/mark', roleMiddleware(['super_admin', 'teacher']), attendanceController.markAttendance);

// View attendance history per class (super_admin or teacher)
router.get('/history', roleMiddleware(['super_admin', 'teacher']), attendanceController.getAttendanceHistory);

// View own attendance report (student)
router.get('/report', roleMiddleware(['student']), attendanceController.getStudentAttendanceReport);

// View student attendance report by ID (super_admin or teacher)
router.get('/report/:studentId', roleMiddleware(['super_admin', 'teacher']), attendanceController.getStudentAttendanceReport);

module.exports = router;
