import React, { useState, useRef, useEffect } from 'react';
import './MyServices.css';
import { FaBell, FaCalendarAlt, FaUser, FaStar, FaEdit, FaTrash, FaPlus, FaChartPie, FaChartBar, FaEnvelope, FaFlag, FaUsers, FaClock, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import BookingDashboard from '../components/MyServices/BookingDashboard';
import ServiceManagement from '../components/MyServices/ServiceManagement';
import AvailabilitySettings from '../components/MyServices/AvailabilitySettings';
import NotificationsPanel from '../components/MyServices/NotificationsPanel';
import AnalyticsInsights from '../components/MyServices/AnalyticsInsights';
import CustomerManagement from '../components/MyServices/CustomerManagement';
import RatingsFeedback from '../components/MyServices/RatingsFeedback';
import ProfileCustomization from '../components/MyServices/ProfileCustomization';
import PromotionsCoupons from '../components/MyServices/PromotionsCoupons';
import TeamAccess from '../components/MyServices/TeamAccess';
import Sidebar from '../components/MyServices/Sidebar';

// --- Mock Data ---
const mockBookings = [
  { id: 1, name: 'Alice Smith', date: '2024-07-15', time: '10:00', service: 'Haircut', status: 'Confirmed' },
  { id: 2, name: 'Bob Lee', date: '2024-07-15', time: '12:00', service: 'Yoga', status: 'Pending' },
  { id: 3, name: 'Charlie Kim', date: '2024-07-14', time: '09:00', service: 'Car Wash', status: 'No-show' },
  { id: 4, name: 'Dana White', date: '2024-07-13', time: '15:00', service: 'Haircut', status: 'Cancelled' },
];
const mockServices = [
  { id: 1, name: 'Haircut', duration: 30, cost: 25, status: true, category: 'Salon', buffer: 10 },
  { id: 2, name: 'Yoga', duration: 60, cost: 15, status: true, category: 'Fitness', buffer: 5 },
  { id: 3, name: 'Car Wash', duration: 45, cost: 20, status: false, category: 'Automobile', buffer: 15 },
];
const mockNotifications = [
  { id: 1, type: 'booking', text: 'New booking from Alice Smith', unread: true },
  { id: 2, type: 'cancel', text: 'Booking cancelled by Dana White', unread: true },
  { id: 3, type: 'feedback', text: 'New feedback from Bob Lee', unread: false },
  { id: 4, type: 'system', text: 'System maintenance on July 20', unread: true },
];
const mockAnalytics = {
  weeklyBookings: 18,
  monthlyBookings: 72,
  revenue: 1200,
  mostBooked: 'Haircut',
  repeatCustomers: 8,
  pie: [
    { label: 'Haircut', value: 40, color: '#6C8AE4' },
    { label: 'Yoga', value: 25, color: '#A3B8D8' },
    { label: 'Car Wash', value: 35, color: '#BFD7ED' },
  ],
  bar: [
    { label: 'Week 1', value: 15 },
    { label: 'Week 2', value: 18 },
    { label: 'Week 3', value: 20 },
    { label: 'Week 4', value: 19 },
  ],
};
const mockCustomers = [
  { id: 1, name: 'Alice Smith', contact: 'alice@email.com', history: 5 },
  { id: 2, name: 'Bob Lee', contact: 'bob@email.com', history: 3 },
  { id: 3, name: 'Charlie Kim', contact: 'charlie@email.com', history: 2 },
];
const mockReviews = [
  { id: 1, service: 'Haircut', name: 'Alice Smith', rating: 5, text: 'Great service!', date: '2024-07-10' },
  { id: 2, service: 'Yoga', name: 'Bob Lee', rating: 4, text: 'Very relaxing.', date: '2024-07-09' },
  { id: 3, service: 'Car Wash', name: 'Charlie Kim', rating: 3, text: 'Good, but a bit slow.', date: '2024-07-08' },
];
const mockProfile = {
  name: 'Naman’s Salon',
  logo: '',
  description: 'Professional salon and wellness services.',
  address: '123 Main St, City',
  tags: ['Salon', 'Wellness', 'Haircut'],
  contact: '+1 234 567 890',
};
const mockCoupons = [
  { id: 1, name: 'SUMMER10', amount: 10, type: '%', expiry: '2024-08-01', used: 5 },
  { id: 2, name: 'WELCOME5', amount: 5, type: '$', expiry: '2024-12-31', used: 12 },
];
const mockTeam = [
  { id: 1, name: 'Priya', role: 'Stylist', services: ['Haircut'], performance: 4.8 },
  { id: 2, name: 'Rahul', role: 'Yoga Trainer', services: ['Yoga'], performance: 4.6 },
];

const sectionIds = [
  'bookings',
  'services',
  'availability',
  'analytics',
  'customers',
  'reviews',
  'profile',
  'coupons',
  'team',
];

// --- Main Page Layout ---
export default function MyServices() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [activeSection, setActiveSection] = useState('bookings');
  const sectionRefs = useRef({});

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Scroll sync logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 80; // offset for sticky nav
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to section on nav click
  const handleSectionNav = id => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <div className={"my-services-dashboard" + (darkMode ? ' dark' : '')} style={{ marginLeft: 220, transition: 'margin 0.3s' }}>
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeSection={activeSection}
        onSectionNav={handleSectionNav}
      />
      <div id="bookings"><NotificationsPanel /><BookingDashboard /></div>
      <div id="services"><ServiceManagement /></div>
      <div id="availability"><AvailabilitySettings /></div>
      <div id="analytics"><AnalyticsInsights /></div>
      <div id="customers"><CustomerManagement /></div>
      <div id="reviews"><RatingsFeedback /></div>
      <div id="profile"><ProfileCustomization /></div>
      <div id="coupons"><PromotionsCoupons /></div>
      <div id="team"><TeamAccess /></div>
    </div>
  );
} 