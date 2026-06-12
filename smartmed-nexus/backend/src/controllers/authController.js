const { validationResult } = require('express-validator');
const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array().map((e) => e.msg).join(', ') });
    }
    const { user, token } = await authService.registerUser(req.body);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array().map((e) => e.msg).join(', ') });
    }
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    res.status(200).json({ success: true, data: { user, token } });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Login failed' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Get user failed' });
  }
};

module.exports = { register, login, getMe };
