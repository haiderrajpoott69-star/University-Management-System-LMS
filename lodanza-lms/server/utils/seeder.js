require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Announcement = require('../models/Announcement');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding...');
};

const seedData = async () => {
  await connectDB();
  await User.deleteMany();
  await Department.deleteMany();
  await Course.deleteMany();
  await Announcement.deleteMany();

  const admin = await User.create({ name: 'Admin User', email: 'admin@lodanza.edu', password: 'admin123', role: 'admin' });
  const teacher1 = await User.create({ name: 'Dr. Sarah Johnson', email: 'sarah@lodanza.edu', password: 'teacher123', role: 'teacher' });
  const teacher2 = await User.create({ name: 'Prof. Michael Chen', email: 'michael@lodanza.edu', password: 'teacher123', role: 'teacher' });
  const student1 = await User.create({ name: 'Alice Williams', email: 'alice@lodanza.edu', password: 'student123', role: 'student' });
  const student2 = await User.create({ name: 'Bob Martinez', email: 'bob@lodanza.edu', password: 'student123', role: 'student' });
  const student3 = await User.create({ name: 'Carol Davis', email: 'carol@lodanza.edu', password: 'student123', role: 'student' });

  const dept1 = await Department.create({ name: 'Computer Science', code: 'CS', description: 'Department of Computer Science and Engineering', head: teacher1._id });
  const dept2 = await Department.create({ name: 'Mathematics', code: 'MATH', description: 'Department of Mathematics and Statistics', head: teacher2._id });
  const dept3 = await Department.create({ name: 'Physics', code: 'PHY', description: 'Department of Physics and Applied Sciences' });

  const course1 = await Course.create({ title: 'Introduction to Programming', code: 'CS101', description: 'Learn the fundamentals of programming with Python', department: dept1._id, teacher: teacher1._id, students: [student1._id, student2._id, student3._id], credits: 3, semester: 'Fall', year: 2024 });
  const course2 = await Course.create({ title: 'Data Structures & Algorithms', code: 'CS201', description: 'Advanced data structures and algorithm design', department: dept1._id, teacher: teacher1._id, students: [student1._id, student2._id], credits: 4, semester: 'Fall', year: 2024 });
  const course3 = await Course.create({ title: 'Calculus I', code: 'MATH101', description: 'Single variable calculus and its applications', department: dept2._id, teacher: teacher2._id, students: [student2._id, student3._id], credits: 3, semester: 'Fall', year: 2024 });

  await Announcement.create({ title: 'Welcome to Lodanza University!', content: 'We are excited to welcome all students and faculty to the new academic year. Please make sure to complete your enrollment.', author: admin._id, targetRole: 'all' });
  await Announcement.create({ title: 'Mid-term Exam Schedule', content: 'Mid-term examinations will be held from November 15-20. Check your course pages for specific timings.', author: admin._id, targetRole: 'student' });

  console.log('\n✅ Seed data created successfully!\n');
  console.log('Admin:   admin@lodanza.edu / admin123');
  console.log('Teacher: sarah@lodanza.edu / teacher123');
  console.log('Student: alice@lodanza.edu / student123');
  process.exit(0);
};

seedData().catch(err => { console.error(err); process.exit(1); });
