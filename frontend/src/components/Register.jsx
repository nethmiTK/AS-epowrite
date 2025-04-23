import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    try {
      const { data } = await axios.post('http://localhost:3001/api/auth/register', formData);
      alert(data.message);
      navigate('/');
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message || 'Error registering user');
      } else {
        alert('Error registering user');
      }
    }
  };

  const fieldIcons = {
    fullName: <FaUser className="text-purple-300 mr-3" />,
    username: <FaUserAlt className="text-purple-300 mr-3" />,
    email: <FaEnvelope className="text-purple-300 mr-3" />,
    password: <FaLock className="text-purple-300 mr-3" />,
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
          Create Account
        </h2>
        <p className="text-center text-sm text-purple-200">Join us and get started!</p>

        {['fullName', 'username', 'email', 'password'].map((field, idx) => (
          <div key={idx}>
            <label htmlFor={field} className="block text-sm font-medium text-purple-200 mb-1">
              {field === 'fullName' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <div className="flex items-center bg-white/20 border border-white/30 rounded-xl p-3">
              {fieldIcons[field]}
              <input
                type={
                  field === 'email'
                    ? 'email'
                    : field === 'password'
                    ? 'password'
                    : 'text'
                }
                name={field}
                placeholder={field === 'fullName' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                onChange={handleChange}
                required
                className="bg-transparent w-full text-white placeholder-purple-300 focus:outline-none"
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 shadow-md"
        >
          Register
        </button>

        <p className="text-center text-sm text-purple-200">
          Already have an account?{' '}
          <a href="/" className="text-purple-400 hover:text-purple-500 underline">
            Login here
          </a>
        </p>
      </motion.form>
    </div>
  );
};

export default Register;
