const notificationService = require('../services/notificationService');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const result = await notificationService.getUserNotifications(req.user._id, req.query);
  res.status(200).json({ success: true, data: result });
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user._id);
  res.status(200).json({ success: true, data: notification });
});

module.exports = { getAll, markRead };
