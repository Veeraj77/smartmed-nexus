const medicalRecordService = require('../services/medicalRecordService');

const getRecords = async (req, res) => {
  try {
    const records = await medicalRecordService.getPatientRecords(req.params.patientId);
    res.status(200).json({ success: true, data: records });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const record = await medicalRecordService.createRecord(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const record = await medicalRecordService.updateRecord(req.params.id, req.body);
    res.status(200).json({ success: true, data: record });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = { getRecords, create, update };
