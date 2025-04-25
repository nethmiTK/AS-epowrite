import React from 'react';

const Header = ({ user }) => {
  return (
    <header className="bg-gray-800 text-white py-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold uppercase tracking-wide">
          My Awesome Project
        </h1>
        {user ? (
          <p className="mt-2 text-lg">Welcome, {user.fullName} 👋</p>  // Show fullName if user is logged in
        ) : (
          <p className="mt-2 text-lg">Welcome 👋</p> // Default message when no user
        )}
      </div>
    </header>
  );
};

export default Header;
