import React, { useState } from 'react';
import { FaToggleOn, FaToggleOff, FaEdit, FaTrash, FaPlus, FaSearch, FaSort, FaTimes, FaCheck } from 'react-icons/fa';
import styles from './ServiceManagement.module.css';

const mockServices = [
  { id: 1, name: 'Haircut', duration: 30, cost: 25, status: true, category: 'Salon', buffer: 10 },
  { id: 2, name: 'Yoga', duration: 60, cost: 15, status: true, category: 'Fitness', buffer: 5 },
  { id: 3, name: 'Car Wash', duration: 45, cost: 20, status: false, category: 'Automobile', buffer: 15 },
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

export default function ServiceManagement() {
  const [services, setServices] = useState(mockServices);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', duration: '', cost: '', category: '', buffer: '' });
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name-asc');
  const [editModal, setEditModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState('all');

  let filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || (filter === 'active' ? s.status : !s.status))
  );
  if (sort === 'name-asc') filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'name-desc') filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
  if (sort === 'cost-asc') filtered = filtered.sort((a, b) => a.cost - b.cost);
  if (sort === 'cost-desc') filtered = filtered.sort((a, b) => b.cost - a.cost);
  if (sort === 'duration-asc') filtered = filtered.sort((a, b) => a.duration - b.duration);
  if (sort === 'duration-desc') filtered = filtered.sort((a, b) => b.duration - a.duration);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = e => {
    e.preventDefault();
    setServices([...services, { ...form, id: Date.now(), status: true }]);
    setForm({ name: '', duration: '', cost: '', category: '', buffer: '' });
    setShowForm(false);
  };
  const handleToggle = id => setServices(services.map(s => s.id === id ? { ...s, status: !s.status } : s));
  const handleDelete = id => setDeleteId(id);
  const confirmDelete = () => {
    setServices(services.filter(s => s.id !== deleteId));
    setDeleteId(null);
  };
  const handleEdit = s => setEditModal(s);
  const handleEditSave = () => {
    setServices(services.map(s => s.id === editModal.id ? editModal : s));
    setEditModal(null);
  };
  return (
    <section className={styles.section + ' service-management'}>
      <h2>Service Management</h2>
      <div className={styles.filtersRow}>
        <span className={styles.searchBox}><FaSearch /><input placeholder="Search by name" value={search} onChange={e => setSearch(e.target.value)} /></span>
        <span className={styles.sortBox}><FaSort />
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="cost-asc">Cost ↑</option>
            <option value="cost-desc">Cost ↓</option>
            <option value="duration-asc">Duration ↑</option>
            <option value="duration-desc">Duration ↓</option>
          </select>
        </span>
        <span className={styles.filterBox}>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </span>
      </div>
      <div className={styles.list + ' service-list'}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState + ' empty-state'}>
            {undrawSvg}
            <h3>No Services</h3>
            <p>No services match your search/filter.</p>
          </div>
        ) : filtered.map(s => (
          <div className={`service-item${s.status ? '' : ' inactive'}`} key={s.id}>
            <div className="service-info">
              <span className="service-name">{s.name}</span>
              <span className="service-meta">{s.duration} min | ${s.cost} | {s.category}</span>
              <span className="service-buffer">Buffer: {s.buffer} min</span>
              <span className={styles.statusBadge} style={{ background: s.status ? '#4caf50' : '#9e9e9e' }}>{s.status ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="service-actions">
              <button onClick={() => handleToggle(s.id)}>{s.status ? <FaToggleOn /> : <FaToggleOff />}</button>
              <button onClick={() => handleEdit(s)}><FaEdit /></button>
              <button onClick={() => handleDelete(s.id)}><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.addBtn + ' add-btn'} onClick={() => setShowForm(!showForm)}><FaPlus /> Add New Service</button>
      {showForm && (
        <form className={styles.form + ' service-form'} onSubmit={handleAdd}>
          <input name="name" placeholder="Service Name" value={form.name} onChange={handleChange} required />
          <input name="duration" placeholder="Duration (min)" value={form.duration} onChange={handleChange} required />
          <input name="cost" placeholder="Cost ($)" value={form.cost} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
          <input name="buffer" placeholder="Buffer Time (min)" value={form.buffer} onChange={handleChange} required />
          <button type="submit">Add Service</button>
        </form>
      )}
      {editModal && (
        <div className={styles.modalOverlay} onClick={() => setEditModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setEditModal(null)}><FaTimes /></button>
            <h3>Edit Service</h3>
            <input name="name" value={editModal.name} onChange={e => setEditModal({ ...editModal, name: e.target.value })} />
            <input name="duration" value={editModal.duration} onChange={e => setEditModal({ ...editModal, duration: e.target.value })} />
            <input name="cost" value={editModal.cost} onChange={e => setEditModal({ ...editModal, cost: e.target.value })} />
            <input name="category" value={editModal.category} onChange={e => setEditModal({ ...editModal, category: e.target.value })} />
            <input name="buffer" value={editModal.buffer} onChange={e => setEditModal({ ...editModal, buffer: e.target.value })} />
            <button onClick={handleEditSave}><FaCheck /> Save</button>
          </div>
        </div>
      )}
      {deleteId && (
        <div className={styles.modalOverlay} onClick={() => setDeleteId(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setDeleteId(null)}><FaTimes /></button>
            <h3>Delete Service?</h3>
            <p>Are you sure you want to delete this service?</p>
            <button onClick={confirmDelete} style={{ background: '#f44336', color: '#fff', marginRight: 8 }}>Delete</button>
            <button onClick={() => setDeleteId(null)}>Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
} 