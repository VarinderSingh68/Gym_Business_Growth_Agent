import React from 'react';
import Icon from '../../components/Icon';
import EmptyState from './EmptyState';

function RecordCards({ items, getRowId, getPreview, getTitle, getBody, getMeta, onEdit, onDelete, emptyTitle, emptyBody }) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} body={emptyBody} icon="image" />;
  }

  return (
    <div className="record-card-grid">
      {items.map((item) => (
        <article className="record-card" key={getRowId(item)}>
          {getPreview && <div className="record-card-media">{getPreview(item)}</div>}
          <div className="record-card-body">
            <h3>{getTitle(item)}</h3>
            {getBody(item) && <p>{getBody(item)}</p>}
            {getMeta && <span className="record-card-meta">{getMeta(item)}</span>}
          </div>
          <div className="record-card-actions">
            <button onClick={() => onEdit(item)} type="button">
              <Icon name="edit" />
              Edit
            </button>
            <button className="danger" onClick={() => onDelete(item)} type="button">
              <Icon name="trash" />
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default RecordCards;
