import { useState, useMemo } from 'react';
import type { Survey, SurveyQuestion, QuestionType } from '../../types';
import { demoSurveys } from '../../data/politicianData';

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

function ShareSurveyModal({ survey, onClose }: { survey: Survey; onClose: () => void }) {
  const url = `${window.location.origin}/survey/${survey.id}`;
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Share Survey</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 16 }}>Share this link with constituents to collect responses for "{survey.title}".</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '12px 14px', borderRadius: 10, background: 'var(--purple-dim)', border: '1px solid var(--navy-border)' }}>
            <div style={{ flex: 1, fontSize: '0.85rem', color: 'var(--color-brand, #6B5DE6)', fontWeight: 600, overflowWrap: 'break-word', wordBreak: 'break-all' }}>{url}</div>
            <button className="pol-btn-primary pol-btn-sm" onClick={copy} style={{ flexShrink: 0 }}>{copied ? 'Copied!' : 'Copy Link'}</button>
          </div>
        </div>
        <div className="modal-footer">
          <button className="pol-btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

function downloadCSV(rows: string[][], filename: string) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = filename; a.click();
}

type View = 'library' | 'create';
type CreateStep = 1 | 2 | 3;

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'yes-no', label: 'Yes / No' },
  { value: 'rating', label: 'Rating (1–5)' },
  { value: 'open-text', label: 'Open Text' },
  { value: 'ranking', label: 'Ranking' },
];

const STATUS_COLORS: Record<Survey['status'], string> = {
  draft: 'pending',
  active: 'passed',
  closed: 'in-progress',
};

