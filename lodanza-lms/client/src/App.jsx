import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './layouts/AdminLayout';
import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageTeachers from './pages/admin/ManageTeachers';
import ManageCourses from './pages/admin/ManageCourses';
import ManageDepartments from './pages/admin/ManageDepartments';
import Analytics from './pages/admin/Analytics';
import Announcements from './pages/admin/Announcements';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherCourses from './pages/teacher/Courses';
import TeacherAssignments from './pages/teacher/Assignments';
import TeacherQuizzes from './pages/teacher/Quizzes';
import TeacherAttendance from './pages/teacher/Attendance';
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import StudentAssignments from './pages/student/Assignments';
import StudentQuizzes from './pages/student/Quizzes';
import StudentGrades from './pages/student/Grades';
import StudentAttendance from './pages/student/Attendance';
import Profile from './pages/Profile';

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Navigate to={`/${user.role}/dashboard`} />;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="teachers" element={<ManageTeachers />} />
          <Route path="courses" element={<ManageCourses />} />
          <Route path="departments" element={<ManageDepartments />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/teacher" element={<ProtectedRoute roles={['teacher']}><TeacherLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="courses" element={<TeacherCourses />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="quizzes" element={<TeacherQuizzes />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/student" element={<ProtectedRoute roles={['student']}><StudentLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="quizzes" element={<StudentQuizzes />} />
          <Route path="grades" element={<StudentGrades />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
