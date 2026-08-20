import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function TeacherAttendance() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState('');
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { api.get('/courses/my/teacher').then(r => { setCourses(r.data.data); setLoading(false); }); }, []);

  const selectCourse = (id) => {
    setSelected(id);
    const course = courses.find(c => c._id === id);
    if (course?.students) {
      setStudents(course.students);
      const init = {};
      course.students.forEach(s => { init[s._id] = 'present'; });
      setRecords(init);
    }
  };

  const handleSave = async () => {
    setSaving(true); setSuccess('');
    const recordsArr = students.map(s => ({ student: s._id, status: records[s._id] || 'absent' }));
    try { await api.post('/attendance', { course: selected, date, records: recordsArr }); setSuccess('Attendance saved!'); setTimeout(() => setSuccess(''), 3000); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Attendance</h1><p className="page-subtitle">Mark and manage student attendance</p></div>
      <div className="glass-card" style={{marginBottom:24}}>
        <div className="grid-2" style={{gap:16}}>
          <div className="form-group" style={{margin:0}}>
            <label className="form-label">Select Course</label>
            <select className="form-input" value={selected} onChange={e=>selectCourse(e.target.value)}>
              <option value="">Choose a course...</option>
              {courses.map(c=><option key={c._id} value={c._id}>{c.title} ({c.code})</option>)}
            </select>
          </div>
          <div className="form-group" style={{margin:0}}>
            <label className="form-label">Date</label>
            <input type="date" className="form-input" value={date} onChange={e=>setDate(e.target.value)} />
          </div>
        </div>
      </div>
      {success && <div className="alert alert-success">{success}</div>}
      {selected && students.length > 0 && (
        <div className="glass-card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <div className="section-title" style={{margin:0}}>Students ({students.length})</div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn btn-ghost btn-sm" onClick={() => { const r={}; students.forEach(s=>{r[s._id]='present';}); setRecords(r); }}>All Present</button>
              <button className="btn btn-ghost btn-sm" onClick={() => { const r={}; students.forEach(s=>{r[s._id]='absent';}); setRecords(r); }}>All Absent</button>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
            {students.map(s => (
              <div key={s._id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',background:'rgba(255,255,255,0.03)',borderRadius:10}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div className="user-avatar" style={{width:36,height:36,borderRadius:10,fontSize:14}}>{s.name?.charAt(0)}</div>
                  <div><div style={{fontWeight:600,fontSize:14}}>{s.name}</div><div style={{fontSize:12,color:'#A0A0A0'}}>{s.email}</div></div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  {['present','absent','late'].map(status => (
                    <button key={status} type="button"
                      className={`btn btn-sm ${records[s._id]===status ? (status==='present'?'btn-primary':status==='late'?'':'btn-danger') : 'btn-ghost'}`}
                      style={records[s._id]===status&&status==='late'?{background:'rgba(234,179,8,0.2)',color:'#facc15',border:'1px solid rgba(234,179,8,0.3)'}:{}}
                      onClick={() => setRecords({...records,[s._id]:status})}>
                      {status.charAt(0).toUpperCase()+status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={handleSave} disabled={saving}>{saving?'Saving...':'Save Attendance'}</button>
        </div>
      )}
      {selected && students.length === 0 && <div className="empty-state"><div className="empty-icon">👥</div><div className="empty-title">No students enrolled</div></div>}
    </div>
  );
}
