import { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdPeople, MdMenuBook } from 'react-icons/md';

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matForm, setMatForm] = useState({ title:'', fileUrl:'', fileType:'pdf' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { api.get('/courses/my/teacher').then(r => { setCourses(r.data.data); setLoading(false); }); }, []);

  const uploadMaterial = async (e) => {
    e.preventDefault(); setUploading(true);
    try {
      const r = await api.post(`/courses/${selected._id}/materials`, matForm);
      setSelected(r.data.data); setMatForm({title:'',fileUrl:'',fileType:'pdf'});
      setCourses(prev => prev.map(c => c._id === selected._id ? r.data.data : c));
    } finally { setUploading(false); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1 className="page-title">My Courses</h1><p className="page-subtitle">{courses.length} courses assigned</p></div>
      <div className="grid-2">
        <div>
          {courses.length === 0 ? <div className="empty-state"><div className="empty-icon">📚</div><div className="empty-title">No courses yet</div><div className="empty-text">Contact admin to get courses assigned</div></div> : (
            courses.map(c => (
              <div key={c._id} className="glass-card" style={{marginBottom:16,cursor:'pointer',borderColor: selected?._id===c._id?'rgba(255,77,109,0.5)':undefined}} onClick={() => setSelected(c)}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                  <span className="course-code">{c.code}</span>
                  <span style={{display:'flex',alignItems:'center',gap:4,fontSize:13,color:'#A0A0A0'}}><MdPeople />{c.students?.length}</span>
                </div>
                <div className="course-title">{c.title}</div>
                <div style={{fontSize:13,color:'#A0A0A0'}}>{c.department?.name} · {c.credits} credits · {c.semester}</div>
                <div style={{marginTop:12,fontSize:12,color:'#666'}}>{c.materials?.length || 0} materials uploaded</div>
              </div>
            ))
          )}
        </div>
        {selected && (
          <div className="glass-card">
            <div style={{marginBottom:20}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>{selected.title}</div>
              <div style={{fontSize:13,color:'#A0A0A0'}}>{selected.description}</div>
            </div>
            <div className="section-title">Course Materials</div>
            {selected.materials?.length === 0 ? <div style={{color:'#666',fontSize:14,marginBottom:16}}>No materials uploaded yet</div> : (
              selected.materials?.map((m, i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <span style={{fontSize:20}}>{m.fileType==='pdf'?'📄':m.fileType==='video'?'🎬':'📁'}</span>
                  <div><div style={{fontWeight:600,fontSize:14}}>{m.title}</div><div style={{fontSize:12,color:'#A0A0A0'}}>{m.fileType.toUpperCase()}</div></div>
                </div>
              ))
            )}
            <form onSubmit={uploadMaterial} style={{marginTop:20}}>
              <div className="form-group"><label className="form-label">Material Title</label><input className="form-input" value={matForm.title} onChange={e=>setMatForm({...matForm,title:e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">File URL</label><input className="form-input" placeholder="https://..." value={matForm.fileUrl} onChange={e=>setMatForm({...matForm,fileUrl:e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Type</label>
                <select className="form-input" value={matForm.fileType} onChange={e=>setMatForm({...matForm,fileType:e.target.value})}>
                  <option value="pdf">PDF</option><option value="video">Video</option><option value="doc">Document</option><option value="other">Other</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={uploading}>{uploading?'Uploading...':'Upload Material'}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
