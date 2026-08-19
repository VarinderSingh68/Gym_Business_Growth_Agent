import React from 'react';
import Icon from './Icon';

export function GlowButton({ label, onClick, variant = 'cyan', type = 'button' }) {
  return (
    <button className={`glow-button ${variant}`} onClick={onClick} type={type}>
      <span>{label}</span>
    </button>
  );
}

export function IconButton({ icon, label, onClick }) {
  return (
    <button className="icon-button" aria-label={label} onClick={onClick} type="button">
      <Icon name={icon} />
    </button>
  );
}

export function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Metric({ value, label }) {
  return (
    <article className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

export function EmptyPanel({ title, body }) {
  return (
    <article className="empty-panel">
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

export function AdminInput({ label, value, onChange, type = 'text', required = false, wide = false }) {
  return (
    <label className={`admin-field ${wide ? 'wide' : ''}`}>
      {label}
      <input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function AdminTextarea({ label, value, onChange }) {
  return (
    <label className="admin-field wide">
      {label}
      <textarea rows="5" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function AdminSelect({ label, value, onChange, options }) {
  return (
    <label className="admin-field">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export function AdminActions({ editing, onCancel }) {
  return (
    <div className="admin-actions">
      <GlowButton label={editing ? 'Update' : 'Add'} type="submit" />
      {editing && <button className="ghost-action" type="button" onClick={onCancel}>Cancel</button>}
    </div>
  );
}
