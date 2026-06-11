const hospitalService = require('../services/hospitalService');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const result = await hospitalService.getAllHospitals(req.query);
  res.status(200).json({ success: true, data: result });
});

const getById = asyncHandler(async (req, res) => {
  const hospital = await hospitalService.getHospitalById(req.params.id);
  res.status(200).json({ success: true, data: hospital });
});

const create = asyncHandler(async (req, res) => {
  const hospital = await hospitalService.createHospital(req.body);
  res.status(201).json({ success: true, data: hospital });
});

const update = asyncHandler(async (req, res) => {
  const hospital = await hospitalService.updateHospital(req.params.id, req.body);
  res.status(200).json({ success: true, data: hospital });
});

const remove = asyncHandler(async (req, res) => {
  const hospital = await hospitalService.deleteHospital(req.params.id);
  res.status(200).json({ success: true, message: 'Hospital deactivated' });
});

module.exports = { getAll, getById, create, update, remove };
