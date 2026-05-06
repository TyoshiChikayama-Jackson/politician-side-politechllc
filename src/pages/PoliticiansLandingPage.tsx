import { useState, useEffect, useRef } from 'react';
import '../styles/politicians-landing.css';

// ─── Scroll animation hook ────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, className: visible ? 'lp-reveal visible' : 'lp-reveal' };
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
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

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const reveal = useReveal();
  return (
    <section className="lp-hero" id="about">
      <div className="lp-container lp-hero-inner">
        <div {...reveal} className={reveal.className + ' lp-hero-text'}>
          <span className="lp-pill lp-pill-purple">For Politicians &amp; Campaigns</span>
          <h1 className="lp-hero-headline">
            The all-in-one campaign platform built for{' '}
            <span className="lp-gradient-text">Indiana politicians</span>
          </h1>
          <p className="lp-hero-sub">
            Win your election, serve your district, and build lasting trust — all from one dashboard.
            PoliTech gives campaigns and officeholders the tools they need to run smarter and govern better.
          </p>
          <div className="lp-hero-ctas">
            <a href="https://politechllc.com/Account/Register" className="lp-btn-primary lp-btn-lg">
              Get Started Free
            </a>
            <a
              href="https://politician-side-politechllc.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-outline lp-btn-lg"
            >
              See the Dashboard
            </a>
          </div>
          <p className="lp-trust-line">Trusted by Indiana legislators · No credit card required</p>
        </div>

        <div className="lp-hero-visual">
          <div className="lp-hero-mockup-wrap">
            <div className="lp-hero-mockup-bg" />
            <div className="lp-hero-mockup-frame">
              <div className="lp-mockup-bar">
                <span className="lp-dot lp-dot-red" />
                <span className="lp-dot lp-dot-yellow" />
                <span className="lp-dot lp-dot-green" />
              </div>
              {/* TODO: Replace with politician dashboard screenshot */}
              <img
                src="/images/LandingPage1.png"
                alt="PoliTech Politician Dashboard"
                className="lp-mockup-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const reveal = useReveal();
  const stats = [
    { value: '52.2%', label: 'Voter turnout in 2022 midterms — nearly half of eligible voters stayed home' },
    { value: '$150M+', label: 'Spent on Indiana campaigns in 2024 — most without integrated digital tools' },
    { value: '20–30%', label: 'Productivity lost by campaigns using disconnected spreadsheets and email lists' },
  ];
  return (
    <section className="lp-stats">
      <div className="lp-container">
        <div {...reveal} className={reveal.className + ' lp-stats-label'}>
          The Problem We're Solving
        </div>
        <div className="lp-stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="lp-stat-item">
              <span className="lp-stat-value">{s.value}</span>
              <span className="lp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function FeaturesSection() {
  const reveal = useReveal();
  const features = [
    {
      icon: '💰',
      title: 'Donor Management & FEC Compliance',
      desc: 'Track every contribution, enforce legal limits in real time, and generate FEC reports automatically. No compliance surprises.',
    },
    {
      icon: '📅',
      title: 'Event Management',
      desc: 'Create fundraisers, town halls, and canvassing events with RSVPs, ticket sales, and volunteer integration — all in one place.',
    },
    {
      icon: '🤝',
      title: 'Volunteer Coordination',
      desc: 'Schedule shifts, track hours, manage canvassing lists, and keep your ground game organized from signup to election day.',
    },
    {
      icon: '📢',
      title: 'Ad Creative Studio',
      desc: 'AI-powered ad copy for Facebook, Instagram, and Google — with built-in disclaimer tools to keep every ad compliant.',
    },
    {
      icon: '🎤',
      title: 'Speech & Talking Points',
      desc: 'Generate speeches, floor statements, and talking points in seconds using Claude AI, personalized to your voting record.',
    },
    {
      icon: '📈',
      title: 'Analytics & Constituent Insights',
      desc: 'See where your support is, what issues matter most, and how your campaign is trending — with real district data.',
    },
  ];

  return (
    <section className="lp-features" id="features">
      <div className="lp-container">
        <div {...reveal} className={reveal.className + ' lp-section-header'}>
          <span className="lp-eyebrow">Platform Features</span>
          <h2 className="lp-section-title">One platform. Every tool your campaign needs.</h2>
          <p className="lp-section-sub">
            Stop juggling Eventbrite, spreadsheets, ActBlue, and your Gmail. PoliTech replaces all of them.
          </p>
        </div>
        <div className="lp-features-grid">
          {features.map((f, i) => (
            <div key={i} className="lp-feature-card lp-reveal-child" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="lp-feature-icon">{f.icon}</div>
              <h3 className="lp-feature-title">{f.title}</h3>
              <p className="lp-feature-desc">{f.desc}</p>
              <a
                href="https://politician-side-politechllc.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="lp-feature-link"
              >
                → See it live
              </a>
            </div>
          ))}
        </div>
        <div className="lp-features-more">
          <a
            href="https://politician-side-politechllc.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="lp-text-link"
          >
            View all features →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Dashboard Demo ───────────────────────────────────────────────────────────
function DemoSection() {
  const reveal = useReveal();
  const [iframeError, setIframeError] = useState(false);

  const bullets = [
    'Donor CRM with FEC compliance built in',
    'AI speech writer and ad creator',
    'Event management with public RSVP pages',
    'Constituent inbox and email blast tools',
    'Analytics and district reporting',
  ];

  return (
    <section className="lp-demo lp-bg-gray">
      <div className="lp-container lp-demo-inner">
        <div {...reveal} className={reveal.className + ' lp-demo-text'}>
          <span className="lp-eyebrow">Live Demo</span>
          <h2 className="lp-section-title">Explore the dashboard — no account needed</h2>
          <p className="lp-section-sub">
            The PoliTech Politician Dashboard is built for real campaigns. See how donor management,
            event creation, AI tools, and constituent communications work together.
          </p>
          <ul className="lp-check-list">
            {bullets.map((b, i) => (
              <li key={i}><span className="lp-check">✓</span>{b}</li>
            ))}
          </ul>
          <a
            href="https://politician-side-politechllc.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="lp-btn-primary lp-btn-lg lp-demo-cta"
          >
            Open Live Demo →
          </a>
          <p className="lp-demo-note">No login required. Explore freely.</p>
        </div>

        <div className="lp-demo-frame-wrap">
          <div className="lp-browser-chrome">
            <div className="lp-browser-dots">
              <span className="lp-dot lp-dot-red" />
              <span className="lp-dot lp-dot-yellow" />
              <span className="lp-dot lp-dot-green" />
            </div>
            <div className="lp-browser-url">politician-side-politechllc.vercel.app</div>
          </div>
          {iframeError ? (
            <div className="lp-iframe-fallback">
              {/* TODO: Replace with politician dashboard screenshot */}
              <img src="/images/LandingPage1.png" alt="Dashboard Preview" className="lp-fallback-img" />
              <a
                href="https://politician-side-politechllc.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="lp-fallback-btn"
              >
                Launch Demo →
              </a>
            </div>
          ) : (
            <iframe
              src="https://politician-side-politechllc.vercel.app/"
              className="lp-demo-iframe"
              title="PoliTech Politician Dashboard Demo"
              onError={() => setIframeError(true)}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          )}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const reveal = useReveal();
  const steps = [
    {
      icon: '👤',
      num: '01',
      title: 'Create your profile',
      desc: 'Sign up, connect your campaign committee, and build your public PoliTech profile. Your voters can find you from day one.',
    },
    {
      icon: '🚀',
      num: '02',
      title: 'Run your campaign',
      desc: 'Add donors, manage events, coordinate volunteers, and send communications — all from one dashboard. PoliAI helps you draft speeches, ads, and responses.',
    },
    {
      icon: '🛡️',
      num: '03',
      title: 'Govern transparently',
      desc: 'After the election, use PoliTech to track legislation, respond to constituents, log your promises, and build the trust that wins re-election.',
    },
  ];

  return (
    <section className="lp-how">
      <div className="lp-container">
        <div {...reveal} className={reveal.className + ' lp-section-header'}>
          <span className="lp-eyebrow">How It Works</span>
          <h2 className="lp-section-title">Set up in minutes. Campaign with confidence.</h2>
        </div>
        <div className="lp-steps-grid">
          {steps.map((s, i) => (
            <div key={i} className="lp-step">
              <div className="lp-step-num">{s.num}</div>
              <div className="lp-step-icon">{s.icon}</div>
              <h3 className="lp-step-title">{s.title}</h3>
              <p className="lp-step-desc">{s.desc}</p>
              {i < steps.length - 1 && <div className="lp-step-connector" />}
            </div>
          ))}
        </div>
        <div className="lp-how-cta">
          <p className="lp-how-ready">Ready to start?</p>
          <a href="https://politechllc.com/Account/Register" className="lp-btn-primary lp-btn-lg">
            Get your free account →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── PoliAI Spotlight ─────────────────────────────────────────────────────────
function PoliAISection() {
  const reveal = useReveal();
  return (
    <section className="lp-poliai">
      <div className="lp-container lp-poliai-inner">
        <div {...reveal} className={reveal.className + ' lp-poliai-text'}>
          <span className="lp-pill lp-pill-white">Powered by Claude AI</span>
          <h2 className="lp-section-title lp-white">Your AI campaign assistant — available 24/7</h2>
          <p className="lp-section-sub lp-white-muted">
            PoliAI uses Claude to help you draft speeches, explain bills, generate ad copy, answer
            constituent questions, and analyze your campaign data. It knows your voting record, your
            district, and your policy stances — so every output is personalized to you.
          </p>
          <div className="lp-poliai-pills">
            <span className="lp-poliai-pill">📝 Draft speeches in 30 seconds</span>
            <span className="lp-poliai-pill">📊 Analyze your donor data</span>
            <span className="lp-poliai-pill">🗳️ Explain any bill in plain English</span>
          </div>
          <a
            href="https://politician-side-politechllc.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="lp-btn-outline-white lp-btn-lg"
          >
            Try PoliAI →
          </a>
        </div>

        <div className="lp-poliai-chat">
          <div className="lp-chat-card">
            <div className="lp-chat-header">
              <div className="lp-chat-logo">PT</div>
              <div>
                <div className="lp-chat-name">PoliAI</div>
                <div className="lp-chat-status">● Online</div>
              </div>
            </div>
            <div className="lp-chat-body">
              <div className="lp-chat-msg lp-chat-user">
                <span className="lp-chat-bubble lp-bubble-user">
                  Draft talking points on HB1042 for a town hall with parents.
                </span>
              </div>
              <div className="lp-chat-msg lp-chat-ai">
                <div className="lp-chat-avatar">PT</div>
                <div>
                  <span className="lp-chat-bubble lp-bubble-ai">
                    Here are 5 talking points on HB1042 — Education Funding Reform:
                    <ol className="lp-chat-list">
                      <li>This bill increases per-pupil funding by $400 in our district...</li>
                      <li>It prioritizes rural schools that have been underfunded for decades...</li>
                      <li>The fiscal impact is offset by consolidating administrative overhead...</li>
                    </ol>
                    <a
                      href="https://politician-side-politechllc.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lp-chat-more"
                    >
                      See full response →
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Social Proof ─────────────────────────────────────────────────────────────
function TrustSection() {
  const reveal = useReveal();
  const cards = [
    { icon: '🏛️', title: 'State Legislators', desc: 'Track bills, respond to constituents, and build transparency into your time in office.' },
    { icon: '🏘️', title: 'Local Officials', desc: 'City councils, county commissioners, school boards — PoliTech scales to every race size.' },
    { icon: '🗳️', title: 'First-Time Candidates', desc: 'No campaign tech experience needed. Set up in minutes and look like a seasoned campaign.' },
  ];

  return (
    <section className="lp-trust">
      <div className="lp-container">
        <div {...reveal} className={reveal.className + ' lp-section-header'}>
          <h2 className="lp-section-title">Built for Indiana. Ready for every race.</h2>
          <p className="lp-section-sub">
            From state house districts to county commissioners — PoliTech is designed for the races
            that shape your community.
          </p>
        </div>
        <div className="lp-trust-grid">
          {cards.map((c, i) => (
            <div key={i} className="lp-trust-card">
              <div className="lp-trust-icon">{c.icon}</div>
              <h3 className="lp-trust-title">{c.title}</h3>
              <p className="lp-trust-desc">{c.desc}</p>
            </div>
          ))}
        </div>
        <blockquote className="lp-quote">
          <p>
            "PoliTech bridges the gap between policymakers and voters — it's the accountability
            layer our democracy has been missing."
          </p>
          <cite>— Alexander Burton, Indiana State House, District 77</cite>
        </blockquote>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function PricingSection() {
  const reveal = useReveal();
  const [annual, setAnnual] = useState(false);

  const tiers = [
    {
      name: 'Starter',
      badge: 'Get started',
      monthly: 0,
      featured: false,
      cta: 'Start Free',
      ctaClass: 'lp-btn-outline',
      features: [
        { ok: true,  text: 'Politician profile on PoliTech' },
        { ok: true,  text: 'Up to 50 donor records' },
        { ok: true,  text: '40 PoliFeed post credits/year' },
        { ok: true,  text: 'Basic analytics' },
        { ok: true,  text: '5 PoliAI prompts/day' },
        { ok: false, text: 'FEC report generator' },
        { ok: false, text: 'Event management' },
        { ok: false, text: 'Email blasts' },
      ],
    },
    {
      name: 'PoliBase',
      badge: 'Most Popular',
      monthly: 49,
      featured: true,
      cta: 'Get PoliBase',
      ctaClass: 'lp-btn-primary',
      features: [
        { ok: true,  text: 'Everything in Starter' },
        { ok: true,  text: 'Unlimited donor records + FEC reports' },
        { ok: true,  text: 'Event management + public pages' },
        { ok: true,  text: 'Email blast (up to 2,500 contacts)' },
        { ok: true,  text: 'Volunteer management' },
        { ok: true,  text: '20 PoliAI prompts/day' },
        { ok: true,  text: 'Ad creative generator' },
        { ok: true,  text: '100 post credits/year' },
        { ok: false, text: 'Speech writer' },
        { ok: false, text: 'Advanced analytics' },
      ],
    },
    {
      name: 'PoliUnlimited',
      badge: 'Full campaign suite',
      monthly: 99,
      featured: false,
      cta: 'Get PoliUnlimited',
      ctaClass: 'lp-btn-primary',
      features: [
        { ok: true, text: 'Everything in PoliBase' },
        { ok: true, text: 'Unlimited PoliAI prompts' },
        { ok: true, text: 'Speech & talking points generator' },
        { ok: true, text: 'Poll & survey builder' },
        { ok: true, text: 'Advanced district analytics' },
        { ok: true, text: 'Staff access (up to 5 users)' },
        { ok: true, text: 'Priority support' },
        { ok: true, text: 'Unlimited post credits' },
      ],
    },
  ];

  return (
    <section className="lp-pricing lp-bg-gray" id="pricing">
      <div className="lp-container">
        <div {...reveal} className={reveal.className + ' lp-section-header'}>
          <span className="lp-eyebrow">Pricing</span>
          <h2 className="lp-section-title">Simple, transparent pricing for every campaign</h2>
          <p className="lp-section-sub">No contracts. Cancel anytime.</p>

          <div className="lp-billing-toggle">
            <span className={!annual ? 'lp-toggle-active' : ''}>Monthly</span>
            <button
              className={`lp-toggle-switch${annual ? ' on' : ''}`}
              onClick={() => setAnnual(v => !v)}
              aria-label="Toggle annual billing"
            >
              <span className="lp-toggle-thumb" />
            </button>
            <span className={annual ? 'lp-toggle-active' : ''}>
              Annual <span className="lp-toggle-save">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="lp-pricing-grid">
          {tiers.map((t, i) => {
            const price = t.monthly === 0 ? 0 : annual ? Math.round(t.monthly * 0.8) : t.monthly;
            return (
              <div key={i} className={`lp-price-card${t.featured ? ' featured' : ''}`}>
                {t.featured && <div className="lp-popular-badge">Most Popular</div>}
                <div className="lp-price-badge">{t.badge}</div>
                <div className="lp-price-name">{t.name}</div>
                <div className="lp-price-amount">
                  <span className="lp-price-dollar">{t.monthly === 0 ? 'Free' : `$${price}`}</span>
                  {t.monthly > 0 && <span className="lp-price-period">/ month</span>}
                </div>
                {annual && t.monthly > 0 && (
                  <div className="lp-price-annual-note">Billed ${price * 12}/year</div>
                )}
                <ul className="lp-price-features">
                  {t.features.map((f, j) => (
                    <li key={j} className={f.ok ? 'lp-feat-ok' : 'lp-feat-no'}>
                      <span className="lp-feat-icon">{f.ok ? '✓' : '✗'}</span>
                      {f.text}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://politechllc.com/Account/Register"
                  className={`${t.ctaClass} lp-btn-block`}
                >
                  {t.cta}
                </a>
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

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FaqSection() {
  const reveal = useReveal();
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Is PoliTech only for Indiana politicians?',
      a: 'PoliTech is built and optimized for Indiana state and local races, with Indiana-specific legislative data, IGA bill tracking, and Indiana Election Commission compliance. National expansion is on our roadmap.',
    },
    {
      q: 'Does PoliTech handle FEC compliance automatically?',
      a: 'Yes — the Donor Management module enforces contribution limits in real time, flags prohibited sources, and generates Schedule A and Schedule B exports for filing. You should always have a treasurer review reports before submitting.',
    },
    {
      q: 'What are post credits?',
      a: 'Post credits allow politicians to publish posts to PoliFeed and run ad campaigns on the platform. PoliBase includes 100 credits/year. PoliUnlimited includes unlimited credits.',
    },
    {
      q: 'Can my campaign staff access the dashboard?',
      a: 'PoliUnlimited includes up to 5 staff seats with role-based permissions. You control what each staff member can see and edit.',
    },
    {
      q: 'How does PoliAI work?',
      a: 'PoliAI is powered by Claude AI and is trained on your specific voting record, policy stances, and district data. Every speech, talking point, and ad it generates is personalized to you — not generic political boilerplate.',
    },
    {
      q: 'Is there a contract or setup fee?',
      a: 'No contracts, no setup fees. You can start free and upgrade or cancel at any time.',
    },
  ];

  return (
    <section className="lp-faq">
      <div className="lp-container lp-faq-inner">
        <div {...reveal} className={reveal.className + ' lp-section-header'}>
          <h2 className="lp-section-title">Frequently Asked Questions</h2>
        </div>
        <div className="lp-faq-list">
          {faqs.map((f, i) => (
            <div
              key={i}
              className={`lp-faq-item${open === i ? ' open' : ''}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="lp-faq-q">
                <span>{f.q}</span>
                <span className="lp-faq-chevron">{open === i ? '▲' : '▼'}</span>
              </div>
              <div className="lp-faq-a" style={{ maxHeight: open === i ? '300px' : '0' }}>
                <p>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Closing CTA ──────────────────────────────────────────────────────────────
function ClosingCTA() {
  const reveal = useReveal();
  return (
    <section className="lp-closing">
      <div className="lp-container lp-closing-inner">
        <div {...reveal} className={reveal.className}>
          <h2 className="lp-closing-title">Ready to run a smarter campaign?</h2>
          <p className="lp-closing-sub">
            Join Indiana politicians already using PoliTech to engage voters, manage their campaigns,
            and govern with transparency.
          </p>
          <div className="lp-closing-ctas">
            <a href="https://politechllc.com/Account/Register" className="lp-btn-white lp-btn-lg">
              Get Started Free
            </a>
            <a
              href="https://politician-side-politechllc.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-outline-white lp-btn-lg"
            >
              See the Dashboard
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function ContactSection() {
  const reveal = useReveal();
  const [form, setForm] = useState({ name: '', email: '', campaign: '', message: '' });

  return (
    <section className="lp-contact" id="contact">
      <div className="lp-container lp-contact-inner">
        <div {...reveal} className={reveal.className + ' lp-contact-info'}>
          <h2 className="lp-section-title">Get In Touch</h2>
          <p className="lp-section-sub">
            Questions about PoliTech for your campaign? Want a personalized demo? We'd love to hear
            from you.
          </p>
          <div className="lp-contact-details">
            <div className="lp-contact-row">
              <span className="lp-contact-icon">✉️</span>
              <a href="mailto:contact@politech.com">contact@politech.com</a>
            </div>
            <div className="lp-contact-row">
              <span className="lp-contact-icon">📞</span>
              <a href="tel:+15551234567">+1 (555) 123-4567</a>
            </div>
            <div className="lp-contact-row">
              <span className="lp-contact-icon">📍</span>
              <span>Newburgh, Indiana</span>
            </div>
          </div>
        </div>

        <form
          className="lp-contact-form"
          onSubmit={e => { e.preventDefault(); }}
        >
          <div className="lp-form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={e => setForm(v => ({ ...v, name: e.target.value }))}
            />
          </div>
          <div className="lp-form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@campaign.com"
              value={form.email}
              onChange={e => setForm(v => ({ ...v, email: e.target.value }))}
            />
          </div>
          <div className="lp-form-group">
            <label>Campaign / Office</label>
            <input
              type="text"
              placeholder="e.g. State House District 42"
              value={form.campaign}
              onChange={e => setForm(v => ({ ...v, campaign: e.target.value }))}
            />
          </div>
          <div className="lp-form-group">
            <label>Message</label>
            <textarea
              placeholder="Tell us about your campaign..."
              rows={5}
              value={form.message}
              onChange={e => setForm(v => ({ ...v, message: e.target.value }))}
            />
          </div>
          <button type="submit" className="lp-btn-primary lp-btn-lg lp-btn-block">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
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
            <p className="lp-footer-tagline">Empowering democracy through technology</p>
          </div>

          <div className="lp-footer-cols">
            <div className="lp-footer-col">
              <h4>Platform</h4>
              <ul>
                <li><a href="/politicians" className="lp-footer-active">Politicians</a></li>
                <li><a href="https://politechllc.com/bills">Legislation</a></li>
                <li><a href="https://politechllc.com/poliai">PoliAI</a></li>
                <li><a href="https://politechllc.com/polifeed">PoliFeed</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>For Politicians</h4>
              <ul>
                <li><a href="https://politician-side-politechllc.vercel.app/" target="_blank" rel="noopener noreferrer">Dashboard Demo</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="https://politechllc.com/Account/Register">Get Started</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="https://politechllc.com/about">About</a></li>
                <li><a href="https://politechllc.com/faq">FAQ</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="https://politechllc.com/privacy">Privacy Policy</a></li>
                <li><a href="https://politechllc.com/terms">Terms of Service</a></li>
                <li><a href="https://politechllc.com/cookies">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <p>© 2026 PoliTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────
export function PoliticiansLandingPage() {
  return (
    <div className="lp-root">
      <LandingNav />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <DemoSection />
      <HowItWorksSection />
      <PoliAISection />
      <TrustSection />
      <PricingSection />
      <FaqSection />
      <ClosingCTA />
      <ContactSection />
      <LandingFooter />
    </div>
  );
}
