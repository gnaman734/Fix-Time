import React, { useState, useRef } from 'react';
import { FaEdit, FaCheckCircle, FaInfoCircle, FaUserCircle, FaTimes } from 'react-icons/fa';
import styles from './ProfileCustomization.module.css';

const mockProfile = {
  name: 'Naman’s Salon',
  logo: '',
  description: 'Professional salon and wellness services.',
  address: '123 Main St, City',
  tags: ['Salon', 'Wellness', 'Haircut'],
  contact: '+1 234 567 890',
  verified: true,
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

export default function ProfileCustomization() {
  const [profile, setProfile] = useState(mockProfile);
  const [modal, setModal] = useState(false);
  const [avatar, setAvatar] = useState(profile.logo);
  const [edit, setEdit] = useState(profile);
  const fileInput = useRef();

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEdit({ ...edit, [name]: name === 'tags' ? value.split(',').map(t => t.trim()) : value });
  };
  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setAvatar(ev.target.result);
      reader.readAsDataURL(file);
    }
  };
  const handleSave = e => {
    e.preventDefault();
    setProfile({ ...edit, logo: avatar });
    setModal(false);
  };
  const handleEditClick = () => {
    setEdit(profile);
    setAvatar(profile.logo);
    setModal(true);
  };
  if (!profile.name && !profile.description && !profile.address && !profile.contact) {
    return (
      <section className={styles.section + ' profile-customization'}>
        <div className={styles.emptyState + ' empty-state'}>
          {undrawSvg}
          <h3>No Profile Data</h3>
          <p>Click the edit button to add your business profile.</p>
          <button className={styles.editBtn} onClick={handleEditClick} title="Edit Profile"><FaEdit /> Edit Profile</button>
        </div>
      </section>
    );
  }
  return (
    <section className={styles.section + ' profile-customization'}>
      <h2>Profile Customization</h2>
      <div className={styles.profileCard + ' profile-card'}>
        <div className={styles.avatarBox}>
          {profile.logo ? (
            <img src={profile.logo} alt="Avatar" className={styles.avatarImg} />
          ) : (
            <FaUserCircle className={styles.avatarPlaceholder} />
          )}
        </div>
        <div className={styles.profileInfo}>
          <div className={styles.profileHeader}>
            <span className={styles.profileName}>{profile.name}</span>
            {profile.verified && <span className={styles.verifiedBadge} title="Verified"><FaCheckCircle /></span>}
            <button className={styles.editBtn} onClick={handleEditClick} title="Edit Profile"><FaEdit /></button>
          </div>
          <span className={styles.profileDesc}>{profile.description}</span>
          <span className={styles.profileAddress}><FaInfoCircle title="Location" /> {profile.address}</span>
          <span className={styles.profileContact}><FaInfoCircle title="Contact" /> {profile.contact}</span>
          <span className={styles.profileTags}>{profile.tags.map((t, i) => <span key={i} className={styles.tag}>{t}</span>)}</span>
        </div>
      </div>
      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModal(false)}><FaTimes /></button>
            <h3>Edit Profile</h3>
            <form className={styles.form + ' profile-form'} onSubmit={handleSave}>
              <div className={styles.avatarEditBox}>
                {avatar ? <img src={avatar} alt="Avatar Preview" className={styles.avatarImg} /> : <FaUserCircle className={styles.avatarPlaceholder} />}
                <input type="file" accept="image/*" ref={fileInput} style={{ display: 'none' }} onChange={handleAvatarChange} />
                <button type="button" className={styles.avatarUploadBtn} onClick={() => fileInput.current.click()}>Upload Avatar</button>
              </div>
              <div className={styles.profileRow}>
                <label>Business Name</label>
                <input name="name" value={edit.name} onChange={handleEditChange} required />
              </div>
              <div className={styles.profileRow}>
                <label>Description</label>
                <textarea name="description" value={edit.description} onChange={handleEditChange} required />
              </div>
              <div className={styles.profileRow}>
                <label>Location</label>
                <input name="address" value={edit.address} onChange={handleEditChange} required />
              </div>
              <div className={styles.profileRow}>
                <label>Tags</label>
                <input name="tags" value={edit.tags.join(', ')} onChange={handleEditChange} />
              </div>
              <div className={styles.profileRow}>
                <label>Contact Info</label>
                <input name="contact" value={edit.contact} onChange={handleEditChange} required />
              </div>
              <button type="submit" className={styles.saveBtn}><FaCheckCircle /> Save</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
} 