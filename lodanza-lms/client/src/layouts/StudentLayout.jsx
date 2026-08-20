import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdDashboard, MdMenuBook, MdAssignment, MdQuiz, MdHowToReg, MdGrade, MdPerson, MdLogout, MdNotifications } from 'react-icons/md';

const navItems = [
  { to: '/student/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
  { to: '/student/courses', icon: <MdMenuBook />, label: 'Courses' },
  { to: '/student/assignments', icon: <MdAssignment />, label: 'Assignments' },
  { to: '/student/quizzes', icon: <MdQuiz />, label: 'Quizzes' },
  { to: '/student/grades', icon: <MdGrade />, label: 'Grades' },
  { to: '/student/attendance', icon: <MdHowToReg />, label: 'Attendance' },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">LODANZA UNIVERSITY</div>
          <div className="sidebar-subtitle">Student Portal</div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-label">Main Menu</div>
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">{item.icon}</span>{item.label}
              </NavLink>
            ))}
          </div>
          <div className="nav-section">
            <div className="nav-section-label">Account</div>
            <NavLink to="/student/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon"><MdPerson /></span>Profile
            </NavLink>
            <div className="nav-item" onClick={() => { logout(); navigate('/login'); }}>
              <span className="nav-icon"><MdLogout /></span>Logout
            </div>
          </div>
        </nav>
        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.charAt(0)}</div>
          <div><div className="user-name">{user?.name}</div><div className="user-role">Student</div></div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left"><div className="topbar-title">Student Portal</div></div>
          <div className="topbar-actions">
            <button className="topbar-btn"><MdNotifications /></button>
            <div className="user-avatar" style={{width:36,height:36,borderRadius:10}}>{user?.name?.charAt(0)}</div>
          </div>
        </header>
        <div className="content-area animate-fade"><Outlet /></div>
      </main>
    </div>
  );
}
