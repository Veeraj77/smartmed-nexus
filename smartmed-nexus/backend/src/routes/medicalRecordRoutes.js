const router = require('express').Router();
const { getRecords, create, update } = require('../controllers/medicalRecordController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/patient/:patientId', protect, authorize('doctor', 'admin', 'patient'), getRecords);
router.post('/', protect, authorize('doctor'), create);
router.put('/:id', protect, authorize('doctor'), update);

module.exports = router;
