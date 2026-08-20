import { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdAdd, MdCampaign } from 'react-icons/md';

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:'', content:'', targetRole:'all' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => api.get('/admin/announcements').then(r => { setItems(r.data.data); setLoading(false); });
  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try { await api.post('/admin/announcements', form); setShowModal(false); setForm({title:'',content:'',targetRole:'all'}); fetch(); }
    catch(err) { setError(err.message || 'Failed'); } finally { setSubmitting(false); }
  };

  const roleColors = { all: 'badge-success', student: 'badge-student', teacher: 'badge-teacher' };

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Announcements</h1><p className="page-subtitle">Send announcements to students and teachers</p></div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:24}}>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><MdAdd /> New Announcement</button>
      </div>
      {loading ? <div className="spinner-wrap"><div className="spinner"></div></div> : (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {items.map(a => (
            <div key={a._id} className="glass-card" style={{padding:'20px 24px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <MdCampaign style={{color:'#FF4D6D',fontSize:22}} />
                  <div style={{fontSize:16,fontWeight:700}}>{a.title}</div>
                </div>
                <span className={`badge ${roleColors[a.targetRole] || 'badge-success'}`}>{a.targetRole}</span>
              </div>
              <p style={{fontSize:14,color:'#A0A0A0',lineHeight:1.7,marginBottom:12}}>{a.content}</p>
              <div style={{fontSize:12,color:'#666'}}>By {a.author?.name} · {new Date(a.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
          {items.length === 0 && <div className="empty-state"><div className="empty-icon">📢</div><div className="empty-title">No announcements yet</div></div>}
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">New Announcement</div><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleCreate}>
                <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Content</label><textarea className="form-input" rows={4} value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Target Audience</label>
                  <select className="form-input" value={form.targetRole} onChange={e=>setForm({...form,targetRole:e.target.value})}>
                    <option value="all">Everyone</option><option value="student">Students Only</option><option value="teacher">Teachers Only</option>
                  </select>
                </div>
                <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting?'Posting...':'Post Announcement'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
