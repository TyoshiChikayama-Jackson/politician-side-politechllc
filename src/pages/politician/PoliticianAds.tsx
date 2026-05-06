import { useState, useMemo } from 'react';
import type { AdCampaign, AdPlatform, AdGoal, AdVariant } from '../../types';
import { demoAds } from '../../data/politicianData';

type View = 'library' | 'create';
type CreateStep = 1 | 2 | 3 | 4;

const PLATFORMS: AdPlatform[] = ['Facebook', 'Instagram', 'Google', 'Twitter/X', 'Direct Mail', 'Email', 'TV/Radio'];
const GOALS: AdGoal[] = ['Fundraising', 'Voter Outreach', 'GOTV', 'Awareness', 'Event Promotion', 'Opposition Research Response'];
const TONES = ['Professional', 'Urgent', 'Hopeful', 'Conversational', 'Bold'] as const;

const PLATFORM_CHAR_LIMITS: Record<AdPlatform, { headline: number; body: number }> = {
  Facebook: { headline: 40, body: 125 },
  Instagram: { headline: 40, body: 150 },
  Google: { headline: 30, body: 90 },
  'Twitter/X': { headline: 30, body: 280 },
  'Direct Mail': { headline: 80, body: 500 },
  Email: { headline: 100, body: 1000 },
  'TV/Radio': { headline: 100, body: 800 },
};


const STATUS_COLORS: Record<AdCampaign['status'], string> = {
  draft: 'pending',
  active: 'passed',
  paused: 'warning',
  completed: 'in-progress',
};

function CharCounter({ current, max }: { current: number; max: number }) {
  const pct = current / max;
  const color = pct > 1 ? '#ef4444' : pct > 0.85 ? '#f59e0b' : 'var(--muted)';
  return <span style={{ fontSize: '0.75rem', color }}>{current}/{max}</span>;
}

function ComplianceBanner() {
  return (
    <div style={{ padding: '10px 16px', borderRadius: 10, background: 'rgba(107,93,230,0.08)', border: '1px solid var(--navy-border)', fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.5, marginBottom: 16 }}>
      <strong>FEC Compliance Notice:</strong> All political advertisements must include a paid-for disclaimer ("Paid for by Williams for Indiana House. Sandra K. Moore, Treasurer."). Digital ads must also include the name of the political committee. Ensure all generated copy includes required attribution before publication.
    </div>
  );
}

