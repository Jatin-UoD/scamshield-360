import { useEffect, useState } from 'react';
import {
  getIncidents,
  saveIncident,
  deleteIncident,
} from '../services/storageService';
import type { Incident, IncidentStatus, IncidentType } from '../types';

const TYPE_LABELS: Record<IncidentType, string> = {
  suspicious_message: 'Suspicious message',
  clicked_link: 'Clicked suspicious link',
  shared_otp: 'Shared OTP / password',
  shared_banking: 'Shared banking information',
  unauthorized_transfer: 'Unauthorised transfer',
  account_compromise: 'Account compromise',
  other: 'Other',
};

const STATUS_LABELS: Record<IncidentStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const CHECKLIST = [
  'Screenshot / save the original message or transaction SMS',
  'Note date, time and channel (SMS / WhatsApp / email / call)',
  'Do not delete evidence until the case is documented',
  'Contact bank / service using official numbers only',
  'File complaint on cybercrime.gov.in and keep acknowledgement number',
  'Call 1930 for financial fraud if money is involved',
];

function newId() {
  return `inc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function IncidentCenter() {
  const [list, setList] = useState<Incident[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Incident | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<IncidentType>('suspicious_message');
  const [status, setStatus] = useState<IncidentStatus>('open');
  const [notes, setNotes] = useState('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const refresh = () => setList(getIncidents());

  useEffect(() => {
    refresh();
  }, []);

  const resetForm = () => {
    setTitle('');
    setType('suspicious_message');
    setStatus('open');
    setNotes('');
    setCompletedSteps([]);
    setEditing(null);
    setShowForm(false);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (inc: Incident) => {
    setEditing(inc);
    setTitle(inc.title);
    setType(inc.type);
    setStatus(inc.status);
    setNotes(inc.notes);
    setCompletedSteps(inc.completedSteps);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const now = new Date().toISOString();
    if (editing) {
      const updated: Incident = {
        ...editing,
        title: title.trim(),
        type,
        status,
        notes: notes.trim(),
        completedSteps,
        updatedAt: now,
        timeline: [
          ...editing.timeline,
          { at: now, event: `Updated - status: ${STATUS_LABELS[status]}` },
        ],
      };
      saveIncident(updated);
    } else {
      const created: Incident = {
        id: newId(),
        title: title.trim(),
        type,
        status,
        notes: notes.trim(),
        createdAt: now,
        updatedAt: now,
        completedSteps,
        timeline: [{ at: now, event: 'Incident created' }],
      };
      saveIncident(created);
    }
    refresh();
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this incident from local storage on this device?')) {
      deleteIncident(id);
      refresh();
      if (editing?.id === id) resetForm();
    }
  };

  const toggleStep = (step: string) => {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
    );
  };

  return (
    <div>
      <div className="alert alert-warn">
        Data is stored only in this browser localStorage. It is device-specific, not encrypted
        cloud storage, and is not a substitute for official case records. Never store real OTP,
        PIN, password or full card numbers here.
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Incident history</h3>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          Create incident
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>
            {editing ? 'Update incident' : 'New incident'}
          </h3>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short non-sensitive description" />
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value as IncidentType)}>
                {(Object.keys(TYPE_LABELS) as IncidentType[]).map((k) => (
                  <option key={k} value={k}>
                    {TYPE_LABELS[k]}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value as IncidentStatus)}>
                {(Object.keys(STATUS_LABELS) as IncidentStatus[]).map((k) => (
                  <option key={k} value={k}>
                    {STATUS_LABELS[k]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes (non-sensitive only)</label>
            <textarea
              className="form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Actions taken, acknowledgement numbers, bank reference. Do not paste OTPs or passwords."
              rows={4}
            />
          </div>

          <h4 style={{ fontSize: '0.85rem', margin: '0 0 0.5rem' }}>Evidence-preservation checklist</h4>
          <div style={{ marginBottom: '1rem' }}>
            {CHECKLIST.map((step) => (
              <label
                key={step}
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'flex-start',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.4rem',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={completedSteps.includes(step)}
                  onChange={() => toggleStep(step)}
                  style={{ marginTop: 3 }}
                />
                <span>{step}</span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
            {editing && (
              <button type="button" className="btn btn-danger" onClick={() => handleDelete(editing.id)}>
                Delete from this device
              </button>
            )}
          </div>
        </div>
      )}

      {list.length === 0 && !showForm ? (
        <div className="card empty-state">
          <h3>No incidents yet</h3>
          <p>Create a local record to track steps you have taken. Data stays only in this browser.</p>
        </div>
      ) : (
        <div className="grid" style={{ gap: '0.75rem' }}>
          {list.map((inc) => (
            <div key={inc.id} className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">{inc.title}</h3>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {TYPE_LABELS[inc.type]} · Updated {new Date(inc.updatedAt).toLocaleString()}
                  </p>
                </div>
                <span className="badge badge-demo">{STATUS_LABELS[inc.status]}</span>
              </div>
              {inc.notes && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 0 }}>{inc.notes}</p>
              )}
              {inc.completedSteps.length > 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
                  Checklist: {inc.completedSteps.length} / {CHECKLIST.length} done
                </p>
              )}
              <details style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                <summary style={{ cursor: 'pointer' }}>Timeline</summary>
                <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.1rem' }}>
                  {inc.timeline.map((t, i) => (
                    <li key={i}>
                      {new Date(t.at).toLocaleString()} - {t.event}
                    </li>
                  ))}
                </ul>
              </details>
              <div style={{ marginTop: '0.75rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEdit(inc)}>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
