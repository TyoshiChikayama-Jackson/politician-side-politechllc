import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import type { Speech, SpeechType } from '../../types';
import { demoSpeeches } from '../../data/politicianData';

type View = 'library' | 'create' | 'edit';
type CreateStep = 1 | 2 | 3 | 4;

const SPEECH_TYPES: SpeechType[] = ['Full Speech', 'Talking Points', 'Press Statement', 'Debate Prep', 'Stump Speech', 'Social Caption'];
const TONES = ['Formal', 'Conversational', 'Inspirational', 'Urgent', 'Empathetic'] as const;

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function estimateMinutes(words: number): number {
  return Math.ceil(words / 130);
}

// ─── Teleprompter Mode ────────────────────────────────────────────────────────

function TeleprompterMode({ speech, onClose }: { speech: Speech; onClose: () => void }) {
  const [speed, setSpeed] = useState(2);
  const [running, setRunning] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const tick = useCallback((timestamp: number) => {
    if (!running) return;
    if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    setScrollY((prev) => {
      const next = prev + (speed * delta) / 100;
      return next;
    });
    animRef.current = requestAnimationFrame(tick);
  }, [running, speed]);

  useEffect(() => {
    if (running) {
      lastTimeRef.current = null;
      animRef.current = requestAnimationFrame(tick);
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [running, tick]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); setRunning((r) => !r); }
      if (e.code === 'Escape') onClose();
      if (e.code === 'ArrowUp') setSpeed((s) => Math.max(0.5, s - 0.5));
      if (e.code === 'ArrowDown') setSpeed((s) => Math.min(10, s + 0.5));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Controls bar */}
      <div style={{ background: '#111', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0, borderBottom: '1px solid #333' }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Teleprompter</span>
        <button
          onClick={() => setRunning((r) => !r)}
          style={{ padding: '6px 20px', borderRadius: 8, background: running ? '#dc2626' : '#16a34a', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.88rem' }}
        >
          {running ? 'Pause' : 'Play'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: '0.85rem' }}>
          <span>Speed:</span>
          <button onClick={() => setSpeed((s) => Math.max(0.5, s - 0.5))} style={{ background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>−</button>
          <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>{speed.toFixed(1)}</span>
          <button onClick={() => setSpeed((s) => Math.min(10, s + 0.5))} style={{ background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>+</button>
        </div>
        <button
          onClick={() => setScrollY(0)}
          style={{ padding: '4px 12px', borderRadius: 6, background: '#333', color: '#aaa', border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}
        >
          ↑ Top
        </button>
        <div style={{ marginLeft: 'auto', color: '#666', fontSize: '0.78rem' }}>Space = pause/play · ↑↓ = speed · Esc = exit</div>
        <button onClick={onClose} style={{ padding: '4px 14px', borderRadius: 6, background: '#333', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.88rem' }}>✕ Exit</button>
      </div>

      {/* Scrolling text area */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: 'hidden',
          padding: '60px 15% 40vh',
        }}
      >
        <div style={{
          color: '#fff',
          fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)',
          lineHeight: 1.8,
          fontFamily: '"Georgia", serif',
          whiteSpace: 'pre-wrap',
          textAlign: 'center',
        }}>
          {speech.content}
        </div>
        <div style={{ height: '60vh' }} />
      </div>

      {/* Center line indicator */}
      <div style={{
        position: 'fixed',
        left: '10%',
        right: '10%',
        top: '50%',
        height: 3,
        background: 'rgba(107, 93, 230, 0.5)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

// ─── Speech Generator ─────────────────────────────────────────────────────────

function SpeechGenerator({ onSave, onCancel }: { onSave: (s: Speech) => void; onCancel: () => void }) {
  const [step, setStep] = useState<CreateStep>(1);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'Talking Points' as SpeechType,
    topic: '',
    audience: '',
    tone: 'Conversational' as typeof TONES[number],
    keyPoints: '',
  });
  const [content, setContent] = useState('');

  const wc = wordCount(content);
  const mins = estimateMinutes(wc);

  const generateSpeech = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type,
          topic: form.topic,
          audience: form.audience,
          tone: form.tone,
          keyPoints: form.keyPoints.split('\n').filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setContent(data.content);
    } catch {
      const isPoints = form.type === 'Talking Points';
      setContent(isPoints
        ? `TALKING POINTS — ${form.topic.toUpperCase() || 'POLICY ISSUE'}\n\nAUDIENCE: ${form.audience || 'District 42 constituents'}\n\nOPENING\n• Thank the audience for being here\n• Acknowledge the importance of this issue to District 42\n\nKEY POINTS\n${form.keyPoints.split('\n').filter(Boolean).map((p, i) => `\n${i + 1}. ${p.toUpperCase()}\n   • [Expand on this point with local data or story]\n   • [Include a specific action or commitment]`).join('') || '\n1. ISSUE FRAMING\n   • This is a problem affecting thousands of District 42 families\n   • We have seen [specific data/trend] in our district\n\n2. YOUR POSITION\n   • My approach is guided by [values/evidence]\n   • I have taken action by [specific legislation/initiative]\n\n3. CALL TO ACTION\n   • I am committed to [specific outcome]\n   • Here is how constituents can help'}\n\nCLOSING\n• Restate your commitment\n• Thank the audience\n• Invite questions/engagement\n\nPaid for by Williams for Indiana House. Sandra K. Moore, Treasurer.`
        : `${form.type.toUpperCase()}: ${form.topic || 'Policy Address'}\n\nMadam Speaker, members of the House —\n\nThank you for the opportunity to address this chamber on the matter of ${form.topic || 'the issue before us today'}.\n\nThe people of District 42 sent me here with a clear mandate: to fight for their families, their schools, and their future. Today, I want to speak to that mandate.\n\n${form.keyPoints.split('\n').filter(Boolean).map((p) => `${p}\n\n[Expand on this point. Include constituent stories, local data, and specific legislative actions you support or oppose.]\n\n`).join('') || 'The issue before us is one that touches every household in our district. We have a choice: we can act with courage and conviction, or we can defer once again to those who benefit from the status quo. I choose action.\n\nI call on my colleagues to join me.\n\n'}\nThe residents of District 42 are watching. Let\'s make them proud.\n\nThank you.\n\nPaid for by Williams for Indiana House. Sandra K. Moore, Treasurer.`
      );
    } finally {
      setGenerating(false);
      setStep(3);
    }
  };

  const handleSave = () => {
    const points = form.keyPoints.split('\n').filter(Boolean);
    const speech: Speech = {
      id: `speech-${Date.now()}`,
      title: form.title || `${form.type}: ${form.topic}`,
      type: form.type,
      topic: form.topic,
      audience: form.audience,
      tone: form.tone,
      keyPoints: points,
      content,
      wordCount: wc,
      estimatedMinutes: mins,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      tags: [form.type, form.topic].filter(Boolean),
    };
    onSave(speech);
  };

  return (
    <div className="pol-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0 }}>Speech Generator</h3>
        <button className="pol-btn-ghost pol-btn-sm" onClick={onCancel}>← Back to Library</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[1, 2, 3, 4].map((s) => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 999, background: step >= s ? 'var(--grad-purple)' : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 24 }}>
        {['1. Setup', '2. Generate', '3. Edit', '4. Save'].map((label, i) => (
          <span key={label} style={{ fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? 'var(--color-brand, #6B5DE6)' : 'var(--muted)' }}>{label}</span>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h4 style={{ marginBottom: 16 }}>Speech Setup</h4>
          <div className="pol-field-group">
            <label>Title (optional)</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Auto-generated if blank" />
          </div>
          <div className="pol-form-row">
            <div className="pol-field-group">
              <label>Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as SpeechType }))}>
                {SPEECH_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="pol-field-group">
              <label>Tone</label>
              <select value={form.tone} onChange={(e) => setForm((f) => ({ ...f, tone: e.target.value as typeof TONES[number] }))}>
                {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="pol-field-group">
            <label>Topic / Subject *</label>
            <input value={form.topic} onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))} placeholder="e.g. K-12 Education Funding Reform (HB 1042)" />
          </div>
          <div className="pol-field-group">
            <label>Audience</label>
            <input value={form.audience} onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))} placeholder="e.g. Indiana State House floor, District 42 town hall" />
          </div>
          <div className="pol-field-group">
            <label>Key Points (one per line)</label>
            <textarea
              value={form.keyPoints}
              onChange={(e) => setForm((f) => ({ ...f, keyPoints: e.target.value }))}
              placeholder="Key point 1&#10;Key point 2&#10;Key point 3"
              style={{ minHeight: 120, resize: 'vertical' }}
            />
          </div>
          <button className="pol-btn-primary pol-btn-sm" disabled={!form.topic} onClick={() => setStep(2)}>
            Next: Generate →
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h4 style={{ marginBottom: 8 }}>Ready to Generate {form.type}</h4>
          <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: '0.88rem', maxWidth: 400, margin: '0 auto 24px' }}>
            Claude AI will draft a {form.tone.toLowerCase()}, {form.type.toLowerCase()} on "{form.topic}" tailored for {form.audience || 'your audience'}.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="pol-btn-ghost pol-btn-sm" onClick={() => setStep(1)}>← Back</button>
            <button className="pol-ai-btn" onClick={generateSpeech} disabled={generating}>
              {generating ? 'Writing...' : 'Generate with AI'}
            </button>
          </div>
          {generating && (
            <div style={{ marginTop: 24, maxWidth: 480, margin: '24px auto 0' }}>
              <div className="pol-skeleton pol-skeleton-pulse" style={{ height: 20, borderRadius: 6, marginBottom: 8 }} />
              <div className="pol-skeleton pol-skeleton-pulse" style={{ height: 20, borderRadius: 6, marginBottom: 8, width: '90%' }} />
              <div className="pol-skeleton pol-skeleton-pulse" style={{ height: 20, borderRadius: 6, marginBottom: 8, width: '80%' }} />
              <div className="pol-skeleton pol-skeleton-pulse" style={{ height: 20, borderRadius: 6, marginBottom: 8 }} />
              <div className="pol-skeleton pol-skeleton-pulse" style={{ height: 20, borderRadius: 6, width: '70%' }} />
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ margin: 0 }}>Review & Edit</h4>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{wc} words · ~{mins} min</span>
              <button className="pol-ai-btn pol-btn-sm" onClick={generateSpeech} disabled={generating}>
                {generating ? 'Regenerating...' : 'Regenerate'}
              </button>
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              minHeight: 360,
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '16px 18px',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '0.92rem',
              lineHeight: 1.8,
              fontFamily: '"Georgia", serif',
              resize: 'vertical',
              marginBottom: 16,
            }}
          />
          <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(107,93,230,0.08)', border: '1px solid var(--navy-border)', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 16 }}>
            <strong>Compliance reminder:</strong> Include "Paid for by Williams for Indiana House. Sandra K. Moore, Treasurer." at the end of all public-facing speech documents.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="pol-btn-ghost pol-btn-sm" onClick={() => setStep(2)}>← Back</button>
            <button className="pol-btn-primary pol-btn-sm" onClick={() => setStep(4)}>Next: Save →</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h4 style={{ marginBottom: 8 }}>Save Speech</h4>
          <div style={{ padding: '16px 18px', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 20 }}>
            <div className="info-label" style={{ marginBottom: 8 }}>Summary</div>
            <div style={{ display: 'grid', gap: 6, fontSize: '0.88rem' }}>
              <div><strong>Type:</strong> {form.type}</div>
              <div><strong>Topic:</strong> {form.topic}</div>
              <div><strong>Audience:</strong> {form.audience || '—'}</div>
              <div><strong>Tone:</strong> {form.tone}</div>
              <div><strong>Length:</strong> {wc} words · ~{mins} min</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="pol-btn-ghost pol-btn-sm" onClick={() => setStep(3)}>← Back</button>
            <button className="pol-btn-primary pol-btn-sm" onClick={handleSave}>Save to Library</button>
            <button className="pol-btn-secondary pol-btn-sm">Export as PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Speech Editor ────────────────────────────────────────────────────────────

