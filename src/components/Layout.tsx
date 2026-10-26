import { ReactNode, useState } from 'react';

export type PageId =
  | 'dashboard'
  | 'message-scanner'
  | 'url-analyzer'
  | 'report'
  | 'cybersahayak'
  | 'incidents'
  | 'learning';

interface LayoutProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
  title: string;
  children: ReactNode;
}

const NAV: { id: PageId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Home', icon: '🏠' },
  { id: 'message-scanner', label: 'Message Scanner', icon: '✉' },
  { id: 'url-analyzer', label: 'URL Analyzer', icon: '🔗' },
  { id: 'cybersahayak', label: 'CyberSahayak', icon: '🛡' },
  { id: 'incidents', label: 'Incident Center', icon: '📁' },
  { id: 'learning', label: 'Learning', icon: '📚' },
];

export function Layout({ current, onNavigate, title, children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (id: PageId) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <div className="app-shell">
      <header className="top-nav no-print">
        <button type="button" className="menu-toggle" onClick={() => setMobileOpen(true)} aria-label="Menu">
          ☰
        </button>

        <button type="button" className="nav-brand" onClick={() => go('dashboard')}>
          <span className="nav-brand-icon">🛡</span>
          <span className="nav-brand-text">
            <strong>ScamShield 360</strong>
            <span>Think Safe. Stay Secure.</span>
          </span>
        </button>

        <nav className="nav-links">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-link ${current === item.id ? 'active' : ''}`}
              onClick={() => go(item.id)}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="nav-right">
          <button type="button" className="nav-icon-btn" aria-label="Search" title="Search">
            🔍
          </button>
          <button type="button" className="nav-icon-btn" aria-label="Settings" title="Demo mode">
            ⚙
          </button>
          <div className="nav-user" title="Demo user">
            <span className="nav-avatar">J</span>
            Jatin
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="mobile-nav open no-print">
          <div className="mobile-nav-backdrop" onClick={() => setMobileOpen(false)} />
          <div className="mobile-nav-panel">
            <button type="button" className="nav-brand" onClick={() => go('dashboard')} style={{ marginBottom: '1rem' }}>
              <span className="nav-brand-icon">🛡</span>
              <span className="nav-brand-text">
                <strong>ScamShield 360</strong>
                <span>Think Safe. Stay Secure.</span>
              </span>
            </button>
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nav-link ${current === item.id ? 'active' : ''}`}
                onClick={() => go(item.id)}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="main-content">
        {current !== 'dashboard' && (
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700 }}>{title}</h2>
          </div>
        )}
        {children}
      </main>

      <footer className="app-footer no-print">
        Together for a Safer Digital India · DU Cyber Satarkata 1.0 demo · Local analysis · No API keys required
      </footer>
    </div>
  );
}
