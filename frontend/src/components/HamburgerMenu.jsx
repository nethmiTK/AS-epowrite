 // HamburgerMenu.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

const HamburgerMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Hide sidebar on login/register pages
  const hideSidebar = location.pathname === '/' || location.pathname === '/register';

  // Make it responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsOpen(false);
      else setIsOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (hideSidebar) return null;

  return (
    <>
      {/* Toggle button on small screens */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 text-3xl bg-gray-800 text-white p-2 rounded-lg shadow-md md:hidden"
        >
          <FiMenu />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white z-40 p-6 shadow-lg transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">👋 {user?.fullName }</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-2xl md:hidden text-gray-400 hover:text-white"
          >
            <FiX />
          </button>
        </div>
        <nav className="space-y-5 text-lg">
          <Link to="/home" className="flex items-center gap-3 hover:text-blue-400">
            <FiHome /> Home
          </Link>
          <Link to="/dashboard" className="flex items-center gap-3 hover:text-blue-400">
            <FiUser /> My Account
          </Link>
          <Link to="/profile" className="flex items-center gap-3 hover:text-blue-400">
            <FiSettings /> Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-400 hover:text-red-600"
          >
            <FiLogOut /> Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default HamburgerMenu;
