const medicalRecordService = require('../services/medicalRecordService');

const getRecords = async (req, res, next) => {
  try {
    const records = await medicalRecordService.getPatientRecords(req.params.patientId);
    res.status(200).json({ success: true, data: records });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const record = await medicalRecordService.createRecord(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const record = await medicalRecordService.updateRecord(req.params.id, req.body);
    res.status(200).json({ success: true, data: record });
  } catch (err) { next(err); }
};

module.exports = { getRecords, create, update };
