import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmergencyDashboard from './pages/EmergencyDashboard';
import Hospitals from './pages/Hospitals';
import Appointments from './pages/Appointments';
import EmergencyRequest from './pages/EmergencyRequest';

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}/dashboard`} replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/patient/dashboard" element={<ProtectedRoute roles={['patient']}><PatientDashboard /></ProtectedRoute>} />
      <Route path="/patient/hospitals" element={<ProtectedRoute roles={['patient']}><Hospitals /></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute roles={['patient']}><Appointments /></ProtectedRoute>} />
      <Route path="/patient/emergency" element={<ProtectedRoute roles={['patient']}><EmergencyRequest /></ProtectedRoute>} />

      <Route path="/doctor/dashboard" element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

      <Route path="/emergency/dashboard" element={<ProtectedRoute roles={['emergency_unit']}><EmergencyDashboard /></ProtectedRoute>} />
      <Route path="/emergency/cases" element={<ProtectedRoute roles={['emergency_unit']}><EmergencyDashboard /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
