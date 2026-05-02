import { useMemo } from 'react';
import { donationRecords } from '../data/sampleData';

export function Compliance() {
  const totalRaised = useMemo(
    () => donationRecords.filter((record) => record.type === 'Donation').reduce((sum, record) => sum + record.amount, 0),
    []
  );
  const totalSpent = useMemo(
    () => donationRecords.filter((record) => record.type === 'Expenditure').reduce((sum, record) => sum + record.amount, 0),
    []
  );
  const goal = 12000;
  const remaining = goal - totalRaised;

  return (
    <section className="section-panel">
      <div className="section-title">
        <div>
          <h2>FEC compliance & fundraising</h2>
          <p>Track donations, document expenditures, and stay audit-ready with campaign finance tools.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Fundraising goal</h3>
          <p>Goal: ${goal.toLocaleString()}</p>
          <p>Raised: ${totalRaised.toLocaleString()}</p>
          <p>Remaining: ${remaining.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>Expenditure summary</h3>
          <p>Total spent: ${totalSpent.toLocaleString()}</p>
          <p>Budget variance and paper trail support built for local campaigns.</p>
        </div>
      </div>

      <div className="card">
        <h3>Document upload</h3>
        <div className="form-group">
          <label htmlFor="report-file">Upload donation report or expense receipt</label>
          <input id="report-file" type="file" accept=".pdf,.csv,.xlsx" />
          <p className="upload-hint">Accepts FEC reports, contribution logs, and vendor receipts.</p>
        </div>
      </div>

      <div className="card">
        <h3>Recent financial records</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {donationRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.source}</td>
                <td>${record.amount.toLocaleString()}</td>
                <td>{record.type}</td>
                <td>{record.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
