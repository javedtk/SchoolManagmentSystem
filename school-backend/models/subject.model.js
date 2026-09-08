const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'subjects'
});

module.exports = Subject;
