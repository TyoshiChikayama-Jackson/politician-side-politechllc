export type JurisdictionConfig = {
  id: string;
  label: string;
  type: 'Federal' | 'State';
  stateCode: string;
  contributionLimits: {
    individual: number;
    corporate: number;
    maxPerCycle: number;
  };
  filingDeadline: string;
  activeCycle: string;
  notes: string;
};

export const jurisdictions: JurisdictionConfig[] = [
  {
    id: 'in-state',
    label: 'Indiana State Campaign',
    type: 'State',
    stateCode: 'IN',
    contributionLimits: {
      individual: 3000,
      corporate: 0,
      maxPerCycle: 3000
    },
    filingDeadline: '2026-05-15',
    activeCycle: '2026 General',
    notes: 'Includes municipal campaigns across Indiana’s 92 counties and state legislative offices.'
  },
  {
    id: 'in-municipal',
    label: 'Indiana Municipal Campaign',
    type: 'State',
    stateCode: 'IN',
    contributionLimits: {
      individual: 1500,
      corporate: 0,
      maxPerCycle: 1500
    },
    filingDeadline: '2026-05-15',
    activeCycle: '2026 Municipal',
    notes: 'Supports county and city government campaigns across all 92 Indiana counties.'
  },
  {
    id: 'federal',
    label: 'Federal Candidate (Indiana)',
    type: 'Federal',
    stateCode: 'FED',
    contributionLimits: {
      individual: 3600,
      corporate: 0,
      maxPerCycle: 3600
    },
    filingDeadline: '2026-06-15',
    activeCycle: '2026 Federal',
    notes: 'FEC federal limits apply; this view is tailored for Indiana congressional campaigns.'
  }
];
