const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const GalleryAlbum = sequelize.define('GalleryAlbum', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cover_image: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'gallery_albums'
});

module.exports = GalleryAlbum;
