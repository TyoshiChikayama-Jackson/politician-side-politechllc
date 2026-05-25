import { useState } from 'react';
import {
  demoPolitician,
  demoContributions,
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
  { label: 'Priya Nair donated $2,500', time: 'May 5', color: 'green' },
  { label: 'New message from Janet Torres re: HB 1042', time: 'May 5', color: 'blue' },
  { label: 'Amara Johnson logged 4 volunteer hours', time: 'May 4', color: 'purple' },
  { label: 'Helen Russo donated $3,000', time: 'May 3', color: 'green' },
  { label: 'Spring Fundraiser shift completed — 3 volunteers', time: 'May 2', color: 'purple' },
  { label: 'Post published: HB 1042 Education Statement', time: 'May 1', color: 'blue' },
];

export function PoliticianOverview() {
  const [, setShowNewPost] = useState(false);

  const upcomingFiling = demoFECFilings.find((f) => f.status === 'upcoming');
  const unreadMessages = demoMessages.filter((m) => m.status === 'unread').length;
  const violationCount = demoContributions.filter((c) => c.complianceStatus === 'violation').length;

  return (
    <div>
      {/* Page Header — overview variant keeps subtle accent */}
      <div className="pol-page-header overview" style={{ marginBottom: 24 }}>
        <div className="pol-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="pol-badge party-neutral">YOUR PARTY</span>
            <span style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem' }}>{demoPolitician.district}</span>
          </div>
          <h1>Welcome back, {demoPolitician.name.split(' ')[0]}</h1>
          <p>{demoPolitician.office} · {demoPolitician.state} · {demoPolitician.campaignName}</p>

          <div className="pol-overview-meta">
            <div className="pol-fundraising-row">
              <span>Fundraising Goal</span>
              <span>${totalRaised.toLocaleString()} of ${demoPolitician.fundraisingGoal.toLocaleString()} ({goalPct}%)</span>
            </div>
            <div className="pol-thermometer">
              <div className="pol-thermometer-fill" style={{ width: `${goalPct}%` }} />
            </div>
          </div>
        </div>

        <div className="pol-days-badge">
          <span className="pol-days-count">{daysUntilElection}</span>
          <span className="pol-days-label">days until election</span>
        </div>
      </div>

      {/* Quick action buttons — below header as separate row */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        <button className="pol-btn-primary pol-btn-sm" onClick={() => setShowNewPost(true)}>New Post</button>
        <button className="pol-btn-secondary pol-btn-sm">Add Donor</button>
        <button className="pol-btn-secondary pol-btn-sm">Log Expense</button>
        <button className="pol-btn-secondary pol-btn-sm">New Email Campaign</button>
      </div>

      {/* Quick Stats */}
      <div className="pol-stat-grid">
        <div className="pol-stat-card">
          <span className="pol-stat-label">Total Donors</span>
          <span className="pol-stat-value">20</span>
          <span className="pol-stat-sub">+3 this month</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Funds Raised — Month</span>
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
          <h3>Alerts</h3>

          {violationCount > 0 && (
            <div className="pol-alert danger">
              <span className="pol-alert-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </span>
              <div className="pol-alert-body">
                <strong>FEC Compliance Violation</strong>
                <p>{violationCount} contribution(s) exceed state limits and require refund processing.</p>
              </div>
            </div>
          )}

          {upcomingFiling && (
            <div className="pol-alert warning">
              <span className="pol-alert-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </span>
              <div className="pol-alert-body">
                <strong>Filing Deadline: {upcomingFiling.dueDate}</strong>
                <p>{upcomingFiling.period} — {upcomingFiling.formType}</p>
              </div>
            </div>
          )}

          {unreadMessages > 0 && (
            <div className="pol-alert info">
              <span className="pol-alert-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </span>
              <div className="pol-alert-body">
                <strong>{unreadMessages} Unanswered Constituent Messages</strong>
                <p>Constituents are waiting for a response.</p>
              </div>
            </div>
          )}

          <div className="pol-alert warning">
            <span className="pol-alert-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
            <div className="pol-alert-body">
              <strong>Employer / Occupation Missing on 2 Donors</strong>
              <p>Required for contributions over $200 per FEC rules.</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="pol-card">
          <h3>Recent Activity</h3>
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

      {/* Post Analytics & FEC Calendar */}
      <div className="pol-grid-2">
        <div className="pol-card">
          <h3>Recent Post Performance</h3>
          <div className="pol-record-list">
            {demoCampaignPosts.filter((p) => p.status === 'published').slice(0, 3).map((post) => (
              <div key={post.id} className="pol-record-item" style={{ cursor: 'default' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-800)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.body.slice(0, 60)}...
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.775rem', color: 'var(--color-gray-500)' }}>
                    <span>{post.views.toLocaleString()} views</span>
                    <span>{post.likes} likes</span>
                    <span>{post.shares} shares</span>
                    <span>{post.comments} comments</span>
                  </div>
                </div>
                {post.topicTag && <span className="pol-badge in-progress">{post.topicTag}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="pol-card">
          <h3>FEC Filing Calendar</h3>
          <div className="pol-record-list">
            {demoFECFilings.map((filing) => (
              <div key={filing.id} className="pol-record-item" style={{ cursor: 'default' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-gray-900)', marginBottom: 2 }}>{filing.period}</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--color-gray-500)' }}>Due: {filing.dueDate}</div>
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
