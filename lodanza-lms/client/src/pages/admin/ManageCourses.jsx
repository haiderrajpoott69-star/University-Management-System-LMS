import { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdAdd, MdDelete, MdPeople } from 'react-icons/md';

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [depts, setDepts] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:'', code:'', description:'', department:'', teacher:'', credits:3, semester:'Fall', year: new Date().getFullYear() });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = () => Promise.all([
    api.get('/courses'), api.get('/admin/departments'), api.get('/admin/teachers')
  ]).then(([c, d, t]) => { setCourses(c.data.data); setDepts(d.data.data); setTeachers(t.data.data); setLoading(false); });

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try { await api.post('/courses', form); setShowModal(false); fetchAll(); }
    catch(err) { setError(err.message || 'Failed'); } finally { setSubmitting(false); }
  };

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Manage Courses</h1><p className="page-subtitle">{courses.length} courses available</p></div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:24}}>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><MdAdd /> New Course</button>
      </div>
      {loading ? <div className="spinner-wrap"><div className="spinner"></div></div> : (
        <div className="glass-card" style={{padding:0}}>
          <div className="table-wrap"><table className="data-table">
            <thead><tr><th>Course</th><th>Code</th><th>Department</th><th>Teacher</th><th>Students</th><th>Semester</th><th>Action</th></tr></thead>
            <tbody>{courses.map(c => (
              <tr key={c._id}>
                <td style={{fontWeight:600}}>{c.title}</td>
                <td><span className="badge badge-teacher">{c.code}</span></td>
                <td style={{color:'#A0A0A0'}}>{c.department?.name || 'N/A'}</td>
                <td style={{color:'#A0A0A0'}}>{c.teacher?.name || 'Unassigned'}</td>
                <td><div style={{display:'flex',alignItems:'center',gap:4}}><MdPeople style={{color:'#A0A0A0'}} />{c.students?.length || 0}</div></td>
                <td><span className="badge badge-success">{c.semester}</span></td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => api.delete(`/courses/${c._id}`).then(fetchAll)}><MdDelete style={{color:'#FF4D6D'}} /></button></td>
              </tr>
            ))}</tbody>
          </table>
          {courses.length === 0 && <div className="empty-state"><div className="empty-icon">📚</div><div className="empty-title">No courses yet</div></div>}
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">Create Course</div><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleCreate}>
                <div className="form-group"><label className="form-label">Course Title</label><input className="form-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Course Code</label><input className="form-input" value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})} required /></div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Department</label>
                  <select className="form-input" value={form.department} onChange={e=>setForm({...form,department:e.target.value})} required>
                    <option value="">Select Department</option>
                    {depts.map(d=><option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Teacher</label>
                  <select className="form-input" value={form.teacher} onChange={e=>setForm({...form,teacher:e.target.value})}>
                    <option value="">Select Teacher</option>
                    {teachers.map(t=><option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="grid-2" style={{gap:12}}>
                  <div className="form-group"><label className="form-label">Credits</label><input type="number" className="form-input" value={form.credits} onChange={e=>setForm({...form,credits:Number(e.target.value)})} min={1} max={6} /></div>
                  <div className="form-group"><label className="form-label">Semester</label>
                    <select className="form-input" value={form.semester} onChange={e=>setForm({...form,semester:e.target.value})}>
                      <option value="Fall">Fall</option><option value="Spring">Spring</option><option value="Summer">Summer</option>
                    </select>
                  </div>
                </div>
                <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting?'Creating...':'Create Course'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
