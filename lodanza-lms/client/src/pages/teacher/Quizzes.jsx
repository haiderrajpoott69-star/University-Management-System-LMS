import { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdAdd, MdDelete } from 'react-icons/md';

export default function TeacherQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:'', course:'', duration:30, questions:[{text:'',options:['','','',''],correctAnswer:0,marks:1}] });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = () => Promise.all([api.get('/quizzes/my'), api.get('/courses/my/teacher')])
    .then(([q,c]) => { setQuizzes(q.data.data); setCourses(c.data.data); }).finally(() => setLoading(false));
  useEffect(() => { fetchAll(); }, []);

  const addQuestion = () => setForm({...form, questions:[...form.questions,{text:'',options:['','','',''],correctAnswer:0,marks:1}]});
  const updateQ = (i, key, val) => {
    const qs = [...form.questions]; qs[i] = {...qs[i],[key]:val}; setForm({...form,questions:qs});
  };
  const updateOpt = (qi, oi, val) => {
    const qs = [...form.questions]; qs[qi].options[oi]=val; setForm({...form,questions:qs});
  };

  const handleCreate = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try { await api.post('/quizzes', form); setShowModal(false); fetchAll(); }
    catch(err) { setError(err.message || 'Failed'); } finally { setSubmitting(false); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Quizzes</h1><p className="page-subtitle">{quizzes.length} quizzes created</p></div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:24}}>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><MdAdd /> New Quiz</button>
      </div>
      {quizzes.length === 0 ? <div className="empty-state"><div className="empty-icon">🎯</div><div className="empty-title">No quizzes yet</div></div> : (
        <div className="grid-3">
          {quizzes.map(q => (
            <div key={q._id} className="glass-card">
              <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>{q.title}</div>
              <div style={{fontSize:13,color:'#A0A0A0',marginBottom:12}}>{q.course?.title}</div>
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                <span className="badge badge-success">{q.questions?.length} Qs</span>
                <span className="badge badge-teacher">{q.duration} min</span>
                <span className="badge badge-admin">{q.totalMarks} marks</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{maxWidth:680,maxHeight:'85vh'}} onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">Create Quiz</div><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleCreate}>
                <div className="form-group"><label className="form-label">Quiz Title</label><input className="form-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Course</label>
                  <select className="form-input" value={form.course} onChange={e=>setForm({...form,course:e.target.value})} required>
                    <option value="">Select Course</option>{courses.map(c=><option key={c._id} value={c._id}>{c.title}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Duration (minutes)</label><input type="number" className="form-input" value={form.duration} onChange={e=>setForm({...form,duration:Number(e.target.value)})} /></div>
                <div style={{marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                    <div style={{fontWeight:700}}>Questions ({form.questions.length})</div>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={addQuestion}><MdAdd /> Add Question</button>
                  </div>
                  {form.questions.map((q,qi) => (
                    <div key={qi} style={{background:'rgba(255,255,255,0.03)',borderRadius:12,padding:16,marginBottom:12}}>
                      <div style={{fontWeight:600,marginBottom:8,fontSize:13,color:'#FF4D6D'}}>Q{qi+1}</div>
                      <div className="form-group" style={{marginBottom:12}}><input className="form-input" placeholder="Question text" value={q.text} onChange={e=>updateQ(qi,'text',e.target.value)} required /></div>
                      {q.options.map((opt,oi) => (
                        <div key={oi} style={{display:'flex',gap:8,marginBottom:8,alignItems:'center'}}>
                          <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer===oi} onChange={() => updateQ(qi,'correctAnswer',oi)} />
                          <input className="form-input" placeholder={`Option ${oi+1}`} value={opt} onChange={e=>updateOpt(qi,oi,e.target.value)} style={{flex:1}} required />
                        </div>
                      ))}
                      <div style={{fontSize:12,color:'#A0A0A0',marginTop:8}}>Select the radio button for the correct answer</div>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting?'Creating...':'Create Quiz'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
