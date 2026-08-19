import React, { useEffect, useRef } from 'react';
import Icon from '../../components/Icon';
import { AdminInput, AdminSelect, AdminTextarea, GlowButton } from '../../components/ui';
import { handleMediaUpload } from '../../lib/api';

function FieldControl({ field, form, setForm, onError, uploadingField, setUploadingField }) {
  const value = form[field.name] ?? '';

  if (field.type === 'textarea') {
    return <AdminTextarea label={field.label} value={value} onChange={(nextValue) => setForm({ ...form, [field.name]: nextValue })} />;
  }

  if (field.type === 'select') {
    return <AdminSelect label={field.label} value={value} onChange={(nextValue) => setForm({ ...form, [field.name]: nextValue })} options={field.options} />;
  }

  if (field.type === 'checkbox') {
    return (
      <label className="admin-check">
        <input
          checked={Boolean(value)}
          onChange={(event) => setForm({ ...form, [field.name]: event.target.checked })}
          type="checkbox"
        />
        {field.label}
      </label>
    );
  }

  if (field.type === 'file') {
    return (
      <label className={`admin-field ${field.wide ? 'wide' : ''}`}>
        {field.label}
        <input
          accept={field.accept}
          type="file"
          onChange={(event) => handleMediaUpload(event, {
            fieldName: field.name,
            setUploadingField,
            onError,
            onLoaded: (fileData) => {
              const nextForm = {
                ...form,
                [field.target || 'image']: fileData.url,
              };
              if (field.mediaTypeField) {
                nextForm[field.mediaTypeField] = fileData.type.startsWith('video') ? 'video' : 'image';
              }
              setForm(nextForm);
            },
          })}
        />
        {uploadingField === field.name && <span className="upload-status">Uploading to Cloudinary...</span>}
      </label>
    );
  }

  return (
    <AdminInput
      label={field.label}
      required={field.required}
      type={field.type || 'text'}
      value={value}
      wide={field.wide}
      onChange={(nextValue) => setForm({ ...form, [field.name]: nextValue })}
    />
  );
}

function RecordDrawer({
  open,
  title,
  description,
  fields,
  form,
  setForm,
  onSubmit,
  onClose,
  editing,
  uploadingField,
  setUploadingField,
  onError,
  busy,
  error,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    panelRef.current?.querySelector('input, select, textarea')?.focus();
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div
        aria-label={title}
        aria-modal="true"
        className="record-drawer"
        onClick={(event) => event.stopPropagation()}
        ref={panelRef}
        role="dialog"
      >
        <div className="drawer-head">
          <div>
            <p className="eyebrow">{editing ? 'Update record' : 'New record'}</p>
            <h2>{title}</h2>
            {description && <p className="drawer-description">{description}</p>}
          </div>
          <button aria-label="Close panel" className="icon-button" onClick={onClose} type="button">
            <Icon name="close" />
          </button>
        </div>
        <form className="admin-form drawer-form" onSubmit={onSubmit}>
          <div className="drawer-fields">
            {fields.map((field) => (
              <FieldControl
                field={field}
                form={form}
                key={field.name}
                onError={onError}
                setForm={setForm}
                setUploadingField={setUploadingField}
                uploadingField={uploadingField}
              />
            ))}
          </div>
          {error && <p className="drawer-error" role="alert">{error}</p>}
          <div className="drawer-actions">
            <button className="ghost-action" onClick={onClose} type="button">Cancel</button>
            <GlowButton label={busy ? 'Saving...' : editing ? 'Save changes' : 'Add record'} type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecordDrawer;
