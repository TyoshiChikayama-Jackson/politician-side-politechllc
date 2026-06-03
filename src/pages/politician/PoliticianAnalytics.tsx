import { useMemo, useState } from 'react';
import { demoDonors, demoContributions, demoCampaignPosts, demoVolunteers, demoPolitician } from '../../data/politicianData';

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

function downloadCSV(rows: string[][], filename: string) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = filename;
  a.click();
}

const POLIPOINT_SCORES = {
  votingAlignment: 91,
  responsiveness: 78,
  transparency: 88,
  overallPoliCred: 84,
};

const MONTHLY_FUNDRAISING = [
  { month: 'Jan', amount: 8200 },
  { month: 'Feb', amount: 12400 },
  { month: 'Mar', amount: 9800 },
  { month: 'Apr', amount: 11600 },
  { month: 'May', amount: 4200 },
];

const COUNTY_DATA = [
  { county: 'Marion', amount: 28400, donors: 14 },
  { county: 'Hamilton', amount: 4200, donors: 2 },
  { county: 'Delaware', amount: 2000, donors: 1 },
  { county: 'Lake', amount: 750, donors: 1 },
  { county: 'St. Joseph', amount: 500, donors: 1 },
  { county: 'Other', amount: 350, donors: 1 },
];

function SimpleBarChart({ data }: { data: { label: string; value: number; max: number }[] }) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {data.map((item) => (
        <div key={item.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
            <span style={{ fontWeight: 600, color: 'var(--chart-primary, #4F46E5)', fontVariantNumeric: 'tabular-nums' }}>{item.value}</span>
          </div>
          <div className="pol-progress-track">
            <div className="pol-progress-fill" style={{ width: `${(item.value / item.max) * 100}%`, background: 'var(--chart-primary)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PoliticianAnalytics() {
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const totalRaised = useMemo(() => demoContributions.reduce((s, c) => s + c.amount, 0), []);
  const avgDonation = useMemo(() => totalRaised / demoContributions.length, [totalRaised]);
  const goalPct = Math.round((totalRaised / demoPolitician.fundraisingGoal) * 100);
  const totalVolHours = useMemo(() => demoVolunteers.reduce((s, v) => s + v.totalHours, 0), []);
  const totalReach = useMemo(() => demoCampaignPosts.reduce((s, p) => s + p.views, 0), []);
  const totalEngagement = useMemo(() => demoCampaignPosts.reduce((s, p) => s + p.likes + p.shares + p.comments, 0), []);

  const maxMonthly = Math.max(...MONTHLY_FUNDRAISING.map((m) => m.amount));

  return (
    <div>
      <div className="pol-page-header">
        <div className="pol-header-left">
          <h1>Analytics</h1>
          <p>Insights into your donor base, campaign reach, volunteer activity, and PoliCred score.</p>
        </div>
        <div className="pol-header-actions">
          <button className="pol-btn-primary pol-btn-sm" onClick={() => {
            downloadCSV(
              [
                ['Month', 'Amount'],
                ...MONTHLY_FUNDRAISING.map((m) => [m.month, String(m.amount)]),
                [],
                ['County', 'Amount', 'Donors'],
                ...COUNTY_DATA.map((c) => [c.county, String(c.amount), String(c.donors)]),
                [],
                ['Volunteer', 'Hours'],
                ...demoVolunteers.map((v) => [`${v.firstName} ${v.lastName}`, String(v.totalHours)]),
              ],
              'analytics-report.csv'
            );
            showToast('Analytics report exported as CSV.');
          }}>Export PDF Report</button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="pol-stat-grid" style={{ marginBottom: 24 }}>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Total Raised</span>
          <span className="pol-stat-value">${(totalRaised / 1000).toFixed(1)}K</span>
          <span className="pol-stat-sub">{goalPct}% of ${(demoPolitician.fundraisingGoal / 1000).toFixed(0)}K goal</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Avg Donation</span>
          <span className="pol-stat-value">${Math.round(avgDonation).toLocaleString()}</span>
          <span className="pol-stat-sub">{demoContributions.length} total contributions</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Constituent Reach</span>
          <span className="pol-stat-value">{(totalReach / 1000).toFixed(1)}K</span>
          <span className="pol-stat-sub">Profile + post views</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Engagement</span>
          <span className="pol-stat-value">{totalEngagement.toLocaleString()}</span>
          <span className="pol-stat-sub">Likes, shares, comments</span>
        </div>
      </div>

      <div className="pol-grid-2" style={{ marginBottom: 24 }}>
        {/* Fundraising Over Time */}
        <div className="pol-card">
          <h3>Funds Raised by Month — 2024</h3>
          <div style={{ marginBottom: 20 }}>
            <SimpleBarChart
              data={MONTHLY_FUNDRAISING.map((m) => ({
                label: m.month,
                value: m.amount,
                max: maxMonthly,
              }))}
            />
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: '0.83rem', color: 'var(--muted)' }}>
            <span>Peak: April ($11,600)</span>
            <span>Total YTD: ${totalRaised.toLocaleString()}</span>
          </div>
        </div>

        {/* PoliCred Score */}
        <div className="pol-cred-card">
          <div className="pol-cred-label">PoliCred Score</div>
          <div className="pol-cred-score">{POLIPOINT_SCORES.overallPoliCred}</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginBottom: 20 }}>Out of 100 · Updated daily</div>

          <div className="pol-cred-breakdown">
            {[
              { label: 'Voting Record Alignment', value: POLIPOINT_SCORES.votingAlignment },
              { label: 'Constituent Responsiveness', value: POLIPOINT_SCORES.responsiveness },
              { label: 'Transparency Score', value: POLIPOINT_SCORES.transparency },
            ].map((item) => (
              <div key={item.label}>
                <div className="pol-cred-row">
                  <span className="pol-cred-row-label">{item.label}</span>
                  <span className="pol-cred-row-value">{item.value}/100</span>
                </div>
                <div className="pol-progress-track" style={{ marginTop: 6 }}>
                  <div className="pol-progress-fill" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pol-grid-3" style={{ marginBottom: 24 }}>
        {/* Donor Geography */}
        <div className="pol-card">
          <h3>Donor Geographic Distribution</h3>
          <div style={{ display: 'grid', gap: 10, marginBottom: 8 }}>
            {COUNTY_DATA.map((county) => (
              <div key={county.county} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{county.county} Co.</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{county.donors} donor{county.donors !== 1 ? 's' : ''}</div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--color-brand, #4F46E5)', fontSize: '0.92rem' }}>
                  ${county.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Marion County represents 78% of total fundraising.</p>
        </div>

        {/* PoliFeed Performance */}
        <div className="pol-card">
          <h3>PoliFeed Post Performance</h3>
          <div className="pol-record-list">
            {demoCampaignPosts.filter((p) => p.status === 'published').map((post) => (
              <div key={post.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text)', marginBottom: 6, lineHeight: 1.4 }}>
                  {post.body.slice(0, 55)}...
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: 'var(--muted)' }}>
                  <span>{post.views.toLocaleString()} views</span>
                  <span>{post.likes} likes</span>
                  <span>{post.shares} shares</span>
                  <span>{post.comments} comments</span>
                </div>
                {post.topicTag && (
                  <span className="pol-badge in-progress" style={{ marginTop: 6, display: 'inline-flex', fontSize: '0.72rem' }}>{post.topicTag}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Metrics */}
        <div className="pol-card">
          <h3>Volunteer Activity</h3>
          <div style={{ marginBottom: 16 }}>
            <SimpleBarChart
              data={demoVolunteers.map((v) => ({
                label: `${v.firstName} ${v.lastName.charAt(0)}.`,
                value: v.totalHours,
                max: Math.max(...demoVolunteers.map((v2) => v2.totalHours)),
              }))}
            />
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.83rem', color: 'var(--muted)' }}>
            <span>Total: {totalVolHours}h</span>
            <span>Avg: {Math.round(totalVolHours / demoVolunteers.length)}h/volunteer</span>
          </div>
        </div>
      </div>

      {/* Campaign Goal Progress */}
      <div className="pol-card">
        <h3>Fundraising Goal Progress</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--muted)' }}>Progress toward ${demoPolitician.fundraisingGoal.toLocaleString()} goal</span>
          <span style={{ fontWeight: 700, color: 'var(--color-brand, #4F46E5)' }}>${totalRaised.toLocaleString()} ({goalPct}%)</span>
        </div>
        <div className="pol-thermometer" style={{ height: 16, marginBottom: 12 }}>
          <div className="pol-thermometer-fill" style={{ width: `${goalPct}%` }} />
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--muted)' }}>
          <span>Raised: <strong style={{ color: 'var(--text)' }}>${totalRaised.toLocaleString()}</strong></span>
          <span>Remaining: <strong style={{ color: 'var(--text)' }}>${(demoPolitician.fundraisingGoal - totalRaised).toLocaleString()}</strong></span>
          <span>New Donors (MTD): <strong style={{ color: 'var(--text)' }}>3</strong></span>
          <span>Returning Donors: <strong style={{ color: 'var(--text)' }}>17</strong></span>
        </div>
      </div>

      {toast && <SuccessToast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
