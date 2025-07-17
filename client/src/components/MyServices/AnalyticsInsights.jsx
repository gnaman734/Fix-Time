import React from 'react';
import styles from './AnalyticsInsights.module.css';

const mockAnalytics = {
  weeklyBookings: 18,
  monthlyBookings: 72,
  revenue: 1200,
  mostBooked: 'Haircut',
  repeatCustomers: 8,
  pie: [
    { label: 'Haircut', value: 40, color: '#6C8AE4' },
    { label: 'Yoga', value: 25, color: '#A3B8D8' },
    { label: 'Car Wash', value: 35, color: '#BFD7ED' },
  ],
  bar: [
    { label: 'Week 1', value: 15 },
    { label: 'Week 2', value: 18 },
    { label: 'Week 3', value: 20 },
    { label: 'Week 4', value: 19 },
  ],
};

export default function AnalyticsInsights() {
  return (
    <section className={styles.section + ' analytics-insights'}>
      <h2>Analytics & Insights</h2>
      <div className={styles.cards + ' analytics-cards'}>
        <div className="analytics-item">
          <span>Total Bookings (Month)</span>
          <strong>{mockAnalytics.monthlyBookings}</strong>
        </div>
        <div className="analytics-item">
          <span>Total Revenue</span>
          <strong>${mockAnalytics.revenue}</strong>
        </div>
        <div className="analytics-item">
          <span>Most Booked</span>
          <strong>{mockAnalytics.mostBooked}</strong>
        </div>
        <div className="analytics-item">
          <span>Repeat Customers</span>
          <strong>{mockAnalytics.repeatCustomers}</strong>
        </div>
      </div>
      <div className={styles.chartsRow + ' charts-row'}>
        <div className={styles.pieChart + ' pie-chart'}>
          <svg width="120" height="120" viewBox="0 0 32 32">
            {(() => {
              let acc = 0;
              return mockAnalytics.pie.map((slice, i) => {
                const val = slice.value / 100 * 100;
                const dash = `${val} ${100 - val}`;
                const el = <circle key={i} r="16" cx="16" cy="16" fill="transparent" stroke={slice.color} strokeWidth="8" strokeDasharray={dash} strokeDashoffset={-acc} />;
                acc -= val;
                return el;
              });
            })()}
          </svg>
          <div className={styles.pieLegend + ' pie-legend'}>
            {mockAnalytics.pie.map((slice, i) => (
              <span key={i} style={{ color: slice.color }}>{slice.label}</span>
            ))}
          </div>
        </div>
        <div className={styles.barChart + ' bar-chart'}>
          <svg width="120" height="80">
            {mockAnalytics.bar.map((bar, i) => (
              <rect key={i} x={i*25+10} y={80-bar.value*3} width="18" height={bar.value*3} fill="#6C8AE4" rx="4" />
            ))}
          </svg>
          <div className={styles.barLegend + ' bar-legend'}>
            {mockAnalytics.bar.map((bar, i) => (
              <span key={i}>{bar.label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 