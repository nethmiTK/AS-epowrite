import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const Header = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Error loading profile in header:', err);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="w-full pl-64 pr-6 py-4 bg-gradient-to-r from-purple-900 via-indigo-800 to-gray-900 text-white shadow-md fixed top-0 left-0 right-0 z-40 flex justify-between items-center border-b border-white/10">
      <h1 className="text-2xl font-extrabold tracking-wide text-purple-200">✍️ EpoWrite</h1>

      {profile && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img
              src={profile.pp.startsWith('http') ? profile.pp : `http://localhost:3001${profile.pp}`}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white object-cover hover:scale-105 transition-transform"
            />
            <span className="text-sm font-medium text-purple-200">{profile.fullName}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-full text-sm shadow-md transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
