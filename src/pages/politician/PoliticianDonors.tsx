import { useState, useMemo } from 'react';
import type { DonorFull, Contribution } from '../../types';
import {
  demoDonors,
  demoContributions,
} from '../../data/politicianData';

type Tab = 'crm' | 'contributions' | 'compliance' | 'reports';
type FilterStatus = 'all' | 'active' | 'lapsed' | 'maxed-out';

const STATE_LIMIT = 3000;
const FEDERAL_LIMIT = 3300;
const EMPLOYER_THRESHOLD = 200;

const CONTRIBUTION_METHODS = ['check', 'card', 'online', 'in-kind'] as const;
const JURISDICTIONS = ['State', 'Federal'] as const;

function TagBadge({ tag }: { tag: string }) {
  const cls =
    tag === 'Major Donor' ? 'major' :
    tag === 'Volunteer' ? 'volunteer-tag' :
    tag === 'In-Kind' ? 'in-kind-tag' :
    tag === 'PAC' ? 'pac-tag' :
    tag === 'Recurring' ? 'recurring-tag' : 'pending';
  return <span className={`pol-badge ${cls}`}>{tag}</span>;
}

interface AddDonorModal {
  show: boolean;
  onClose: () => void;
  onSave: (d: DonorFull) => void;
}

function AddDonorModal({ show, onClose, onSave }: AddDonorModal) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: 'IN', zip: '',
    employer: '', occupation: '', notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!show) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.zip.trim()) e.zip = 'Required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const donor: DonorFull = {
      id: `don-${Date.now()}`,
      ...form,
      tags: [],
      createdAt: new Date().toISOString().slice(0, 10),
      totalContributions: 0,
      cycleTotal: 0,
      status: 'active',
    };
    onSave(donor);
    onClose();
  };

  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Donor</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {(['firstName', 'lastName', 'email', 'phone', 'employer', 'occupation'] as const).map((key) => (
              <div className="pol-field-group" key={key}>
                <label>{key === 'firstName' ? 'First Name' : key === 'lastName' ? 'Last Name' : key === 'email' ? 'Email' : key === 'phone' ? 'Phone' : key === 'employer' ? 'Employer' : 'Occupation'}</label>
                <input value={form[key]} onChange={f(key)} />
                {errors[key] && <span className="pol-field-error">{errors[key]}</span>}
              </div>
            ))}
            <div className="pol-field-group form-span-full">
              <label>Address</label>
              <input value={form.address} onChange={f('address')} />
              {errors.address && <span className="pol-field-error">{errors.address}</span>}
            </div>
            <div className="pol-field-group">
              <label>City</label>
              <input value={form.city} onChange={f('city')} />
              {errors.city && <span className="pol-field-error">{errors.city}</span>}
            </div>
            <div className="pol-field-group">
              <label>ZIP</label>
              <input value={form.zip} onChange={f('zip')} />
              {errors.zip && <span className="pol-field-error">{errors.zip}</span>}
            </div>
            <div className="pol-field-group form-span-full">
              <label>Notes</label>
              <textarea value={form.notes} onChange={f('notes')} style={{ minHeight: 80 }} />
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

interface AddContributionModal {
  show: boolean;
  donor: DonorFull | null;
  onClose: () => void;
  onSave: (c: Contribution) => void;
}

