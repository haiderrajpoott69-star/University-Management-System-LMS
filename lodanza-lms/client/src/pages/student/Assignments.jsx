import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function StudentAssignments() {
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState('');
  const [form, setForm] = useState({ text:'', fileUrl:'' });
  const [submitting, setSubmitting] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = () => Promise.all([api.get('/courses/my/student'), api.get('/assignments/submissions/my')])
    .then(([c, s]) => { setCourses(c.data.data); setSubmissions(s.data.data); }).finally(() => setLoading(false));
  useEffect(() => { fetchAll(); }, []);

  const loadAssignments = async (courseId) => {
    setSelected(courseId);
    if (courseId) { const r = await api.get(`/assignments/course/${courseId}`); setAssignments(r.data.data); }
    else setAssignments([]);
  };

  const isSubmitted = (id) => submissions.some(s => s.assignment?._id === id || s.assignment === id);
  const getSubmission = (id) => submissions.find(s => s.assignment?._id === id || s.assignment === id);

  const handleSubmit = async (a) => {
    setError(''); setSubmitting(a._id);
    try { await api.post('/assignments/submit', { assignment: a._id, course: a.course, text: form.text, fileUrl: form.fileUrl }); setForm({text:'',fileUrl:''}); fetchAll(); }
    catch(err) { setError(err.message || 'Failed to submit'); } finally { setSubmitting(''); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Assignments</h1><p className="page-subtitle">View and submit course assignments</p></div>
      <div className="form-group" style={{maxWidth:400,marginBottom:24}}>
        <label className="form-label">Filter by Course</label>
        <select className="form-input" value={selected} onChange={e=>loadAssignments(e.target.value)}>
          <option value="">All Submissions</option>
          {courses.map(c=><option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {!selected ? (
        <div>
          <div className="section-title">My Submissions</div>
          {submissions.length === 0 ? <div className="empty-state"><div className="empty-icon">📝</div><div className="empty-title">No submissions yet</div></div> : (
            <div className="glass-card" style={{padding:0}}>
              <div className="table-wrap"><table className="data-table">
                <thead><tr><th>Assignment</th><th>Course</th><th>Due Date</th><th>Status</th><th>Marks</th></tr></thead>
                <tbody>{submissions.map(s=>(
                  <tr key={s._id}>
                    <td style={{fontWeight:600}}>{s.assignment?.title}</td>
                    <td style={{color:'#A0A0A0'}}>{s.course?.title}</td>
                    <td style={{color:'#A0A0A0',fontSize:13}}>{s.assignment?.dueDate?new Date(s.assignment.dueDate).toLocaleDateString():'N/A'}</td>
                    <td><span className={`badge ${s.status==='graded'?'badge-success':s.status==='late'?'badge-danger':'badge-warning'}`}>{s.status}</span></td>
                    <td style={{fontWeight:600}}>{s.marks!=null?`${s.marks}/${s.assignment?.totalMarks}`:'Pending'}</td>
                  </tr>
                ))}</tbody>
              </table></div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {assignments.length === 0 ? <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">No assignments for this course</div></div> : (
            assignments.map(a => {
              const sub = getSubmission(a._id);
              const overdue = new Date(a.dueDate) < new Date();
              return (
                <div key={a._id} className="glass-card" style={{marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                    <div>
                      <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>{a.title}</div>
                      <div style={{fontSize:13,color:'#A0A0A0'}}>{a.description}</div>
                    </div>
                    <span className={`badge ${overdue?'badge-danger':'badge-success'}`}>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div style={{fontSize:13,color:'#A0A0A0',marginBottom:12}}>Total marks: {a.totalMarks}</div>
                  {sub ? (
                    <div style={{background:'rgba(74,222,128,0.06)',border:'1px solid rgba(74,222,128,0.2)',borderRadius:10,padding:12}}>
                      <div style={{color:'#4ade80',fontWeight:600,marginBottom:4}}>Submitted</div>
                      <div style={{fontSize:13,color:'#A0A0A0'}}>{sub.text}</div>
                      {sub.marks!=null && <div style={{marginTop:8,color:'#4ade80'}}>Marks: {sub.marks}/{a.totalMarks} · {sub.feedback}</div>}
                    </div>
                  ) : (
                    <div style={{marginTop:12}}>
                      <div className="form-group"><label className="form-label">Your Answer</label><textarea className="form-input" value={form.text} onChange={e=>setForm({...form,text:e.target.value})} placeholder="Type your answer..." rows={3} /></div>
                      <button className="btn btn-primary" onClick={() => handleSubmit(a)} disabled={submitting===a._id}>{submitting===a._id?'Submitting...':'Submit Assignment'}</button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
