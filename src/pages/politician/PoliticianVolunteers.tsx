import { useState, useMemo } from 'react';
import type { Volunteer, Shift } from '../../types';
import { demoVolunteers, demoShifts } from '../../data/politicianData';

type Tab = 'roster' | 'shifts' | 'leaderboard';

export function PoliticianVolunteers() {
  const [tab, setTab] = useState<Tab>('roster');
  const [volunteers, setVolunteers] = useState<Volunteer[]>(demoVolunteers);
  const [shifts] = useState<Shift[]>(demoShifts);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [search, setSearch] = useState('');

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

  const logHours = (volunteerId: string, hours: number) => {
    setVolunteers((prev) =>
      prev.map((v) => v.id === volunteerId ? { ...v, totalHours: v.totalHours + hours } : v)
    );
  };

  return (
    <div>
      <div className="pol-page-header">
        <h1>🤝 Volunteer Management</h1>
        <p>Recruit, schedule, and recognize your volunteer team. Track hours and keep your ground game organized.</p>
        <div className="pol-header-actions">
          <button className="pol-btn-primary pol-btn-sm">+ Add Volunteer</button>
          <button className="pol-btn-secondary pol-btn-sm">+ Create Shift</button>
          <button className="pol-btn-secondary pol-btn-sm">📤 Export List</button>
          <button className="pol-btn-secondary pol-btn-sm">📋 Recruitment Form</button>
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
          <span className="pol-stat-sub">Upcoming & past</span>
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
            {t === 'roster' ? '👥 Volunteer Roster' : t === 'shifts' ? '🗓️ Shifts' : '🏆 Leaderboard'}
          </button>
        ))}
      </div>

      {tab === 'roster' && (
        <div className="pol-sidebar-layout">
          <div>
            <div className="pol-search-bar">
              <div className="pol-search-wrapper" style={{ flex: 1 }}>
                <span className="pol-search-icon">🔍</span>
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
                    <div style={{ fontWeight: 700, color: 'var(--purple-soft, #8B7FF0)' }}>{v.totalHours}h</div>
                    <span className={`pol-badge ${v.status}`} style={{ marginTop: 4, display: 'inline-flex' }}>{v.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {selectedVolunteer ? (
              <div className="pol-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ marginBottom: 4 }}>{selectedVolunteer.firstName} {selectedVolunteer.lastName}</h3>
                    <div style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{selectedVolunteer.email} · {selectedVolunteer.phone}</div>
                  </div>
                  <button className="pol-btn-secondary pol-btn-sm" onClick={() => {
                    const h = prompt('Log hours for this volunteer:');
                    if (h && !isNaN(Number(h))) logHours(selectedVolunteer.id, Number(h));
                  }}>+ Log Hours</button>
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
                  <button className="pol-btn-secondary pol-btn-sm">📧 Send Email</button>
                  <button className="pol-btn-secondary pol-btn-sm">💬 Send SMS</button>
                  <button className="pol-btn-secondary pol-btn-sm">🗓️ Assign to Shift</button>
                </div>
              </div>
            ) : (
              <div className="pol-card" style={{ display: 'grid', placeItems: 'center', minHeight: 300, color: 'var(--muted)', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>🤝</div>
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
                <div>📅 {shift.date} · {shift.startTime} – {shift.endTime}</div>
                <div>📍 {shift.location}</div>
                <div>👥 {shift.assignedVolunteerIds.length} / {shift.capacity} volunteers</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 6 }}>Assigned Volunteers:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {shift.assignedVolunteerIds.map((vid) => {
                    const vol = volunteers.find((v) => v.id === vid);
                    return vol ? (
                      <span key={vid} style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--purple-dim, rgba(107,93,230,0.12))', color: 'var(--purple-soft, #8B7FF0)', fontSize: '0.8rem' }}>
                        {vol.firstName} {vol.lastName} ({Object.values(shift.hoursLogged)[shift.assignedVolunteerIds.indexOf(vid)]}h)
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="pol-btn-secondary pol-btn-sm">Edit Shift</button>
                <button className="pol-btn-secondary pol-btn-sm">Log Hours</button>
              </div>
            </div>
          ))}
          <div className="pol-card" style={{ display: 'grid', placeItems: 'center', minHeight: 200, border: '2px dashed var(--border)', background: 'transparent' }}>
            <button className="pol-btn-primary" onClick={() => {}}>+ Create New Shift</button>
          </div>
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="pol-card">
          <h3>🏆 Volunteer Leaderboard — Top Contributors</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 20, fontSize: '0.9rem' }}>Recognizing our most dedicated team members by hours contributed.</p>
          <div className="pol-record-list">
            {sorted.map((v, i) => (
              <div key={v.id} className="pol-record-item" style={{ cursor: 'default' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: i === 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : i === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)' : i === 2 ? 'linear-gradient(135deg, #b45309, #92400e)' : 'var(--purple-dim)', display: 'grid', placeItems: 'center', fontWeight: 700, color: i < 3 ? 'white' : 'var(--purple-soft, #8B7FF0)', fontSize: '0.85rem', flexShrink: 0 }}>
                  #{i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{v.firstName} {v.lastName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{v.skills.join(', ')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--purple-soft, #8B7FF0)' }}>{v.totalHours}h</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>since {v.joinDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
