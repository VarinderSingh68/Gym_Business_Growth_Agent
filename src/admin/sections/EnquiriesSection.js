import React, { useMemo, useState } from 'react';
import Icon from '../../components/Icon';
import { downloadCsv } from '../../lib/api';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

function EnquiriesSection({ contactRequests, onStatus, onConvert, onDelete }) {
  const notify = useToast();
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const filtered = useMemo(() => {
    const lowerQuery = search.toLowerCase();
    if (!lowerQuery) {
      return contactRequests;
    }
    return contactRequests.filter((request) =>
      [request.name, request.email, request.phone, request.message, request.goal]
        .some((value) => String(value ?? '').toLowerCase().includes(lowerQuery))
    );
  }, [contactRequests, search]);

  const markContacted = async (request) => {
    try {
      await onStatus(request, 'Contacted');
      notify('Marked as contacted.');
    } catch (error) {
      notify(error.message || 'Could not update enquiry.', 'error');
    }
  };

  const convertToLead = async (request) => {
    try {
      await onConvert(request);
      notify('Converted to lead.');
    } catch (error) {
      notify(error.message || 'Could not convert enquiry.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) {
      return;
    }
    try {
      await onDelete(pendingDelete.id);
      notify('Enquiry deleted.');
    } catch (error) {
      notify(error.message || 'Could not delete enquiry.', 'error');
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
            aria-label="Search enquiries"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search enquiries..."
            type="search"
            value={search}
          />
        </div>
        <span className="resource-count">{filtered.length} of {contactRequests.length}</span>
        <button className="ghost-action" onClick={() => downloadCsv('enquiries.csv', contactRequests)} type="button">
          <Icon name="download" />
          Export CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          body="When a visitor sends the contact form, it appears here."
          icon="inbox"
          title={search ? 'No matches found' : 'No enquiries yet'}
        />
      ) : (
        <div className="enquiry-list">
          {filtered.map((request) => (
            <article className="enquiry-card" key={request.id}>
              <div className="enquiry-head">
                <div>
                  <h3>{request.name}</h3>
                  <span>{request.email} {request.phone ? `/ ${request.phone}` : ''}</span>
                </div>
                <span className={`status-pill status-${(request.status || 'new').toLowerCase()}`}>{request.status || 'New'}</span>
              </div>
              <p>{request.message || request.goal}</p>
              <div className="enquiry-actions">
                <button onClick={() => markContacted(request)} type="button">
                  <Icon name="check" />
                  Contacted
                </button>
                <button onClick={() => convertToLead(request)} type="button">
                  <Icon name="target" />
                  Convert to lead
                </button>
                <button className="danger" onClick={() => setPendingDelete(request)} type="button">
                  <Icon name="trash" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        body="This will permanently remove this enquiry. This cannot be undone."
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        open={Boolean(pendingDelete)}
        title="Delete this enquiry?"
      />
    </section>
  );
}

export default EnquiriesSection;
