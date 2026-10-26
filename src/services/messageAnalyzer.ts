/**
 * Local rule-based message analyzer.
 * Transparent, deterministic scoring - NOT claimed as advanced AI.
 * Future: can be swapped / augmented via aiProvider interface.
 */

import type { AnalysisResult, DetectedIndicator, RiskLevel } from '../types';

interface Rule {
  id: string;
  label: string;
  category: string;
  weight: number;
  pattern: RegExp;
  description: string;
}

const RULES: Rule[] = [
  {
    id: 'urgency',
    label: 'Urgency / pressure tactics',
    category: 'Social Engineering',
    weight: 18,
    pattern: /\b(urgent|immediately|act now|within\s+\d+\s*(hours?|mins?|minutes?)|last chance|account\s+(will be|is)\s+(blocked|suspended|closed)|limited time|hurry|asap)\b/i,
    description: 'Message creates artificial time pressure to force rushed decisions.',
  },
  {
    id: 'reward',
    label: 'Unrealistic reward / prize / earnings',
    category: 'Financial Lure',
    weight: 20,
    pattern: /\b(won|winner|prize|lottery|jackpot|guaranteed\s+(income|earnings|profit|money)|earn\s+(Rs.|rs\.?|inr)?\s*\d+|work from home.*(Rs.|rs|lakh|crore)|scholarship.*(selected|awarded|congrats))\b/i,
    description: 'Promises of easy money, prizes or guaranteed earnings are classic scam lures.',
  },
  {
    id: 'credentials',
    label: 'Requests OTP / PIN / password / credentials',
    category: 'Credential Theft',
    weight: 25,
    pattern: /\b(otp|one[- ]time\s+password|pin|password|cvv|card\s+number|account\s+number|share\s+(your|the)\s+(otp|pin|password)|send\s+(otp|pin)|verify\s+(otp|account))\b/i,
    description: 'Legitimate organisations never ask for OTP, PIN or full passwords via message.',
  },
  {
    id: 'payment',
    label: 'Suspicious payment request',
    category: 'Financial Fraud',
    weight: 22,
    pattern: /\b(pay\s+(now|immediately|fee|processing)|send\s+money|transfer\s+(Rs.|rs\.?|inr|amount)|upi|gpay|phonepe|paytm.*(send|pay)|deposit\s+(fee|amount)|registration\s+fee)\b/i,
    description: 'Requests for advance fees, processing charges or unexpected transfers are red flags.',
  },
  {
    id: 'impersonation',
    label: 'Impersonation of authority / organisation',
    category: 'Impersonation',
    weight: 18,
    pattern: /\b(bank\s+(official|manager|security)|rbi|income\s+tax|police|cyber\s+cell|customs|amazon|flipkart|google|microsoft|whatsapp\s+support|kyc\s+(update|pending|expired))\b/i,
    description: 'Scammers frequently impersonate banks, government agencies or popular brands.',
  },
  {
    id: 'link',
    label: 'Suspicious link present',
    category: 'Phishing',
    weight: 15,
    pattern: /https?:\/\/[^\s]+|bit\.ly|tinyurl|t\.co|goo\.gl|rebrand\.ly|cutt\.ly|rb\.gy/i,
    description: 'Unsolicited links can lead to phishing pages. Always verify the domain carefully.',
  },
  {
    id: 'app_install',
    label: 'Request to install unknown app',
    category: 'Malware',
    weight: 20,
    pattern: /\b(install\s+(this|the|our)\s+(app|application|apk)|download\s+(app|apk)|anydesk|teamviewer|remote\s+(access|support))\b/i,
    description: 'Requests to install unknown apps or remote-access tools are high-risk.',
  },
  {
    id: 'threat',
    label: 'Threat of legal / account action',
    category: 'Intimidation',
    weight: 16,
    pattern: /\b(legal\s+action|arrest|warrant|fir|case\s+filed|account\s+(frozen|blocked)|penalty|fine\s+of)\b/i,
    description: 'Threats of arrest, FIR or account freeze are used to create panic.',
  },
  {
    id: 'grammar',
    label: 'Unusual language / poor grammar patterns',
    category: 'Language',
    weight: 8,
    pattern: /\b(dear\s+customer|kindly\s+do\s+the\s+needful|your\s+account\s+has\s+been|click\s+here\s+to\s+verify)\b/i,
    description: 'Generic formal phrasing and template language often appear in mass scam messages.',
  },
  {
    id: 'job_scholarship',
    label: 'Job / scholarship offer red flags',
    category: 'Employment / Education Scam',
    weight: 17,
    pattern: /\b(part[- ]time\s+job|work\s+from\s+home|data\s+entry\s+job|scholarship\s+(form|fee|process)|selected\s+for\s+(job|scholarship|interview))\b/i,
    description: 'Unsolicited job or scholarship offers that ask for fees or personal data are frequently fraudulent.',
  },
];

