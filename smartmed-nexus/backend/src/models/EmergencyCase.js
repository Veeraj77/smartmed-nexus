const mongoose = require('mongoose');

const emergencyCaseSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
    },
    assignedAmbulance: { type: String, trim: true },
    assignedUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age must be positive'],
      max: [150, 'Age must be realistic'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    symptoms: {
      type: [String],
      required: [true, 'At least one symptom is required'],
      validate: {
        validator: (v) => v.length > 0,
        message: 'At least one symptom is required',
      },
    },
    medicalHistory: {
      type: String,
      trim: true,
    },
    location: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    aiScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'dispatched', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    timeSensitivity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

emergencyCaseSchema.index({ patient: 1 });
emergencyCaseSchema.index({ hospital: 1 });
emergencyCaseSchema.index({ status: 1 });
emergencyCaseSchema.index({ priority: 1 });
emergencyCaseSchema.index({ status: 1, priority: -1, createdAt: -1 });

module.exports = mongoose.model('EmergencyCase', emergencyCaseSchema);
