const Attendance = require('../models/Attendance');
const Course = require('../models/Course');

const markAttendance = async (req, res) => {
  const { course, date, records } = req.body;
  const existing = await Attendance.findOne({ course, date: new Date(date) });
  if (existing) {
    existing.records = records;
    await existing.save();
    return res.json({ success: true, data: existing });
  }
  const attendance = await Attendance.create({ course, teacher: req.user._id, date: new Date(date), records });
  res.status(201).json({ success: true, data: attendance });
};

const getCourseAttendance = async (req, res) => {
  const attendance = await Attendance.find({ course: req.params.courseId })
    .populate('records.student', 'name email').sort({ date: -1 });
  res.json({ success: true, count: attendance.length, data: attendance });
};

const getStudentAttendance = async (req, res) => {
  const courses = await Course.find({ students: req.user._id, isActive: true }).select('_id title');
  const result = await Promise.all(courses.map(async (course) => {
    const records = await Attendance.find({ course: course._id });
    const total = records.length;
    const present = records.filter(r => r.records.some(rec => rec.student.toString() === req.user._id.toString() && rec.status === 'present')).length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { course: { _id: course._id, title: course.title }, total, present, absent: total - present, percentage };
  }));
  res.json({ success: true, data: result });
};

module.exports = { markAttendance, getCourseAttendance, getStudentAttendance };
