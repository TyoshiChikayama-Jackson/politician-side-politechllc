// ─── Politician Dashboard Types ───────────────────────────────────────────────

export type PoliticianProfile = {
  id: string;
  name: string;
  office: string;
  district: string;
  party: 'Republican' | 'Democrat' | 'Independent' | 'Libertarian' | 'Other';
  state: string;
  photoUrl?: string;
  bio?: string;
  website?: string;
  twitterHandle?: string;
  facebookUrl?: string;
  campaignName: string;
  treasurerName: string;
  treasurerAddress: string;
  depositoryBank: string;
  fecCommitteeId?: string;
  stateCommitteeId?: string;
  electionDate: string;
  fundraisingGoal: number;
};

export type DonorFull = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  employer: string;
  occupation: string;
  tags: DonorTag[];
  notes: string;
  createdAt: string;
  totalContributions: number;
  cycleTotal: number;
  status: 'active' | 'lapsed' | 'maxed-out';
};

export type DonorTag = 'Major Donor' | 'Volunteer' | 'Recurring' | 'PAC' | 'In-Kind';

export type Contribution = {
  id: string;
  donorId: string;
  donorName: string;
  amount: number;
  date: string;
  method: 'check' | 'card' | 'online' | 'in-kind';
  isInKind: boolean;
  inKindDescription?: string;
  inKindFairMarketValue?: number;
  electionCycle: string;
  jurisdictionType: 'State' | 'Federal';
  complianceStatus: 'compliant' | 'warning' | 'violation' | 'pending';
  violationReason?: string;
  refundStatus?: 'none' | 'pending' | 'refunded';
  refundReason?: string;
  prohibitedSourceAcknowledged: boolean;
  auditLog: AuditEntry[];
};

export type Expense = {
  id: string;
  vendor: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  paymentMethod: 'check' | 'card' | 'wire' | 'cash';
  receiptUrl?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  memo: string;
};

export type ExpenseCategory =
  | 'Advertising'
  | 'Staff'
  | 'Travel'
  | 'Events'
  | 'Technology'
  | 'Office'
  | 'Consulting'
  | 'Printing'
  | 'Other';

export type BudgetLine = {
  category: ExpenseCategory;
  budgeted: number;
  spent: number;
};

export type Volunteer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
  totalHours: number;
  joinDate: string;
  status: 'active' | 'inactive';
};

export type Shift = {
  id: string;
  title: string;
  type: 'canvassing' | 'phone-banking' | 'event-setup' | 'data-entry' | 'other';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  assignedVolunteerIds: string[];
  hoursLogged: Record<string, number>;
};

export type ConstituentMessage = {
  id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  body: string;
  receivedAt: string;
  status: 'unread' | 'read' | 'replied';
  replyBody?: string;
  repliedAt?: string;
};

export type EmailBlast = {
  id: string;
  subject: string;
  body: string;
  targetList: 'all' | 'donors' | 'volunteers' | 'district';
  status: 'draft' | 'sent' | 'scheduled';
  scheduledAt?: string;
  sentAt?: string;
  recipientCount: number;
};

export type CampaignPost = {
  id: string;
  body: string;
  imageUrl?: string;
  billTag?: string;
  topicTag?: string;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: string;
  scheduledAt?: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
};

export type Bill = {
  id: string;
  number: string;
  title: string;
  status: 'in-progress' | 'passed' | 'failed' | 'pending';
  sponsored: boolean;
  voteDate?: string;
  politicianVote?: 'yes' | 'no' | 'abstain' | 'absent';
  voteRationale?: string;
  impactNotes?: string;
  summary?: string;
  link?: string;
};

export type PolicyStance = {
  id: string;
  questionId: string;
  question: string;
  category: string;
  multipleChoiceAnswer?: string;
  freeTextAnswer: string;
  status: 'answered' | 'in-review' | 'no-comment';
  updatedAt: string;
  versionHistory: { answer: string; updatedAt: string }[];
};

