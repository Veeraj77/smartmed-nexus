const mongoose = require('mongoose');
const config = require('../src/config/index');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(config.mongodb.uri).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const app = require('../src/app');

module.exports = async (req, res) => {
  await connectDB();
  app(req, res);
};
