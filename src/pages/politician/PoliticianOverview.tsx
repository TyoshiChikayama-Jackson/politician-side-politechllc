import { useState } from 'react';
import {
  demoPolitician,
  demoContributions,
  demoVolunteers,
  demoFECFilings,
  demoMessages,
  demoCampaignPosts,
} from '../../data/politicianData';

const today = new Date('2026-05-05');
const electionDate = new Date(demoPolitician.electionDate);
const daysUntilElection = Math.ceil((electionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

const totalRaised = demoContributions.reduce((s, c) => s + c.amount, 0);
const mtdContributions = demoContributions.filter((c) => c.date.startsWith('2024-04') || c.date.startsWith('2024-05'));
const mtdRaised = mtdContributions.reduce((s, c) => s + c.amount, 0);
const totalVolunteerHours = demoVolunteers.reduce((s, v) => s + v.totalHours, 0);
const goalPct = Math.min(100, Math.round((totalRaised / demoPolitician.fundraisingGoal) * 100));

const recentActivity = [
  { label: 'Priya Nair donated $2,500', time: 'May 5', color: 'green' },
  { label: 'New message from Janet Torres re: HB 1042', time: 'May 5', color: 'blue' },
  { label: 'Amara Johnson logged 4 volunteer hours', time: 'May 4', color: 'purple' },
  { label: 'Helen Russo donated $3,000', time: 'May 3', color: 'green' },
  { label: 'Spring Fundraiser shift completed — 3 volunteers', time: 'May 2', color: 'purple' },
  { label: 'Post published: HB 1042 Education Statement', time: 'May 1', color: 'blue' },
];

// ─── Shared Toast ─────────────────────────────────────────────────────────────

function SuccessToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: '#F0FDF4', borderLeft: '4px solid #16A34A',
      padding: '12px 16px', borderRadius: 8, fontSize: 14,
      color: '#14532D', boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span>{message}</span>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#14532D', fontSize: 16 }}>✕</button>
    </div>
  );
}

// ─── New Post Modal ───────────────────────────────────────────────────────────

function NewPostModal({ onClose, onSave }: { onClose: () => void; onSave: (body: string) => void }) {
  const [body, setBody] = useState('');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>New PoliFeed Post</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="pol-field-group">
            <label>Post Text</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, 500))}
              placeholder="Share an update with your constituents..."
              style={{ minHeight: 140 }}
            />
            <div style={{ fontSize: '0.8rem', color: body.length > 450 ? '#f59e0b' : 'var(--muted)', textAlign: 'right', marginTop: 4 }}>{body.length}/500</div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="pol-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="pol-btn-primary" disabled={!body.trim()} onClick={() => onSave(body)}>Publish Now</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Donor Modal ──────────────────────────────────────────────────────────

function AddDonorModal({ onClose, onSave }: { onClose: () => void; onSave: (name: string) => void }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', employer: '', occupation: '', amount: '', date: new Date().toISOString().slice(0, 10), type: 'Individual', city: '', state: 'IN', zip: '', notes: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(`${form.firstName} ${form.lastName}`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Donor</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {(['firstName', 'lastName', 'employer', 'occupation'] as const).map((key) => (
              <div className="pol-field-group" key={key}>
                <label>{key === 'firstName' ? 'First Name' : key === 'lastName' ? 'Last Name' : key === 'employer' ? 'Employer' : 'Occupation'}</label>
                <input value={form[key]} onChange={f(key)} />
                {errors[key] && <span className="pol-field-error">{errors[key]}</span>}
              </div>
            ))}
            <div className="pol-field-group">
              <label>Amount ($)</label>
              <input type="number" min="1" value={form.amount} onChange={f('amount')} />
            </div>
            <div className="pol-field-group">
              <label>Contribution Date</label>
              <input type="date" value={form.date} onChange={f('date')} />
            </div>
            <div className="pol-field-group">
              <label>Type</label>
              <select value={form.type} onChange={f('type')}>
                {['Individual', 'PAC', 'Party', 'Other'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="pol-field-group">
              <label>City</label>
              <input value={form.city} onChange={f('city')} />
            </div>
            <div className="pol-field-group">
              <label>State</label>
              <input value={form.state} onChange={f('state')} maxLength={2} />
            </div>
            <div className="pol-field-group">
              <label>ZIP</label>
              <input value={form.zip} onChange={f('zip')} />
            </div>
            <div className="pol-field-group form-span-full">
              <label>Notes</label>
              <textarea value={form.notes} onChange={f('notes')} style={{ minHeight: 70 }} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="pol-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="pol-btn-primary" onClick={handleSave}>Save Donor</button>
        </div>
      </div>
    </div>
  );
}

// ─── Log Expense Modal ────────────────────────────────────────────────────────

function LogExpenseModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({ vendor: '', category: 'Advertising', amount: '', date: new Date().toISOString().slice(0, 10), description: '', paymentMethod: 'card' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.vendor.trim()) e.vendor = 'Required';
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Must be > 0';
    return e;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Log Expense</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="pol-field-group form-span-full">
              <label>Vendor Name *</label>
              <input value={form.vendor} onChange={f('vendor')} />
              {errors.vendor && <span className="pol-field-error">{errors.vendor}</span>}
            </div>
            <div className="pol-field-group">
              <label>Category</label>
              <select value={form.category} onChange={f('category')}>
                {['Advertising', 'Printing', 'Postage', 'Staff', 'Consulting', 'Events', 'Travel', 'Technology', 'Office', 'Other'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="pol-field-group">
              <label>Amount ($) *</label>
              <input type="number" min="1" value={form.amount} onChange={f('amount')} />
              {errors.amount && <span className="pol-field-error">{errors.amount}</span>}
            </div>
            <div className="pol-field-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={f('date')} />
            </div>
            <div className="pol-field-group">
              <label>Payment Method</label>
              <select value={form.paymentMethod} onChange={f('paymentMethod')}>
                {['card', 'check', 'wire', 'cash'].map((m) => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
              </select>
            </div>
            <div className="pol-field-group form-span-full">
              <label>Description</label>
              <textarea value={form.description} onChange={f('description')} style={{ minHeight: 70 }} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="pol-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="pol-btn-primary" onClick={() => {
            const e = validate();
            if (Object.keys(e).length) { setErrors(e); return; }
            onSave();
          }}>Save Expense</button>
        </div>
      </div>
    </div>
  );
}

// ─── New Email Campaign Modal ─────────────────────────────────────────────────

function NewEmailCampaignModal({ onClose, onSave }: { onClose: () => void; onSave: (subject: string, recipients: string) => void }) {
  const [form, setForm] = useState({ subject: '', recipients: 'All Supporters', body: '', schedule: false, scheduleDate: '' });
  const recipientCounts: Record<string, string> = { 'All Supporters': '1,240', 'Donors Only': '20', 'Volunteers Only': '5', 'District 12 Residents': '3,800' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>New Email Campaign</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="pol-field-group">
            <label>Recipient List</label>
            <select value={form.recipients} onChange={(e) => setForm((p) => ({ ...p, recipients: e.target.value }))}>
              {Object.keys(recipientCounts).map((r) => <option key={r}>{r}</option>)}
            </select>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 4 }}>~{recipientCounts[form.recipients]} recipients</div>
          </div>
          <div className="pol-field-group">
            <label>Subject Line *</label>
            <input value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} placeholder="e.g. Update on HB 1042 Education Funding" />
          </div>
          <div className="pol-field-group">
            <label>Message Body</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              placeholder="Write your message to supporters..."
              style={{ minHeight: 160 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <input type="checkbox" id="sched" checked={form.schedule} onChange={(e) => setForm((p) => ({ ...p, schedule: e.target.checked }))} style={{ width: 'auto' }} />
            <label htmlFor="sched" style={{ marginBottom: 0, fontSize: '0.9rem', cursor: 'pointer' }}>Schedule for later</label>
            {form.schedule && (
              <input type="datetime-local" value={form.scheduleDate} onChange={(e) => setForm((p) => ({ ...p, scheduleDate: e.target.value }))} style={{ marginLeft: 8 }} />
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="pol-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="pol-btn-primary" disabled={!form.subject.trim()} onClick={() => onSave(form.subject, form.recipients)}>
            {form.schedule ? 'Schedule' : 'Send Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PoliticianOverview() {
  const [showNewPost, setShowNewPost] = useState(false);
  const [showAddDonor, setShowAddDonor] = useState(false);
  const [showLogExpense, setShowLogExpense] = useState(false);
  const [showEmailCampaign, setShowEmailCampaign] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const upcomingFiling = demoFECFilings.find((f) => f.status === 'upcoming');
  const unreadMessages = demoMessages.filter((m) => m.status === 'unread').length;
  const violationCount = demoContributions.filter((c) => c.complianceStatus === 'violation').length;

  return (
    <div>
      {/* Welcome bar — clean white card, no gradient */}
      <div className="pol-page-header overview" style={{ marginBottom: 20 }}>
        <div className="pol-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>
              {demoPolitician.name}
            </span>
            <span className="pol-badge party-neutral">Your Party</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 16 }}>
            {demoPolitician.office} · {demoPolitician.district}
          </div>

          <div className="pol-overview-meta">
            <div className="pol-fundraising-row" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Fundraising Goal</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                ${totalRaised.toLocaleString()} of ${demoPolitician.fundraisingGoal.toLocaleString()}
              </span>
            </div>
            <div className="pol-thermometer">
              <div className="pol-thermometer-fill" style={{ width: `${goalPct}%` }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6, textAlign: 'right' }}>
              {daysUntilElection} days until election
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons — secondary style row */}
      <div style={{
        display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20,
        padding: '12px 0', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)',
      }}>
        <button className="pol-btn-primary pol-btn-sm" onClick={() => setShowNewPost(true)}>New Post</button>
        <button className="pol-btn-secondary pol-btn-sm" onClick={() => setShowAddDonor(true)}>Add Donor</button>
        <button className="pol-btn-secondary pol-btn-sm" onClick={() => setShowLogExpense(true)}>Log Expense</button>
        <button className="pol-btn-secondary pol-btn-sm" onClick={() => setShowEmailCampaign(true)}>New Email Campaign</button>
      </div>

      {/* Stat cards */}
      <div className="pol-stat-grid">
        <div className="pol-stat-card">
          <span className="pol-stat-label">Total Donors</span>
          <span className="pol-stat-value">20</span>
          <span className="pol-stat-sub">+3 this month</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Funds Raised — Month</span>
          <span className="pol-stat-value">${(mtdRaised / 1000).toFixed(1)}K</span>
          <span className="pol-stat-sub">${totalRaised.toLocaleString()} total cycle</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Volunteer Hours</span>
          <span className="pol-stat-value">{totalVolunteerHours}</span>
          <span className="pol-stat-sub">Across {demoVolunteers.length} volunteers</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">PoliCred Score</span>
          <span className="pol-stat-value">84</span>
          <span className="pol-stat-sub">+2 pts this month</span>
        </div>
      </div>

      <div className="pol-grid-2" style={{ marginBottom: 20 }}>
        <div className="pol-card">
          <h3>Alerts</h3>

          {violationCount > 0 && (
            <div className="pol-alert danger">
              <span className="pol-alert-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </span>
              <div className="pol-alert-body">
                <strong>FEC Compliance Violation</strong>
                <p>{violationCount} contribution(s) exceed state limits and require refund processing.</p>
              </div>
            </div>
          )}

          {upcomingFiling && (
            <div className="pol-alert warning">
              <span className="pol-alert-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </span>
              <div className="pol-alert-body">
                <strong>Filing Deadline: {upcomingFiling.dueDate}</strong>
                <p>{upcomingFiling.period} — {upcomingFiling.formType}</p>
              </div>
            </div>
          )}

          {unreadMessages > 0 && (
            <div className="pol-alert info">
              <span className="pol-alert-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </span>
              <div className="pol-alert-body">
                <strong>{unreadMessages} Unanswered Constituent Messages</strong>
                <p>Constituents are waiting for a response.</p>
              </div>
            </div>
          )}

          <div className="pol-alert warning">
            <span className="pol-alert-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
            <div className="pol-alert-body">
              <strong>Employer / Occupation Missing on 2 Donors</strong>
              <p>Required for contributions over $200 per FEC rules.</p>
            </div>
          </div>
        </div>

        <div className="pol-card">
          <h3>Recent Activity</h3>
          <div className="pol-activity-feed">
            {recentActivity.map((item, i) => (
              <div key={i} className="pol-activity-item">
                <div className={`pol-activity-dot ${item.color}`} />
                <div className="pol-activity-content">
                  <strong>{item.label}</strong>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="pol-grid-2">
        <div className="pol-card">
          <h3>Recent Post Performance</h3>
          <div className="pol-record-list">
            {demoCampaignPosts.filter((p) => p.status === 'published').slice(0, 3).map((post) => (
              <div key={post.id} className="pol-record-item" style={{ cursor: 'default' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-800)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.body.slice(0, 60)}...
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.775rem', color: 'var(--color-gray-500)' }}>
                    <span>{post.views.toLocaleString()} views</span>
                    <span>{post.likes} likes</span>
                    <span>{post.shares} shares</span>
                    <span>{post.comments} comments</span>
                  </div>
                </div>
                {post.topicTag && <span className="pol-badge in-progress">{post.topicTag}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="pol-card">
          <h3>FEC Filing Calendar</h3>
          <div className="pol-record-list">
            {demoFECFilings.map((filing) => (
              <div key={filing.id} className="pol-record-item" style={{ cursor: 'default' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-gray-900)', marginBottom: 2 }}>{filing.period}</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--color-gray-500)' }}>Due: {filing.dueDate}</div>
                </div>
                <span className={`pol-badge ${filing.status === 'filed' ? 'passed' : filing.status === 'overdue' ? 'failed' : 'in-progress'}`}>
                  {filing.status === 'filed' ? 'Filed' : filing.status === 'overdue' ? 'Overdue' : 'Upcoming'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showNewPost && (
        <NewPostModal
          onClose={() => setShowNewPost(false)}
          onSave={(body) => {
            setShowNewPost(false);
            showToast(`Post published: "${body.slice(0, 40)}..."`);
          }}
        />
      )}
      {showAddDonor && (
        <AddDonorModal
          onClose={() => setShowAddDonor(false)}
          onSave={(name) => {
            setShowAddDonor(false);
            showToast(`Donor ${name} added successfully.`);
          }}
        />
      )}
      {showLogExpense && (
        <LogExpenseModal
          onClose={() => setShowLogExpense(false)}
          onSave={() => {
            setShowLogExpense(false);
            showToast('Expense logged successfully.');
          }}
        />
      )}
      {showEmailCampaign && (
        <NewEmailCampaignModal
          onClose={() => setShowEmailCampaign(false)}
          onSave={(subject, recipients) => {
            setShowEmailCampaign(false);
            showToast(`Email campaign "${subject}" sent to ${recipients}.`);
          }}
        />
      )}
      {toast && <SuccessToast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
