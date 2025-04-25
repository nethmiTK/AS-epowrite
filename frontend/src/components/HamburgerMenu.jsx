import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation

const HamburgerMenu = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleProfileEdit = () => {
    navigate('/dashboard'); // Navigate to the dashboard page (profile edit page)
  };

  return (
    <div className="hamburger-menu">
     
      <button onClick={handleProfileEdit} className="w-full p-2 bg-purple-600 text-white rounded-lg mt-4">
        Edit Profile
      </button>
    </div>
  );
};

export default HamburgerMenu;
