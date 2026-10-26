import { useState } from 'react';
import { SITUATIONS } from '../services/responseLibrary';
import type { CyberSahayakSituation } from '../types';

const priorityLabel = {
  immediate: 'Do now',
  soon: 'Soon',
  followup: 'Follow-up',
};

const priorityColor = {
  immediate: 'var(--danger)',
  soon: 'var(--warning)',
  followup: 'var(--accent)',
};

export function CyberSahayak() {
  const [selected, setSelected] = useState<CyberSahayakSituation | null>(null);

  return (
    <div>
      <div className="alert alert-info">
        CyberSahayak provides curated, practical steps for common cyber-fraud situations in the
        Indian context. It does not ask for OTP, PIN, password or full banking credentials. Guidance
        is a local response library — not a live AI conversation.
      </div>

      {!selected ? (
        <div className="grid grid-2">
          {SITUATIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="card"
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                color: 'inherit',
              }}
              onClick={() => setSelected(s)}
            >
              <h3 className="card-title" style={{ marginBottom: '0.4rem' }}>
                {s.title}
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {s.description}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="card">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelected(null)} style={{ marginBottom: '0.75rem' }}>
            ← All situations
          </button>
          <h3 style={{ margin: '0 0 0.35rem' }}>{selected.title}</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: 0 }}>{selected.description}</p>

          <h4 style={{ fontSize: '0.9rem', margin: '1.25rem 0 0.75rem' }}>Prioritised steps</h4>
          <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
            {selected.steps.map((step, idx) => (
              <li
                key={idx}
                style={{
                  padding: '0.85rem 0',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '0.75rem',
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--bg-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: priorityColor[step.priority],
                  }}
                >
                  {idx + 1}
                </span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{step.title}</strong>
                    <span
                      className="badge"
                      style={{
                        background: 'transparent',
                        border: `1px solid ${priorityColor[step.priority]}`,
                        color: priorityColor[step.priority],
                      }}
                    >
                      {priorityLabel[step.priority]}
                    </span>
                  </div>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <h4 style={{ fontSize: '0.9rem', margin: '1.5rem 0 0.5rem' }}>Helplines & official channels</h4>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {selected.helplines.map((h, i) => (
              <li key={i} style={{ marginBottom: '0.35rem' }}>
                <strong style={{ color: 'var(--text)' }}>{h.name}:</strong>{' '}
                {h.value.startsWith('http') ? (
                  <a href={h.value} target="_blank" rel="noopener noreferrer">
                    {h.value}
                  </a>
                ) : (
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{h.value}</span>
                )}
              </li>
            ))}
          </ul>

          <div className="disclaimer">
            This guidance is educational and based on publicly recommended practices. It is not a
            substitute for official advice from your bank or law enforcement. Never share real OTP,
            PIN, password or complete card details with anyone — including this application.
          </div>
        </div>
      )}
    </div>
  );
}
