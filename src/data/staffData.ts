import type { StaffMember } from '../types';

export const staffMembers: StaffMember[] = [
  {
    id: 'S-001',
    name: 'Avery Collins',
    role: 'Campaign Manager',
    department: 'Leadership',
    managerId: null,
    accessLevel: 'Admin',
    startDate: '2025-11-01',
    lastActive: '2026-05-01',
    email: 'avery.collins@politechcampaign.com'
  },
  {
    id: 'S-002',
    name: 'Jamal Roy',
    role: 'Digital Director',
    department: 'Communications',
    managerId: 'S-001',
    accessLevel: 'Editor',
    startDate: '2026-01-10',
    lastActive: '2026-05-03',
    email: 'jamal.roy@politechcampaign.com'
  },
  {
    id: 'S-003',
    name: 'Mia Patel',
    role: 'Volunteer Coordinator',
    department: 'Field Operations',
    managerId: 'S-001',
    accessLevel: 'Editor',
    startDate: '2025-12-05',
    lastActive: '2026-05-04',
    email: 'mia.patel@politechcampaign.com'
  },
  {
    id: 'S-004',
    name: 'Noah Green',
    role: 'Compliance Specialist',
    department: 'Legal',
    managerId: 'S-001',
    accessLevel: 'Editor',
    startDate: '2026-02-14',
    lastActive: '2026-05-02',
    email: 'noah.green@politechcampaign.com'
  },
  {
    id: 'S-005',
    name: 'Isabella Torres',
    role: 'Data Analyst',
    department: 'Analytics',
    managerId: 'S-002',
    accessLevel: 'Viewer',
    startDate: '2026-03-02',
    lastActive: '2026-05-04',
    email: 'isabella.torres@politechcampaign.com'
  }
];
