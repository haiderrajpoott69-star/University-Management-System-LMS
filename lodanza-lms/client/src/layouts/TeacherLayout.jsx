import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdDashboard, MdMenuBook, MdAssignment, MdQuiz, MdHowToReg, MdPerson, MdLogout, MdNotifications } from 'react-icons/md';

const navItems = [
  { to: '/teacher/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
  { to: '/teacher/courses', icon: <MdMenuBook />, label: 'My Courses' },
  { to: '/teacher/assignments', icon: <MdAssignment />, label: 'Assignments' },
  { to: '/teacher/quizzes', icon: <MdQuiz />, label: 'Quizzes' },
  { to: '/teacher/attendance', icon: <MdHowToReg />, label: 'Attendance' },
];

export default function TeacherLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">LODANZA UNIVERSITY</div>
          <div className="sidebar-subtitle">Teacher Portal</div>
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
            <NavLink to="/teacher/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon"><MdPerson /></span>Profile
            </NavLink>
            <div className="nav-item" onClick={() => { logout(); navigate('/login'); }}>
              <span className="nav-icon"><MdLogout /></span>Logout
            </div>
          </div>
        </nav>
        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.charAt(0)}</div>
          <div><div className="user-name">{user?.name}</div><div className="user-role">Teacher</div></div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left"><div className="topbar-title">Teacher Portal</div></div>
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
