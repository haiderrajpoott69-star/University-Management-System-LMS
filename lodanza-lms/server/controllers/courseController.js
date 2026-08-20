const Course = require('../models/Course');
const User = require('../models/User');

const getAllCourses = async (req, res) => {
  const courses = await Course.find({ isActive: true })
    .populate('department', 'name code')
    .populate('teacher', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: courses.length, data: courses });
};

const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('department', 'name code')
    .populate('teacher', 'name email')
    .populate('students', 'name email');
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  res.json({ success: true, data: course });
};

const createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json({ success: true, data: course });
};

const updateCourse = async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  res.json({ success: true, data: course });
};

const deleteCourse = async (req, res) => {
  await Course.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Course deactivated' });
};

const enrollStudent = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  if (course.students.includes(req.user._id)) {
    return res.status(400).json({ success: false, message: 'Already enrolled' });
  }
  course.students.push(req.user._id);
  await course.save();
  res.json({ success: true, message: 'Enrolled successfully', data: course });
};

const unenrollStudent = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  course.students = course.students.filter(s => s.toString() !== req.user._id.toString());
  await course.save();
  res.json({ success: true, message: 'Unenrolled successfully' });
};

const getMyCoursesAsTeacher = async (req, res) => {
  const courses = await Course.find({ teacher: req.user._id, isActive: true })
    .populate('department', 'name')
    .populate('students', 'name email');
  res.json({ success: true, count: courses.length, data: courses });
};

const getMyCoursesAsStudent = async (req, res) => {
  const courses = await Course.find({ students: req.user._id, isActive: true })
    .populate('department', 'name')
    .populate('teacher', 'name email');
  res.json({ success: true, count: courses.length, data: courses });
};

const uploadMaterial = async (req, res) => {
  const { title, fileUrl, fileType } = req.body;
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  course.materials.push({ title, fileUrl, fileType });
  await course.save();
  res.json({ success: true, data: course });
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, enrollStudent, unenrollStudent, getMyCoursesAsTeacher, getMyCoursesAsStudent, uploadMaterial };
