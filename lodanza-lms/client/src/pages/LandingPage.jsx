import { Link } from 'react-router-dom';
import { MdSchool, MdAssignment, MdBarChart, MdQuiz, MdHowToReg, MdCampaign } from 'react-icons/md';

const features = [
  { icon: '🎓', title: 'Smart Learning', text: 'Access course materials, video lectures, and notes anytime, anywhere on any device.' },
  { icon: '📝', title: 'Assignment Management', text: 'Submit assignments online, track deadlines, and receive feedback from teachers instantly.' },
  { icon: '📊', title: 'Analytics & Reports', text: 'Comprehensive dashboards with real-time insights on student performance and progress.' },
  { icon: '🎯', title: 'Interactive Quizzes', text: 'Take online quizzes, get instant results, and review your answers with explanations.' },
  { icon: '📅', title: 'Attendance Tracking', text: 'Automated attendance management system with detailed reports and notifications.' },
  { icon: '🔔', title: 'Smart Notifications', text: 'Stay updated with announcements, grade notifications, and important deadlines.' },
];

export default function LandingPage() {
  return (
    <div className="landing">
      <section className="hero">
        <div style={{position:'relative',zIndex:1}}>
          <div className="hero-badge">🏛️ Lodanza University of Science</div>
          <h1 className="hero-title">
            The Future of<br /><span className="gradient">University Learning</span>
          </h1>
          <p className="hero-subtitle">
            A powerful, modern Learning Management System designed for Lodanza University. 
            Empowering students, teachers, and administrators with cutting-edge tools.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary" style={{padding:'14px 32px',fontSize:'15px'}}>Get Started →</Link>
            <Link to="/register" className="btn btn-ghost" style={{padding:'14px 32px',fontSize:'15px'}}>Create Account</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-value">500+</div><div className="hero-stat-label">Students</div></div>
            <div className="hero-stat"><div className="hero-stat-value">50+</div><div className="hero-stat-label">Courses</div></div>
            <div className="hero-stat"><div className="hero-stat-value">30+</div><div className="hero-stat-label">Teachers</div></div>
            <div className="hero-stat"><div className="hero-stat-value">10+</div><div className="hero-stat-label">Departments</div></div>
          </div>
        </div>
      </section>
      <section className="features">
        <h2 className="features-title">Everything You Need to <span style={{background:'linear-gradient(135deg,#FF4D6D,#FF8C42)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Succeed</span></h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card animate-fade" style={{animationDelay:`${i*0.1}s`}}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-text">{f.text}</div>
            </div>
          ))}
        </div>
      </section>
      <footer className="landing-footer">
        <p>© 2024 Lodanza University of Science. All rights reserved.</p>
        <p style={{marginTop:8}}>Empowering education through technology.</p>
      </footer>
    </div>
  );
}
