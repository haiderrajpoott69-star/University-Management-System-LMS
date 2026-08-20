import { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdPeople, MdSchool } from 'react-icons/md';

export default function StudentCourses() {
  const [enrolled, setEnrolled] = useState([]);
  const [available, setAvailable] = useState([]);
  const [tab, setTab] = useState('enrolled');
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState('');

  const fetchAll = () => Promise.all([api.get('/courses/my/student'), api.get('/courses')])
    .then(([my, all]) => { setEnrolled(my.data.data); setAvailable(all.data.data); }).finally(() => setLoading(false));
  useEffect(() => { fetchAll(); }, []);

  const enroll = async (id) => {
    setEnrolling(id);
    try { await api.post(`/courses/${id}/enroll`); fetchAll(); } finally { setEnrolling(''); }
  };

  const isEnrolled = (id) => enrolled.some(c => c._id === id);

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Courses</h1><p className="page-subtitle">Browse and enroll in courses</p></div>
      <div className="tabs" style={{maxWidth:300}}>
        <button className={`tab ${tab==='enrolled'?'active':''}`} onClick={() => setTab('enrolled')}>My Courses ({enrolled.length})</button>
        <button className={`tab ${tab==='all'?'active':''}`} onClick={() => setTab('all')}>All Courses</button>
      </div>
      {tab === 'enrolled' && (
        enrolled.length === 0 ? <div className="empty-state"><div className="empty-icon">📚</div><div className="empty-title">Not enrolled in any courses</div><div className="empty-text">Browse all courses to enroll</div></div> : (
          <div className="grid-3">
            {enrolled.map(c => (
              <div key={c._id} className="course-card">
                <div className="course-card-header"><span className="course-code">{c.code}</span></div>
                <div className="course-title">{c.title}</div>
                <div className="course-meta"><span>👨‍🏫 {c.teacher?.name || 'TBA'}</span><span>🏛️ {c.department?.name}</span><span>📅 {c.semester} {c.year}</span></div>
                <div className="course-footer"><span style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:'#A0A0A0'}}><MdPeople />{c.students?.length} enrolled</span><span style={{fontSize:12,color:'#FF8C42'}}>{c.credits} credits</span></div>
              </div>
            ))}
          </div>
        )
      )}
      {tab === 'all' && (
        <div className="grid-3">
          {available.map(c => (
            <div key={c._id} className="course-card">
              <div className="course-card-header"><span className="course-code">{c.code}</span>{isEnrolled(c._id)&&<span className="badge badge-success" style={{fontSize:11}}>Enrolled</span>}</div>
              <div className="course-title">{c.title}</div>
              <div className="course-meta"><span>👨‍🏫 {c.teacher?.name || 'TBA'}</span><span>🏛️ {c.department?.name}</span></div>
              <div className="course-footer">
                <span style={{fontSize:12,color:'#A0A0A0'}}>{c.credits} credits</span>
                {!isEnrolled(c._id) && <button className="btn btn-primary btn-sm" onClick={() => enroll(c._id)} disabled={enrolling===c._id}>{enrolling===c._id?'...':'Enroll'}</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
