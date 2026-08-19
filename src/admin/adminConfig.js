import React from 'react';
import { featuresToText } from '../lib/api';
import {
  createAttendanceForm,
  createClientForm,
  createGalleryForm,
  createLeadForm,
  createPaymentForm,
  createPlanForm,
  createProgramForm,
  createProgressForm,
  createScheduleForm,
  createTestimonialForm,
  createTrainerForm,
  planToForm,
} from './formHelpers';

export const NAV_GROUPS = [
  {
    id: 'overview',
    label: 'Overview',
    items: [{ key: 'dashboard', label: 'Dashboard', icon: 'gauge' }],
  },
  {
    id: 'people',
    label: 'People',
    items: [
      { key: 'clients', label: 'Clients', icon: 'users' },
      { key: 'leads', label: 'Leads', icon: 'target' },
      { key: 'contacts', label: 'Enquiries', icon: 'inbox' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    items: [
      { key: 'programs', label: 'Programs', icon: 'dumbbell' },
      { key: 'plans', label: 'Plans', icon: 'card' },
      { key: 'trainers', label: 'Trainers', icon: 'person' },
      { key: 'gallery', label: 'Gallery', icon: 'image' },
      { key: 'testimonials', label: 'Reviews', icon: 'star' },
      { key: 'schedule', label: 'Schedule', icon: 'calendar' },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      { key: 'attendance', label: 'Attendance', icon: 'clipboard' },
      { key: 'payments', label: 'Payments', icon: 'card' },
      { key: 'progress', label: 'Progress', icon: 'chart' },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    items: [
      { key: 'settings', label: 'Website Settings', icon: 'settings' },
      { key: 'profile', label: 'Profile', icon: 'person' },
    ],
  },
];

function imageStyle(url) {
  return url ? { backgroundImage: `url(${url})` } : undefined;
}

const FALLBACK_GALLERY_IMAGE = 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=1100&q=82';

function AdminMediaPreview({ item }) {
  const src = item.image || item.src;
  if ((item.type || 'image') === 'video') {
    return <video className="record-thumb" muted playsInline src={src} />;
  }
  return <span className="record-thumb" style={imageStyle(src)} />;
}

export function buildResourceConfig({ trainerNames, planNames, clientNames }) {
  return {
    clients: {
      resource: 'clients',
      idPrefix: 'client',
      label: 'Clients',
      asideTitle: 'Client Records',
      addLabel: 'Add Client',
      view: 'table',
      createForm: createClientForm,
      searchKeys: ['name', 'email', 'phone', 'trainer', 'plan'],
      fields: [
        { name: 'name', label: 'Full Name', required: true },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone' },
        { name: 'age', label: 'Age' },
        { name: 'height', label: 'Height' },
        { name: 'weight', label: 'Weight' },
        { name: 'plan', label: 'Plan', type: 'select', options: planNames.length ? planNames : ['Basic', 'Standard', 'Premium'] },
        { name: 'trainer', label: 'Trainer', type: 'select', options: trainerNames },
        { name: 'startDate', label: 'Start Date', type: 'date' },
        { name: 'goal', label: 'Goal', wide: true },
        { name: 'notes', label: 'Full Details / Notes', type: 'textarea' },
      ],
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'plan', label: 'Plan' },
        { key: 'trainer', label: 'Trainer' },
        { key: 'phone', label: 'Phone' },
        { key: 'startDate', label: 'Start Date' },
      ],
    },

    leads: {
      resource: 'leads',
      idPrefix: 'lead',
      label: 'Leads',
      asideTitle: 'Lead Pipeline',
      addLabel: 'Add Lead',
      view: 'table',
      createForm: createLeadForm,
      searchKeys: ['name', 'email', 'phone', 'status', 'source'],
      fields: [
        { name: 'name', label: 'Name', required: true },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone' },
        { name: 'source', label: 'Source', type: 'select', options: ['Website', 'Walk-in', 'Instagram', 'Referral', 'Phone'] },
        { name: 'status', label: 'Status', type: 'select', options: ['New', 'Contacted', 'Trial booked', 'Joined', 'Lost'] },
        { name: 'notes', label: 'Lead Notes', type: 'textarea' },
      ],
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'status', label: 'Status', render: (row) => <span className={`status-pill status-${(row.status || 'new').toLowerCase().replace(/\s+/g, '-')}`}>{row.status || 'New'}</span> },
        { key: 'source', label: 'Source' },
        { key: 'email', label: 'Email' },
      ],
    },

    plans: {
      resource: 'plans',
      idPrefix: 'plan',
      label: 'Plans',
      asideTitle: 'Membership Plans',
      addLabel: 'Add Plan',
      view: 'cards',
      createForm: createPlanForm,
      toForm: planToForm,
      searchKeys: ['name', 'summary'],
      fields: [
        { name: 'name', label: 'Plan Name', required: true },
        { name: 'monthly', label: 'Monthly Price' },
        { name: 'yearly', label: 'Yearly Price' },
        { name: 'accent', label: 'Accent', type: 'select', options: ['cyan', 'orange'] },
        { name: 'tag', label: 'Tag' },
        { name: 'summary', label: 'Summary', wide: true },
        { name: 'features', label: 'Features (one per line)', type: 'textarea' },
      ],
      getTitle: (plan) => plan.name,
      getBody: (plan) => plan.summary,
      getMeta: (plan) => `$${plan.monthly || plan.price?.monthly || 0}/mo / ${featuresToText(plan.features).split('\n').filter(Boolean).length} features`,
    },

    programs: {
      resource: 'programs',
      idPrefix: 'program',
      label: 'Programs',
      asideTitle: 'Programs / Services',
      addLabel: 'Add Program',
      view: 'cards',
      createForm: createProgramForm,
      searchKeys: ['title', 'body'],
      fields: [
        { name: 'title', label: 'Title', required: true },
        { name: 'icon', label: 'Icon', type: 'select', options: ['dumbbell', 'heart', 'person', 'timer', 'leaf', 'target', 'chart', 'calendar'] },
        { name: 'accent', label: 'Accent', type: 'select', options: ['cyan', 'orange'] },
        { name: 'image', label: 'Image URL', wide: true },
        { name: 'upload', label: 'Upload Image', type: 'file', accept: 'image/*', target: 'image', wide: true },
        { name: 'body', label: 'Description', type: 'textarea' },
      ],
      getPreview: (program) => <span className="record-thumb" style={imageStyle(program.image)} />,
      getTitle: (program) => program.title,
      getBody: (program) => program.body,
      getMeta: (program) => `${program.icon || 'bolt'} / ${program.accent || 'cyan'}`,
    },

    schedule: {
      resource: 'schedule',
      idPrefix: 'schedule',
      label: 'Schedule',
      asideTitle: 'Class Schedule',
      addLabel: 'Add Class',
      view: 'table',
      createForm: createScheduleForm,
      searchKeys: ['className', 'trainer', 'day'],
      fields: [
        { name: 'day', label: 'Day', type: 'select', options: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        { name: 'time', label: 'Time' },
        { name: 'className', label: 'Class Name', required: true },
        { name: 'trainer', label: 'Trainer', type: 'select', options: trainerNames },
      ],
      columns: [
        { key: 'day', label: 'Day' },
        { key: 'time', label: 'Time' },
        { key: 'className', label: 'Class' },
        { key: 'trainer', label: 'Trainer' },
      ],
    },

    trainers: {
      resource: 'trainers',
      idPrefix: 'trainer',
      label: 'Trainers',
      asideTitle: 'Trainer Cards',
      addLabel: 'Add Trainer',
      view: 'cards',
      createForm: createTrainerForm,
      searchKeys: ['name', 'role'],
      fields: [
        { name: 'name', label: 'Name', required: true },
        { name: 'role', label: 'Specialty / Role', required: true },
        { name: 'rating', label: 'Rating' },
        { name: 'clients', label: 'Clients Transformed' },
        { name: 'years', label: 'Years Experience' },
        { name: 'accent', label: 'Accent', type: 'select', options: ['cyan', 'orange'] },
        { name: 'image', label: 'Trainer Image URL', wide: true },
        { name: 'upload', label: 'Upload Image', type: 'file', accept: 'image/*', target: 'image', wide: true },
      ],
      getPreview: (trainer) => <span className="record-thumb round" style={imageStyle(trainer.image)} />,
      getTitle: (trainer) => trainer.name,
      getBody: (trainer) => trainer.role,
      getMeta: (trainer) => `${trainer.rating} rating / ${trainer.clients} clients / ${trainer.years} years`,
    },

    gallery: {
      resource: 'gallery',
      idPrefix: 'gallery',
      label: 'Gallery',
      asideTitle: 'Gallery Media',
      addLabel: 'Add Gallery Media',
      view: 'cards',
      createForm: createGalleryForm,
      searchKeys: ['title'],
      preparePayload: (formValue, editingIdValue, createId) => ({
        ...formValue,
        id: editingIdValue || createId('gallery'),
        image: formValue.image || FALLBACK_GALLERY_IMAGE,
        type: formValue.type || 'image',
        wide: Boolean(formValue.wide),
      }),
      fields: [
        { name: 'title', label: 'Title', required: true },
        { name: 'type', label: 'Type', type: 'select', options: ['image', 'video'] },
        { name: 'accent', label: 'Accent', type: 'select', options: ['cyan', 'orange'] },
        { name: 'image', label: 'Image / Video URL', wide: true },
        { name: 'upload', label: 'Upload Media', type: 'file', accept: 'image/*,video/*', target: 'image', mediaTypeField: 'type', wide: true },
        { name: 'wide', label: 'Wide tile', type: 'checkbox' },
      ],
      getPreview: (item) => <AdminMediaPreview item={item} />,
      getTitle: (item) => item.title,
      getBody: (item) => item.type || 'image',
      getMeta: (item) => `${item.wide ? 'wide' : 'normal'} / ${item.accent || 'cyan'}`,
    },

    testimonials: {
      resource: 'testimonials',
      idPrefix: 'testimonial',
      label: 'Reviews',
      asideTitle: 'Member Reviews',
      addLabel: 'Add Testimonial',
      view: 'cards',
      createForm: createTestimonialForm,
      searchKeys: ['name', 'quote'],
      fields: [
        { name: 'name', label: 'Member Name', required: true },
        { name: 'quote', label: 'Quote', type: 'textarea' },
      ],
      getTitle: (item) => item.name,
      getBody: (item) => item.quote,
      getMeta: () => 'Website testimonial',
    },

    attendance: {
      resource: 'attendance',
      idPrefix: 'attendance',
      label: 'Attendance',
      asideTitle: 'Attendance Log',
      addLabel: 'Add Attendance',
      view: 'table',
      createForm: createAttendanceForm,
      searchKeys: ['clientName', 'status'],
      fields: [
        { name: 'clientName', label: 'Client', type: 'select', options: clientNames },
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'status', label: 'Status', type: 'select', options: ['Present', 'Missed', 'Late', 'Trial'] },
        { name: 'notes', label: 'Notes', type: 'textarea' },
      ],
      columns: [
        { key: 'clientName', label: 'Client' },
        { key: 'date', label: 'Date' },
        { key: 'status', label: 'Status', render: (row) => <span className={`status-pill status-${(row.status || 'present').toLowerCase()}`}>{row.status || 'Present'}</span> },
      ],
    },

    payments: {
      resource: 'payments',
      idPrefix: 'payment',
      label: 'Payments',
      asideTitle: 'Payment Status',
      addLabel: 'Add Payment',
      view: 'table',
      createForm: createPaymentForm,
      searchKeys: ['clientName', 'status', 'plan'],
      fields: [
        { name: 'clientName', label: 'Client', type: 'select', options: clientNames },
        { name: 'plan', label: 'Plan', type: 'select', options: planNames.length ? planNames : ['Basic', 'Standard', 'Premium'] },
        { name: 'amount', label: 'Amount' },
        { name: 'dueDate', label: 'Due Date', type: 'date' },
        { name: 'status', label: 'Status', type: 'select', options: ['Paid', 'Due', 'Overdue', 'Refunded'] },
        { name: 'notes', label: 'Notes', type: 'textarea' },
      ],
      columns: [
        { key: 'clientName', label: 'Client' },
        { key: 'plan', label: 'Plan' },
        { key: 'amount', label: 'Amount', render: (row) => `$${row.amount || 0}` },
        { key: 'dueDate', label: 'Due Date' },
        { key: 'status', label: 'Status', render: (row) => <span className={`status-pill status-${(row.status || 'due').toLowerCase()}`}>{row.status || 'Due'}</span> },
      ],
    },

    progress: {
      resource: 'progress',
      idPrefix: 'progress',
      label: 'Progress',
      asideTitle: 'Client Progress',
      addLabel: 'Add Progress',
      view: 'table',
      createForm: createProgressForm,
      searchKeys: ['clientName'],
      fields: [
        { name: 'clientName', label: 'Client', type: 'select', options: clientNames },
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'weight', label: 'Weight' },
        { name: 'measurements', label: 'Measurements', wide: true },
        { name: 'image', label: 'Progress Image URL', wide: true },
        { name: 'upload', label: 'Upload Image', type: 'file', accept: 'image/*', target: 'image', wide: true },
        { name: 'notes', label: 'Notes', type: 'textarea' },
      ],
      columns: [
        { key: 'image', label: 'Photo', sortable: false, render: (row) => (row.image ? <span className="record-thumb small" style={imageStyle(row.image)} /> : <span className="record-thumb small empty" />) },
        { key: 'clientName', label: 'Client' },
        { key: 'date', label: 'Date' },
        { key: 'weight', label: 'Weight' },
      ],
    },
  };
}
