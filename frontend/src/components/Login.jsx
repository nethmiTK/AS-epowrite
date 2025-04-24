import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('http://localhost:3001/api/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 px-4">
      <motion.form
        onSubmit={handleSubmit}
        className="backdrop-blur-lg bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl w-full max-w-md space-y-6 transform hover:scale-105 transition duration-500"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl font-extrabold text-center text-white drop-shadow-lg">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-purple-200">Sign in to continue</p>

        {error && (
          <div className="text-red-400 text-sm text-center border border-red-500 rounded-lg p-2 bg-red-500/10">
            {error}
          </div>
        )}

        <div className="relative">
          <label className="block text-sm font-medium text-purple-200 mb-1">Email</label>
          <div className="flex items-center bg-white/20 border border-white/30 rounded-xl p-3">
            <FaEnvelope className="text-purple-300 mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
              required
              className="bg-transparent w-full text-white placeholder-purple-300 focus:outline-none"
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-purple-200 mb-1">Password</label>
          <div className="flex items-center bg-white/20 border border-white/30 rounded-xl p-3">
            <FaLock className="text-purple-300 mr-3" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
              required
              className="bg-transparent w-full text-white placeholder-purple-300 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white shadow-md transition duration-300 ${
            loading
              ? 'bg-purple-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
          }`}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-center text-sm text-purple-200">
          Don't have an account?{' '}
          <a href="/register" className="text-purple-400 hover:text-purple-500 underline">
            Register here
          </a>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