function AdLibrary({
  ads,
  onSelect,
  onCreateNew,
}: {
  ads: AdCampaign[];
  onSelect: (ad: AdCampaign) => void;
  onCreateNew: () => void;
}) {
  const [selectedAd, setSelectedAd] = useState<AdCampaign | null>(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const handleSelect = (ad: AdCampaign) => {
    setSelectedAd(ad);
    setSelectedVariantIdx(0);
    onSelect(ad);
  };

  const activeCount = ads.filter((a) => a.status === 'active').length;
  const totalImpressions = ads.reduce((s, a) => s + (a.impressions || 0), 0);
  const totalClicks = ads.reduce((s, a) => s + (a.clicks || 0), 0);
  const totalConversions = ads.reduce((s, a) => s + (a.conversions || 0), 0);

  return (
    <div>
      <div className="pol-stat-grid" style={{ marginBottom: 20 }}>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Ad Campaigns</span>
          <span className="pol-stat-value">{ads.length}</span>
          <span className="pol-stat-sub">{activeCount} active</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Impressions</span>
          <span className="pol-stat-value">{totalImpressions.toLocaleString()}</span>
          <span className="pol-stat-sub">Total reach</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Clicks</span>
          <span className="pol-stat-value">{totalClicks.toLocaleString()}</span>
          <span className="pol-stat-sub">{totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00'}% CTR</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Conversions</span>
          <span className="pol-stat-value">{totalConversions}</span>
          <span className="pol-stat-sub">Donations / sign-ups</span>
        </div>
      </div>

      <div className="pol-sidebar-layout" style={{ alignItems: 'start' }}>
        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <div className="pol-record-list">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className={`pol-record-item${selectedAd?.id === ad.id ? ' selected' : ''}`}
                onClick={() => handleSelect(ad)}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600 }}>{ad.platform}</span>
                    <span className={`pol-badge ${STATUS_COLORS[ad.status]}`}>{ad.status}</span>
                    {!ad.complianceApproved && <span className="pol-badge failed" style={{ fontSize: '0.7rem' }}>Needs Review</span>}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>{ad.goal} · {ad.variants.length} variants</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {ad.impressions != null && <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-brand, #6B5DE6)' }}>{ad.impressions.toLocaleString()} impr.</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="pol-card" style={{ display: 'grid', placeItems: 'center', minHeight: 80, border: '2px dashed var(--border)', background: 'transparent', cursor: 'pointer' }} onClick={onCreateNew}>
            <button className="pol-btn-primary pol-btn-sm">+ Create New Ad</button>
          </div>
        </div>

        <div style={{ minWidth: 0 }}>
          {selectedAd ? (
            <div className="pol-card">
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  <span className="pol-badge in-progress">{selectedAd.platform}</span>
                  <span className={`pol-badge ${STATUS_COLORS[selectedAd.status]}`}>{selectedAd.status}</span>
                  {!selectedAd.complianceApproved && <span className="pol-badge failed">Compliance Pending</span>}
                </div>
                <h3 style={{ margin: 0 }}>{selectedAd.name}</h3>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>Goal: {selectedAd.goal} · Tone: {selectedAd.tone}</div>
              </div>

              {selectedAd.impressions != null && (
                <div className="pol-card-dark" style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    <div><div className="pol-stat-label">Impressions</div><div className="pol-stat-value">{selectedAd.impressions?.toLocaleString()}</div></div>
                    <div><div className="pol-stat-label">Clicks</div><div className="pol-stat-value">{selectedAd.clicks?.toLocaleString()}</div></div>
                    <div><div className="pol-stat-label">CTR</div><div className="pol-stat-value">{selectedAd.impressions ? ((selectedAd.clicks || 0) / selectedAd.impressions * 100).toFixed(2) : '0'}%</div></div>
                    {selectedAd.conversions != null && <div><div className="pol-stat-label">Conversions</div><div className="pol-stat-value">{selectedAd.conversions}</div></div>}
                  </div>
                </div>
              )}

              <ComplianceBanner />

              <div style={{ marginBottom: 12 }}>
                <div className="info-label" style={{ marginBottom: 8 }}>Ad Variants</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {selectedAd.variants.map((v, i) => (
                    <button
                      key={v.id}
                      className={selectedVariantIdx === i ? 'pol-btn-primary pol-btn-sm' : 'pol-btn-ghost pol-btn-sm'}
                      onClick={() => setSelectedVariantIdx(i)}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
                {selectedAd.variants[selectedVariantIdx] && (
                  <div style={{ padding: '16px 18px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surfaceSoft, #f8f9fc)' }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 8, color: 'var(--text)' }}>
                      {selectedAd.variants[selectedVariantIdx].headline}
                    </div>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text)', margin: '0 0 12px' }}>
                      {selectedAd.variants[selectedVariantIdx].body}
                    </p>
                    <div style={{ display: 'inline-block', padding: '6px 18px', borderRadius: 999, background: 'var(--grad-purple)', color: 'white', fontWeight: 700, fontSize: '0.88rem' }}>
                      {selectedAd.variants[selectedVariantIdx].cta}
                    </div>
                    <div style={{ marginTop: 12, fontSize: '0.72rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                      Paid for by Williams for Indiana House. Sandra K. Moore, Treasurer.
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="pol-btn-secondary pol-btn-sm">Copy Text</button>
                <button className="pol-btn-secondary pol-btn-sm">Export</button>
                <button className="pol-btn-secondary pol-btn-sm">Mark Approved</button>
              </div>
            </div>
          ) : (
            <div className="pol-card" style={{ display: 'grid', placeItems: 'center', minHeight: 300, color: 'var(--muted)', textAlign: 'center' }}>
              <div>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#D1D5DB', marginBottom: 12 }}><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                <p>Select an ad campaign to review variants and performance.</p>
                <button className="pol-btn-primary pol-btn-sm" style={{ marginTop: 12 }} onClick={onCreateNew}>Create New Ad</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdCreator({ onSave, onCancel }: { onSave: (ad: AdCampaign) => void; onCancel: () => void }) {
  const [step, setStep] = useState<CreateStep>(1);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    platform: 'Facebook' as AdPlatform,
    goal: 'Fundraising' as AdGoal,
    targetAudience: '',
    keyMessage: '',
    tone: 'Hopeful' as typeof TONES[number],
    budget: '',
  });
  const [variants, setVariants] = useState<AdVariant[]>([]);

  const limits = PLATFORM_CHAR_LIMITS[form.platform];

  const generateVariants = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: form.platform,
          goal: form.goal,
          tone: form.tone,
          audience: form.targetAudience,
          keyMessage: form.keyMessage,
          headlineLimit: limits.headline,
          bodyLimit: limits.body,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setVariants(data.variants);
    } catch {
      const fallbackVariants: AdVariant[] = [
        {
          id: `var-${Date.now()}-a`,
          label: 'Variant A — Community',
          headline: 'Fighting for District 42 Families',
          body: `Marcus Williams has delivered real results for our community. ${form.keyMessage || 'Support his campaign today and help us finish what we started.'}`,
          cta: form.goal === 'Fundraising' ? 'Donate Now' : form.goal === 'GOTV' ? 'Vote Today' : 'Learn More',
          charCount: 0,
        },
        {
          id: `var-${Date.now()}-b`,
          label: 'Variant B — Issues',
          headline: 'Real Results for Real Hoosiers',
          body: `Healthcare. Schools. Affordable housing. Marcus Williams has fought for every one of these issues — and he needs your support to keep going.`,
          cta: form.goal === 'Fundraising' ? 'Support Marcus' : form.goal === 'GOTV' ? 'Make Your Voice Heard' : 'Get Involved',
          charCount: 0,
        },
        {
          id: `var-${Date.now()}-c`,
          label: 'Variant C — Urgency',
          headline: "Don't Let Progress Stop Here",
          body: `The work isn't done in District 42. Marcus Williams is counting on you. ${form.goal === 'Fundraising' ? 'Every dollar makes a difference before the deadline.' : 'Every vote matters on Election Day.'}`,
          cta: form.goal === 'Fundraising' ? 'Double My Impact' : form.goal === 'GOTV' ? 'Vote Now' : 'Take Action',
          charCount: 0,
        },
      ].map((v) => ({ ...v, charCount: v.headline.length + v.body.length }));
      setVariants(fallbackVariants);
    } finally {
      setGenerating(false);
      setStep(3);
    }
  };

  const handleSave = () => {
    const ad: AdCampaign = {
      id: `ad-${Date.now()}`,
      name: form.name,
      platform: form.platform,
      goal: form.goal,
      targetAudience: form.targetAudience,
      keyMessage: form.keyMessage,
      tone: form.tone,
      variants,
      status: 'draft',
      createdAt: new Date().toISOString().slice(0, 10),
      budget: Number(form.budget) || undefined,
      complianceApproved: false,
    };
    onSave(ad);
  };

  return (
    <div className="pol-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0 }}>Ad Creative Generator</h3>
        <button className="pol-btn-ghost pol-btn-sm" onClick={onCancel}>← Back to Library</button>
      </div>

      {/* Step progress */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[1, 2, 3, 4].map((s) => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 999, background: step >= s ? 'var(--grad-purple)' : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 24 }}>
        {['1. Setup', '2. Generate', '3. Review', '4. Save'].map((label, i) => (
          <span key={label} style={{ fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? 'var(--color-brand, #6B5DE6)' : 'var(--muted)' }}>{label}</span>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h4 style={{ marginBottom: 16 }}>Campaign Setup</h4>
          <div className="pol-field-group">
            <label>Campaign Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Spring Fundraising Push — Facebook" />
          </div>
          <div className="pol-form-row">
            <div className="pol-field-group">
              <label>Platform</label>
              <select value={form.platform} onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value as AdPlatform }))}>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="pol-field-group">
              <label>Goal</label>
              <select value={form.goal} onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value as AdGoal }))}>
                {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
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
            <label>Target Audience</label>
            <input value={form.targetAudience} onChange={(e) => setForm((f) => ({ ...f, targetAudience: e.target.value }))} placeholder="e.g. District 42 Democrats and independents, ages 35-65, homeowners" />
          </div>
          <div className="pol-field-group">
            <label>Key Message *</label>
            <textarea value={form.keyMessage} onChange={(e) => setForm((f) => ({ ...f, keyMessage: e.target.value }))} placeholder="What is the single most important thing you want voters to know or do?" style={{ minHeight: 80, resize: 'vertical' }} />
          </div>
          <div className="pol-field-group">
            <label>Budget (optional)</label>
            <input type="number" value={form.budget} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))} placeholder="$" />
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--purple-dim)', border: '1px solid var(--navy-border)', fontSize: '0.82rem', color: 'var(--text)', marginBottom: 20 }}>
            <strong>{form.platform} character limits:</strong> Headline: {limits.headline} chars · Body: {limits.body} chars
          </div>
          <button className="pol-btn-primary pol-btn-sm" disabled={!form.name || !form.keyMessage} onClick={() => setStep(2)}>
            Next: Generate Variants →
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h4 style={{ marginBottom: 8 }}>Ready to Generate 3 Ad Variants</h4>
          <p style={{ color: 'var(--muted)', marginBottom: 8, fontSize: '0.9rem' }}>
            Platform: <strong>{form.platform}</strong> · Goal: <strong>{form.goal}</strong> · Tone: <strong>{form.tone}</strong>
          </p>
          <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: '0.88rem', maxWidth: 400, margin: '0 auto 24px' }}>
            Claude AI will generate 3 unique ad copy variants optimized for {form.platform} character limits, tailored to your goal and audience.
          </p>
          <ComplianceBanner />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="pol-btn-ghost pol-btn-sm" onClick={() => setStep(1)}>← Back</button>
            <button className="pol-ai-btn" onClick={generateVariants} disabled={generating}>
              {generating ? 'Generating...' : 'Generate 3 Variants with AI'}
            </button>
          </div>
          {generating && (
            <div style={{ marginTop: 24 }}>
              <div className="pol-skeleton pol-skeleton-pulse" style={{ height: 80, borderRadius: 10, marginBottom: 8 }} />
              <div className="pol-skeleton pol-skeleton-pulse" style={{ height: 80, borderRadius: 10, marginBottom: 8 }} />
              <div className="pol-skeleton pol-skeleton-pulse" style={{ height: 80, borderRadius: 10 }} />
            </div>
          )}
        </div>
      )}

      {step === 3 && variants.length > 0 && (
        <div>
          <h4 style={{ marginBottom: 8 }}>Review & Edit Variants</h4>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 16 }}>Edit any variant below. Character limits are enforced for {form.platform}.</p>
          <ComplianceBanner />
          <div style={{ display: 'grid', gap: 16 }}>
            {variants.map((variant, i) => (
              <div key={variant.id} style={{ padding: '16px 18px', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-brand, #6B5DE6)' }}>{variant.label}</strong>
                </div>
                <div className="pol-field-group" style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>Headline</label>
                    <CharCounter current={variant.headline.length} max={limits.headline} />
                  </div>
                  <input
                    value={variant.headline}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[i] = { ...updated[i], headline: e.target.value };
                      setVariants(updated);
                    }}
                    maxLength={limits.headline}
                  />
                </div>
                <div className="pol-field-group" style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>Body Copy</label>
                    <CharCounter current={variant.body.length} max={limits.body} />
                  </div>
                  <textarea
                    value={variant.body}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[i] = { ...updated[i], body: e.target.value };
                      setVariants(updated);
                    }}
                    maxLength={limits.body}
                    style={{ minHeight: 80, resize: 'vertical' }}
                  />
                </div>
                <div className="pol-field-group" style={{ marginBottom: 0 }}>
                  <label>Call to Action</label>
                  <input
                    value={variant.cta}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[i] = { ...updated[i], cta: e.target.value };
                      setVariants(updated);
                    }}
                  />
                </div>
                <div style={{ marginTop: 10, fontSize: '0.72rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                  Paid for by Williams for Indiana House. Sandra K. Moore, Treasurer.
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className="pol-btn-ghost pol-btn-sm" onClick={() => setStep(2)}>← Regenerate</button>
            <button className="pol-btn-primary pol-btn-sm" onClick={() => setStep(4)}>Next: Save & Export →</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h4 style={{ marginBottom: 8 }}>Save & Export</h4>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 16 }}>Your ad campaign is ready. Save it to your Ad Library, then export for upload to {form.platform}.</p>
          <ComplianceBanner />
          <div style={{ padding: '16px 18px', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 20 }}>
            <div className="info-label" style={{ marginBottom: 8 }}>Campaign Summary</div>
            <div style={{ display: 'grid', gap: 6, fontSize: '0.88rem' }}>
              <div><strong>Name:</strong> {form.name}</div>
              <div><strong>Platform:</strong> {form.platform}</div>
              <div><strong>Goal:</strong> {form.goal}</div>
              <div><strong>Variants:</strong> {variants.length} ad copies</div>
              {form.budget && <div><strong>Budget:</strong> ${Number(form.budget).toLocaleString()}</div>}
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

export function PoliticianAds() {
  const [view, setView] = useState<View>('library');
  const [ads, setAds] = useState<AdCampaign[]>(demoAds);
  const [_selectedAd, setSelectedAd] = useState<AdCampaign | null>(null);

  const handleSaveAd = (ad: AdCampaign) => {
    setAds((prev) => [ad, ...prev]);
    setView('library');
  };

  return (
    <div>
      <div className="pol-page-header">
        <div className="pol-header-left">
          <h1>Ad Creator</h1>
          <p>Generate AI-powered political ad copy for any platform. Review 3 variants, edit to fit character limits, and export with FEC compliance notices.</p>
        </div>
        <div className="pol-header-actions">
          {view === 'create' && <button className="pol-btn-ghost pol-btn-sm" onClick={() => setView('library')}>Back to Library</button>}
          <button className="pol-btn-primary pol-btn-sm" onClick={() => setView('create')}>Create New Ad</button>
        </div>
      </div>

      {view === 'library' && (
        <AdLibrary ads={ads} onSelect={setSelectedAd} onCreateNew={() => setView('create')} />
      )}

      {view === 'create' && (
        <AdCreator onSave={handleSaveAd} onCancel={() => setView('library')} />
      )}
    </div>
  );
}
