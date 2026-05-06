import { useState, useMemo } from 'react';
import type { CampaignEvent, EventType, TicketTier } from '../../types';
import { demoEvents } from '../../data/politicianData';

type Tab = 'list' | 'calendar' | 'new';
type DetailTab = 'overview' | 'rsvps' | 'revenue' | 'public-page';

const EVENT_TYPES: EventType[] = ['Fundraiser', 'Town Hall', 'Canvassing', 'Phone Bank', 'Rally', 'Meet & Greet', 'Debate', 'Other'];

const TYPE_ICONS: Record<EventType, string> = {
  Fundraiser: '💰',
  'Town Hall': '🏛️',
  Canvassing: '🚶',
  'Phone Bank': '📞',
  Rally: '📢',
  'Meet & Greet': '🤝',
  Debate: '⚖️',
  Other: '📅',
};

const STATUS_COLORS: Record<CampaignEvent['status'], string> = {
  draft: 'pending',
  published: 'in-progress',
  completed: 'passed',
  cancelled: 'failed',
};

function StatusBadge({ status }: { status: CampaignEvent['status'] }) {
  return <span className={`pol-badge ${STATUS_COLORS[status]}`}>{status}</span>;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function CalendarView({ events }: { events: CampaignEvent[] }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const eventsByDay: Record<number, CampaignEvent[]> = {};
  events.forEach((evt) => {
    const d = new Date(evt.date + 'T00:00:00');
    if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(evt);
    }
  });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  return (
    <div className="pol-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button className="pol-btn-ghost pol-btn-sm" onClick={prevMonth}>← Prev</button>
        <h3 style={{ margin: 0 }}>{MONTHS[viewMonth]} {viewYear}</h3>
        <button className="pol-btn-ghost pol-btn-sm" onClick={nextMonth}>Next →</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', padding: '6px 0' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((day, i) => (
          <div
            key={i}
            style={{
              minHeight: 72,
              borderRadius: 8,
              border: '1px solid var(--border)',
              padding: 6,
              background: day ? 'var(--surface)' : 'transparent',
              borderColor: day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear() ? 'var(--purple)' : 'var(--border)',
            }}
          >
            {day && (
              <>
                <div style={{ fontSize: '0.8rem', fontWeight: day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear() ? 800 : 500, color: 'var(--text)', marginBottom: 4 }}>{day}</div>
                {(eventsByDay[day] || []).map((evt) => (
                  <div key={evt.id} style={{ fontSize: '0.68rem', background: 'var(--purple-dim)', color: 'var(--purple-soft, #8B7FF0)', borderRadius: 4, padding: '2px 4px', marginBottom: 2, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {TYPE_ICONS[evt.type]} {evt.title}
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NewEventForm({ onSave, onCancel }: { onSave: (evt: CampaignEvent) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    title: '',
    type: 'Town Hall' as EventType,
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    address: '',
    capacity: '',
    description: '',
    isPublic: true,
  });
  const [tiers, setTiers] = useState<Omit<TicketTier, 'sold'>[]>([]);
  const [newTier, setNewTier] = useState({ name: '', price: '', capacity: '' });

  const isFundraiser = form.type === 'Fundraiser';

  const addTier = () => {
    if (!newTier.name || !newTier.capacity) return;
    setTiers((prev) => [
      ...prev,
      {
        id: `tier-new-${Date.now()}`,
        name: newTier.name,
        price: Number(newTier.price) || 0,
        capacity: Number(newTier.capacity),
        fecCompliant: Number(newTier.price) <= 3000,
        description: '',
      },
    ]);
    setNewTier({ name: '', price: '', capacity: '' });
  };

  const handleSave = () => {
    if (!form.title || !form.date || !form.location) return;
    const evt: CampaignEvent = {
      id: `evt-${Date.now()}`,
      title: form.title,
      type: form.type,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      location: form.location,
      address: form.address,
      capacity: Number(form.capacity) || 0,
      rsvpCount: 0,
      description: form.description,
      isPublic: form.isPublic,
      status: 'draft',
      totalRevenue: 0,
      volunteerShiftIds: [],
      tags: [form.type],
      ticketTiers: tiers.map((t) => ({ ...t, sold: 0 })),
      rsvps: [],
    };
    onSave(evt);
  };

  return (
    <div className="pol-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0 }}>Create New Event</h3>
        <button className="pol-btn-ghost pol-btn-sm" onClick={onCancel}>Cancel</button>
      </div>

      <div className="pol-field-group">
        <label>Event Title *</label>
        <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. District 42 Town Hall on Education" />
      </div>

      <div className="pol-form-row">
        <div className="pol-field-group">
          <label>Event Type</label>
          <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as EventType }))}>
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{TYPE_ICONS[t]} {t}</option>)}
          </select>
        </div>
        <div className="pol-field-group">
          <label>Visibility</label>
          <select value={form.isPublic ? 'public' : 'private'} onChange={(e) => setForm((f) => ({ ...f, isPublic: e.target.value === 'public' }))}>
            <option value="public">Public (visible on website)</option>
            <option value="private">Private (invite only)</option>
          </select>
        </div>
      </div>

      <div className="pol-form-row">
        <div className="pol-field-group">
          <label>Date *</label>
          <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
        </div>
        <div className="pol-field-group">
          <label>Start Time</label>
          <input type="time" value={form.startTime} onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))} />
        </div>
        <div className="pol-field-group">
          <label>End Time</label>
          <input type="time" value={form.endTime} onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))} />
        </div>
      </div>

      <div className="pol-form-row">
        <div className="pol-field-group">
          <label>Venue Name *</label>
          <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g. IPS Community Center" />
        </div>
        <div className="pol-field-group">
          <label>Capacity</label>
          <input type="number" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} placeholder="0 = unlimited" />
        </div>
      </div>

      <div className="pol-field-group">
        <label>Full Address</label>
        <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Street, City, State ZIP" />
      </div>

      <div className="pol-field-group">
        <label>Description</label>
        <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Event description for attendees..." style={{ minHeight: 100, resize: 'vertical' }} />
      </div>

      {isFundraiser && (
        <div style={{ marginTop: 8 }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: 12 }}>Ticket Tiers</h4>
          {tiers.map((tier, i) => (
            <div key={tier.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <strong>{tier.name}</strong>
                <span style={{ color: 'var(--muted)', marginLeft: 10, fontSize: '0.88rem' }}>${tier.price} · {tier.capacity} seats</span>
                {!tier.fecCompliant && <span className="pol-badge failed" style={{ marginLeft: 8, fontSize: '0.72rem' }}>FEC Review Required</span>}
              </div>
              <button className="pol-btn-ghost pol-btn-sm" onClick={() => setTiers((prev) => prev.filter((_, idx) => idx !== i))}>Remove</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginTop: 8 }}>
            <div className="pol-field-group" style={{ flex: 2, marginBottom: 0 }}>
              <label>Tier Name</label>
              <input value={newTier.name} onChange={(e) => setNewTier((t) => ({ ...t, name: e.target.value }))} placeholder="e.g. VIP Reception" />
            </div>
            <div className="pol-field-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Price ($)</label>
              <input type="number" value={newTier.price} onChange={(e) => setNewTier((t) => ({ ...t, price: e.target.value }))} placeholder="0" />
            </div>
            <div className="pol-field-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Capacity</label>
              <input type="number" value={newTier.capacity} onChange={(e) => setNewTier((t) => ({ ...t, capacity: e.target.value }))} placeholder="50" />
            </div>
            <button className="pol-btn-secondary pol-btn-sm" style={{ marginBottom: 0 }} onClick={addTier}>+ Add Tier</button>
          </div>
          {tiers.some((t) => !t.fecCompliant) && (
            <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '0.85rem', color: '#ef4444' }}>
              ⚠️ One or more ticket tiers have a price that may trigger FEC review. Contributions above $3,000 may exceed Indiana state limits. Consult your campaign treasurer.
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        <button className="pol-btn-primary pol-btn-sm" onClick={handleSave} disabled={!form.title || !form.date || !form.location}>Save as Draft</button>
        <button className="pol-btn-ghost pol-btn-sm" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function EventDetail({ event }: { event: CampaignEvent }) {
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');

  const totalCapacity = event.ticketTiers.reduce((s, t) => s + t.capacity, 0) || event.capacity;
  const fillPct = totalCapacity > 0 ? Math.round((event.rsvpCount / totalCapacity) * 100) : 0;

  return (
    <div className="pol-card">
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={{ fontSize: '1.2rem' }}>{TYPE_ICONS[event.type]}</span>
          <span className="pol-badge in-progress">{event.type}</span>
          <StatusBadge status={event.status} />
          {!event.isPublic && <span className="pol-badge pending">Private</span>}
        </div>
        <h3 style={{ margin: 0 }}>{event.title}</h3>
        <div style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 6 }}>
          📅 {event.date} · {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}<br />
          📍 {event.location}{event.address ? `, ${event.address}` : ''}
        </div>
      </div>

      <div className="pol-tab-row" style={{ marginBottom: 16 }}>
        {(['overview', 'rsvps', 'revenue', 'public-page'] as DetailTab[]).map((t) => (
          <button key={t} className={`pol-tab${detailTab === t ? ' active' : ''}`} onClick={() => setDetailTab(t)} style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
            {t === 'overview' ? 'Overview' : t === 'rsvps' ? `RSVPs (${event.rsvpCount})` : t === 'revenue' ? 'Revenue' : 'Public Page'}
          </button>
        ))}
      </div>

      {detailTab === 'overview' && (
        <div>
          <div className="pol-card-dark" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <div>
                <div className="pol-stat-label">RSVPs</div>
                <div className="pol-stat-value">{event.rsvpCount}</div>
                <div className="pol-stat-sub">of {totalCapacity || '∞'} capacity</div>
              </div>
              {event.totalRevenue > 0 && (
                <div>
                  <div className="pol-stat-label">Revenue</div>
                  <div className="pol-stat-value">${event.totalRevenue.toLocaleString()}</div>
                </div>
              )}
              <div>
                <div className="pol-stat-label">Fill Rate</div>
                <div className="pol-stat-value">{totalCapacity > 0 ? `${fillPct}%` : '—'}</div>
              </div>
            </div>
          </div>

          {totalCapacity > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 6 }}>
                <span>Registration progress</span><span>{fillPct}%</span>
              </div>
              <div style={{ height: 8, background: 'var(--border)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(fillPct, 100)}%`, background: 'var(--grad-purple)', borderRadius: 999, transition: 'width 0.4s ease' }} />
              </div>
            </div>
          )}

          {event.description && (
            <div style={{ marginBottom: 16 }}>
              <div className="info-label" style={{ marginBottom: 6 }}>Event Description</div>
              <p style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.6 }}>{event.description}</p>
            </div>
          )}

          {event.ticketTiers.length > 0 && (
            <div>
              <div className="info-label" style={{ marginBottom: 8 }}>Ticket Tiers</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {event.ticketTiers.map((tier) => (
                  <div key={tier.id} style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '0.9rem' }}>{tier.name}</strong>
                      {tier.description && <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{tier.description}</div>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--purple-soft, #8B7FF0)' }}>${tier.price === 0 ? 'Free' : tier.price.toLocaleString()}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{tier.sold}/{tier.capacity} sold</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
            <button className="pol-btn-primary pol-btn-sm">Edit Event</button>
            <button className="pol-btn-secondary pol-btn-sm">📤 Export RSVPs</button>
            {event.status === 'published' && <button className="pol-btn-secondary pol-btn-sm">🔗 Copy Event Link</button>}
          </div>
        </div>
      )}

      {detailTab === 'rsvps' && (
        <div>
          {event.rsvps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>📋</div>
              <p>No RSVPs recorded yet. Share the event link to start collecting registrations.</p>
            </div>
          ) : (
            <div className="pol-record-list">
              {event.rsvps.map((rsvp) => (
                <div key={rsvp.id} className="pol-record-item" style={{ cursor: 'default' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{rsvp.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{rsvp.email}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {rsvp.amountPaid > 0 && <div style={{ fontWeight: 700, color: 'var(--purple-soft, #8B7FF0)' }}>${rsvp.amountPaid.toLocaleString()}</div>}
                    <span className={`pol-badge ${rsvp.status === 'confirmed' ? 'passed' : rsvp.status === 'waitlist' ? 'warning' : 'failed'}`}>{rsvp.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {detailTab === 'revenue' && (
        <div>
          <div className="pol-card-dark" style={{ marginBottom: 16 }}>
            <div className="pol-stat-label">Total Revenue</div>
            <div className="pol-stat-value">${event.totalRevenue.toLocaleString()}</div>
          </div>
          {event.ticketTiers.length > 0 ? (
            <div style={{ display: 'grid', gap: 8 }}>
              {event.ticketTiers.map((tier) => {
                const tierRevenue = tier.price * tier.sold;
                return (
                  <div key={tier.id} style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{tier.name}</strong>
                      <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{tier.sold} × ${tier.price.toLocaleString()}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--purple-soft, #8B7FF0)' }}>${tierRevenue.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No ticket tiers configured. Revenue tracking requires ticket tiers.</p>
          )}
        </div>
      )}

      {detailTab === 'public-page' && (
        <div>
          {event.isPublic ? (
            <div>
              <div style={{ padding: '14px 16px', borderRadius: 10, background: 'var(--purple-dim)', border: '1px solid var(--navy-border)', marginBottom: 16 }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 4 }}>PUBLIC EVENT URL</div>
                <div style={{ fontWeight: 600, color: 'var(--purple-soft, #8B7FF0)', fontSize: '0.9rem' }}>
                  williamsd42.com/events/{event.id}
                </div>
              </div>
              <div style={{ padding: '20px', borderRadius: 12, border: '2px dashed var(--border)', marginBottom: 16 }}>
                <h4 style={{ margin: '0 0 8px' }}>Preview: Public Event Page</h4>
                <h2 style={{ margin: '0 0 8px', fontSize: '1.3rem' }}>{event.title}</h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: '0 0 8px' }}>
                  📅 {event.date} · {event.startTime}<br />
                  📍 {event.location}
                </p>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text)' }}>{event.description}</p>
                <div style={{ marginTop: 12, display: 'inline-block', padding: '8px 20px', borderRadius: 999, background: 'var(--grad-purple)', color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
                  RSVP Now
                </div>
                <div style={{ marginTop: 16, fontSize: '0.75rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                  Paid for by Williams for Indiana House. Sandra K. Moore, Treasurer.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="pol-btn-secondary pol-btn-sm">🔗 Copy Link</button>
                <button className="pol-btn-secondary pol-btn-sm">📤 Share on Social</button>
                <button className="pol-btn-secondary pol-btn-sm">📧 Email to List</button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔒</div>
              <p>This event is set to Private. Change visibility to Public to enable the public event page.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PoliticianEvents() {
  const [tab, setTab] = useState<Tab>('list');
  const [events, setEvents] = useState<CampaignEvent[]>(demoEvents);
  const [selectedEvent, setSelectedEvent] = useState<CampaignEvent | null>(null);
  const [filterType, setFilterType] = useState<EventType | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<CampaignEvent['status'] | 'All'>('All');

  const filtered = useMemo(() =>
    events.filter((e) =>
      (filterType === 'All' || e.type === filterType) &&
      (filterStatus === 'All' || e.status === filterStatus)
    ),
    [events, filterType, filterStatus]
  );

  const upcoming = events.filter((e) => new Date(e.date) >= new Date() && e.status !== 'cancelled');
  const completed = events.filter((e) => e.status === 'completed');
  const totalRevenue = events.reduce((s, e) => s + e.totalRevenue, 0);
  const totalRSVPs = events.reduce((s, e) => s + e.rsvpCount, 0);

  const handleNewEvent = (evt: CampaignEvent) => {
    setEvents((prev) => [evt, ...prev]);
    setSelectedEvent(evt);
    setTab('list');
  };

  return (
    <div>
      <div className="pol-page-header">
        <h1>📅 Event Management</h1>
        <p>Create, manage, and track fundraisers, town halls, canvassing events, and more. Monitor RSVPs and revenue in one place.</p>
        <div className="pol-header-actions">
          <button className="pol-btn-primary pol-btn-sm" onClick={() => setTab('new')}>+ Create Event</button>
          <button className="pol-btn-secondary pol-btn-sm" onClick={() => setTab('calendar')}>📆 Calendar View</button>
          <button className="pol-btn-secondary pol-btn-sm">📤 Export All</button>
        </div>
      </div>

      <div className="pol-stat-grid" style={{ marginBottom: 20 }}>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Upcoming Events</span>
          <span className="pol-stat-value">{upcoming.length}</span>
          <span className="pol-stat-sub">Scheduled ahead</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Total RSVPs</span>
          <span className="pol-stat-value">{totalRSVPs}</span>
          <span className="pol-stat-sub">Across all events</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Events Completed</span>
          <span className="pol-stat-value">{completed.length}</span>
          <span className="pol-stat-sub">This cycle</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Event Revenue</span>
          <span className="pol-stat-value">${totalRevenue.toLocaleString()}</span>
          <span className="pol-stat-sub">From fundraisers</span>
        </div>
      </div>

      <div className="pol-tab-row">
        {(['list', 'calendar'] as const).map((t) => (
          <button key={t} className={`pol-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'list' ? '📋 Event List' : '📆 Calendar'}
          </button>
        ))}
        {tab === 'new' && <button className="pol-tab active">✏️ New Event</button>}
      </div>

      {tab === 'new' && (
        <NewEventForm onSave={handleNewEvent} onCancel={() => setTab('list')} />
      )}

      {tab === 'calendar' && <CalendarView events={events} />}

      {tab === 'list' && (
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as EventType | 'All')}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.88rem' }}
            >
              <option value="All">All Types</option>
              {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as CampaignEvent['status'] | 'All')}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.88rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="pol-sidebar-layout" style={{ alignItems: 'start' }}>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div className="pol-record-list">
                {filtered.length === 0 && (
                  <div className="pol-card" style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>No events match current filters.</div>
                )}
                {filtered.map((evt) => (
                  <div
                    key={evt.id}
                    className={`pol-record-item${selectedEvent?.id === evt.id ? ' selected' : ''}`}
                    onClick={() => setSelectedEvent(evt)}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1rem' }}>{TYPE_ICONS[evt.type]}</span>
                        <span style={{ fontWeight: 700, color: 'var(--purple-soft, #8B7FF0)', fontSize: '0.82rem' }}>{evt.type}</span>
                        <StatusBadge status={evt.status} />
                        {!evt.isPublic && <span className="pol-badge pending" style={{ fontSize: '0.7rem' }}>Private</span>}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 4 }}>
                        📅 {evt.date} · 📍 {evt.location}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, color: 'var(--purple-soft, #8B7FF0)' }}>{evt.rsvpCount} RSVPs</div>
                      {evt.totalRevenue > 0 && <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>${evt.totalRevenue.toLocaleString()}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ minWidth: 0 }}>
              {selectedEvent ? (
                <EventDetail event={selectedEvent} />
              ) : (
                <div className="pol-card" style={{ display: 'grid', placeItems: 'center', minHeight: 300, color: 'var(--muted)', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>📅</div>
                    <p>Select an event to view details, RSVPs, and revenue breakdown.</p>
                    <button className="pol-btn-primary pol-btn-sm" style={{ marginTop: 12 }} onClick={() => setTab('new')}>+ Create Your First Event</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
