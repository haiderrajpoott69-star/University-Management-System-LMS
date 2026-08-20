const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, enrollStudent, unenrollStudent, getMyCoursesAsTeacher, getMyCoursesAsStudent, uploadMaterial } = require('../controllers/courseController');

router.get('/', protect, getAllCourses);
router.get('/my/teacher', protect, authorize('teacher'), getMyCoursesAsTeacher);
router.get('/my/student', protect, authorize('student'), getMyCoursesAsStudent);
router.get('/:id', protect, getCourseById);
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin', 'teacher'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);
router.post('/:id/enroll', protect, authorize('student'), enrollStudent);
router.post('/:id/unenroll', protect, authorize('student'), unenrollStudent);
router.post('/:id/materials', protect, authorize('teacher', 'admin'), uploadMaterial);

module.exports = router;
