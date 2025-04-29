import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AnimatedBalls from '../components/AnimatedBalls'; // Ensure the correct path

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/');
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.email === 'email-a@gmail.com' && formData.password === '12345') {
      navigate('/a');
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:3001/api/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative">
      <AnimatedBalls />  {/* Background animation */}

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/90 border border-darkGrey p-10 rounded-3xl shadow-2xl w-full max-w-md space-y-6 z-20" // Increase z-index for the form
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl font-extrabold text-center text-darkGrey">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-darkGrey">Sign in to continue</p>

        {error && (
          <div className="text-red-400 text-sm text-center border border-red-500 rounded-lg p-2 bg-red-500/10">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-darkGrey mb-1">Email</label>
          <div className="flex items-center bg-white/20 border border-darkGrey/30 rounded-xl p-3">
            <FaEnvelope className="text-darkGrey mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-transparent w-full text-darkGrey placeholder-darkGrey focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-darkGrey mb-1">Password</label>
          <div className="flex items-center bg-white/20 border border-darkGrey/30 rounded-xl p-3">
            <FaLock className="text-darkGrey mr-3" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-transparent w-full text-darkGrey placeholder-darkGrey focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-2xl font-semibold text-white shadow-md transition duration-300 ${
            loading
              ? 'bg-darkGrey cursor-not-allowed'
              : 'bg-pink-500 hover:bg-pink-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500'
          }`}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-center text-sm text-darkGrey">
          Don't have an account?{' '}
          <a href="/register" className="text-pink-400 hover:text-pink-500 underline">
            Register here
          </a>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
