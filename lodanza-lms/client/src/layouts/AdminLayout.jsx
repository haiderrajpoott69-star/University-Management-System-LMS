import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdDashboard, MdPeople, MdSchool, MdMenuBook, MdApartment, MdBarChart, MdCampaign, MdPerson, MdLogout, MdNotifications } from 'react-icons/md';

const navItems = [
  { to: '/admin/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
  { to: '/admin/students', icon: <MdPeople />, label: 'Students' },
  { to: '/admin/teachers', icon: <MdSchool />, label: 'Teachers' },
  { to: '/admin/courses', icon: <MdMenuBook />, label: 'Courses' },
  { to: '/admin/departments', icon: <MdApartment />, label: 'Departments' },
  { to: '/admin/analytics', icon: <MdBarChart />, label: 'Analytics' },
  { to: '/admin/announcements', icon: <MdCampaign />, label: 'Announcements' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">LODANZA UNIVERSITY</div>
          <div className="sidebar-subtitle">Admin Portal</div>
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
            <NavLink to="/admin/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon"><MdPerson /></span>Profile
            </NavLink>
            <div className="nav-item" onClick={handleLogout}>
              <span className="nav-icon"><MdLogout /></span>Logout
            </div>
          </div>
        </nav>
        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.charAt(0)}</div>
          <div><div className="user-name">{user?.name}</div><div className="user-role">Administrator</div></div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left"><div className="topbar-title">Lodanza University LMS</div></div>
          <div className="topbar-actions">
            <button className="topbar-btn"><MdNotifications /><span className="notif-dot"></span></button>
            <div className="user-avatar" style={{width:36,height:36,borderRadius:10}}>{user?.name?.charAt(0)}</div>
          </div>
        </header>
        <div className="content-area animate-fade"><Outlet /></div>
      </main>
    </div>
  );
}
