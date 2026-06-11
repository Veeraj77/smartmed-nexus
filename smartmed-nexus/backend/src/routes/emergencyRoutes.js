const router = require('express').Router();
const { create, getAll, getById, assign, updateStatus } = require('../controllers/emergencyController');
const { emergencyRequestValidator } = require('../validators/emergencyValidators');
const validate = require('../middleware/validate');
const protect = require('../middleware/auth');
const authorize = require('../middleware/role');

router.post('/', protect, authorize('patient'), emergencyRequestValidator, validate, create);
router.get('/', protect, authorize('admin', 'emergency_unit', 'doctor'), getAll);
router.get('/:id', protect, getById);
router.put('/:id/assign', protect, authorize('emergency_unit', 'admin'), assign);
router.put('/:id/status', protect, authorize('emergency_unit', 'admin'), updateStatus);

module.exports = router;
