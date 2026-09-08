const http = require('http');
const app = require('./app');
const db = require('./models');   // changed
const sequelize = db.sequelize;   // changed
const env = require('./config/env');
const socketService = require('./services/socket.service');

const PORT = env.port || 5000;

const server = http.createServer(app);
socketService.initSocket(server);

// Connect to Database and start Server
async function startServer() {
  try {
    console.log('Connecting to MySQL Database...');

    await sequelize.authenticate();
    console.log('MySQL Database connection established successfully.');

    // Create missing tables from Sequelize models
    await sequelize.sync();
    console.log('Database tables synchronized successfully.');

    server.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`  School Management System Backend API server  `);
      console.log(`  Running on port: ${PORT}                     `);
      console.log(`  Health check: http://localhost:${PORT}/health`);
      console.log(`===============================================`);
    });

  } catch (error) {
    console.error(
      'Unable to start the server due to database error:',
      error
    );
    process.exit(1);
  }
}

startServer();