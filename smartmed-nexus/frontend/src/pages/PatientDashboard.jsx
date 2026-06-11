import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { appointmentAPI, emergencyAPI, hospitalAPI } from '../services/api';

const PatientDashboard = () => {
  const [stats, setStats] = useState({ appointments: 0, upcoming: 0, hospitals: 0 });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, hospRes] = await Promise.all([
          appointmentAPI.getMy({ limit: 5 }),
          hospitalAPI.getAll({ limit: 1 }),
        ]);
        const apps = appRes.data.data || [];
        setRecentAppointments(apps);
        setStats({
          appointments: apps.length,
          upcoming: apps.filter((a) => a.status === 'pending' || a.status === 'confirmed').length,
          hospitals: hospRes.data.data?.total || 0,
        });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your healthcare appointments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Appointments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.appointments}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center"><span className="text-2xl">📅</span></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.upcoming}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center"><span className="text-2xl">✅</span></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Hospitals</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.hospitals}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center"><span className="text-2xl">🏥</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Appointments</h2>
            <Link to="/patient/appointments" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          {loading ? (
            <div className="animate-pulse space-y-3"><div className="h-10 bg-gray-100 rounded" /><div className="h-10 bg-gray-100 rounded" /><div className="h-10 bg-gray-100 rounded" /></div>
          ) : recentAppointments.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">No appointments yet</p>
          ) : (
            <div className="space-y-3">
              {recentAppointments.slice(0, 5).map((app) => (
                <div key={app._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{app.hospital?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{new Date(app.appointmentDate).toLocaleDateString()} - {app.timeSlot}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    app.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                    app.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                    app.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>{app.status}</span>
                </div>
              ))}
            </div>
          )}
          <Link to="/patient/appointments" className="mt-4 inline-block text-sm text-blue-600 hover:underline">Manage Appointments →</Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/patient/hospitals" className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="text-2xl">🏥</span>
              <div><p className="font-medium text-gray-900">Browse Hospitals</p><p className="text-sm text-gray-500">Find and book appointments at hospitals</p></div>
            </Link>
            <Link to="/patient/emergency" className="flex items-center gap-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <span className="text-2xl">🚨</span>
              <div><p className="font-medium text-gray-900">Emergency Help</p><p className="text-sm text-gray-500">Request emergency assistance immediately</p></div>
            </Link>
            <Link to="/patient/appointments" className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="text-2xl">📅</span>
              <div><p className="font-medium text-gray-900">My Appointments</p><p className="text-sm text-gray-500">View and manage your bookings</p></div>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatientDashboard;
