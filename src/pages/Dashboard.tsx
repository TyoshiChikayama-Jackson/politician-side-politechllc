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
          <h2>Campaign command center</h2>
          <p>Overview for candidate teams, volunteers, and community outreach.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <DashboardCard
          title="Constituent load"
          description={`${constituents.length} active supporters, donors, and volunteers in your local network.`}
        />
        <DashboardCard
          title="Finance summary"
          description={`Raised $${totalDonations.toLocaleString()} and spent $${totalExpenses.toLocaleString()} so far.`}
        />
        <DashboardCard
          title="Post studio"
          description="Create social posts, save message drafts, and cross-post to your campaign feeds."
        />
        <DashboardCard
          title="Zip code visibility"
          description="View ward-by-ward constituent clusters and outreach gaps across district zip codes."
        />
      </div>
    </section>
  );
}
