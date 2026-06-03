import { demoPolitician } from '../data/politicianData';

export type PoliticianView =
  | 'overview'
  | 'donors'
  | 'expenses'
  | 'volunteers'
  | 'communications'
  | 'bills'
  | 'analytics'
  | 'questionnaire'
  | 'events'
  | 'ads'
  | 'polls'
  | 'speech'
  | 'settings';

type NavItem = { id: PoliticianView; label: string };

const Icon = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const NAV_ICONS: Record<PoliticianView, React.ReactElement> = {
  overview:        <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  donors:          <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm7-4a3 3 0 0 1 0 6M23 21v-2a4 4 0 0 0-3-3.87" />,
  expenses:        <Icon d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  volunteers:      <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 4a3 3 0 1 1 0-6M21 21v-2a4 4 0 0 0-3-3.87" />,
  events:          <Icon d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />,
  communications:  <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 0l8 8 8-8" />,
  polls:           <Icon d="M18 3a3 3 0 0 1 0 6H6a3 3 0 0 1 0-6h12zM6 3v18M18 3v18" />,
  ads:             <Icon d="M3 11l19-9-9 19-2-8-8-2z" />,
  speech:          <Icon d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4m-4 0h8" />,
  bills:           <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8m8 4H8m2-8H8" />,
  questionnaire:   <Icon d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />,
  analytics:       <Icon d="M18 20V10M12 20V4M6 20v-6" />,
  settings:        <Icon d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />,
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Campaign',
    items: [
      { id: 'overview',   label: 'Campaign Overview' },
      { id: 'donors',     label: 'Donor Management' },
      { id: 'expenses',   label: 'Expenses & Budget' },
      { id: 'volunteers', label: 'Volunteers' },
      { id: 'events',     label: 'Events' },
    ],
  },
  {
    label: 'Communicate',
    items: [
      { id: 'communications', label: 'Communications' },
      { id: 'polls',          label: 'Polls & Surveys' },
      { id: 'ads',            label: 'Ad Creator' },
      { id: 'speech',         label: 'Speech Writer' },
    ],
  },
  {
    label: 'Govern',
    items: [
      { id: 'bills',         label: 'Bills & Legislation' },
      { id: 'questionnaire', label: 'Policy Stances' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { id: 'analytics', label: 'Analytics' },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'settings', label: 'Settings' },
    ],
  },
];

const CollapseIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {collapsed
      ? <polyline points="9 18 15 12 9 6" />
      : <polyline points="15 18 9 12 15 6" />
    }
  </svg>
);

interface Props {
  active: PoliticianView;
  onSelect: (view: PoliticianView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function PoliticianSidebar({ active, onSelect, collapsed, onToggleCollapse }: Props) {
  return (
    <aside className={`pol-sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Logo + politician identity */}
      <div className="pol-sidebar-brand">
        <div className="pol-sidebar-brand-logo-row">
          <img src="/logo-dark.png" alt="PoliTech" className="pol-sidebar-logo-img pol-sidebar-logo-light" />
          <img src="/logo-light.png" alt="PoliTech" className="pol-sidebar-logo-img pol-sidebar-logo-dark" />
        </div>

        <div className="pol-sidebar-divider" />

        <div className="pol-sidebar-identity">
          <div className="pol-sidebar-identity-name">{demoPolitician.name}</div>
          <div className="pol-sidebar-identity-office">{demoPolitician.office}</div>
          <span className="pol-sidebar-party-badge">Your Party</span>
        </div>
      </div>

      {/* Navigation groups */}
      <nav className="pol-sidebar-nav" aria-label="Dashboard navigation">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="pol-nav-section-label">{group.label}</div>
            {group.items.map((item) => (
              <button
                key={item.id}
                className={`pol-nav-item${active === item.id ? ' active' : ''}`}
                onClick={() => onSelect(item.id)}
                title={collapsed ? item.label : undefined}
                aria-label={item.label}
                aria-current={active === item.id ? 'page' : undefined}
              >
                <span className="pol-nav-icon" aria-hidden="true">
                  {NAV_ICONS[item.id]}
                </span>
                <span className="pol-nav-label">{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="pol-sidebar-footer">
        <a
          href="/politicians"
          className="pol-sidebar-back-link"
          title={collapsed ? 'Back to Overview' : undefined}
          aria-label="Back to Overview"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="pol-nav-label">Back to Overview</span>
        </a>
        <button
          className="pol-sidebar-collapse-btn"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <CollapseIcon collapsed={collapsed} />
          <span className="pol-nav-label">{collapsed ? 'Expand' : 'Collapse'}</span>
        </button>
      </div>
    </aside>
  );
}