export type FECFilingRecord = {
  id: string;
  formType: 'Form 3' | 'Form 3P' | 'State Equivalent';
  period: string;
  dueDate: string;
  filedDate?: string;
  status: 'upcoming' | 'filed' | 'overdue';
  totalReceipts: number;
  totalDisbursements: number;
};

export type AuditEntry = {
  timestamp: string;
  user: string;
  action: string;
  details: string;
};

export type StaffRole = 'Admin' | 'Finance' | 'Communications' | 'Volunteer Coordinator' | 'Viewer';

export type CampaignStaff = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  inviteStatus: 'active' | 'pending' | 'inactive';
  joinedAt: string;
};

// ─── Events Module ────────────────────────────────────────────────────────────

export type EventType = 'Fundraiser' | 'Town Hall' | 'Canvassing' | 'Phone Bank' | 'Rally' | 'Meet & Greet' | 'Debate' | 'Other';

export type TicketTier = {
  id: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;
  fecCompliant: boolean;
  description?: string;
};

export type EventRSVP = {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  tierId: string;
  amountPaid: number;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  registeredAt: string;
};

export type CampaignEvent = {
  id: string;
  title: string;
  type: EventType;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  capacity: number;
  rsvpCount: number;
  description: string;
  isPublic: boolean;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  ticketTiers: TicketTier[];
  rsvps: EventRSVP[];
  totalRevenue: number;
  volunteerShiftIds: string[];
  tags: string[];
};

// ─── Ad Creative Module ────────────────────────────────────────────────────────

export type AdPlatform = 'Facebook' | 'Instagram' | 'Google' | 'Twitter/X' | 'Direct Mail' | 'Email' | 'TV/Radio';
export type AdGoal = 'Fundraising' | 'Voter Outreach' | 'GOTV' | 'Awareness' | 'Event Promotion' | 'Opposition Research Response';

export type AdVariant = {
  id: string;
  label: string;
  headline: string;
  body: string;
  cta: string;
  charCount: number;
};

export type AdCampaign = {
  id: string;
  name: string;
  platform: AdPlatform;
  goal: AdGoal;
  targetAudience: string;
  keyMessage: string;
  tone: 'Professional' | 'Urgent' | 'Hopeful' | 'Conversational' | 'Bold';
  variants: AdVariant[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
  budget?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  complianceApproved: boolean;
};

// ─── Polls & Surveys Module ───────────────────────────────────────────────────

export type QuestionType = 'multiple-choice' | 'yes-no' | 'rating' | 'open-text' | 'ranking';

export type SurveyQuestion = {
  id: string;
  order: number;
  type: QuestionType;
  text: string;
  options?: string[];
  required: boolean;
};

export type SurveyResponse = {
  id: string;
  surveyId: string;
  respondentId?: string;
  answers: Record<string, string | string[] | number>;
  submittedAt: string;
  zipCode?: string;
};

export type Survey = {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  status: 'draft' | 'active' | 'closed';
  createdAt: string;
  closedAt?: string;
  responseCount: number;
  targetAudience: string;
  shareLink?: string;
  aiThemes?: string[];
  responses?: SurveyResponse[];
};

// ─── Speech & Talking Points Module ──────────────────────────────────────────

export type SpeechType = 'Full Speech' | 'Talking Points' | 'Press Statement' | 'Debate Prep' | 'Stump Speech' | 'Social Caption';

export type Speech = {
  id: string;
  title: string;
  type: SpeechType;
  topic: string;
  audience: string;
  tone: 'Formal' | 'Conversational' | 'Inspirational' | 'Urgent' | 'Empathetic';
  keyPoints: string[];
  content: string;
  wordCount: number;
  estimatedMinutes: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
};

// ─── Original Types (preserved) ───────────────────────────────────────────────

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

export type Message = {
  id: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
  status: 'Sent' | 'Draft' | 'Scheduled';
};
