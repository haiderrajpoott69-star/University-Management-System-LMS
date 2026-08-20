import { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdAdd, MdDelete, MdSearch } from 'react-icons/md';

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => api.get('/admin/teachers').then(r => { setTeachers(r.data.data); setLoading(false); });
  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try { await api.post('/admin/users', {...form, role:'teacher'}); setShowModal(false); setForm({name:'',email:'',password:''}); fetch(); }
    catch(err) { setError(err.message || 'Failed'); } finally { setSubmitting(false); }
  };

  const filtered = teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Manage Teachers</h1><p className="page-subtitle">{teachers.length} faculty members</p></div>
      <div style={{display:'flex',gap:16,marginBottom:24}}>
        <div style={{flex:1,position:'relative'}}><MdSearch style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#A0A0A0',fontSize:18}} /><input className="form-input" style={{paddingLeft:38}} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><MdAdd /> Add Teacher</button>
      </div>
      {loading ? <div className="spinner-wrap"><div className="spinner"></div></div> : (
        <div className="glass-card" style={{padding:0}}>
          <div className="table-wrap"><table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Joined</th><th>Action</th></tr></thead>
            <tbody>{filtered.map(t => (
              <tr key={t._id}>
                <td><div style={{display:'flex',alignItems:'center',gap:12}}><div className="user-avatar" style={{width:34,height:34,borderRadius:8,fontSize:13,background:'linear-gradient(135deg,#FF8C42,#FF4D6D)'}}>{t.name.charAt(0)}</div><span style={{fontWeight:600}}>{t.name}</span></div></td>
                <td style={{color:'#A0A0A0'}}>{t.email}</td>
                <td><span className={`badge ${t.isActive?'badge-success':'badge-danger'}`}>{t.isActive?'Active':'Inactive'}</span></td>
                <td style={{color:'#A0A0A0',fontSize:13}}>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => api.delete(`/admin/users/${t._id}`).then(fetch)}><MdDelete style={{color:'#FF4D6D'}} /></button></td>
              </tr>
            ))}</tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state"><div className="empty-icon">👨‍🏫</div><div className="empty-title">No teachers found</div></div>}
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">Add Teacher</div><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleCreate}>
                <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Password</label><input type="password" className="form-input" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required /></div>
                <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting?'Adding...':'Add Teacher'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
