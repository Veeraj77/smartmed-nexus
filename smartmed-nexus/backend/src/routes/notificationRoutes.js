const router = require('express').Router();
const { getAll, markRead } = require('../controllers/notificationController');
const protect = require('../middleware/auth');

router.get('/', protect, getAll);
router.put('/:id/read', protect, markRead);

module.exports = router;
