import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for form submission
import { useSpring, animated } from '@react-spring/web';

const ContactUs = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', formData); // Send form data to backend
      setSubmitted(true);
      setError(null);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000); // Reset form after 3 seconds
    } catch (err) {
      setError('Failed to send the message.');
      setSubmitted(false);
    }
  };

  // Hero animation
  const heroAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 300,
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-semibold">Smart Home System</Link>
          <div>
            <Link to="/home" className="text-gray-600 mx-4">Home</Link>
            <Link to="/about-us" className="text-gray-600 mx-4">About Us</Link>
            <Link to="/contact-us" className="text-gray-600 mx-4">Contact Us</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url('https://via.placeholder.com/1200x500')` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <animated.div style={heroAnimation} className="absolute inset-0 flex items-center justify-center text-center">
          <h1 className="text-5xl font-bold text-white">Contact Us</h1>
        </animated.div>
      </section>

      {/* Contact Form Section */}
      <section className="container mx-auto py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Send Message
              </button>
              {submitted && <p className="text-green-500 mt-4">Your message has been sent successfully!</p>}
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
            <p className="text-lg text-gray-700 mb-4">Feel free to contact us through any of the following methods:</p>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> contact@smarthome.com
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Phone:</strong> +1 (123) 456-7890
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Address:</strong> 123 Smart Home Street, Tech City, USA
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Business Hours:</strong> Monday to Friday, 9 AM - 6 PM
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
