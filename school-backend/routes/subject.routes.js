const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subject.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

router.get('/', subjectController.getAllSubjects);
router.get('/:id', subjectController.getSubjectById);
router.post('/', roleMiddleware(['super_admin']), subjectController.createSubject);
router.put('/:id', roleMiddleware(['super_admin']), subjectController.updateSubject);
router.delete('/:id', roleMiddleware(['super_admin']), subjectController.deleteSubject);

module.exports = router;
