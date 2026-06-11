const router = require('express').Router();
const { book, cancel, updateStatus, getMyAppointments } = require('../controllers/appointmentController');
const { bookAppointmentValidator } = require('../validators/appointmentValidators');
const validate = require('../middleware/validate');
const protect = require('../middleware/auth');
const authorize = require('../middleware/role');

router.post('/', protect, authorize('patient'), bookAppointmentValidator, validate, book);
router.get('/', protect, authorize('patient', 'admin'), getMyAppointments);
router.put('/:id/cancel', protect, authorize('patient'), cancel);
router.put('/:id/status', protect, authorize('doctor'), updateStatus);

module.exports = router;
