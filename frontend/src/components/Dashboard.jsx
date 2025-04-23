import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import userAnimation from '../assets/user.json';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    pp: null,
  });
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login.');
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setFormData({
          fullName: res.data.fullName,
          username: res.data.username,
          email: res.data.email,
          pp: null,
        });
        setNotification('');
      } catch (err) {
        console.error('Error fetching profile:', err);
        setNotification('Error fetching profile. Please check your token or API connection.');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFormData({ ...formData, pp: e.target.files[0] });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('username', formData.username);
    data.append('email', formData.email);
    if (formData.pp instanceof File) data.append('pp', formData.pp);
    try {
      const res = await axios.put('http://localhost:3001/api/users/update', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.user);
      setNotification(res.data.message);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setNotification(err.response?.data?.message || 'Profile update failed.');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 flex items-center justify-center p-6 overflow-hidden">

      {/* Rain balls floating */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-5 h-5 bg-purple-400 rounded-full opacity-10"
            style={{ left: `${Math.random() * 100}%`, bottom: `-${Math.random() * 100}px` }}
            animate={{ y: ['0%', '-110%'] }}
            transition={{ duration: 6 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 3, ease: 'linear' }}
          />
        ))}
      </div>

      {/* Lottie Animation */}
      <div className="absolute top-8 left-8 w-32 z-10">
        <Lottie animationData={userAnimation} loop={true} />
      </div>

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-2xl z-10 text-white flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-6">👤 User Dashboard</h1>
        {notification && (
          <motion.p className="mb-4 text-red-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {notification}
          </motion.p>
        )}

        <AnimatePresence mode="wait">
          {profile ? (
            editMode ? (
              <motion.form
                key="edit"
                onSubmit={handleUpdate}
                className="w-full space-y-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {['fullName', 'username', 'email'].map((field, idx) => (
                  <motion.div key={idx} className="flex flex-col w-full">
                    <label className="mb-1 text-sm">
                      {field === 'fullName' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <motion.input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="p-3 rounded-lg bg-black/30 border border-gray-600 focus:ring-2 focus:ring-purple-500"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </motion.div>
                ))}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm">Profile Picture</label>
                  <input type="file" accept="image/*" onChange={handleFileChange}
                    className="p-3 rounded-lg bg-black/30 border border-gray-600 focus:ring-2 focus:ring-purple-500" />
                </div>

                <div className="flex justify-between mt-4">
                  <motion.button type="button" onClick={() => { setEditMode(false); setNotification(''); }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                    whileTap={{ scale: 0.9 }}>
                    Cancel
                  </motion.button>
                  <motion.button type="submit"
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg"
                    whileTap={{ scale: 0.9 }}>
                    Save Changes
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.div key="view" className="space-y-4 w-full" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <div><strong>Full Name:</strong> {profile.fullName}</div>
                <div><strong>Username:</strong> {profile.username}</div>
                <div><strong>Email:</strong> {profile.email}</div>
                <div className="flex flex-col items-start">
                  <strong>Profile Picture:</strong>
                  <img src={profile.pp.startsWith('http') ? profile.pp : `http://localhost:3001${profile.pp}`} alt="Profile" className="w-24 h-24 mt-2 rounded-full object-cover" />
                </div>
                <motion.button onClick={() => setEditMode(true)} className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg" whileTap={{ scale: 0.9 }}>
                  Edit Profile
                </motion.button>
              </motion.div>
            )
          ) : (
            <p className="text-white">Loading profile...</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
