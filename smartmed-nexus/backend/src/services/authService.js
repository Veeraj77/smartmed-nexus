const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/index');
const { AppError } = require('../middleware/errorHandler');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  const user = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'patient',
    phone: userData.phone,
    address: userData.address,
    dateOfBirth: userData.dateOfBirth,
    bloodGroup: userData.bloodGroup,
  });

  const token = generateToken(user._id);
  return { user, token };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account deactivated. Contact support.', 401);
  }

  const token = generateToken(user._id);
  return { user, token };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

module.exports = { registerUser, loginUser, getCurrentUser };
