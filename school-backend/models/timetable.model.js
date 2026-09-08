const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Timetable = sequelize.define('Timetable', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  day: {
    type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    allowNull: false
  },
  period_no: {
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
  },
  start_time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  end_time: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'timetables'
});

module.exports = Timetable;
