import { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdAdd } from 'react-icons/md';

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSubs, setShowSubs] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState({ title:'', description:'', course:'', dueDate:'', totalMarks:100 });
  const [grade, setGrade] = useState({ id:'', marks:'', feedback:'' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = () => Promise.all([api.get('/assignments/my'), api.get('/courses/my/teacher')])
    .then(([a, c]) => { setAssignments(a.data.data); setCourses(c.data.data); }).finally(() => setLoading(false));
  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try { await api.post('/assignments', form); setShowModal(false); setForm({title:'',description:'',course:'',dueDate:'',totalMarks:100}); fetchAll(); }
    catch(err) { setError(err.message || 'Failed'); } finally { setSubmitting(false); }
  };

  const viewSubs = async (id) => {
    const r = await api.get(`/assignments/${id}/submissions`);
    setSubmissions(r.data.data); setShowSubs(id);
  };

  const handleGrade = async (subId) => {
    await api.put(`/assignments/submissions/${subId}/grade`, { marks: Number(grade.marks), feedback: grade.feedback });
    viewSubs(showSubs);
  };

  const isOverdue = (date) => new Date(date) < new Date();

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Assignments</h1><p className="page-subtitle">{assignments.length} assignments created</p></div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:24}}>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><MdAdd /> New Assignment</button>
      </div>
      {assignments.length === 0 ? <div className="empty-state"><div className="empty-icon">📝</div><div className="empty-title">No assignments yet</div></div> : (
        <div className="glass-card" style={{padding:0}}>
          <div className="table-wrap"><table className="data-table">
            <thead><tr><th>Title</th><th>Course</th><th>Due Date</th><th>Total Marks</th><th>Actions</th></tr></thead>
            <tbody>{assignments.map(a => (
              <tr key={a._id}>
                <td style={{fontWeight:600}}>{a.title}</td>
                <td style={{color:'#A0A0A0'}}>{a.course?.title}</td>
                <td><span className={`badge ${isOverdue(a.dueDate)?'badge-danger':'badge-success'}`}>{new Date(a.dueDate).toLocaleDateString()}</span></td>
                <td>{a.totalMarks}</td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => viewSubs(a._id)}>View Submissions</button></td>
              </tr>
            ))}</tbody>
          </table></div>
        </div>
      )}
      {showSubs && (
        <div className="modal-overlay" onClick={() => setShowSubs(null)}>
          <div className="modal" style={{maxWidth:680}} onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">Submissions ({submissions.length})</div><button className="modal-close" onClick={() => setShowSubs(null)}>✕</button></div>
            <div className="modal-body">
              {submissions.length === 0 ? <div className="empty-state"><div className="empty-text">No submissions yet</div></div> : (
                submissions.map(s => (
                  <div key={s._id} style={{padding:'16px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                      <div style={{fontWeight:600}}>{s.student?.name}</div>
                      <span className={`badge ${s.status==='graded'?'badge-success':s.status==='late'?'badge-danger':'badge-warning'}`}>{s.status}</span>
                    </div>
                    {s.text && <div style={{fontSize:13,color:'#A0A0A0',marginBottom:8}}>{s.text}</div>}
                    {s.status !== 'graded' && (
                      <div style={{display:'flex',gap:8,marginTop:8}}>
                        <input className="form-input" style={{flex:1}} type="number" placeholder="Marks" value={grade.id===s._id?grade.marks:''} onChange={e=>setGrade({id:s._id,marks:e.target.value,feedback:grade.feedback})} />
                        <input className="form-input" style={{flex:2}} placeholder="Feedback" value={grade.id===s._id?grade.feedback:''} onChange={e=>setGrade({...grade,id:s._id,feedback:e.target.value})} />
                        <button className="btn btn-primary btn-sm" onClick={() => handleGrade(s._id)}>Grade</button>
                      </div>
                    )}
                    {s.status === 'graded' && <div style={{fontSize:13,color:'#4ade80'}}>Marks: {s.marks} · {s.feedback}</div>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">Create Assignment</div><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleCreate}>
                <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Course</label>
                  <select className="form-input" value={form.course} onChange={e=>setForm({...form,course:e.target.value})} required>
                    <option value="">Select Course</option>{courses.map(c=><option key={c._id} value={c._id}>{c.title}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required /></div>
                <div className="grid-2" style={{gap:12}}>
                  <div className="form-group"><label className="form-label">Due Date</label><input type="datetime-local" className="form-input" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} required /></div>
                  <div className="form-group"><label className="form-label">Total Marks</label><input type="number" className="form-input" value={form.totalMarks} onChange={e=>setForm({...form,totalMarks:e.target.value})} /></div>
                </div>
                <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting?'Creating...':'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
