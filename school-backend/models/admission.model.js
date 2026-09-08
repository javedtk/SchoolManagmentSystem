const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Admission = sequelize.define('Admission', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  parent_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  class_applied: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  applied_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  transport_mode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  student_photo: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'admissions'
});

module.exports = Admission;
