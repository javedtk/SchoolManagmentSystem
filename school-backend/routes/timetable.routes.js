const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetable.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

// Get class timetable (accessible to all)
router.get('/class/:classId', timetableController.getTimetableByClass);

// Get teacher timetable (accessible to all)
router.get('/teacher', timetableController.getTimetableByTeacher);
router.get('/teacher/:teacherId', roleMiddleware(['super_admin']), timetableController.getTimetableByTeacher);

// Timetable entry CRUD (Admin only)
router.post('/', roleMiddleware(['super_admin']), timetableController.createTimetableEntry);
router.put('/teacher/:teacherId', roleMiddleware(['super_admin']), timetableController.updateTeacherTimetable);
router.put('/:id', roleMiddleware(['super_admin']), timetableController.updateTimetableEntry);
router.delete('/:id', roleMiddleware(['super_admin']), timetableController.deleteTimetableEntry);

module.exports = router;
