import { useState } from 'react';
import type { Bill } from '../../types';
import { demoBills } from '../../data/politicianData';

type Tab = 'sponsored' | 'voting-record' | 'upcoming';

function BillStatusBadge({ status }: { status: Bill['status'] }) {
  return <span className={`pol-badge ${status}`}>{status.replace('-', ' ').toUpperCase()}</span>;
}

function VoteBadge({ vote }: { vote?: Bill['politicianVote'] }) {
  if (!vote) return <span className="pol-badge pending">No Vote</span>;
  return (
    <span className={`pol-badge ${vote === 'yes' ? 'passed' : vote === 'no' ? 'failed' : 'pending'}`}>
      {vote.toUpperCase()}
    </span>
  );
}

function AISummarizeButton({ bill, onSummary }: { bill: Bill; onSummary: (s: string) => void }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billTitle: bill.title, billNumber: bill.number }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onSummary(data.summary);
    } catch {
      onSummary(bill.summary || `${bill.number} (${bill.title}) — This legislation would affect Indiana residents by ${bill.status === 'passed' ? 'implementing' : 'proposing'} significant policy changes. Contact your representative for full details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="pol-ai-btn pol-btn-sm" onClick={handleClick} disabled={loading}>
      {loading ? 'Generating...' : 'Plain English Summary'}
    </button>
  );
}

export function PoliticianBills() {
  const [tab, setTab] = useState<Tab>('sponsored');
  const [bills, setBills] = useState<Bill[]>(demoBills);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [editRationale, setEditRationale] = useState('');
  const [editImpact, setEditImpact] = useState('');
  const [editMode, setEditMode] = useState(false);

  const sponsored = bills.filter((b) => b.sponsored);
  const allWithVotes = bills.filter((b) => b.politicianVote);
  const pending = bills.filter((b) => b.status === 'pending' || b.status === 'in-progress');

  const openBill = (bill: Bill) => {
    setSelectedBill(bill);
    setEditRationale(bill.voteRationale || '');
    setEditImpact(bill.impactNotes || '');
    setEditMode(false);
  };

  const saveAnnotations = () => {
    if (!selectedBill) return;
    setBills((prev) =>
      prev.map((b) => b.id === selectedBill.id ? { ...b, voteRationale: editRationale, impactNotes: editImpact } : b)
    );
    setSelectedBill((prev) => prev ? { ...prev, voteRationale: editRationale, impactNotes: editImpact } : prev);
    setEditMode(false);
  };

  const BillListItem = ({ bill }: { bill: Bill }) => (
    <div
      className={`pol-record-item${selectedBill?.id === bill.id ? ' selected' : ''}`}
      onClick={() => openBill(bill)}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontWeight: 700, color: 'var(--color-brand, #6B5DE6)', fontSize: '0.88rem' }}>{bill.number}</span>
          {bill.sponsored && <span className="pol-badge major">Sponsored</span>}
        </div>
        <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text)', marginBottom: 4 }}>{bill.title}</div>
        {bill.voteDate && <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Vote: {bill.voteDate}</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        <BillStatusBadge status={bill.status} />
        {bill.politicianVote && <VoteBadge vote={bill.politicianVote} />}
      </div>
    </div>
  );

  return (
    <div>
      <div className="pol-page-header">
        <div className="pol-header-left">
          <h1>Bills &amp; Legislation</h1>
          <p>Track your sponsored bills, voting record, and add public statements to maintain transparency with constituents.</p>
        </div>
        <div className="pol-header-actions">
          <button className="pol-btn-secondary pol-btn-sm">Sync IGA Database</button>
          <button className="pol-btn-primary pol-btn-sm">Add Bill</button>
        </div>
      </div>

      <div className="pol-stat-grid" style={{ marginBottom: 20 }}>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Sponsored Bills</span>
          <span className="pol-stat-value">{sponsored.length}</span>
          <span className="pol-stat-sub">{sponsored.filter((b) => b.status === 'passed').length} passed</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Votes Cast</span>
          <span className="pol-stat-value">{allWithVotes.length}</span>
          <span className="pol-stat-sub">{allWithVotes.filter((b) => b.politicianVote === 'yes').length} yes / {allWithVotes.filter((b) => b.politicianVote === 'no').length} no</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Bills Passed</span>
          <span className="pol-stat-value">{bills.filter((b) => b.status === 'passed').length}</span>
          <span className="pol-stat-sub">This session</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Upcoming Votes</span>
          <span className="pol-stat-value">{pending.length}</span>
          <span className="pol-stat-sub">Pending / in progress</span>
        </div>
      </div>

      <div className="pol-tab-row">
        {(['sponsored', 'voting-record', 'upcoming'] as Tab[]).map((t) => (
          <button key={t} className={`pol-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'sponsored' ? 'Sponsored Bills' : t === 'voting-record' ? 'Voting Record' : 'Upcoming Votes'}
          </button>
        ))}
      </div>

      <div className="pol-sidebar-layout">
        <div className="pol-record-list">
          {(tab === 'sponsored' ? sponsored : tab === 'voting-record' ? allWithVotes : pending).map((bill) => (
            <BillListItem key={bill.id} bill={bill} />
          ))}
          {(tab === 'sponsored' ? sponsored : tab === 'voting-record' ? allWithVotes : pending).length === 0 && (
            <div className="pol-card" style={{ color: 'var(--muted)', textAlign: 'center', padding: 32 }}>
              No bills in this category yet.
            </div>
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          {selectedBill ? (
            <div className="pol-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, color: 'var(--color-brand, #6B5DE6)', fontSize: '1.05rem' }}>{selectedBill.number}</span>
                    {selectedBill.sponsored && <span className="pol-badge major">Sponsored</span>}
                    <BillStatusBadge status={selectedBill.status} />
                    {selectedBill.politicianVote && <VoteBadge vote={selectedBill.politicianVote} />}
                  </div>
                  <h3 style={{ margin: 0 }}>{selectedBill.title}</h3>
                </div>
                <AISummarizeButton bill={selectedBill} onSummary={(s) => setBills((prev) => prev.map((b) => b.id === selectedBill.id ? { ...b, summary: s } : b))} />
              </div>

              {selectedBill.summary && (
                <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--purple-dim, rgba(107,93,230,0.08))', border: '1px solid var(--navy-border)', marginBottom: 16, fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6 }}>
                  <strong style={{ fontSize: '0.82rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>PLAIN-LANGUAGE SUMMARY</strong>
                  {selectedBill.summary}
                </div>
              )}

              {selectedBill.voteDate && (
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 16 }}>Vote Date: {selectedBill.voteDate}</div>
              )}

              {/* Vote Rationale */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Vote Rationale / Public Statement</h4>
                  <button className="pol-btn-ghost pol-btn-sm" onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                {editMode ? (
                  <textarea
                    value={editRationale}
                    onChange={(e) => setEditRationale(e.target.value)}
                    style={{ width: '100%', minHeight: 100, border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.9rem', resize: 'vertical' }}
                  />
                ) : (
                  <p style={{ color: selectedBill.voteRationale ? 'var(--text)' : 'var(--muted)', fontSize: '0.9rem', fontStyle: !selectedBill.voteRationale ? 'italic' : 'normal', lineHeight: 1.6 }}>
                    {selectedBill.voteRationale || 'No public statement added yet. Click Edit to add one.'}
                  </p>
                )}
              </div>

              {/* Impact Notes */}
              <div style={{ marginBottom: editMode ? 16 : 0 }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem' }}>Constituent Impact Notes</h4>
                {editMode ? (
                  <textarea
                    value={editImpact}
                    onChange={(e) => setEditImpact(e.target.value)}
                    placeholder="Explain how this bill affects District 42 residents..."
                    style={{ width: '100%', minHeight: 80, border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.9rem', resize: 'vertical' }}
                  />
                ) : (
                  <p style={{ color: selectedBill.impactNotes ? 'var(--text)' : 'var(--muted)', fontSize: '0.9rem', fontStyle: !selectedBill.impactNotes ? 'italic' : 'normal', lineHeight: 1.6 }}>
                    {selectedBill.impactNotes || 'No impact notes added. These feed into PoliAI and your public profile.'}
                  </p>
                )}
              </div>

              {editMode && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="pol-btn-primary pol-btn-sm" onClick={saveAnnotations}>Save Annotations</button>
                  <button className="pol-btn-ghost pol-btn-sm" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              )}
            </div>
          ) : (
            <div className="pol-card" style={{ display: 'grid', placeItems: 'center', minHeight: 300, color: 'var(--muted)', textAlign: 'center' }}>
              <div>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--border-strong)', marginBottom: 12 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                <p>Select a bill to view details, add your vote rationale, and annotate constituent impacts.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
