const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { markAttendance, getCourseAttendance, getStudentAttendance } = require('../controllers/attendanceController');

router.post('/', protect, authorize('teacher'), markAttendance);
router.get('/course/:courseId', protect, authorize('teacher', 'admin'), getCourseAttendance);
router.get('/my', protect, authorize('student'), getStudentAttendance);

module.exports = router;
