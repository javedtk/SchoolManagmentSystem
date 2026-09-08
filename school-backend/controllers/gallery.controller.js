const galleryService = require('../services/gallery.service');

// Albums
const getAllAlbums = async (req, res, next) => {
  try {
    const list = await galleryService.getAllAlbums();
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

const getAlbumById = async (req, res, next) => {
  try {
    const album = await galleryService.getAlbumById(req.params.id);
    return res.status(200).json(album);
  } catch (error) {
    next(error);
  }
};

const createAlbum = async (req, res, next) => {
  try {
    const albumData = req.body;
    if (req.file) {
      albumData.cover_image = `uploads/images/${req.file.filename}`;
    }
    const album = await galleryService.createAlbum(albumData);
    return res.status(201).json(album);
  } catch (error) {
    next(error);
  }
};

const updateAlbum = async (req, res, next) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.cover_image = `uploads/images/${req.file.filename}`;
    }
    const album = await galleryService.updateAlbum(req.params.id, updateData);
    return res.status(200).json(album);
  } catch (error) {
    next(error);
  }
};

const deleteAlbum = async (req, res, next) => {
  try {
    const result = await galleryService.deleteAlbum(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Media
const addMediaToAlbum = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Media file is required.' });
    }
    
    const mediaData = {
      album_id: req.body.album_id || req.params.albumId,
      file_url: `uploads/images/${req.file.filename}`, // fits both images and video if needed, or upload dir checks
      type: req.body.type || 'image',
      caption: req.body.caption
    };

    const media = await galleryService.addMediaToAlbum(mediaData);
    return res.status(201).json(media);
  } catch (error) {
    next(error);
  }
};

const deleteMediaItem = async (req, res, next) => {
  try {
    const result = await galleryService.deleteMediaItem(req.params.mediaId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addMediaToAlbum,
  deleteMediaItem
};
