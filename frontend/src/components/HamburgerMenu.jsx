import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  FiHome,
  FiUser,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';

const HamburgerMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const hideSidebar = location.pathname === '/' || location.pathname === '/register';

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
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
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-xl hover:bg-pink-500 transition md:hidden"
        >
          <FiMenu size={24} />
        </button>
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-black to-gray-900 text-white z-40 px-6 py-8 border-r border-gray-800 shadow-xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-semibold text-pink-400 truncate max-w-[80%]">
            👋 {user?.fullName}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-pink-400 md:hidden"
          >
            <FiX size={22} />
          </button>
        </div>

        <nav className="space-y-5 text-base font-medium">
          <Link to="/home" className="flex items-center gap-3 hover:text-pink-400 transition">
            <FiHome /> Home
          </Link>
          <Link to="/dashboard" className="flex items-center gap-3 hover:text-pink-400 transition">
            <FiUser /> My Account
          </Link>
          <Link to="/profile" className="flex items-center gap-3 hover:text-pink-400 transition">
            <FiSettings /> Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-700 transition"
          >
            <FiLogOut /> Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default HamburgerMenu;
