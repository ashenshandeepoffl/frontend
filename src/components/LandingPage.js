import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Smart Home System</h1>
          <div>
            <Link to="/" className="text-gray-600 mx-4">Home</Link>
            <Link to="/features" className="text-gray-600 mx-4">Features</Link>
            <Link to="/about" className="text-gray-600 mx-4">About</Link>
            <Link to="/login" className="text-gray-600 mx-4">Login</Link>
            <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded-md">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 bg-blue-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-gray-800">Control Your Home with Emotions</h2>
          <p className="mt-4 text-gray-600">Experience the future of home automation by connecting with your emotions.</p>
          <Link to="/register" className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-full">Get Started</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-semibold text-center mb-10">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-md shadow-md text-center">
              <h4 className="text-xl font-bold mb-4">Emotional Automation</h4>
              <p className="text-gray-600">Adjust lighting, temperature, and sound based on your mood.</p>
            </div>
            <div className="p-6 bg-white rounded-md shadow-md text-center">
              <h4 className="text-xl font-bold mb-4">Voice Commands</h4>
              <p className="text-gray-600">Control your home with simple voice commands.</p>
            </div>
            <div className="p-6 bg-white rounded-md shadow-md text-center">
              <h4 className="text-xl font-bold mb-4">Security Alerts</h4>
              <p className="text-gray-600">Receive real-time security updates based on emotional triggers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2024 Smart Home System. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
