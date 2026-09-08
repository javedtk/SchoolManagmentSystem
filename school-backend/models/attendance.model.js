const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'leave'),
    allowNull: false
  },
  marked_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'attendances'
});

module.exports = Attendance;
