import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { appointmentAPI } from '../services/api';

const statusColors = { pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-green-100 text-green-800', completed: 'bg-blue-100 text-blue-800', cancelled: 'bg-red-100 text-red-800', no_show: 'bg-gray-100 text-gray-800' };

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    appointmentAPI.getMy({ status: filter || undefined }).then((res) => setAppointments(res.data.data || [])).catch(console.error).finally(() => setLoading(false));
  }, [filter]);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try { await appointmentAPI.cancel(id); setAppointments(appointments.map((a) => a._id === id ? { ...a, status: 'cancelled' } : a)); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-500 mt-1">View and manage your appointments</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {loading ? (
          <div className="animate-pulse space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded" />)}</div>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">No appointments found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-200"><th className="text-left py-3 px-2 font-medium text-gray-500">Hospital</th><th className="text-left py-3 px-2 font-medium text-gray-500">Doctor</th><th className="text-left py-3 px-2 font-medium text-gray-500">Date</th><th className="text-left py-3 px-2 font-medium text-gray-500">Time</th><th className="text-left py-3 px-2 font-medium text-gray-500">Status</th><th className="text-right py-3 px-2 font-medium text-gray-500">Action</th></tr></thead>
              <tbody>
                {appointments.map((app) => (
                  <tr key={app._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">{app.hospital?.name || 'N/A'}</td>
                    <td className="py-3 px-2">Dr. {app.doctor?.user?.name || 'N/A'}</td>
                    <td className="py-3 px-2">{new Date(app.appointmentDate).toLocaleDateString()}</td>
                    <td className="py-3 px-2">{app.timeSlot}</td>
                    <td className="py-3 px-2"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>{app.status}</span></td>
                    <td className="py-3 px-2 text-right">
                      {app.status === 'pending' && <button onClick={() => handleCancel(app._id)} className="text-red-600 hover:underline text-xs">Cancel</button>}
                      {app.status === 'confirmed' && <button onClick={() => handleCancel(app._id)} className="text-red-600 hover:underline text-xs">Cancel</button>}
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

export default Appointments;
