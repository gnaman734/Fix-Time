import React, { useState } from 'react';
import { FaCalendarAlt, FaCut, FaClock, FaChartPie, FaUsers, FaStar, FaUserCircle, FaGift, FaUserFriends, FaMoon, FaSun, FaBars } from 'react-icons/fa';
import styles from './Sidebar.module.css';

const sections = [
  { id: 'bookings', label: 'Bookings', icon: <FaCalendarAlt /> },
  { id: 'services', label: 'Services', icon: <FaCut /> },
  { id: 'availability', label: 'Availability', icon: <FaClock /> },
  { id: 'analytics', label: 'Analytics', icon: <FaChartPie /> },
  { id: 'customers', label: 'Customers', icon: <FaUsers /> },
  { id: 'reviews', label: 'Reviews', icon: <FaStar /> },
  { id: 'profile', label: 'Profile', icon: <FaUserCircle /> },
  { id: 'coupons', label: 'Coupons', icon: <FaGift /> },
  { id: 'team', label: 'Team', icon: <FaUserFriends /> },
];

export default function Sidebar({ darkMode, setDarkMode, activeSection, onSectionNav }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className={styles.sidebar + (open ? ' ' + styles.open : '')}>
      <button className={styles.hamburger} onClick={() => setOpen(!open)} aria-label="Toggle sidebar">
        <FaBars />
      </button>
      <div className={styles.menu}>
        {sections.map(s => (
          <button
            key={s.id}
            className={styles.menuItem + (activeSection === s.id ? ' ' + styles.active : '')}
            onClick={() => { setOpen(false); onSectionNav(s.id); }}
            data-tooltip={s.label}
            aria-label={s.label}
          >
            {s.icon}
            <span className={styles.menuLabel}>{s.label}</span>
          </button>
        ))}
      </div>
      <div className={styles.bottom}>
        <button
          className={styles.darkToggle}
          onClick={() => setDarkMode(dm => !dm)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
          <span className={styles.menuLabel}>{darkMode ? 'Light' : 'Dark'} Mode</span>
        </button>
      </div>
    </nav>
  );
} 