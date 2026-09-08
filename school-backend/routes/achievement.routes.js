const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievement.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

router.use(authMiddleware);

router.get('/', achievementController.getAllAchievements);
router.get('/:id', achievementController.getAchievementById);
router.post('/', roleMiddleware(['super_admin']), uploadMiddleware.single('image'), achievementController.createAchievement);
router.put('/:id', roleMiddleware(['super_admin']), uploadMiddleware.single('image'), achievementController.updateAchievement);
router.delete('/:id', roleMiddleware(['super_admin']), achievementController.deleteAchievement);

module.exports = router;
