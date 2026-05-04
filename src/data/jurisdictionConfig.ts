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
    id: 'tx-state',
    label: 'Texas State Campaign',
    type: 'State',
    stateCode: 'TX',
    contributionLimits: {
      individual: 3000,
      corporate: 0,
      maxPerCycle: 3000
    },
    filingDeadline: '2026-05-15',
    activeCycle: '2026 Primary',
    notes: 'Use state gift limits for city and state candidates in Texas.'
  },
  {
    id: 'ca-state',
    label: 'California State Campaign',
    type: 'State',
    stateCode: 'CA',
    contributionLimits: {
      individual: 4200,
      corporate: 0,
      maxPerCycle: 4200
    },
    filingDeadline: '2026-06-01',
    activeCycle: '2026 Primary',
    notes: 'California requires additional itemized disclosure for checks over $100.'
  },
  {
    id: 'federal',
    label: 'Federal Candidate',
    type: 'Federal',
    stateCode: 'FED',
    contributionLimits: {
      individual: 3600,
      corporate: 0,
      maxPerCycle: 3600
    },
    filingDeadline: '2026-06-15',
    activeCycle: '2026 Federal',
    notes: 'FEC federal limits apply. All donations above $200 require full disclosure.'
  }
];
