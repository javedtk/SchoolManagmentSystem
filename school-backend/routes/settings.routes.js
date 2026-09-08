const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);
router.use(roleMiddleware(['super_admin']));

router.get('/', settingsController.getAllSettings);
router.put('/', settingsController.updateSettings);

module.exports = router;
