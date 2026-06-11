const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');

const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array().map((e) => e.msg).join(', '), 400);
  }

  const { user, token } = await authService.registerUser(req.body);
  res.status(201).json({ success: true, data: { user, token } });
});

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array().map((e) => e.msg).join(', '), 400);
  }

  const { email, password } = req.body;
  const { user, token } = await authService.loginUser(email, password);
  res.status(200).json({ success: true, data: { user, token } });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);
  res.status(200).json({ success: true, data: user });
});

module.exports = { register, login, getMe };
