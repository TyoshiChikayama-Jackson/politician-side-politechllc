import { useMemo, useState } from 'react';
import { staffMembers } from '../data/staffData';
import type { StaffMember } from '../types';

const promotionPaths: Record<string, string | null> = {
  'Volunteer Coordinator': 'Senior Volunteer Coordinator',
  'Data Analyst': 'Senior Data Analyst',
  'Compliance Specialist': 'Senior Compliance Specialist',
  'Digital Director': 'Director of Digital Strategy',
  'Campaign Manager': null,
  'Senior Volunteer Coordinator': 'Field Operations Director',
  'Senior Data Analyst': 'Director of Analytics',
  'Senior Compliance Specialist': 'Legal Director'
};

function getTenure(startDate: string) {
  const start = new Date(startDate);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return `${years > 0 ? `${years} yr${years > 1 ? 's' : ''} ` : ''}${remainingMonths} mos`;
}

export function Staff() {
  const [team, setTeam] = useState<StaffMember[]>(staffMembers);
  const [selectedId, setSelectedId] = useState<string>('S-001');

  const selectedMember = useMemo(
    () => team.find((member) => member.id === selectedId) ?? team[0],
    [selectedId, team]
  );

  const orgChart = useMemo(() => {
    const map = team.reduce<Record<string, StaffMember[]>>((acc, member) => {
      const key = member.managerId ?? 'root';
      if (!acc[key]) acc[key] = [];
      acc[key].push(member);
      return acc;
    }, {});
    return map;
  }, [team]);

  const promoteMember = (member: StaffMember) => {
    const nextRole = promotionPaths[member.role];
    if (!nextRole) return;
    setTeam((current) =>
      current.map((item) => (item.id === member.id ? { ...item, role: nextRole } : item))
    );
  };

  const getReports = (managerId: string | null) => orgChart[managerId ?? 'root'] ?? [];

  return (
    <section className="section-panel">
      <div className="section-title">
        <div>
          <h2>Staff Management</h2>
          <p>Manage campaign personnel, roles, reporting structure, and account access from one centralized view.</p>
        </div>
      </div>

      <div className="staff-grid">
        <div className="card staff-org-card">
          <h3>Organization chart</h3>
          <div className="org-chart">
            {getReports(null).map((leader) => (
              <div key={leader.id} className="org-node">
                <button type="button" className="org-node-button" onClick={() => setSelectedId(leader.id)}>
                  {leader.name}
                  <span className="muted-text">{leader.role}</span>
                </button>
                {getReports(leader.id).length > 0 && (
                  <div className="org-report-grid">
                    {getReports(leader.id).map((report) => (
                      <button
                        type="button"
                        key={report.id}
                        className="org-node-button org-report"
                        onClick={() => setSelectedId(report.id)}
                      >
                        {report.name}
                        <span className="muted-text">{report.role}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card staff-detail-card">
          <h3>Selected team member</h3>
          <div className="section-block">
            <h4>{selectedMember.name}</h4>
            <p className="muted-text">{selectedMember.department} — {selectedMember.role}</p>
          </div>

          <div className="staff-info-grid">
            <div>
              <span className="info-label">Access level</span>
              <strong>{selectedMember.accessLevel}</strong>
            </div>
            <div>
              <span className="info-label">Role tenure</span>
              <strong>{getTenure(selectedMember.startDate)}</strong>
            </div>
            <div>
              <span className="info-label">Started</span>
              <strong>{selectedMember.startDate}</strong>
            </div>
            <div>
              <span className="info-label">Last active</span>
              <strong>{selectedMember.lastActive}</strong>
            </div>
          </div>

          <div className="section-block">
            <h4>Account access</h4>
            <p className="muted-text">{selectedMember.name} can access campaign systems at the {selectedMember.accessLevel} level.</p>
            <ul className="staff-detail-list">
              <li>Email: {selectedMember.email}</li>
              <li>Department: {selectedMember.department}</li>
              <li>Reports to: {selectedMember.managerId ? team.find((item) => item.id === selectedMember.managerId)?.name : 'Executive Leadership'}</li>
            </ul>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="primary"
              onClick={() => promoteMember(selectedMember)}
              disabled={!promotionPaths[selectedMember.role]}
            >
              Promote
            </button>
            <button type="button" className="secondary" disabled>
              View access history
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
