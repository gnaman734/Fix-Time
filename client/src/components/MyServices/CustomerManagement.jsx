import React, { useState } from 'react';
import { FaEnvelope, FaEdit, FaSearch, FaSort, FaTimes } from 'react-icons/fa';
import styles from './CustomerManagement.module.css';

const mockCustomers = [
  { id: 1, name: 'Alice Smith', contact: 'alice@email.com', history: 5 },
  { id: 2, name: 'Bob Lee', contact: 'bob@email.com', history: 3 },
  { id: 3, name: 'Charlie Kim', contact: 'charlie@email.com', history: 2 },
];

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

export default function CustomerManagement() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name-asc');
  const [modal, setModal] = useState(null);
  let filtered = mockCustomers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  if (sort === 'name-asc') filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'name-desc') filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
  if (sort === 'history-desc') filtered = filtered.sort((a, b) => b.history - a.history);
  if (sort === 'history-asc') filtered = filtered.sort((a, b) => a.history - b.history);
  return (
    <section className={styles.section + ' customer-management'}>
      <h2>Customer Management</h2>
      <div className={styles.filtersRow}>
        <span className={styles.searchBox}><FaSearch /><input placeholder="Search by name" value={search} onChange={e => setSearch(e.target.value)} /></span>
        <span className={styles.sortBox}><FaSort />
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="history-desc">Most Bookings</option>
            <option value="history-asc">Least Bookings</option>
          </select>
        </span>
      </div>
      <div className={styles.list + ' customer-list'}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState + ' empty-state'}>
            {undrawSvg}
            <h3>No Customers</h3>
            <p>No customers match your search/filter.</p>
          </div>
        ) : filtered.map(c => (
          <div className="customer-item" key={c.id}>
            <div className="customer-info">
              <span className="customer-name">{c.name}</span>
              <span className="customer-contact">{c.contact}</span>
              <span className="customer-history">Past bookings: {c.history}</span>
            </div>
            <div className="customer-actions">
              <button><FaEnvelope /></button>
              <button onClick={() => setModal(c)}><FaEdit /></button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModal(null)}><FaTimes /></button>
            <h3>Customer Details</h3>
            <p><b>Name:</b> {modal.name}</p>
            <p><b>Email:</b> {modal.contact}</p>
            <p><b>Past Bookings:</b> {modal.history}</p>
          </div>
        </div>
      )}
    </section>
  );
} 