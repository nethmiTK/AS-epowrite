import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';  // Icons
import { motion } from 'framer-motion';  // Optional: Smooth animations

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:3001/api/auth/login', formData);
      alert(data.message);
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message || 'Error logging in');
      } else {
        alert('Error logging in');
      }
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

        <div className="relative">
          <label className="block text-sm font-medium text-purple-200 mb-1">Email</label>
          <div className="flex items-center bg-white/20 border border-white/30 rounded-xl p-3">
            <FaEnvelope className="text-purple-300 mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
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
              required
              className="bg-transparent w-full text-white placeholder-purple-300 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 shadow-md"
        >
          Sign In
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
