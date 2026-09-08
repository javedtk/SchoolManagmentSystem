const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  admission_no: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  section: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  parent_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  parent_contact: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  transport_mode: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'students'
});

module.exports = Student;
