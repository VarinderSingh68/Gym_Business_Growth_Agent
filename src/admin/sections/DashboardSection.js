import React from 'react';
import Icon from '../../components/Icon';
import { downloadCsv } from '../../lib/api';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';

function DashboardSection({
  clients = [],
  contactRequests = [],
  leads = [],
  payments = [],
  trainers = [],
  memberships = [],
  equipment = [],
  lockers = [],
  inventory = [],
  navigateToSection,
}) {
  const duePayments = payments.filter((payment) => ['Due', 'Overdue'].includes(payment.status)).length;
  const newEnquiries = contactRequests.filter((item) => (item.status || 'New') === 'New').length;
  const activeMembers = memberships.filter((m) => (m.status || 'Active') === 'Active').length;
  const maintenanceAlerts = equipment.filter((e) => ['Needs Maintenance', 'Under Repair', 'Critical'].includes(e.status) || e.condition === 'Critical').length;
  const availableLockers = lockers.filter((l) => (l.status || 'Available') === 'Available').length;
  const lowStockItems = inventory.filter((i) => i.status === 'Low Stock' || Number(i.quantity || 0) <= Number(i.minStockAlert || 5)).length;

  const metrics = [
    { label: 'Total Clients', value: clients.length, icon: 'users', accent: 'cyan', section: 'clients' },
    { label: 'Active Subscriptions', value: activeMembers, icon: 'card', accent: 'orange', section: 'memberships' },
    { label: 'Payments Due', value: duePayments, icon: 'card', accent: 'orange', section: 'payments' },
    { label: 'Maintenance Alerts', value: maintenanceAlerts, icon: 'activity', accent: maintenanceAlerts > 0 ? 'orange' : 'cyan', section: 'equipment' },
    { label: 'Available Lockers', value: availableLockers, icon: 'key', accent: 'cyan', section: 'lockers' },
    { label: 'Low Stock Alerts', value: lowStockItems, icon: 'box', accent: lowStockItems > 0 ? 'orange' : 'cyan', section: 'inventory' },
    { label: 'New Enquiries', value: newEnquiries, icon: 'inbox', accent: 'orange', section: 'contacts' },
    { label: 'Coaches / Staff', value: trainers.length, icon: 'person', accent: 'cyan', section: 'trainers' },
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
            <button className="ghost-action" onClick={() => downloadCsv('subscriptions.csv', memberships)} type="button">
              <Icon name="download" />
              Subscriptions CSV
            </button>
            <button className="ghost-action" onClick={() => downloadCsv('equipment.csv', equipment)} type="button">
              <Icon name="download" />
              Equipment CSV
            </button>
            <button className="ghost-action" onClick={() => downloadCsv('inventory.csv', inventory)} type="button">
              <Icon name="download" />
              Inventory CSV
            </button>
            <button className="ghost-action" onClick={() => downloadCsv('lockers.csv', lockers)} type="button">
              <Icon name="download" />
              Lockers CSV
            </button>
            <button className="ghost-action" onClick={() => downloadCsv('payments.csv', payments)} type="button">
              <Icon name="download" />
              Payments CSV
            </button>
            <button className="ghost-action" onClick={() => downloadCsv('enquiries.csv', contactRequests)} type="button">
              <Icon name="download" />
              Enquiries CSV
            </button>
            <button className="ghost-action" onClick={() => downloadCsv('leads.csv', leads)} type="button">
              <Icon name="download" />
              Leads CSV
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
