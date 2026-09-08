const sequelize = require('../config/db.config');
const { DataTypes } = require('sequelize');

async function run() {
  const queryInterface = sequelize.getQueryInterface();
  try {
    console.log('Adding student_photo column to admissions table...');
    await queryInterface.addColumn('admissions', 'student_photo', {
      type: DataTypes.STRING,
      allowNull: true
    });
    console.log('Successfully added student_photo column.');
  } catch (error) {
    console.log('Column might already exist or table doesn\'t exist:', error.message);
  }
  process.exit(0);
}

run();
