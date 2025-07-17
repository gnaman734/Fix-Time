import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSort, FaSearch, FaTimes, FaCheckCircle, FaUserPlus } from 'react-icons/fa';
import styles from './TeamAccess.module.css';

const mockTeam = [
  { id: 1, name: 'Priya', role: 'Stylist', services: ['Haircut'], performance: 4.8, status: 'Active' },
  { id: 2, name: 'Rahul', role: 'Yoga Trainer', services: ['Yoga'], performance: 4.6, status: 'Inactive' },
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
  Inactive: '#9e9e9e',
};

export default function TeamAccess() {
  const [team, setTeam] = useState(mockTeam);
  const [form, setForm] = useState({ name: '', role: '', services: '', performance: '', status: 'Active' });
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name-asc');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  let filtered = team.filter(m =>
    (filter === 'all' || m.status === filter) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase()))
  );
  if (sort === 'name-asc') filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'name-desc') filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
  if (sort === 'performance-desc') filtered = filtered.sort((a, b) => b.performance - a.performance);
  if (sort === 'performance-asc') filtered = filtered.sort((a, b) => a.performance - b.performance);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = e => {
    e.preventDefault();
    setTeam([...team, { ...form, id: Date.now(), services: form.services.split(',').map(s => s.trim()) }]);
    setForm({ name: '', role: '', services: '', performance: '', status: 'Active' });
    setAddModal(false);
  };
  const handleEdit = m => setModal(m);
  const handleEditSave = () => {
    setTeam(team.map(m => m.id === modal.id ? modal : m));
    setModal(null);
  };
  const handleDelete = id => setDeleteId(id);
  const confirmDelete = () => {
    setTeam(team.filter(m => m.id !== deleteId));
    setDeleteId(null);
  };
  return (
    <section className={styles.section + ' team-access'}>
      <h2>Team Access</h2>
      <div className={styles.filtersRow}>
        <span className={styles.searchBox}><FaSearch /><input placeholder="Search by name/role" value={search} onChange={e => setSearch(e.target.value)} /></span>
        <span className={styles.sortBox}><FaSort />
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="performance-desc">Performance ↓</option>
            <option value="performance-asc">Performance ↑</option>
          </select>
        </span>
        <span className={styles.filterBox}>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </span>
        <button className={styles.addBtn} onClick={() => setAddModal(true)} title="Add Team Member"><FaUserPlus /> Add</button>
      </div>
      <div className={styles.list + ' team-list'}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState + ' empty-state'}>
            {undrawSvg}
            <h3>No Team Members</h3>
            <p>No team members match your search/filter.</p>
          </div>
        ) : filtered.map(m => (
          <div className={styles.teamItem + ' team-item'} key={m.id} style={{ animation: 'fadeIn 0.3s' }}>
            <div className={styles.teamInfo + ' team-info'}>
              <span className={styles.teamName}>{m.name}</span>
              <span className={styles.teamRole}>{m.role}</span>
              <span className={styles.teamServices}>{m.services.join(', ')}</span>
              <span className={styles.teamPerformance}>Performance: {m.performance}</span>
              <span className={styles.statusBadge} style={{ background: statusColors[m.status] }}>{m.status}</span>
            </div>
            <button onClick={() => handleEdit(m)} title="Edit Member"><FaEdit /></button>
            <button onClick={() => handleDelete(m.id)} title="Delete Member"><FaTrash /></button>
          </div>
        ))}
      </div>
      {addModal && (
        <div className={styles.modalOverlay} onClick={() => setAddModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setAddModal(false)}><FaTimes /></button>
            <h3>Add Team Member</h3>
            <form className={styles.form + ' team-form'} onSubmit={handleAdd}>
              <div className={styles.profileRow}>
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className={styles.profileRow}>
                <label>Role</label>
                <input name="role" value={form.role} onChange={handleChange} required />
              </div>
              <div className={styles.profileRow}>
                <label>Services</label>
                <input name="services" value={form.services} onChange={handleChange} required />
              </div>
              <div className={styles.profileRow}>
                <label>Performance</label>
                <input name="performance" value={form.performance} onChange={handleChange} required />
              </div>
              <div className={styles.profileRow}>
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button type="submit" className={styles.saveBtn}><FaCheckCircle /> Add</button>
            </form>
          </div>
        </div>
      )}
      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModal(null)}><FaTimes /></button>
            <h3>Edit Team Member</h3>
            <div className={styles.profileRow}>
              <label>Name</label>
              <input name="name" value={modal.name} onChange={e => setModal({ ...modal, name: e.target.value })} />
            </div>
            <div className={styles.profileRow}>
              <label>Role</label>
              <input name="role" value={modal.role} onChange={e => setModal({ ...modal, role: e.target.value })} />
            </div>
            <div className={styles.profileRow}>
              <label>Services</label>
              <input name="services" value={modal.services.join(', ')} onChange={e => setModal({ ...modal, services: e.target.value.split(',').map(s => s.trim()) })} />
            </div>
            <div className={styles.profileRow}>
              <label>Performance</label>
              <input name="performance" value={modal.performance} onChange={e => setModal({ ...modal, performance: e.target.value })} />
            </div>
            <div className={styles.profileRow}>
              <label>Status</label>
              <select name="status" value={modal.status} onChange={e => setModal({ ...modal, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
            <h3>Delete Team Member?</h3>
            <p>Are you sure you want to delete this team member?</p>
            <button className={styles.deleteBtn} onClick={confirmDelete}><FaTrash /> Delete</button>
          </div>
        </div>
      )}
    </section>
  );
} 