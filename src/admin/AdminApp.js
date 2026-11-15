import React, { useMemo, useState } from 'react';
import Icon from '../components/Icon';
import { normalizePricingPlans, uniqueOptions } from '../lib/api';
import { NAV_GROUPS, buildResourceConfig } from './adminConfig';
import ManagedResourceSection from './ManagedResourceSection';
import DashboardSection from './sections/DashboardSection';
import EnquiriesSection from './sections/EnquiriesSection';
import SettingsSection from './sections/SettingsSection';
import ProfileSection from './sections/ProfileSection';
import DeveloperSection from './sections/DeveloperSection';
import { ToastProvider } from './components/Toast';
import './admin.css';

function AdminAppInner({
  clients,
  galleryItems,
  trainers,
  pricingPlans,
  programs,
  testimonials,
  scheduleItems,
  settings,
  defaultSettings,
  contactRequests,
  leads,
  attendance,
  payments,
  progressRecords,
  memberships = [],
  lockers = [],
  equipment = [],
  inventory = [],
  dietWorkouts = [],
  announcements = [],
  adminUser,
  onAdminLogout,
  updateAdminProfile,
  saveClientRecord,
  deleteClientRecord,
  saveGalleryRecord,
  deleteGalleryRecord,
  saveTrainerRecord,
  deleteTrainerRecord,
  savePlanRecord,
  deletePlanRecord,
  saveProgramRecord,
  deleteProgramRecord,
  saveTestimonialRecord,
  deleteTestimonialRecord,
  saveScheduleRecord,
  deleteScheduleRecord,
  saveSettingsRecord,
  saveContactRequestRecord,
  deleteContactRequestRecord,
  saveLeadRecord,
  deleteLeadRecord,
  saveAttendanceRecord,
  deleteAttendanceRecord,
  savePaymentRecord,
  deletePaymentRecord,
  saveProgressRecord,
  deleteProgressRecord,
  saveMembershipRecord,
  deleteMembershipRecord,
  saveLockerRecord,
  deleteLockerRecord,
  saveEquipmentRecord,
  deleteEquipmentRecord,
  saveInventoryRecord,
  deleteInventoryRecord,
  saveDietWorkoutRecord,
  deleteDietWorkoutRecord,
  saveAnnouncementRecord,
  deleteAnnouncementRecord,
}) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const trainerNames = useMemo(() => uniqueOptions(['Unassigned', ...trainers.map((trainer) => trainer.name)]), [trainers]);
  const clientNames = useMemo(() => uniqueOptions(['Walk-in', ...clients.map((client) => client.name)]), [clients]);
  const planNames = useMemo(() => normalizePricingPlans(pricingPlans).map((plan) => plan.name), [pricingPlans]);

  const resourceConfig = useMemo(
    () => buildResourceConfig({ trainerNames, planNames, clientNames }),
    [trainerNames, planNames, clientNames]
  );

  const resourceData = {
    clients: { items: clients, onSaveRecord: saveClientRecord, onDeleteRecord: deleteClientRecord },
    leads: { items: leads, onSaveRecord: saveLeadRecord, onDeleteRecord: deleteLeadRecord },
    plans: { items: pricingPlans, onSaveRecord: savePlanRecord, onDeleteRecord: deletePlanRecord },
    programs: { items: programs, onSaveRecord: saveProgramRecord, onDeleteRecord: deleteProgramRecord },
    schedule: { items: scheduleItems, onSaveRecord: saveScheduleRecord, onDeleteRecord: deleteScheduleRecord },
    trainers: { items: trainers, onSaveRecord: saveTrainerRecord, onDeleteRecord: deleteTrainerRecord },
    gallery: { items: galleryItems, onSaveRecord: saveGalleryRecord, onDeleteRecord: deleteGalleryRecord },
    testimonials: { items: testimonials, onSaveRecord: saveTestimonialRecord, onDeleteRecord: deleteTestimonialRecord },
    attendance: { items: attendance, onSaveRecord: saveAttendanceRecord, onDeleteRecord: deleteAttendanceRecord },
    payments: { items: payments, onSaveRecord: savePaymentRecord, onDeleteRecord: deletePaymentRecord },
    progress: { items: progressRecords, onSaveRecord: saveProgressRecord, onDeleteRecord: deleteProgressRecord },
    memberships: { items: memberships, onSaveRecord: saveMembershipRecord, onDeleteRecord: deleteMembershipRecord },
    lockers: { items: lockers, onSaveRecord: saveLockerRecord, onDeleteRecord: deleteLockerRecord },
    equipment: { items: equipment, onSaveRecord: saveEquipmentRecord, onDeleteRecord: deleteEquipmentRecord },
    inventory: { items: inventory, onSaveRecord: saveInventoryRecord, onDeleteRecord: deleteInventoryRecord },
    dietWorkouts: { items: dietWorkouts, onSaveRecord: saveDietWorkoutRecord, onDeleteRecord: deleteDietWorkoutRecord },
    announcements: { items: announcements, onSaveRecord: saveAnnouncementRecord, onDeleteRecord: deleteAnnouncementRecord },
  };

  const convertRequestToLead = async (request) => {
    await saveLeadRecord({
      id: `lead-${Date.now().toString(36)}`,
      name: request.name,
      email: request.email,
      phone: request.phone,
      source: request.source || 'Website',
      status: 'New',
      notes: `Goal: ${request.goal || 'Not listed'}\n${request.message || ''}`.trim(),
    }, null);
    await saveContactRequestRecord({ ...request, status: 'Converted' }, request.id);
  };

  const activeLabel = useMemo(() => {
    for (const group of NAV_GROUPS) {
      const match = group.items.find((item) => item.key === activeSection);
      if (match) {
        return match.label;
      }
    }
    return 'Dashboard';
  }, [activeSection]);

  const goToSection = (key) => {
    setActiveSection(key);
    setMobileNavOpen(false);
  };

  return (
    <div className="admin-console">
      <aside className={`admin-sidebar ${mobileNavOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <span className="brand-mark" aria-hidden="true" />
          <span>{settings.gymName || defaultSettings.gymName} <small>Admin</small></span>
        </div>
        <nav className="admin-nav" aria-label="Admin sections">
          {NAV_GROUPS.map((group) => (
            <div className="admin-nav-group" key={group.id}>
              <p className="admin-nav-label">{group.label}</p>
              {group.items.map((item) => (
                <button
                  className={activeSection === item.key ? 'active' : ''}
                  key={item.key}
                  onClick={() => goToSection(item.key)}
                  type="button"
                >
                  <Icon name={item.icon} />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <div className="admin-user-pill">
            <span className="avatar-dot">{adminUser?.slice(0, 1).toUpperCase()}</span>
            <span>{adminUser}</span>
          </div>
          <button className="ghost-action" onClick={onAdminLogout} type="button">
            <Icon name="logout" />
            Logout
          </button>
        </div>
      </aside>

      {mobileNavOpen && <div className="admin-sidebar-backdrop" onClick={() => setMobileNavOpen(false)} />}

      <div className="admin-content-area">
        <header className="admin-topbar-bar">
          <button
            aria-label="Toggle navigation"
            className="admin-nav-toggle"
            onClick={() => setMobileNavOpen((current) => !current)}
            type="button"
          >
            <Icon name="menu" />
          </button>
          <h1>{activeLabel}</h1>
        </header>

        <main className="admin-content">
          {activeSection === 'dashboard' && (
            <DashboardSection
              clients={clients}
              contactRequests={contactRequests}
              leads={leads}
              navigateToSection={goToSection}
              payments={payments}
              trainers={trainers}
              memberships={memberships}
              equipment={equipment}
              lockers={lockers}
              inventory={inventory}
            />
          )}

          {activeSection === 'developer' && (
            <DeveloperSection />
          )}

          {activeSection === 'contacts' && (
            <EnquiriesSection
              contactRequests={contactRequests}
              onConvert={convertRequestToLead}
              onDelete={deleteContactRequestRecord}
              onStatus={(request, status) => saveContactRequestRecord({ ...request, status }, request.id)}
            />
          )}

          {activeSection === 'settings' && (
            <SettingsSection defaultSettings={defaultSettings} saveSettingsRecord={saveSettingsRecord} settings={settings} />
          )}

          {activeSection === 'profile' && (
            <ProfileSection adminUser={adminUser} updateAdminProfile={updateAdminProfile} />
          )}

          {resourceConfig[activeSection] && (
            <ManagedResourceSection
              config={resourceConfig[activeSection]}
              items={resourceData[activeSection].items}
              onDeleteRecord={resourceData[activeSection].onDeleteRecord}
              onSaveRecord={resourceData[activeSection].onSaveRecord}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function AdminApp(props) {
  return (
    <ToastProvider>
      <AdminAppInner {...props} />
    </ToastProvider>
  );
}

export default AdminApp;
