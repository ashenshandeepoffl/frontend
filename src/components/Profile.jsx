import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSpring, animated } from '@react-spring/web';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: '', email: '', date_of_birth: '' });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get('http://localhost:5000/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setFormData({ ...formData, username: response.data.username, email: response.data.email });
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };
    fetchUserData();
  }, [navigate, formData]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission to update user data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post('http://localhost:5000/api/profile/update', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
      setEditing(false); // Stop editing after successful update
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  // Animation using react-spring for the avatar and form elements
  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 200 });
  const slideIn = useSpring({ transform: 'translateY(0px)', from: { transform: 'translateY(20px)' }, delay: 300 });

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

      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-3xl text-center">
        {/* Avatar with animation */}
        <animated.div style={fadeIn}>
          <img
            className="rounded-full w-32 h-32 mx-auto mb-6"
            src="https://via.placeholder.com/150"
            alt="User Avatar"
          />
        </animated.div>

        {/* User Details */}
        <animated.div style={slideIn}>
          <h2 className="text-2xl font-bold mb-2">Welcome, {user.username}</h2>
          <p className="text-gray-600 mb-4">Email: {user.email}</p>
          <p className="text-gray-600 mb-4">Date of Birth: {user.date_of_birth}</p>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full transition-transform transform hover:scale-105"
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>

          {/* Success/Failure Message */}
          {message && <p className="text-green-500 mt-4">{message}</p>}
        </animated.div>

        {/* Update Form with animations */}
        {editing && (
          <animated.form style={slideIn} className="mt-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-left text-gray-600">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-left text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-left text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-full transition-transform transform hover:scale-105"
            >
              Update Profile
            </button>
          </animated.form>
        )}
      </div>
    </div>
    </div>
    
  );
};

export default Profile;
