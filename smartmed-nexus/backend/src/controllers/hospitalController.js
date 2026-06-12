const hospitalService = require('../services/hospitalService');

const getAll = async (req, res) => {
  try {
    const result = await hospitalService.getAllHospitals(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const hospital = await hospitalService.getHospitalById(req.params.id);
    res.status(200).json({ success: true, data: hospital });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const hospital = await hospitalService.createHospital(req.body);
    res.status(201).json({ success: true, data: hospital });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const hospital = await hospitalService.updateHospital(req.params.id, req.body);
    res.status(200).json({ success: true, data: hospital });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const hospital = await hospitalService.deleteHospital(req.params.id);
    res.status(200).json({ success: true, message: 'Hospital deactivated' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
