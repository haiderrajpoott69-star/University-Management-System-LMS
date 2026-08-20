const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Notification = require('../models/Notification');
const Course = require('../models/Course');

const createAssignment = async (req, res) => {
  const assignment = await Assignment.create({ ...req.body, teacher: req.user._id });
  const course = await Course.findById(req.body.course).populate('students', '_id');
  if (course) {
    const notifications = course.students.map(s => ({
      recipient: s._id, title: 'New Assignment', message: `New assignment "${assignment.title}" posted`, type: 'assignment'
    }));
    await Notification.insertMany(notifications);
  }
  res.status(201).json({ success: true, data: assignment });
};

const getAssignmentsByCourse = async (req, res) => {
  const assignments = await Assignment.find({ course: req.params.courseId, isActive: true })
    .populate('teacher', 'name').sort({ createdAt: -1 });
  res.json({ success: true, count: assignments.length, data: assignments });
};

const getTeacherAssignments = async (req, res) => {
  const assignments = await Assignment.find({ teacher: req.user._id, isActive: true })
    .populate('course', 'title code').sort({ createdAt: -1 });
  res.json({ success: true, count: assignments.length, data: assignments });
};

const submitAssignment = async (req, res) => {
  const { assignment, course, text, fileUrl } = req.body;
  const existing = await Submission.findOne({ assignment, student: req.user._id });
  if (existing) return res.status(400).json({ success: false, message: 'Already submitted' });
  const submission = await Submission.create({ assignment, course, student: req.user._id, text, fileUrl });
  res.status(201).json({ success: true, data: submission });
};

const getSubmissionsByAssignment = async (req, res) => {
  const submissions = await Submission.find({ assignment: req.params.assignmentId })
    .populate('student', 'name email').sort({ submittedAt: -1 });
  res.json({ success: true, count: submissions.length, data: submissions });
};

const gradeSubmission = async (req, res) => {
  const { marks, feedback } = req.body;
  const submission = await Submission.findByIdAndUpdate(
    req.params.id,
    { marks, feedback, status: 'graded' },
    { new: true }
  ).populate('student', 'name');
  if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });
  await Notification.create({
    recipient: submission.student._id, title: 'Assignment Graded',
    message: `Your assignment has been graded. Marks: ${marks}`, type: 'grade'
  });
  res.json({ success: true, data: submission });
};

const getStudentSubmissions = async (req, res) => {
  const submissions = await Submission.find({ student: req.user._id })
    .populate('assignment', 'title totalMarks dueDate')
    .populate('course', 'title').sort({ submittedAt: -1 });
  res.json({ success: true, count: submissions.length, data: submissions });
};

module.exports = { createAssignment, getAssignmentsByCourse, getTeacherAssignments, submitAssignment, getSubmissionsByAssignment, gradeSubmission, getStudentSubmissions };
