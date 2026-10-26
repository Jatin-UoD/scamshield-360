/**
 * Local storage service for scan history and incidents.
 * Uses browser localStorage only — device/browser specific, NOT a secure cloud database.
 * Never stores OTPs, passwords, PINs or full card numbers.
 */

import type { AnalysisResult, Incident, ScanHistoryItem, DashboardStats } from '../types';

const SCAN_KEY = 'scamshield360_scans';
const INCIDENT_KEY = 'scamshield360_incidents';
const MAX_SCANS = 50;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getScanHistory(): ScanHistoryItem[] {
  return safeParse<ScanHistoryItem[]>(localStorage.getItem(SCAN_KEY), []);
}

export function saveAnalysisResult(result: AnalysisResult): void {
  const history = getScanHistory();
  const item: ScanHistoryItem = {
    id: result.id,
    type: result.type,
    preview: result.input.slice(0, 80) + (result.input.length > 80 ? '…' : ''),
    riskScore: result.riskScore,
    riskLevel: result.riskLevel,
    timestamp: result.timestamp,
  };
  const updated = [item, ...history.filter((h) => h.id !== item.id)].slice(0, MAX_SCANS);
  localStorage.setItem(SCAN_KEY, JSON.stringify(updated));
  localStorage.setItem(`scamshield360_result_${result.id}`, JSON.stringify(result));
}

export function getAnalysisResult(id: string): AnalysisResult | null {
  return safeParse<AnalysisResult | null>(
    localStorage.getItem(`scamshield360_result_${id}`),
    null
  );
}

export function getIncidents(): Incident[] {
  return safeParse<Incident[]>(localStorage.getItem(INCIDENT_KEY), []);
}

export function saveIncident(incident: Incident): void {
  const list = getIncidents();
  const idx = list.findIndex((i) => i.id === incident.id);
  if (idx >= 0) list[idx] = incident;
  else list.unshift(incident);
  localStorage.setItem(INCIDENT_KEY, JSON.stringify(list));
}

export function deleteIncident(id: string): void {
  const list = getIncidents().filter((i) => i.id !== id);
  localStorage.setItem(INCIDENT_KEY, JSON.stringify(list));
}

export function clearAllLocalData(): void {
  localStorage.removeItem(SCAN_KEY);
  localStorage.removeItem(INCIDENT_KEY);
  Object.keys(localStorage)
    .filter((k) => k.startsWith('scamshield360_result_'))
    .forEach((k) => localStorage.removeItem(k));
}

export function getDashboardStats(): DashboardStats {
  const scans = getScanHistory();
  const high = scans.filter((s) => s.riskLevel === 'High').length;
  const medium = scans.filter((s) => s.riskLevel === 'Medium').length;
  const low = scans.filter((s) => s.riskLevel === 'Low').length;

  const categoryCounts: Record<string, number> = {
    Message: scans.filter((s) => s.type === 'message').length,
    URL: scans.filter((s) => s.type === 'url').length,
  };

  return {
    totalScans: scans.length,
    highRiskCount: high,
    mediumRiskCount: medium,
    lowRiskCount: low,
    recentScans: scans.slice(0, 8),
    categoryCounts,
  };
}
