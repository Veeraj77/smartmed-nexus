const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const Notification = require('../models/Notification');
const { AppError } = require('../middleware/errorHandler');
const { emitToUser, emitToDoctor } = require('../sockets');

const bookAppointment = async (patientId, data) => {
  const doctor = await Doctor.findById(data.doctor);
  if (!doctor) throw new AppError('Doctor not found', 404);
  if (!doctor.isAvailable) throw new AppError('Doctor is not available', 400);

  const hospital = await Hospital.findById(data.hospital);
  if (!hospital || !hospital.isActive) throw new AppError('Hospital not found or inactive', 404);

  const appointmentDate = new Date(data.appointmentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (appointmentDate < today) {
    throw new AppError('Cannot book appointment in the past', 400);
  }

  const dayOfWeek = appointmentDate.getDay();
  const slotAvailable = doctor.availability.some(
    (slot) => slot.dayOfWeek === dayOfWeek && slot.isAvailable
  );
  if (!slotAvailable) {
    throw new AppError('Doctor is not available on this day', 400);
  }

  const existingAppointment = await Appointment.findOne({
    doctor: data.doctor,
    appointmentDate: {
      $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
      $lte: new Date(appointmentDate.setHours(23, 59, 59, 999)),
    },
    timeSlot: data.timeSlot,
    status: { $nin: ['cancelled'] },
  });
  if (existingAppointment) {
    throw new AppError('This time slot is already booked. Please choose another.', 409);
  }

  const appointmentsToday = await Appointment.countDocuments({
    doctor: data.doctor,
    appointmentDate: {
      $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
      $lte: new Date(appointmentDate.setHours(23, 59, 59, 999)),
    },
    status: { $nin: ['cancelled'] },
  });
  if (appointmentsToday >= doctor.maxPatientsPerDay) {
    throw new AppError('Doctor has reached maximum appointments for this day', 400);
  }

  const appointment = await Appointment.create({
    patient: patientId,
    doctor: data.doctor,
    hospital: data.hospital,
    appointmentDate: data.appointmentDate,
    timeSlot: data.timeSlot,
    reason: data.reason,
    type: data.type || 'in-person',
  });

  const populated = await Appointment.findById(appointment._id)
    .populate('patient', 'name email phone')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name' },
    })
    .populate('hospital', 'name');

  await Notification.create({
    recipient: doctor.user,
    type: 'appointment_created',
    title: 'New Appointment',
    message: `New appointment booked by ${populated.patient.name} on ${data.appointmentDate}`,
    data: { appointmentId: appointment._id },
  });

  emitToUser(patientId, 'appointment_created', populated);
  emitToDoctor(doctor.user.toString(), 'appointment_created', populated);

  return populated;
};

const cancelAppointment = async (appointmentId, userId, reason) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new AppError('Appointment not found', 404);

  if (appointment.patient.toString() !== userId.toString()) {
    throw new AppError('Not authorized to cancel this appointment', 403);
  }

  if (['cancelled', 'completed'].includes(appointment.status)) {
    throw new AppError(`Appointment is already ${appointment.status}`, 400);
  }

  appointment.status = 'cancelled';
  appointment.cancellationReason = reason || 'Cancelled by patient';
  appointment.cancelledAt = new Date();
  await appointment.save();

  const populated = await Appointment.findById(appointment._id)
    .populate('patient', 'name email phone')
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
    .populate('hospital', 'name');

  const doctor = await Doctor.findById(appointment.doctor);
  if (doctor) {
    await Notification.create({
      recipient: doctor.user,
      type: 'appointment_cancelled',
      title: 'Appointment Cancelled',
      message: `Appointment on ${appointment.appointmentDate} has been cancelled`,
      data: { appointmentId: appointment._id },
    });
    emitToDoctor(doctor.user.toString(), 'appointment_updated', populated);
  }

  emitToUser(userId, 'appointment_updated', populated);

  return populated;
};

const updateAppointmentStatus = async (appointmentId, status, userId) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new AppError('Appointment not found', 404);

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  const validTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'no_show', 'cancelled'],
  };

  if (!validTransitions[appointment.status]?.includes(status)) {
    throw new AppError(`Cannot transition from ${appointment.status} to ${status}`, 400);
  }

  appointment.status = status;
  if (status === 'confirmed') appointment.confirmedAt = new Date();
  await appointment.save();

  const populated = await Appointment.findById(appointment._id)
    .populate('patient', 'name email phone')
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
    .populate('hospital', 'name');

  await Notification.create({
    recipient: appointment.patient,
    type: `appointment_${status}`,
    title: `Appointment ${status}`,
    message: `Your appointment on ${appointment.appointmentDate} has been ${status}`,
    data: { appointmentId: appointment._id, status },
  });

  emitToUser(appointment.patient.toString(), 'appointment_updated', populated);

  return populated;
};

const getUserAppointments = async (userId, query = {}) => {
  const filter = { patient: userId };
  if (query.status) filter.status = query.status;
  return Appointment.find(filter)
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
    .populate('hospital', 'name address')
    .sort({ appointmentDate: -1 });
};

module.exports = { bookAppointment, cancelAppointment, updateAppointmentStatus, getUserAppointments };
