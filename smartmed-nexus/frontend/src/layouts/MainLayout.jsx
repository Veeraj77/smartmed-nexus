import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = {
  patient: [
    { label: 'Dashboard', path: '/patient/dashboard', icon: '📊' },
    { label: 'Hospitals', path: '/patient/hospitals', icon: '🏥' },
    { label: 'My Appointments', path: '/patient/appointments', icon: '📅' },
    { label: 'Emergency', path: '/patient/emergency', icon: '🚨' },
  ],
  doctor: [
    { label: 'Dashboard', path: '/doctor/dashboard', icon: '📊' },
    { label: 'Schedule', path: '/doctor/schedule', icon: '📋' },
    { label: 'Appointments', path: '/doctor/appointments', icon: '📅' },
    { label: 'Patients', path: '/doctor/patients', icon: '👥' },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Hospitals', path: '/admin/hospitals', icon: '🏥' },
    { label: 'Doctors', path: '/admin/doctors', icon: '👨‍⚕️' },
    { label: 'Patients', path: '/admin/patients', icon: '👥' },
    { label: 'Emergency', path: '/admin/emergency', icon: '🚨' },
  ],
  emergency_unit: [
    { label: 'Dashboard', path: '/emergency/dashboard', icon: '📊' },
    { label: 'Active Cases', path: '/emergency/cases', icon: '🚨' },
    { label: 'Ambulances', path: '/emergency/ambulances', icon: '🚑' },
  ],
};

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const items = navItems[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {sidebarOpen && (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <Link to="/" className="text-xl font-bold text-blue-600">SmartMed Nexus</Link>
          </div>
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full text-left text-sm text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Sign Out
            </button>
          </div>
        </aside>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex-1" />
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
