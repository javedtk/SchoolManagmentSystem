const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  applicant_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cover_letter: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('applied', 'reviewed', 'shortlisted', 'rejected', 'hired'),
    defaultValue: 'applied'
  },
  applied_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'job_applications'
});

module.exports = JobApplication;
