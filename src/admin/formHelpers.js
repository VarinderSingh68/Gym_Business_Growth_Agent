import { featuresToText } from '../lib/api';

export function createClientForm() {
  return {
    name: '',
    email: '',
    phone: '',
    plan: 'Standard',
    goal: '',
    age: '',
    height: '',
    weight: '',
    trainer: 'Unassigned',
    startDate: '',
    notes: '',
  };
}

export function createGalleryForm() {
  return {
    title: '',
    type: 'image',
    image: '',
    accent: 'cyan',
    wide: false,
  };
}

export function createTrainerForm() {
  return {
    name: '',
    role: '',
    image: '',
    rating: '4.9',
    clients: '0',
    years: '1',
    accent: 'cyan',
  };
}

export function createPlanForm() {
  return {
    name: '',
    monthly: '',
    yearly: '',
    accent: 'cyan',
    tag: '',
    summary: '',
    features: '',
  };
}

export function planToForm(plan) {
  return {
    ...createPlanForm(),
    ...plan,
    monthly: String(plan.monthly ?? plan.price?.monthly ?? ''),
    yearly: String(plan.yearly ?? plan.price?.yearly ?? ''),
    features: featuresToText(plan.features),
  };
}

export function createProgramForm() {
  return {
    title: '',
    body: '',
    icon: 'dumbbell',
    image: '',
    accent: 'cyan',
  };
}

export function createTestimonialForm() {
  return {
    name: '',
    quote: '',
  };
}

export function createScheduleForm() {
  return {
    day: 'Mon',
    time: '6:00 AM',
    className: '',
    trainer: 'Unassigned',
  };
}

export function createSettingsForm(defaultSettings, settings = defaultSettings) {
  return {
    ...defaultSettings,
    ...settings,
    id: settings.id || 'settings-main',
  };
}

export function createLeadForm() {
  return {
    name: '',
    email: '',
    phone: '',
    source: 'Website',
    status: 'New',
    notes: '',
  };
}

export function createAttendanceForm() {
  return {
    clientName: 'Walk-in',
    date: new Date().toISOString().slice(0, 10),
    status: 'Present',
    notes: '',
  };
}

export function createPaymentForm() {
  return {
    clientName: 'Walk-in',
    plan: 'Standard',
    amount: '',
    dueDate: new Date().toISOString().slice(0, 10),
    status: 'Due',
    notes: '',
  };
}

export function createProgressForm() {
  return {
    clientName: 'Walk-in',
    date: new Date().toISOString().slice(0, 10),
    weight: '',
    measurements: '',
    image: '',
    notes: '',
  };
}

export function createProfileForm(username = 'admin') {
  return {
    username,
    currentPassword: '',
    newPassword: '',
  };
}
