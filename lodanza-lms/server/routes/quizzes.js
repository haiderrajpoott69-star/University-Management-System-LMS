const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createQuiz, getQuizzesByCourse, getTeacherQuizzes, getQuizById, submitQuiz, getStudentAttempts, getQuizAttempts } = require('../controllers/quizController');

router.get('/my', protect, authorize('teacher'), getTeacherQuizzes);
router.get('/attempts/my', protect, authorize('student'), getStudentAttempts);
router.get('/course/:courseId', protect, getQuizzesByCourse);
router.post('/', protect, authorize('teacher'), createQuiz);
router.get('/:id', protect, getQuizById);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);
router.get('/:id/attempts', protect, authorize('teacher', 'admin'), getQuizAttempts);

module.exports = router;
