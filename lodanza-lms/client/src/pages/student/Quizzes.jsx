import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function StudentQuizzes() {
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState('browse');
  const [loading, setLoading] = useState(true);
  const [courseId, setCourseId] = useState('');

  const fetchBase = () => Promise.all([api.get('/courses/my/student'), api.get('/quizzes/attempts/my')])
    .then(([c,a]) => { setCourses(c.data.data); setAttempts(a.data.data); }).finally(() => setLoading(false));
  useEffect(() => { fetchBase(); }, []);

  const loadQuizzes = async (id) => { setCourseId(id); if(id){ const r=await api.get(`/quizzes/course/${id}`); setQuizzes(r.data.data); } };
  const startQuiz = async (q) => { const r=await api.get(`/quizzes/${q._id}`); setSelected(r.data.data); setAnswers({}); setResult(null); };
  const isAttempted = (id) => attempts.some(a => a.quiz?._id===id);

  const handleSubmit = async () => {
    setSubmitting(true);
    const answersArr = Object.entries(answers).map(([qi,si]) => ({ questionIndex:parseInt(qi), selectedOption:parseInt(si) }));
    try { const r=await api.post(`/quizzes/${selected._id}/submit`,{answers:answersArr}); setResult(r.data.data); fetchBase(); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  if (selected && !result) return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{selected.title}</h1>
        <p className="page-subtitle">{selected.questions?.length} questions · {selected.duration} minutes</p>
      </div>
      {selected.questions?.map((q,i) => (
        <div key={i} className="glass-card" style={{marginBottom:16}}>
          <div style={{fontWeight:700,marginBottom:16,fontSize:15}}>{i+1}. {q.text}</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {q.options?.map((opt,oi) => (
              <label key={oi} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderRadius:10,border:`1px solid ${answers[i]==oi?'rgba(255,77,109,0.5)':'rgba(255,255,255,0.08)'}`,background:answers[i]==oi?'rgba(255,77,109,0.08)':'transparent',cursor:'pointer',transition:'all 0.15s'}}>
                <input type="radio" name={`q${i}`} value={oi} checked={answers[i]==oi} onChange={() => setAnswers({...answers,[i]:oi})} style={{accentColor:'#FF4D6D'}} />
                <span style={{fontSize:14}}>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div style={{display:'flex',gap:12,justifyContent:'flex-end',marginTop:8}}>
        <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>{submitting?'Submitting...':'Submit Quiz'}</button>
      </div>
    </div>
  );

  if (result) return (
    <div style={{textAlign:'center',padding:'60px 20px'}}>
      <div style={{fontSize:64,marginBottom:16}}>{result.percentage>=70?'🎉':'📚'}</div>
      <h2 style={{fontSize:32,fontWeight:800,marginBottom:8}}>{result.percentage}%</h2>
      <p style={{color:'#A0A0A0',marginBottom:8,fontSize:16}}>Score: {result.score} / {result.totalMarks}</p>
      <p style={{color: result.percentage>=70?'#4ade80':'#ff6b85',fontWeight:600,marginBottom:32}}>{result.percentage>=70?'Great job!':'Keep practicing!'}</p>
      <button className="btn btn-primary" onClick={() => { setSelected(null); setResult(null); fetchBase(); }}>Back to Quizzes</button>
    </div>
  );

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Quizzes</h1></div>
      <div className="tabs" style={{maxWidth:280}}><button className={`tab ${tab==='browse'?'active':''}`} onClick={()=>setTab('browse')}>Browse</button><button className={`tab ${tab==='history'?'active':''}`} onClick={()=>setTab('history')}>History ({attempts.length})</button></div>
      {tab==='browse' && (
        <div>
          <div className="form-group" style={{maxWidth:400,marginBottom:24}}>
            <label className="form-label">Select Course</label>
            <select className="form-input" value={courseId} onChange={e=>loadQuizzes(e.target.value)}>
              <option value="">Choose course...</option>{courses.map(c=><option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
          {quizzes.length===0?<div className="empty-state"><div className="empty-icon">🎯</div><div className="empty-title">Select a course to see quizzes</div></div>:(
            <div className="grid-3">{quizzes.map(q=>(
              <div key={q._id} className="glass-card">
                <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>{q.title}</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16}}>
                  <span className="badge badge-success">{q.questions?.length} Qs</span>
                  <span className="badge badge-teacher">{q.duration} min</span>
                  <span className="badge badge-admin">{q.totalMarks} marks</span>
                </div>
                {isAttempted(q._id)?<span className="badge badge-success">Completed</span>:<button className="btn btn-primary btn-sm" onClick={()=>startQuiz(q)}>Start Quiz</button>}
              </div>
            ))}</div>
          )}
        </div>
      )}
      {tab==='history' && (
        attempts.length===0?<div className="empty-state"><div className="empty-icon">📊</div><div className="empty-title">No quiz attempts yet</div></div>:(
          <div className="glass-card" style={{padding:0}}>
            <div className="table-wrap"><table className="data-table">
              <thead><tr><th>Quiz</th><th>Course</th><th>Score</th><th>Percentage</th><th>Date</th></tr></thead>
              <tbody>{attempts.map(a=>(
                <tr key={a._id}>
                  <td style={{fontWeight:600}}>{a.quiz?.title}</td>
                  <td style={{color:'#A0A0A0'}}>{a.quiz?.course?.title}</td>
                  <td>{a.score}/{a.totalMarks}</td>
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
