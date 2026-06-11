const router = require('express').Router();
const { getAll, getById, create, update, remove } = require('../controllers/hospitalController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', protect, authorize('admin'), create);
router.put('/:id', protect, authorize('admin'), update);
router.delete('/:id', protect, authorize('admin'), remove);

module.exports = router;
