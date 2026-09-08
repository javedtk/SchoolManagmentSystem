const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const FeeStructure = sequelize.define('FeeStructure', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  academic_year: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'fee_structures'
});

module.exports = FeeStructure;
