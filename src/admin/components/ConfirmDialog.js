import React from 'react';
import Icon from '../../components/Icon';

function ConfirmDialog({ open, title, body, confirmLabel = 'Delete', onConfirm, onCancel }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        aria-labelledby="confirm-dialog-title"
        aria-modal="true"
        className="confirm-dialog"
        onClick={(event) => event.stopPropagation()}
        role="alertdialog"
      >
        <span className="confirm-icon">
          <Icon name="alert" />
        </span>
        <h3 id="confirm-dialog-title">{title}</h3>
        <p>{body}</p>
        <div className="confirm-actions">
          <button className="ghost-action" onClick={onCancel} type="button">Cancel</button>
          <button className="danger-action" onClick={onConfirm} type="button">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
