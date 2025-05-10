import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    pp: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [preview, setPreview] = useState(null);

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setFormData({
        fullName: res.data.fullName,
        username: res.data.username,
        email: res.data.email,
        pp: res.data.pp,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      toast.error('Failed to load profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'pp') {
      setFormData({ ...formData, pp: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return toast.error('New passwords do not match');
    }

    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('username', formData.username);
    data.append('email', formData.email);

    if (formData.pp instanceof File) {
      data.append('pp', formData.pp); // Attach profile picture if selected
    }

    if (formData.currentPassword) {
      data.append('currentPassword', formData.currentPassword);
      data.append('newPassword', formData.newPassword);
    }

    try {
      const res = await axios.put('http://localhost:3001/api/users/update', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.user);
      toast.success(res.data.message || 'Profile updated!');
      setEditMode(false);
      setPreview(null);

      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white flex justify-center items-center p-6">
      <div className="bg-black p-6 rounded-2xl shadow-xl max-w-xl w-full">
        <h1 className="text-3xl font-bold text-pink-500 mb-6 text-center">User Profile</h1>

        <div className="flex justify-center mb-4">
          <img
            src={preview ? preview : `http://localhost:3001${profile.pp}`}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-pink-500 object-cover"
          />
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <motion.div className="flex flex-col">
            <label className="text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="p-3 rounded bg-gray-100 text-black"
              disabled={!editMode}
            />
          </motion.div>

          <motion.div className="flex flex-col">
            <label className="text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="p-3 rounded bg-gray-100 text-black"
              disabled={!editMode}
            />
          </motion.div>

          <motion.div className="flex flex-col">
            <label className="text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 rounded bg-gray-100 text-black"
              disabled={!editMode}
            />
          </motion.div>

          {editMode && (
            <>
              <motion.div className="flex flex-col">
                <label className="text-sm mb-1">Profile Picture</label>
                <input type="file" name="pp" accept="image/*" onChange={handleChange} />
              </motion.div>

              <motion.div className="flex flex-col">
                <label className="text-sm mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="p-3 rounded bg-gray-100 text-black"
                />
              </motion.div>

              <motion.div className="flex flex-col">
                <label className="text-sm mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="p-3 rounded bg-gray-100 text-black"
                />
              </motion.div>

              <motion.div className="flex flex-col">
                <label className="text-sm mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="p-3 rounded bg-gray-100 text-black"
                />
              </motion.div>
            </>
          )}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="bg-pink-500 hover:bg-pink-400 text-white font-semibold py-2 px-6 rounded-xl"
              onClick={() => {
                setEditMode(!editMode);
                if (!editMode) setPreview(null);
              }}
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>

            {editMode && (
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-400 text-white font-semibold py-2 px-6 rounded-xl"
              >
                Save
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
