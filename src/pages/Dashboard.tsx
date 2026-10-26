import { useMemo } from 'react';
import { getDashboardStats } from '../services/storageService';
import type { PageId } from '../components/Layout';

interface Props {
  onNavigate: (page: PageId) => void;
}

const FEATURES: {
  id: PageId;
  title: string;
  desc: string;
  icon: string;
  bg: string;
}[] = [
  {
    id: 'message-scanner',
    title: 'Scam Message Scanner',
    desc: 'Detect fraud in SMS, WhatsApp messages, emails and job offers.',
    icon: '📱',
    bg: 'linear-gradient(135deg, #e8f1ff, #d6e6ff)',
  },
  {
    id: 'url-analyzer',
    title: 'URL Analyzer',
    desc: 'Check suspicious links without opening them.',
    icon: '🌐',
    bg: 'linear-gradient(135deg, #e7fbf7, #d0f5ee)',
  },
  {
    id: 'cybersahayak',
    title: 'CyberSahayak',
    desc: "Get step-by-step guidance if you've been scammed.",
    icon: '🤖',
    bg: 'linear-gradient(135deg, #f4f1ff, #ebe4ff)',
  },
  {
    id: 'incidents',
    title: 'Incident Center',
    desc: 'Store evidence, get a checklist and report the incident.',
    icon: '📂',
    bg: 'linear-gradient(135deg, #fff6e9, #ffefd6)',
  },
  {
    id: 'learning',
    title: 'Cyber Safety Quiz',
    desc: 'Learn, test and improve your cyber awareness.',
    icon: '💬',
    bg: 'linear-gradient(135deg, #fef3f2, #fde8e6)',
  },
];

const DEMO_ALERTS = [
  {
    title: 'Fake Bank OTP Message',
    preview: '"Your account will be blocked. Share OTP to verify…"',
    time: '2 hours ago',
    risk: 'High' as const,
    icon: '✉',
    iconBg: '#fef3f2',
  },
  {
    title: 'Suspicious Job Offer',
    preview: '"Work from home, Earn Rs.50,000/month. Apply now…"',
    time: '4 hours ago',
    risk: 'Medium' as const,
    icon: '💼',
    iconBg: '#fff6e9',
  },
  {
    title: 'Phishing WhatsApp Message',
    preview: '"Click this link to claim your reward: bit.ly/xyz…"',
    time: '6 hours ago',
    risk: 'High' as const,
    icon: '💬',
    iconBg: '#e7fbf7',
  },
  {
    title: 'Fake E-commerce Email',
    preview: '"Your order is on hold. Update your payment details…"',
    time: '8 hours ago',
    risk: 'Medium' as const,
    icon: '📧',
    iconBg: '#f4f1ff',
  },
];

const QUICK: { id: PageId; title: string; desc: string; icon: string; color: string }[] = [
  { id: 'message-scanner', title: 'Scan a Message', desc: 'Check for scam indicators', icon: '💬', color: '#12b76a' },
  { id: 'url-analyzer', title: 'Check a URL', desc: 'Validate suspicious links', icon: '🔗', color: '#1a6dff' },
  { id: 'cybersahayak', title: 'Get Help (CyberSahayak)', desc: 'Emergency guidance & next steps', icon: '🛡', color: '#7a5af8' },
  { id: 'incidents', title: 'View Incident Center', desc: 'Track and manage your cases', icon: '📄', color: '#f79009' },
];

