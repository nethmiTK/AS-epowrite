import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  return (
    <header className="w-full px-6 py-4 bg-gray-900 text-white flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">My Dashboard</h1>

      {profile && (
        <div className="flex items-center space-x-4">
          <span className="text-sm">{profile.fullName}</span>
          <img
            src={profile.pp.startsWith('http') ? profile.pp : `http://localhost:3001${profile.pp}`}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
        </div>
      )}
    </header>
  );
};

export default Header;
