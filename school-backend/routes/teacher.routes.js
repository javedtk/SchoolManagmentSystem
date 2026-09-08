const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

router.get('/', roleMiddleware(['super_admin', 'teacher', 'student']), teacherController.getAllTeachers);
router.get('/:id', roleMiddleware(['super_admin', 'teacher']), teacherController.getTeacherById);
router.post('/', roleMiddleware(['super_admin']), teacherController.createTeacher);
router.put('/:id', roleMiddleware(['super_admin']), teacherController.updateTeacher);
router.delete('/:id', roleMiddleware(['super_admin']), teacherController.deleteTeacher);

module.exports = router;
