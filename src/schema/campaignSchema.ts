// Campaign platform schema definitions for the Politician Portal.

export type Tenant = {
  tenantId: string;
  name: string;
  campaignName: string;
  jurisdictionId: string;
  createdAt: string;
  updatedAt: string;
};

export type Jurisdiction = {
  jurisdictionId: string;
  name: string;
  type: 'State' | 'Federal';
  stateCode: string | null;
  federalLimit: number;
  stateLimit: number;
  filingDeadline: string;
  notes: string;
};

export type Donor = {
  donorId: string;
  tenantId: string;
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
  createdAt: string;
};

export type Donation = {
  donationId: string;
  tenantId: string;
  donorId: string | null;
  jurisdictionType: 'State' | 'Federal';
  amount: number;
  contributionType: string;
  sourceChannel: string;
  receivedAt: string;
  employer?: string;
  occupation?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  complianceStatus: 'Compliant' | 'Violation' | 'Pending';
  violationReason?: string;
  createdAt: string;
};

export type Expenditure = {
  expenditureId: string;
  tenantId: string;
  category: string;
  vendor: string;
  amount: number;
  paidAt: string;
  memo?: string;
  receiptUrl?: string;
  createdAt: string;
};

export type CaseworkTicket = {
  ticketId: string;
  tenantId: string;
  title: string;
  description: string;
  district?: string;
  submittedBy?: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Normal' | 'High';
  assignedTo?: string;
  reportedAt: string;
  resolvedAt?: string;
};

export type VoterProfile = {
  voterId: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  zipcode?: string;
  precinct?: string;
  engagementStatus?: string;
  createdAt: string;
};
