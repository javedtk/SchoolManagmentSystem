const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

router.use(authMiddleware);

// Only admins can manipulate student profiles
router.get('/', roleMiddleware(['super_admin', 'teacher']), studentController.getAllStudents);
router.get('/:id', roleMiddleware(['super_admin', 'teacher']), studentController.getStudentById);
router.post('/', roleMiddleware(['super_admin']), uploadMiddleware.single('student_photo'), studentController.createStudent);
router.put('/:id', roleMiddleware(['super_admin']), uploadMiddleware.single('student_photo'), studentController.updateStudent);
router.delete('/:id', roleMiddleware(['super_admin']), studentController.deleteStudent);

module.exports = router;
