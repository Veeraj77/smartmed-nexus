const emergencyService = require('../services/emergencyService');
const { validationResult } = require('express-validator');

const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array().map((e) => e.msg).join(', ') });
    }
    const result = await emergencyService.createEmergencyRequest(req.user._id, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const result = await emergencyService.getAllEmergencies(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const emergency = await emergencyService.getEmergencyById(req.params.id);
    res.status(200).json({ success: true, data: emergency });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const assign = async (req, res) => {
  try {
    const { ambulanceId } = req.body;
    if (!ambulanceId) return res.status(400).json({ success: false, message: 'Ambulance ID is required' });
    const emergency = await emergencyService.assignAmbulance(req.params.id, ambulanceId, req.user._id);
    res.status(200).json({ success: true, data: emergency });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'Status is required' });
    const emergency = await emergencyService.updateEmergencyStatus(req.params.id, status);
    res.status(200).json({ success: true, data: emergency });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = { create, getAll, getById, assign, updateStatus };
