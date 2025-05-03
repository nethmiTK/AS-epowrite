import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiUser, FiLogOut, FiEdit } from 'react-icons/fi';
import logo from '../assets/epowrite.png';

const Hamburger = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const hideNavbar = location.pathname === '/' || location.pathname === '/register';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (hideNavbar) return null;

  return (
    <header className="bg-[#f8f8f8] shadow-lg fixed w-full z-50 font-bold overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

        {/* LOGO */}
        <div className="flex items-center gap-3 order-1">
          <img src={logo} alt="Epowrite Logo" className="w-20 h-auto" />
        </div>

        {/* NAVIGATION MENU - DESKTOP */}
        <nav className="hidden md:flex items-center gap-6 text-base uppercase order-2">
          <Link to="/home" className="text-purple-500 hover:text-purple-600 transition flex items-center gap-1">
            <FiHome /> Home
          </Link>
          <Link to="/dashboard" className="text-purple-500 hover:text-purple-600 transition flex items-center gap-1">
            <FiUser /> My Account
          </Link>
          <hr className="h-6 w-px bg-purple-300 mx-2" />
          <Link to="/create-post" className="text-purple-500 hover:text-purple-600 transition flex items-center gap-1">
            <FiEdit /> Create Post
          </Link>
          {user && (
            <div
              onClick={handleLogout}
              className="text-purple-500 hover:text-purple-600 cursor-pointer transition flex items-center gap-1"
            >
              <FiLogOut /> Logout
            </div>
          )}
        </nav>

        {/* HAMBURGER BUTTON - MOBILE */}
        <div className="md:hidden order-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-purple-500 hover:text-purple-600 transition"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* USER WELCOME SECTION */}
        {user && (
          <div
            className="flex items-center gap-2 cursor-pointer order-4"
            onClick={handleProfileClick}
          >
            <img
              src={user.pp?.startsWith('http') ? user.pp : `http://localhost:3001${user.pp}`}
              alt="Profile"
              className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-purple-500 object-cover hover:scale-110 transition duration-300"
            />
            <span className="text-base md:text-lg text-purple-500 truncate max-w-[140px] md:max-w-none">
              Welcome, {user.fullName}
            </span>
          </div>
        )}
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white text-purple-500 px-4 pb-4 space-y-3 font-semibold border-t border-purple-200 transition-all duration-300 ease-in-out">
          <Link to="/home" onClick={() => setIsOpen(false)} className="block flex items-center gap-2">
            <FiHome /> Home
          </Link>
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block flex items-center gap-2">
            <FiUser /> My Account
          </Link>

          {/* Separator */}
          <hr className="border-purple-300 my-2" />

          <Link to="/create-post" onClick={() => setIsOpen(false)} className="block flex items-center gap-2">
            <FiEdit /> Create Post
          </Link>

          {user && (
            <div
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="block flex items-center gap-2 cursor-pointer"
            >
              <FiLogOut /> Logout
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Hamburger;
