const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  student_name: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'achievements'
});

module.exports = Achievement;