export function Dashboard({ onNavigate }: Props) {
  const stats = useMemo(() => getDashboardStats(), []);

  return (
    <div>
      <section className="hero">
        <div>
          <div className="hero-badge">🛡 Your Digital Safety Partner</div>
          <h1>
            Stay One Step Ahead
            <br />
            of <span className="highlight">Cyber Frauds.</span>
          </h1>
          <p>
            ScamShield 360 helps you detect scams, verify links, get instant
            safety guidance and stay protected in the digital world.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn-hero-primary" onClick={() => onNavigate('message-scanner')}>
              🛡 Start Scanning →
            </button>
            <button type="button" className="btn-hero-secondary" onClick={() => onNavigate('learning')}>
              📚 Learn Cyber Safety
            </button>
          </div>
        </div>
        <div className="hero-visual" aria-hidden>
          <span className="hero-tagline">
            Be Alert
            <br />
            Be Safe
          </span>
          <div className="hero-orb">
            <span className="hero-shield">🔒</span>
          </div>
          <span className="hero-float a">💬</span>
          <span className="hero-float b">⚠</span>
          <span className="hero-float c">🔗</span>
          <span className="hero-float d">💻</span>
        </div>
      </section>

      <div className="feature-grid">
        {FEATURES.map((f) => (
          <button key={f.id} type="button" className="feature-card" onClick={() => onNavigate(f.id)}>
            <span className="feature-icon" style={{ background: f.bg }}>
              {f.icon}
            </span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <span className="arrow">→</span>
          </button>
        ))}
      </div>

      <div className="home-grid">
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <span style={{ color: 'var(--danger)' }}>⚠</span> Recent Scams & Alerts
            </h3>
            <button type="button" className="panel-link" onClick={() => onNavigate('message-scanner')}>
              View All →
            </button>
          </div>
          {stats.recentScans.length > 0
            ? stats.recentScans.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  className="alert-row"
                  onClick={() => onNavigate(s.type === 'message' ? 'message-scanner' : 'url-analyzer')}
                >
                  <span className="alert-icon" style={{ background: '#eef4fb' }}>
                    {s.type === 'message' ? '✉' : '🔗'}
                  </span>
                  <div className="alert-body">
                    <strong>{s.type === 'message' ? 'Message scan' : 'URL scan'}</strong>
                    <span>{s.preview}</span>
                  </div>
                  <div className="alert-meta">
                    <span className="alert-time">{new Date(s.timestamp).toLocaleString()}</span>
                    <span className={`badge badge-${s.riskLevel.toLowerCase()}`}>{s.riskLevel} Risk</span>
                  </div>
                </div>
              ))
            : DEMO_ALERTS.map((a) => (
                <div key={a.title} className="alert-row" onClick={() => onNavigate('message-scanner')}>
                  <span className="alert-icon" style={{ background: a.iconBg }}>
                    {a.icon}
                  </span>
                  <div className="alert-body">
                    <strong>{a.title}</strong>
                    <span>{a.preview}</span>
                  </div>
                  <div className="alert-meta">
                    <span className="alert-time">{a.time}</span>
                    <span className={`badge badge-${a.risk.toLowerCase()}`}>{a.risk} Risk</span>
                  </div>
                </div>
              ))}
          {stats.recentScans.length === 0 && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '0.5rem 0 0' }}>
              Demo examples shown until you run your own scans. Local analysis only — not live threat data.
            </p>
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <span style={{ color: 'var(--primary)' }}>🛡</span> Quick Actions
            </h3>
          </div>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Choose what you want to check now.
          </p>
          <div className="quick-list">
            {QUICK.map((q) => (
              <button key={q.id} type="button" className="quick-item" onClick={() => onNavigate(q.id)}>
                <span className="quick-icon" style={{ background: q.color }}>
                  {q.icon}
                </span>
                <span>
                  <strong>{q.title}</strong>
                  <span>{q.desc}</span>
                </span>
                <span className="quick-chevron">›</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="trust-strip">
        <div className="trust-item">
          <span className="ti">🛡</span>
          <div>
            <strong>Report Scams</strong>
            <span>Help others stay safe</span>
          </div>
        </div>
        <div className="trust-item">
          <span className="ti">🔒</span>
          <div>
            <strong>Protect Your Identity</strong>
            <span>Keep your personal data secure</span>
          </div>
        </div>
        <div className="trust-item">
          <span className="ti">💡</span>
          <div>
            <strong>Think Before You Click</strong>
            <span>Avoid phishing & fake links</span>
          </div>
        </div>
        <div className="trust-item">
          <span className="ti">🇮🇳</span>
          <div>
            <strong>Digital India, Safer India</strong>
            <span>Together for a safer digital world</span>
          </div>
        </div>
      </div>
    </div>
  );
}
