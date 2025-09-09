import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="center-page">
      <div className="card">
        <h2>Welcome back</h2>
        <p className="muted">Sign in to continue</p>
        <form onSubmit={handleSubmit} className="space-y">
          <div className="space-y">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y">
            <label>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" required />
          </div>
          {error && <p style={{ color: '#ef4444' }}>{error}</p>}
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <button type="submit">Login</button>
            <Link className="link" to="/signup">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}


