const doctorService = require('../services/doctorService');

const getAll = async (req, res, next) => {
  try {
    const result = await doctorService.getAllDoctors(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    res.status(200).json({ success: true, data: doctor });
  } catch (err) { next(err); }
};

const updateSchedule = async (req, res, next) => {
  try {
    const doctor = await doctorService.updateSchedule(req.user._id, req.body.availability);
    res.status(200).json({ success: true, data: doctor });
  } catch (err) { next(err); }
};

const getAppointments = async (req, res, next) => {
  try {
    const appointments = await doctorService.getDoctorAppointments(req.params.id, req.query);
    res.status(200).json({ success: true, data: appointments });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const doctor = await doctorService.createDoctor(req.body);
    res.status(201).json({ success: true, data: doctor });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, updateSchedule, getAppointments, create };
