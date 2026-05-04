import { useMemo, useState } from 'react';
import { jurisdictions } from '../data/jurisdictionConfig';
import { donationRecords as initialDonations, expenditureRecords } from '../data/financeData';
import type { FinanceDonationRecord } from '../types';

const contributionTypes = ['Individual', 'Corporate', 'In-Kind'];
const sourceChannels = ['Online Donation', 'Fundraiser', 'Mail-In Check', 'Event'];

const initialFormState = {
  donorName: '',
  source: 'Online Donation',
  amount: '0',
  jurisdictionType: 'State',
  employer: '',
  occupation: '',
  address: ''
};

export function Compliance() {
  const [jurisdictionId, setJurisdictionId] = useState('in-state');
  const [donations, setDonations] = useState<FinanceDonationRecord[]>(initialDonations);
  const [formState, setFormState] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedJurisdiction = jurisdictions.find((jurisdiction) => jurisdiction.id === jurisdictionId) ?? jurisdictions[0];

  const totalRaised = useMemo(
    () => donations.reduce((sum, record) => sum + record.amount, 0),
    [donations]
  );

  const totalSpent = useMemo(
    () => expenditureRecords.reduce((sum, record) => sum + record.amount, 0),
    []
  );

  const violations = useMemo(
    () => donations.filter((record) => record.complianceStatus === 'Violation'),
    [donations]
  );

  const averageDonation = useMemo(
    () => (donations.length ? totalRaised / donations.length : 0),
    [donations, totalRaised]
  );

  const targetBudget = 15000;
  const goalRemaining = Math.max(0, targetBudget - totalRaised);

  const validateDonation = (record: FinanceDonationRecord) => {
    const limit = selectedJurisdiction.contributionLimits.individual;
    if (record.amount > limit) {
      return {
        complianceStatus: 'Violation' as const,
        violationReason: `Exceeds ${selectedJurisdiction.type} limit of $${limit.toLocaleString()}`
      };
    }
    if (record.amount >= 200 && !record.employer.trim()) {
      return {
        complianceStatus: 'Violation' as const,
        violationReason: 'Missing employer disclosure for amount at or above reporting threshold.'
      };
    }
    return { complianceStatus: 'Compliant' as const, violationReason: '' };
  };

  const handleSubmit = () => {
    setErrorMessage('');
    const amountValue = Number(formState.amount);

    if (!formState.donorName.trim() || amountValue <= 0 || !formState.address.trim()) {
      setErrorMessage('Complete the donor name, amount, and address before recording the contribution.');
      return;
    }

    const newRecord: FinanceDonationRecord = {
      id: `D-${Date.now()}`,
      donorId: `DON-${Date.now()}`,
      donorName: formState.donorName.trim(),
      source: formState.source,
      amount: amountValue,
      jurisdictionType: formState.jurisdictionType as 'State' | 'Federal',
      date: new Date().toISOString().slice(0, 10),
      employer: formState.employer.trim() || 'N/A',
      occupation: formState.occupation.trim() || 'N/A',
      address: formState.address.trim(),
      ...validateDonation({
        id: '',
        donorId: '',
        donorName: formState.donorName.trim(),
        source: formState.source,
        amount: amountValue,
        jurisdictionType: formState.jurisdictionType as 'State' | 'Federal',
        date: new Date().toISOString().slice(0, 10),
        employer: formState.employer.trim() || 'N/A',
        occupation: formState.occupation.trim() || 'N/A',
        address: formState.address.trim(),
        complianceStatus: 'Pending'
      })
    };

    setDonations([newRecord, ...donations]);
    setFormState(initialFormState);
  };

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const headers = ['Donor', 'Amount', 'Channel', 'Jurisdiction', 'Date', 'Employer', 'Occupation', 'Address', 'Status'].join(',');
    const rows = donations.map((record) =>
      [
        JSON.stringify(record.donorName),
        record.amount.toFixed(2),
        JSON.stringify(record.source),
        record.jurisdictionType,
        record.date,
        JSON.stringify(record.employer),
        JSON.stringify(record.occupation),
        JSON.stringify(record.address),
        record.complianceStatus
      ].join(',')
    );
    downloadFile(`politech-${selectedJurisdiction.id}-donations.csv`, [headers, ...rows].join('\n'), 'text/csv');
  };

  const exportJson = () => {
    const payload = {
      jurisdiction: selectedJurisdiction.label,
      exportDate: new Date().toISOString(),
      donations
    };
    downloadFile(`politech-${selectedJurisdiction.id}-donations.json`, JSON.stringify(payload, null, 2), 'application/json');
  };

  return (
    <section className="section-panel">
      <div className="section-title">
        <div>
          <h2>Finance & Compliance</h2>
          <p>Track every contribution, enforce local and federal gift limits, and build filings-ready disclosures from the start.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Jurisdiction settings</h3>
          <div className="form-group">
            <label htmlFor="jurisdiction-select">Select campaign jurisdiction</label>
            <select
              id="jurisdiction-select"
              value={jurisdictionId}
              onChange={(event) => setJurisdictionId(event.target.value)}
            >
              {jurisdictions.map((jurisdiction) => (
                <option key={jurisdiction.id} value={jurisdiction.id}>
                  {jurisdiction.label}
                </option>
              ))}
            </select>
          </div>
          <p className="muted-text">{selectedJurisdiction.notes}</p>
          <div className="status-row">
            <span className="summary-pill">Filing deadline: {selectedJurisdiction.filingDeadline}</span>
            <span className="summary-pill">Cycle: {selectedJurisdiction.activeCycle}</span>
          </div>
        </div>

        <div className="card">
          <h3>Financial summary</h3>
          <p>Total raised: ${totalRaised.toLocaleString()}</p>
          <p>Total spent: ${totalSpent.toLocaleString()}</p>
          <p>Goal remaining: ${goalRemaining.toLocaleString()}</p>
          <p>Average contribution: ${averageDonation.toFixed(2)}</p>
        </div>
      </div>

      <div className="card">
        <h3>Compliance dashboard</h3>
        <div className="status-row">
          <span className="summary-pill">Individual limit: ${selectedJurisdiction.contributionLimits.individual.toLocaleString()}</span>
          <span className="summary-pill">Violations: {violations.length}</span>
        </div>
        {violations.length > 0 && (
          <div className="warning-banner">
            {violations.length} contribution(s) require review before filing.
          </div>
        )}
      </div>

      <div className="card">
        <h3>Donation intake</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="donor-name">Donor name</label>
            <input
              id="donor-name"
              value={formState.donorName}
              onChange={(event) => setFormState({ ...formState, donorName: event.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="donation-amount">Amount</label>
            <input
              id="donation-amount"
              type="number"
              min="0"
              step="50"
              value={formState.amount}
              onChange={(event) => setFormState({ ...formState, amount: event.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="donation-source">Channel</label>
            <select
              id="donation-source"
              value={formState.source}
              onChange={(event) => setFormState({ ...formState, source: event.target.value })}
            >
              {sourceChannels.map((channel) => (
                <option key={channel} value={channel}>
                  {channel}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="jurisdiction-type">Contribution type</label>
            <select
              id="jurisdiction-type"
              value={formState.jurisdictionType}
              onChange={(event) => setFormState({ ...formState, jurisdictionType: event.target.value })}
            >
              <option value="State">State</option>
              <option value="Federal">Federal</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="donor-employer">Employer</label>
            <input
              id="donor-employer"
              value={formState.employer}
              onChange={(event) => setFormState({ ...formState, employer: event.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="donor-occupation">Occupation</label>
            <input
              id="donor-occupation"
              value={formState.occupation}
              onChange={(event) => setFormState({ ...formState, occupation: event.target.value })}
            />
          </div>
          <div className="form-group form-span-full">
            <label htmlFor="donor-address">Address</label>
            <textarea
              id="donor-address"
              value={formState.address}
              onChange={(event) => setFormState({ ...formState, address: event.target.value })}
            />
          </div>
        </div>
        {errorMessage && <div className="warning-banner">{errorMessage}</div>}
        <div className="button-group">
          <button className="primary" type="button" onClick={handleSubmit}>
            Record contribution
          </button>
          <button className="secondary" type="button" onClick={() => setFormState(initialFormState)}>
            Reset form
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Ready-to-file exports</h3>
        <p>Generate jurisdiction-specific files formatted for state election board or FEC filings.</p>
        <div className="button-group export-buttons">
          <button className="primary" type="button" onClick={exportCsv}>
            Download CSV export
          </button>
          <button className="secondary" type="button" onClick={exportJson}>
            Download JSON export
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Donation ledger</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Amount</th>
              <th>Channel</th>
              <th>Jurisdiction</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((record) => (
              <tr key={record.id} className={record.complianceStatus === 'Violation' ? 'row-warning' : ''}>
                <td>{record.donorName}</td>
                <td>${record.amount.toLocaleString()}</td>
                <td>{record.source}</td>
                <td>{record.jurisdictionType}</td>
                <td>{record.complianceStatus}</td>
                <td>{record.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
