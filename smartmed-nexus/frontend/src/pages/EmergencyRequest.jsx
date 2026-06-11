import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { emergencyAPI } from '../services/api';

const EmergencyRequest = () => {
  const [form, setForm] = useState({ patientName: '', age: '', gender: 'male', symptoms: '', medicalHistory: '', location: { address: '' }, contactPhone: '', timeSensitivity: 'medium' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const payload = {
        ...form,
        age: parseInt(form.age, 10),
        symptoms: form.symptoms.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const res = await emergencyAPI.create(payload);
      setResult(res.data.data);
    } catch (err) { setError(err.response?.data?.message || 'Request failed'); }
    finally { setLoading(false); }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Emergency Request</h1>
          <p className="text-gray-500 mt-1">Request immediate emergency assistance</p>
        </div>

        {result ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <span className="text-5xl">🚨</span>
            <h2 className="text-xl font-bold mt-4">Emergency Request Submitted</h2>
            <div className={`mt-4 inline-block px-4 py-2 rounded-full text-lg font-bold ${
              result.triage?.priority === 'critical' ? 'bg-red-100 text-red-800' :
              result.triage?.priority === 'high' ? 'bg-orange-100 text-orange-800' :
              result.triage?.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              Priority: {result.triage?.priority?.toUpperCase()}
            </div>
            <p className="text-gray-500 mt-2">AI Score: {result.triage?.score}/100</p>
            <p className="text-sm text-gray-400 mt-4">Help is on the way. Stay where you are.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input type="text" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" min="0" max="150" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Sensitivity</label>
                  <select value={form.timeSensitivity} onChange={(e) => setForm({ ...form, timeSensitivity: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms (comma separated)</label>
                <textarea value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2} placeholder="e.g. chest pain, difficulty breathing" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                <textarea value={form.medicalHistory} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2} placeholder="Any pre-existing conditions" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Address</label>
                <input type="text" value={form.location.address} onChange={(e) => setForm({ ...form, location: { address: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <input type="tel" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50">
                {loading ? 'Submitting...' : '🚨 Request Emergency Help'}
              </button>
            </form>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default EmergencyRequest;
