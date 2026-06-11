const dotenv = require('dotenv');
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/smartmed-nexus',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
  socket: {
    corsOrigin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
};

module.exports = config;
