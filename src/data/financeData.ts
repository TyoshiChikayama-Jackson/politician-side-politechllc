import type { Donor, FinanceDonationRecord, ExpenditureRecord } from '../types';

export const donors: Donor[] = [
  {
    id: 'DON-001',
    name: 'Samantha Reed',
    email: 'samantha.reed@example.com',
    phone: '512-555-0198',
    addressLine1: '2109 Capitol St',
    addressLine2: '',
    city: 'Austin',
    state: 'TX',
    postalCode: '78701',
    employer: 'Community Bank',
    occupation: 'Project Manager'
  },
  {
    id: 'DON-002',
    name: 'Rahim Patel',
    email: 'rahim.patel@example.com',
    phone: '415-555-0102',
    addressLine1: '789 Mission Ave',
    addressLine2: 'Apt 402',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94103',
    employer: 'Public Works',
    occupation: 'Engineer'
  }
];

export const donationRecords: FinanceDonationRecord[] = [
  {
    id: 'D-100',
    donorId: 'DON-001',
    donorName: 'Samantha Reed',
    source: 'Online donation',
    amount: 2800,
    jurisdictionType: 'State',
    date: '2026-04-10',
    employer: 'Community Bank',
    occupation: 'Project Manager',
    address: '2109 Capitol St, Austin, TX 78701',
    complianceStatus: 'Compliant'
  },
  {
    id: 'D-101',
    donorId: 'DON-002',
    donorName: 'Rahim Patel',
    source: 'Fundraiser check',
    amount: 4500,
    jurisdictionType: 'State',
    date: '2026-04-15',
    employer: 'Public Works',
    occupation: 'Engineer',
    address: '789 Mission Ave, San Francisco, CA 94103',
    complianceStatus: 'Violation'
  }
];

export const expenditureRecords: ExpenditureRecord[] = [
  {
    id: 'E-100',
    category: 'Digital advertising',
    vendor: 'AdRaise Media',
    amount: 1700,
    date: '2026-04-18',
    memo: 'Targeted text and email campaign spend'
  },
  {
    id: 'E-101',
    category: 'Event catering',
    vendor: 'Victory Catering',
    amount: 820,
    date: '2026-04-22',
    memo: 'Volunteer launch reception'
  }
];
