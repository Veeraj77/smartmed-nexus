const hospitalService = require('../services/hospitalService');

const getAll = async (req, res, next) => {
  try {
    const result = await hospitalService.getAllHospitals(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const hospital = await hospitalService.getHospitalById(req.params.id);
    res.status(200).json({ success: true, data: hospital });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const hospital = await hospitalService.createHospital(req.body);
    res.status(201).json({ success: true, data: hospital });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const hospital = await hospitalService.updateHospital(req.params.id, req.body);
    res.status(200).json({ success: true, data: hospital });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const hospital = await hospitalService.deleteHospital(req.params.id);
    res.status(200).json({ success: true, message: 'Hospital deactivated' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
