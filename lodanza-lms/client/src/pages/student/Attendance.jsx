import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/attendance/my').then(r => { setAttendance(r.data.data); setLoading(false); }); }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  const overall = attendance.length > 0 ? Math.round(attendance.reduce((s,a) => s+a.percentage, 0) / attendance.length) : 0;

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Attendance</h1><p className="page-subtitle">Your attendance record across all courses</p></div>
      <div className="glass-card" style={{marginBottom:32,padding:32,textAlign:'center',maxWidth:300}}>
        <div style={{fontSize:48,fontWeight:900,background:'linear-gradient(135deg,#FF4D6D,#FF8C42)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{overall}%</div>
        <div style={{color:'#A0A0A0',marginTop:4}}>Overall Attendance</div>
        <div style={{marginTop:12,fontSize:13,color: overall>=75?'#4ade80':'#ff6b85'}}>{overall>=75?'✓ Good standing':'⚠ Below minimum (75%)'}</div>
      </div>
      {attendance.length === 0 ? <div className="empty-state"><div className="empty-icon">📅</div><div className="empty-title">No attendance data yet</div></div> : (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {attendance.map((a, i) => (
            <div key={i} className="glass-card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <div>
                  <div style={{fontWeight:700,fontSize:16}}>{a.course?.title}</div>
                  <div style={{fontSize:13,color:'#A0A0A0',marginTop:2}}>Total Classes: {a.total} · Present: {a.present} · Absent: {a.absent}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:28,fontWeight:800,color: a.percentage>=75?'#4ade80':'#ff6b85'}}>{a.percentage}%</div>
                  <div style={{fontSize:11,color:'#A0A0A0'}}>{a.percentage>=75?'On Track':'At Risk'}</div>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width:`${a.percentage}%`,background: a.percentage>=75?'linear-gradient(90deg,#10b981,#4ade80)':'linear-gradient(90deg,#FF4D6D,#FF8C42)'}}></div>
              </div>
              {a.percentage < 75 && (
                <div style={{marginTop:12,padding:'10px 14px',background:'rgba(255,77,109,0.08)',borderRadius:8,fontSize:13,color:'#ff6b85'}}>
                  ⚠ You need {Math.ceil((75*a.total - 100*a.present)/(100-75))} more classes to reach 75% attendance
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