function AddContributionModal({ show, donor, onClose, onSave }: AddContributionModal) {
  const [form, setForm] = useState({
    amount: '',
    method: 'card' as typeof CONTRIBUTION_METHODS[number],
    jurisdiction: 'State' as typeof JURISDICTIONS[number],
    isInKind: false,
    inKindDesc: '',
    inKindFMV: '',
    acknowledged: false,
  });
  const [violation, setViolation] = useState<string | null>(null);
  const [hardStop, setHardStop] = useState(false);

  if (!show || !donor) return null;

  const limit = form.jurisdiction === 'State' ? STATE_LIMIT : FEDERAL_LIMIT;
  const cycleTotal = donor.cycleTotal;

  const checkCompliance = (amt: number) => {
    const newCycle = cycleTotal + amt;
    if (newCycle > limit) return { status: 'violation' as const, reason: `Contribution of $${amt.toLocaleString()} would bring cycle total to $${newCycle.toLocaleString()}, exceeding the ${form.jurisdiction} limit of $${limit.toLocaleString()}.` };
    if (newCycle > limit * 0.9) return { status: 'warning' as const, reason: `Cycle total ($${newCycle.toLocaleString()}) approaches the ${form.jurisdiction} limit of $${limit.toLocaleString()}.` };
    if (amt >= EMPLOYER_THRESHOLD && !donor.employer.trim()) return { status: 'warning' as const, reason: `Employer/occupation required for contributions ≥ $${EMPLOYER_THRESHOLD} (FEC rule).` };
    return { status: 'compliant' as const, reason: '' };
  };

  const handleAmountChange = (val: string) => {
    const amt = Number(val);
    if (amt > 0) {
      const check = checkCompliance(amt);
      if (check.status === 'violation') {
        setViolation(check.reason);
        setHardStop(true);
      } else if (check.status === 'warning') {
        setViolation(check.reason);
        setHardStop(false);
      } else {
        setViolation(null);
        setHardStop(false);
      }
    }
    setForm((p) => ({ ...p, amount: val }));
  };

  const handleSave = () => {
    if (!form.amount || Number(form.amount) <= 0) return;
    if (hardStop) return;

    const amt = Number(form.amount);
    const check = checkCompliance(amt);
    const c: Contribution = {
      id: `con-${Date.now()}`,
      donorId: donor.id,
      donorName: `${donor.firstName} ${donor.lastName}`,
      amount: amt,
      date: new Date().toISOString().slice(0, 10),
      method: form.method,
      isInKind: form.isInKind,
      inKindDescription: form.inKindDesc || undefined,
      inKindFairMarketValue: form.inKindFMV ? Number(form.inKindFMV) : undefined,
      electionCycle: '2024',
      jurisdictionType: form.jurisdiction,
      complianceStatus: check.status,
      violationReason: check.reason || undefined,
      refundStatus: 'none',
      prohibitedSourceAcknowledged: form.acknowledged,
      auditLog: [{ timestamp: new Date().toISOString(), user: 'Campaign Staff', action: 'created', details: 'Contribution recorded via dashboard' }],
    };
    onSave(c);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content${hardStop ? ' pol-violation-modal' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Record Contribution — {donor.firstName} {donor.lastName}</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 16, padding: '10px 14px', background: 'var(--surfaceSoft, #f1f5f9)', borderRadius: 10 }}>
            Cycle total so far: <strong>${cycleTotal.toLocaleString()}</strong> / {form.jurisdiction} limit: <strong>${limit.toLocaleString()}</strong>
          </div>

          {hardStop && violation && (
            <div className="pol-violation-banner">
              {violation}
              <div style={{ fontWeight: 400, fontSize: '0.8rem', marginTop: 4 }}>This contribution cannot be saved. Process a refund for the over-limit portion.</div>
            </div>
          )}
          {!hardStop && violation && (
            <div className="pol-alert warning" style={{ marginBottom: 16 }}>
              <span className="pol-alert-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </span>
              <div className="pol-alert-body"><strong>Warning</strong><p>{violation}</p></div>
            </div>
          )}

          <div className="form-grid">
            <div className="pol-field-group">
              <label>Amount ($)</label>
              <input type="number" min="1" step="50" value={form.amount} onChange={(e) => handleAmountChange(e.target.value)} style={{ borderColor: hardStop ? '#f87171' : undefined }} />
            </div>
            <div className="pol-field-group">
              <label>Method</label>
              <select value={form.method} onChange={(e) => setForm((p) => ({ ...p, method: e.target.value as typeof CONTRIBUTION_METHODS[number] }))}>
                {CONTRIBUTION_METHODS.map((m) => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
              </select>
            </div>
            <div className="pol-field-group">
              <label>Jurisdiction</label>
              <select value={form.jurisdiction} onChange={(e) => setForm((p) => ({ ...p, jurisdiction: e.target.value as typeof JURISDICTIONS[number] }))}>
                {JURISDICTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div className="pol-field-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 28 }}>
              <input type="checkbox" id="inkind-check" checked={form.isInKind} onChange={(e) => setForm((p) => ({ ...p, isInKind: e.target.checked }))} style={{ width: 'auto' }} />
              <label htmlFor="inkind-check" style={{ marginBottom: 0 }}>In-Kind Contribution</label>
            </div>
            {form.isInKind && (
              <>
                <div className="pol-field-group">
                  <label>Description</label>
                  <input value={form.inKindDesc} onChange={(e) => setForm((p) => ({ ...p, inKindDesc: e.target.value }))} />
                </div>
                <div className="pol-field-group">
                  <label>Fair Market Value ($)</label>
                  <input type="number" value={form.inKindFMV} onChange={(e) => setForm((p) => ({ ...p, inKindFMV: e.target.value }))} />
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 12, padding: '12px 14px', background: 'rgba(107,93,230,0.06)', borderRadius: 10, border: '1px solid var(--navy-border)' }}>
            <input type="checkbox" id="ack" checked={form.acknowledged} onChange={(e) => setForm((p) => ({ ...p, acknowledged: e.target.checked }))} style={{ width: 'auto', marginTop: 3 }} />
            <label htmlFor="ack" style={{ fontSize: '0.85rem', color: 'var(--muted)', cursor: 'pointer' }}>
              I acknowledge this contribution is not from a corporation, federal contractor, foreign national, or other prohibited source.
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button className="pol-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className={hardStop ? 'pol-btn-danger' : 'pol-btn-primary'}
            onClick={handleSave}
            disabled={hardStop || !form.acknowledged}
          >
            {hardStop ? 'Blocked — Over Limit' : 'Record Contribution'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PoliticianDonors() {
  const [tab, setTab] = useState<Tab>('crm');
  const [donors, setDonors] = useState<DonorFull[]>(demoDonors);
  const [contributions, setContributions] = useState<Contribution[]>(demoContributions);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedDonor, setSelectedDonor] = useState<DonorFull | null>(null);
  const [showAddDonor, setShowAddDonor] = useState(false);
  const [showAddContrib, setShowAddContrib] = useState(false);
  const [contribDonor, setContribDonor] = useState<DonorFull | null>(null);

  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      const name = `${d.firstName} ${d.lastName}`.toLowerCase();
      const matchSearch = !search || name.includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || d.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [donors, search, filterStatus]);

  const totalRaised = useMemo(() => contributions.reduce((s, c) => s + c.amount, 0), [contributions]);
  const violationCount = useMemo(() => contributions.filter((c) => c.complianceStatus === 'violation').length, [contributions]);
  const warningCount = useMemo(() => contributions.filter((c) => c.complianceStatus === 'warning').length, [contributions]);

  const donorContributions = useMemo(() => {
    if (!selectedDonor) return [];
    return contributions.filter((c) => c.donorId === selectedDonor.id);
  }, [contributions, selectedDonor]);

  const handleAddDonor = (d: DonorFull) => {
    setDonors((prev) => [d, ...prev]);
  };

  const handleAddContribution = (c: Contribution) => {
    setContributions((prev) => [c, ...prev]);
    setDonors((prev) =>
      prev.map((d) =>
        d.id === c.donorId
          ? { ...d, totalContributions: d.totalContributions + c.amount, cycleTotal: d.cycleTotal + c.amount }
          : d
      )
    );
  };

  const openAddContrib = (donor: DonorFull) => {
    setContribDonor(donor);
    setShowAddContrib(true);
  };

  const handleRefund = (contribId: string) => {
    setContributions((prev) =>
      prev.map((c) => c.id === contribId ? { ...c, refundStatus: 'refunded' as const, complianceStatus: 'compliant' as const } : c)
    );
  };

  return (
    <div>
      <div className="pol-page-header">
        <div className="pol-header-left">
          <h1>Donor Management</h1>
          <p>Donor CRM with real-time contribution limit enforcement and FEC reporting.</p>
        </div>
        <div className="pol-header-actions">
          <button className="pol-btn-secondary pol-btn-sm">Import CSV</button>
          <button className="pol-btn-secondary pol-btn-sm">Export FEC Report</button>
          <button className="pol-btn-primary pol-btn-sm" onClick={() => setShowAddDonor(true)}>Add Donor</button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="pol-stat-grid" style={{ marginBottom: 20 }}>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Total Raised (Cycle)</span>
          <span className="pol-stat-value">${(totalRaised / 1000).toFixed(1)}K</span>
          <span className="pol-stat-sub">{contributions.length} contributions</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Active Donors</span>
          <span className="pol-stat-value">{donors.filter((d) => d.status === 'active').length}</span>
          <span className="pol-stat-sub">{donors.filter((d) => d.status === 'maxed-out').length} maxed-out</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Compliance Issues</span>
          <span className="pol-stat-value" style={{ color: violationCount > 0 ? '#f87171' : undefined }}>
            {violationCount}
          </span>
          <span className="pol-stat-sub">{warningCount} warnings</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Avg Contribution</span>
          <span className="pol-stat-value">${contributions.length ? Math.round(totalRaised / contributions.length).toLocaleString() : 0}</span>
          <span className="pol-stat-sub">Per contribution</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="pol-tab-row">
        {(['crm', 'contributions', 'compliance', 'reports'] as Tab[]).map((t) => (
          <button key={t} className={`pol-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'crm' ? 'Donor CRM' : t === 'contributions' ? 'Contributions' : t === 'compliance' ? 'Compliance' : 'FEC Reports'}
          </button>
        ))}
      </div>

      {/* CRM Tab */}
      {tab === 'crm' && (
        <div className="pol-sidebar-layout">
          {/* Donor List — left column; min-width prevents long names from overflowing the 320px track */}
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div className="pol-search-bar">
              <div className="pol-search-wrapper">
                <input
                  className="pol-search-input"
                  placeholder="Search donors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.88rem' }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="lapsed">Lapsed</option>
                <option value="maxed-out">Maxed-Out</option>
              </select>
            </div>

            <div className="pol-record-list">
              {filteredDonors.map((donor) => (
                <div
                  key={donor.id}
                  className={`pol-record-item${selectedDonor?.id === donor.id ? ' selected' : ''}`}
                  onClick={() => setSelectedDonor(donor)}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.95rem' }}>
                      {donor.firstName} {donor.lastName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>
                      {donor.employer} · {donor.city}, {donor.state}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                      {donor.tags.slice(0, 3).map((tag) => <TagBadge key={tag} tag={tag} />)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-brand, #6B5DE6)', fontSize: '0.95rem' }}>
                      ${donor.cycleTotal.toLocaleString()}
                    </div>
                    <span className={`pol-badge ${donor.status}`} style={{ marginTop: 4, display: 'inline-flex' }}>
                      {donor.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donor Detail — minWidth: 0 prevents the right column from overflowing its grid track */}
          <div style={{ minWidth: 0 }}>
            {selectedDonor ? (
              <div className="pol-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ marginBottom: 4 }}>{selectedDonor.firstName} {selectedDonor.lastName}</h3>
                    <div style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{selectedDonor.email} · {selectedDonor.phone}</div>
                  </div>
                  <button className="pol-btn-primary pol-btn-sm" onClick={() => openAddContrib(selectedDonor)}>
                    + Record Contribution
                  </button>
                </div>

                {/* Cycle Aggregation */}
                <div className="pol-card-dark" style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>2024 Cycle Total</span>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>State Limit: ${STATE_LIMIT.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: selectedDonor.cycleTotal > STATE_LIMIT ? '#f87171' : '#8B7FF0' }}>
                      ${selectedDonor.cycleTotal.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
                      {Math.round((selectedDonor.cycleTotal / STATE_LIMIT) * 100)}% of limit
                    </span>
                  </div>
                  <div className="pol-progress-track">
                    <div
                      className={`pol-progress-fill${selectedDonor.cycleTotal > STATE_LIMIT ? ' over-budget' : selectedDonor.cycleTotal > STATE_LIMIT * 0.8 ? ' near-limit' : ''}`}
                      style={{ width: `${Math.min(100, (selectedDonor.cycleTotal / STATE_LIMIT) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="form-grid" style={{ marginBottom: 16 }}>
                  <div><span className="info-label">Employer</span><strong>{selectedDonor.employer || '—'}</strong></div>
                  <div><span className="info-label">Occupation</span><strong>{selectedDonor.occupation || '—'}</strong></div>
                  <div><span className="info-label">Address</span><strong>{selectedDonor.address}, {selectedDonor.city} {selectedDonor.state} {selectedDonor.zip}</strong></div>
                  <div><span className="info-label">Donor Since</span><strong>{selectedDonor.createdAt}</strong></div>
                </div>

                {/* Tags */}
                <div style={{ marginBottom: 16 }}>
                  <span className="info-label">Tags</span>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                    {selectedDonor.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
                    {selectedDonor.tags.length === 0 && <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No tags</span>}
                  </div>
                </div>

                {/* Notes */}
                {selectedDonor.notes && (
                  <div style={{ marginBottom: 16 }}>
                    <span className="info-label">Notes</span>
                    <p style={{ color: 'var(--text)', fontSize: '0.9rem', margin: '6px 0 0' }}>{selectedDonor.notes}</p>
                  </div>
                )}

                {/* Contribution History */}
                <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem' }}>Contribution History</h4>
                {donorContributions.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>No contributions recorded yet.</p>
                ) : (
                  <div className="pol-record-list">
                    {donorContributions.map((c) => (
                      <div key={c.id} className={`pol-record-item${c.complianceStatus === 'violation' ? ' violation-row' : c.complianceStatus === 'warning' ? ' warning-row' : ''}`} style={{ cursor: 'default' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>${c.amount.toLocaleString()} · {c.method} · {c.date}</div>
                          {c.violationReason && <div style={{ fontSize: '0.78rem', color: 'var(--color-danger)', marginTop: 2 }}>{c.violationReason}</div>}
                          {c.isInKind && <div style={{ fontSize: '0.78rem', color: 'var(--color-success)', marginTop: 2 }}>In-kind: {c.inKindDescription}</div>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                          <span className={`pol-badge ${c.complianceStatus}`}>{c.complianceStatus}</span>
                          {c.complianceStatus === 'violation' && c.refundStatus !== 'refunded' && (
                            <button className="pol-btn-danger pol-btn-sm" onClick={() => handleRefund(c.id)}>Process Refund</button>
                          )}
                          {c.refundStatus === 'refunded' && <span style={{ fontSize: '0.78rem', color: 'var(--color-success)', fontWeight: 600 }}>Refunded</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="pol-card" style={{ display: 'grid', placeItems: 'center', minHeight: 300, textAlign: 'center' }}>
                <div>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', margin: 0 }}>Select a donor to view their profile, contribution history, and compliance status.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contributions Tab */}
      {tab === 'contributions' && (
        <div>
          {violationCount > 0 && (
            <div className="pol-violation-banner" style={{ marginBottom: 16 }}>
              {violationCount} contribution(s) have compliance violations requiring action before filing.
            </div>
          )}
          <div className="pol-card">
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Donor</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Jurisdiction</th>
                    <th>Status</th>
                    <th>Refund</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.map((c) => (
                    <tr key={c.id} className={c.complianceStatus === 'violation' ? 'row-warning' : ''}>
                      <td>{c.donorName}</td>
                      <td style={{ fontWeight: 600 }}>${c.amount.toLocaleString()}{c.isInKind && ' (IK)'}</td>
                      <td>{c.date}</td>
                      <td>{c.method}</td>
                      <td>{c.jurisdictionType}</td>
                      <td><span className={`pol-badge ${c.complianceStatus}`}>{c.complianceStatus}</span></td>
                      <td>
                        {c.refundStatus === 'refunded' ? <span style={{ color: 'var(--color-success)', fontSize: '0.8rem', fontWeight: 600 }}>Refunded</span> :
                         c.refundStatus === 'pending' ? <span style={{ color: 'var(--color-warning)', fontSize: '0.8rem' }}>Pending</span> :
                         <span style={{ color: 'var(--color-gray-400)', fontSize: '0.8rem' }}>—</span>}
                      </td>
                      <td>
                        {c.complianceStatus === 'violation' && c.refundStatus !== 'refunded' && (
                          <button className="pol-btn-danger pol-btn-sm" onClick={() => handleRefund(c.id)}>Refund</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {tab === 'compliance' && (
        <div className="pol-grid-2">
          <div className="pol-card">
            <h3>Contribution Limit Status</h3>
            <div style={{ marginBottom: 16, padding: '12px 14px', background: 'var(--purple-dim, rgba(107,93,230,0.12))', borderRadius: 12, border: '1px solid var(--navy-border)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Indiana State Limit (Individual)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-brand, #6B5DE6)' }}>${STATE_LIMIT.toLocaleString()}</div>
            </div>
            <div className="pol-record-list">
              {donors.filter((d) => d.cycleTotal > 0).sort((a, b) => b.cycleTotal - a.cycleTotal).map((donor) => {
                const pct = (donor.cycleTotal / STATE_LIMIT) * 100;
                const isOver = donor.cycleTotal > STATE_LIMIT;
                return (
                  <div key={donor.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{donor.firstName} {donor.lastName}</span>
                      <span style={{ fontWeight: 700, color: isOver ? '#f87171' : 'var(--color-brand, #6B5DE6)', fontSize: '0.92rem' }}>
                        ${donor.cycleTotal.toLocaleString()} {isOver && '!'}
                      </span>
                    </div>
                    <div className="pol-progress-track">
                      <div
                        className={`pol-progress-fill${isOver ? ' over-budget' : pct > 80 ? ' near-limit' : ''}`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 4 }}>
                      {Math.round(pct)}% of limit used
                      {isOver && <span style={{ color: 'var(--danger-solid)' }}> — OVER LIMIT</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pol-card">
            <h3>Compliance Checklist</h3>
            <div className="pol-record-list">
              <div className={`pol-record-item${violationCount > 0 ? ' violation-row' : ''}`} style={{ cursor: 'default' }}>
                <div style={{ fontSize: '0.875rem' }}>Over-limit contributions</div>
                <span className={`pol-badge ${violationCount > 0 ? 'violation' : 'compliant'}`}>{violationCount} issues</span>
              </div>
              <div className={`pol-record-item${warningCount > 0 ? ' warning-row' : ''}`} style={{ cursor: 'default' }}>
                <div style={{ fontSize: '0.875rem' }}>Near-limit warnings</div>
                <span className={`pol-badge ${warningCount > 0 ? 'warning' : 'compliant'}`}>{warningCount} issues</span>
              </div>
              <div className="pol-record-item" style={{ cursor: 'default' }}>
                <div style={{ fontSize: '0.875rem' }}>Missing employer/occupation (≥$200)</div>
                <span className="pol-badge warning">2 donors</span>
              </div>
              <div className="pol-record-item" style={{ cursor: 'default' }}>
                <div style={{ fontSize: '0.875rem' }}>Prohibited source checks</div>
                <span className="pol-badge compliant">All clear</span>
              </div>
              <div className="pol-record-item" style={{ cursor: 'default' }}>
                <div style={{ fontSize: '0.875rem' }}>In-kind contributions documented</div>
                <span className="pol-badge compliant">2 on file</span>
              </div>
            </div>

            <h3 style={{ marginTop: 24 }}>Audit Log</h3>
            <div style={{ maxHeight: 240, overflowY: 'auto' }}>
              {contributions
                .flatMap((c) => c.auditLog.map((e) => ({ ...e, donor: c.donorName, amount: c.amount })))
                .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
                .slice(0, 15)
                .map((entry, i) => (
                  <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.83rem' }}>
                    <div style={{ color: 'var(--text)', fontWeight: 600 }}>{entry.action.toUpperCase()} — {entry.donor}</div>
                    <div style={{ color: 'var(--muted)', marginTop: 2 }}>{entry.details}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.76rem', marginTop: 2 }}>{entry.timestamp} · {entry.user}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {tab === 'reports' && (
        <div className="pol-grid-2">
          <div className="pol-card">
            <h3>FEC Report Generator</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 20 }}>Generate jurisdiction-specific filing reports from your contribution data.</p>

            <div className="pol-field-group">
              <label>Report Type</label>
              <select>
                <option>State Equivalent (Indiana)</option>
                <option>FEC Form 3 (House)</option>
                <option>FEC Form 3P (Presidential)</option>
              </select>
            </div>
            <div className="pol-field-group">
              <label>Period</label>
              <select>
                <option>Q1 2024 (Jan 1 – Mar 31)</option>
                <option>Q2 2024 (Apr 1 – Jun 30)</option>
                <option>Full Year 2024</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
              <button className="pol-btn-primary pol-btn-sm">Download CSV</button>
              <button className="pol-btn-secondary pol-btn-sm">Download PDF</button>
              <button className="pol-btn-secondary pol-btn-sm">Download .FEC</button>
            </div>

            <div style={{ marginTop: 24 }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: 12 }}>Schedule A — Itemized Receipts</h4>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ fontSize: '0.83rem' }}>
                  <thead><tr><th>Donor</th><th>Amount</th><th>Date</th><th>Method</th><th>Employer</th></tr></thead>
                  <tbody>
                    {contributions.filter((c) => c.complianceStatus !== 'violation').slice(0, 8).map((c) => {
                      const donor = donors.find((d) => d.id === c.donorId);
                      return (
                        <tr key={c.id}>
                          <td>{c.donorName}</td>
                          <td>${c.amount.toLocaleString()}</td>
                          <td>{c.date}</td>
                          <td>{c.method}</td>
                          <td>{donor?.employer || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="pol-card">
            <h3>Filing Deadline Calendar</h3>
            <div className="pol-record-list" style={{ marginBottom: 20 }}>
              {[
                { label: 'Q2 Filing', date: '2024-07-15', daysOut: 71 },
                { label: 'Mid-Year Report', date: '2024-07-31', daysOut: 87 },
                { label: 'Q3 Filing', date: '2024-10-15', daysOut: 163 },
                { label: 'Year-End Report', date: '2025-01-31', daysOut: 271 },
              ].map((item) => (
                <div key={item.label} className={`pol-alert ${item.daysOut <= 30 ? 'danger' : item.daysOut <= 60 ? 'warning' : 'info'}`}>
                  <span className="pol-alert-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </span>
                  <div className="pol-alert-body">
                    <strong>{item.label} — Due {item.date}</strong>
                    <p>{item.daysOut} days away</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <AddDonorModal show={showAddDonor} onClose={() => setShowAddDonor(false)} onSave={handleAddDonor} />
      <AddContributionModal show={showAddContrib} donor={contribDonor} onClose={() => setShowAddContrib(false)} onSave={handleAddContribution} />
    </div>
  );
}
