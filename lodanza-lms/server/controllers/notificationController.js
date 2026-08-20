const Notification = require('../models/Notification');

const getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(20);
  res.json({ success: true, count: notifications.length, data: notifications });
};

const markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true, message: 'Marked as read' });
};

const markAllAsRead = async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
  res.json({ success: true, message: 'All marked as read' });
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead };
