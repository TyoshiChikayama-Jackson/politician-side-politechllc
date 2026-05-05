import { useState } from 'react';
import {
  demoPolitician,
  demoContributions,
  demoExpenses,
  demoVolunteers,
  demoFECFilings,
  demoMessages,
  demoCampaignPosts,
} from '../../data/politicianData';

const today = new Date('2026-05-05');
const electionDate = new Date(demoPolitician.electionDate);
const daysUntilElection = Math.ceil((electionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

const totalRaised = demoContributions.reduce((s, c) => s + c.amount, 0);
const mtdContributions = demoContributions.filter((c) => c.date.startsWith('2024-04') || c.date.startsWith('2024-05'));
const mtdRaised = mtdContributions.reduce((s, c) => s + c.amount, 0);
const totalVolunteerHours = demoVolunteers.reduce((s, v) => s + v.totalHours, 0);
const goalPct = Math.min(100, Math.round((totalRaised / demoPolitician.fundraisingGoal) * 100));

const recentActivity = [
  { label: 'Priya Nair donated $2,500', time: '2 hours ago', color: 'green' },
  { label: 'New message from Janet Torres re: HB 1042', time: '4 hours ago', color: 'blue' },
  { label: 'Amara Johnson logged 4 volunteer hours', time: '1 day ago', color: 'purple' },
  { label: 'Helen Russo donated $3,000', time: '2 days ago', color: 'green' },
  { label: 'Spring Fundraiser shift completed — 3 volunteers', time: '3 days ago', color: 'purple' },
  { label: 'Post published: HB 1042 Education Statement', time: '4 days ago', color: 'blue' },
];

export function PoliticianOverview() {
  const [showNewPost, setShowNewPost] = useState(false);

  const upcomingFiling = demoFECFilings.find((f) => f.status === 'upcoming');
  const unreadMessages = demoMessages.filter((m) => m.status === 'unread').length;
  const violationCount = demoContributions.filter((c) => c.complianceStatus === 'violation').length;

  return (
    <div>
      {/* Page Header */}
      <div className="pol-page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className={`pol-badge ${demoPolitician.party.toLowerCase()}`}>{demoPolitician.party}</span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>{demoPolitician.district}</span>
            </div>
            <h1>Welcome back, {demoPolitician.name.split(' ')[0]}.</h1>
            <p>{demoPolitician.office} · {demoPolitician.state} · {demoPolitician.campaignName}</p>
          </div>
          <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{daysUntilElection}</div>
            <div>days until election</div>
          </div>
        </div>

        {/* Fundraising thermometer */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>
            <span>Fundraising Goal</span>
            <span>${totalRaised.toLocaleString()} of ${demoPolitician.fundraisingGoal.toLocaleString()} ({goalPct}%)</span>
          </div>
          <div className="pol-thermometer">
            <div className="pol-thermometer-fill" style={{ width: `${goalPct}%` }} />
          </div>
        </div>

        <div className="pol-header-actions">
          <button className="pol-btn-primary pol-btn-sm">+ New Post</button>
          <button className="pol-btn-secondary pol-btn-sm">+ Add Donor</button>
          <button className="pol-btn-secondary pol-btn-sm">Log Expense</button>
          <button className="pol-btn-secondary pol-btn-sm">Send Email Blast</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="pol-stat-grid">
        <div className="pol-stat-card">
          <span className="pol-stat-label">Total Donors</span>
          <span className="pol-stat-value">20</span>
          <span className="pol-stat-sub">+3 this month</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Funds Raised (MTD)</span>
          <span className="pol-stat-value">${(mtdRaised / 1000).toFixed(1)}K</span>
          <span className="pol-stat-sub">${totalRaised.toLocaleString()} total cycle</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Volunteer Hours</span>
          <span className="pol-stat-value">{totalVolunteerHours}</span>
          <span className="pol-stat-sub">Across {demoVolunteers.length} volunteers</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">PoliCred Score</span>
          <span className="pol-stat-value">84</span>
          <span className="pol-stat-sub">+2 pts this month</span>
        </div>
      </div>

      {/* Alerts & Activity */}
      <div className="pol-grid-2" style={{ marginBottom: 20 }}>
        {/* Alerts Panel */}
        <div className="pol-card">
          <h3>⚠️ Alerts</h3>

          {violationCount > 0 && (
            <div className="pol-alert danger">
              <span className="pol-alert-icon">🚨</span>
              <div className="pol-alert-body">
                <strong>FEC Compliance Violation</strong>
                <p>{violationCount} contribution(s) exceed state limits and require refund processing.</p>
              </div>
            </div>
          )}

          {upcomingFiling && (
            <div className="pol-alert warning">
              <span className="pol-alert-icon">📅</span>
              <div className="pol-alert-body">
                <strong>Filing Deadline: {upcomingFiling.dueDate}</strong>
                <p>{upcomingFiling.period} — {upcomingFiling.formType}</p>
              </div>
            </div>
          )}

          {unreadMessages > 0 && (
            <div className="pol-alert info">
              <span className="pol-alert-icon">📬</span>
              <div className="pol-alert-body">
                <strong>{unreadMessages} Unanswered Constituent Messages</strong>
                <p>Constituents are waiting for a response.</p>
              </div>
            </div>
          )}

          <div className="pol-alert warning">
            <span className="pol-alert-icon">⚠️</span>
            <div className="pol-alert-body">
              <strong>Employer/Occupation Missing on 2 Donors</strong>
              <p>Required for contributions over $200 per FEC rules.</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="pol-card">
          <h3>📡 Recent Activity</h3>
          <div className="pol-activity-feed">
            {recentActivity.map((item, i) => (
              <div key={i} className="pol-activity-item">
                <div className={`pol-activity-dot ${item.color}`} />
                <div className="pol-activity-content">
                  <strong>{item.label}</strong>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Post Analytics Preview */}
      <div className="pol-grid-2">
        <div className="pol-card">
          <h3>📊 Recent Post Performance</h3>
          <div className="pol-record-list">
            {demoCampaignPosts.filter((p) => p.status === 'published').slice(0, 3).map((post) => (
              <div key={post.id} className="pol-record-item" style={{ cursor: 'default' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.body.slice(0, 60)}...
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: 'var(--muted)' }}>
                    <span>👁 {post.views.toLocaleString()}</span>
                    <span>❤️ {post.likes}</span>
                    <span>🔁 {post.shares}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
                {post.topicTag && <span className="pol-badge in-progress">{post.topicTag}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="pol-card">
          <h3>🗓️ FEC Filing Calendar</h3>
          <div className="pol-record-list">
            {demoFECFilings.map((filing) => (
              <div key={filing.id} className="pol-record-item" style={{ cursor: 'default' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{filing.period}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Due: {filing.dueDate}</div>
                </div>
                <span className={`pol-badge ${filing.status === 'filed' ? 'passed' : filing.status === 'overdue' ? 'failed' : 'in-progress'}`}>
                  {filing.status === 'filed' ? 'Filed' : filing.status === 'overdue' ? 'Overdue' : 'Upcoming'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
