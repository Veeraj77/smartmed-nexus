const emergencyService = require('../services/emergencyService');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const { validationResult } = require('express-validator');

const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array().map((e) => e.msg).join(', '), 400);
  }
  const result = await emergencyService.createEmergencyRequest(req.user._id, req.body);
  res.status(201).json({ success: true, data: result });
});

const getAll = asyncHandler(async (req, res) => {
  const result = await emergencyService.getAllEmergencies(req.query);
  res.status(200).json({ success: true, data: result });
});

const getById = asyncHandler(async (req, res) => {
  const emergency = await emergencyService.getEmergencyById(req.params.id);
  res.status(200).json({ success: true, data: emergency });
});

const assign = asyncHandler(async (req, res) => {
  const { ambulanceId } = req.body;
  if (!ambulanceId) throw new AppError('Ambulance ID is required', 400);
  const emergency = await emergencyService.assignAmbulance(req.params.id, ambulanceId, req.user._id);
  res.status(200).json({ success: true, data: emergency });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) throw new AppError('Status is required', 400);
  const emergency = await emergencyService.updateEmergencyStatus(req.params.id, status);
  res.status(200).json({ success: true, data: emergency });
});

module.exports = { create, getAll, getById, assign, updateStatus };
