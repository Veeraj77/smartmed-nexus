const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

const getAllDoctors = async (query = {}) => {
  const filter = {};
  if (query.hospital) filter.hospital = query.hospital;
  if (query.specialization) filter.specialization = { $regex: query.specialization, $options: 'i' };
  if (query.isAvailable !== undefined) filter.isAvailable = query.isAvailable === 'true';

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [doctors, total] = await Promise.all([
    Doctor.find(filter).populate('user', 'name email phone').populate('hospital', 'name address').skip(skip).limit(limit).sort({ rating: -1 }),
    Doctor.countDocuments(filter),
  ]);

  return { doctors, total, page, totalPages: Math.ceil(total / limit) };
};

const getDoctorById = async (id) => {
  const doctor = await Doctor.findById(id).populate('user', 'name email phone photo').populate('hospital', 'name address city');
  if (!doctor) throw new AppError('Doctor not found', 404);
  return doctor;
};

const updateSchedule = async (doctorId, availability) => {
  const doctor = await Doctor.findOne({ user: doctorId });
  if (!doctor) throw new AppError('Doctor profile not found', 404);
  doctor.availability = availability;
  await doctor.save();
  return doctor;
};

const getDoctorAppointments = async (doctorId, query = {}) => {
  const Appointment = require('../models/Appointment');
  const filter = { doctor: doctorId };
  if (query.status) filter.status = query.status;
  if (query.date) {
    const start = new Date(query.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(query.date);
    end.setHours(23, 59, 59, 999);
    filter.appointmentDate = { $gte: start, $lte: end };
  }

  return Appointment.find(filter).populate('patient', 'name email phone').populate('hospital', 'name').sort({ appointmentDate: -1 });
};

const createDoctor = async (data) => {
  const userExists = await User.findById(data.user);
  if (!userExists) throw new AppError('User not found', 404);
  const existing = await Doctor.findOne({ user: data.user });
  if (existing) throw new AppError('Doctor profile already exists for this user', 400);
  return Doctor.create(data);
};

module.exports = { getAllDoctors, getDoctorById, updateSchedule, getDoctorAppointments, createDoctor };
