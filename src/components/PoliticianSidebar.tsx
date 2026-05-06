import { useState } from 'react';
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

type NavItem = { id: PoliticianView; label: string; icon: string };

const navItems: NavItem[] = [
  { id: 'overview', label: 'Campaign Overview', icon: '🏛️' },
  { id: 'donors', label: 'Donor Management', icon: '💰' },
  { id: 'expenses', label: 'Expenses & Budget', icon: '📊' },
  { id: 'volunteers', label: 'Volunteers', icon: '🤝' },
  { id: 'communications', label: 'Communications', icon: '📬' },
  { id: 'bills', label: 'Bills & Legislation', icon: '📋' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'questionnaire', label: 'Policy Stances', icon: '🗳️' },
  { id: 'events', label: 'Events', icon: '📅' },
  { id: 'ads', label: 'Ad Studio', icon: '📢' },
  { id: 'polls', label: 'Polls & Surveys', icon: '📊' },
  { id: 'speech', label: 'Speech Writer', icon: '🎤' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

interface Props {
  active: PoliticianView;
  onSelect: (view: PoliticianView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function PoliticianSidebar({ active, onSelect, collapsed, onToggleCollapse }: Props) {
  return (
    <aside className={`pol-sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="pol-sidebar-brand">
        <div className="pol-sidebar-logo">PT</div>
        <div className="pol-sidebar-brand-text">
          <h2>PoliTech</h2>
          <p>{demoPolitician.name}</p>
        </div>
      </div>

      <nav className="pol-sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`pol-nav-item${active === item.id ? ' active' : ''}`}
            onClick={() => onSelect(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <span className="pol-nav-icon">{item.icon}</span>
            <span className="pol-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pol-sidebar-footer">
        <button className="pol-sidebar-collapse-btn" onClick={onToggleCollapse}>
          <span>{collapsed ? '→' : '←'}</span>
          <span className="pol-nav-label">{collapsed ? 'Expand' : 'Collapse'}</span>
        </button>
      </div>
    </aside>
  );
}
