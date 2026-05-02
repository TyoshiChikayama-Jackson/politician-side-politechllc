import { DashboardCard } from '../components/DashboardCard';
import { constituents, donationRecords } from '../data/sampleData';

export function Dashboard() {
  const totalDonations = donationRecords
    .filter((item) => item.type === 'Donation')
    .reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = donationRecords
    .filter((item) => item.type === 'Expenditure')
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <section className="section-panel">
      <div className="section-title">
        <div>
          <h2>Campaign Dashboard</h2>
          <p>Your political engagement hub. Monitor community outreach, messaging, and compliance all in one place.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <DashboardCard
          title="Community Members"
          description={`${constituents.length} constituents tracked. Build relationships, track engagement, and grow your network.`}
        />
        <DashboardCard
          title="Campaign Finance"
          description={`Raised $${totalDonations.toLocaleString()} | Spent $${totalExpenses.toLocaleString()}. Stay audit-ready and compliant.`}
        />
        <DashboardCard
          title="Message Center"
          description="Craft authentic messages and reach voters across your district with consistent, compelling communications."
        />

      </div>
    </section>
  );
}
