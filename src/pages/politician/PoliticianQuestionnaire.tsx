import { useState } from 'react';
import type { PolicyStance } from '../../types';
import { demoPolicyStances, demoPolitician } from '../../data/politicianData';

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

function PublicProfilePreviewModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Public Profile Preview</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ padding: 0 }}>
          {/* Styled like the voter-side profile */}
          <div style={{ background: 'linear-gradient(135deg, #1e2444, #2d1b69)', padding: '28px 28px 20px', borderRadius: '0 0 0 0' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #4F46E5)', display: 'grid', placeItems: 'center', fontSize: '1.6rem', color: 'white', fontWeight: 700, flexShrink: 0 }}>
                {demoPolitician.name.charAt(0)}
              </div>
              <div>
                <h2 style={{ margin: '0 0 4px', color: 'white', fontSize: '1.3rem' }}>{demoPolitician.name}</h2>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', marginBottom: 8 }}>{demoPolitician.office} · {demoPolitician.district}</div>
                <span style={{ padding: '3px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 600 }}>YOUR PARTY</span>
              </div>
            </div>
          </div>
          <div style={{ padding: '20px 28px' }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
              {[
                { label: 'Year Elected', value: '2020' },
                { label: 'Bills Sponsored', value: '7' },
                { label: 'Committees', value: '3' },
                { label: 'PoliCred', value: '84' },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-brand, #4F46E5)' }}>{s.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ margin: '0 0 6px', fontSize: '0.88rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>About</h4>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text)', margin: 0 }}>{demoPolitician.bio}</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ margin: '0 0 6px', fontSize: '0.88rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Committees</h4>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Education', 'Ways & Means', 'Local Government'].map((c) => (
                  <span key={c} style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--purple-dim, rgba(107,93,230,0.1))', color: 'var(--color-brand, #4F46E5)', fontSize: '0.8rem' }}>{c}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ margin: '0 0 6px', fontSize: '0.88rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contact</h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                <div>{demoPolitician.website}</div>
                <div>{demoPolitician.twitterHandle}</div>
              </div>
            </div>
            <div style={{ marginTop: 20, padding: '12px 14px', borderRadius: 10, background: 'var(--purple-dim)', border: '1px solid var(--navy-border)', fontSize: '0.78rem', color: 'var(--muted)', fontStyle: 'italic' }}>
              This is a preview of your public PoliTech voter profile. Voters see this page when they search for you.
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="pol-btn-primary" onClick={onClose}>Close Preview</button>
        </div>
      </div>
    </div>
  );
}


const STATUS_OPTIONS: PolicyStance['status'][] = ['answered', 'in-review', 'no-comment'];

function AIDraftButton({ question, onDraft }: { question: string; onDraft: (text: string) => void }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: question, type: 'policy-stance' }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onDraft(data.draft);
    } catch {
      onDraft(`My approach to this issue is guided by the values and concerns I hear from constituents in District 12 every day. After careful consideration and review of relevant data, I believe that effective policy must be evidence-based, fiscally responsible, and centered on the needs of working families and small businesses in our community.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="pol-ai-btn pol-btn-sm" onClick={handleClick} disabled={loading}>
      {loading ? 'Drafting...' : 'AI Draft Answer'}
    </button>
  );
}

export function PoliticianQuestionnaire() {
  const [stances, setStances] = useState<PolicyStance[]>(demoPolicyStances);
  const [selectedStance, setSelectedStance] = useState<PolicyStance | null>(null);
  const [editAnswer, setEditAnswer] = useState('');
  const [editStatus, setEditStatus] = useState<PolicyStance['status']>('answered');
  const [editMode, setEditMode] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const categories = ['All', ...Array.from(new Set(stances.map((s) => s.category)))];
  const filtered = filterCategory === 'All' ? stances : stances.filter((s) => s.category === filterCategory);

  const answeredCount = stances.filter((s) => s.status === 'answered').length;
  const inReviewCount = stances.filter((s) => s.status === 'in-review').length;
  const noCommentCount = stances.filter((s) => s.status === 'no-comment').length;

  const openStance = (stance: PolicyStance) => {
    setSelectedStance(stance);
    setEditAnswer(stance.freeTextAnswer);
    setEditStatus(stance.status);
    setEditMode(false);
  };

  const saveStance = () => {
    if (!selectedStance) return;
    const now = new Date().toISOString().slice(0, 10);
    setStances((prev) =>
      prev.map((s) =>
        s.id === selectedStance.id
          ? {
              ...s,
              freeTextAnswer: editAnswer,
              status: editStatus,
              updatedAt: now,
              versionHistory: [
                ...s.versionHistory,
                { answer: s.freeTextAnswer, updatedAt: s.updatedAt },
              ].filter((v) => v.answer),
            }
          : s
      )
    );
    setSelectedStance((prev) =>
      prev ? { ...prev, freeTextAnswer: editAnswer, status: editStatus, updatedAt: now } : prev
    );
    setEditMode(false);
  };

  return (
    <div>
      <div className="pol-page-header">
        <div className="pol-header-left">
          <h1>Policy Stances</h1>
          <p>Answer the PoliTech standardized questionnaire. Your responses appear on your public profile and inform PoliAI.</p>
        </div>
        <div className="pol-header-actions">
          <button className="pol-btn-secondary pol-btn-sm" onClick={() => setShowProfilePreview(true)}>Preview Public Profile</button>
        </div>
      </div>

      <div className="pol-stat-grid" style={{ marginBottom: 20 }}>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Answered</span>
          <span className="pol-stat-value" style={{ color: 'var(--success-solid)' }}>{answeredCount}</span>
          <span className="pol-stat-sub">Publicly visible</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">In Review</span>
          <span className="pol-stat-value" style={{ color: 'var(--warning-solid)' }}>{inReviewCount}</span>
          <span className="pol-stat-sub">Draft saved</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">No Comment</span>
          <span className="pol-stat-value" style={{ color: 'var(--text-tertiary)' }}>{noCommentCount}</span>
          <span className="pol-stat-sub">Marked private</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Completion</span>
          <span className="pol-stat-value">{Math.round((answeredCount / stances.length) * 100)}%</span>
          <span className="pol-stat-sub">{stances.length} total questions</span>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={filterCategory === cat ? 'pol-btn-primary pol-btn-sm' : 'pol-btn-ghost pol-btn-sm'}
            onClick={() => setFilterCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="pol-sidebar-layout">
        {/* Question List */}
        <div className="pol-record-list">
          {filtered.map((stance) => (
            <div
              key={stance.id}
              className={`pol-record-item${selectedStance?.id === stance.id ? ' selected' : ''}`}
              onClick={() => openStance(stance)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600 }}>{stance.category.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {stance.question}
                </div>
                {stance.freeTextAnswer && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {stance.freeTextAnswer.slice(0, 60)}...
                  </div>
                )}
              </div>
              <span className={`pol-badge ${stance.status === 'answered' ? 'passed' : stance.status === 'in-review' ? 'warning' : 'pending'}`}>
                {stance.status}
              </span>
            </div>
          ))}
        </div>

        {/* Detail Panel — minWidth: 0 prevents content from overflowing the grid column */}
        <div style={{ minWidth: 0 }}>
          {selectedStance ? (
            <div className="pol-card">
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <span className="pol-badge in-progress">{selectedStance.category}</span>
                <span className={`pol-badge ${selectedStance.status === 'answered' ? 'passed' : selectedStance.status === 'in-review' ? 'warning' : 'pending'}`}>
                  {selectedStance.status}
                </span>
              </div>

              <h3 style={{ marginBottom: 20 }}>{selectedStance.question}</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <label style={{ fontWeight: 600, fontSize: '0.92rem' }}>Your Answer</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {!editMode && (
                    <AIDraftButton question={selectedStance.question} onDraft={(draft) => { setEditAnswer(draft); setEditMode(true); }} />
                  )}
                  <button className="pol-btn-ghost pol-btn-sm" onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Cancel' : 'Edit'}
                  </button>
                </div>
              </div>

              {editMode ? (
                <>
                  <textarea
                    value={editAnswer}
                    onChange={(e) => setEditAnswer(e.target.value)}
                    placeholder="Write your stance on this issue..."
                    style={{ width: '100%', minHeight: 180, border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.92rem', resize: 'vertical', marginBottom: 12 }}
                  />
                  <div className="pol-field-group" style={{ marginBottom: 12 }}>
                    <label>Status</label>
                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as PolicyStance['status'])}>
                      <option value="answered">Answered (public)</option>
                      <option value="in-review">In Review (saved draft)</option>
                      <option value="no-comment">No Comment (private)</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="pol-btn-primary pol-btn-sm" onClick={() => { saveStance(); showToast('Answer saved successfully.'); }}>Save Answer</button>
                    <button className="pol-btn-ghost pol-btn-sm" onClick={() => setEditMode(false)}>Cancel</button>
                  </div>
                </>
              ) : (
                <div>
                  {selectedStance.freeTextAnswer ? (
                    <div style={{ padding: '16px 18px', borderRadius: 12, background: 'var(--surfaceSoft, #f1f5f9)', fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text)' }}>
                      {selectedStance.freeTextAnswer}
                    </div>
                  ) : (
                    <div style={{ padding: '24px', borderRadius: 12, background: 'var(--surfaceSoft, #f1f5f9)', textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic' }}>
                      No answer recorded yet. Click Edit or use AI Draft to get started.
                    </div>
                  )}
                </div>
              )}

              {/* Version History */}
              {selectedStance.versionHistory.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ fontSize: '0.9rem', margin: '0 0 10px', color: 'var(--muted)' }}>Version History</h4>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {selectedStance.versionHistory.map((v, i) => (
                      <div key={i} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', fontSize: '0.82rem' }}>
                        <div style={{ color: 'var(--muted)', marginBottom: 4 }}>{v.updatedAt}</div>
                        <div style={{ color: 'var(--text)' }}>{v.answer.slice(0, 100)}...</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--muted)' }}>Last updated: {selectedStance.updatedAt}</div>
            </div>
          ) : (
            <div className="pol-card" style={{ display: 'grid', placeItems: 'center', minHeight: 300, color: 'var(--muted)', textAlign: 'center' }}>
              <div>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--border-strong)', marginBottom: 12 }}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                <p>Select a question to view or edit your policy stance.</p>
                <p style={{ fontSize: '0.85rem' }}>Use AI Draft to quickly generate thoughtful answers based on your record.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showProfilePreview && <PublicProfilePreviewModal onClose={() => setShowProfilePreview(false)} />}
      {toast && <SuccessToast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
