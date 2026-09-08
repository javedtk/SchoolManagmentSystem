const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cms.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

router.use(authMiddleware);
router.use(roleMiddleware(['super_admin']));

router.get('/', cmsController.getAllCmsPages);
router.get('/:pageKey', cmsController.getCmsPageByKey);
router.put('/:pageKey', uploadMiddleware.single('image'), cmsController.createOrUpdateCmsPage);

module.exports = router;
