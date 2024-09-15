import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('text-base');

  // Apply settings from localStorage on load
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedFontSize = localStorage.getItem('fontSize') || 'text-base';
    setDarkMode(savedDarkMode);
    setFontSize(savedFontSize);
    document.documentElement.classList.toggle('dark', savedDarkMode);
  }, []);

  // Handle Dark Mode Toggle
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  // Handle Font Size Change
  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };


  return (
    <div className={`${fontSize} min-h-screen bg-gray-100 dark:bg-gray-900`}>
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Smart Home System</h1>
          <div>
            <Link to="/home" className="text-gray-600 mx-4">Home</Link>
            <Link to="/profile" className="text-gray-600 mx-4">Profile</Link>
            <Link to="/settings" className="text-gray-600 mx-4">Settings</Link>
            <Link to="/emotions-capture" className="text-gray-600 mx-4">Emotions Capture</Link>
            <Link to="/about-us" className="text-gray-600 mx-4">About Us</Link>
            <Link to="/contact-us" className="text-gray-600 mx-4">Contact Us</Link>
            <button onClick={handleLogout} className="text-red-500 mx-4">Logout</button>
          </div>
        </div>
      </nav>

      {/* Settings Panel */}
      <section className="container mx-auto p-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Application Settings</h2>

          {/* Dark Mode Setting */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-700 dark:text-gray-300">Dark Mode</p>
            <label className="switch">
              <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
              <span className="slider round"></span>
            </label>
          </div>

          {/* Font Size Setting */}
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 mb-2">Font Size</p>
            <div className="flex items-center space-x-4">
              <button
                className={`px-4 py-2 rounded-full ${
                  fontSize === 'text-sm' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                onClick={() => changeFontSize('text-sm')}
              >
                Small
              </button>
              <button
                className={`px-4 py-2 rounded-full ${
                  fontSize === 'text-base' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                onClick={() => changeFontSize('text-base')}
              >
                Medium
              </button>
              <button
                className={`px-4 py-2 rounded-full ${
                  fontSize === 'text-lg' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                onClick={() => changeFontSize('text-lg')}
              >
                Large
              </button>
            </div>
          </div>

          {/* Placeholder for More Settings */}
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300">More Settings Coming Soon...</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
