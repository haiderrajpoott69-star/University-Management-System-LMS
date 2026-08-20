const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createAssignment, getAssignmentsByCourse, getTeacherAssignments, submitAssignment, getSubmissionsByAssignment, gradeSubmission, getStudentSubmissions } = require('../controllers/assignmentController');

router.get('/my', protect, authorize('teacher'), getTeacherAssignments);
router.get('/submissions/my', protect, authorize('student'), getStudentSubmissions);
router.get('/course/:courseId', protect, getAssignmentsByCourse);
router.post('/', protect, authorize('teacher'), createAssignment);
router.post('/submit', protect, authorize('student'), submitAssignment);
router.get('/:assignmentId/submissions', protect, authorize('teacher', 'admin'), getSubmissionsByAssignment);
router.put('/submissions/:id/grade', protect, authorize('teacher'), gradeSubmission);

module.exports = router;
