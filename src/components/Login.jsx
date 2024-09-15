import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      
      const { access_token, userRole } = response.data;

      // Store the access token and user role in local storage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('userRole', userRole);

      // Redirect based on userRole
      if (userRole === 'Admin') {
        navigate('/admin-home'); // Redirect to the admin page
      } else if (userRole === 'User') {
        navigate('/home'); // Redirect to the landing page for users
      }
      
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-semibold">Smart Home System</Link>
          <div>
          <Link to="/" className="text-gray-600 mx-4">Home</Link>
            <Link to="/features" className="text-gray-600 mx-4">Features</Link>
            <Link to="/about" className="text-gray-600 mx-4">About</Link>
            <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md">Login</Link>
            <Link to="/register" className="text-gray-600 mx-4">Register</Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
            <div>
              <label className="block text-sm">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
          </form>
          <p className="text-center mt-4">
            Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
