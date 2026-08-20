import { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdAdd, MdDelete } from 'react-icons/md';

export default function ManageDepartments() {
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:'', code:'', description:'' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => api.get('/admin/departments').then(r => { setDepts(r.data.data); setLoading(false); });
  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try { await api.post('/admin/departments', form); setShowModal(false); setForm({name:'',code:'',description:''}); fetch(); }
    catch(err) { setError(err.message || 'Failed'); } finally { setSubmitting(false); }
  };

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Departments</h1><p className="page-subtitle">{depts.length} academic departments</p></div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:24}}>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><MdAdd /> New Department</button>
      </div>
      {loading ? <div className="spinner-wrap"><div className="spinner"></div></div> : (
        <div className="grid-3">
          {depts.map(d => (
            <div key={d._id} className="glass-card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                <div style={{background:'rgba(255,77,109,0.1)',borderRadius:8,padding:'4px 10px',fontSize:12,fontWeight:700,color:'#FF4D6D'}}>{d.code}</div>
                <button className="btn btn-ghost btn-sm" onClick={() => api.delete(`/admin/departments/${d._id}`).then(fetch)}><MdDelete style={{color:'#FF4D6D'}} /></button>
              </div>
              <div style={{fontSize:17,fontWeight:700,marginBottom:8}}>{d.name}</div>
              <div style={{fontSize:13,color:'#A0A0A0'}}>{d.description || 'No description'}</div>
              {d.head && <div style={{marginTop:12,fontSize:13,color:'#A0A0A0'}}>Head: {d.head.name}</div>}
            </div>
          ))}
          {depts.length === 0 && <div className="empty-state"><div className="empty-icon">🏛️</div><div className="empty-title">No departments yet</div></div>}
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">Create Department</div><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleCreate}>
                <div className="form-group"><label className="form-label">Department Name</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Code (e.g. CS, MATH)</label><input className="form-input" value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})} required /></div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
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
