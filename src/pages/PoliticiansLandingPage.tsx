import { useState, useEffect, useRef } from 'react';
import '../styles/politicians-landing.css';

// ─── Scroll reveal hook ───────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, className: visible ? 'lp-reveal visible' : 'lp-reveal' };
}

// ─── Counter hook ─────────────────────────────────────────────────────────────
function useCounter(target: number, duration = 1200, active = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return value;
}

// ─── SVG check icon ───────────────────────────────────────────────────────────
function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" />
      <path d="M4.5 8l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="7" fill="#EF4444" opacity="0.12" />
      <path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7h8" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`lp-nav${scrolled ? ' scrolled' : ''}`}>
      <div className="lp-nav-inner">
        <a href="/politicians" className="lp-nav-logo">
          <img src="/images/PoliTechLogo.png" alt="PoliTech" className="lp-logo-img" />
          <span className="lp-logo-text">PoliTech</span>
        </a>

        <div className={`lp-nav-links${menuOpen ? ' open' : ''}`}>
          <a href="#about" className="lp-nav-link" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#features" className="lp-nav-link" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#pricing" className="lp-nav-link" onClick={() => setMenuOpen(false)}>Pricing</a>
          <a href="#contact" className="lp-nav-link" onClick={() => setMenuOpen(false)}>Contact</a>
        </div>

        <div className="lp-nav-actions">
          <a href="https://politechllc.com/Account/Login" className="lp-btn-outline lp-btn-sm">Log In</a>
          <a href="https://politechllc.com/Account/Register" className="lp-btn-primary lp-btn-sm">Get Started</a>
        </div>

        <button className="lp-hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const reveal = useReveal();
  return (
    <section className="lp-hero" id="about">
      <div className="lp-container lp-hero-inner">
        <div {...reveal} className={reveal.className + ' lp-hero-text'}>
          <span className="lp-pill lp-pill-purple">For Campaigns &amp; Officeholders</span>
          <h1 className="lp-hero-headline">
            Your campaign doesn&rsquo;t end{' '}
            <span className="lp-gradient-text">once you&rsquo;re in office.</span>
          </h1>
          <p className="lp-hero-sub">
            PoliTech is built for the whole job. Run your campaign, win your race, and keep serving
            your district — without switching platforms, losing momentum, or starting over.
          </p>
          <div className="lp-hero-ctas">
            <a
              href="/"
              className="lp-btn-primary lp-btn-lg"
            >
              See the Dashboard
            </a>
            <a href="https://politechllc.com/Account/Register" className="lp-btn-outline lp-btn-lg">
              Get Started Free
            </a>
          </div>
          <p className="lp-trust-line">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}><path d="M2 7l3.5 3.5 6.5-7" stroke="#6B5DE6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            No credit card required&nbsp;&nbsp;·&nbsp;&nbsp;
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}><path d="M2 7l3.5 3.5 6.5-7" stroke="#6B5DE6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Built for Indiana&nbsp;&nbsp;·&nbsp;&nbsp;
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}><path d="M2 7l3.5 3.5 6.5-7" stroke="#6B5DE6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            From announcement to re-election
          </p>
        </div>

        <div className="lp-hero-visual">
          <div className="lp-hero-panel">
            <div className="lp-hero-panel-glow" />
            <div className="lp-hero-mockup-frame">
              <div className="lp-mockup-bar lp-mockup-bar-dark">
                <span className="lp-dot lp-dot-red" />
                <span className="lp-dot lp-dot-yellow" />
                <span className="lp-dot lp-dot-green" />
                <span className="lp-mockup-url">politechllc.com/dashboard</span>
              </div>
              {/* TODO: Replace with actual dashboard screenshot once captured at /politician/overview/screenshot */}
              <div className="lp-mockup-placeholder">
                <img
                  src="/images/dashboard-screenshot.png"
                  alt="PoliTech Politician Dashboard"
                  className="lp-mockup-img"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    (e.currentTarget.nextElementSibling as HTMLElement | null)?.removeAttribute('hidden');
                  }}
                />
                <div className="lp-mockup-fallback" hidden>
                  <span>Dashboard Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS BAR ────────────────────────────────────────────────────────────────
function StatCircle({ num, label, active }: { num: string; label: string; active: boolean }) {
  const isPercent = num.endsWith('%');
  const isSlash = num.includes(' in ');
  const rawNum = parseInt(num.replace(/[^0-9]/g, '')) || 0;
  const counted = useCounter(rawNum, 1400, active);
  let display = num;
  if (active && !isSlash) {
    display = isPercent ? `${counted}%` : num.startsWith('$') ? `$${counted}` : `${counted}`;
  }
  return (
    <div className="lp-stat-circle-item">
      <div className="lp-stat-circle">
        <span className="lp-stat-circle-num">{display}</span>
      </div>
      <p className="lp-stat-circle-label">{label}</p>
    </div>
  );
}

