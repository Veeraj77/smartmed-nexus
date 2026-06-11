import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      const user = await login(form.email, form.password);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">SmartMed Nexus</h1>
          <p className="text-gray-500 mt-1">AI-Powered Healthcare Platform</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold mb-6">Sign In</h2>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
            </div>
            <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Sign In</button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
