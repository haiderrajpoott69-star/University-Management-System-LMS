import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function StudentGrades() {
  const [submissions, setSubmissions] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('assignments');

  useEffect(() => {
    Promise.all([api.get('/assignments/submissions/my'), api.get('/quizzes/attempts/my')])
      .then(([s, a]) => { setSubmissions(s.data.data); setAttempts(a.data.data); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  const gradedSubs = submissions.filter(s => s.status === 'graded');
  const avgAssignment = gradedSubs.length > 0 ? Math.round(gradedSubs.reduce((sum,s) => sum + (s.marks/s.assignment?.totalMarks*100||0), 0) / gradedSubs.length) : 0;
  const avgQuiz = attempts.length > 0 ? Math.round(attempts.reduce((s,a) => s + a.percentage, 0) / attempts.length) : 0;

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Grades</h1><p className="page-subtitle">Your academic performance</p></div>
      <div className="grid-3" style={{marginBottom:32}}>
        <div className="stat-card"><div className="stat-icon" style={{background:'rgba(255,77,109,0.1)'}}>📝</div><div className="stat-value">{avgAssignment}%</div><div className="stat-label">Assignment Avg</div></div>
        <div className="stat-card"><div className="stat-icon" style={{background:'rgba(139,92,246,0.1)'}}>🎯</div><div className="stat-value">{avgQuiz}%</div><div className="stat-label">Quiz Avg</div></div>
        <div className="stat-card"><div className="stat-icon" style={{background:'rgba(6,182,212,0.1)'}}>⭐</div><div className="stat-value">{Math.round((avgAssignment+avgQuiz)/2) || 0}%</div><div className="stat-label">Overall Avg</div></div>
      </div>
      <div className="tabs" style={{maxWidth:280}}>
        <button className={`tab ${tab==='assignments'?'active':''}`} onClick={()=>setTab('assignments')}>Assignments</button>
        <button className={`tab ${tab==='quizzes'?'active':''}`} onClick={()=>setTab('quizzes')}>Quizzes</button>
      </div>
      {tab==='assignments' && (
        gradedSubs.length===0?<div className="empty-state"><div className="empty-icon">📊</div><div className="empty-title">No graded assignments yet</div></div>:(
          <div className="glass-card" style={{padding:0}}>
            <div className="table-wrap"><table className="data-table">
              <thead><tr><th>Assignment</th><th>Course</th><th>Marks</th><th>Percentage</th><th>Feedback</th></tr></thead>
              <tbody>{gradedSubs.map(s=>(
                <tr key={s._id}>
                  <td style={{fontWeight:600}}>{s.assignment?.title}</td>
                  <td style={{color:'#A0A0A0'}}>{s.course?.title}</td>
                  <td style={{fontWeight:600}}>{s.marks}/{s.assignment?.totalMarks}</td>
                  <td><span className={`badge ${(s.marks/s.assignment?.totalMarks*100)>=50?'badge-success':'badge-danger'}`}>{Math.round(s.marks/s.assignment?.totalMarks*100)}%</span></td>
                  <td style={{color:'#A0A0A0',fontSize:13}}>{s.feedback||'No feedback'}</td>
                </tr>
              ))}</tbody>
            </table></div>
          </div>
        )
      )}
      {tab==='quizzes' && (
        attempts.length===0?<div className="empty-state"><div className="empty-icon">🎯</div><div className="empty-title">No quiz attempts yet</div></div>:(
          <div className="glass-card" style={{padding:0}}>
            <div className="table-wrap"><table className="data-table">
              <thead><tr><th>Quiz</th><th>Course</th><th>Score</th><th>Percentage</th><th>Date</th></tr></thead>
              <tbody>{attempts.map(a=>(
                <tr key={a._id}>
                  <td style={{fontWeight:600}}>{a.quiz?.title}</td>
                  <td style={{color:'#A0A0A0'}}>{a.quiz?.course?.title}</td>
                  <td style={{fontWeight:600}}>{a.score}/{a.totalMarks}</td>
                  <td><span className={`badge ${a.percentage>=70?'badge-success':'badge-danger'}`}>{a.percentage}%</span></td>
                  <td style={{color:'#A0A0A0',fontSize:13}}>{new Date(a.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}</tbody>
            </table></div>
          </div>
        )
      )}
    </div>
  );
}