function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { num: '72%', label: 'of campaigns run on disconnected tools that don\'t talk to each other — spreadsheets, donor apps, and personal email' },
    { num: '$450', label: 'average monthly cost of piecing together separate tools — before you count the hours your staff wastes on manual data entry' },
    { num: '1 in 2', label: 'state legislators have no dedicated platform after election day — governing from Gmail and hoping nothing slips through' },
  ];

  return (
    <section className="lp-stats-dark">
      <div className="lp-container" ref={ref}>
        <div className="lp-reveal" style={{ opacity: active ? 1 : 0, transform: active ? 'none' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <h2 className="lp-stats-dark-heading">Most campaign tools stop working on election night. PoliTech doesn&rsquo;t.</h2>
          <div className="lp-stats-circles">
            {stats.map((s, i) => (
              <StatCircle key={i} num={s.num} label={s.label} active={active} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES TABS ────────────────────────────────────────────────────────────
const TABS = ['Running Your Campaign', 'Donors & Compliance', 'Reaching Constituents', 'Your AI Advantage', 'Life in Office'];

const TAB_DATA = [
  {
    items: [
      'Track every donor, dollar, and deadline in one place',
      'Create fundraisers, town halls, and canvassing events — with RSVPs, ticket sales, and volunteer sign-ups built in',
      'Coordinate your ground game — volunteer shifts, canvassing lists, and phone banking scripts',
      'Know your fundraising pace before it becomes a problem',
    ],
    preview: {
      title: 'Campaign Overview',
      content: (
        <div className="lp-tab-preview-cards">
          {[
            { label: 'Total Donors', value: '20', sub: '+3 this month' },
            { label: 'Funds Raised', value: '$42.5K', sub: '$85K total cycle' },
            { label: 'Volunteer Hours', value: '312', sub: 'Across 8 volunteers' },
            { label: 'PoliCred Score', value: '84', sub: '+2 pts this month' },
          ].map((c, i) => (
            <div key={i} className="lp-preview-stat-card">
              <span className="lp-preview-stat-label">{c.label}</span>
              <span className="lp-preview-stat-value">{c.value}</span>
              <span className="lp-preview-stat-sub">{c.sub}</span>
            </div>
          ))}
        </div>
      ),
    },
  },
  {
    items: [
      'Every contribution tracked with a full audit trail',
      'Real-time alerts before a donor hits their legal limit — not after',
      'FEC reports generated in minutes, not hours',
      'Filing deadlines on your calendar before they sneak up on you',
      'If something goes wrong, you\'ll know first — not the press',
    ],
    preview: {
      title: 'FEC Compliance',
      content: (
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="lp-preview-alert-warn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            <div>
              <strong>Filing Deadline in 14 days</strong>
              <p style={{ margin: 0, fontSize: '0.82rem', opacity: 0.8 }}>Q2 Report due July 15 — Form FEC 3</p>
            </div>
          </div>
          <div className="lp-preview-donor-row">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Helen Russo</div>
              <div style={{ fontSize: '0.78rem', opacity: 0.6 }}>$3,000 · May 3</div>
            </div>
            <span className="lp-preview-badge-red">LIMIT REACHED</span>
          </div>
          <div className="lp-preview-donor-row">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Priya Nair</div>
              <div style={{ fontSize: '0.78rem', opacity: 0.6 }}>$2,500 · May 5</div>
            </div>
            <span className="lp-preview-badge-green">COMPLIANT</span>
          </div>
        </div>
      ),
    },
  },
  {
    items: [
      'Every constituent message in one inbox — not scattered across three email accounts',
      'Send targeted email campaigns to donors, volunteers, or your whole district',
      'Publish directly to your public PoliTech voter profile',
      'Know how many people you\'re actually reaching — open rates, click rates, response rates',
      'Your response time is tracked and shown publicly — it builds trust',
    ],
    preview: {
      title: 'Communications Hub',
      content: (
        <div style={{ display: 'grid', gap: 8 }}>
          {[
            { from: 'Janet Torres', subj: 'Re: HB 1042 Education Question', date: 'May 5', unread: true },
            { from: 'Marcus Webb', subj: 'Infrastructure concerns in District 42', date: 'May 4', unread: true },
            { from: 'Sara Chen', subj: 'Town hall follow-up', date: 'May 3', unread: false },
          ].map((m, i) => (
            <div key={i} className="lp-preview-inbox-row">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{m.from}</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subj}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                <span style={{ fontSize: '0.72rem', opacity: 0.5 }}>{m.date}</span>
                {m.unread ? <span className="lp-preview-badge-blue">UNREAD</span> : <span className="lp-preview-badge-gray">READ</span>}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  },
  {
    items: [
      'Draft a speech in 30 seconds — personalized to your voting record and your district',
      'Get a plain-English briefing on any bill before a floor vote',
      'Generate ad copy for Facebook, Instagram, and Google — with compliance disclaimers built in',
      'Ask PoliAI anything about your own campaign data: "Am I on pace for my fundraising goal?"',
      'Every output is specific to you — not generic political boilerplate',
    ],
    preview: {
      title: 'PoliAI Speech Writer',
      content: (
        <div style={{ display: 'grid', gap: 10 }}>
          <div className="lp-preview-chat-user">
            <span>Draft talking points on education funding for a town hall</span>
          </div>
          <div className="lp-preview-chat-ai">
            <div className="lp-preview-chat-avatar">PT</div>
            <div className="lp-preview-chat-bubble">
              <div style={{ marginBottom: 6, fontWeight: 600, fontSize: '0.82rem' }}>Talking Points — Education Funding</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.85, lineHeight: 1.6 }}>
                1. HB 1042 increases per-pupil funding by $400 in our district<br />
                2. Prioritizes rural schools underfunded for decades<br />
                3. Offset by consolidating administrative overhead
              </div>
            </div>
          </div>
        </div>
      ),
    },
  },
  {
    items: [
      'Track and resolve constituent requests — the daily work of being in office',
      'Make your campaign promises public and show your progress on each one',
      'See what issues your district is actually calling about — not just what\'s in the news',
      'Log your reasoning behind every vote — your story, in your words, on your profile',
      'Build the track record that makes re-election easier',
    ],
    preview: {
      title: 'Promise Tracker',
      content: (
        <div style={{ display: 'grid', gap: 8 }}>
          {[
            { label: 'Increase teacher pay 10%', badge: 'IN PROGRESS', cls: 'lp-preview-badge-blue' },
            { label: 'Infrastructure bill — Route 66 repairs', badge: 'KEPT', cls: 'lp-preview-badge-green' },
            { label: 'Property tax reform package', badge: 'NOT STARTED', cls: 'lp-preview-badge-gray' },
          ].map((p, i) => (
            <div key={i} className="lp-preview-promise-row">
              <div style={{ flex: 1, fontSize: '0.88rem', fontWeight: 500 }}>{p.label}</div>
              <span className={p.cls}>{p.badge}</span>
            </div>
          ))}
        </div>
      ),
    },
  },
];

function FeaturesSection() {
  const reveal = useReveal();
  const [activeTab, setActiveTab] = useState(0);
  const tab = TAB_DATA[activeTab];

  return (
    <section className="lp-features-tabs" id="features">
      <div className="lp-container">
        <div {...reveal} className={reveal.className + ' lp-section-header'}>
          <span className="lp-eyebrow">What PoliTech Does</span>
          <h2 className="lp-section-title lp-gradient-text">Built for the whole job — not just election day</h2>
          <p className="lp-section-sub">
            Two phases. One platform. From your first fundraiser to your re-election campaign.
          </p>
        </div>

        <div className="lp-tab-nav">
          {TABS.map((t, i) => (
            <button
              key={i}
              className={`lp-tab-btn${activeTab === i ? ' active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="lp-tab-panel">
          <div className="lp-tab-list">
            {tab.items.map((item, i) => (
              <div key={i} className="lp-tab-list-item">
                <CheckIcon className="lp-tab-check" />
                <span>{item}</span>
              </div>
            ))}
            <a
              href="/"
              className="lp-btn-primary lp-btn-lg"
              style={{ marginTop: 8, alignSelf: 'flex-start' }}
            >
              Try it live →
            </a>
          </div>
          <div className="lp-tab-preview-card">
            <div className="lp-tab-preview-header">{tab.preview.title}</div>
            <div className="lp-tab-preview-body">{tab.preview.content}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const reveal = useReveal();
  const steps = [
    {
      svgPath: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      num: '01',
      title: 'Launch Your Campaign',
      desc: 'Set up your profile, connect your committee, and start building your donor list. Your public voter profile on PoliTech goes live the same day — voters can find you before the first ad runs.',
    },
    {
      svgPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
      num: '02',
      title: 'Run and Win',
      desc: 'Manage donors, host events, and coordinate your ground game — with PoliAI writing your speeches, ads, and constituent replies. Stay compliant, stay organized, stay on offense.',
    },
    {
      svgPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
      num: '03',
      title: 'Serve — and Get Re-elected',
      desc: 'After election day, PoliTech doesn\'t go quiet. Track legislation, resolve constituent casework, keep your promises public, and build the credibility that wins the next race before you even announce.',
    },
  ];

  return (
    <section className="lp-how lp-bg-gray">
      <div className="lp-container">
        <div {...reveal} className={reveal.className + ' lp-section-header'}>
          <h2 className="lp-section-title">Three phases. One continuous platform.</h2>
        </div>
        <div className="lp-steps-grid">
          {steps.map((s, i) => (
            <div key={i} className="lp-step">
              <div className="lp-step-icon-circle">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.svgPath} />
                </svg>
              </div>
              <div className="lp-step-num">{s.num}</div>
              <h3 className="lp-step-title">{s.title}</h3>
              <p className="lp-step-desc">{s.desc}</p>
              {i < steps.length - 1 && <div className="lp-step-connector" />}
            </div>
          ))}
        </div>
        <div className="lp-how-cta">
          <a href="https://politechllc.com/Account/Register" className="lp-btn-primary lp-btn-lg">
            Start for free →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── COMPETITOR TABLE ─────────────────────────────────────────────────────────
function CompetitorSection() {
  const reveal = useReveal();

  type CellType = 'check' | 'x' | 'partial' | 'text';
  type Cell = { type: CellType; text?: string };

  const rows: { feature: string; cells: Cell[] }[] = [
    { feature: 'Donor management + FEC compliance', cells: [{ type: 'check' }, { type: 'text', text: 'Donations only' }, { type: 'check' }, { type: 'check' }, { type: 'x' }] },
    { feature: 'AI speech & ad writer', cells: [{ type: 'check' }, { type: 'x' }, { type: 'x' }, { type: 'x' }, { type: 'x' }] },
    { feature: 'Constituent casework', cells: [{ type: 'check' }, { type: 'x' }, { type: 'x' }, { type: 'x' }, { type: 'x' }] },
    { feature: 'Campaign promise tracker', cells: [{ type: 'check' }, { type: 'x' }, { type: 'x' }, { type: 'x' }, { type: 'x' }] },
    { feature: 'Built for state & local races', cells: [{ type: 'check' }, { type: 'text', text: 'Federal-focused' }, { type: 'text', text: 'Expensive' }, { type: 'text', text: 'Expensive' }, { type: 'check' }] },
    { feature: 'Post-election governing tools', cells: [{ type: 'check' }, { type: 'x' }, { type: 'x' }, { type: 'x' }, { type: 'x' }] },
    { feature: 'Bill tracking + voting record', cells: [{ type: 'check' }, { type: 'x' }, { type: 'x' }, { type: 'x' }, { type: 'x' }] },
    { feature: 'Public voter-facing profile', cells: [{ type: 'check' }, { type: 'x' }, { type: 'x' }, { type: 'x' }, { type: 'x' }] },
    { feature: 'Starts free', cells: [{ type: 'check' }, { type: 'check' }, { type: 'x' }, { type: 'x' }, { type: 'check' }] },
    { feature: 'All-in-one platform', cells: [{ type: 'check' }, { type: 'x' }, { type: 'text', text: 'Partial' }, { type: 'text', text: 'Partial' }, { type: 'x' }] },
  ];

  const renderCell = (cell: Cell, isPoliTech = false) => {
    if (cell.type === 'check') {
      return (
        <span className={isPoliTech ? 'lp-comp-check-pt' : 'lp-comp-check'}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      );
    }
    if (cell.type === 'x') return <span className="lp-comp-x"><XIcon /></span>;
    if (cell.type === 'partial') return <span className="lp-comp-partial"><DashIcon /></span>;
    return <span className="lp-comp-text">{cell.text}</span>;
  };

  return (
    <section className="lp-competitor">
      <div className="lp-container">
        <div {...reveal} className={reveal.className + ' lp-section-header'}>
          <span className="lp-eyebrow">How We&rsquo;re Different</span>
          <h2 className="lp-section-title lp-gradient-text">Every other tool stops at election night</h2>
          <p className="lp-section-sub">ActBlue processes donations. NationBuilder runs lists. NGP VAN manages volunteers. None of them are there on November 4th. PoliTech is.</p>
        </div>
        <div className="lp-comp-table-wrap">
          <table className="lp-comp-table">
            <thead>
              <tr>
                <th className="lp-comp-th-feature">Feature</th>
                <th className="lp-comp-th-pt">
                  PoliTech
                  <span className="lp-comp-best">Best Choice</span>
                </th>
                <th>ActBlue / WinRed</th>
                <th>NationBuilder</th>
                <th>NGP VAN</th>
                <th>Spreadsheets</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'lp-comp-row-even' : ''}>
                  <td className="lp-comp-td-feature">{row.feature}</td>
                  <td className="lp-comp-td-pt">{renderCell(row.cells[0], true)}</td>
                  <td>{renderCell(row.cells[1])}</td>
                  <td>{renderCell(row.cells[2])}</td>
                  <td>{renderCell(row.cells[3])}</td>
                  <td>{renderCell(row.cells[4])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="lp-comp-disclaimer">
          Competitor feature assessments based on publicly available information. Pricing and features subject to change.
        </p>
      </div>
    </section>
  );
}

// ─── DEMO PREVIEW ─────────────────────────────────────────────────────────────
function DemoSection() {
  const reveal = useReveal();
  const bullets = [
    'Live donor records with a real compliance warning firing',
    'AI speech writer — type a topic, watch it draft',
    'Filing deadlines already on the calendar',
    'Constituent inbox with unread messages waiting',
    'Promise tracker showing real progress',
  ];

  return (
    <section className="lp-demo-preview" id="demo">
      <div className="lp-container lp-demo-preview-inner">
        <div {...reveal} className={reveal.className + ' lp-demo-preview-text'}>
          <span className="lp-pill lp-pill-white">Live Demo</span>
          <h2 className="lp-section-title lp-white">See what governing and campaigning looks like in one place</h2>
          <p className="lp-section-sub lp-white-muted">
            This is a real, working dashboard — not a mockup. Click through donor management, FEC
            compliance, the AI speech writer, constituent communications, and the promise tracker.
            No login. No sales call. Just the product.
          </p>
          <ul className="lp-demo-bullets">
            {bullets.map((b, i) => (
              <li key={i}>
                <span className="lp-demo-dot" />
                {b}
              </li>
            ))}
          </ul>
          <a
            href="/"
            className="lp-btn-white lp-btn-lg"
          >
            Explore the Dashboard →
          </a>
          <p style={{ marginTop: 10, fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>
            No account needed. This is the real thing.
          </p>
        </div>

        <div className="lp-demo-mockup-wrap">
          <div className="lp-demo-browser-frame">
            <div className="lp-mockup-bar lp-mockup-bar-dark">
              <span className="lp-dot lp-dot-red" />
              <span className="lp-dot lp-dot-yellow" />
              <span className="lp-dot lp-dot-green" />
              <span className="lp-mockup-url">politician-side-politechllc.vercel.app</span>
            </div>
            {/* TODO: Replace with actual screenshot from /politician/overview/screenshot route */}
            <img
              src="/images/dashboard-screenshot.png"
              alt="Dashboard Preview"
              className="lp-mockup-img lp-demo-mockup-img"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                (e.currentTarget.nextElementSibling as HTMLElement | null)?.removeAttribute('hidden');
              }}
            />
            <div className="lp-mockup-fallback" hidden>
              <span>Dashboard Preview</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
function PricingSection() {
  const reveal = useReveal();
  const [annual, setAnnual] = useState(false);

  const tiers = [
    {
      name: 'Starter',
      badge: 'Free forever',
      badgeCls: 'lp-price-badge-gray',
      monthly: 0,
      featured: false,
      cta: 'Start Free',
      ctaClass: 'lp-btn-outline',
      features: [
        { ok: true,  text: 'Public PoliTech politician profile' },
        { ok: true,  text: 'Up to 50 donor records' },
        { ok: true,  text: '5 PoliAI prompts per day' },
        { ok: true,  text: 'Basic analytics' },
        { ok: true,  text: 'PoliFeed post publisher' },
        { ok: false, text: 'FEC report generator' },
        { ok: false, text: 'Event management' },
        { ok: false, text: 'Email campaigns' },
        { ok: false, text: 'Staff access' },
      ],
    },
    {
      name: 'PoliBase',
      badge: 'Most Popular',
      badgeCls: 'lp-price-badge-purple',
      monthly: 49,
      featured: true,
      cta: 'Get PoliBase',
      ctaClass: 'lp-btn-primary',
      features: [
        { ok: true, text: 'Everything in Starter' },
        { ok: true, text: 'Unlimited donor records + FEC reports' },
        { ok: true, text: 'Filing deadline calendar + email alerts' },
        { ok: true, text: 'Event management with public RSVP pages' },
        { ok: true, text: 'Email campaigns (up to 2,500 contacts)' },
        { ok: true, text: 'Volunteer management' },
        { ok: true, text: '20 PoliAI prompts per day' },
        { ok: true, text: 'Ad creative generator' },
        { ok: true, text: 'Staff access (2 users)' },
      ],
    },
    {
      name: 'PoliUnlimited',
      badge: 'Full Suite',
      badgeCls: 'lp-price-badge-navy',
      monthly: 99,
      featured: false,
      cta: 'Get PoliUnlimited',
      ctaClass: 'lp-btn-primary',
      features: [
        { ok: true, text: 'Everything in PoliBase' },
        { ok: true, text: 'Unlimited PoliAI prompts' },
        { ok: true, text: 'Speech writer + talking points generator' },
        { ok: true, text: 'Constituent casework system' },
        { ok: true, text: 'Campaign promise tracker' },
        { ok: true, text: 'Poll & survey builder' },
        { ok: true, text: 'Advanced district analytics' },
        { ok: true, text: 'Staff access (5 users)' },
        { ok: true, text: 'Priority support' },
      ],
    },
  ];

  return (
    <section className="lp-pricing lp-bg-gray" id="pricing">
      <div className="lp-container">
        <div {...reveal} className={reveal.className + ' lp-section-header'}>
          <span className="lp-eyebrow">Pricing</span>
          <h2 className="lp-section-title">Pricing that works for a state race</h2>
          <p className="lp-section-sub">Most enterprise political software is priced for national campaigns. PoliTech is built for state and local politicians — and priced to match.</p>
          <div className="lp-billing-toggle">
            <span className={!annual ? 'lp-toggle-active' : ''}>Monthly</span>
            <button className={`lp-toggle-switch${annual ? ' on' : ''}`} onClick={() => setAnnual(v => !v)} aria-label="Toggle annual billing">
              <span className="lp-toggle-thumb" />
            </button>
            <span className={annual ? 'lp-toggle-active' : ''}>Annual <span className="lp-toggle-save">Save 20%</span></span>
          </div>
        </div>
        <div className="lp-pricing-grid">
          {tiers.map((t, i) => {
            const price = t.monthly === 0 ? 0 : annual ? Math.round(t.monthly * 0.8) : t.monthly;
            return (
              <div key={i} className={`lp-price-card${t.featured ? ' featured' : ''}`}>
                {t.featured && <div className="lp-popular-badge">Most Popular</div>}
                <span className={`lp-price-badge2 ${t.badgeCls}`}>{t.badge}</span>
                <div className="lp-price-name">{t.name}</div>
                <div className="lp-price-amount">
                  <span className="lp-price-dollar">{t.monthly === 0 ? 'Free' : `$${price}`}</span>
                  {t.monthly > 0 && <span className="lp-price-period">/ month</span>}
                </div>
                {annual && t.monthly > 0 && <div className="lp-price-annual-note">Billed ${price * 12}/year</div>}
                <ul className="lp-price-features">
                  {t.features.map((f, j) => (
                    <li key={j} className={f.ok ? 'lp-feat-ok' : 'lp-feat-no'}>
                      {f.ok
                        ? <CheckIcon className="lp-feat-check-icon" />
                        : <span className="lp-feat-icon">✗</span>
                      }
                      {f.text}
                    </li>
                  ))}
                </ul>
                <a href="https://politechllc.com/Account/Register" className={`${t.ctaClass} lp-btn-block`}>{t.cta}</a>
              </div>
            );
          })}
        </div>
        <p className="lp-pricing-custom">
          Need a custom plan for a party organization or PAC?{' '}
          <a href="#contact" className="lp-text-link">Contact us →</a>
        </p>
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function AboutSection() {
  const reveal = useReveal();
  return (
    <section className="lp-about">
      <div className="lp-container lp-about-inner">
        <div {...reveal} className={reveal.className + ' lp-about-text'}>
          <span className="lp-eyebrow">About PoliTech</span>
          <h2 className="lp-section-title" style={{ textAlign: 'left' }}>
            Built in Indiana. For politicians who take the whole job seriously.
          </h2>
          <p className="lp-about-body">
            PoliTech was started by Tyoshi Chikayama-Jackson and Jonathan Baker — two Evansville
            natives who watched local politicians run campaigns on spreadsheets and govern on
            personal Gmail accounts. The tools existed for national races. Nothing existed for the
            races that actually shape people's daily lives.
          </p>
          <p className="lp-about-body">
            So we built it. Starting with Indiana's 150 state legislators and expanding to all 50
            states, PoliTech gives state and local politicians a platform that's with them through
            the whole job — not just the 90 days before an election.
          </p>
          <p className="lp-about-body">
            PoliTech is advised by Alexander Burton, Indiana State House District 77, and supported
            by the Indiana Small Business Development Center.
          </p>
          <div className="lp-about-stats">
            <div className="lp-about-stat">
              <span className="lp-about-stat-num">167</span>
              <span className="lp-about-stat-label">Indiana politicians on the platform</span>
            </div>
            <div className="lp-about-divider" />
            <div className="lp-about-stat">
              <span className="lp-about-stat-num">8,000+</span>
              <span className="lp-about-stat-label">bills tracked in the system</span>
            </div>
          </div>
        </div>

        <div className="lp-about-card">
          <img src="/images/PoliTechLogo.png" alt="PoliTech" className="lp-about-card-logo" />
          <div className="lp-about-founder">
            <div className="lp-about-founder-name">Tyoshi Chikayama-Jackson</div>
            <div className="lp-about-founder-title">CEO &amp; Co-Founder</div>
          </div>
          <div className="lp-about-founder" style={{ marginTop: 12 }}>
            <div className="lp-about-founder-name">Jonathan Baker</div>
            <div className="lp-about-founder-title">COO &amp; Co-Founder</div>
          </div>
          <p className="lp-about-card-tagline">"Campaign smarter. Govern better."</p>
          <svg viewBox="0 0 200 240" className="lp-indiana-svg" aria-label="Indiana state outline">
            <path
              d="M60 20 L80 18 L140 22 L145 40 L148 60 L150 90 L148 120 L145 150 L140 180 L130 210 L120 225 L110 235 L100 240 L90 235 L80 225 L70 210 L60 180 L55 150 L52 120 L50 90 L52 60 L55 40 Z"
              fill="#6B5DE6"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FaqSection() {
  const reveal = useReveal();
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Is PoliTech only for Indiana politicians?',
      a: "PoliTech is currently optimized for Indiana state and local races — with IGA bill tracking, Indiana Election Commission compliance dates, and district data built in. We're actively expanding to all 50 states. Sign up now to get early access for your state.",
    },
    {
      q: 'How is this different from ActBlue or WinRed?',
      a: "ActBlue and WinRed are donation processors — they collect money and send it to campaigns. PoliTech is a full campaign management platform: donor CRM, FEC compliance, volunteer coordination, constituent communications, AI tools, and post-election governing tools. They solve one piece; we solve everything.",
    },
    {
      q: 'Does PoliTech handle FEC compliance automatically?',
      a: "Yes. The donor management system enforces contribution limits in real time, flags prohibited sources, and generates Schedule A and Schedule B exports for filing. A treasurer should always review reports before submitting — PoliTech makes that review fast and accurate.",
    },
    {
      q: 'Can my campaign staff access the dashboard?',
      a: "PoliBase includes 2 staff seats. PoliUnlimited includes 5. Role-based permissions mean your treasurer only sees financial data, your comms person only sees messaging tools, and your campaign manager sees everything.",
    },
    {
      q: 'What happens after the election?',
      a: "Most campaign tools go dark after election day. PoliTech doesn't. The governing tools — constituent casework, promise tracker, bill tracking, and district analytics — are designed for the work of being in office, not just getting there.",
    },
    {
      q: 'How does the PoliAI speech writer work?',
      a: "PoliAI is powered by Claude AI and knows your voting record, district, committee assignments, and policy stances. When you ask it to draft talking points on a bill, it uses your actual record — not generic political boilerplate. Every output is specific to you.",
    },
  ];

  return (
    <section className="lp-faq lp-bg-gray" id="faq">
      <div className="lp-container lp-faq-inner">
        <div {...reveal} className={reveal.className + ' lp-section-header'}>
          <h2 className="lp-section-title">Frequently Asked Questions</h2>
        </div>
        <div className="lp-faq-list">
          {faqs.map((f, i) => (
            <div key={i} className={`lp-faq-item${open === i ? ' open' : ''}`} onClick={() => setOpen(open === i ? null : i)}>
              <div className="lp-faq-q">
                <span>{f.q}</span>
                <svg
                  className="lp-faq-chevron"
                  width="18" height="18" viewBox="0 0 18 18" fill="none"
                  style={{ transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease', flexShrink: 0 }}
                >
                  <path d="M4.5 6.75L9 11.25l4.5-4.5" stroke="#6B5DE6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="lp-faq-a" style={{ maxHeight: open === i ? '400px' : '0' }}>
                <p>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CLOSING CTA ──────────────────────────────────────────────────────────────
function ClosingCTA() {
  const reveal = useReveal();
  return (
    <section className="lp-closing">
      <div className="lp-container lp-closing-inner">
        <div {...reveal} className={reveal.className}>
          <h2 className="lp-closing-title">The whole job deserves the right platform.</h2>
          <p className="lp-closing-sub">
            Join Indiana politicians using PoliTech to run smarter campaigns and serve their
            districts better. From announcement to re-election.
          </p>
          <div className="lp-closing-ctas">
            <a href="https://politechllc.com/Account/Register" className="lp-btn-white lp-btn-lg">
              Get Started Free
            </a>
            <a
              href="/"
              className="lp-btn-outline-white lp-btn-lg"
            >
              See the Dashboard
            </a>
          </div>
          <p style={{ marginTop: 20, fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)' }}>
            No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function ContactSection() {
  const reveal = useReveal();
  const [form, setForm] = useState({ name: '', email: '', office: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="lp-contact" id="contact">
      <div className="lp-container lp-contact-inner">
        <div {...reveal} className={reveal.className + ' lp-contact-info'}>
          <h2 className="lp-section-title" style={{ textAlign: 'left' }}>Get In Touch</h2>
          <p className="lp-section-sub" style={{ textAlign: 'left', margin: '0 0 32px' }}>
            Questions about PoliTech for your campaign? Want a walkthrough? We'd love to connect.
          </p>
          <div className="lp-contact-details">
            <div className="lp-contact-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B5DE6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              <a href="mailto:contact@politechllc.com">contact@politechllc.com</a>
            </div>
            <div className="lp-contact-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B5DE6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span>Newburgh, Indiana</span>
            </div>
          </div>
        </div>

        {sent ? (
          <div className="lp-contact-form" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="rgba(107,93,230,0.1)" /><path d="M14 24l7 7 13-15" stroke="#6B5DE6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <h3 style={{ margin: 0, color: '#111827' }}>Message sent!</h3>
            <p style={{ color: '#6B7280', textAlign: 'center', fontSize: '0.95rem' }}>We'll be in touch within one business day.</p>
          </div>
        ) : (
          <form className="lp-contact-form" onSubmit={handleSubmit}>
            <div className="lp-form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Your full name" value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} required />
            </div>
            <div className="lp-form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@campaign.com" value={form.email} onChange={e => setForm(v => ({ ...v, email: e.target.value }))} required />
            </div>
            <div className="lp-form-group">
              <label>Office / Race</label>
              <input type="text" placeholder="e.g. Indiana State House, District 42" value={form.office} onChange={e => setForm(v => ({ ...v, office: e.target.value }))} />
            </div>
            <div className="lp-form-group">
              <label>Message</label>
              <textarea placeholder="Tell us about your campaign..." rows={4} value={form.message} onChange={e => setForm(v => ({ ...v, message: e.target.value }))} required />
            </div>
            <button type="submit" className="lp-btn-primary lp-btn-lg lp-btn-block">Send Message</button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function LandingFooter() {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-top">
          <div className="lp-footer-brand">
            <div className="lp-footer-logo-row">
              <img src="/images/PoliTechLogo.png" alt="PoliTech" className="lp-footer-logo-img" />
              <span className="lp-footer-logo-text">PoliTech</span>
            </div>
            <p className="lp-footer-tagline">Campaign smarter. Govern better.</p>
          </div>

          <div className="lp-footer-cols">
            <div className="lp-footer-col">
              <h4>Platform</h4>
              <ul>
                <li><a href="/politicians" className="lp-footer-active">Politicians</a></li>
                <li><a href="https://politechllc.com/bills">Bills</a></li>
                <li><a href="https://politechllc.com/poliai">PoliAI</a></li>
                <li><a href="https://politechllc.com/polifeed">PoliFeed</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>For Politicians</h4>
              <ul>
                <li><a href="https://politician-side-politechllc.vercel.app/" target="_blank" rel="noopener noreferrer">Live Demo</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="https://politechllc.com/Account/Register">Get Started</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="https://politechllc.com/privacy">Privacy Policy</a></li>
                <li><a href="https://politechllc.com/terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <p>© 2026 PoliTech LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ROOT ────────────────────────────────────────────────────────────────
export function PoliticiansLandingPage() {
  return (
    <div className="lp-root">
      <LandingNav />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <HowItWorksSection />
      <CompetitorSection />
      <DemoSection />
      <PricingSection />
      <AboutSection />
      <FaqSection />
      <ClosingCTA />
      <ContactSection />
      <LandingFooter />
    </div>
  );
}
