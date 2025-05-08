import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    pp: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login.');
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
          pp: null,
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        toast.error('Error fetching profile. Please check your token or API connection.');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, pp: file });
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setPreview(objectURL);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('username', formData.username);
    if (formData.pp instanceof File) data.append('pp', formData.pp);
    try {
      const res = await axios.put('http://localhost:3001/api/users/update', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.user);
      toast.success(res.data.message || 'Profile updated successfully!');
      setEditMode(false);
      setPreview(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Profile update failed.');
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-white px-4">
<ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl z-10 text-black">
        <h2 className="text-3xl font-extrabold text-center text-black mb-4">👤 Profile Settings</h2>
        <AnimatePresence mode="wait">

          {profile ? (
            editMode ? (
              <motion.form
                onSubmit={handleUpdate}
                className="w-full space-y-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {['fullName', 'username'].map((field, idx) => (
                  <motion.div key={idx} className="flex flex-col w-full  ">
                    <label className="mb-2 text-sm font-semibold  text-black">
                      {field === 'fullName' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <motion.input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="p-4 rounded-xl bg-gray-100 border-2 border-purple-400 focus:ring-2 focus:ring-purple-500 text-black"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </motion.div>
                ))}
                <div className="flex flex-col  ">
                  <label className="mb-2 text-sm font-semibold text-black">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="p-4 rounded-xl bg-gray-100 border-2 border-purple-400 focus:ring-2 focus:ring-purple-500"
                  />
                  {preview && (
                    <div className="mt-6 flex justify-center relative">
                      <img
                        src={preview}
                        alt="Profile Preview"
                        className="w-40 h-40 rounded-full object-cover border-4 border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setPreview(null)}
                        className="absolute top-0 right-0 bg-white rounded-full p-1 text-purple-600 hover:text-purple-800"
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex  text-center justify-between  mt-6">
                  <motion.button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setPreview(null);
                    }}
                    className="px-6 py-3 bg-gray-300 hover:bg-gray-400 rounded-xl text-black transition-all duration-300"
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-400 rounded-xl text-white transition-all duration-300"
                    whileTap={{ scale: 0.95 }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.div
  className="space-y-6 w-full text-center flex flex-col items-center"
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
>
  <div><strong className="text-black">Full Name:</strong> {profile.fullName}</div>
  <div><strong className="text-black">Username:</strong> {profile.username}</div>
  <div><strong className="text-black">Email:</strong> {profile.email}</div>

  <div className="flex flex-col items-center">
    <strong className="text-black">Profile Picture:</strong>
    <img
      src={profile.pp.startsWith('http') ? profile.pp : `http://localhost:3001${profile.pp}`}
      alt="Profile"
      className="w-32 h-32 mt-4 rounded-full object-cover border-4 border-purple-500"
    />
  </div>

  <motion.button
    onClick={() => setEditMode(true)}
    className="mt-6 px-6 py-3 bg-purple-500 hover:bg-purple-400 rounded-xl text-white transition-all duration-300"
    whileTap={{ scale: 0.95 }}
  >
    Edit Profile
  </motion.button>
</motion.div>

            )
          ) : (
            <p className="text-black">Loading profile...</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
