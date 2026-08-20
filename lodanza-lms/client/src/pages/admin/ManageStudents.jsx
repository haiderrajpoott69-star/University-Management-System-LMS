import { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchStudents = () => api.get('/admin/students').then(r => { setStudents(r.data.data); setLoading(false); });
  useEffect(() => { fetchStudents(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try { await api.post('/admin/users', { ...form, role: 'student' }); setShowModal(false); setForm({ name:'', email:'', password:'', role:'student' }); fetchStudents(); }
    catch(err) { setError(err.message || 'Failed to create student'); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this student?')) return;
    await api.delete(`/admin/users/${id}`); fetchStudents();
  };

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Students</h1>
        <p className="page-subtitle">{students.length} students enrolled</p>
      </div>
      <div style={{display:'flex', gap:16, marginBottom:24, alignItems:'center'}}>
        <div style={{flex:1, position:'relative'}}>
          <MdSearch style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#A0A0A0',fontSize:18}} />
          <input className="form-input" style={{paddingLeft:38}} placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><MdAdd /> Add Student</button>
      </div>
      {loading ? <div className="spinner-wrap"><div className="spinner"></div></div> : (
        <div className="glass-card" style={{padding:0}}>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s._id}>
                    <td><div style={{display:'flex',alignItems:'center',gap:12}}><div className="user-avatar" style={{width:34,height:34,borderRadius:8,fontSize:13}}>{s.name.charAt(0)}</div><span style={{fontWeight:600}}>{s.name}</span></div></td>
                    <td style={{color:'#A0A0A0'}}>{s.email}</td>
                    <td><span className={`badge ${s.isActive ? 'badge-success' : 'badge-danger'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td style={{color:'#A0A0A0',fontSize:13}}>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td><div style={{display:'flex',gap:8}}>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(s._id)}><MdDelete style={{color:'#FF4D6D'}} /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="empty-state"><div className="empty-icon">🎓</div><div className="empty-title">No students found</div></div>}
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">Add New Student</div><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleCreate}>
                <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="Student name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" placeholder="student@lodanza.edu" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Password</label><input type="password" className="form-input" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required /></div>
                <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating...' : 'Create Student'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
