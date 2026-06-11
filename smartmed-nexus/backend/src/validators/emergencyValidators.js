const { body } = require('express-validator');

const emergencyRequestValidator = [
  body('patientName')
    .trim()
    .notEmpty().withMessage('Patient name is required'),
  body('age')
    .notEmpty().withMessage('Age is required')
    .isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150'),
  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('symptoms')
    .isArray({ min: 1 }).withMessage('At least one symptom is required'),
  body('symptoms.*')
    .trim()
    .notEmpty().withMessage('Symptom cannot be empty'),
  body('location.address')
    .trim()
    .notEmpty().withMessage('Location address is required'),
  body('contactPhone')
    .trim()
    .notEmpty().withMessage('Contact phone is required'),
];

module.exports = { emergencyRequestValidator };
