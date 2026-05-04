import { useMemo } from 'react';
import { DashboardCard } from '../components/DashboardCard';
import { constituents, donationRecords } from '../data/sampleData';

const upcomingDeadlines = [
  { label: 'County contribution report', date: 'May 12', location: 'Marion County' },
  { label: 'State finance filing', date: 'May 20', location: 'Indiana Secretary of State' },
  { label: 'Volunteer shift roster', date: 'May 24', location: 'State HQ' }
];

const postAnalytics = [
  { label: 'Last 7-day engagement', value: '14.8%' },
  { label: 'Post share rate', value: '8.2%' },
  { label: 'Profile views', value: '12.8K' },
  { label: 'New followers', value: '620' }
];

const complianceSummary = [
  { label: 'Recent filing', value: 'Completed', detail: 'Finance report F1 filed 4 days ago' },
  { label: 'Next deadline', value: 'May 20', detail: 'State campaign finance report due' },
  { label: 'Issues flagged', value: '0', detail: 'No active compliance alerts' }
];

const recentMessages = [
  { sender: 'Boone County Coordinator', preview: 'Need final approval for the volunteer event post.' },
  { sender: 'State communications lead', preview: 'Draft the Indiana policy update for LinkedIn.' },
  { sender: 'Campaign manager', preview: 'Review the budget summary before tomorrow’s call.' }
];

export function Dashboard() {
  const totalDonations = useMemo(
    () => donationRecords.filter((item) => item.type === 'Donation').reduce((sum, item) => sum + item.amount, 0),
    []
  );

  const totalExpenses = useMemo(
    () => donationRecords.filter((item) => item.type === 'Expenditure').reduce((sum, item) => sum + item.amount, 0),
    []
  );

  return (
    <section className="section-panel">
      <div className="section-title">
        <div>
          <h2>Campaign Dashboard</h2>
          <p>Your political engagement hub. Monitor community outreach, messaging, and compliance all in one place.</p>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-side">
          <div className="card">
            <h3>Upcoming deadlines</h3>
            <ul className="deadline-list">
              {upcomingDeadlines.map((deadline) => (
                <li key={deadline.label}>
                  <strong>{deadline.date}</strong>
                  <div>{deadline.label}</div>
                  <span className="muted-text">{deadline.location}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3>Mini calendar</h3>
            <div className="mini-calendar-grid">
              {Array.from({ length: 7 }, (_, index) => {
                const day = new Date();
                day.setDate(day.getDate() + index);
                return (
                  <div key={index} className="mini-calendar-day">
                    <span className="mini-calendar-label">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <strong>{day.getDate()}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-grid">
            <DashboardCard
              title="Community Members"
              description={`${constituents.length} constituents tracked. Build relationships, track engagement, and grow your network.`}
            />
            <DashboardCard
              title="Campaign Finance"
              description={`Raised $${totalDonations.toLocaleString()} | Spent $${totalExpenses.toLocaleString()}. Stay audit-ready and compliant.`}
            />
          </div>

          <div className="dashboard-grid dashboard-grid-2">
            <div className="card status-card">
              <h3>Post analytics</h3>
              <div className="status-grid">
                {postAnalytics.map((metric) => (
                  <div key={metric.label} className="status-item">
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="card status-card">
              <h3>Compliance status</h3>
              <div className="status-grid">
                {complianceSummary.map((item) => (
                  <div key={item.label} className="status-item">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <p className="muted-text">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Recent messages</h3>
            <ul className="message-summary-list">
              {recentMessages.map((message) => (
                <li key={message.sender}>
                  <strong>{message.sender}</strong>
                  <p>{message.preview}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
