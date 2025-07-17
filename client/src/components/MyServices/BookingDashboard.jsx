import React, { useState } from 'react';
import { FaCalendarAlt, FaSearch, FaSort, FaTimes } from 'react-icons/fa';
import styles from './BookingDashboard.module.css';

const mockBookings = [
  { id: 1, name: 'Alice Smith', date: '2024-07-15', time: '10:00', service: 'Haircut', status: 'Confirmed' },
  { id: 2, name: 'Bob Lee', date: '2024-07-15', time: '12:00', service: 'Yoga', status: 'Pending' },
  { id: 3, name: 'Charlie Kim', date: '2024-07-14', time: '09:00', service: 'Car Wash', status: 'No-show' },
  { id: 4, name: 'Dana White', date: '2024-07-13', time: '15:00', service: 'Haircut', status: 'Cancelled' },
];

const statusColors = {
  Confirmed: '#4caf50',
  Pending: '#ff9800',
  'No-show': '#f44336',
  Cancelled: '#9e9e9e',
};

const undrawSvg = (
  <svg width="180" height="120" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="400" cy="500" rx="300" ry="40" fill="#F2F2F2"/>
    <rect x="320" y="200" width="160" height="200" rx="20" fill="#6C8AE4"/>
    <rect x="350" y="250" width="100" height="20" rx="10" fill="#fff"/>
    <rect x="350" y="290" width="100" height="20" rx="10" fill="#fff"/>
    <rect x="350" y="330" width="100" height="20" rx="10" fill="#fff"/>
    <circle cx="400" cy="230" r="15" fill="#fff"/>
  </svg>
);

export default function BookingDashboard() {
  const [filter, setFilter] = useState('Upcoming');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date-desc');
  const [modal, setModal] = useState(null);
  const filters = ['Upcoming', 'Today', 'Past', 'Cancelled'];
  const todayStr = new Date().toISOString().slice(0, 10);
  let filtered = mockBookings.filter(b =>
    (filter === 'Upcoming' ? b.status === 'Confirmed' :
    filter === 'Today' ? b.date === todayStr :
    filter === 'Past' ? b.status === 'No-show' :
    filter === 'Cancelled' ? b.status === 'Cancelled' : true)
    && b.name.toLowerCase().includes(search.toLowerCase())
  );
  if (sort === 'date-desc') filtered = filtered.sort((a, b) => b.date.localeCompare(a.date));
  if (sort === 'date-asc') filtered = filtered.sort((a, b) => a.date.localeCompare(b.date));
  if (sort === 'name-asc') filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'name-desc') filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
  return (
    <section className={styles.section + ' booking-dashboard'}>
      <h2>Booking Dashboard</h2>
      <div className={styles.filters + ' booking-filters'}>
        {filters.map(f => (
          <button key={f} className={filter === f ? styles.active : ''} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <div className={styles.searchSortRow}>
          <span className={styles.searchBox}><FaSearch /><input placeholder="Search by customer" value={search} onChange={e => setSearch(e.target.value)} /></span>
          <span className={styles.sortBox}><FaSort />
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="date-desc">Date ↓</option>
              <option value="date-asc">Date ↑</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </span>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className={styles.emptyState + ' empty-state'}>
          {undrawSvg}
          <h3>No Bookings</h3>
          <p>You have no bookings in this category.</p>
        </div>
      ) : (
        <div className={styles.cards + ' booking-cards'}>
          {filtered.map(b => (
            <div className={`booking-card status-${b.status.toLowerCase()}`} key={b.id}>
              <div className="booking-card-header">
                <span className="booking-name">{b.name}</span>
                <span className="booking-status-badge" style={{ background: statusColors[b.status] }}>{b.status}</span>
              </div>
              <div className="booking-card-body">
                <span>{b.service}</span>
                <span>{b.date} {b.time}</span>
              </div>
              <div className="booking-card-actions">
                <button onClick={() => setModal(b)}>View</button>
                <button>Message</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className={styles.calendarMini + ' calendar-mini'}>
        <FaCalendarAlt className="calendar-icon" />
        <div className={styles.calendarDays + ' calendar-days'}>
          {days.map((d, i) => (
            <div key={i} className={`calendar-day${mockBookings.some(b => b.date === d.toISOString().slice(0,10)) ? ' booked' : ''}`}>
              {d.getDate()}
            </div>
          ))}
        </div>
      </div>
      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModal(null)}><FaTimes /></button>
            <h3>Booking Details</h3>
            <p><b>Customer:</b> {modal.name}</p>
            <p><b>Service:</b> {modal.service}</p>
            <p><b>Date:</b> {modal.date} {modal.time}</p>
            <p><b>Status:</b> <span style={{ color: statusColors[modal.status] }}>{modal.status}</span></p>
          </div>
        </div>
      )}
    </section>
  );
} 