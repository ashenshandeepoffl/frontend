import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    date_of_birth: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const userRole = "User"; 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation logic
  const validateForm = () => {
    const errors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required.';
    } else if (!/^[a-zA-Z0-9]{4,20}$/.test(formData.username)) {
      errors.username = 'Username must be 4-20 characters and alphanumeric only.';
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Password must include at least one uppercase letter.';
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = 'Password must include at least one lowercase letter.';
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = 'Password must include at least one number.';
    } else if (!/[^a-zA-Z0-9]/.test(formData.password)) {
      errors.password = 'Password must include at least one special character.';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid.';
    }

    // Date of Birth validation
    if (!formData.date_of_birth.trim()) {
      errors.date_of_birth = 'Date of birth is required.';
    } else {
      const today = new Date();
      const dob = new Date(formData.date_of_birth);
      if (dob >= today) {
        errors.date_of_birth = 'Date of birth must be in the past.';
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', { ...formData, userRole });
      setSuccessMessage(response.data.message);
      navigate('/login');
    } catch (error) {
      setErrors({ form: error.response?.data?.message || 'Error registering' });
    }
  };

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

      {/* Registration Form */}
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && <p className="text-red-500 text-center">{errors.form}</p>}
            {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

            {/* Username */}
            <div>
              <label className="block text-sm">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
              {errors.date_of_birth && <p className="text-red-500 text-sm">{errors.date_of_birth}</p>}
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Register</button>
          </form>

          <p className="text-center mt-4">
            Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
