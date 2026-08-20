import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/admin/dashboard'), api.get('/admin/analytics')])
      .then(([s, a]) => { setStats(s.data.data); setAnalytics(a.data.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: '🎓', color: '#FF4D6D' },
    { label: 'Total Teachers', value: stats?.totalTeachers || 0, icon: '👨‍🏫', color: '#FF8C42' },
    { label: 'Active Courses', value: stats?.totalCourses || 0, icon: '📚', color: '#8B5CF6' },
    { label: 'Departments', value: stats?.totalDepartments || 0, icon: '🏛️', color: '#06B6D4' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of Lodanza University LMS</p>
      </div>
      <div className="grid-4" style={{marginBottom:32}}>
        {statCards.map((c, i) => (
          <div key={i} className="stat-card animate-fade" style={{animationDelay:`${i*0.08}s`}}>
            <div className="stat-icon" style={{background:`${c.color}22`}}>{c.icon}</div>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="grid-2" style={{marginBottom:32}}>
        <div className="glass-card">
          <div className="section-title">Student Enrollment (2024)</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics?.enrollmentByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{fill:'#A0A0A0',fontSize:11}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:'#A0A0A0',fontSize:11}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{background:'#1E1E1E',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8}} />
              <Bar dataKey="count" fill="url(#grad1)" radius={[6,6,0,0]} />
              <defs><linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF4D6D" /><stop offset="100%" stopColor="#FF8C42" /></linearGradient></defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card">
          <div className="section-title">Courses by Department</div>
          {analytics?.coursesByDept?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analytics.coursesByDept} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{fill:'#A0A0A0',fontSize:11}} axisLine={false} />
                <YAxis dataKey="name" type="category" tick={{fill:'#A0A0A0',fontSize:11}} axisLine={false} width={80} />
                <Tooltip contentStyle={{background:'#1E1E1E',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8}} />
                <Bar dataKey="count" fill="#8B5CF6" radius={[0,6,6,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><div className="empty-text">No data yet</div></div>}
        </div>
      </div>
      <div className="glass-card">
        <div className="section-title">Recent Users</div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
            <tbody>
              {stats?.recentUsers?.map(u => (
                <tr key={u._id}>
                  <td style={{fontWeight:600}}>{u.name}</td>
                  <td style={{color:'#A0A0A0'}}>{u.email}</td>
                  <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                  <td style={{color:'#A0A0A0',fontSize:13}}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
