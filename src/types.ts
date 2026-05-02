export type Constituent = {
  id: string;
  name: string;
  zipcode: string;
  status: 'Active' | 'Follow-up' | 'Donor' | 'Volunteer';
  notes: string;
};

export type DonationRecord = {
  id: string;
  source: string;
  amount: number;
  type: 'Donation' | 'Expenditure';
  date: string;
};
