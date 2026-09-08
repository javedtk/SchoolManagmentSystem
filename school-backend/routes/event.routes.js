const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

router.use(authMiddleware);

// Admin controls
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', roleMiddleware(['super_admin', 'teacher']), uploadMiddleware.single('image'), eventController.createEvent);
router.put('/:id', roleMiddleware(['super_admin', 'teacher']), uploadMiddleware.single('image'), eventController.updateEvent);
router.delete('/:id', roleMiddleware(['super_admin']), eventController.deleteEvent);

module.exports = router;
