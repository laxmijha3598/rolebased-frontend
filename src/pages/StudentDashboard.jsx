import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

// Support both Vite and CRA env styles safely
const viteApi = typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_BASE;
const craApi = typeof process !== 'undefined' && process?.env?.REACT_APP_API_BASE;
const API_BASE = viteApi || craApi || 'http://localhost:5000/api';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  async function loadProfile() {
    const { data } = await axios.get(`${API_BASE}/students/me`);
    setProfile(data.student);
  }

  useEffect(() => { loadProfile(); }, []);

  async function handleSave() {
    await axios.put(`${API_BASE}/students/me`, { name: profile.name, email: profile.email, course: profile.course });
    await loadProfile();
  }

  if (!profile) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="toolbar">
        <h2>Student Dashboard</h2>
        <button className="ghost" onClick={logout}>Logout</button>
      </div>

      <div className="card">
        <div className="grid grid-2">
          <div className="space-y">
            <label>Name</label>
            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div className="space-y">
            <label>Email</label>
            <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          </div>
          <div className="space-y">
            <label>Course</label>
            <input value={profile.course || ''} onChange={(e) => setProfile({ ...profile, course: e.target.value })} />
          </div>
          <div className="space-y">
            <label>Enrollment</label>
            <input value={new Date(profile.enrollmentDate).toLocaleDateString()} readOnly />
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button onClick={handleSave}>Save changes</button>
        </div>
      </div>
    </div>
  );
}


