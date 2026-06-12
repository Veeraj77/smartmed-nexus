const notificationService = require('../services/notificationService');

const getAll = async (req, res) => {
  try {
    const result = await notificationService.getUserNotifications(req.user._id, req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const markRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, markRead };
