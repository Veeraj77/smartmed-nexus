const appointmentService = require('../services/appointmentService');
const { validationResult } = require('express-validator');

const book = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array().map((e) => e.msg).join(', ') });
    }
    const appointment = await appointmentService.bookAppointment(req.user._id, req.body);
    res.status(201).json({ success: true, data: appointment });
  } catch (err) { next(err); }
};

const cancel = async (req, res, next) => {
  try {
    const appointment = await appointmentService.cancelAppointment(req.params.id, req.user._id, req.body.reason);
    res.status(200).json({ success: true, data: appointment });
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'Status is required' });
    const appointment = await appointmentService.updateAppointmentStatus(req.params.id, status, req.user._id);
    res.status(200).json({ success: true, data: appointment });
  } catch (err) { next(err); }
};

const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getUserAppointments(req.user._id, req.query);
    res.status(200).json({ success: true, data: appointments });
  } catch (err) { next(err); }
};

module.exports = { book, cancel, updateStatus, getMyAppointments };
