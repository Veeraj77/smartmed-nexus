const router = require('express').Router();
const { getAll, getById, updateSchedule, getAppointments, create } = require('../controllers/doctorController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/', getAll);
router.get('/:id', getById);
router.put('/schedule', protect, authorize('doctor'), updateSchedule);
router.get('/:id/appointments', protect, authorize('doctor', 'admin'), getAppointments);
router.post('/', protect, authorize('admin'), create);

module.exports = router;
