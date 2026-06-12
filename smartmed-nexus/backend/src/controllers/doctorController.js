const doctorService = require('../services/doctorService');

const getAll = async (req, res) => {
  try {
    const result = await doctorService.getAllDoctors(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const doctor = await doctorService.updateSchedule(req.user._id, req.body.availability);
    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await doctorService.getDoctorAppointments(req.params.id, req.query);
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const doctor = await doctorService.createDoctor(req.body);
    res.status(201).json({ success: true, data: doctor });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getById, updateSchedule, getAppointments, create };
