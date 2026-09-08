const express = require('express');
const router = express.Router();
const resultController = require('../controllers/result.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

// Exams management (Super admin only or read by others)
router.get('/exams', roleMiddleware(['super_admin', 'teacher', 'student']), resultController.getAllExams);
router.post('/exams', roleMiddleware(['super_admin']), resultController.createExam);

// Enter Marks (Teacher/Admin)
router.post('/enter-marks', roleMiddleware(['super_admin', 'teacher']), resultController.enterStudentMarks);
router.get('/class-results', roleMiddleware(['super_admin', 'teacher']), resultController.getResultsByClassAndExam);

// View Results (Student own, or target student for teacher/admin)
router.get('/student', roleMiddleware(['student']), resultController.getStudentResults);
router.get('/student/:studentId', roleMiddleware(['super_admin', 'teacher']), resultController.getStudentResults);

// Actions on Report Cards
router.post('/student/:studentId/exam/:examId/email', roleMiddleware(['super_admin', 'teacher']), resultController.emailStudentReportCard);
router.get('/student/:studentId/exam/:examId/download', roleMiddleware(['super_admin', 'teacher', 'student']), resultController.downloadReportCard);

module.exports = router;
