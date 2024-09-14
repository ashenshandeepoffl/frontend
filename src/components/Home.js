import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [greetingMessage, setGreetingMessage] = useState('');
  const [quote, setQuote] = useState('');
  const [username, setUsername] = useState('User'); // Placeholder username

  useEffect(() => {
    // Fetch user data here (using JWT from localStorage)
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
      } else {
        try {
          const response = await axios.get('http://localhost:5000/api/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsername(response.data.username);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();

    // Set greeting based on current time
    const now = new Date();
    const hour = now.getHours();
    let greeting;
    if (hour < 12) {
      greeting = 'Good Morning';
    } else if (hour < 18) {
      greeting = 'Good Afternoon';
    } else {
      greeting = 'Good Evening';
    }
    setGreetingMessage(greeting);

    // Set a daily special and quote
    setQuote(getRandomQuote());
  }, [navigate]);

  // Function to return a random quote
  const getRandomQuote = () => {
    const quotes = [
      "The best way to predict the future is to create it.",
      "Success is not the key to happiness. Happiness is the key to success.",
      "Your limitation—it's only your imagination.",
      "Don't watch the clock; do what it does. Keep going.",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Smart Home System</h1>
          <div>
            <Link to="/profile" className="text-gray-600 mx-4">Profile</Link>
            <Link to="/settings" className="text-gray-600 mx-4">Settings</Link>
            <Link to="/emotions-capture" className="text-gray-600 mx-4">Emotions Capture</Link>
            <Link to="/about-us" className="text-gray-600 mx-4">About Us</Link>
            <Link to="/contact-us" className="text-gray-600 mx-4">Contact Us</Link>
            <button onClick={handleLogout} className="text-red-500 mx-4">Logout</button>
          </div>
        </div>
      </nav>

      {/* Welcome Box */}
      <section className="flex justify-center items-center py-10">
        <div className="bg-white shadow-md rounded-lg p-8 text-center w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">{greetingMessage}, {username}!</h2>
          <p className="text-gray-600">We're glad to have you back.</p>
          <div className="bg-blue-50 p-4 rounded-lg my-4">
            <h3 className="text-lg font-semibold">Today's Special:</h3>
            <p className="text-gray-600">Don't forget to relax and take care of yourself!</p>
          </div>
          <blockquote className="text-sm italic text-gray-500">"{quote}"</blockquote>
        </div>
      </section>

      {/* Dashboard */}
      <section className="flex justify-center items-center py-10">
        <div className="bg-white shadow-md rounded-lg p-10 text-center w-2/3">
          <h2 className="text-3xl font-bold mb-4">User Activity Dashboard</h2>
          <p className="text-gray-600">Coming Soon!</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
