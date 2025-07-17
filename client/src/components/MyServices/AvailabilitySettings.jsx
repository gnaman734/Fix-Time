import React, { useState } from 'react';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import styles from './AvailabilitySettings.module.css';

export default function AvailabilitySettings() {
  const [availability, setAvailability] = useState({
    Mon: { enabled: true, slots: ['09:00-12:00', '14:00-18:00'] },
    Tue: { enabled: true, slots: ['09:00-12:00', '14:00-18:00'] },
    Wed: { enabled: true, slots: ['09:00-12:00', '14:00-18:00'] },
    Thu: { enabled: true, slots: ['09:00-12:00', '14:00-18:00'] },
    Fri: { enabled: true, slots: ['09:00-12:00', '14:00-18:00'] },
    Sat: { enabled: false, slots: [] },
    Sun: { enabled: false, slots: [] },
  });
  const [holidays, setHolidays] = useState(['2024-07-20']);
  const [breaks, setBreaks] = useState(['12:00-13:00']);
  const days = Object.keys(availability);
  const toggleDay = d => setAvailability({ ...availability, [d]: { ...availability[d], enabled: !availability[d].enabled } });
  return (
    <section className={styles.section + ' availability-settings'}>
      <h2>Availability & Schedule</h2>
      <div className={styles.days + ' availability-days'}>
        {days.map(d => (
          <div key={d} className={`day-row${availability[d].enabled ? '' : ' off'}`}>
            <span>{d}</span>
            <button onClick={() => toggleDay(d)}>{availability[d].enabled ? <FaToggleOn /> : <FaToggleOff />}</button>
            <span className="slots">{availability[d].slots.join(', ')}</span>
          </div>
        ))}
      </div>
      <div className={styles.extras + ' availability-extras'}>
        <div>
          <strong>Holidays:</strong> {holidays.join(', ')}
        </div>
        <div>
          <strong>Breaks:</strong> {breaks.join(', ')}
        </div>
      </div>
    </section>
  );
} 