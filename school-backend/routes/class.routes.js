const express = require('express');
const router = express.Router();
const classController = require('../controllers/class.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

router.get('/', classController.getAllClasses);
router.get('/:id', classController.getClassById);
router.post('/', roleMiddleware(['super_admin']), classController.createClass);
router.put('/:id', roleMiddleware(['super_admin']), classController.updateClass);
router.delete('/:id', roleMiddleware(['super_admin']), classController.deleteClass);

module.exports = router;
