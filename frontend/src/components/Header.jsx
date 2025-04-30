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
        console.error('Header profile fetch error:', err);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleProfileClick = () => {
    // Navigate to the profile page when the profile picture is clicked
    navigate('/profile');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 px-6 bg-black text-white shadow-md border-b border-gray-800 flex items-center justify-between md:pl-64">
      <h1
        className="text-xl md:text-2xl font-bold text-pink-500 hover:text-pink-400 cursor-pointer transition-all duration-300"
        onClick={() => navigate('/home')}
      >
        ✍️ EpoWrite
      </h1>
      {profile && (
        <div className="flex items-center gap-3">
          <img
            src={
              profile.pp.startsWith('http')
                ? profile.pp
                : `http://localhost:3001${profile.pp}`
            }
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-white object-cover hover:scale-110 transition duration-300 cursor-pointer"
            onClick={handleProfileClick} // Add click event to navigate to profile page
          />
          <span className="hidden sm:block text-sm font-medium">{profile.fullName}</span>
        </div>
      )}
    </header>
  );
};

export default Header;
