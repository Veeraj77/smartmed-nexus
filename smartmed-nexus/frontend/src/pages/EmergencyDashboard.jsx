import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { emergencyAPI } from '../services/api';

const priorityColors = { critical: 'bg-red-100 text-red-800', high: 'bg-orange-100 text-orange-800', medium: 'bg-yellow-100 text-yellow-800', low: 'bg-green-100 text-green-800' };
const statusColors = { pending: 'bg-gray-100 text-gray-800', dispatched: 'bg-blue-100 text-blue-800', en_route: 'bg-purple-100 text-purple-800', arrived: 'bg-green-100 text-green-800', in_progress: 'bg-yellow-100 text-yellow-800', completed: 'bg-gray-100 text-gray-500' };

const EmergencyDashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try { const res = await emergencyAPI.getAll({ limit: 50 }); setCases(res.data.data?.cases || []); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeCases = cases.filter((c) => c.status !== 'completed' && c.status !== 'cancelled');
  const critical = activeCases.filter((c) => c.priority === 'critical');

  const handleAssign = async (id) => {
    const ambulance = prompt('Enter ambulance ID:');
    if (!ambulance) return;
    try { await emergencyAPI.assign(id, ambulance); window.location.reload(); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleStatus = async (id, status) => {
    try { await emergencyAPI.updateStatus(id, status); window.location.reload(); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const filtered = filter ? cases.filter((c) => c.priority === filter) : cases;

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Emergency Response Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time emergency monitoring and response</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Active Cases</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{activeCases.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Critical</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{critical.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total Today</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{cases.filter((c) => new Date(c.createdAt).toDateString() === new Date().toDateString()).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Resolved</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{cases.filter((c) => c.status === 'completed').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Emergency Cases</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
            <option value="">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        {loading ? (
          <div className="animate-pulse space-y-3"><div className="h-12 bg-gray-100 rounded" /><div className="h-12 bg-gray-100 rounded" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">No emergency cases</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-200"><th className="text-left py-3 px-2 font-medium text-gray-500">Patient</th><th className="text-left py-3 px-2 font-medium text-gray-500">Priority</th><th className="text-left py-3 px-2 font-medium text-gray-500">Status</th><th className="text-left py-3 px-2 font-medium text-gray-500">Symptoms</th><th className="text-left py-3 px-2 font-medium text-gray-500">Ambulance</th><th className="text-right py-3 px-2 font-medium text-gray-500">Actions</th></tr></thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2"><p className="font-medium text-gray-900">{c.patientName}</p><p className="text-xs text-gray-500">{c.age} yrs</p></td>
                    <td className="py-3 px-2"><span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[c.priority]}`}>{c.priority}</span></td>
                    <td className="py-3 px-2"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status.replace('_', ' ')}</span></td>
                    <td className="py-3 px-2 max-w-xs truncate">{c.symptoms?.join(', ')}</td>
                    <td className="py-3 px-2">{c.assignedAmbulance || '-'}</td>
                    <td className="py-3 px-2 text-right space-x-2">
                      {c.status === 'pending' && <button onClick={() => handleAssign(c._id)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">Assign</button>}
                      {c.status === 'dispatched' && <button onClick={() => handleStatus(c._id, 'en_route')} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs hover:bg-purple-700">En Route</button>}
                      {c.status === 'en_route' && <button onClick={() => handleStatus(c._id, 'arrived')} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">Arrived</button>}
                      {c.status === 'arrived' && <button onClick={() => handleStatus(c._id, 'in_progress')} className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-xs hover:bg-yellow-700">In Progress</button>}
                      {c.status === 'in_progress' && <button onClick={() => handleStatus(c._id, 'completed')} className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs hover:bg-gray-700">Complete</button>}
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

export default EmergencyDashboard;
