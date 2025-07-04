import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import AuthPage from './pages/AuthPage';
import AppointmentPage from './pages/AppointmentPage';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Services from './pages/Services';
import HealthcareCate from './pages/categories/HealthcareCate';
import BeautyCate from './pages/categories/BeautyCate';
import HomeRepairServices from './pages/categories/HomeRepairServices';
import EducationCoaching from './pages/categories/EducationCoaching';
import GovernmentLegalServices from './pages/categories/GovernmentLegalServices';
import AutomobileService from './pages/categories/AutomobileService';
import RetailLocalBusinesses from './pages/categories/RetailLocalBusinesses';
import PrivateEvents from './pages/categories/PrivateEvents';
import HotelRestaurant from './pages/categories/HotelRestaurant';
import AppointmentCalendar from './pages/AppointmentCalendar';
import RescheduleAppointment from './pages/RescheduleAppointment';
import MyServices from './pages/MyServices';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  const [hasServices, setHasServices] = useState(false);

  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100
    });
  }, []);

  // Set up axios defaults for authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Load theme from localStorage on app start
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  useEffect(() => {
    // Check if user is logged in based on JWT token
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Fetch user profile data
      const fetchUserProfile = async () => {
        try {
          const res = await axios.get('http://localhost:5001/auth/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUserProfile(res.data);
        } catch (err) {
          console.error('Error fetching profile:', err);
          // If token is invalid, logout
          if (err.response?.status === 401) {
            handleLogout();
          }
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
      // Fetch if user has services
      const fetchHasServices = async () => {
        try {
          const res = await axios.get('http://localhost:5001/services/my', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setHasServices(res.data.services && res.data.services.length > 0);
        } catch (err) {
          setHasServices(false);
        }
      };
      fetchHasServices();
    } else {
      setLoading(false);
      setHasServices(false);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUserProfile(userData);
    // Set Authorization header for future requests
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserProfile(null);
    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  if (loading) {
    // You can add a loading spinner here
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <Router>
      <div className={`App ${theme}`}>
        <Navbar 
          isLoggedIn={isLoggedIn} 
          userProfile={userProfile} 
          onLogout={handleLogout}
          theme={theme}
          onThemeToggle={handleThemeToggle}
        />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={!isLoggedIn ? <AuthPage isLogin={true} setIsLoggedIn={handleLogin} /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isLoggedIn ? <AuthPage isLogin={false} setIsLoggedIn={handleLogin} /> : <Navigate to="/dashboard" />} />
            <Route path="/services" element={<Services />} />
            <Route path="/categories/healthcare" element={<HealthcareCate />} />
            <Route path="/categories/beauty" element={<BeautyCate />} />
            <Route path="/categories/home-repair" element={<HomeRepairServices />} />
            <Route path="/categories/education" element={<EducationCoaching />} />
            <Route path="/categories/government-legal" element={<GovernmentLegalServices />} />
            <Route path="/categories/automobile" element={<AutomobileService />} />
            <Route path="/categories/retail" element={<RetailLocalBusinesses />} />
            <Route path="/categories/private-events" element={<PrivateEvents />} />
            <Route path="/categories/hotel-restaurant" element={<HotelRestaurant />} />
            <Route path="/appointments" element={isLoggedIn ? <AppointmentPage /> : <Navigate to="/login" />} />
            <Route path="/book" element={isLoggedIn ? <AppointmentPage /> : <Navigate to="/login" />} />
            <Route path="/reschedule" element={isLoggedIn ? <RescheduleAppointment /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={isLoggedIn ? 
              <Dashboard userProfile={userProfile} setUserProfile={setUserProfile} /> 
              : <Navigate to="/login" />} 
            />
            <Route path="/profile" element={isLoggedIn ? 
              <UserProfile isLoggedIn={isLoggedIn} setIsLoggedIn={handleLogin} setUserProfile={setUserProfile} /> 
              : <Navigate to="/login" />} 
            />
            <Route path="/calendar" element={isLoggedIn ? 
              <AppointmentCalendar /> 
              : <Navigate to="/login" />} 
            />
            <Route path="/my-services" element={isLoggedIn ? <MyServices /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

