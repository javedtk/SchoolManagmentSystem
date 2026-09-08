const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const FeePayment = sequelize.define('FeePayment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fee_structure_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount_paid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  payment_mode: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Online'
  },
  receipt_no: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('paid', 'partial', 'unpaid'),
    allowNull: false,
    defaultValue: 'paid'
  },
  screenshot_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'fee_payments'
});

module.exports = FeePayment;
