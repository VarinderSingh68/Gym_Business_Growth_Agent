import React from 'react';
import Icon from '../../components/Icon';

function StatCard({ icon, label, value, accent = 'cyan' }) {
  return (
    <article className={`stat-card accent-${accent}`}>
      <span className="stat-icon">
        <Icon name={icon} />
      </span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

export default StatCard;
