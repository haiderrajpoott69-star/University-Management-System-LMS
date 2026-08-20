import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { MdMenuBook, MdAssignment, MdHowToReg, MdQuiz } from 'react-icons/md';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/courses/my/student'),
      api.get('/assignments/submissions/my'),
      api.get('/attendance/my'),
      api.get('/quizzes/attempts/my')
    ]).then(([c, a, att, q]) => {
      setCourses(c.data.data); setAssignments(a.data.data);
      setAttendance(att.data.data); setAttempts(q.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  const avgAttendance = attendance.length > 0 ? Math.round(attendance.reduce((s,a) => s + a.percentage, 0) / attendance.length) : 0;
  const avgScore = attempts.length > 0 ? Math.round(attempts.reduce((s,a) => s + a.percentage, 0) / attempts.length) : 0;

  const cards = [
    { label: 'Enrolled Courses', value: courses.length, icon: <MdMenuBook />, color: '#FF4D6D' },
    { label: 'Submissions', value: assignments.length, icon: <MdAssignment />, color: '#FF8C42' },
    { label: 'Avg Attendance', value: `${avgAttendance}%`, icon: <MdHowToReg />, color: '#8B5CF6' },
    { label: 'Quiz Avg Score', value: `${avgScore}%`, icon: <MdQuiz />, color: '#06B6D4' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome, {user?.name?.split(' ')[0]}</h1>
        <p className="page-subtitle">Here's your academic overview</p>
      </div>
      <div className="grid-4" style={{marginBottom:32}}>
        {cards.map((c, i) => (
          <div key={i} className="stat-card animate-fade" style={{animationDelay:`${i*0.08}s`}}>
            <div className="stat-icon" style={{background:`${c.color}22`,color:c.color,fontSize:24}}>{c.icon}</div>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="grid-2">
        <div className="glass-card">
          <div className="section-title">My Courses</div>
          {courses.length === 0 ? <div className="empty-state"><div className="empty-text">No courses enrolled</div></div> : (
            courses.slice(0,4).map(c => (
              <div key={c._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                <div>
                  <div style={{fontWeight:600,fontSize:14}}>{c.title}</div>
                  <div style={{fontSize:12,color:'#A0A0A0'}}>{c.code} · {c.teacher?.name || 'No teacher'}</div>
                </div>
                <span className="badge badge-teacher">{c.credits} cr</span>
              </div>
            ))
          )}
        </div>
        <div className="glass-card">
          <div className="section-title">Attendance by Course</div>
          {attendance.length === 0 ? <div className="empty-state"><div className="empty-text">No attendance data</div></div> : (
            attendance.map((a, i) => (
              <div key={i} style={{marginBottom:16}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:14}}>
                  <span style={{fontWeight:600}}>{a.course?.title}</span>
                  <span style={{color: a.percentage >= 75 ? '#4ade80' : '#ff6b85'}}>{a.percentage}%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{width:`${a.percentage}%`, background: a.percentage >= 75 ? 'linear-gradient(90deg,#10b981,#4ade80)' : 'linear-gradient(90deg,#FF4D6D,#FF8C42)'}}></div></div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
