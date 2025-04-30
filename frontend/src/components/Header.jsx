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
    <header className="w-full pl-64 pr-6 py-4 bg-black text-white shadow-md fixed top-0 left-0 right-0 z-40 flex justify-between items-center border-b border-gray-800">
      <h1 className="text-3xl font-bold tracking-wide text-pink-500 hover:text-pink-400 transition cursor-pointer">
        ✍️ EpoWrite
      </h1>

      {profile && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img
              src={
                profile.pp.startsWith('http')
                  ? profile.pp
                  : `http://localhost:3001${profile.pp}`
              }
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-white object-cover hover:scale-110 transition duration-300"
            />
            <span className="text-base font-medium text-white">{profile.fullName}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition transform hover:scale-105 active:scale-95"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
