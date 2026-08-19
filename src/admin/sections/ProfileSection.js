import React, { useEffect, useState } from 'react';
import { AdminInput, GlowButton } from '../../components/ui';
import { createProfileForm } from '../formHelpers';
import { useToast } from '../components/Toast';

function ProfileSection({ adminUser, updateAdminProfile }) {
  const notify = useToast();
  const [form, setForm] = useState(createProfileForm(adminUser));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm((current) => ({ ...current, username: adminUser }));
  }, [adminUser]);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await updateAdminProfile(form);
      notify('Login details updated. Please sign in again.');
    } catch (err) {
      setError(err.message || 'Could not update admin profile.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="resource-section settings-section">
      <div className="admin-panel-card">
        <div className="admin-heading">
          <p className="eyebrow">Login security</p>
          <h2>Admin Profile</h2>
        </div>
        <form className="admin-form" onSubmit={submit}>
          <AdminInput label="Username" onChange={(value) => setForm({ ...form, username: value })} required value={form.username} />
          <AdminInput label="Current Password" onChange={(value) => setForm({ ...form, currentPassword: value })} required type="password" value={form.currentPassword} />
          <AdminInput label="New Password" onChange={(value) => setForm({ ...form, newPassword: value })} type="password" value={form.newPassword} wide />
          {error && <p className="drawer-error" role="alert">{error}</p>}
          <div className="admin-actions">
            <GlowButton label={busy ? 'Updating...' : 'Update Login'} type="submit" />
          </div>
        </form>
      </div>
      <div className="admin-panel-card">
        <div className="admin-heading">
          <p className="eyebrow">Good to know</p>
          <h2>Account notes</h2>
        </div>
        <ul className="note-list">
          <li>
            <strong>No signup page.</strong>
            <span>Only this username and password can access the admin panel.</span>
          </li>
          <li>
            <strong>Use a strong password.</strong>
            <span>At least 8 characters with letters, numbers, and symbols.</span>
          </li>
          <li>
            <strong>Passwords are hashed.</strong>
            <span>The backend stores only a salted PBKDF2 password hash.</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default ProfileSection;
