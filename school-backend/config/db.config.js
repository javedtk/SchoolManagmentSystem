const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(
  env.db.name,
  env.db.username,
  env.db.password,
  {
    host: env.db.host,
    port: env.db.port,
    dialect: env.db.dialect,
    logging: false, // Set to console.log for query debugging if needed
    define: {
      timestamps: true,
      underscored: true // converts camelCase to snake_case in tables
    }
  }
);

module.exports = sequelize;
