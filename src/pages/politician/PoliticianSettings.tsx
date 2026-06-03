import { useState, useRef } from 'react';
import { demoPolitician, demoCampaignStaff } from '../../data/politicianData';
import type { CampaignStaff, StaffRole } from '../../types';

function ChangePasswordModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [error, setError] = useState('');
  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = () => {
    if (!form.current.trim()) { setError('Current password is required.'); return; }
    if (form.next.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (form.next !== form.confirm) { setError('Passwords do not match.'); return; }
    onSave();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Change Password</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {error && <div style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', color: 'var(--danger-solid)', fontSize: '0.88rem', marginBottom: 12 }}>{error}</div>}
          <div className="pol-field-group">
            <label>Current Password</label>
            <input type="password" value={form.current} onChange={f('current')} />
          </div>
          <div className="pol-field-group">
            <label>New Password</label>
            <input type="password" value={form.next} onChange={f('next')} placeholder="Min. 8 characters" />
          </div>
          <div className="pol-field-group">
            <label>Confirm New Password</label>
            <input type="password" value={form.confirm} onChange={f('confirm')} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="pol-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="pol-btn-primary" onClick={handleSave}>Update Password</button>
        </div>
      </div>
    </div>
  );
}

type Tab = 'profile' | 'campaign' | 'staff' | 'notifications' | 'security' | 'billing';

const ROLES: StaffRole[] = ['Admin', 'Finance', 'Communications', 'Volunteer Coordinator', 'Viewer'];

export function PoliticianSettings() {
  const [tab, setTab] = useState<Tab>('profile');
  const [staff, setStaff] = useState<CampaignStaff[]>(demoCampaignStaff);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<StaffRole>('Viewer');
  const [savedToast, setSavedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Changes saved successfully.');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState({
    name: demoPolitician.name,
    bio: demoPolitician.bio || '',
    website: demoPolitician.website || '',
    twitterHandle: demoPolitician.twitterHandle || '',
    facebookUrl: demoPolitician.facebookUrl || '',
  });
  const [campaign, setCampaign] = useState({
    campaignName: demoPolitician.campaignName,
    treasurerName: demoPolitician.treasurerName,
    treasurerAddress: demoPolitician.treasurerAddress,
    depositoryBank: demoPolitician.depositoryBank,
    fecCommitteeId: demoPolitician.fecCommitteeId || '',
    stateCommitteeId: demoPolitician.stateCommitteeId || '',
  });
  const [notifications, setNotifications] = useState({
    filingDeadlines: true,
    newDonors: true,
    constituentMessages: true,
    volunteerActivity: false,
    complianceAlerts: true,
    weeklyReport: true,
  });

  const showSavedToast = (msg = 'Settings saved.') => {
    setToastMessage(msg);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const inviteStaff = () => {
    if (!inviteEmail.trim()) return;
    const newMember: CampaignStaff = {
      id: `staff-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      inviteStatus: 'pending',
      joinedAt: new Date().toISOString().slice(0, 10),
    };
    setStaff((prev) => [...prev, newMember]);
    setInviteEmail('');
    showSavedToast();
  };

  const removeStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <div className="pol-page-header">
        <div className="pol-header-left">
          <h1>Settings</h1>
          <p>Manage your profile, campaign registration, staff access, and notification preferences.</p>
        </div>
      </div>

      {savedToast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, padding: '12px 16px', borderRadius: 8, background: '#F0FDF4', borderLeft: '4px solid #16A34A', color: '#14532D', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
          {toastMessage}
        </div>
      )}

      <div className="pol-tab-row" style={{ flexWrap: 'wrap' }}>
        {(['profile', 'campaign', 'staff', 'notifications', 'security', 'billing'] as Tab[]).map((t) => (
          <button key={t} className={`pol-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'profile' ? 'Profile' : t === 'campaign' ? 'Campaign Info' : t === 'staff' ? 'Staff Access' : t === 'notifications' ? 'Notifications' : t === 'security' ? 'Security' : 'Billing'}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="pol-grid-2">
          <div className="pol-card">
            <h3>Public Profile</h3>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              {profilePhotoUrl ? (
                <img src={profilePhotoUrl} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', display: 'block', border: '2px solid var(--border)' }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--grad-purple, linear-gradient(135deg, #4F46E5, #4F46E5))', display: 'grid', placeItems: 'center', fontSize: '1.8rem', margin: '0 auto 12px', color: 'white', fontWeight: 700 }}>
                  M
                </div>
              )}
              <button className="pol-btn-ghost pol-btn-sm" onClick={() => photoInputRef.current?.click()}>Upload Photo</button>
              <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => { setProfilePhotoUrl(ev.target?.result as string); showSavedToast('Profile photo updated.'); };
                reader.readAsDataURL(file);
                e.target.value = '';
              }} />
            </div>

            {[
              { key: 'name', label: 'Full Name' },
              { key: 'website', label: 'Official Website' },
              { key: 'twitterHandle', label: 'Twitter/X Handle' },
              { key: 'facebookUrl', label: 'Facebook URL' },
            ].map(({ key, label }) => (
              <div className="pol-field-group" key={key}>
                <label>{label}</label>
                <input
                  value={profile[key as keyof typeof profile]}
                  onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div className="pol-field-group">
              <label>Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                style={{ minHeight: 100 }}
              />
            </div>
            <button className="pol-btn-primary pol-btn-sm" onClick={() => showSavedToast()}>Save Profile</button>
          </div>

          <div className="pol-card">
            <h3>Office Details</h3>
            <div style={{ display: 'grid', gap: 14 }}>
              {[
                { label: 'Office', value: demoPolitician.office },
                { label: 'District', value: demoPolitician.district },
                { label: 'State', value: demoPolitician.state },
                { label: 'Party', value: demoPolitician.party },
                { label: 'Election Date', value: demoPolitician.electionDate },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{item.label}</span>
                  <span style={{ fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: '14px', borderRadius: 12, background: 'var(--purple-dim, rgba(107,93,230,0.08))', border: '1px solid var(--navy-border)', fontSize: '0.85rem', color: 'var(--muted)' }}>
              Contact PoliTech support to update office, district, or party affiliation.
            </div>
          </div>
        </div>
      )}

      {tab === 'campaign' && (
        <div className="pol-grid-2">
          <div className="pol-card">
            <h3>Campaign Registration Info</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 20 }}>Required for FEC and state filing compliance.</p>
            {[
              { key: 'campaignName', label: 'Campaign Name' },
              { key: 'treasurerName', label: 'Treasurer Name' },
              { key: 'treasurerAddress', label: 'Treasurer Address' },
              { key: 'depositoryBank', label: 'Depository Bank' },
            ].map(({ key, label }) => (
              <div className="pol-field-group" key={key}>
                <label>{label}</label>
                <input
                  value={campaign[key as keyof typeof campaign]}
                  onChange={(e) => setCampaign((p) => ({ ...p, [key]: e.target.value }))}
                />
              </div>
            ))}
            <button className="pol-btn-primary pol-btn-sm" onClick={() => showSavedToast()}>Save Campaign Info</button>
          </div>

          <div className="pol-card">
            <h3>Committee IDs</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 20 }}>Used in FEC report headers and compliance exports.</p>
            <div className="pol-field-group">
              <label>FEC Committee ID</label>
              <input value={campaign.fecCommitteeId} onChange={(e) => setCampaign((p) => ({ ...p, fecCommitteeId: e.target.value }))} />
            </div>
            <div className="pol-field-group">
              <label>State Committee ID</label>
              <input value={campaign.stateCommitteeId} onChange={(e) => setCampaign((p) => ({ ...p, stateCommitteeId: e.target.value }))} />
            </div>
            <button className="pol-btn-primary pol-btn-sm" onClick={() => showSavedToast()}>Save IDs</button>
          </div>
        </div>
      )}

      {tab === 'staff' && (
        <div>
          <div className="pol-card" style={{ marginBottom: 20 }}>
            <h3>Invite Staff Member</h3>
            <div className="form-grid">
              <div className="pol-field-group">
                <label>Email Address</label>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="staff@campaign.com" />
              </div>
              <div className="pol-field-group">
                <label>Role</label>
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as StaffRole)}>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 4 }}>
              <button className="pol-btn-primary pol-btn-sm" onClick={inviteStaff} disabled={!inviteEmail.trim()}>Send Invite</button>
            </div>
          </div>

          <div className="pol-card">
            <h3>Current Team</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {staff.map((member) => (
                    <tr key={member.id}>
                      <td style={{ fontWeight: 600 }}>{member.name}</td>
                      <td style={{ color: 'var(--muted)' }}>{member.email}</td>
                      <td><span className="pol-badge in-progress">{member.role}</span></td>
                      <td>
                        <span className={`pol-badge ${member.inviteStatus === 'active' ? 'passed' : member.inviteStatus === 'pending' ? 'warning' : 'failed'}`}>
                          {member.inviteStatus}
                        </span>
                      </td>
                      <td style={{ color: 'var(--muted)' }}>{member.joinedAt}</td>
                      <td>
                        <button className="pol-btn-danger pol-btn-sm" onClick={() => removeStaff(member.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 16, padding: '14px', borderRadius: 12, background: 'rgba(107,93,230,0.06)', border: '1px solid var(--navy-border)', fontSize: '0.83rem', color: 'var(--muted)' }}>
              <strong>Role Permissions:</strong> Admin (full access) · Finance (donors, expenses, FEC) · Communications (posts, messages) · Volunteer Coordinator (volunteers, shifts) · Viewer (read-only)
            </div>
          </div>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="pol-card" style={{ maxWidth: 560 }}>
          <h3>Email Notification Preferences</h3>
          <div style={{ display: 'grid', gap: 0 }}>
            {[
              { key: 'filingDeadlines', label: 'FEC Filing Deadlines', desc: '30-day, 10-day, 3-day reminders' },
              { key: 'newDonors', label: 'New Donor Alerts', desc: 'Notify when a new donor is added' },
              { key: 'constituentMessages', label: 'Constituent Messages', desc: 'Alert for unread inbox messages' },
              { key: 'volunteerActivity', label: 'Volunteer Activity', desc: 'Shift completions and hour logs' },
              { key: 'complianceAlerts', label: 'Compliance Alerts', desc: 'Over-limit and violation warnings' },
              { key: 'weeklyReport', label: 'Weekly Campaign Report', desc: 'Sunday digest of campaign metrics' },
            ].map(({ key, label, desc }) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{label}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 2 }}>{desc}</div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifications[key as keyof typeof notifications]}
                    onChange={(e) => setNotifications((p) => ({ ...p, [key]: e.target.checked }))}
                    style={{ width: 'auto', accentColor: 'var(--purple)' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    {notifications[key as keyof typeof notifications] ? 'On' : 'Off'}
                  </span>
                </label>
              </div>
            ))}
          </div>
          <button className="pol-btn-primary pol-btn-sm" style={{ marginTop: 20 }} onClick={() => showSavedToast()}>Save Preferences</button>
        </div>
      )}

      {tab === 'security' && (
        <div className="pol-grid-2">
          <div className="pol-card">
            <h3>Two-Factor Authentication</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 20 }}>Protect your campaign account with an additional verification step.</p>
            <div style={{ padding: '16px', borderRadius: 8, background: 'var(--color-success-bg, #F0FDF4)', border: '1px solid rgba(22,163,74,0.25)', marginBottom: 16 }}>
              <span style={{ color: 'var(--color-success, #16A34A)', fontWeight: 600 }}>2FA is currently enabled</span>
            </div>
            <button className="pol-btn-ghost pol-btn-sm" onClick={() => showSavedToast('2FA settings managed. No changes made.')}>Manage 2FA Settings</button>
            <button className="pol-btn-secondary pol-btn-sm" style={{ marginTop: 12 }} onClick={() => setShowChangePassword(true)}>Change Password</button>
          </div>
          <div className="pol-card">
            <h3>Data Export (Compliance)</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 20 }}>Download all your campaign data for compliance, audit, or migration purposes.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="pol-btn-secondary pol-btn-sm" onClick={() => showSavedToast('Donor data export initiated — check your downloads.')}>Export All Donor Data</button>
              <button className="pol-btn-secondary pol-btn-sm" onClick={() => showSavedToast('Contribution data export initiated.')}>Export All Contributions</button>
              <button className="pol-btn-secondary pol-btn-sm" onClick={() => showSavedToast('Expense data export initiated.')}>Export All Expenses</button>
              <button className="pol-btn-secondary pol-btn-sm" onClick={() => showSavedToast('Full account export queued — you will receive an email when ready.')}>Full Account Export (ZIP)</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'billing' && (
        <div className="pol-card" style={{ maxWidth: 560 }}>
          <h3>PoliTech Subscription</h3>
          <div style={{ padding: '20px 24px', borderRadius: 14, background: 'var(--navy-card, #1e2444)', border: '1px solid var(--navy-border)', marginBottom: 20 }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Current Plan</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-brand, #4F46E5)', marginBottom: 4 }}>Professional</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem' }}>$149/month · Billed monthly</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginTop: 8 }}>Next billing: June 1, 2026</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="pol-btn-primary pol-btn-sm" onClick={() => showSavedToast('Plan upgrade — contact support@politechllc.com to change your plan.')}>Upgrade Plan</button>
            <button className="pol-btn-ghost pol-btn-sm" onClick={() => showSavedToast('Payment method update — contact support@politechllc.com.')}>Update Payment Method</button>
            <button className="pol-btn-ghost pol-btn-sm" onClick={() => showSavedToast('Invoice history — contact support@politechllc.com for billing records.')}>View Invoice History</button>
            <button className="pol-btn-danger pol-btn-sm" onClick={() => { if (window.confirm('Are you sure you want to cancel your subscription?')) showSavedToast('Cancellation request received. A team member will follow up.'); }}>Cancel Subscription</button>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 16 }}>
            Need help? Contact <a href="mailto:support@politechllc.com" style={{ color: 'var(--color-brand, #4F46E5)' }}>support@politechllc.com</a>
          </p>
        </div>
      )}

      {showChangePassword && (
        <ChangePasswordModal
          onClose={() => setShowChangePassword(false)}
          onSave={() => { setShowChangePassword(false); showSavedToast('Password updated successfully.'); }}
        />
      )}
    </div>
  );
}
