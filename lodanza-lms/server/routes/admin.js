const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboardStats, getAllStudents, getAllTeachers, createUser, updateUser, deleteUser, getAllDepartments, createDepartment, updateDepartment, deleteDepartment, getAnalytics, createAnnouncement, getAllAnnouncements } = require('../controllers/adminController');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);
router.get('/students', getAllStudents);
router.get('/teachers', getAllTeachers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/departments', getAllDepartments);
router.post('/departments', createDepartment);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);
router.get('/announcements', getAllAnnouncements);
router.post('/announcements', createAnnouncement);

module.exports = router;