function scoreToLevel(score: number): RiskLevel {
  if (score >= 55) return 'High';
  if (score >= 30) return 'Medium';
  return 'Low';
}

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Analyse a message using local rules only.
 * Scoring is additive and capped at 100. Explainable and deterministic.
 */
export function analyseMessage(text: string): AnalysisResult {
  const trimmed = text.trim();
  const indicators: DetectedIndicator[] = [];
  let rawScore = 0;

  if (!trimmed) {
    return {
      id: generateId(),
      type: 'message',
      input: '',
      riskScore: 0,
      riskLevel: 'Low',
      indicators: [],
      summary: 'No message provided for analysis.',
      explanations: ['Please paste a message to analyse.'],
      recommendedActions: ['Paste the full suspicious message and run analysis again.'],
      timestamp: new Date().toISOString(),
      disclaimer:
        'This is a local rule-based estimate only. It is not a confirmation of scam status and does not consult any live threat database or AI model.',
    };
  }

  for (const rule of RULES) {
    if (rule.pattern.test(trimmed)) {
      indicators.push({
        id: rule.id,
        label: rule.label,
        description: rule.description,
        weight: rule.weight,
        category: rule.category,
      });
      rawScore += rule.weight;
    }
  }

  const categories = new Set(indicators.map((i) => i.category));
  if (categories.size >= 3) rawScore += 8;
  if (categories.size >= 4) rawScore += 5;

  const riskScore = Math.min(100, rawScore);
  const riskLevel = scoreToLevel(riskScore);

  const summary =
    riskLevel === 'High'
      ? 'Multiple strong scam indicators were detected. Treat this message with high caution.'
      : riskLevel === 'Medium'
        ? 'Some suspicious patterns were found. Verify the sender through official channels before taking any action.'
        : indicators.length === 0
          ? 'No strong local rule matches were found. This does not guarantee the message is safe.'
          : 'Only weak or isolated indicators were detected. Remain cautious and verify independently.';

  const explanations = indicators.map(
    (i) => `${i.label}: ${i.description} (weight ${i.weight})`
  );

  const recommendedActions: string[] =
    riskLevel === 'High'
      ? [
          'Do not click any links or reply with personal information.',
          'Do not share OTP, PIN, password or banking details.',
          'Block the sender if possible.',
          'Report on https://cybercrime.gov.in/ and call 1930 for financial fraud.',
          'If money was already transferred, contact your bank immediately and file a complaint.',
        ]
      : riskLevel === 'Medium'
        ? [
            'Verify the sender using official contact details (not those in the message).',
            'Avoid clicking links until the domain is confirmed safe.',
            'Never share OTP or passwords in response to this message.',
            'If unsure, consult CyberSahayak guidance or report on cybercrime.gov.in.',
          ]
        : [
            'Still verify the identity of the sender through independent official channels.',
            'Do not share sensitive credentials unless you initiated the contact yourself.',
            'Keep the message for records if anything feels off later.',
          ];

  return {
    id: generateId(),
    type: 'message',
    input: trimmed,
    riskScore,
    riskLevel,
    indicators,
    summary,
    explanations,
    recommendedActions,
    timestamp: new Date().toISOString(),
    disclaimer:
      'Result is a local rule-based estimate (keyword / pattern matching). It is NOT equivalent to advanced AI or a live threat-intelligence lookup. Always verify independently.',
  };
}

/** Demo examples for the exhibition */
export const DEMO_MESSAGES = {
  scholarshipScam: `Congratulations! You have been selected for the National Merit Scholarship 2026 worth Rs.50,000. 
To claim your scholarship, pay a one-time processing fee of Rs.999 via UPI within 24 hours otherwise your selection will be cancelled. 
Click here: http://scholarship-claim-in.tk/verify and share the OTP you receive. 
- National Scholarship Portal Team`,

  harmless: `Hi, this is a reminder about our project meeting tomorrow at 3 PM in the library. 
Please bring the printed notes we discussed. See you there!`,

  otpScam: `Dear Customer, Your bank account will be blocked in 2 hours due to KYC expiry. 
Update KYC immediately by clicking https://secure-bank-kyc-update.xyz and enter the OTP sent to your registered mobile. 
- State Bank Security Team`,
};
