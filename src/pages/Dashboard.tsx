import { useMemo } from 'react';
import { getDashboardStats } from '../services/storageService';
import { TIP_OF_THE_DAY } from '../data/learning';
import type { PageId } from '../components/Layout';

interface Props {
  onNavigate: (page: PageId) => void;
}

export function Dashboard({ onNavigate }: Props) {
  const stats = useMemo(() => getDashboardStats(), []);
  const tipIndex = new Date().getDate() % TIP_OF_THE_DAY.length;
  const tip = TIP_OF_THE_DAY[tipIndex];

  const maxCat = Math.max(1, ...Object.values(stats.categoryCounts));

  return (
    <div>
      <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
        <strong>ScamShield 360</strong> — university cybersecurity exhibition prototype for DU Cyber
        Satarkata 1.0. All detection is <em>local rule-based</em>. No external AI or threat database
        is consulted. Results are estimates, not confirmed scam verdicts.
      </div>

      <div className="grid grid-4" style={{ marginBottom: '1.25rem' }}>
        <div className="stat-card">
          <div className="stat-label">Total scans</div>
          <div className="stat-value accent">{stats.totalScans}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">High risk</div>
          <div className="stat-value high">{stats.highRiskCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Medium risk</div>
          <div className="stat-value medium">{stats.mediumRiskCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Low risk</div>
          <div className="stat-value low">{stats.lowRiskCount}</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: '1.25rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent scans</h3>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onNavigate('message-scanner')}>
              New scan
            </button>
          </div>
          {stats.recentScans.length === 0 ? (
            <div className="empty-state">
              <h3>No scans yet</h3>
              <p>Run a message or URL analysis to see results here.</p>
              <button type="button" className="btn btn-primary" onClick={() => onNavigate('message-scanner')}>
                Open Message Scanner
              </button>
            </div>
          ) : (
            <div>
              {stats.recentScans.map((s) => (
                <div key={s.id} className="data-row">
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {s.type === 'message' ? '✉' : '🔗'} {s.preview}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {new Date(s.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <span className={`badge badge-${s.riskLevel.toLowerCase()}`}>{s.riskLevel}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Scan categories</h3>
          </div>
          {stats.totalScans === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Category breakdown appears after you perform scans. Demo data is not pre-loaded so
              statistics reflect your actual session activity.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {Object.entries(stats.categoryCounts).map(([name, count]) => (
                <div key={name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span>{name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count}</span>
                  </div>
                  <div className="risk-meter">
                    <div
                      className="risk-meter-fill low"
                      style={{ width: `${(count / maxCat) * 100}%`, background: 'var(--accent)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '1.5rem' }}>
            <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>
              Tip of the day
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{tip}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '0.75rem' }}>
          Quick actions
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          <button type="button" className="btn btn-primary" onClick={() => onNavigate('message-scanner')}>
            Analyse a message
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate('url-analyzer')}>
            Check a URL
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate('cybersahayak')}>
            Get response guidance
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate('learning')}>
            Take safety quiz
          </button>
        </div>
      </div>
    </div>
  );
}
