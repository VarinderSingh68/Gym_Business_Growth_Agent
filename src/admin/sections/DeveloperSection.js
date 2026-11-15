import React, { useEffect, useState, useCallback, useRef } from 'react';
import Icon from '../../components/Icon';
import { apiRequest } from '../../lib/api';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';

function formatUptime(seconds) {
  if (!seconds) return '0s';
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}

function DeveloperSection() {
  const notify = useToast();
  const fileInputRef = useRef(null);
  const [tab, setTab] = useState('telemetry');
  const [health, setHealth] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [lockedIps, setLockedIps] = useState([]);
  const [diagnostics, setDiagnostics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [auditFilter, setAuditFilter] = useState('');
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [testEmailResult, setTestEmailResult] = useState(null);
  const [testCloudinaryResult, setTestCloudinaryResult] = useState(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);
  const [pendingRestoreData, setPendingRestoreData] = useState(null);

  const fetchHealth = useCallback(async () => {
    try {
      const data = await apiRequest('/api/dev/health');
      setHealth(data);
    } catch (err) {
      console.error('Failed to fetch system health:', err.message);
    }
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const data = await apiRequest('/api/dev/audit-logs');
      setAuditLogs(data.logs || []);
      setLockedIps(data.lockedIps || []);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err.message);
    }
  }, []);

  const fetchDiagnostics = useCallback(async () => {
    try {
      const data = await apiRequest('/api/dev/env-diagnostics');
      setDiagnostics(data);
    } catch (err) {
      console.error('Failed to fetch environment diagnostics:', err.message);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.allSettled([fetchHealth(), fetchAuditLogs(), fetchDiagnostics()]);
    setLoading(false);
  }, [fetchHealth, fetchAuditLogs, fetchDiagnostics]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleUnlockIp = async (ip) => {
    try {
      const result = await apiRequest('/api/dev/unlock-ip', {
        method: 'POST',
        body: { ip },
      });
      notify(result.message || `Unlocked IP: ${ip}`);
      await fetchAuditLogs();
    } catch (err) {
      notify(err.message || 'Failed to unlock IP.');
    }
  };

  const handleClearAuditLogs = async () => {
    try {
      await apiRequest('/api/dev/clear-audit-logs', { method: 'POST' });
      notify('Audit log cleared.');
      await fetchAuditLogs();
    } catch (err) {
      notify(err.message || 'Failed to clear audit logs.');
    }
  };

  const handleDownloadBackup = async () => {
    try {
      const backup = await apiRequest('/api/dev/backup');
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `volt-fitness-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      notify('Database backup downloaded successfully.');
    } catch (err) {
      notify(err.message || 'Failed to generate backup.');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.store || typeof parsed.store !== 'object') {
          throw new Error('Invalid backup file format: missing store object.');
        }
        setPendingRestoreData(parsed);
        setConfirmRestoreOpen(true);
      } catch (err) {
        notify(`Invalid JSON file: ${err.message}`);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const executeRestore = async () => {
    if (!pendingRestoreData) return;
    try {
      setLoading(true);
      const res = await apiRequest('/api/dev/restore', {
        method: 'POST',
        body: pendingRestoreData,
      });
      notify(res.message || 'Database restored successfully!');
      setConfirmRestoreOpen(false);
      setPendingRestoreData(null);
      await loadAll();
    } catch (err) {
      notify(err.message || 'Restore failed.');
    } finally {
      setLoading(false);
    }
  };

  const executeFactoryReset = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/api/dev/reset-factory', { method: 'POST' });
      notify(res.message || 'Database reset to factory defaults.');
      setConfirmResetOpen(false);
      await loadAll();
    } catch (err) {
      notify(err.message || 'Factory reset failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async (e) => {
    e.preventDefault();
    setTestEmailResult(null);
    try {
      const res = await apiRequest('/api/dev/test-email', {
        method: 'POST',
        body: { to: testEmailAddress || undefined },
      });
      setTestEmailResult({ success: true, message: res.message });
      notify('Test email sent successfully!');
    } catch (err) {
      setTestEmailResult({ success: false, message: err.message });
      notify(err.message || 'SMTP test failed.');
    }
  };

  const handleTestCloudinary = async () => {
    setTestCloudinaryResult(null);
    try {
      const res = await apiRequest('/api/dev/test-cloudinary', { method: 'POST' });
      setTestCloudinaryResult({ success: true, message: res.message, folder: res.folder });
      notify('Cloudinary configuration is valid!');
    } catch (err) {
      setTestCloudinaryResult({ success: false, message: err.message });
      notify(err.message || 'Cloudinary verification failed.');
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (!auditFilter) return true;
    const q = auditFilter.toLowerCase();
    return (
      (log.action || '').toLowerCase().includes(q) ||
      (log.user || '').toLowerCase().includes(q) ||
      (log.ip || '').toLowerCase().includes(q) ||
      (log.resource || '').toLowerCase().includes(q) ||
      (log.details || '').toLowerCase().includes(q)
    );
  });

  return (
    <section className="resource-section developer-section">
      {/* Top Banner if Default Password is in use */}
      {diagnostics?.defaultPasswordActive && (
        <div className="security-alert-banner">
          <Icon name="alert" />
          <div className="security-alert-text">
            <strong>CRITICAL SECURITY WARNING:</strong>
            <span>Default admin password ("1234") is active! Go to the <strong>Admin Security / Profile</strong> tab and change it immediately.</span>
          </div>
        </div>
      )}

      {/* Developer Header Bar */}
      <div className="dev-header-panel">
        <div className="dev-header-titles">
          <p className="eyebrow">Internal Tools & Security Suite</p>
          <h2>Developer Console & Diagnostics</h2>
        </div>
        <div className="dev-header-actions">
          <button className="ghost-action" onClick={loadAll} disabled={loading} type="button">
            <Icon name="refresh" />
            {loading ? 'Refreshing...' : 'Refresh Telemetry'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dev-nav-tabs">
        <button className={tab === 'telemetry' ? 'active' : ''} onClick={() => setTab('telemetry')} type="button">
          <Icon name="activity" /> System Health
        </button>
        <button className={tab === 'audit' ? 'active' : ''} onClick={() => setTab('audit')} type="button">
          <Icon name="shield" /> Audit Trail & Locked IPs ({lockedIps.length})
        </button>
        <button className={tab === 'database' ? 'active' : ''} onClick={() => setTab('database')} type="button">
          <Icon name="server" /> Database & Backups
        </button>
        <button className={tab === 'integrations' ? 'active' : ''} onClick={() => setTab('integrations')} type="button">
          <Icon name="settings" /> Environment & Diagnostics
        </button>
      </div>

      {/* TAB 1: SYSTEM HEALTH & TELEMETRY */}
      {tab === 'telemetry' && (
        <div className="dev-tab-content">
          <div className="dashboard-grid">
            <div className="stat-card cyan">
              <span className="stat-label">System Uptime</span>
              <strong className="stat-value">{health ? formatUptime(health.uptime) : '—'}</strong>
              <small>Process PID: {health?.pid || '—'}</small>
            </div>
            <div className="stat-card orange">
              <span className="stat-label">Node Runtime</span>
              <strong className="stat-value">{health?.nodeVersion || '—'}</strong>
              <small>{health?.platform} ({health?.arch})</small>
            </div>
            <div className="stat-card cyan">
              <span className="stat-label">Memory RSS / Heap</span>
              <strong className="stat-value">{health?.memory ? `${health.memory.rssMb} MB` : '—'}</strong>
              <small>Heap: {health?.memory ? `${health.memory.heapUsedMb} / ${health.memory.heapTotalMb} MB` : '—'}</small>
            </div>
            <div className="stat-card orange">
              <span className="stat-label">Total Collections</span>
              <strong className="stat-value">{health?.counts ? Object.keys(health.counts).length : '—'}</strong>
              <small>{health?.counts ? `${Object.values(health.counts).reduce((a, b) => a + b, 0)} total records` : '—'}</small>
            </div>
          </div>

          <div className="dashboard-columns">
            <div className="admin-panel-card">
              <div className="admin-heading">
                <p className="eyebrow">Storage Metrics</p>
                <h3>Database File System Sizes</h3>
              </div>
              <ul className="dev-metrics-list">
                <li>
                  <span>Data Store (<code>store.json</code>)</span>
                  <strong>{health?.files?.storeSizeKb || 0} KB</strong>
                </li>
                <li>
                  <span>User Accounts (<code>users.json</code>)</span>
                  <strong>{health?.files?.usersSizeKb || 0} KB</strong>
                </li>
                <li>
                  <span>Admin Credentials (<code>admin.json</code>)</span>
                  <strong>{health?.files?.adminSizeKb || 0} KB</strong>
                </li>
                <li>
                  <span>Security Audit Log (<code>audit_log.json</code>)</span>
                  <strong>{health?.files?.auditLogSizeKb || 0} KB</strong>
                </li>
              </ul>
            </div>

            <div className="admin-panel-card">
              <div className="admin-heading">
                <p className="eyebrow">Collection Breakdown</p>
                <h3>Records per Collection</h3>
              </div>
              {health?.counts ? (
                <div className="dev-collections-grid">
                  {Object.entries(health.counts).map(([name, count]) => (
                    <div className="dev-collection-pill" key={name}>
                      <span className="dev-coll-name">{name}</span>
                      <span className="dev-coll-count">{count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No metrics available" body="Start the server to inspect collection data." />
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT TRAIL & LOCKED IPS */}
      {tab === 'audit' && (
        <div className="dev-tab-content">
          {lockedIps.length > 0 && (
            <div className="admin-panel-card alert-border">
              <div className="admin-heading">
                <p className="eyebrow">Brute-Force Shield</p>
                <h3 className="danger-text">Active IP Lockouts ({lockedIps.length})</h3>
              </div>
              <div className="dev-locked-list">
                {lockedIps.map((lock) => (
                  <div className="locked-ip-item" key={lock.ip}>
                    <div>
                      <strong>IP: {lock.ip}</strong>
                      <span className="locked-time">
                        {lock.minutesLeft > 0 ? `Locked for ~${lock.minutesLeft} more minute(s)` : 'Lock expiring soon'}
                      </span>
                    </div>
                    <button className="ghost-action" onClick={() => handleUnlockIp(lock.ip)} type="button">
                      <Icon name="unlock" /> Unlock IP
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="admin-panel-card">
            <div className="dev-audit-bar">
              <div className="admin-heading">
                <p className="eyebrow">Security Audit Trail</p>
                <h3>Live Event Stream ({filteredLogs.length} events)</h3>
              </div>
              <div className="dev-audit-actions">
                <input
                  className="dev-search-input"
                  placeholder="Filter by user, action, IP, resource..."
                  value={auditFilter}
                  onChange={(e) => setAuditFilter(e.target.value)}
                />
                <button className="ghost-action" onClick={fetchAuditLogs} type="button">
                  <Icon name="refresh" /> Refresh
                </button>
                <button className="ghost-action danger-hover" onClick={handleClearAuditLogs} type="button">
                  <Icon name="trash" /> Clear Logs
                </button>
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <EmptyState title="No audit events found" body="Security actions, logins, and data mutations will log here automatically." />
            ) : (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>IP Address</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Resource</th>
                      <th>Status</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.slice(0, 50).map((log, index) => (
                      <tr key={index}>
                        <td className="subtle-cell">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        <td><code>{log.ip || '127.0.0.1'}</code></td>
                        <td>{log.user || 'anonymous'}</td>
                        <td><strong>{log.action}</strong></td>
                        <td>{log.resource || '—'}</td>
                        <td>
                          <span className={`status-pill status-${(log.status || 'info').toLowerCase()}`}>
                            {log.status || 'INFO'}
                          </span>
                        </td>
                        <td className="small-cell">{log.details || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE BACKUPS & RESTORE */}
      {tab === 'database' && (
        <div className="dev-tab-content">
          <div className="dashboard-columns">
            <div className="admin-panel-card">
              <div className="admin-heading">
                <p className="eyebrow">Backup & Recovery</p>
                <h3>Export Entire Gym Database</h3>
              </div>
              <p className="panel-desc">
                Download an atomic snapshot of all clients, subscriptions, equipment, lockers, inventory, workouts, classes, and system settings in structured JSON format.
              </p>
              <div className="admin-actions">
                <button className="ghost-action highlight-btn" onClick={handleDownloadBackup} type="button">
                  <Icon name="download" /> Download JSON Backup
                </button>
              </div>
            </div>

            <div className="admin-panel-card">
              <div className="admin-heading">
                <p className="eyebrow">Restore Database</p>
                <h3>Restore from JSON Backup</h3>
              </div>
              <p className="panel-desc">
                Upload a verified Volt Fitness JSON backup file to restore complete club state. Existing records will be safely replaced with the backup payload.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
              <div className="admin-actions">
                <button className="ghost-action" onClick={() => fileInputRef.current?.click()} type="button">
                  <Icon name="server" /> Choose Backup File...
                </button>
              </div>
            </div>
          </div>

          <div className="admin-panel-card danger-zone">
            <div className="admin-heading">
              <p className="eyebrow danger-text">Cautionary Zone</p>
              <h3 className="danger-text">Factory Reset Database</h3>
            </div>
            <p className="panel-desc">
              Resets the database back to clean default seed data (plans, initial trainers, schedule, and starter facility records). This cannot be undone unless you have a backup.
            </p>
            <div className="admin-actions">
              <button className="danger-action" onClick={() => setConfirmResetOpen(true)} type="button">
                <Icon name="alert" /> Reset Database to Factory Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ENVIRONMENT & INTEGRATION DIAGNOSTICS */}
      {tab === 'integrations' && (
        <div className="dev-tab-content">
          <div className="dashboard-columns">
            <div className="admin-panel-card">
              <div className="admin-heading">
                <p className="eyebrow">Outbound Email</p>
                <h3>SMTP Mailer Diagnostics</h3>
              </div>
              <ul className="dev-metrics-list">
                <li><span>Host</span><strong>{diagnostics?.smtp?.host || 'smtp.gmail.com'}</strong></li>
                <li><span>Port</span><strong>{diagnostics?.smtp?.port || '465'}</strong></li>
                <li><span>Sender Email</span><strong>{diagnostics?.smtp?.user || 'Not configured'}</strong></li>
                <li>
                  <span>Status</span>
                  <span className={`status-pill ${diagnostics?.smtp?.configured ? 'status-present' : 'status-missed'}`}>
                    {diagnostics?.smtp?.configured ? 'Configured' : 'Missing Credentials'}
                  </span>
                </li>
              </ul>
              <form className="dev-test-form" onSubmit={handleTestEmail}>
                <input
                  type="email"
                  placeholder="Recipient for test email..."
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                />
                <button className="ghost-action" type="submit">
                  <Icon name="mail" /> Send Test Email
                </button>
              </form>
              {testEmailResult && (
                <p className={`test-feedback ${testEmailResult.success ? 'success' : 'error'}`}>
                  {testEmailResult.message}
                </p>
              )}
            </div>

            <div className="admin-panel-card">
              <div className="admin-heading">
                <p className="eyebrow">Cloud Media</p>
                <h3>Cloudinary CDN Diagnostics</h3>
              </div>
              <ul className="dev-metrics-list">
                <li><span>Cloud Name</span><strong>{diagnostics?.cloudinary?.cloudName || 'Not configured'}</strong></li>
                <li><span>Folder</span><strong>{diagnostics?.cloudinary?.folder || 'volt-fitness'}</strong></li>
                <li><span>API Key</span><strong>{diagnostics?.cloudinary?.apiKeyMasked || '••••••••'}</strong></li>
                <li>
                  <span>Status</span>
                  <span className={`status-pill ${diagnostics?.cloudinary?.configured ? 'status-present' : 'status-missed'}`}>
                    {diagnostics?.cloudinary?.configured ? 'Ready' : 'Incomplete'}
                  </span>
                </li>
              </ul>
              <div className="admin-actions">
                <button className="ghost-action" onClick={handleTestCloudinary} type="button">
                  <Icon name="activity" /> Test Cloudinary API
                </button>
              </div>
              {testCloudinaryResult && (
                <p className={`test-feedback ${testCloudinaryResult.success ? 'success' : 'error'}`}>
                  {testCloudinaryResult.message}
                </p>
              )}
            </div>
          </div>

          <div className="admin-panel-card">
            <div className="admin-heading">
              <p className="eyebrow">Active Defenses</p>
              <h3>Security Hardening Checklist</h3>
            </div>
            <div className="security-badges-grid">
              <div className="sec-badge active">
                <Icon name="check" />
                <div>
                  <strong>Prototype Pollution Shield</strong>
                  <p>Recursively strips <code>__proto__</code> &amp; <code>constructor</code> keys from incoming JSON payloads.</p>
                </div>
              </div>
              <div className="sec-badge active">
                <Icon name="check" />
                <div>
                  <strong>Content Security Policy &amp; Security Headers</strong>
                  <p>Active <code>nosniff</code>, <code>X-Frame-Options: SAMEORIGIN</code>, and CSP enabled on all HTTP responses.</p>
                </div>
              </div>
              <div className="sec-badge active">
                <Icon name="check" />
                <div>
                  <strong>Timing-Safe Authentication</strong>
                  <p>Password and session hash comparisons use <code>crypto.timingSafeEqual</code> to prevent side-channel timing attacks.</p>
                </div>
              </div>
              <div className="sec-badge active">
                <Icon name="check" />
                <div>
                  <strong>PBKDF2 Password Hashing (310,000 Iterations)</strong>
                  <p>Complies with modern OWASP cryptographic standards with unique cryptographic salts.</p>
                </div>
              </div>
              <div className="sec-badge active">
                <Icon name="check" />
                <div>
                  <strong>Brute-Force IP Lockout Protection</strong>
                  <p>Automatic 5-minute lockout triggered after 5 consecutive failed authentication attempts.</p>
                </div>
              </div>
              <div className="sec-badge active">
                <Icon name="check" />
                <div>
                  <strong>Chatbot &amp; Auth Rate Limiting</strong>
                  <p>Per-IP sliding window prevents API flooding, DoS, and spam attacks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmDialog
        open={confirmResetOpen}
        title="Factory Reset Database?"
        body="Are you sure you want to reset all data back to factory defaults? All current records, custom workouts, equipment logs, and settings will be overwritten."
        confirmLabel="Yes, Reset Database"
        onConfirm={executeFactoryReset}
        onCancel={() => setConfirmResetOpen(false)}
      />

      <ConfirmDialog
        open={confirmRestoreOpen}
        title="Restore from JSON Backup?"
        body="Restoring will replace the current database with the uploaded backup file. Ensure all team members have completed active edits before proceeding."
        confirmLabel="Yes, Restore Now"
        onConfirm={executeRestore}
        onCancel={() => {
          setConfirmRestoreOpen(false);
          setPendingRestoreData(null);
        }}
      />
    </section>
  );
}

export default DeveloperSection;