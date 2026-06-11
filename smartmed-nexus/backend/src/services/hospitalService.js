const Hospital = require('../models/Hospital');
const { AppError } = require('../middleware/errorHandler');

const getAllHospitals = async (query = {}) => {
  const filter = { isActive: true };
  if (query.city) filter['address.city'] = { $regex: query.city, $options: 'i' };
  if (query.state) filter['address.state'] = { $regex: query.state, $options: 'i' };
  if (query.name) filter.name = { $regex: query.name, $options: 'i' };

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [hospitals, total] = await Promise.all([
    Hospital.find(filter).skip(skip).limit(limit).sort({ name: 1 }),
    Hospital.countDocuments(filter),
  ]);

  return { hospitals, total, page, totalPages: Math.ceil(total / limit) };
};

const getHospitalById = async (id) => {
  const hospital = await Hospital.findById(id);
  if (!hospital) throw new AppError('Hospital not found', 404);
  return hospital;
};

const createHospital = async (data) => {
  return Hospital.create(data);
};

const updateHospital = async (id, data) => {
  const hospital = await Hospital.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!hospital) throw new AppError('Hospital not found', 404);
  return hospital;
};

const deleteHospital = async (id) => {
  const hospital = await Hospital.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!hospital) throw new AppError('Hospital not found', 404);
  return hospital;
};

module.exports = { getAllHospitals, getHospitalById, createHospital, updateHospital, deleteHospital };