function SurveyResultsPanel({ survey, onToast, onShare, onClose: onCloseSurvey }: { survey: Survey; onToast: (msg: string) => void; onShare: (s: Survey) => void; onClose: (id: string) => void }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [themes, setThemes] = useState<string[]>(survey.aiThemes || []);

  const extractThemes = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-survey-themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surveyTitle: survey.title, questions: survey.questions, responseCount: survey.responseCount }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setThemes(data.themes);
    } catch {
      setThemes([
        'Constituents prioritize immediate, tangible improvements over long-term plans',
        'Strong desire for more town halls and direct engagement',
        'Economic concerns (jobs, cost of living) mentioned across all demographic groups',
        'Youth respondents focus on digital access and education quality',
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const mockBarData = survey.questions
    .filter((q) => q.type === 'multiple-choice' && q.options)
    .slice(0, 2);

  return (
    <div className="pol-card">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        <span className={`pol-badge ${STATUS_COLORS[survey.status]}`}>{survey.status}</span>
      </div>
      <h3 style={{ marginTop: 0 }}>{survey.title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 16 }}>{survey.description}</p>

      <div className="pol-card-dark" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div><div className="pol-stat-label">Responses</div><div className="pol-stat-value">{survey.responseCount}</div></div>
          <div><div className="pol-stat-label">Questions</div><div className="pol-stat-value">{survey.questions.length}</div></div>
          <div><div className="pol-stat-label">Status</div><div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: 4 }}>{survey.status}</div></div>
          {survey.closedAt && <div><div className="pol-stat-label">Closed</div><div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: 4 }}>{survey.closedAt}</div></div>}
        </div>
      </div>

      {/* Mock bar charts for multiple-choice questions */}
      {mockBarData.map((q) => {
        const total = survey.responseCount;
        const mockDistribution = (q.options || []).map((opt, i) => ({
          label: opt,
          count: Math.round(total * [0.32, 0.25, 0.18, 0.15, 0.10][i % 5]),
        }));
        return (
          <div key={q.id} style={{ marginBottom: 20 }}>
            <div className="info-label" style={{ marginBottom: 10 }}>{q.text}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {mockDistribution.map(({ label, count }) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                      <span style={{ color: 'var(--text)' }}>{label}</span>
                      <span style={{ color: 'var(--muted)' }}>{pct}% ({count})</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--border)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--grad-purple)', borderRadius: 999, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* AI Theme Extraction */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div className="info-label">AI-Extracted Themes</div>
          <button className="pol-ai-btn pol-btn-sm" onClick={extractThemes} disabled={aiLoading}>
            {aiLoading ? 'Analyzing...' : 'Extract Themes'}
          </button>
        </div>
        {themes.length > 0 ? (
          <div style={{ display: 'grid', gap: 8 }}>
            {themes.map((theme, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px', borderRadius: 10, background: 'var(--purple-dim)', border: '1px solid var(--navy-border)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-brand, #6B5DE6)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text)' }}>{theme}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '20px', borderRadius: 10, border: '1px solid var(--border)', textAlign: 'center', color: 'var(--muted)', fontSize: '0.88rem' }}>
            Click "Extract Themes" to use AI to identify key patterns from open-text responses.
          </div>
        )}
      </div>

      {survey.shareLink && (
        <div style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--purple-dim)', border: '1px solid var(--navy-border)', marginBottom: 16 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 4 }}>SURVEY LINK</div>
          <div style={{ fontWeight: 600, color: 'var(--color-brand, #6B5DE6)', fontSize: '0.88rem' }}>{survey.shareLink}</div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="pol-btn-secondary pol-btn-sm" onClick={() => {
          downloadCSV(
            [['Question', 'Type', 'Responses (est.)'],
             ...survey.questions.map((q) => [q.text, q.type, String(Math.round(survey.responseCount * 0.7))])],
            `results-${survey.id}.csv`
          );
          onToast('Survey results exported as CSV.');
        }}>Export Results</button>
        <button className="pol-btn-secondary pol-btn-sm" onClick={() => {
          downloadCSV(
            [['Question', 'Type', 'Options', 'Required'],
             ...survey.questions.map((q) => [q.text, q.type, (q.options || []).join('; '), String(q.required)])],
            `survey-${survey.id}.csv`
          );
          onToast('Survey data downloaded as CSV.');
        }}>Download CSV</button>
        {survey.status === 'active' && <button className="pol-btn-secondary pol-btn-sm" onClick={() => onShare(survey)}>Share Survey</button>}
        {survey.status === 'active' && <button className="pol-btn-ghost pol-btn-sm" onClick={() => { onCloseSurvey(survey.id); onToast(`Survey "${survey.title}" closed.`); }}>Close Survey</button>}
      </div>
    </div>
  );
}

function SurveyBuilder({ onSave, onCancel }: { onSave: (s: Survey) => void; onCancel: () => void }) {
  const [step, setStep] = useState<CreateStep>(1);
  const [form, setForm] = useState({ title: '', description: '', targetAudience: '' });
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [newQ, setNewQ] = useState<{ type: QuestionType; text: string; options: string; required: boolean }>({
    type: 'multiple-choice',
    text: '',
    options: '',
    required: true,
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const addQuestion = () => {
    if (!newQ.text.trim()) return;
    const q: SurveyQuestion = {
      id: `sq-${Date.now()}`,
      order: questions.length + 1,
      type: newQ.type,
      text: newQ.text,
      options: newQ.type === 'multiple-choice' || newQ.type === 'ranking'
        ? newQ.options.split('\n').map((o) => o.trim()).filter(Boolean)
        : undefined,
      required: newQ.required,
    };
    setQuestions((prev) => [...prev, q]);
    setNewQ({ type: 'multiple-choice', text: '', options: '', required: true });
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id).map((q, i) => ({ ...q, order: i + 1 })));
  };

  const moveQuestion = (from: number, to: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated.map((q, i) => ({ ...q, order: i + 1 }));
    });
  };

  const suggestQuestions = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-survey-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: form.title, audience: form.targetAudience }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setQuestions((prev) => [
        ...prev,
        ...data.questions.map((q: Partial<SurveyQuestion>, i: number) => ({
          id: `sq-ai-${Date.now()}-${i}`,
          order: prev.length + i + 1,
          type: q.type || 'multiple-choice',
          text: q.text || '',
          options: q.options || [],
          required: true,
        })),
      ]);
    } catch {
      const suggestions: SurveyQuestion[] = [
        { id: `sq-ai-${Date.now()}-0`, order: questions.length + 1, type: 'multiple-choice', text: `What is your top concern regarding ${form.title || 'this issue'}?`, options: ['Cost and affordability', 'Access and availability', 'Quality and effectiveness', 'Government responsiveness', 'Other'], required: true },
        { id: `sq-ai-${Date.now()}-1`, order: questions.length + 2, type: 'yes-no', text: `Do you feel your voice is heard on ${form.title || 'this issue'} by elected officials?`, required: true },
        { id: `sq-ai-${Date.now()}-2`, order: questions.length + 3, type: 'rating', text: 'How would you rate current government performance on this issue? (1 = poor, 5 = excellent)', required: true },
        { id: `sq-ai-${Date.now()}-3`, order: questions.length + 4, type: 'open-text', text: 'What is the most important thing you want your representative to know about this issue?', required: false },
      ];
      setQuestions((prev) => [...prev, ...suggestions]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = () => {
    const survey: Survey = {
      id: `survey-${Date.now()}`,
      title: form.title,
      description: form.description,
      questions,
      status: 'draft',
      createdAt: new Date().toISOString().slice(0, 10),
      responseCount: 0,
      targetAudience: form.targetAudience,
      responses: [],
    };
    onSave(survey);
  };

  return (
    <div className="pol-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0 }}>Survey Builder</h3>
        <button className="pol-btn-ghost pol-btn-sm" onClick={onCancel}>← Back to Library</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 999, background: step >= s ? 'var(--grad-purple)' : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 24 }}>
        {['1. Setup', '2. Questions', '3. Distribute'].map((label, i) => (
          <span key={label} style={{ fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? 'var(--color-brand, #6B5DE6)' : 'var(--muted)' }}>{label}</span>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h4 style={{ marginBottom: 16 }}>Survey Setup</h4>
          <div className="pol-field-group">
            <label>Survey Title *</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. District 12 Education Priorities Survey" />
          </div>
          <div className="pol-field-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Briefly describe the purpose of this survey for respondents..." style={{ minHeight: 80, resize: 'vertical' }} />
          </div>
          <div className="pol-field-group">
            <label>Target Audience</label>
            <input value={form.targetAudience} onChange={(e) => setForm((f) => ({ ...f, targetAudience: e.target.value }))} placeholder="e.g. District 12 parents and educators" />
          </div>
          <button className="pol-btn-primary pol-btn-sm" disabled={!form.title} onClick={() => setStep(2)}>
            Next: Add Questions →
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h4 style={{ margin: 0 }}>Question Builder</h4>
            <button className="pol-ai-btn pol-btn-sm" onClick={suggestQuestions} disabled={aiLoading}>
              {aiLoading ? 'Suggesting...' : 'AI Suggest Questions'}
            </button>
          </div>

          {/* Existing Questions */}
          {questions.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div className="info-label" style={{ marginBottom: 8 }}>Questions ({questions.length})</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {questions.map((q, i) => (
                  <div
                    key={q.id}
                    draggable
                    onDragStart={() => setDraggingIdx(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggingIdx !== null && draggingIdx !== i) moveQuestion(draggingIdx, i);
                      setDraggingIdx(null);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                      cursor: 'grab',
                      background: draggingIdx === i ? 'var(--purple-dim)' : 'var(--surface)',
                    }}
                  >
                    <span style={{ fontSize: '1rem', color: 'var(--muted)', flexShrink: 0, marginTop: 2 }}>⠿</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>Q{q.order}</span>
                        <span className="pol-badge in-progress" style={{ fontSize: '0.68rem' }}>{QUESTION_TYPES.find((t) => t.value === q.type)?.label}</span>
                        {q.required && <span className="pol-badge major" style={{ fontSize: '0.68rem' }}>Required</span>}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text)' }}>{q.text}</div>
                      {q.options && q.options.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                          {q.options.map((opt) => (
                            <span key={opt} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 999, background: 'var(--purple-dim)', color: 'var(--color-brand, #6B5DE6)' }}>{opt}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      className="pol-btn-ghost pol-btn-sm"
                      style={{ flexShrink: 0 }}
                      onClick={() => removeQuestion(q.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 6 }}>Drag questions to reorder.</p>
            </div>
          )}

          {/* Add New Question */}
          <div style={{ padding: '16px 18px', borderRadius: 12, border: '2px dashed var(--border)', marginBottom: 20 }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '0.92rem' }}>+ Add Question</h4>
            <div className="pol-form-row">
              <div className="pol-field-group" style={{ flex: 1 }}>
                <label>Question Type</label>
                <select value={newQ.type} onChange={(e) => setNewQ((q) => ({ ...q, type: e.target.value as QuestionType }))}>
                  {QUESTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="pol-field-group" style={{ flex: '0 0 auto' }}>
                <label>Required</label>
                <select value={newQ.required ? 'yes' : 'no'} onChange={(e) => setNewQ((q) => ({ ...q, required: e.target.value === 'yes' }))}>
                  <option value="yes">Required</option>
                  <option value="no">Optional</option>
                </select>
              </div>
            </div>
            <div className="pol-field-group">
              <label>Question Text</label>
              <input value={newQ.text} onChange={(e) => setNewQ((q) => ({ ...q, text: e.target.value }))} placeholder="Type your question..." />
            </div>
            {(newQ.type === 'multiple-choice' || newQ.type === 'ranking') && (
              <div className="pol-field-group">
                <label>Answer Options (one per line)</label>
                <textarea value={newQ.options} onChange={(e) => setNewQ((q) => ({ ...q, options: e.target.value }))} placeholder="Option 1&#10;Option 2&#10;Option 3" style={{ minHeight: 80, resize: 'vertical' }} />
              </div>
            )}
            <button className="pol-btn-secondary pol-btn-sm" disabled={!newQ.text.trim()} onClick={addQuestion}>
              + Add Question
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="pol-btn-ghost pol-btn-sm" onClick={() => setStep(1)}>← Back</button>
            <button className="pol-btn-primary pol-btn-sm" disabled={questions.length === 0} onClick={() => setStep(3)}>
              Next: Distribute →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h4 style={{ marginBottom: 8 }}>Distribute Survey</h4>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 20 }}>
            Your survey "{form.title}" has {questions.length} question{questions.length !== 1 ? 's' : ''}. Save and publish to start collecting responses.
          </p>
          <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Share Link', desc: 'Add survey URL to your website and bio links' },
              { label: 'Email Campaign', desc: 'Send to your constituent email list' },
              { label: 'SMS Outreach', desc: 'Text message to supporters and volunteers' },
              { label: 'Social Media', desc: 'Post on Facebook, Instagram, and Twitter/X' },
            ].map(({ label, desc }) => (
              <div key={label} style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{desc}</div>
                </div>
                <button className="pol-btn-secondary pol-btn-sm" style={{ marginLeft: 'auto', flexShrink: 0 }}>Set Up</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="pol-btn-ghost pol-btn-sm" onClick={() => setStep(2)}>← Back</button>
            <button className="pol-btn-secondary pol-btn-sm" onClick={handleSave}>Save as Draft</button>
            <button className="pol-btn-primary pol-btn-sm" onClick={() => {
              handleSave();
            }}>Publish Survey</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PoliticianPolls() {
  const [view, setView] = useState<View>('library');
  const [surveys, setSurveys] = useState<Survey[]>(demoSurveys);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [sharingSurvey, setSharingSurvey] = useState<Survey | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleCloseSurvey = (id: string) => {
    setSurveys((prev) => prev.map((s) => s.id === id ? { ...s, status: 'closed' as const } : s));
    setSelectedSurvey((prev) => prev && prev.id === id ? { ...prev, status: 'closed' as const } : prev);
  };

  const activeCount = surveys.filter((s) => s.status === 'active').length;
  const totalResponses = surveys.reduce((s, sv) => s + sv.responseCount, 0);
  const closedCount = surveys.filter((s) => s.status === 'closed').length;

  const handleSaveSurvey = (survey: Survey) => {
    setSurveys((prev) => [survey, ...prev]);
    setSelectedSurvey(survey);
    setView('library');
  };

  return (
    <div>
      <div className="pol-page-header">
        <div className="pol-header-left">
          <h1>Polls &amp; Surveys</h1>
          <p>Create constituent surveys, collect responses, and use AI to extract key themes.</p>
        </div>
        <div className="pol-header-actions">
          {view === 'create' && <button className="pol-btn-ghost pol-btn-sm" onClick={() => setView('library')}>Back to Library</button>}
          <button className="pol-btn-primary pol-btn-sm" onClick={() => setView('create')}>Create Survey</button>
        </div>
      </div>

      {view !== 'create' && (
        <div className="pol-stat-grid" style={{ marginBottom: 20 }}>
          <div className="pol-stat-card">
            <span className="pol-stat-label">Active Surveys</span>
            <span className="pol-stat-value">{activeCount}</span>
            <span className="pol-stat-sub">Collecting responses</span>
          </div>
          <div className="pol-stat-card">
            <span className="pol-stat-label">Total Responses</span>
            <span className="pol-stat-value">{totalResponses.toLocaleString()}</span>
            <span className="pol-stat-sub">Across all surveys</span>
          </div>
          <div className="pol-stat-card">
            <span className="pol-stat-label">Surveys Created</span>
            <span className="pol-stat-value">{surveys.length}</span>
            <span className="pol-stat-sub">{closedCount} closed</span>
          </div>
          <div className="pol-stat-card">
            <span className="pol-stat-label">Avg. Responses</span>
            <span className="pol-stat-value">{surveys.length > 0 ? Math.round(totalResponses / surveys.length) : 0}</span>
            <span className="pol-stat-sub">Per survey</span>
          </div>
        </div>
      )}

      {view === 'create' && (
        <SurveyBuilder onSave={handleSaveSurvey} onCancel={() => setView('library')} />
      )}

      {view === 'library' && (
        <div className="pol-sidebar-layout" style={{ alignItems: 'start' }}>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div className="pol-record-list">
              {surveys.map((survey) => (
                <div
                  key={survey.id}
                  className={`pol-record-item${selectedSurvey?.id === survey.id ? ' selected' : ''}`}
                  onClick={() => setSelectedSurvey(survey)}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                      <span className={`pol-badge ${STATUS_COLORS[survey.status]}`}>{survey.status}</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{survey.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>{survey.questions.length} questions · {survey.responseCount} responses</div>
                    {survey.createdAt && <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 2 }}>Created {survey.createdAt}</div>}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-brand, #6B5DE6)' }}>{survey.responseCount}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>responses</div>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="pol-card"
              style={{ display: 'grid', placeItems: 'center', minHeight: 80, border: '2px dashed var(--border)', background: 'transparent', cursor: 'pointer' }}
              onClick={() => setView('create')}
            >
              <button className="pol-btn-primary pol-btn-sm">+ Create Survey</button>
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            {selectedSurvey ? (
              <SurveyResultsPanel survey={selectedSurvey} onToast={showToast} onShare={setSharingSurvey} onClose={handleCloseSurvey} />
            ) : (
              <div className="pol-card" style={{ display: 'grid', placeItems: 'center', minHeight: 300, color: 'var(--muted)', textAlign: 'center' }}>
                <div>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--border-strong)', marginBottom: 12 }}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  <p>Select a survey to view results and AI-extracted themes.</p>
                  <button className="pol-btn-primary pol-btn-sm" style={{ marginTop: 12 }} onClick={() => setView('create')}>Create Your First Survey</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {sharingSurvey && <ShareSurveyModal survey={sharingSurvey} onClose={() => setSharingSurvey(null)} />}
      {toast && <SuccessToast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
