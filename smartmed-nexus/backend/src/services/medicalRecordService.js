const MedicalRecord = require('../models/MedicalRecord');
const { AppError } = require('../middleware/errorHandler');

const getPatientRecords = async (patientId) => {
  return MedicalRecord.find({ patient: patientId, isActive: true })
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
    .populate('hospital', 'name')
    .populate('appointment', 'appointmentDate timeSlot')
    .sort({ createdAt: -1 });
};

const createRecord = async (data) => {
  return MedicalRecord.create(data);
};

const updateRecord = async (id, data) => {
  const record = await MedicalRecord.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!record) throw new AppError('Medical record not found', 404);
  return record;
};

module.exports = { getPatientRecords, createRecord, updateRecord };
