const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });
  const user = await User.create({ name, email, password, role: role || 'student' });
  res.status(201).json({
    success: true,
    data: { _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  if (!user.isActive) return res.status(401).json({ success: false, message: 'Account deactivated' });
  res.json({
    success: true,
    data: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, token: generateToken(user._id) }
  });
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({ success: true, data: user });
};

const updateProfile = async (req, res) => {
  const { name, phone, address } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, phone, address }, { new: true, runValidators: true }).select('-password');
  res.json({ success: true, data: user });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!(await user.matchPassword(currentPassword))) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated successfully' });
};

module.exports = { register, login, getMe, updateProfile, changePassword };
