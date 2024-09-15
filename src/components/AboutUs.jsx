import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';

const AboutUs = () => {
  const navigate = useNavigate();
  const heroAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 300,
});

// Animation for the Mission Statement
const missionAnimation = useSpring({
  transform: 'translateY(0px)',
  from: { transform: 'translateY(20px)' },
  delay: 500,
});

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
          <Link to="/" className="text-xl font-semibold">Smart Home System</Link>
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

      {/* Hero Section */}
      <section className="relative h-80 bg-cover bg-center" style={{ backgroundImage: `url('https://via.placeholder.com/1200x500')` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <animated.div style={heroAnimation} className="absolute inset-0 flex items-center justify-center text-center">
          <h1 className="text-5xl font-bold text-white">Welcome to Smart Home</h1>
        </animated.div>
      </section>

      {/* Mission Statement */}
      <animated.section style={missionAnimation} className="container mx-auto py-20">
        <h2 className="text-3xl font-bold text-center mb-6">Our Mission</h2>
        <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto">
          Our mission is to transform homes with intelligent, emotion-based automation systems that understand and respond to your mood. We are committed to delivering a smart home experience that makes life easier, more convenient, and tailored to your emotional well-being.
        </p>
      </animated.section>

      {/* Team Section */}
      <section className="container mx-auto py-20">
        <h2 className="text-3xl font-bold text-center mb-10">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.name} name={member.name} role={member.role} image={member.image} />
          ))}
        </div>
      </section>
    </div>
  );
};

// Team Member Card Component
const TeamMemberCard = ({ name, role, image }) => {
  const cardAnimation = useSpring({
    transform: 'scale(1)',
    from: { transform: 'scale(0.95)' },
    config: { tension: 150, friction: 20 },
    reset: true,
    delay: 200,
  });

  return (
    <animated.div style={cardAnimation} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img src={image} alt={name} className="w-full h-60 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-gray-600">{role}</p>
      </div>
    </animated.div>
  );
};

// Sample team member data
const teamMembers = [
  {
    name: 'John Doe',
    role: 'Lead Developer',
    image: 'https://via.placeholder.com/300',
  },
  {
    name: 'Jane Smith',
    role: 'UI/UX Designer',
    image: 'https://via.placeholder.com/300',
  },
  {
    name: 'Michael Lee',
    role: 'Backend Engineer',
    image: 'https://via.placeholder.com/300',
  },
];

export default AboutUs;
