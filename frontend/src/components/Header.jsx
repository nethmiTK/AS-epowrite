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
    <header className="w-full pl-64 pr-6 py-4 bg-gradient-to-r from-pink-900 to-gray-900 text-white shadow-xl fixed top-0 left-0 right-0 z-40 flex justify-between items-center border-b border-pink-500">
      <h1 className="text-3xl font-semibold tracking-wide text-white transform transition-transform hover:scale-105 cursor-pointer">
        ✍️ EpoWrite
      </h1>

      {profile && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img
              src={profile.pp.startsWith('http') ? profile.pp : `http://localhost:3001${profile.pp}`}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-white object-cover hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out"
            />
            <span className="text-xl font-medium text-gray-300">{profile.fullName}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-400 px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
