import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name||'', phone: user?.phone||'', address: user?.address||'' });
  const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'', confirm:'' });
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('profile');

  const handleProfile = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try { const r = await api.put('/auth/profile', form); updateUser(r.data.data); setSuccess('Profile updated!'); setTimeout(()=>setSuccess(''),3000); }
    catch(err) { setError(err.message||'Failed'); } finally { setSaving(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault(); setError('');
    if (pwForm.newPassword !== pwForm.confirm) return setError('Passwords do not match');
    setPwSaving(true);
    try { await api.put('/auth/change-password', { currentPassword:pwForm.currentPassword, newPassword:pwForm.newPassword }); setSuccess('Password changed!'); setPwForm({currentPassword:'',newPassword:'',confirm:''}); setTimeout(()=>setSuccess(''),3000); }
    catch(err) { setError(err.message||'Failed'); } finally { setPwSaving(false); }
  };

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Profile Settings</h1><p className="page-subtitle">Manage your account information</p></div>
      <div style={{display:'flex',gap:32,alignItems:'flex-start'}}>
        <div style={{width:220,flexShrink:0}}>
          <div className="glass-card" style={{textAlign:'center'}}>
            <div style={{width:80,height:80,borderRadius:20,background:'linear-gradient(135deg,#FF4D6D,#FF8C42)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,fontWeight:800,color:'#fff',margin:'0 auto 16px'}}>{user?.name?.charAt(0)}</div>
            <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{user?.name}</div>
            <div style={{marginBottom:8}}><span className={`badge badge-${user?.role}`}>{user?.role}</span></div>
            <div style={{fontSize:13,color:'#A0A0A0'}}>{user?.email}</div>
          </div>
        </div>
        <div style={{flex:1}}>
          <div className="tabs" style={{maxWidth:320}}>
            <button className={`tab ${tab==='profile'?'active':''}`} onClick={()=>setTab('profile')}>Personal Info</button>
            <button className={`tab ${tab==='password'?'active':''}`} onClick={()=>setTab('password')}>Password</button>
          </div>
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          {tab==='profile' && (
            <div className="glass-card">
              <form onSubmit={handleProfile}>
                <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={user?.email} disabled style={{opacity:0.6,cursor:'not-allowed'}} /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+1 234 567 890" /></div>
                <div className="form-group"><label className="form-label">Address</label><textarea className="form-input" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} rows={3} placeholder="Your address..." /></div>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving...':'Save Changes'}</button>
              </form>
            </div>
          )}
          {tab==='password' && (
            <div className="glass-card">
              <form onSubmit={handlePassword}>
                <div className="form-group"><label className="form-label">Current Password</label><input type="password" className="form-input" value={pwForm.currentPassword} onChange={e=>setPwForm({...pwForm,currentPassword:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">New Password</label><input type="password" className="form-input" value={pwForm.newPassword} onChange={e=>setPwForm({...pwForm,newPassword:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Confirm New Password</label><input type="password" className="form-input" value={pwForm.confirm} onChange={e=>setPwForm({...pwForm,confirm:e.target.value})} required /></div>
                <button type="submit" className="btn btn-primary" disabled={pwSaving}>{pwSaving?'Changing...':'Change Password'}</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
