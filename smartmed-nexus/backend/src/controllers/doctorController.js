const doctorService = require('../services/doctorService');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const result = await doctorService.getAllDoctors(req.query);
  res.status(200).json({ success: true, data: result });
});

const getById = asyncHandler(async (req, res) => {
  const doctor = await doctorService.getDoctorById(req.params.id);
  res.status(200).json({ success: true, data: doctor });
});

const updateSchedule = asyncHandler(async (req, res) => {
  const doctor = await doctorService.updateSchedule(req.user._id, req.body.availability);
  res.status(200).json({ success: true, data: doctor });
});

const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await doctorService.getDoctorAppointments(req.params.id, req.query);
  res.status(200).json({ success: true, data: appointments });
});

const create = asyncHandler(async (req, res) => {
  const doctor = await doctorService.createDoctor(req.body);
  res.status(201).json({ success: true, data: doctor });
});

module.exports = { getAll, getById, updateSchedule, getAppointments, create };
