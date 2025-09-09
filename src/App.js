import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';

function ProtectedRoute({ children, roles }) {
	const { user } = useAuth();
	if (!user) return <Navigate to="/login" replace />;
	if (roles && !roles.includes(user.role)) return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
	return children;
}

function AppRoutes() {
	const { user } = useAuth();
	return (
		<Routes>
			<Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/student') : '/login'} replace />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/admin" element={<ProtectedRoute roles={[ 'admin' ]}><AdminDashboard /></ProtectedRoute>} />
			<Route path="/student" element={<ProtectedRoute roles={[ 'student', 'admin' ]}><StudentDashboard /></ProtectedRoute>} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

export default function App() {
	return (
		<AuthProvider>
			<AppRoutes />
		</AuthProvider>
	);
}
