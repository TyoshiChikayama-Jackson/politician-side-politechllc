import { useMemo } from 'react';
import { constituents } from '../data/sampleData';

const statusColor: Record<'Active' | 'Donor' | 'Volunteer' | 'Follow-up', string> = {
  Active: 'status-donor',
  Donor: 'status-donor',
  Volunteer: 'status-volunteer',
  'Follow-up': 'status-follow'
};

type StatusKey = keyof typeof statusColor;

export function CRM() {
  const breakdown = useMemo(() => {
    const counts: Record<StatusKey, number> = { Active: 0, Donor: 0, Volunteer: 0, 'Follow-up': 0 };
    constituents.forEach((person) => {
      counts[person.status] += 1;
    });
    return counts;
  }, []);

  return (
    <section className="section-panel">
      <div className="section-title">
        <div>
          <h2>Community Engagement</h2>
          <p>BStay connected to those you represent. Track involvement, manage outreach, and strengthen community ties.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Engageent breakdown</h3>
          <ul>
            {(Object.entries(breakdown) as Array<[StatusKey, number]>).map(([key, count]) => (
              <li key={key} className={statusColor[key] ?? ''}>
                {key}: {count}
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Tasks</h3>
          <p>Set follow-up reminders and assign constituents to volunteers or events.</p>
        </div>
      </div>

      <div className="card">
        <h3>Constituent directory</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Zip code</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {constituents.map((person) => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{person.zipcode}</td>
                <td>
                  <span className={`status-pill ${statusColor[person.status]}`}>{person.status}</span>
                </td>
                <td>{person.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
