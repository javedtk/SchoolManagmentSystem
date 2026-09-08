const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

router.use(authMiddleware);

// Student submissions (specific route placed first to prevent wildcard overlap)
router.get('/student/submissions', roleMiddleware(['student']), assignmentController.getStudentSubmissions);

// Assignments CRUD
router.get('/', roleMiddleware(['super_admin', 'teacher', 'student']), assignmentController.getAllAssignments);
router.get('/:id', roleMiddleware(['super_admin', 'teacher', 'student']), assignmentController.getAssignmentById);
router.post('/', roleMiddleware(['super_admin', 'teacher']), uploadMiddleware.single('attachment'), assignmentController.createAssignment);
router.put('/:id', roleMiddleware(['super_admin', 'teacher']), uploadMiddleware.single('attachment'), assignmentController.updateAssignment);
router.delete('/:id', roleMiddleware(['super_admin', 'teacher']), assignmentController.deleteAssignment);

// Submissions
router.post('/:id/submit', roleMiddleware(['student']), uploadMiddleware.single('file'), assignmentController.submitAssignment);
router.get('/:id/submissions', roleMiddleware(['super_admin', 'teacher']), assignmentController.getSubmissionsForAssignment);
router.put('/submissions/:submissionId/grade', roleMiddleware(['super_admin', 'teacher']), assignmentController.gradeSubmission);

module.exports = router;
