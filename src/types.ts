export type Constituent = {
  id: string;
  name: string;
  zipcode: string;
  status: 'Active' | 'Follow-up' | 'Donor' | 'Volunteer';
  notes: string;
};

export type Donor = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  employer?: string;
  occupation?: string;
};

export type DonationRecord = {
  id: string;
  source: string;
  amount: number;
  type: 'Donation' | 'Expenditure';
  date: string;
};

export type FinanceDonationRecord = {
  id: string;
  donorId: string;
  donorName: string;
  source: string;
  amount: number;
  jurisdictionType: 'State' | 'Federal';
  date: string;
  employer: string;
  occupation: string;
  address: string;
  complianceStatus: 'Compliant' | 'Violation' | 'Pending';
  violationReason?: string;
};

export type ExpenditureRecord = {
  id: string;
  category: string;
  vendor: string;
  amount: number;
  date: string;
  memo: string;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  managerId: string | null;
  accessLevel: 'Admin' | 'Editor' | 'Viewer';
  startDate: string;
  lastActive: string;
  email: string;
};
