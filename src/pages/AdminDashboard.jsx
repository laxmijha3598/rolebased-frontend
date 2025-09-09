import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

// Support both Vite and CRA env styles safely
const viteApi = typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_BASE;
const craApi = typeof process !== 'undefined' && process?.env?.REACT_APP_API_BASE;
const API_BASE = viteApi || craApi || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', course: 'MERN Bootcamp' });
  const [editingId, setEditingId] = useState(null);

  async function loadStudents() {
    const { data } = await axios.get(`${API_BASE}/students`);
    setStudents(data.students);
  }

  useEffect(() => { loadStudents(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    await axios.post(`${API_BASE}/students`, form);
    setForm({ name: '', email: '', course: 'MERN Bootcamp' });
    await loadStudents();
  }

  async function handleUpdate(student) {
    await axios.put(`${API_BASE}/students/${student._id}`, { name: student.name, email: student.email, course: student.course });
    setEditingId(null);
    await loadStudents();
  }

  async function handleDelete(id) {
    await axios.delete(`${API_BASE}/students/${id}`);
    await loadStudents();
  }

  return (
    <div className="container">
      <div className="toolbar">
        <h2>Admin Dashboard</h2>
        <div className="row" style={{ gap: 8 }}>
          <span className="muted">{user?.email}</span>
          <button className="ghost" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h3>Add Student</h3>
          <form onSubmit={handleCreate} className="row" style={{ gap: 8 }}>
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input placeholder="Course" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
            <button type="submit" className="success">Add</button>
          </form>
        </div>
      </div>

      <div className="section">
        <h3>All Students</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Enrollment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td>
                  {editingId === s._id ? (
                    <input value={s.name} onChange={(e) => setStudents(students.map(x => x._id === s._id ? { ...x, name: e.target.value } : x))} />
                  ) : s.name}
                </td>
                <td>
                  {editingId === s._id ? (
                    <input value={s.email} onChange={(e) => setStudents(students.map(x => x._id === s._id ? { ...x, email: e.target.value } : x))} />
                  ) : s.email}
                </td>
                <td>
                  {editingId === s._id ? (
                    <input value={s.course || ''} onChange={(e) => setStudents(students.map(x => x._id === s._id ? { ...x, course: e.target.value } : x))} />
                  ) : (s.course || '')}
                </td>
                <td>{new Date(s.enrollmentDate).toLocaleDateString()}</td>
                <td>
                  {editingId === s._id ? (
                    <>
                      <button onClick={() => handleUpdate(s)}>Save</button>
                      <button className="ghost" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditingId(s._id)}>Edit</button>
                      <button className="danger" onClick={() => handleDelete(s._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


