import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const hospitalAPI = {
  getAll: (params) => api.get('/hospitals', { params }),
  getById: (id) => api.get(`/hospitals/${id}`),
  create: (data) => api.post('/hospitals', data),
  update: (id, data) => api.put(`/hospitals/${id}`, data),
  delete: (id) => api.delete(`/hospitals/${id}`),
};

export const doctorAPI = {
  getAll: (params) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  updateSchedule: (data) => api.put('/doctors/schedule', data),
  getAppointments: (id, params) => api.get(`/doctors/${id}/appointments`, { params }),
  create: (data) => api.post('/doctors', data),
};

export const appointmentAPI = {
  book: (data) => api.post('/appointments', data),
  getMy: (params) => api.get('/appointments', { params }),
  cancel: (id, reason) => api.put(`/appointments/${id}/cancel`, { reason }),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
};

export const medicalRecordAPI = {
  getPatientRecords: (patientId) => api.get(`/medical-records/patient/${patientId}`),
  create: (data) => api.post('/medical-records', data),
  update: (id, data) => api.put(`/medical-records/${id}`, data),
};

export const emergencyAPI = {
  create: (data) => api.post('/emergency', data),
  getAll: (params) => api.get('/emergency', { params }),
  getById: (id) => api.get(`/emergency/${id}`),
  assign: (id, ambulanceId) => api.put(`/emergency/${id}/assign`, { ambulanceId }),
  updateStatus: (id, status) => api.put(`/emergency/${id}/status`, { status }),
};

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
};

export default api;
