// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Navigate to the authentication page (adjust path as needed)
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full h-12 flex items-center px-6 z-50">
      <h1 className="text-lg font-bold text-gray-800">LeetTracket</h1>
      <div className="ml-10 flex gap-6">
        <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 text-sm">
          Dashboard
        </Link>
        <Link to="/editor/1" className="text-gray-600 hover:text-indigo-600 text-sm">
          Editor
        </Link>
      </div>
      <div className="flex-grow"></div>
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
