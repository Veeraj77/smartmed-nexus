const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodb.uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB runtime error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
};

module.exports = connectDB;
