const sequelize = require('../config/db.config');
const { DataTypes } = require('sequelize');

async function run() {
  const queryInterface = sequelize.getQueryInterface();
  try {
    console.log('Adding screenshot_url column to fee_payments table...');
    await queryInterface.addColumn('fee_payments', 'screenshot_url', {
      type: DataTypes.STRING,
      allowNull: true
    });
    console.log('Successfully added screenshot_url column.');
  } catch (error) {
    console.log('screenshot_url column might already exist:', error.message);
  }

  try {
    console.log('Adding verified column to fee_payments table...');
    await queryInterface.addColumn('fee_payments', 'verified', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
    console.log('Successfully added verified column.');
  } catch (error) {
    console.log('verified column might already exist:', error.message);
  }

  process.exit(0);
}

run();
