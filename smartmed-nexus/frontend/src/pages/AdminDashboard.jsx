import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MainLayout from '../layouts/MainLayout';
import { hospitalAPI, appointmentAPI, emergencyAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ hospitals: 0, totalAppointments: 0, emergencies: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hospRes, appRes, emRes] = await Promise.all([
          hospitalAPI.getAll({ limit: 1 }),
          appointmentAPI.getMy({ limit: 100 }),
          emergencyAPI.getAll({ limit: 1 }),
        ]);
        const apps = appRes.data.data || [];
        setStats({
          hospitals: hospRes.data.data?.total || 0,
          totalAppointments: apps.length,
          emergencies: emRes.data.data?.total || 0,
        });

        const statusCounts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
        apps.forEach((a) => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1; });
        setChartData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Hospitals</p><p className="text-3xl font-bold text-gray-900 mt-1">{stats.hospitals}</p></div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center"><span className="text-2xl">🏥</span></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Appointments</p><p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalAppointments}</p></div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center"><span className="text-2xl">📅</span></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Emergency Cases</p><p className="text-3xl font-bold text-red-600 mt-1">{stats.emergencies}</p></div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center"><span className="text-2xl">🚨</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Appointment Status</h2>
          {loading ? (
            <div className="animate-pulse h-64 bg-gray-100 rounded" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/admin/hospitals" className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
              <span className="text-2xl">🏥</span>
              <div><p className="font-medium text-gray-900">Manage Hospitals</p><p className="text-sm text-gray-500">Add, edit, or remove hospitals</p></div>
            </a>
            <a href="/admin/doctors" className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
              <span className="text-2xl">👨‍⚕️</span>
              <div><p className="font-medium text-gray-900">Manage Doctors</p><p className="text-sm text-gray-500">Add and manage doctor profiles</p></div>
            </a>
            <a href="/admin/emergency" className="flex items-center gap-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
              <span className="text-2xl">🚨</span>
              <div><p className="font-medium text-gray-900">Emergency Monitor</p><p className="text-sm text-gray-500">Monitor active emergency cases</p></div>
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