function SpeechEditor({ speech, onUpdate, onClose }: { speech: Speech; onUpdate: (s: Speech) => void; onClose: () => void }) {
  const [content, setContent] = useState(speech.content);
  const [teleprompter, setTeleprompter] = useState(false);
  const wc = wordCount(content);
  const mins = estimateMinutes(wc);

  const handleSave = () => {
    onUpdate({ ...speech, content, wordCount: wc, estimatedMinutes: mins, updatedAt: new Date().toISOString().slice(0, 10) });
    onClose();
  };

  if (teleprompter) {
    const liveSpeech = { ...speech, content };
    return <TeleprompterMode speech={liveSpeech} onClose={() => setTeleprompter(false)} />;
  }

  return (
    <div className="pol-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
            <span className="pol-badge in-progress">{speech.type}</span>
            <span className="pol-badge pending">{speech.tone}</span>
          </div>
          <h3 style={{ margin: 0 }}>{speech.title}</h3>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>
            {speech.audience && <span>{speech.audience} · </span>}
            <span>{wc} words · ~{mins} min</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="pol-btn-secondary pol-btn-sm" onClick={() => setTeleprompter(true)}>Teleprompter</button>
          <button className="pol-btn-ghost pol-btn-sm" onClick={onClose}>✕</button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: '0.82rem', color: wc > 800 ? '#f59e0b' : 'var(--muted)' }}>{wc} words · ~{mins} min</span>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: '100%',
          minHeight: 400,
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '16px 18px',
          background: 'var(--surface)',
          color: 'var(--text)',
          fontSize: '0.92rem',
          lineHeight: 1.8,
          fontFamily: '"Georgia", serif',
          resize: 'vertical',
          marginBottom: 16,
        }}
      />

      {speech.keyPoints.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div className="info-label" style={{ marginBottom: 8 }}>Key Points</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {speech.keyPoints.map((p, i) => (
              <span key={i} style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--purple-dim)', color: 'var(--color-brand, #6B5DE6)', fontSize: '0.78rem' }}>{p}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="pol-btn-primary pol-btn-sm" onClick={handleSave}>Save Changes</button>
        <button className="pol-btn-secondary pol-btn-sm" onClick={() => setTeleprompter(true)}>Launch Teleprompter</button>
        <button className="pol-btn-secondary pol-btn-sm">Export</button>
        <button className="pol-btn-ghost pol-btn-sm" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PoliticianSpeech() {
  const [view, setView] = useState<View>('library');
  const [speeches, setSpeeches] = useState<Speech[]>(demoSpeeches);
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);
  const [filterType, setFilterType] = useState<SpeechType | 'All'>('All');
  const [teleprompterSpeech, setTeleprompterSpeech] = useState<Speech | null>(null);

  const filtered = useMemo(() =>
    filterType === 'All' ? speeches : speeches.filter((s) => s.type === filterType),
    [speeches, filterType]
  );

  const totalWords = speeches.reduce((s, sp) => s + sp.wordCount, 0);

  const handleSaveNew = (speech: Speech) => {
    setSpeeches((prev) => [speech, ...prev]);
    setSelectedSpeech(speech);
    setView('library');
  };

  const handleUpdate = (updated: Speech) => {
    setSpeeches((prev) => prev.map((s) => s.id === updated.id ? updated : s));
    setSelectedSpeech(updated);
  };

  if (teleprompterSpeech) {
    return <TeleprompterMode speech={teleprompterSpeech} onClose={() => setTeleprompterSpeech(null)} />;
  }

  return (
    <div>
      <div className="pol-page-header">
        <div className="pol-header-left">
          <h1>Speech Writer</h1>
          <p>Generate AI-powered speeches, talking points, and press statements. Edit, practice with the teleprompter, and export for any occasion.</p>
        </div>
        <div className="pol-header-actions">
          {view === 'create' && <button className="pol-btn-ghost pol-btn-sm" onClick={() => setView('library')}>Back to Library</button>}
          <button className="pol-btn-primary pol-btn-sm" onClick={() => setView('create')}>New Speech</button>
        </div>
      </div>

      {view !== 'create' && (
        <div className="pol-stat-grid" style={{ marginBottom: 20 }}>
          <div className="pol-stat-card">
            <span className="pol-stat-label">Speeches Saved</span>
            <span className="pol-stat-value">{speeches.length}</span>
            <span className="pol-stat-sub">In your library</span>
          </div>
          <div className="pol-stat-card">
            <span className="pol-stat-label">Total Words</span>
            <span className="pol-stat-value">{totalWords.toLocaleString()}</span>
            <span className="pol-stat-sub">Across all speeches</span>
          </div>
          <div className="pol-stat-card">
            <span className="pol-stat-label">Speech Types</span>
            <span className="pol-stat-value">{new Set(speeches.map((s) => s.type)).size}</span>
            <span className="pol-stat-sub">Formats in library</span>
          </div>
          <div className="pol-stat-card">
            <span className="pol-stat-label">Avg. Length</span>
            <span className="pol-stat-value">{speeches.length > 0 ? Math.round(totalWords / speeches.length) : 0}</span>
            <span className="pol-stat-sub">Words per speech</span>
          </div>
        </div>
      )}

      {view === 'create' && (
        <SpeechGenerator onSave={handleSaveNew} onCancel={() => setView('library')} />
      )}

      {(view === 'library' || view === 'edit') && (
        <div>
          {/* Type filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <button
              className={filterType === 'All' ? 'pol-btn-primary pol-btn-sm' : 'pol-btn-ghost pol-btn-sm'}
              onClick={() => setFilterType('All')}
            >
              All
            </button>
            {SPEECH_TYPES.map((t) => (
              <button
                key={t}
                className={filterType === t ? 'pol-btn-primary pol-btn-sm' : 'pol-btn-ghost pol-btn-sm'}
                onClick={() => setFilterType(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="pol-sidebar-layout" style={{ alignItems: 'start' }}>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div className="pol-record-list">
                {filtered.length === 0 && (
                  <div className="pol-card" style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>No speeches match the current filter.</div>
                )}
                {filtered.map((sp) => (
                  <div
                    key={sp.id}
                    className={`pol-record-item${selectedSpeech?.id === sp.id ? ' selected' : ''}`}
                    onClick={() => { setSelectedSpeech(sp); setView('edit'); }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600 }}>{sp.type}</span>
                        <span className="pol-badge pending" style={{ fontSize: '0.7rem' }}>{sp.tone}</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sp.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>
                        {sp.topic} · {sp.wordCount} words
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-brand, #6B5DE6)', fontSize: '0.88rem' }}>~{sp.estimatedMinutes}min</div>
                      <button
                        className="pol-btn-ghost pol-btn-sm"
                        style={{ marginTop: 4, fontSize: '0.72rem' }}
                        onClick={(e) => { e.stopPropagation(); setTeleprompterSpeech(sp); }}
                        title="Launch Teleprompter"
                      >
                        TLP
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ minWidth: 0 }}>
              {view === 'edit' && selectedSpeech ? (
                <SpeechEditor
                  speech={selectedSpeech}
                  onUpdate={handleUpdate}
                  onClose={() => setView('library')}
                />
              ) : (
                <div className="pol-card" style={{ display: 'grid', placeItems: 'center', minHeight: 300, color: 'var(--muted)', textAlign: 'center' }}>
                  <div>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#D1D5DB', marginBottom: 12 }}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    <p>Select a speech to edit or launch in teleprompter mode.</p>
                    <p style={{ fontSize: '0.85rem' }}>Use the TLP button on any speech for instant teleprompter mode.</p>
                    <button className="pol-btn-primary pol-btn-sm" style={{ marginTop: 12 }} onClick={() => setView('create')}>Generate New Speech</button>
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
