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
  { id: 'dashboard', label: 'Dashboard', icon: '◉' },
  { id: 'message-scanner', label: 'Message Scanner', icon: '✉' },
  { id: 'url-analyzer', label: 'URL Analyzer', icon: '🔗' },
  { id: 'report', label: 'Analysis Report', icon: '📋' },
  { id: 'cybersahayak', label: 'CyberSahayak', icon: '🛡' },
  { id: 'incidents', label: 'Incident Center', icon: '📁' },
  { id: 'learning', label: 'Cyber Safety', icon: '📚' },
];

export function Layout({ current, onNavigate, title, children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (id: PageId) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <div className="app-shell">
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <h1>
            ScamShield <span>360</span>
          </h1>
          <p>Detect. Understand. Respond.</p>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${current === item.id ? 'active' : ''}`}
              onClick={() => go(item.id)}
            >
              <span aria-hidden style={{ width: 20, textAlign: 'center' }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          DU Cyber Satarkata 1.0 demo
          <br />
          Local analysis · No API keys required
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="menu-toggle"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <h2>{title}</h2>
          </div>
          <span className="badge badge-demo">Demo mode</span>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
