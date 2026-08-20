import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MdMenuBook, MdAssignment, MdPeople, MdQuiz } from 'react-icons/md';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/courses/my/teacher'),
      api.get('/assignments/my'),
      api.get('/quizzes/my')
    ]).then(([c, a, q]) => {
      setCourses(c.data.data); setAssignments(a.data.data); setQuizzes(q.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  const totalStudents = courses.reduce((s, c) => s + (c.students?.length || 0), 0);
  const cards = [
    { label: 'My Courses', value: courses.length, icon: <MdMenuBook />, color: '#FF4D6D' },
    { label: 'Total Students', value: totalStudents, icon: <MdPeople />, color: '#FF8C42' },
    { label: 'Assignments', value: assignments.length, icon: <MdAssignment />, color: '#8B5CF6' },
    { label: 'Quizzes', value: quizzes.length, icon: <MdQuiz />, color: '#06B6D4' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome, {user?.name?.split(' ')[0]}</h1>
        <p className="page-subtitle">Here's your teaching overview</p>
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
          {courses.length === 0 ? <div className="empty-state"><div className="empty-text">No courses assigned yet</div></div> : (
            courses.slice(0,4).map(c => (
              <div key={c._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                <div>
                  <div style={{fontWeight:600,fontSize:14}}>{c.title}</div>
                  <div style={{fontSize:12,color:'#A0A0A0'}}>{c.code} · {c.department?.name}</div>
                </div>
                <span style={{background:'rgba(255,77,109,0.1)',color:'#FF4D6D',borderRadius:8,padding:'4px 10px',fontSize:12,fontWeight:600}}>{c.students?.length} students</span>
              </div>
            ))
          )}
        </div>
        <div className="glass-card">
          <div className="section-title">Recent Assignments</div>
          {assignments.length === 0 ? <div className="empty-state"><div className="empty-text">No assignments created yet</div></div> : (
            assignments.slice(0,4).map(a => (
              <div key={a._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                <div>
                  <div style={{fontWeight:600,fontSize:14}}>{a.title}</div>
                  <div style={{fontSize:12,color:'#A0A0A0'}}>{a.course?.title}</div>
                </div>
                <span style={{fontSize:12,color:'#A0A0A0'}}>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
