const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
  {
    medication: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    notes: { type: String },
  },
  { _id: false }
);

const medicalRecordSchema = new mongoose.Schema(
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
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
      trim: true,
    },
    symptoms: [{ type: String, trim: true }],
    prescriptions: [prescriptionSchema],
    testResults: [
      {
        testName: { type: String, required: true },
        result: { type: String, required: true },
        date: { type: Date, default: Date.now },
        notes: { type: String },
      },
    ],
    notes: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

medicalRecordSchema.index({ patient: 1 });
medicalRecordSchema.index({ doctor: 1 });
medicalRecordSchema.index({ hospital: 1 });
medicalRecordSchema.index({ patient: 1, createdAt: -1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
