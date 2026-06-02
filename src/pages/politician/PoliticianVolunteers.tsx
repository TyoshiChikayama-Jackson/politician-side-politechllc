import { useState, useMemo } from 'react';
import type { Volunteer, Shift } from '../../types';
import { demoVolunteers, demoShifts } from '../../data/politicianData';

type Tab = 'roster' | 'shifts' | 'leaderboard';

// ─── Shared Toast ─────────────────────────────────────────────────────────────

function SuccessToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        background: '#F0FDF4', borderLeft: '4px solid #16A34A',
        padding: '12px 16px', borderRadius: 8, fontSize: 14,
        color: '#14532D', boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}
    >
      <span>{message}</span>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#14532D', fontSize: 16, lineHeight: 1 }}>✕</button>
    </div>
  );
}

function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, showToast };
}

// ─── Add Volunteer Modal ──────────────────────────────────────────────────────

const SKILL_OPTIONS = ['Canvassing', 'Phone Banking', 'Data Entry', 'Event Setup', 'Social Media', 'Graphic Design', 'Fundraising', 'Legal', 'Translation', 'Photography'];
const AVAILABILITY_OPTIONS = ['Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Flexible'];

function AddVolunteerModal({ onClose, onSave }: { onClose: () => void; onSave: (v: Volunteer) => void }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', availability: 'Weekends', skills: [] as string[] });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleSkill = (skill: string) =>
    setForm((p) => ({ ...p, skills: p.skills.includes(skill) ? p.skills.filter((s) => s !== skill) : [...p.skills, skill] }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const v: Volunteer = {
      id: `vol-${Date.now()}`,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      skills: form.skills.length ? form.skills : ['General'],
      availability: form.availability,
      status: 'active',
      totalHours: 0,
      joinDate: new Date().toISOString().slice(0, 10),
    };
    onSave(v);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Volunteer</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {(['firstName', 'lastName', 'email', 'phone'] as const).map((key) => (
              <div className="pol-field-group" key={key}>
                <label>{key === 'firstName' ? 'First Name' : key === 'lastName' ? 'Last Name' : key === 'email' ? 'Email' : 'Phone'}</label>
                <input value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} />
                {errors[key] && <span className="pol-field-error">{errors[key]}</span>}
              </div>
            ))}
            <div className="pol-field-group">
              <label>Availability</label>
              <select value={form.availability} onChange={(e) => setForm((p) => ({ ...p, availability: e.target.value }))}>
                {AVAILABILITY_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div className="pol-field-group" style={{ marginTop: 8 }}>
            <label>Skills</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {SKILL_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSkill(s)}
                  className={form.skills.includes(s) ? 'pol-btn-primary pol-btn-sm' : 'pol-btn-ghost pol-btn-sm'}
                  style={{ fontSize: '0.78rem' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="pol-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="pol-btn-primary" onClick={handleSave}>Add Volunteer</button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Shift Modal ───────────────────────────────────────────────────────

function CreateShiftModal({ onClose, onSave }: { onClose: () => void; onSave: (s: Shift) => void }) {
  const [form, setForm] = useState({ title: '', date: '', startTime: '', endTime: '', location: '', capacity: '20', notes: '', type: 'canvassing' as Shift['type'] });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Required';
    if (!form.date) e.date = 'Required';
    if (!form.location.trim()) e.location = 'Required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const shift: Shift = {
      id: `shift-${Date.now()}`,
      title: form.title,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      location: form.location,
      type: form.type,
      capacity: Number(form.capacity) || 20,
      assignedVolunteerIds: [],
      hoursLogged: {},
    };
    onSave(shift);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create Shift</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="pol-field-group form-span-full">
              <label>Shift Name *</label>
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Saturday Canvassing — North Side" />
              {errors.title && <span className="pol-field-error">{errors.title}</span>}
            </div>
            <div className="pol-field-group">
              <label>Type</label>
              <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as Shift['type'] }))}>
                <option value="canvassing">Canvassing</option>
                <option value="phone-banking">Phone Banking</option>
                <option value="event-setup">Event Setup</option>
                <option value="data-entry">Data Entry</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="pol-field-group">
              <label>Capacity (max volunteers)</label>
              <input type="number" min="1" value={form.capacity} onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))} />
            </div>
            <div className="pol-field-group">
              <label>Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
              {errors.date && <span className="pol-field-error">{errors.date}</span>}
            </div>
            <div className="pol-field-group">
              <label>Location *</label>
              <input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="e.g. IPS Community Center" />
              {errors.location && <span className="pol-field-error">{errors.location}</span>}
            </div>
            <div className="pol-field-group">
              <label>Start Time</label>
              <input type="time" value={form.startTime} onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))} />
            </div>
            <div className="pol-field-group">
              <label>End Time</label>
              <input type="time" value={form.endTime} onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))} />
            </div>
            <div className="pol-field-group form-span-full">
              <label>Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} style={{ minHeight: 70 }} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="pol-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="pol-btn-primary" onClick={handleSave}>Save Shift</button>
        </div>
      </div>
    </div>
  );
}

