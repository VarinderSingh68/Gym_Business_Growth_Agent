import React, { useEffect, useState } from 'react';
import { AdminInput, AdminTextarea, GlowButton } from '../../components/ui';
import { createSettingsForm } from '../formHelpers';
import { useToast } from '../components/Toast';

function SettingsSection({ settings, defaultSettings, saveSettingsRecord }) {
  const notify = useToast();
  const [form, setForm] = useState(createSettingsForm(defaultSettings, settings));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm(createSettingsForm(defaultSettings, settings));
  }, [settings, defaultSettings]);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await saveSettingsRecord({ ...form, id: form.id || 'settings-main' });
      notify('Website settings saved.');
    } catch (err) {
      setError(err.message || 'Could not save settings.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="resource-section settings-section">
      <div className="admin-panel-card">
        <div className="admin-heading">
          <p className="eyebrow">Live website info</p>
          <h2>Website Settings</h2>
        </div>
        <form className="admin-form" onSubmit={submit}>
          <div className="settings-grid">
            <AdminInput label="Gym Name" onChange={(value) => setForm({ ...form, gymName: value })} required value={form.gymName} />
            <AdminInput label="Phone" onChange={(value) => setForm({ ...form, phone: value })} value={form.phone} />
            <AdminInput label="Email" onChange={(value) => setForm({ ...form, email: value })} type="email" value={form.email} />
            <AdminInput label="Address" onChange={(value) => setForm({ ...form, address: value })} value={form.address} />
            <AdminInput label="Facebook Link" onChange={(value) => setForm({ ...form, facebook: value })} value={form.facebook} />
            <AdminInput label="Instagram Link" onChange={(value) => setForm({ ...form, instagram: value })} value={form.instagram} />
            <AdminInput label="YouTube Link" onChange={(value) => setForm({ ...form, youtube: value })} value={form.youtube} />
            <AdminInput label="Hero Title" onChange={(value) => setForm({ ...form, heroTitle: value })} value={form.heroTitle} wide />
          </div>
          <AdminTextarea label="Hero Subtitle" onChange={(value) => setForm({ ...form, heroSubtitle: value })} value={form.heroSubtitle} />
          {error && <p className="drawer-error" role="alert">{error}</p>}
          <div className="admin-actions">
            <GlowButton label={busy ? 'Saving...' : 'Save Settings'} type="submit" />
          </div>
        </form>
      </div>
      <div className="admin-panel-card">
        <div className="admin-heading">
          <p className="eyebrow">Preview</p>
          <h2>How this looks live</h2>
        </div>
        <div className="settings-preview">
          <h3>{form.gymName}</h3>
          <p>{form.heroTitle}</p>
          <span>{form.phone} / {form.email}</span>
          <span>{form.address}</span>
        </div>
      </div>
    </section>
  );
}

export default SettingsSection;
