import React, { useMemo, useState } from 'react';
import Icon from '../components/Icon';
import { GlowButton } from '../components/ui';
import { createId } from '../lib/api';
import ConfirmDialog from './components/ConfirmDialog';
import DataTable from './components/DataTable';
import RecordCards from './components/RecordCards';
import RecordDrawer from './components/RecordDrawer';
import { useToast } from './components/Toast';

function matchesSearch(item, searchKeys, query) {
  if (!query) {
    return true;
  }
  const lowerQuery = query.toLowerCase();
  return searchKeys.some((key) => String(item[key] ?? '').toLowerCase().includes(lowerQuery));
}

function ManagedResourceSection({ config, items, onSaveRecord, onDeleteRecord }) {
  const notify = useToast();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(config.createForm());
  const [uploadingField, setUploadingField] = useState('');
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [formError, setFormError] = useState('');

  const filteredItems = useMemo(
    () => items.filter((item) => matchesSearch(item, config.searchKeys, search)),
    [items, config.searchKeys, search]
  );

  const openAddDrawer = () => {
    setEditingId(null);
    setForm(config.createForm());
    setFormError('');
    setDrawerOpen(true);
  };

  const openEditDrawer = (item) => {
    setEditingId(item.id);
    setForm(config.toForm ? config.toForm(item) : { ...config.createForm(), ...item });
    setFormError('');
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setFormError('');
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setFormError('');
    setBusy(true);
    const payload = config.preparePayload
      ? config.preparePayload(form, editingId, createId)
      : { ...form, id: editingId || createId(config.idPrefix) };
    try {
      await onSaveRecord(payload, editingId);
      notify(editingId ? `${config.label.replace(/s$/, '')} updated.` : `${config.label.replace(/s$/, '')} added.`);
      setDrawerOpen(false);
      setEditingId(null);
      setForm(config.createForm());
    } catch (error) {
      setFormError(error.message || 'Could not save record.');
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) {
      return;
    }
    try {
      await onDeleteRecord(pendingDelete.id);
      notify(`${config.label.replace(/s$/, '')} deleted.`);
    } catch (error) {
      notify(error.message || 'Could not delete record.', 'error');
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <section className="resource-section">
      <div className="resource-toolbar">
        <div className="resource-search">
          <Icon name="search" />
          <input
            aria-label={`Search ${config.label.toLowerCase()}`}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${config.label.toLowerCase()}...`}
            type="search"
            value={search}
          />
        </div>
        <span className="resource-count">{filteredItems.length} of {items.length}</span>
        <GlowButton label={config.addLabel} onClick={openAddDrawer} />
      </div>

      {config.view === 'table' ? (
        <DataTable
          columns={config.columns}
          emptyBody="New records will appear here once you add one."
          emptyTitle={search ? 'No matches found' : 'Nothing here yet'}
          getRowId={(row) => row.id}
          onDelete={setPendingDelete}
          onEdit={openEditDrawer}
          rows={filteredItems}
        />
      ) : (
        <RecordCards
          emptyBody="New records will appear here once you add one."
          emptyTitle={search ? 'No matches found' : 'Nothing here yet'}
          getBody={config.getBody}
          getMeta={config.getMeta}
          getPreview={config.getPreview}
          getRowId={(row) => row.id}
          getTitle={config.getTitle}
          items={filteredItems}
          onDelete={setPendingDelete}
          onEdit={openEditDrawer}
        />
      )}

      <RecordDrawer
        busy={busy}
        editing={Boolean(editingId)}
        error={formError}
        fields={config.fields}
        form={form}
        onClose={closeDrawer}
        onError={setFormError}
        onSubmit={submitForm}
        open={drawerOpen}
        setForm={setForm}
        setUploadingField={setUploadingField}
        title={editingId ? config.addLabel.replace('Add', 'Update') : config.addLabel}
        uploadingField={uploadingField}
      />

      <ConfirmDialog
        body={`This will permanently remove this record from ${config.label.toLowerCase()}. This cannot be undone.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        open={Boolean(pendingDelete)}
        title={`Delete this ${config.label.replace(/s$/, '').toLowerCase()}?`}
      />
    </section>
  );
}

export default ManagedResourceSection;
