const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Event = sequelize.define('Event', {
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
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  event_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  organized_by: {
    type: DataTypes.ENUM('Internal', 'External'),
    allowNull: false,
    defaultValue: 'Internal'
  },
  organizer_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  place: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'events'
});

module.exports = Event;
