const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

router.use(authMiddleware);

// Album management
router.get('/albums', galleryController.getAllAlbums);
router.get('/albums/:id', galleryController.getAlbumById);
router.post('/albums', roleMiddleware(['super_admin', 'teacher']), uploadMiddleware.single('cover_image'), galleryController.createAlbum);
router.put('/albums/:id', roleMiddleware(['super_admin', 'teacher']), uploadMiddleware.single('cover_image'), galleryController.updateAlbum);
router.delete('/albums/:id', roleMiddleware(['super_admin']), galleryController.deleteAlbum);

// Media management
router.post('/albums/:albumId/media', roleMiddleware(['super_admin', 'teacher']), uploadMiddleware.single('file'), galleryController.addMediaToAlbum);
router.delete('/media/:mediaId', roleMiddleware(['super_admin', 'teacher']), galleryController.deleteMediaItem);

module.exports = router;
