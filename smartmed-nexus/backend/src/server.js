const app = require('./app');
const config = require('./config/index');
const connectDB = require('./config/db');
const { setupSocket } = require('./sockets');

const startServer = async () => {
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`SmartMed Nexus server running on port ${config.port} in ${config.env} mode`);
  });

  setupSocket(server);

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
  });
};

startServer();
