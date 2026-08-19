import React from 'react';
import Icon from '../../components/Icon';

function EmptyState({ title, body, icon = 'inbox' }) {
  return (
    <div className="admin-empty-state">
      <span className="empty-icon">
        <Icon name={icon} />
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export default EmptyState;
