const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: Number,
      required: true,
      enum: [0, 1, 2, 3, 4, 5, 6],
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    qualifications: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        year: { type: Number },
      },
    ],
    experienceYears: { type: Number, default: 0 },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
    },
    consultationFee: { type: Number, required: true, min: 0 },
    availability: [availabilitySlotSchema],
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    maxPatientsPerDay: { type: Number, default: 20 },
  },
  { timestamps: true }
);

doctorSchema.index({ user: 1 });
doctorSchema.index({ hospital: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);
