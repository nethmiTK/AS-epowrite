import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiMenu,
  FiX,  
  FiHome,
  FiUser,
  FiLogOut,
} from 'react-icons/fi';

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
    <header className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* USER PIC AND WELCOME MESSAGE */}
        {user && (
          <div
            className="flex items-center gap-3 cursor-pointer order-1"
            onClick={handleProfileClick}
          >
            <img
              src={user.pp?.startsWith('http') ? user.pp : `http://localhost:3001${user.pp}`}
              alt="Profile"
              className="w-14 h-14 rounded-full border-2 border-purple-500 object-cover hover:scale-110 transition duration-300"
            />
            <span className="text-lg font-medium text-purple-500">
              Welcome, {user.fullName}
            </span>
          </div>
        )}

        {/* LOGO + SITE NAME */}
        <div className="flex items-center gap-3 order-2">
          {/* Fade-in Animation for 'Epowrite' */}
          <h1 className="text-xl md:text-2xl font-extrabold uppercase text-purple-500 tracking-wide animate-fadein">
            Epowrite
          </h1>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 text-base font-semibold uppercase order-3">
          <Link to="/home" className="bg-purple-500 px-4 py-2 rounded shadow text-white hover:bg-purple-400 transition">
            <FiHome className="inline mr-1" /> Home
          </Link>
          <Link to="/dashboard" className="bg-purple-500 px-4 py-2 rounded shadow text-white hover:bg-purple-500 transition">
            <FiUser className="inline mr-1" /> My Account
          </Link>
          <Link to="/create-post" className="bg-purple-500 px-4 py-2 rounded shadow text-white hover:bg-purple-400 transition">
            Create Post
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-300 px-4 py-2 rounded shadow text-purple hover:bg-red-600 transition"
          >
            <FiLogOut className="inline mr-1" /> Logout
          </button>
        </nav>

        {/* HAMBURGER ICON */}
        <div className="md:hidden order-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-purple-500 hover:text-purple-600 transition"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-black text-white px-4 pb-4 space-y-3">
          <Link to="/home" onClick={() => setIsOpen(false)} className="block bg-pink-500 px-4 py-2 rounded shadow hover:bg-pink-600 transition">
            <FiHome className="inline mr-2" /> Home
          </Link>
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block bg-pink-500 px-4 py-2 rounded shadow hover:bg-pink-600 transition">
            <FiUser className="inline mr-2" /> My Account
          </Link>
          <Link to="/create-post" onClick={() => setIsOpen(false)} className="block bg-pink-500 px-4 py-2 rounded shadow hover:bg-pink-600 transition">
            Create Post
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="block bg-red-500 px-4 py-2 rounded shadow hover:bg-red-600 transition w-full text-left"
          >
            <FiLogOut className="inline mr-2" /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Hamburger;
