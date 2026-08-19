import React from 'react';
import Icon from '../../components/Icon';
import { downloadCsv } from '../../lib/api';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';

function DashboardSection({ clients, contactRequests, leads, payments, trainers, navigateToSection }) {
  const duePayments = payments.filter((payment) => ['Due', 'Overdue'].includes(payment.status)).length;
  const newEnquiries = contactRequests.filter((item) => (item.status || 'New') === 'New').length;

  const metrics = [
    { label: 'Clients', value: clients.length, icon: 'users', accent: 'cyan', section: 'clients' },
    { label: 'New Enquiries', value: newEnquiries, icon: 'inbox', accent: 'orange', section: 'contacts' },
    { label: 'Leads', value: leads.length, icon: 'target', accent: 'cyan', section: 'leads' },
    { label: 'Payments Due', value: duePayments, icon: 'card', accent: 'orange', section: 'payments' },
    { label: 'Trainers', value: trainers.length, icon: 'person', accent: 'cyan', section: 'trainers' },
  ];

  return (
    <section className="admin-dashboard">
      <div className="dashboard-grid">
        {metrics.map((item) => (
          <button
            className="dashboard-card-button"
            key={item.label}
            onClick={() => navigateToSection(item.section)}
            type="button"
          >
            <StatCard accent={item.accent} icon={item.icon} label={item.label} value={item.value} />
          </button>
        ))}
      </div>
      <div className="dashboard-columns">
        <div className="admin-panel-card">
          <div className="admin-heading">
            <p className="eyebrow">Exports</p>
            <h2>Download Gym Data</h2>
          </div>
          <div className="export-row">
            <button className="ghost-action" onClick={() => downloadCsv('clients.csv', clients)} type="button">
              <Icon name="download" />
              Clients CSV
            </button>
            <button className="ghost-action" onClick={() => downloadCsv('enquiries.csv', contactRequests)} type="button">
              <Icon name="download" />
              Enquiries CSV
            </button>
            <button className="ghost-action" onClick={() => downloadCsv('leads.csv', leads)} type="button">
              <Icon name="download" />
              Leads CSV
            </button>
            <button className="ghost-action" onClick={() => downloadCsv('payments.csv', payments)} type="button">
              <Icon name="download" />
              Payments CSV
            </button>
          </div>
        </div>
        <div className="admin-panel-card">
          <div className="admin-heading">
            <p className="eyebrow">Fresh requests</p>
            <h2>Latest Enquiries</h2>
          </div>
          {contactRequests.length === 0 ? (
            <EmptyState body="Contact form requests will appear here." title="No enquiries yet" />
          ) : (
            <ul className="mini-record-list">
              {contactRequests.slice(0, 5).map((request) => (
                <li key={request.id}>
                  <div>
                    <strong>{request.name}</strong>
                    <span>{request.message || request.goal || request.email}</span>
                  </div>
                  <span className={`status-pill status-${(request.status || 'new').toLowerCase()}`}>{request.status || 'New'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default DashboardSection;
