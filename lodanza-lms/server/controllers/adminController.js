const User = require('../models/User');
const Course = require('../models/Course');
const Department = require('../models/Department');
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');

const getDashboardStats = async (req, res) => {
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalTeachers = await User.countDocuments({ role: 'teacher' });
  const totalCourses = await Course.countDocuments({ isActive: true });
  const totalDepartments = await Department.countDocuments({ isActive: true });
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');
  res.json({ success: true, data: { totalStudents, totalTeachers, totalCourses, totalDepartments, recentUsers } });
};

const getAllStudents = async (req, res) => {
  const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, count: students.length, data: students });
};

const getAllTeachers = async (req, res) => {
  const teachers = await User.find({ role: 'teacher' }).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, count: teachers.length, data: teachers });
};

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });
  const user = await User.create({ name, email, password, role });
  res.status(201).json({ success: true, data: user });
};

const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, message: 'User deactivated' });
};

const getAllDepartments = async (req, res) => {
  const departments = await Department.find().populate('head', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, count: departments.length, data: departments });
};

const createDepartment = async (req, res) => {
  const department = await Department.create(req.body);
  res.status(201).json({ success: true, data: department });
};

const updateDepartment = async (req, res) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
  res.json({ success: true, data: department });
};

const deleteDepartment = async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Department deleted' });
};

const getAnalytics = async (req, res) => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const currentYear = new Date().getFullYear();
  const enrollmentByMonth = await Promise.all(
    months.map(async (month, i) => {
      const count = await User.countDocuments({
        role: 'student',
        createdAt: { $gte: new Date(currentYear, i, 1), $lt: new Date(currentYear, i + 1, 1) }
      });
      return { month, count };
    })
  );
  const coursesByDept = await Course.aggregate([
    { $group: { _id: '$department', count: { $sum: 1 } } },
    { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
    { $unwind: { path: '$dept', preserveNullAndEmptyArrays: true } },
    { $project: { name: { $ifNull: ['$dept.name', 'Unknown'] }, count: 1 } }
  ]);
  res.json({ success: true, data: { enrollmentByMonth, coursesByDept } });
};

const createAnnouncement = async (req, res) => {
  const announcement = await Announcement.create({ ...req.body, author: req.user._id });
  res.status(201).json({ success: true, data: announcement });
};

const getAllAnnouncements = async (req, res) => {
  const announcements = await Announcement.find({ isActive: true }).populate('author', 'name role').sort({ createdAt: -1 });
  res.json({ success: true, count: announcements.length, data: announcements });
};

module.exports = { getDashboardStats, getAllStudents, getAllTeachers, createUser, updateUser, deleteUser, getAllDepartments, createDepartment, updateDepartment, deleteDepartment, getAnalytics, createAnnouncement, getAllAnnouncements };
