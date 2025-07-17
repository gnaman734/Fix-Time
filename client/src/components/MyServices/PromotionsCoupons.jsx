import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSort, FaSearch, FaTimes, FaCheckCircle } from 'react-icons/fa';
import styles from './PromotionsCoupons.module.css';

const mockCoupons = [
  { id: 1, name: 'SUMMER10', amount: 10, type: '%', expiry: '2024-08-01', used: 5, status: 'Active' },
  { id: 2, name: 'WELCOME5', amount: 5, type: '$', expiry: '2024-12-31', used: 12, status: 'Upcoming' },
  { id: 3, name: 'EXPIRED20', amount: 20, type: '%', expiry: '2023-12-31', used: 20, status: 'Expired' },
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

const statusColors = {
  Active: '#4caf50',
  Upcoming: '#ff9800',
  Expired: '#9e9e9e',
};

export default function PromotionsCoupons() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [form, setForm] = useState({ name: '', amount: '', type: '%', expiry: '' });
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('expiry-asc');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  let filtered = coupons.filter(c =>
    (filter === 'all' || c.status === filter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()))
  );
  if (sort === 'expiry-asc') filtered = filtered.sort((a, b) => a.expiry.localeCompare(b.expiry));
  if (sort === 'expiry-desc') filtered = filtered.sort((a, b) => b.expiry.localeCompare(a.expiry));
  if (sort === 'amount-asc') filtered = filtered.sort((a, b) => a.amount - b.amount);
  if (sort === 'amount-desc') filtered = filtered.sort((a, b) => b.amount - a.amount);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = e => {
    e.preventDefault();
    setCoupons([...coupons, { ...form, id: Date.now(), used: 0, status: 'Upcoming' }]);
    setForm({ name: '', amount: '', type: '%', expiry: '' });
  };
  const handleEdit = c => setModal(c);
  const handleEditSave = () => {
    setCoupons(coupons.map(c => c.id === modal.id ? modal : c));
    setModal(null);
  };
  const handleDelete = id => setDeleteId(id);
  const confirmDelete = () => {
    setCoupons(coupons.filter(c => c.id !== deleteId));
    setDeleteId(null);
  };
  return (
    <section className={styles.section + ' promotions-coupons'}>
      <h2>Promotions & Coupons</h2>
      <div className={styles.filtersRow}>
        <span className={styles.searchBox}><FaSearch /><input placeholder="Search by code" value={search} onChange={e => setSearch(e.target.value)} /></span>
        <span className={styles.sortBox}><FaSort />
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="expiry-asc">Expiry ↑</option>
            <option value="expiry-desc">Expiry ↓</option>
            <option value="amount-asc">Amount ↑</option>
            <option value="amount-desc">Amount ↓</option>
          </select>
        </span>
        <span className={styles.filterBox}>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Expired">Expired</option>
          </select>
        </span>
      </div>
      <div className={styles.list + ' coupons-list'}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState + ' empty-state'}>
            {undrawSvg}
            <h3>No Coupons</h3>
            <p>No coupons match your search/filter.</p>
          </div>
        ) : filtered.map(c => (
          <div className={styles.couponItem + ' coupon-item'} key={c.id} style={{ animation: 'fadeIn 0.3s' }}>
            <span className={styles.couponName}>{c.name}</span>
            <span className={styles.couponAmount}>{c.amount}{c.type}</span>
            <span className={styles.couponExpiry}>Exp: {c.expiry}</span>
            <span className={styles.couponUsed}>Used: {c.used}</span>
            <span className={styles.statusBadge} style={{ background: statusColors[c.status] }}>{c.status}</span>
            <button onClick={() => handleEdit(c)} title="Edit Coupon"><FaEdit /></button>
            <button onClick={() => handleDelete(c.id)} title="Delete Coupon"><FaTrash /></button>
          </div>
        ))}
      </div>
      <form className={styles.form + ' coupon-form'} onSubmit={handleAdd}>
        <input name="name" placeholder="Coupon Name" value={form.name} onChange={handleChange} required />
        <input name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="%">%</option>
          <option value="$">$</option>
        </select>
        <input name="expiry" placeholder="Expiry (YYYY-MM-DD)" value={form.expiry} onChange={handleChange} required />
        <button type="submit"><FaPlus /> Add Coupon</button>
      </form>
      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModal(null)}><FaTimes /></button>
            <h3>Edit Coupon</h3>
            <div className={styles.profileRow}>
              <label>Coupon Name</label>
              <input name="name" value={modal.name} onChange={e => setModal({ ...modal, name: e.target.value })} />
            </div>
            <div className={styles.profileRow}>
              <label>Amount</label>
              <input name="amount" value={modal.amount} onChange={e => setModal({ ...modal, amount: e.target.value })} />
            </div>
            <div className={styles.profileRow}>
              <label>Type</label>
              <select name="type" value={modal.type} onChange={e => setModal({ ...modal, type: e.target.value })}>
                <option value="%">%</option>
                <option value="$">$</option>
              </select>
            </div>
            <div className={styles.profileRow}>
              <label>Expiry</label>
              <input name="expiry" value={modal.expiry} onChange={e => setModal({ ...modal, expiry: e.target.value })} />
            </div>
            <div className={styles.profileRow}>
              <label>Status</label>
              <select name="status" value={modal.status} onChange={e => setModal({ ...modal, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
            <button className={styles.saveBtn} onClick={handleEditSave}><FaCheckCircle /> Save</button>
          </div>
        </div>
      )}
      {deleteId && (
        <div className={styles.modalOverlay} onClick={() => setDeleteId(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setDeleteId(null)}><FaTimes /></button>
            <h3>Delete Coupon?</h3>
            <p>Are you sure you want to delete this coupon?</p>
            <button className={styles.deleteBtn} onClick={confirmDelete}><FaTrash /> Delete</button>
          </div>
        </div>
      )}
    </section>
  );
} 