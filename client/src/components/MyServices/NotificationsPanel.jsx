import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import styles from './NotificationsPanel.module.css';

const mockNotifications = [
  { id: 1, type: 'booking', text: 'New booking from Alice Smith', unread: true },
  { id: 2, type: 'cancel', text: 'Booking cancelled by Dana White', unread: true },
  { id: 3, type: 'feedback', text: 'New feedback from Bob Lee', unread: false },
  { id: 4, type: 'system', text: 'System maintenance on July 20', unread: true },
];

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const unread = mockNotifications.filter(n => n.unread).length;
  return (
    <div className={styles.panel + ' notifications-panel'}>
      <button
        className={`bell-btn${open ? ' active' : ''}`}
        onClick={() => setOpen(true)}
        title="Notifications"
        aria-label="Show notifications"
      >
        <FaBell />
        {unread > 0 && <span className="notif-count">{unread}</span>}
      </button>
      {open && (
        <div className={styles.overlay + ' notif-modal-overlay'} onClick={() => setOpen(false)}>
          <div className={styles.grid + ' notif-modal-grid'} onClick={e => e.stopPropagation()}>
            <button className="notif-close-btn" onClick={() => setOpen(false)} aria-label="Close notifications">&times;</button>
            <h3>Notifications</h3>
            <div className={styles.notifGrid + ' notif-grid'}>
              {mockNotifications.length === 0 ? (
                <div className="notif-empty">No notifications</div>
              ) : (
                mockNotifications.map(n => (
                  <div key={n.id} className={`notif-item${n.unread ? ' unread' : ''}`}>{n.text}</div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 