// ─── Log Hours Modal ──────────────────────────────────────────────────────────

function LogHoursModal({ volunteer, onClose, onSave }: { volunteer: Volunteer; onClose: () => void; onSave: (id: string, hours: number, activity: string) => void }) {
  const [hours, setHours] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [activity, setActivity] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!hours || Number(hours) <= 0) { setError('Enter a valid number of hours.'); return; }
    onSave(volunteer.id, Number(hours), activity);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Log Hours</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="pol-field-group">
            <label>Volunteer</label>
            <input value={`${volunteer.firstName} ${volunteer.lastName}`} disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="pol-field-group">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="pol-field-group">
            <label>Hours *</label>
            <input type="number" min="0.5" step="0.5" value={hours} onChange={(e) => { setHours(e.target.value); setError(''); }} placeholder="e.g. 4" />
            {error && <span className="pol-field-error">{error}</span>}
          </div>
          <div className="pol-field-group">
            <label>Activity Description</label>
            <input value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="e.g. Saturday canvassing — North Side" />
          </div>
        </div>
        <div className="modal-footer">
          <button className="pol-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="pol-btn-primary" onClick={handleSave}>Log Hours</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PoliticianVolunteers() {
  const [tab, setTab] = useState<Tab>('roster');
  const [volunteers, setVolunteers] = useState<Volunteer[]>(demoVolunteers);
  const [shifts, setShifts] = useState<Shift[]>(demoShifts);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [search, setSearch] = useState('');
  const [showAddVolunteer, setShowAddVolunteer] = useState(false);
  const [showCreateShift, setShowCreateShift] = useState(false);
  const [logHoursTarget, setLogHoursTarget] = useState<Volunteer | null>(null);
  const { toast, showToast } = useToast();

  const totalHours = useMemo(() => volunteers.reduce((s, v) => s + v.totalHours, 0), [volunteers]);
  const activeCount = useMemo(() => volunteers.filter((v) => v.status === 'active').length, [volunteers]);

  const filtered = useMemo(() =>
    volunteers.filter((v) => {
      const name = `${v.firstName} ${v.lastName}`.toLowerCase();
      return !search || name.includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase());
    }),
    [volunteers, search]
  );

  const sorted = useMemo(() => [...volunteers].sort((a, b) => b.totalHours - a.totalHours), [volunteers]);

  const handleAddVolunteer = (v: Volunteer) => {
    setVolunteers((prev) => [v, ...prev]);
    setShowAddVolunteer(false);
    showToast(`${v.firstName} ${v.lastName} added to volunteer roster.`);
  };

  const handleCreateShift = (s: Shift) => {
    setShifts((prev) => [s, ...prev]);
    setShowCreateShift(false);
    showToast(`Shift "${s.title}" created.`);
  };

  const handleLogHours = (id: string, hours: number, activity: string) => {
    setVolunteers((prev) =>
      prev.map((v) => v.id === id ? { ...v, totalHours: v.totalHours + hours } : v)
    );
    setSelectedVolunteer((prev) => prev && prev.id === id ? { ...prev, totalHours: prev.totalHours + hours } : prev);
    setLogHoursTarget(null);
    showToast(`${hours} hours logged${activity ? ` for "${activity}"` : ''}.`);
  };

  return (
    <div>
      <div className="pol-page-header">
        <div className="pol-header-left">
          <h1>Volunteers</h1>
          <p>Recruit, schedule, and track your volunteer team. Manage shifts and keep your ground game organized.</p>
        </div>
        <div className="pol-header-actions">
          <button className="pol-btn-secondary pol-btn-sm" onClick={() => {
            const csv = ['First Name,Last Name,Email,Phone,Skills,Availability,Hours,Status',
              ...volunteers.map((v) => `${v.firstName},${v.lastName},${v.email},${v.phone || ''},"${v.skills.join('; ')}",${v.availability},${v.totalHours},${v.status}`)
            ].join('\n');
            const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
            a.download = 'volunteers.csv'; a.click();
            showToast('Volunteer list exported.');
          }}>Export List</button>
          <button className="pol-btn-secondary pol-btn-sm" onClick={() => setShowCreateShift(true)}>Create Shift</button>
          <button className="pol-btn-primary pol-btn-sm" onClick={() => setShowAddVolunteer(true)}>Add Volunteer</button>
        </div>
      </div>

      <div className="pol-stat-grid" style={{ marginBottom: 20 }}>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Total Volunteers</span>
          <span className="pol-stat-value">{volunteers.length}</span>
          <span className="pol-stat-sub">{activeCount} active</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Total Hours Logged</span>
          <span className="pol-stat-value">{totalHours}</span>
          <span className="pol-stat-sub">Across all activities</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Shifts Scheduled</span>
          <span className="pol-stat-value">{shifts.length}</span>
          <span className="pol-stat-sub">Upcoming &amp; past</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Avg Hours / Volunteer</span>
          <span className="pol-stat-value">{volunteers.length ? Math.round(totalHours / volunteers.length) : 0}</span>
          <span className="pol-stat-sub">Per volunteer</span>
        </div>
      </div>

      <div className="pol-tab-row">
        {(['roster', 'shifts', 'leaderboard'] as Tab[]).map((t) => (
          <button key={t} className={`pol-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'roster' ? 'Roster' : t === 'shifts' ? 'Shifts' : 'Leaderboard'}
          </button>
        ))}
      </div>

      {tab === 'roster' && (
        <div className="pol-sidebar-layout">
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div className="pol-search-bar">
              <div className="pol-search-wrapper" style={{ flex: 1 }}>
                <input className="pol-search-input" placeholder="Search volunteers..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="pol-record-list">
              {filtered.map((v) => (
                <div
                  key={v.id}
                  className={`pol-record-item${selectedVolunteer?.id === v.id ? ' selected' : ''}`}
                  onClick={() => setSelectedVolunteer(v)}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{v.firstName} {v.lastName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>{v.email}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                      {v.skills.slice(0, 2).map((s) => (
                        <span key={s} className="pol-badge in-progress" style={{ fontSize: '0.72rem' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-brand, #6B5DE6)' }}>{v.totalHours}h</div>
                    <span className={`pol-badge ${v.status}`} style={{ marginTop: 4, display: 'inline-flex' }}>{v.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            {selectedVolunteer ? (
              <div className="pol-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ marginBottom: 4 }}>{selectedVolunteer.firstName} {selectedVolunteer.lastName}</h3>
                    <div style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{selectedVolunteer.email} · {selectedVolunteer.phone}</div>
                  </div>
                  <button className="pol-btn-secondary pol-btn-sm" onClick={() => setLogHoursTarget(selectedVolunteer)}>+ Log Hours</button>
                </div>

                <div className="pol-card-dark" style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="pol-stat-label">Total Hours</div>
                      <div className="pol-stat-value">{selectedVolunteer.totalHours}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="pol-stat-label">Joined</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{selectedVolunteer.joinDate}</div>
                    </div>
                  </div>
                </div>

                <div className="form-grid">
                  <div>
                    <span className="info-label">Availability</span>
                    <strong>{selectedVolunteer.availability}</strong>
                  </div>
                  <div>
                    <span className="info-label">Status</span>
                    <span className={`pol-badge ${selectedVolunteer.status}`}>{selectedVolunteer.status}</span>
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <span className="info-label">Skills</span>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    {selectedVolunteer.skills.map((s) => (
                      <span key={s} className="pol-badge in-progress">{s}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="pol-btn-secondary pol-btn-sm" onClick={() => {
                    window.open(`mailto:${selectedVolunteer.email}?subject=Campaign Update`);
                  }}>Send Email</button>
                  <button className="pol-btn-secondary pol-btn-sm" onClick={() => {
                    showToast(`SMS link copied for ${selectedVolunteer.firstName}.`);
                  }}>Send SMS</button>
                  <button className="pol-btn-secondary pol-btn-sm" onClick={() => {
                    setTab('shifts');
                    showToast(`Viewing shifts to assign ${selectedVolunteer.firstName}.`);
                  }}>Assign to Shift</button>
                </div>
              </div>
            ) : (
              <div className="pol-card" style={{ display: 'grid', placeItems: 'center', minHeight: 300, color: 'var(--muted)', textAlign: 'center' }}>
                <div>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }} aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <p>Select a volunteer to view their profile, hours, and activity history.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'shifts' && (
        <div className="pol-grid-2">
          {shifts.map((shift) => (
            <div key={shift.id} className="pol-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>{shift.title}</h3>
                <span className="pol-badge in-progress">{shift.type.replace('-', ' ')}</span>
              </div>
              <div style={{ display: 'grid', gap: 8, fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 16 }}>
                <div>{shift.date} · {shift.startTime} – {shift.endTime}</div>
                <div>{shift.location}</div>
                <div>{shift.assignedVolunteerIds.length} / {shift.capacity} volunteers</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 6 }}>Assigned Volunteers:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {shift.assignedVolunteerIds.map((vid) => {
                    const vol = volunteers.find((v) => v.id === vid);
                    return vol ? (
                      <span key={vid} style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--purple-dim, rgba(107,93,230,0.12))', color: 'var(--color-brand, #6B5DE6)', fontSize: '0.8rem' }}>
                        {vol.firstName} {vol.lastName} ({Object.values(shift.hoursLogged)[shift.assignedVolunteerIds.indexOf(vid)]}h)
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="pol-btn-secondary pol-btn-sm" onClick={() => showToast(`Edit functionality for "${shift.title}" — use the form to create a new shift.`)}>Edit Shift</button>
                <button className="pol-btn-secondary pol-btn-sm" onClick={() => {
                  const first = volunteers.find((v) => shift.assignedVolunteerIds.includes(v.id));
                  if (first) setLogHoursTarget(first);
                  else showToast('No volunteers assigned to this shift yet.');
                }}>Log Hours</button>
              </div>
            </div>
          ))}
          <div className="pol-card" style={{ display: 'grid', placeItems: 'center', minHeight: 200, border: '2px dashed var(--border)', background: 'transparent' }}>
            <button className="pol-btn-primary" onClick={() => setShowCreateShift(true)}>+ Create New Shift</button>
          </div>
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="pol-card">
          <h3>Volunteer Leaderboard — Top Contributors</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 20, fontSize: '0.9rem' }}>Recognizing our most dedicated team members by hours contributed.</p>
          <div className="pol-record-list">
            {sorted.map((v, i) => (
              <div key={v.id} className="pol-record-item" style={{ cursor: 'default' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: i === 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : i === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)' : i === 2 ? 'linear-gradient(135deg, #b45309, #92400e)' : 'var(--purple-dim)', display: 'grid', placeItems: 'center', fontWeight: 700, color: i < 3 ? 'white' : 'var(--color-brand, #6B5DE6)', fontSize: '0.85rem', flexShrink: 0 }}>
                  #{i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{v.firstName} {v.lastName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{v.skills.join(', ')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-brand, #6B5DE6)' }}>{v.totalHours}h</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>since {v.joinDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddVolunteer && <AddVolunteerModal onClose={() => setShowAddVolunteer(false)} onSave={handleAddVolunteer} />}
      {showCreateShift && <CreateShiftModal onClose={() => setShowCreateShift(false)} onSave={handleCreateShift} />}
      {logHoursTarget && <LogHoursModal volunteer={logHoursTarget} onClose={() => setLogHoursTarget(null)} onSave={handleLogHours} />}
      {toast && <SuccessToast message={toast} onDismiss={() => {}} />}
    </div>
  );
}
