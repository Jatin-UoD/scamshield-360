/** Shared TypeScript models for ScamShield 360 */

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface DetectedIndicator {
  id: string;
  label: string;
  description: string;
  weight: number;
  category: string;
}

export interface AnalysisResult {
  id: string;
  type: 'message' | 'url';
  input: string;
  riskScore: number;
  riskLevel: RiskLevel;
  indicators: DetectedIndicator[];
  summary: string;
  explanations: string[];
  recommendedActions: string[];
  timestamp: string;
  disclaimer: string;
}

export type IncidentType =
  | 'suspicious_message'
  | 'clicked_link'
  | 'shared_otp'
  | 'shared_banking'
  | 'unauthorized_transfer'
  | 'account_compromise'
  | 'other';

export type IncidentStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Incident {
  id: string;
  title: string;
  type: IncidentType;
  status: IncidentStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
  completedSteps: string[];
  timeline: { at: string; event: string }[];
}

export interface ScanHistoryItem {
  id: string;
  type: 'message' | 'url';
  preview: string;
  riskScore: number;
  riskLevel: RiskLevel;
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CyberSahayakSituation {
  id: string;
  title: string;
  description: string;
  steps: { title: string; detail: string; priority: 'immediate' | 'soon' | 'followup' }[];
  helplines: { name: string; value: string }[];
}

export interface DashboardStats {
  totalScans: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  recentScans: ScanHistoryItem[];
  categoryCounts: Record<string, number>;
}
