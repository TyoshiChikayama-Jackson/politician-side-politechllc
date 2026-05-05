import type { Dispatch, SetStateAction } from 'react';

type HeaderProps<T extends string> = {
  active: T;
  views: readonly { id: T; label: string }[];
  onSelect: Dispatch<SetStateAction<T>>;
  onOpenMessaging: () => void;
};

export function Header<T extends string>({ active, views, onSelect, onOpenMessaging }: HeaderProps<T>) {
  return (
    <header className="page-header section-panel">
      <div className="site-brand">
        <div className="logo">PT</div>
        <div>
          <h1>PoliTech</h1>
          <p>Empowering democracy through technology</p>
        </div>
      </div>

      <nav className="nav-links">
        {views.map((view) => (
          <button
            key={view.id}
            type="button"
            className={`nav-button ${active === view.id ? 'active' : ''}`}
            onClick={() => onSelect(view.id)}
          >
            {view.label}
          </button>
        ))}
        <button
          type="button"
          className="nav-button messaging-button"
          onClick={onOpenMessaging}
          title="Send Message"
        >
          📧 Message
        </button>
      </nav>
    </header>
  );
}
