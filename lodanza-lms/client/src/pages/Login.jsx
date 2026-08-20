import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdEmail, MdLock } from 'react-icons/md';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-text">LODANZA LMS</div>
          <div className="auth-logo-sub">University of Science</div>
        </div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="you@lodanza.edu" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Enter your password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <div style={{marginBottom:20, display:'flex', justifyContent:'space-between', fontSize:13}}>
            <span></span>
            <a href="#" className="auth-link">Forgot password?</a>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
        </div>
        <div style={{marginTop:24,padding:16,background:'rgba(255,77,109,0.06)',borderRadius:12,fontSize:12,color:'#A0A0A0',lineHeight:1.8}}>
          <strong style={{color:'#FF4D6D'}}>Demo Credentials:</strong><br/>
          Admin: admin@lodanza.edu / admin123<br/>
          Teacher: sarah@lodanza.edu / teacher123<br/>
          Student: alice@lodanza.edu / student123
        </div>
      </div>
    </div>
  );
}
