const appointmentService = require('../services/appointmentService');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const { validationResult } = require('express-validator');

const book = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array().map((e) => e.msg).join(', '), 400);
  }
  const appointment = await appointmentService.bookAppointment(req.user._id, req.body);
  res.status(201).json({ success: true, data: appointment });
});

const cancel = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.cancelAppointment(req.params.id, req.user._id, req.body.reason);
  res.status(200).json({ success: true, data: appointment });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) throw new AppError('Status is required', 400);
  const appointment = await appointmentService.updateAppointmentStatus(req.params.id, status, req.user._id);
  res.status(200).json({ success: true, data: appointment });
});

const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.getUserAppointments(req.user._id, req.query);
  res.status(200).json({ success: true, data: appointments });
});

module.exports = { book, cancel, updateStatus, getMyAppointments };
