import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../services/api';

const COLORS = ['#FF4D6D', '#FF8C42', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/admin/analytics'), api.get('/admin/dashboard')]).then(([a, d]) => {
      setData({ analytics: a.data.data, stats: d.data.data });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  const pieData = [
    { name: 'Students', value: data?.stats?.totalStudents || 0 },
    { name: 'Teachers', value: data?.stats?.totalTeachers || 0 },
    { name: 'Courses', value: data?.stats?.totalCourses || 0 },
    { name: 'Departments', value: data?.stats?.totalDepartments || 0 },
  ];

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Analytics</h1><p className="page-subtitle">University performance overview</p></div>
      <div className="grid-2" style={{marginBottom:32}}>
        <div className="glass-card">
          <div className="section-title">Monthly Enrollment (2024)</div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data?.analytics?.enrollmentByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{fill:'#A0A0A0',fontSize:11}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:'#A0A0A0',fontSize:11}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{background:'#1E1E1E',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8}} />
              <Line type="monotone" dataKey="count" stroke="#FF4D6D" strokeWidth={2.5} dot={{ fill:'#FF4D6D',r:4 }} activeDot={{r:6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card">
          <div className="section-title">University Overview</div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{background:'#1E1E1E',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8}} />
              <Legend iconType="circle" formatter={(v) => <span style={{color:'#A0A0A0',fontSize:12}}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="glass-card">
        <div className="section-title">Courses by Department</div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data?.analytics?.coursesByDept || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{fill:'#A0A0A0',fontSize:11}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill:'#A0A0A0',fontSize:11}} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{background:'#1E1E1E',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8}} />
            <Bar dataKey="count" fill="url(#barGrad)" radius={[6,6,0,0]} />
            <defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="#FF4D6D" /></linearGradient></defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
