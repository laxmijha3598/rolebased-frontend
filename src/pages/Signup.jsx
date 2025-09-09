import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const user = await signup({ name, email, password, role });
      navigate(user.role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed');
    }
  }

  return (
    <div className="center-page">
      <div className="card">
        <h2>Create your account</h2>
        <p className="muted">Join the MERN Bootcamp portal</p>
        <form onSubmit={handleSubmit} className="space-y">
          <div className="space-y">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required />
          </div>
          <div className="space-y">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y">
            <label>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" required />
          </div>
          <div className="space-y">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <p style={{ color: '#ef4444' }}>{error}</p>}
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <button type="submit">Create account</button>
            <Link className="link" to="/login">Back to login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}


