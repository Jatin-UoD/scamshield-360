import { useState } from 'react';
import { analyseMessage, DEMO_MESSAGES } from '../services/messageAnalyzer';
import { saveAnalysisResult } from '../services/storageService';
import type { AnalysisResult } from '../types';
import type { PageId } from '../components/Layout';

interface Props {
  onNavigate: (page: PageId) => void;
  onResult: (result: AnalysisResult) => void;
}

export function MessageScanner({ onNavigate, onResult }: Props) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const run = () => {
    setError('');
    if (!text.trim()) {
      setError('Please paste a message to analyse.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = analyseMessage(text);
      setResult(res);
      saveAnalysisResult(res);
      onResult(res);
      setLoading(false);
    }, 280);
  };

  const loadDemo = (key: keyof typeof DEMO_MESSAGES) => {
    setText(DEMO_MESSAGES[key]);
    setResult(null);
    setError('');
  };

  return (
    <div>
      <div className="alert alert-info">
        Local rule-based detection only. Keyword and pattern matching is transparent and
        explainable — it is <strong>not</strong> advanced AI. Results are estimates.
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="msg-input">
            Suspicious message (SMS, email, WhatsApp, job / scholarship offer, payment request…)
          </label>
          <textarea
            id="msg-input"
            className="form-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the full message here…"
            rows={8}
          />
          <p className="form-hint">
            Never paste real OTPs, passwords or full card numbers into any tool.
          </p>
        </div>

        {error && (
          <div className="alert alert-warn" role="alert">
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <button type="button" className="btn btn-primary" onClick={run} disabled={loading}>
            {loading ? 'Analysing…' : 'Analyse Message'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => loadDemo('scholarshipScam')}>
            Load demo: Scholarship scam
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => loadDemo('otpScam')}>
            Load demo: OTP / KYC scam
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => loadDemo('harmless')}>
            Load demo: Harmless message
          </button>
        </div>
      </div>

      {result && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Analysis result</h3>
            <span className={`badge badge-${result.riskLevel.toLowerCase()}`}>{result.riskLevel}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700 }}>{result.riskScore}</span>
            <span style={{ color: 'var(--text-muted)' }}>/ 100 risk score</span>
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
              <h4 style={{ fontSize: '0.9rem', margin: '1.25rem 0 0.5rem' }}>Detected indicators</h4>
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
              No rule matched. This does not guarantee the message is safe.
            </p>
          )}

          <h4 style={{ fontSize: '0.9rem', margin: '1.25rem 0 0.5rem' }}>Recommended next steps</h4>
          <ol style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {result.recommendedActions.map((a, i) => (
              <li key={i} style={{ marginBottom: '0.35rem' }}>
                {a}
              </li>
            ))}
          </ol>

          <div className="disclaimer">{result.disclaimer}</div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} className="no-print">
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
            <button type="button" className="btn btn-ghost" onClick={() => onNavigate('cybersahayak')}>
              Open CyberSahayak
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
