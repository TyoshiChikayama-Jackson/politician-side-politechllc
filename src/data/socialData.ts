export const socialPlatforms = [
  { name: 'LinkedIn', icon: 'LinkedIn', active: true },
  { name: 'Twitter', icon: 'X', active: true },
  { name: 'Facebook', icon: 'Facebook', active: true },
  { name: 'Instagram', icon: 'Instagram', active: false }
];

export const socialMetrics = [
  { label: 'Engagement', value: 14.8, unit: '%', trend: '+2.6%' },
  { label: 'Shares', value: 420, unit: '', trend: '+18%' },
  { label: 'Profile views', value: 12820, unit: '', trend: '+4%' },
  { label: 'Clicks', value: 1160, unit: '', trend: '+9%' }
];

export const postPerformance = [
  {
    id: 'P-001',
    platform: 'LinkedIn',
    title: 'Campaign launch message',
    impressions: 14300,
    engagementRate: 15.2,
    interactions: 460,
    status: 'Published'
  },
  {
    id: 'P-002',
    platform: 'Twitter',
    title: 'Neighborhood school funding update',
    impressions: 9800,
    engagementRate: 12.9,
    interactions: 310,
    status: 'Published'
  },
  {
    id: 'P-003',
    platform: 'Facebook',
    title: 'Volunteer signup reminder',
    impressions: 7600,
    engagementRate: 11.3,
    interactions: 195,
    status: 'Scheduled'
  }
];

export const benchmarkComparison = [
  {
    name: 'State-wide average',
    engagement: 11.2,
    shares: 310,
    profileViews: 8600
  },
  {
    name: 'Top opponent',
    engagement: 16.4,
    shares: 520,
    profileViews: 15400
  },
  {
    name: 'Your campaign',
    engagement: 14.8,
    shares: 420,
    profileViews: 12820
  }
];
