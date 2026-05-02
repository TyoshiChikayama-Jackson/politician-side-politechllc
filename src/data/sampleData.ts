import type { Constituent, DonationRecord } from '../types';

export const constituents: Constituent[] = [
  { id: 'C-001', name: 'Maya Torres', zipcode: '94107', status: 'Active', notes: 'Needs follow up on community event' },
  { id: 'C-002', name: 'James Park', zipcode: '90210', status: 'Donor', notes: 'Supports education initiatives' },
  { id: 'C-003', name: 'Aisha Khan', zipcode: '33101', status: 'Volunteer', notes: 'Interested in canvassing' },
  { id: 'C-004', name: 'Lena Brooks', zipcode: '60614', status: 'Follow-up', notes: 'Ask about transportation access' }
];

export const donationRecords: DonationRecord[] = [
  { id: 'D-001', source: 'Neighborhood fundraiser', amount: 4200, type: 'Donation', date: '2026-04-11' },
  { id: 'D-002', source: 'Office supplies', amount: 320, type: 'Expenditure', date: '2026-04-14' },
  { id: 'D-003', source: 'Online donation', amount: 580, type: 'Donation', date: '2026-04-22' },
  { id: 'D-004', source: 'Campaign event catering', amount: 760, type: 'Expenditure', date: '2026-04-26' }
];
