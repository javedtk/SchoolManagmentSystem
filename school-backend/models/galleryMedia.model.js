const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const GalleryMedia = sequelize.define('GalleryMedia', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  album_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('image', 'video'),
    defaultValue: 'image'
  },
  caption: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'gallery_media'
});

module.exports = GalleryMedia;
