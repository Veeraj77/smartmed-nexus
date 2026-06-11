import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await appointmentAPI.getMy({ limit: 50 });
        setAppointments(res.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const pending = appointments.filter((a) => a.status === 'pending');
  const confirmed = appointments.filter((a) => a.status === 'confirmed');
  const completed = appointments.filter((a) => a.status === 'completed');
  const today = appointments.filter((a) => {
    const d = new Date(a.appointmentDate).toDateString();
    return d === new Date().toDateString();
  });

  const handleStatus = async (id, status) => {
    try { await appointmentAPI.updateStatus(id, status); window.location.reload(); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome, Dr. {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{today.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{pending.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{confirmed.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{completed.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Pending Appointments</h2>
        {loading ? (
          <div className="animate-pulse space-y-3"><div className="h-10 bg-gray-100 rounded" /><div className="h-10 bg-gray-100 rounded" /></div>
        ) : pending.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending appointments</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-200"><th className="text-left py-3 px-2 font-medium text-gray-500">Patient</th><th className="text-left py-3 px-2 font-medium text-gray-500">Date</th><th className="text-left py-3 px-2 font-medium text-gray-500">Time</th><th className="text-left py-3 px-2 font-medium text-gray-500">Reason</th><th className="text-right py-3 px-2 font-medium text-gray-500">Actions</th></tr></thead>
              <tbody>
                {pending.map((app) => (
                  <tr key={app._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">{app.patient?.name || 'N/A'}</td>
                    <td className="py-3 px-2">{new Date(app.appointmentDate).toLocaleDateString()}</td>
                    <td className="py-3 px-2">{app.timeSlot}</td>
                    <td className="py-3 px-2 max-w-xs truncate">{app.reason}</td>
                    <td className="py-3 px-2 text-right space-x-2">
                      <button onClick={() => handleStatus(app._id, 'confirmed')} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">Accept</button>
                      <button onClick={() => handleStatus(app._id, 'cancelled')} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DoctorDashboard;
