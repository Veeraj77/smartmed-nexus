const EmergencyCase = require('../models/EmergencyCase');
const Notification = require('../models/Notification');
const Hospital = require('../models/Hospital');
const { AppError } = require('../middleware/errorHandler');
const { calculatePriority } = require('../ai/triageEngine');
const { emitToUser, emitToAll } = require('../sockets');

const createEmergencyRequest = async (patientId, data) => {
  const triageResult = calculatePriority(
    data.age,
    data.symptoms,
    data.medicalHistory,
    data.timeSensitivity || 'medium'
  );

  let assignedHospital = null;
  if (data.hospitalId) {
    assignedHospital = data.hospitalId;
  } else {
    const hospital = await Hospital.findOne({ isActive: true, availableBeds: { $gt: 0 } }).sort({ availableBeds: -1 });
    if (hospital) assignedHospital = hospital._id;
  }

  const emergency = await EmergencyCase.create({
    patient: patientId,
    hospital: assignedHospital,
    patientName: data.patientName,
    age: data.age,
    gender: data.gender,
    symptoms: data.symptoms,
    medicalHistory: data.medicalHistory,
    location: data.location,
    contactPhone: data.contactPhone,
    priority: triageResult.priority,
    aiScore: triageResult.score,
    timeSensitivity: data.timeSensitivity || 'medium',
    status: 'pending',
  });

  const populated = await EmergencyCase.findById(emergency._id).populate('hospital', 'name phone address');

  await Notification.create({
    recipient: patientId,
    type: 'emergency_alert',
    title: 'Emergency Request Submitted',
    message: `Your emergency request has been submitted. Priority: ${triageResult.priority.toUpperCase()}`,
    data: { emergencyId: emergency._id, priority: triageResult.priority, aiScore: triageResult.score },
  });

  emitToUser(patientId, 'emergency_created', populated);
  emitToAll('emergency_created', populated);

  return { emergency: populated, triage: triageResult };
};

const getAllEmergencies = async (query = {}) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.hospital) filter.hospital = query.hospital;

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [cases, total] = await Promise.all([
    EmergencyCase.find(filter)
      .populate('patient', 'name email phone')
      .populate('hospital', 'name phone address')
      .populate('assignedUnit', 'name')
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    EmergencyCase.countDocuments(filter),
  ]);

  return { cases, total, page, totalPages: Math.ceil(total / limit) };
};

const getEmergencyById = async (id) => {
  const emergency = await EmergencyCase.findById(id)
    .populate('patient', 'name email phone')
    .populate('hospital', 'name phone address')
    .populate('assignedUnit', 'name');
  if (!emergency) throw new AppError('Emergency case not found', 404);
  return emergency;
};

const assignAmbulance = async (emergencyId, ambulanceId, unitId) => {
  const emergency = await EmergencyCase.findById(emergencyId);
  if (!emergency) throw new AppError('Emergency case not found', 404);

  emergency.assignedAmbulance = ambulanceId;
  emergency.assignedUnit = unitId;
  emergency.status = 'dispatched';
  await emergency.save();

  const populated = await EmergencyCase.findById(emergency._id)
    .populate('patient', 'name email phone')
    .populate('hospital', 'name phone address')
    .populate('assignedUnit', 'name');

  await Notification.create({
    recipient: emergency.patient,
    type: 'emergency_assigned',
    title: 'Ambulance Dispatched',
    message: `Ambulance ${ambulanceId} has been dispatched to your location`,
    data: { emergencyId: emergency._id, ambulanceId },
  });

  emitToUser(emergency.patient.toString(), 'emergency_assigned', populated);
  emitToAll('emergency_assigned', populated);

  return populated;
};

const updateEmergencyStatus = async (emergencyId, status) => {
  const validStatuses = ['dispatched', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
  }

  const emergency = await EmergencyCase.findById(emergencyId);
  if (!emergency) throw new AppError('Emergency case not found', 404);

  emergency.status = status;
  if (status === 'completed') emergency.resolvedAt = new Date();
  await emergency.save();

  const populated = await EmergencyCase.findById(emergency._id)
    .populate('patient', 'name email phone')
    .populate('hospital', 'name phone address')
    .populate('assignedUnit', 'name');

  await Notification.create({
    recipient: emergency.patient,
    type: 'emergency_update',
    title: 'Emergency Status Updated',
    message: `Your emergency status has been updated to: ${status}`,
    data: { emergencyId: emergency._id, status },
  });

  emitToUser(emergency.patient.toString(), 'emergency_assigned', populated);
  emitToAll('emergency_assigned', populated);

  return populated;
};

module.exports = { createEmergencyRequest, getAllEmergencies, getEmergencyById, assignAmbulance, updateEmergencyStatus };
