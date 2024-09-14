import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home'; 
import Profile from './components/Profile';
import Settings from './components/Settings';
import EmotionsCapture from './components/EmotionsCapture';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import AdminHome from './components/AdminHome';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/emotions-capture" element={
          <ProtectedRoute>
            <EmotionsCapture />
          </ProtectedRoute>
        } />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/admin-home" element={
          <ProtectedRoute>
            <AdminHome />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
