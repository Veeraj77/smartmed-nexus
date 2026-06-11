const { body } = require('express-validator');

const bookAppointmentValidator = [
  body('doctor')
    .notEmpty().withMessage('Doctor ID is required')
    .isMongoId().withMessage('Invalid doctor ID'),
  body('hospital')
    .notEmpty().withMessage('Hospital ID is required')
    .isMongoId().withMessage('Invalid hospital ID'),
  body('appointmentDate')
    .notEmpty().withMessage('Appointment date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('timeSlot')
    .notEmpty().withMessage('Time slot is required')
    .matches(/^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/).withMessage('Time slot must be in format HH:MM - HH:MM'),
  body('reason')
    .trim()
    .notEmpty().withMessage('Reason is required')
    .isLength({ max: 500 }).withMessage('Reason too long'),
  body('type')
    .optional()
    .isIn(['in-person', 'video']).withMessage('Type must be in-person or video'),
];

module.exports = { bookAppointmentValidator };
