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
    <header className="w-full px-6 py-4 bg-gradient-to-r from-purple-900 via-indigo-800 to-gray-900 text-white shadow-lg flex justify-between items-center backdrop-blur-lg bg-opacity-20 border-b border-white/10">
      <h1 className="text-2xl font-extrabold tracking-wider text-purple-200 drop-shadow-sm">✍️ EpoWrite</h1>

      {profile && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img
              src={profile.pp.startsWith('http') ? profile.pp : `http://localhost:3001${profile.pp}`}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white object-cover hover:scale-105 transition-transform duration-200"
            />
            <span className="text-sm font-medium text-purple-200">{profile.fullName}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded-full text-sm hover:bg-red-700 transition duration-300 shadow-md"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
