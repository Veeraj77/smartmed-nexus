import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { hospitalAPI, doctorAPI, appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Hospitals = () => {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ appointmentDate: '', timeSlot: '', reason: '', type: 'in-person' });
  const [bookMsg, setBookMsg] = useState('');

  useEffect(() => {
    hospitalAPI.getAll().then((res) => { setHospitals(res.data.data?.hospitals || []); }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const selectHospital = async (h) => {
    setSelectedHospital(h);
    setSelectedDoctor(null);
    try { const res = await doctorAPI.getAll({ hospital: h._id }); setDoctors(res.data.data?.doctors || []); }
    catch (err) { console.error(err); }
  };

  const handleBook = async () => {
    if (!selectedDoctor || !booking.appointmentDate || !booking.timeSlot || !booking.reason) { setBookMsg('Please fill all fields'); return; }
    try {
      await appointmentAPI.book({
        doctor: selectedDoctor._id,
        hospital: selectedHospital._id,
        appointmentDate: booking.appointmentDate,
        timeSlot: booking.timeSlot,
        reason: booking.reason,
        type: booking.type,
      });
      setBookMsg('Appointment booked successfully!');
      setBooking({ appointmentDate: '', timeSlot: '', reason: '', type: 'in-person' });
    } catch (err) { setBookMsg(err.response?.data?.message || 'Booking failed'); }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hospitals</h1>
        <p className="text-gray-500 mt-1">Browse hospitals and book appointments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {loading ? (
            <div className="animate-pulse space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl" />)}</div>
          ) : (
            hospitals.map((h) => (
              <div key={h._id} onClick={() => selectHospital(h)} className={`p-4 rounded-xl border cursor-pointer transition-colors ${selectedHospital?._id === h._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
                <h3 className="font-semibold text-gray-900">{h.name}</h3>
                <p className="text-sm text-gray-500">{h.address?.city}, {h.address?.state}</p>
                <p className="text-xs text-gray-400 mt-1">{h.departments?.length || 0} departments · {h.availableBeds || 0} beds available</p>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedHospital && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedHospital.name}</h2>
              <p className="text-gray-500 text-sm mb-4">{selectedHospital.address?.street}, {selectedHospital.address?.city}, {selectedHospital.address?.state} {selectedHospital.address?.zip}</p>

              <h3 className="font-semibold mb-3">Available Doctors</h3>
              <div className="space-y-2 mb-6">
                {doctors.length === 0 ? (
                  <p className="text-sm text-gray-500">No doctors available at this hospital</p>
                ) : (
                  doctors.map((d) => (
                    <div key={d._id} onClick={() => setSelectedDoctor(d)} className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedDoctor?._id === d._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-gray-900">Dr. {d.user?.name}</p><p className="text-sm text-gray-500">{d.specialization}</p></div>
                        <p className="text-sm font-medium text-blue-600">₹{d.consultationFee}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selectedDoctor && user?.role === 'patient' && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold mb-3">Book Appointment with Dr. {selectedDoctor.user?.name}</h3>
                  {bookMsg && <div className={`mb-3 p-3 rounded-lg text-sm ${bookMsg.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{bookMsg}</div>}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input type="date" value={booking.appointmentDate} onChange={(e) => setBooking({ ...booking, appointmentDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                      <select value={booking.timeSlot} onChange={(e) => setBooking({ ...booking, timeSlot: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select time</option>
                        <option value="09:00 - 09:30">09:00 - 09:30</option>
                        <option value="09:30 - 10:00">09:30 - 10:00</option>
                        <option value="10:00 - 10:30">10:00 - 10:30</option>
                        <option value="10:30 - 11:00">10:30 - 11:00</option>
                        <option value="11:00 - 11:30">11:00 - 11:30</option>
                        <option value="14:00 - 14:30">14:00 - 14:30</option>
                        <option value="14:30 - 15:00">14:30 - 15:00</option>
                        <option value="15:00 - 15:30">15:00 - 15:30</option>
                        <option value="16:00 - 16:30">16:00 - 16:30</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                      <textarea value={booking.reason} onChange={(e) => setBooking({ ...booking, reason: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2} />
                    </div>
                  </div>
                  <button onClick={handleBook} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Book Appointment</button>
                </div>
              )}
              {selectedDoctor && user?.role !== 'patient' && (
                <p className="text-sm text-gray-500 mt-2">Please register as a patient to book appointments.</p>
              )}
            </div>
          )}
          {!selectedHospital && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <span className="text-4xl">🏥</span>
              <p className="text-gray-500 mt-4">Select a hospital from the list to view doctors and book appointments.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Hospitals;
