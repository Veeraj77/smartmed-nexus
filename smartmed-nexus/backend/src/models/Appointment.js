const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
      default: 'pending',
    },
    reason: {
      type: String,
      required: [true, 'Reason for appointment is required'],
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: ['in-person', 'video'],
      default: 'in-person',
    },
    cancellationReason: { type: String, trim: true },
    cancelledAt: { type: Date },
    confirmedAt: { type: Date },
  },
  { timestamps: true }
);

appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ hospital: 1, status: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
