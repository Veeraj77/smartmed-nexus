const Notification = require('../models/Notification');
const { AppError } = require('../middleware/errorHandler');

const getUserNotifications = async (userId, query = {}) => {
  const filter = { recipient: userId };
  if (query.unreadOnly === 'true') filter.isRead = false;

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 50;
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments({ recipient: userId }),
    Notification.countDocuments({ recipient: userId, isRead: false }),
  ]);

  return { notifications, total, unreadCount, page, totalPages: Math.ceil(total / limit) };
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
  if (!notification) throw new AppError('Notification not found', 404);
  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  return { message: 'All notifications marked as read' };
};

module.exports = { getUserNotifications, markAsRead, markAllAsRead };
