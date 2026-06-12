const notificationService = require('../services/notificationService');

const getAll = async (req, res, next) => {
  try {
    const result = await notificationService.getUserNotifications(req.user._id, req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
};

const markRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: notification });
  } catch (err) { next(err); }
};

module.exports = { getAll, markRead };
