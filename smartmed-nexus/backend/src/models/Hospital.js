const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
      unique: true,
      maxlength: [200, 'Hospital name cannot exceed 200 characters'],
    },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      zip: { type: String, required: true, trim: true },
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    emergencyContact: {
      type: String,
      trim: true,
    },
    departments: [
      {
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
      },
    ],
    totalBeds: { type: Number, default: 0 },
    availableBeds: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

hospitalSchema.index({ name: 1 });
hospitalSchema.index({ 'address.city': 1 });
hospitalSchema.index({ isActive: 1 });

module.exports = mongoose.model('Hospital', hospitalSchema);
