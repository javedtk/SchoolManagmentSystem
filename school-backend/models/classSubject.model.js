const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const ClassSubject = sequelize.define('ClassSubject', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'class_subjects'
});

module.exports = ClassSubject;
