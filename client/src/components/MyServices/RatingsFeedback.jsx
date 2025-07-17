import React, { useState } from 'react';
import { FaStar, FaEdit, FaFlag, FaSearch, FaSort, FaTimes } from 'react-icons/fa';
import styles from './RatingsFeedback.module.css';

const mockReviews = [
  { id: 1, service: 'Haircut', name: 'Alice Smith', rating: 5, text: 'Great service!', date: '2024-07-10' },
  { id: 2, service: 'Yoga', name: 'Bob Lee', rating: 4, text: 'Very relaxing.', date: '2024-07-09' },
  { id: 3, service: 'Car Wash', name: 'Charlie Kim', rating: 3, text: 'Good, but a bit slow.', date: '2024-07-08' },
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

export default function RatingsFeedback() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date-desc');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null);
  let filtered = mockReviews.filter(r =>
    (filter === 'all' || r.rating === Number(filter)) &&
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.service.toLowerCase().includes(search.toLowerCase()))
  );
  if (sort === 'date-desc') filtered = filtered.sort((a, b) => b.date.localeCompare(a.date));
  if (sort === 'date-asc') filtered = filtered.sort((a, b) => a.date.localeCompare(b.date));
  if (sort === 'rating-desc') filtered = filtered.sort((a, b) => b.rating - a.rating);
  if (sort === 'rating-asc') filtered = filtered.sort((a, b) => a.rating - b.rating);
  return (
    <section className={styles.section + ' ratings-feedback'}>
      <h2>Ratings & Feedback</h2>
      <div className={styles.filtersRow}>
        <span className={styles.searchBox}><FaSearch /><input placeholder="Search by name/service" value={search} onChange={e => setSearch(e.target.value)} /></span>
        <span className={styles.sortBox}><FaSort />
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="date-desc">Newest</option>
            <option value="date-asc">Oldest</option>
            <option value="rating-desc">Rating ↓</option>
            <option value="rating-asc">Rating ↑</option>
          </select>
        </span>
        <span className={styles.filterBox}>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </span>
      </div>
      <div className={styles.list + ' reviews-list'}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState + ' empty-state'}>
            {undrawSvg}
            <h3>No Reviews</h3>
            <p>No reviews match your search/filter.</p>
          </div>
        ) : filtered.map(r => (
          <div className="review-item" key={r.id}>
            <div className="review-header">
              <span className="review-name">{r.name}</span>
              <span className="review-service">({r.service})</span>
              <span className="review-date">{r.date}</span>
            </div>
            <div className="review-rating">
              {[...Array(5)].map((_, i) => <FaStar key={i} className={i < r.rating ? 'star filled' : 'star'} />)}
            </div>
            <div className="review-text">{r.text}</div>
            <div className="review-actions">
              <button onClick={() => setModal(r)}><FaEdit /> Respond</button>
              <button><FaFlag /> Report</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModal(null)}><FaTimes /></button>
            <h3>Review Details</h3>
            <p><b>Name:</b> {modal.name}</p>
            <p><b>Service:</b> {modal.service}</p>
            <p><b>Date:</b> {modal.date}</p>
            <p><b>Rating:</b> {modal.rating} Stars</p>
            <p><b>Feedback:</b> {modal.text}</p>
          </div>
        </div>
      )}
    </section>
  );
} 