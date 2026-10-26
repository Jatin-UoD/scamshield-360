import type { AnalysisResult } from '../types';
import type { PageId } from '../components/Layout';

interface Props {
  result: AnalysisResult | null;
  onNavigate: (page: PageId) => void;
}

export function Report({ result, onNavigate }: Props) {
  if (!result) {
    return (
      <div className="card empty-state">
        <h3>No report available</h3>
        <p>Run a message or URL analysis first, then open the report from the result screen.</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary" onClick={() => onNavigate('message-scanner')}>
            Message Scanner
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate('url-analyzer')}>
            URL Analyzer
          </button>
        </div>
      </div>
    );
  }

  const printReport = () => window.print();

  return (
    <div>
      <div className="card" id="report-print-area">
        <div className="card-header">
          <div>
            <h3 className="card-title">ScamShield 360 — Analysis Report</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Generated {new Date(result.timestamp).toLocaleString()} · ID {result.id}
            </p>
          </div>
          <span className={`badge badge-${result.riskLevel.toLowerCase()}`}>{result.riskLevel}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div className="stat-label">Risk score</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{result.riskScore} / 100</div>
            <div className="risk-meter" style={{ marginTop: 8 }}>
              <div
                className={`risk-meter-fill ${result.riskLevel.toLowerCase()}`}
                style={{ width: `${result.riskScore}%` }}
              />
            </div>
          </div>
          <div>
            <div className="stat-label">Scan type</div>
            <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{result.type}</div>
            <div className="stat-label" style={{ marginTop: 12 }}>
              Input preview
            </div>
            <div style={{ fontSize: '0.85rem', wordBreak: 'break-word', color: 'var(--text-muted)' }}>
              {result.input.slice(0, 160)}
              {result.input.length > 160 ? '…' : ''}
            </div>
          </div>
        </div>

        <h4 style={{ fontSize: '0.95rem', margin: '0 0 0.5rem' }}>Summary</h4>
        <p style={{ marginTop: 0 }}>{result.summary}</p>

        <h4 style={{ fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>Detected warning indicators</h4>
        {result.indicators.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>None matched by local rules.</p>
        ) : (
          <ul className="indicator-list">
            {result.indicators.map((ind) => (
              <li key={ind.id}>
                <div className="indicator-label">
                  {ind.label}{' '}
                  <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>
                    ({ind.category}, weight {ind.weight})
                  </span>
                </div>
                <div className="indicator-desc">{ind.description}</div>
              </li>
            ))}
          </ul>
        )}

        <h4 style={{ fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>Reasons / scoring notes</h4>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {result.explanations.map((e, i) => (
            <li key={i} style={{ marginBottom: '0.3rem' }}>
              {e}
            </li>
          ))}
        </ul>

        <h4 style={{ fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>Suggested actions</h4>
        <ol style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {result.recommendedActions.map((a, i) => (
            <li key={i} style={{ marginBottom: '0.3rem' }}>
              {a}
            </li>
          ))}
        </ol>

        <div className="disclaimer">{result.disclaimer}</div>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} className="no-print">
        <button type="button" className="btn btn-primary" onClick={printReport}>
          Print / save as PDF
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => onNavigate('cybersahayak')}>
          CyberSahayak guidance
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => onNavigate('dashboard')}>
          Back to dashboard
        </button>
      </div>
    </div>
  );
}
