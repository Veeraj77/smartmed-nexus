const { Server } = require('socket.io');
const config = require('../config/index');

let io;

const setupSocket = (server) => {
  io = new Server(server, {
    cors: { origin: config.socket.corsOrigin, credentials: true },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  const onlineDoctors = new Map();

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('doctor_online', (doctorId) => {
      socket.join(`doctor:${doctorId}`);
      onlineDoctors.set(doctorId, { socketId: socket.id, onlineAt: new Date() });
      io.emit('doctor_online', { doctorId, socketId: socket.id });
      io.emit('online_doctors', Array.from(onlineDoctors.keys()));
    });

    socket.on('doctor_offline', (doctorId) => {
      socket.leave(`doctor:${doctorId}`);
      onlineDoctors.delete(doctorId);
      io.emit('doctor_offline', { doctorId, socketId: socket.id });
      io.emit('online_doctors', Array.from(onlineDoctors.keys()));
    });

    socket.on('disconnect', () => {
      for (const [doctorId, data] of onlineDoctors.entries()) {
        if (data.socketId === socket.id) {
          onlineDoctors.delete(doctorId);
          io.emit('doctor_offline', { doctorId });
          io.emit('online_doctors', Array.from(onlineDoctors.keys()));
          break;
        }
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

const emitToUser = (userId, event, data) => {
  getIO().to(`user:${userId}`).emit(event, data);
};

const emitToDoctor = (doctorId, event, data) => {
  getIO().to(`doctor:${doctorId}`).emit(event, data);
};

const emitToAll = (event, data) => {
  getIO().emit(event, data);
};

module.exports = { setupSocket, getIO, emitToUser, emitToDoctor, emitToAll };
