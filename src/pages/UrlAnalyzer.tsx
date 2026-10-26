import { useState } from 'react';
import { analyseUrl, DEMO_URLS } from '../services/urlAnalyzer';
import { getThreatIntelProvider } from '../services/threatIntelProvider';
import { saveAnalysisResult } from '../services/storageService';
import type { AnalysisResult } from '../types';
import type { PageId } from '../components/Layout';

interface Props {
  onNavigate: (page: PageId) => void;
  onResult: (result: AnalysisResult) => void;
}

export function UrlAnalyzer({ onNavigate, onResult }: Props) {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const intel = getThreatIntelProvider();

  const run = () => {
    setError('');
    if (!url.trim()) {
      setError('Please enter a URL to analyse.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = analyseUrl(url);
      setResult(res);
      saveAnalysisResult(res);
      onResult(res);
      setLoading(false);
    }, 280);
  };

  return (
    <div>
      <div className="alert alert-info">
        Structural checks only. This tool <strong>never opens</strong> the URL you submit. Absence of
        local indicators does <strong>not</strong> mean the URL is safe. Live threat-intelligence is
        not configured in this demo.
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="url-input">
            URL to analyse
          </label>
          <input
            id="url-input"
            className="form-input"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/path or paste a suspicious link"
            autoComplete="off"
            spellCheck={false}
          />
          <p className="form-hint">{intel.statusMessage()}</p>
        </div>

        {error && (
          <div className="alert alert-warn" role="alert">
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          <button type="button" className="btn btn-primary" onClick={run} disabled={loading}>
            {loading ? 'Analysing…' : 'Analyse URL'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setUrl(DEMO_URLS.suspicious)}>
            Demo: suspicious domain
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setUrl(DEMO_URLS.lookalike)}>
            Demo: lookalike
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setUrl(DEMO_URLS.ipBased)}>
            Demo: IP host
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setUrl(DEMO_URLS.cleanLooking)}>
            Demo: clean-looking
          </button>
        </div>
      </div>

      {result && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">URL analysis</h3>
            <span className={`badge badge-${result.riskLevel.toLowerCase()}`}>{result.riskLevel}</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
            <strong style={{ color: 'var(--text)' }}>Submitted:</strong> {result.input}
          </p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', margin: '0.75rem 0 0.35rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700 }}>{result.riskScore}</span>
            <span style={{ color: 'var(--text-muted)' }}>/ 100 structural risk score</span>
          </div>
          <div className="risk-meter">
            <div
              className={`risk-meter-fill ${result.riskLevel.toLowerCase()}`}
              style={{ width: `${result.riskScore}%` }}
            />
          </div>

          <p style={{ marginTop: '1rem' }}>{result.summary}</p>

          {result.indicators.length > 0 ? (
            <>
              <h4 style={{ fontSize: '0.9rem', margin: '1.25rem 0 0.5rem' }}>Structural indicators</h4>
              <ul className="indicator-list">
                {result.indicators.map((ind) => (
                  <li key={ind.id}>
                    <div className="indicator-label">
                      {ind.label}{' '}
                      <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>
                        · {ind.category} · weight {ind.weight}
                      </span>
                    </div>
                    <div className="indicator-desc">{ind.description}</div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No strong structural indicators. This is not a safety confirmation.
            </p>
          )}

          <h4 style={{ fontSize: '0.9rem', margin: '1.25rem 0 0.5rem' }}>Recommended action</h4>
          <ol style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {result.recommendedActions.map((a, i) => (
              <li key={i} style={{ marginBottom: '0.35rem' }}>
                {a}
              </li>
            ))}
          </ol>

          <div className="disclaimer">{result.disclaimer}</div>

          <div style={{ marginTop: '1rem' }} className="no-print">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onResult(result);
                onNavigate('report');
              }}
            >
              View full report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
