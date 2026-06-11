const medicalRecordService = require('../services/medicalRecordService');
const asyncHandler = require('../utils/asyncHandler');

const getRecords = asyncHandler(async (req, res) => {
  const records = await medicalRecordService.getPatientRecords(req.params.patientId);
  res.status(200).json({ success: true, data: records });
});

const create = asyncHandler(async (req, res) => {
  const record = await medicalRecordService.createRecord(req.body);
  res.status(201).json({ success: true, data: record });
});

const update = asyncHandler(async (req, res) => {
  const record = await medicalRecordService.updateRecord(req.params.id, req.body);
  res.status(200).json({ success: true, data: record });
});

module.exports = { getRecords, create, update };
