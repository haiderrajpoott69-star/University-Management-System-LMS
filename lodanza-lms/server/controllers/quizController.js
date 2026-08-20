const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Notification = require('../models/Notification');
const Course = require('../models/Course');

const createQuiz = async (req, res) => {
  const totalMarks = req.body.questions ? req.body.questions.reduce((sum, q) => sum + (q.marks || 1), 0) : 0;
  const quiz = await Quiz.create({ ...req.body, teacher: req.user._id, totalMarks });
  const course = await Course.findById(req.body.course).populate('students', '_id');
  if (course) {
    const notifications = course.students.map(s => ({
      recipient: s._id, title: 'New Quiz', message: `New quiz "${quiz.title}" available`, type: 'quiz'
    }));
    await Notification.insertMany(notifications);
  }
  res.status(201).json({ success: true, data: quiz });
};

const getQuizzesByCourse = async (req, res) => {
  const quizzes = await Quiz.find({ course: req.params.courseId, isActive: true })
    .populate('teacher', 'name').sort({ createdAt: -1 });
  res.json({ success: true, count: quizzes.length, data: quizzes });
};

const getTeacherQuizzes = async (req, res) => {
  const quizzes = await Quiz.find({ teacher: req.user._id })
    .populate('course', 'title code').sort({ createdAt: -1 });
  res.json({ success: true, count: quizzes.length, data: quizzes });
};

const getQuizById = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate('course', 'title');
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
  if (req.user.role === 'student') {
    const sanitized = { ...quiz.toObject() };
    sanitized.questions = sanitized.questions.map(q => ({ ...q, correctAnswer: undefined }));
    return res.json({ success: true, data: sanitized });
  }
  res.json({ success: true, data: quiz });
};

const submitQuiz = async (req, res) => {
  const { answers } = req.body;
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
  const existing = await QuizAttempt.findOne({ quiz: req.params.id, student: req.user._id });
  if (existing) return res.status(400).json({ success: false, message: 'Already attempted' });
  let score = 0;
  answers.forEach(ans => {
    const q = quiz.questions[ans.questionIndex];
    if (q && q.correctAnswer === ans.selectedOption) score += (q.marks || 1);
  });
  const percentage = quiz.totalMarks > 0 ? Math.round((score / quiz.totalMarks) * 100) : 0;
  const attempt = await QuizAttempt.create({ quiz: req.params.id, student: req.user._id, answers, score, totalMarks: quiz.totalMarks, percentage });
  res.status(201).json({ success: true, data: attempt });
};

const getStudentAttempts = async (req, res) => {
  const attempts = await QuizAttempt.find({ student: req.user._id })
    .populate({ path: 'quiz', select: 'title totalMarks course', populate: { path: 'course', select: 'title' } })
    .sort({ createdAt: -1 });
  res.json({ success: true, count: attempts.length, data: attempts });
};

const getQuizAttempts = async (req, res) => {
  const attempts = await QuizAttempt.find({ quiz: req.params.id })
    .populate('student', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, count: attempts.length, data: attempts });
};

module.exports = { createQuiz, getQuizzesByCourse, getTeacherQuizzes, getQuizById, submitQuiz, getStudentAttempts, getQuizAttempts };
