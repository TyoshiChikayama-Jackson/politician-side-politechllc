import { socialMetrics, postPerformance, benchmarkComparison, socialPlatforms } from '../data/socialData';

export function SocialAnalytics() {
  return (
    <section className="section-panel">
      <div className="section-title">
        <div>
          <h2>Social Media Analytics</h2>
          <p>Compare campaign performance across platforms and benchmark against other statewide candidates.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Platform health</h3>
          <div className="button-group platform-grid">
            {socialPlatforms.map((platform) => (
              <div key={platform.name} className="platform-chip">
                <span>{platform.name}</span>
                <span className={`status-pill ${platform.active ? 'status-volunteer' : 'status-donor'}`}>
                  {platform.active ? 'Active' : 'Paused'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>High-value metrics</h3>
          <div className="metric-grid">
            {socialMetrics.map((metric) => (
              <div key={metric.label} className="metric-card">
                <span className="metric-label">{metric.label}</span>
                <strong>{metric.value.toLocaleString()}{metric.unit}</strong>
                <span className="metric-trend">{metric.trend}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Cross-post performance</h3>
        <p>See engagement and reach for every cross-posted campaign message.</p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Post</th>
              <th>Platform</th>
              <th>Impressions</th>
              <th>Engagement</th>
              <th>Interactions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {postPerformance.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.platform}</td>
                <td>{post.impressions.toLocaleString()}</td>
                <td>{post.engagementRate}%</td>
                <td>{post.interactions.toLocaleString()}</td>
                <td>{post.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Peer benchmark</h3>
        <p>Compare your engagement and reach against the state average and top opponent.</p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Comparison</th>
              <th>Engagement</th>
              <th>Shares</th>
              <th>Profile views</th>
            </tr>
          </thead>
          <tbody>
            {benchmarkComparison.map((item) => (
              <tr key={item.name} className={item.name === 'Your campaign' ? 'row-highlight' : ''}>
                <td>{item.name}</td>
                <td>{item.engagement}%</td>
                <td>{item.shares.toLocaleString()}</td>
                <td>{item.profileViews.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
