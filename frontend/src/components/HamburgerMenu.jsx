// components/HamburgerMenu.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <div className="relative z-50">
      <button onClick={toggleMenu} className="text-white bg-blue-600 p-2 rounded-lg">
        {open ? <X /> : <Menu />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-64 h-full bg-white shadow-xl flex flex-col p-6 space-y-4"
          >
            <Link to="/" className="text-xl font-semibold hover:underline">Home</Link>
            <Link to="/dashboard" className="text-xl font-semibold hover:underline">Dashboard</Link>
            <button onClick={toggleMenu} className="mt-auto text-red-600">Close Menu</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HamburgerMenu;
