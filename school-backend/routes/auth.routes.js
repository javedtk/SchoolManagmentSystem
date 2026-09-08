const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

// Public route
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, uploadMiddleware.single('profile_image'), authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
