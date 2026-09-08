const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Result = sequelize.define('Result', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  exam_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  marks_obtained: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  max_marks: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 100.00
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'results'
});

module.exports = Result;
