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
          <img src="/images/politech-logo.png" alt="PoliTech" className="lp-logo-img" style={{ height: 40, width: 'auto' }} />
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

// ─── SECTION 1: STATS BAR ─────────────────────────────────────────────────────
function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setActive(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const count1 = useCounter(7383, 1400, active);
  const count2 = useCounter(450, 1200, active);

  return (
    <section className="lp-statsbar" ref={ref}>
      <div className="lp-container">
        <div className="lp-statsbar-row" style={{ opacity: active ? 1 : 0, transform: active ? 'none' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
          <div className="lp-statsbar-item">
            <span className="lp-statsbar-num">{active ? count1.toLocaleString() : '0'}</span>
            <span className="lp-statsbar-label">state and local legislators in the U.S. with no dedicated platform for the full job</span>
          </div>
          <div className="lp-statsbar-divider" />
          <div className="lp-statsbar-item">
            <span className="lp-statsbar-num">${active ? count2 : '0'}/mo</span>
            <span className="lp-statsbar-label">average cost of piecing together separate donor, volunteer, and email tools — before staff time</span>
          </div>
          <div className="lp-statsbar-divider" />
          <div className="lp-statsbar-item">
            <span className="lp-statsbar-num lp-statsbar-statement">Election night is when most campaign tools go quiet.</span>
            <span className="lp-statsbar-sub-statement">PoliTech doesn&rsquo;t.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 2: TWO PHASE ─────────────────────────────────────────────────────
function TwoPhaseSection() {
  const reveal = useReveal();
  return (
    <section className="lp-two-phase">
      <div className="lp-container">
        <div {...reveal} className={reveal.className + ' lp-section-header'}>
          <span className="lp-eyebrow">How It Works</span>
          <h2 className="lp-section-title">Built for two phases of the same job</h2>
          <p className="lp-section-sub">Most tools are built for one or the other. PoliTech covers both — and connects them.</p>
        </div>
        <div className="lp-two-phase-grid">
          <div className="lp-phase-card">
            <div className="lp-phase-label">PHASE 1</div>
            <h3 className="lp-phase-title">Campaign Mode</h3>
            <p className="lp-phase-sub">From announcement to election night</p>
            <hr className="lp-phase-divider" />
            <ul className="lp-phase-list">
              {[
                'Donor CRM with real-time FEC compliance',
                'Filing deadline calendar with automatic alerts',
                'Event management — fundraisers, town halls, canvassing',
                'Volunteer coordination and ground game tools',
                'Email campaigns with open and click analytics',
                'AI-powered speech writer and ad creator',
                'Phone banking with call scripts and logging',
                'Expense tracking and budget management',
              ].map((item, i) => (
                <li key={i} className="lp-phase-list-item">
                  <span className="lp-phase-dot" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="lp-phase-quote">
              <em>&ldquo;When you&rsquo;re running, PoliTech is your campaign headquarters.&rdquo;</em>
            </div>
          </div>
          <div className="lp-phase-card">
            <div className="lp-phase-label">PHASE 2</div>
            <h3 className="lp-phase-title">Office Mode</h3>
            <p className="lp-phase-sub">From swearing in to re-election</p>
            <hr className="lp-phase-divider" />
            <ul className="lp-phase-list">
              {[
                'Constituent casework — track and resolve every request',
                'Campaign promise tracker — public accountability built in',
                'Bill tracking and plain-English briefings before every vote',
                'Voting record with your personal rationale attached',
                'District issue tracking — pin problems, show resolutions',
                'Media monitoring — know when you\'re mentioned',
                'Constituent inbox — all messages in one place',
                'PoliAI assistant — ask anything about your office data',
              ].map((item, i) => (
                <li key={i} className="lp-phase-list-item">
                  <span className="lp-phase-dot" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="lp-phase-quote">
              <em>&ldquo;When you&rsquo;re serving, PoliTech is your chief of staff.&rdquo;</em>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 3: FEATURE TABS ──────────────────────────────────────────────────
const FEATURE_TABS = ['Donors & Compliance', 'Communications', 'AI Tools', 'Events & Ground Game', 'Governing'];

type FeatureItem = { title: string; desc: string };
type FeatureTab = { features: FeatureItem[]; preview: { title: string; content: React.ReactNode } };

const FEATURE_TAB_DATA: FeatureTab[] = [
  {
    features: [
      { title: 'Donor CRM', desc: 'Every contribution tracked with full history, employer, occupation, and source verification.' },
      { title: 'Real-Time Limit Enforcement', desc: 'Hard stops before a donor hits their legal limit — not after. Protects your campaign from violations you didn\'t see coming.' },
      { title: 'FEC Report Generator', desc: 'Schedule A and B exports, .fec file format, and PDF summaries generated in minutes.' },
      { title: 'Filing Deadline Calendar', desc: 'Every federal and state reporting deadline on one calendar, with email alerts at 30, 10, and 3 days out.' },
      { title: 'Audit Log', desc: 'Every change to every record, timestamped and attributed. If you\'re ever audited, you\'re ready.' },
    ],
    preview: {
      title: 'FEC Compliance',
      content: (
        <div style={{ display: 'grid', gap: 10 }}>
          <div className="lp-ftab-alert lp-ftab-alert-red">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <span>1 contribution exceeds state limit — refund required</span>
          </div>
          <div className="lp-ftab-alert lp-ftab-alert-amber">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            <span>Q2 filing deadline in 14 days</span>
          </div>
          <div className="lp-ftab-alert lp-ftab-alert-green">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            <span>Schedule A export ready — 47 itemized contributions</span>
          </div>
        </div>
      ),
    },
  },
  {
    features: [
      { title: 'Constituent Inbox', desc: 'All messages from all channels in one place. No more digging through three email accounts.' },
      { title: 'Email Campaigns', desc: 'Send to your full list or a targeted segment. See open rates, click rates, and unsubscribes after every send.' },
      { title: 'PoliFeed Publisher', desc: 'Post directly to your public PoliTech voter profile — your constituents see your updates without a middleman.' },
      { title: 'Response Rate Tracking', desc: 'Your average response time is tracked and shown publicly on your profile. Responsiveness builds trust.' },
      { title: 'Message Templates', desc: 'Pre-drafted responses for the most common constituent questions — edit and send in seconds.' },
    ],
    preview: {
      title: 'Constituent Inbox',
      content: (
        <div style={{ display: 'grid', gap: 8 }}>
          {[
            { msg: 'Question about school funding', time: '2 hours ago', unread: true },
            { msg: 'Pothole on Main Street', time: 'Yesterday', unread: true },
            { msg: 'Thank you for your vote', time: 'May 20', unread: false },
          ].map((m, i) => (
            <div key={i} className="lp-ftab-inbox-row">
              <span className={`lp-ftab-inbox-dot${m.unread ? ' unread' : ''}`} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: m.unread ? 700 : 500, fontSize: '0.88rem', color: 'rgba(255,255,255,0.9)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.msg}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{m.time}</div>
              </div>
              {m.unread && <span className="lp-preview-badge-blue">UNREAD</span>}
            </div>
          ))}
        </div>
      ),
    },
  },
  {
    features: [
      { title: 'Speech Writer', desc: 'Type a topic or select a bill. PoliAI drafts talking points, a full speech, or a floor statement — personalized to your record and your district. Done in 30 seconds.' },
      { title: 'Ad Creative Generator', desc: 'Facebook, Instagram, and Google ad copy with compliance disclaimers built in. Three variants per generation so you can test.' },
      { title: 'Bill Briefing', desc: 'Select any bill before a vote. PoliAI reads the full text and gives you a plain-English summary, fiscal impact, and likely constituent effects.' },
      { title: 'Constituent Reply Assistant', desc: 'PoliAI suggests a draft reply for any message in your inbox. Edit and send — or send as-is.' },
      { title: 'PoliAI Assistant', desc: 'Ask anything: "Am I on pace for my fundraising goal?" "What issues are trending in my inbox this week?" Answers grounded in your actual data.' },
    ],
    preview: {
      title: 'PoliAI Speech Writer',
      content: (
        <div style={{ display: 'grid', gap: 10 }}>
          <div className="lp-preview-chat-user">
            <span>Draft talking points on infrastructure funding for a town hall</span>
          </div>
          <div className="lp-preview-chat-ai">
            <div className="lp-preview-chat-avatar">PT</div>
            <div className="lp-preview-chat-bubble">
              <div style={{ marginBottom: 6, fontWeight: 700, fontSize: '0.8rem', color: '#a78bfa' }}>Talking Points — Infrastructure</div>
              <div style={{ fontSize: '0.79rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.85)' }}>
                1. Our district&rsquo;s roads rank in the bottom quartile for state funding per mile...<br />
                2. This bill directs $2.4M to local infrastructure over 3 years...<br />
                3. Every $1 in infrastructure investment returns $2.20 in economic activity...
              </div>
              <div style={{ marginTop: 8, fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>Generated in 4 seconds</div>
            </div>
          </div>
        </div>
      ),
    },
  },
  {
    features: [
      { title: 'Event Management', desc: 'Create fundraisers, town halls, and canvassing events. Manage RSVPs, ticket tiers, revenue, and check-ins from one page.' },
      { title: 'Public Event Pages', desc: 'Every event gets a shareable URL. Constituents RSVP without needing a PoliTech account.' },
      { title: 'Volunteer Coordination', desc: 'Schedule shifts, track hours, and manage your volunteer roster. Top volunteers get recognized — retention improves.' },
      { title: 'Canvassing Tracker', desc: 'Assign address lists, log door outcomes, and see precinct completion on a visual grid — no map API required.' },
      { title: 'Phone Banking', desc: 'Structured call scripts, one-click disposition logging, and callback scheduling — all connected to your volunteer list.' },
    ],
    preview: {
      title: 'Upcoming Events',
      content: (
        <div style={{ display: 'grid', gap: 8 }}>
          {[
            { title: 'Annual Fundraiser', date: 'June 12', detail: '85 RSVPs · $8,200 raised', badge: 'PUBLISHED', cls: 'lp-preview-badge-green' },
            { title: 'Town Hall — Infrastructure', date: 'June 28', detail: '31 RSVPs', badge: 'IN PROGRESS', cls: 'lp-preview-badge-blue' },
            { title: 'Canvassing Day', date: 'July 6', detail: '12 volunteers assigned', badge: 'DRAFT', cls: 'lp-preview-badge-gray' },
          ].map((e, i) => (
            <div key={i} className="lp-ftab-event-row">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'rgba(255,255,255,0.9)' }}>{e.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{e.date} · {e.detail}</div>
              </div>
              <span className={e.cls}>{e.badge}</span>
            </div>
          ))}
        </div>
      ),
    },
  },
  {
    features: [
      { title: 'Constituent Casework', desc: 'Track every resident request — from benefits navigation to infrastructure complaints. Assign to staff, follow up, and close with a resolution summary.' },
      { title: 'Promise Tracker', desc: 'List your campaign commitments publicly and update progress on each one. Visible on your voter profile. Keeps you accountable — and re-electable.' },
      { title: 'Bill Tracking', desc: 'Follow any bill through the legislative process. Add your personal rationale to every vote — your story, in your words.' },
      { title: 'District Issue Map', desc: 'Constituents report issues. Staff pins them, escalates to the right agency, and marks them resolved. Your district sees problems getting fixed.' },
      { title: 'Media Monitor', desc: 'Track every news article, Reddit mention, and public reference to your name. Get alerted when negative coverage spikes before it becomes a problem.' },
    ],
    preview: {
      title: 'Promise Tracker',
      content: (
        <div style={{ display: 'grid', gap: 8 }}>
          {[
            { label: 'Secured $400 increase in per-pupil education funding', badge: 'KEPT', cls: 'lp-preview-badge-green' },
            { label: 'Infrastructure repair bill — passed committee', badge: 'IN PROGRESS', cls: 'lp-preview-badge-blue' },
            { label: 'Property tax relief proposal — in committee', badge: 'IN PROGRESS', cls: 'lp-preview-badge-blue' },
            { label: 'Small business grant program', badge: 'NOT STARTED', cls: 'lp-preview-badge-gray' },
          ].map((p, i) => (
            <div key={i} className="lp-preview-promise-row">
              <div style={{ flex: 1, fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{p.label}</div>
              <span className={p.cls} style={{ flexShrink: 0 }}>{p.badge}</span>
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
  const tab = FEATURE_TAB_DATA[activeTab];

  return (
    <section className="lp-features-tabs" id="features">
      <div className="lp-container">
        <div {...reveal} className={reveal.className + ' lp-section-header'}>
          <span className="lp-eyebrow">Features</span>
          <h2 className="lp-section-title">Every tool. One platform.</h2>
          <p className="lp-section-sub">No more switching between apps. Everything works together because it&rsquo;s built together.</p>
        </div>

        <div className="lp-tab-nav" style={{ overflowX: 'auto' }}>
          {FEATURE_TABS.map((t, i) => (
            <button key={i} className={`lp-tab-btn${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>{t}</button>
          ))}
        </div>

        <div className="lp-tab-panel">
          <div className="lp-ftab-feature-list">
            {tab.features.map((f, i) => (
              <div key={i} className="lp-ftab-feature-item">
                <div className="lp-ftab-feature-title">{f.title}</div>
                <div className="lp-ftab-feature-desc">{f.desc}</div>
              </div>
            ))}
            <a href="/" className="lp-btn-primary lp-btn-lg" style={{ marginTop: 8, alignSelf: 'flex-start' }}>Try it live &rarr;</a>
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

// ─── SECTION 4: COMPETITOR TABLE ──────────────────────────────────────────────
const COMP_ROWS = [
  { feature: 'Donor management + FEC compliance', pt: true, ab: 'Donations only', nb: true, ngp: true, ss: false },
  { feature: 'Works for state & local races', pt: true, ab: 'Federal-focused', nb: 'Expensive', ngp: 'Expensive', ss: true },
  { feature: 'Post-election governing tools', pt: true, ab: false, nb: false, ngp: false, ss: false },
  { feature: 'AI speech & ad writer', pt: true, ab: false, nb: false, ngp: false, ss: false },
  { feature: 'Constituent casework system', pt: true, ab: false, nb: false, ngp: false, ss: false },
  { feature: 'Campaign promise tracker', pt: true, ab: false, nb: false, ngp: false, ss: false },
  { feature: 'Bill tracking + voting record', pt: true, ab: false, nb: false, ngp: false, ss: false },
  { feature: 'Public voter-facing profile', pt: true, ab: false, nb: false, ngp: false, ss: false },
  { feature: 'Starts free', pt: true, ab: true, nb: false, ngp: false, ss: true },
  { feature: 'Media monitoring', pt: true, ab: false, nb: false, ngp: false, ss: false },
];

function CompCell({ val }: { val: boolean | string }) {
  if (val === true) return <span className="lp-comp-check"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>;
  if (val === false) return <XIcon />;
  return <span className="lp-comp-text lp-italic">{val}</span>;
}

function CompCellPt() {
  return (
    <span className="lp-comp-check-pt">
      <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
}

function CompetitorSection() {
  const reveal = useReveal();
  return (
    <section className="lp-competitor">
      <div className="lp-container">
        <div {...reveal} className={reveal.className + ' lp-section-header'}>
          <span className="lp-pill lp-pill-purple" style={{ marginBottom: 16 }}>Why PoliTech</span>
          <h2 className="lp-section-title" style={{ color: '#ffffff' }}>Every other tool solves one problem.</h2>
          <p className="lp-section-sub" style={{ color: 'rgba(255,255,255,0.6)' }}>PoliTech is the only platform built for both the campaign and the office.</p>
        </div>
        <div className="lp-comp-table-wrap">
          <table className="lp-comp-table">
            <thead>
              <tr>
                <th className="lp-comp-th-feature">Feature</th>
                <th className="lp-comp-th-pt">PoliTech<span className="lp-comp-best">Best for State &amp; Local</span></th>
                <th>ActBlue / WinRed</th>
                <th>NationBuilder</th>
                <th>NGP VAN</th>
                <th>Spreadsheets</th>
              </tr>
            </thead>
            <tbody>
              {COMP_ROWS.map((row, i) => (
                <tr key={i} className={i % 2 === 1 ? 'lp-comp-row-even' : ''}>
                  <td className="lp-comp-td-feature">{row.feature}</td>
                  <td className="lp-comp-td-pt"><CompCellPt /></td>
                  <td><CompCell val={row.ab} /></td>
                  <td><CompCell val={row.nb} /></td>
                  <td><CompCell val={row.ngp} /></td>
                  <td><CompCell val={row.ss} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="lp-comp-disclaimer" style={{ marginTop: 16, color: 'rgba(255,255,255,0.35)' }}>Competitor assessments based on publicly available product information. Features subject to change.</p>
      </div>
    </section>
  );
}

// ─── SECTION 5: DEMO ──────────────────────────────────────────────────────────
function DemoSection() {
  const reveal = useReveal();
  return (
    <section className="lp-demo-preview">
      <div className="lp-container lp-demo-preview-inner">
        <div {...reveal} className={reveal.className + ' lp-demo-preview-text'}>
          <span className="lp-pill lp-pill-white" style={{ marginBottom: 20 }}>Live Demo</span>
          <h2 className="lp-section-title" style={{ color: '#ffffff', textAlign: 'left', marginBottom: 16 }}>
            See the whole platform before you commit.
          </h2>
          <p className="lp-section-sub" style={{ color: 'rgba(255,255,255,0.88)', textAlign: 'left', margin: '0 0 24px', fontSize: '0.97rem' }}>
            This is a real, working dashboard — not a mockup or a slide deck. Click through donor management, FEC compliance, the AI speech writer, constituent communications, events, and the promise tracker. No login. No sales call. Just the product.
          </p>
          <ul className="lp-demo-bullets">
            {[
              'Live donor records with a compliance warning already firing',
              'PoliAI speech writer — type a topic and watch it draft in real time',
              'Filing deadlines already loaded on the calendar',
              'Constituent inbox with unread messages',
              'Events, volunteers, and analytics with real demo data',
              'Promise tracker showing campaign commitments and progress',
            ].map((item, i) => (
              <li key={i}>
                <span className="lp-demo-dot" />
                {item}
              </li>
            ))}
          </ul>
          <a href="/" className="lp-btn-white lp-btn-lg" style={{ marginBottom: 12 }}>
            Explore the Dashboard &rarr;
          </a>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.82rem', margin: 0 }}>No account needed. No credit card. This is the real thing.</p>
        </div>
        <div className="lp-demo-mockup-wrap">
          <div className="lp-demo-browser-frame">
            <div className="lp-mockup-bar lp-mockup-bar-dark">
              <span className="lp-dot lp-dot-red" /><span className="lp-dot lp-dot-yellow" /><span className="lp-dot lp-dot-green" />
              <span className="lp-mockup-url">politechllc.com/dashboard</span>
            </div>
            <img
              src="/images/dashboard-screenshot.png"
              alt="PoliTech Dashboard"
              className="lp-demo-mockup-img"
              style={{ width: '100%', display: 'block', maxHeight: 380, objectFit: 'cover', objectPosition: 'top' }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                (e.currentTarget.nextElementSibling as HTMLElement | null)?.removeAttribute('hidden');
              }}
            />
            <div hidden style={{ background: '#0F1117', width: '100%', height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B5DE6', fontSize: '14px', borderRadius: '0 0 8px 8px' }}>
              Dashboard Preview
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 6: PRICING ───────────────────────────────────────────────────────
function PricingSection() {
  const reveal = useReveal();
  return (
    <section className="lp-pricing" id="pricing">
      <div className="lp-container">
        <div {...reveal} className={reveal.className + ' lp-section-header'}>
          <span className="lp-eyebrow">Pricing</span>
          <h2 className="lp-section-title">Priced for state and local races — not national campaigns.</h2>
          <p className="lp-section-sub">No contracts. No setup fees. No surprises. Cancel anytime.</p>
        </div>
        <div className="lp-pricing-grid">
          {/* Starter */}
          <div className="lp-pricing-card">
            <div className="lp-pricing-badge lp-pricing-badge-gray">Free forever</div>
            <div className="lp-pricing-tier">Starter</div>
            <div className="lp-pricing-price">$0<span className="lp-pricing-per">/month</span></div>
            <p className="lp-pricing-desc">Get your public profile live and start building your base.</p>
            <ul className="lp-pricing-list">
              {['Public PoliTech politician profile', 'Up to 50 donor records', '5 PoliAI prompts per day', 'Basic analytics dashboard', 'PoliFeed post publisher'].map((f, i) => (
                <li key={i} className="lp-pricing-list-item lp-pricing-included">
                  <CheckIcon className="lp-pricing-check-gray" />{f}
                </li>
              ))}
              {['FEC report generator', 'Event management', 'Email campaigns', 'Staff access'].map((f, i) => (
                <li key={i} className="lp-pricing-list-item lp-pricing-excluded">
                  <DashIcon />{f}
                </li>
              ))}
            </ul>
            <a href="https://politechllc.com/Account/Register" className="lp-btn-outline lp-btn-block lp-btn-lg">Start Free</a>
          </div>

          {/* PoliBase */}
          <div className="lp-pricing-card lp-pricing-featured">
            <div className="lp-pricing-badge lp-pricing-badge-purple">Most Popular</div>
            <div className="lp-pricing-tier">PoliBase</div>
            <div className="lp-pricing-price">$49<span className="lp-pricing-per">/month</span></div>
            <p className="lp-pricing-desc">Everything you need to run a serious campaign and stay compliant.</p>
            <ul className="lp-pricing-list">
              {[
                'Everything in Starter',
                'Unlimited donor records + FEC reports',
                'Filing deadline calendar with email alerts',
                'Event management with public RSVP pages',
                'Email campaigns — up to 2,500 contacts',
                'Volunteer management',
                '20 PoliAI prompts per day',
                'Ad creative generator',
                'Staff access — 2 users',
              ].map((f, i) => (
                <li key={i} className="lp-pricing-list-item lp-pricing-included">
                  <CheckIcon className="lp-pricing-check-purple" />{f}
                </li>
              ))}
            </ul>
            <a href="https://politechllc.com/Account/Register" className="lp-btn-primary lp-btn-block lp-btn-lg">Get PoliBase</a>
          </div>

          {/* PoliUnlimited */}
          <div className="lp-pricing-card">
            <div className="lp-pricing-badge lp-pricing-badge-navy">Full Platform</div>
            <div className="lp-pricing-tier">PoliUnlimited</div>
            <div className="lp-pricing-price">$99<span className="lp-pricing-per">/month</span></div>
            <p className="lp-pricing-desc">Every advantage. Every tool. For the whole job.</p>
            <ul className="lp-pricing-list">
              {[
                'Everything in PoliBase',
                'Unlimited PoliAI prompts',
                'Speech writer and talking points generator',
                'Constituent casework system',
                'Campaign promise tracker',
                'Poll and survey builder',
                'Media monitoring',
                'Advanced district analytics',
                'Staff access — 5 users',
                'Priority support',
              ].map((f, i) => (
                <li key={i} className="lp-pricing-list-item lp-pricing-included">
                  <CheckIcon className="lp-pricing-check-purple" />{f}
                </li>
              ))}
            </ul>
            <a href="https://politechllc.com/Account/Register" className="lp-btn-primary lp-btn-block lp-btn-lg">Get PoliUnlimited</a>
          </div>
        </div>
        <p className="lp-pricing-org-note">
          Running a party organization or managing multiple candidates?{' '}
          <a href="#contact" className="lp-text-link">Let&rsquo;s talk &rarr;</a>
        </p>
      </div>
    </section>
  );
}

// ─── SECTION 7: FAQ ───────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: 'Is PoliTech only for certain parties or candidates?',
    a: 'Not at all. PoliTech is fully nonpartisan and serves state and local officials of every party across all 50 states. We built the platform to work for any race, any district, any affiliation.',
  },
  {
    q: 'How is this different from ActBlue or WinRed?',
    a: 'ActBlue and WinRed are donation processors — they collect money and pass it to campaigns. PoliTech is a campaign and office management platform: donor CRM, FEC compliance, volunteer coordination, constituent communications, AI tools, and post-election governing tools. We\'re not a payment processor. We\'re the platform you run your entire operation on.',
  },
  {
    q: 'What happens to my data after the election?',
    a: 'It stays, and it becomes more useful. Your donor records, constituent messages, and event history carry forward into your time in office. PoliTech is designed for the full job — the platform doesn\'t reset on November 4th.',
  },
  {
    q: 'Does PoliTech handle FEC compliance automatically?',
    a: 'Yes. The donor management system enforces contribution limits in real time, flags prohibited sources, and generates Schedule A and Schedule B exports. Always have a treasurer review reports before filing — PoliTech makes that review fast and accurate.',
  },
  {
    q: 'Can my campaign staff access the dashboard?',
    a: 'Yes. PoliBase includes 2 staff seats. PoliUnlimited includes 5. Each staff member gets a role with specific permissions — your treasurer sees financial data, your comms person sees messaging, your campaign manager sees everything.',
  },
  {
    q: 'What states does PoliTech support?',
    a: 'PoliTech currently tracks legislation and election data for Indiana, with active expansion to all 50 states underway. The campaign management tools — donors, events, volunteers, communications, and AI — work for any state right now.',
  },
  {
    q: 'How does the AI speech writer work?',
    a: 'PoliAI is powered by Claude AI. It knows your voting record, your district, your committee assignments, and your policy stances. When you ask it to draft talking points on a bill, it uses your actual record — not generic political boilerplate. Every output is personalized to you.',
  },
];

function FaqSection() {
  const reveal = useReveal();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="lp-faq" id="faq">
      <div className="lp-container lp-faq-inner">
        <div {...reveal} className={reveal.className + ' lp-section-header'} style={{ marginBottom: 40 }}>
          <h2 className="lp-section-title">Common questions</h2>
        </div>
        <div className="lp-faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`lp-faq-item${open === i ? ' open' : ''}`}>
              <button className="lp-faq-q" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                <span>{item.q}</span>
                <svg className="lp-faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className="lp-faq-a-wrap">
                <div className="lp-faq-a">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 8: FINAL CTA ─────────────────────────────────────────────────────
function ClosingCTA() {
  const reveal = useReveal();
  return (
    <section className="lp-closing-cta">
      <div className="lp-container">
        <div {...reveal} className={reveal.className} style={{ textAlign: 'center' }}>
          <h2 className="lp-closing-headline">The whole job deserves the right platform.</h2>
          <p className="lp-closing-sub">
            Join state and local officials already using PoliTech to run smarter campaigns and serve their districts better.
          </p>
          <div className="lp-closing-btns">
            <a href="/" className="lp-btn-white lp-btn-lg">Explore the Dashboard</a>
            <a href="https://politechllc.com/Account/Register" className="lp-btn-outline-white lp-btn-lg">Get Started Free</a>
          </div>
          <p className="lp-closing-fine">No credit card required &nbsp;·&nbsp; Works for any state &nbsp;·&nbsp; Cancel anytime</p>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 9: CONTACT ───────────────────────────────────────────────────────
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
      <div className="lp-container">
        <div {...reveal} className={reveal.className + ' lp-section-header'} style={{ marginBottom: 48 }}>
          <h2 className="lp-section-title">Get in touch</h2>
          <p className="lp-section-sub">Questions about PoliTech for your campaign or office? We would love to connect.</p>
        </div>
        <div className="lp-contact-grid">
          <div className="lp-contact-details">
            <div className="lp-contact-detail-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lp-contact-icon"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              <span>contact@politechllc.com</span>
            </div>
            <div className="lp-contact-detail-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lp-contact-icon"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span>Newburgh, Indiana</span>
            </div>
            <p className="lp-contact-note">We respond to all inquiries within one business day.</p>
          </div>
          <div className="lp-contact-form-wrap">
            {sent ? (
              <div className="lp-contact-success">Your message has been sent. We will be in touch shortly.</div>
            ) : (
              <form className="lp-contact-form" onSubmit={handleSubmit}>
                <div className="lp-form-field">
                  <label>Full Name</label>
                  <input type="text" value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} required />
                </div>
                <div className="lp-form-field">
                  <label>Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm(v => ({ ...v, email: e.target.value }))} required />
                </div>
                <div className="lp-form-field">
                  <label>Office or Race</label>
                  <input type="text" placeholder="e.g. State House, District 12" value={form.office} onChange={e => setForm(v => ({ ...v, office: e.target.value }))} />
                </div>
                <div className="lp-form-field">
                  <label>Message</label>
                  <textarea rows={4} value={form.message} onChange={e => setForm(v => ({ ...v, message: e.target.value }))} required />
                </div>
                <button type="submit" className="lp-btn-primary lp-btn-block lp-btn-lg">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 10: FOOTER ───────────────────────────────────────────────────────
function LandingFooter() {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-top">
          <div className="lp-footer-brand">
            <img src="/images/politech-logo.png" alt="PoliTech" className="lp-footer-logo-img" />
            <p className="lp-footer-tagline">Campaign smarter. Govern better.</p>
          </div>
          <div className="lp-footer-cols">
            <div className="lp-footer-col">
              <h4>Platform</h4>
              <ul>
                <li><a href="/politicians" className="lp-footer-active">For Politicians</a></li>
                <li><a href="https://politechllc.com/bills">Bills</a></li>
                <li><a href="https://politechllc.com/poliai">PoliAI</a></li>
                <li><a href="https://politechllc.com/polifeed">PoliFeed</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>For Officials</h4>
              <ul>
                <li><a href="/">Live Demo</a></li>
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
          <span>© 2026 PoliTech LLC. All rights reserved.</span>
          <span>PoliTech is a nonpartisan platform serving officials of all parties.</span>
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
      <TwoPhaseSection />
      <FeaturesSection />
      <CompetitorSection />
      <DemoSection />
      <PricingSection />
      <FaqSection />
      <ClosingCTA />
      <ContactSection />
      <LandingFooter />
    </div>
  );
}
