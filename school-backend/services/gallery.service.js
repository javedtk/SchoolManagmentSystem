const { GalleryAlbum, GalleryMedia } = require('../models');

// Albums
const getAllAlbums = async () => {
  return GalleryAlbum.findAll({
    include: [{ model: GalleryMedia, limit: 1 }]
  });
};

const getAlbumById = async (id) => {
  const album = await GalleryAlbum.findByPk(id, {
    include: [{ model: GalleryMedia }]
  });
  if (!album) {
    throw { status: 404, message: 'Album not found.' };
  }
  return album;
};

const createAlbum = async (albumData) => {
  return GalleryAlbum.create(albumData);
};

const updateAlbum = async (id, updateData) => {
  const album = await GalleryAlbum.findByPk(id);
  if (!album) {
    throw { status: 404, message: 'Album not found.' };
  }
  return album.update(updateData);
};

const deleteAlbum = async (id) => {
  const album = await GalleryAlbum.findByPk(id);
  if (!album) {
    throw { status: 404, message: 'Album not found.' };
  }
  await album.destroy();
  return { message: 'Album and all media deleted successfully.' };
};

// Media Items
const addMediaToAlbum = async (mediaData) => {
  return GalleryMedia.create(mediaData);
};

const deleteMediaItem = async (mediaId) => {
  const media = await GalleryMedia.findByPk(mediaId);
  if (!media) {
    throw { status: 404, message: 'Media item not found.' };
  }
  await media.destroy();
  return { message: 'Media item deleted successfully.' };
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
