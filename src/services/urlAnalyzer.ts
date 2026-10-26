/**
 * Local structural URL analyzer.
 * Never navigates to the URL. Does not claim safety from absence of indicators.
 * Modular: threatIntelProvider can be plugged in later for reputation checks.
 */

import type { AnalysisResult, DetectedIndicator, RiskLevel } from '../types';

function generateId(): string {
  return `url_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function scoreToLevel(score: number): RiskLevel {
  if (score >= 55) return 'High';
  if (score >= 28) return 'Medium';
  return 'Low';
}

function isValidUrlSyntax(raw: string): boolean {
  try {
    const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    return Boolean(u.hostname);
  } catch {
    return false;
  }
}

function extractHostname(raw: string): string {
  try {
    const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    return u.hostname.toLowerCase();
  } catch {
    return '';
  }
}

const LOOKALIKE_PATTERNS: { brand: string; pattern: RegExp; weight: number }[] = [
  { brand: 'paypal', pattern: /paypa[l1]|pay-pal|paypa1/i, weight: 22 },
  { brand: 'google', pattern: /g[o0]{2}gle|gooogle|g00gle/i, weight: 20 },
  { brand: 'microsoft', pattern: /micr[o0]soft|mircosoft|micros0ft/i, weight: 20 },
  { brand: 'amazon', pattern: /amaz[o0]n|arnazon|amaz0n/i, weight: 20 },
  { brand: 'apple', pattern: /app1e|appie/i, weight: 18 },
  { brand: 'facebook', pattern: /faceb[o0]{2}k|facebok/i, weight: 18 },
  { brand: 'instagram', pattern: /instagr[a@]m/i, weight: 16 },
  { brand: 'whatsapp', pattern: /whattsapp|whatsap/i, weight: 16 },
  { brand: 'sbi / bank', pattern: /sbi[-.]?(bank|online|secure)|statebank/i, weight: 18 },
  { brand: 'hdfc', pattern: /hdfc[-.]?(bank|secure|login)/i, weight: 18 },
];

const SHORTENER_HOSTS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'rebrand.ly', 'cutt.ly',
  'rb.gy', 'ow.ly', 'is.gd', 'buff.ly', 'adf.ly', 'j.mp',
];

export function analyseUrl(rawInput: string): AnalysisResult {
  const input = rawInput.trim();
  const indicators: DetectedIndicator[] = [];
  let score = 0;

  if (!input) {
    return emptyResult(input, 'No URL provided.');
  }

  if (!isValidUrlSyntax(input)) {
    indicators.push({
      id: 'invalid_syntax',
      label: 'Invalid or malformed URL syntax',
      description: 'The input does not parse as a valid URL. It may be incomplete or deliberately confusing.',
      weight: 30,
      category: 'Structure',
    });
    score += 30;
  }

  const hostname = extractHostname(input);
  const fullLower = input.toLowerCase();

  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.startsWith('[')) {
    indicators.push({
      id: 'ip_host',
      label: 'IP-address used as host',
      description: 'Legitimate sites rarely use raw IP addresses in the browser bar. This is a common phishing tactic.',
      weight: 28,
      category: 'Structure',
    });
    score += 28;
  }

  if (SHORTENER_HOSTS.some((s) => hostname === s || hostname.endsWith(`.${s}`))) {
    indicators.push({
      id: 'shortener',
      label: 'URL shortener detected',
      description: 'Shortened links hide the real destination. Resolve them carefully with a safe expander if needed.',
      weight: 18,
      category: 'Obfuscation',
    });
    score += 18;
  }

  if (/[^\x00-\x7F]/.test(hostname) || hostname.includes('xn--')) {
    indicators.push({
      id: 'non_ascii',
      label: 'Non-ASCII or punycode hostname',
      description: 'Internationalised domain names can be used for lookalike attacks (homograph phishing).',
      weight: 22,
      category: 'Obfuscation',
    });
    score += 22;
  }

  const labels = hostname.split('.').filter(Boolean);
  if (labels.length >= 5) {
    indicators.push({
      id: 'deep_subdomain',
      label: 'Unusually deep subdomain structure',
      description: 'Many nested subdomains can be used to make a malicious domain look longer and more official.',
      weight: 14,
      category: 'Structure',
    });
    score += 14;
  }

  if (input.includes('@') && input.indexOf('@') < input.lastIndexOf('.')) {
    indicators.push({
      id: 'at_trick',
      label: 'Possible credential or redirect trick (@)',
      description: 'The @ character in URLs can hide the real host that the browser will connect to.',
      weight: 25,
      category: 'Obfuscation',
    });
    score += 25;
  }

  for (const item of LOOKALIKE_PATTERNS) {
    if (item.pattern.test(hostname) || item.pattern.test(fullLower)) {
      const isLikelyReal =
        hostname === `${item.brand}.com` ||
        hostname === `${item.brand}.in` ||
        hostname.endsWith(`.${item.brand}.com`) ||
        hostname.endsWith(`.${item.brand}.in`);
      if (!isLikelyReal) {
        indicators.push({
          id: `lookalike_${item.brand}`,
          label: `Possible lookalike of "${item.brand}"`,
          description: `Hostname or path resembles a known brand. This is a structural warning only - not a definitive match.`,
          weight: item.weight,
          category: 'Lookalike',
        });
        score += item.weight;
        break;
      }
    }
  }

  const tld = labels[labels.length - 1] || '';
  const suspiciousTlds = ['tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'club', 'work', 'click'];
  if (suspiciousTlds.includes(tld)) {
    indicators.push({
      id: 'suspicious_tld',
      label: `Uncommon / frequently-abused TLD (.${tld})`,
      description: 'Some TLDs appear more often in phishing campaigns. This alone does not prove malice.',
      weight: 12,
      category: 'Structure',
    });
    score += 12;
  }

  if (/^(javascript|data):/i.test(input)) {
    indicators.push({
      id: 'dangerous_protocol',
      label: 'Dangerous protocol (javascript: / data:)',
      description: 'These protocols can execute code or embed content and should never be trusted from unknown sources.',
      weight: 40,
      category: 'Structure',
    });
    score += 40;
  }

  const riskScore = Math.min(100, score);
  const riskLevel = scoreToLevel(riskScore);

  const summary =
    riskLevel === 'High'
      ? 'Several structural red flags were found. Do not visit this URL.'
      : riskLevel === 'Medium'
        ? 'Some suspicious structural patterns were detected. Verify the domain carefully before visiting.'
        : indicators.length === 0
          ? 'No strong structural indicators found. This does NOT mean the URL is safe - local checks cannot confirm reputation.'
          : 'Only mild structural observations were made. Still treat unknown links with caution.';

  const explanations = indicators.map(
    (i) => `${i.label}: ${i.description} (weight ${i.weight})`
  );

  const recommendedActions: string[] =
    riskLevel === 'High'
      ? [
          'Do not open or click the link.',
          'Do not enter any credentials if you already opened it.',
          'Report the URL on https://cybercrime.gov.in/ if it was used in a scam attempt.',
          'If you already visited it, run a malware scan and change important passwords from a clean device.',
        ]
      : riskLevel === 'Medium'
        ? [
            'Do not open the link until you independently verify the real domain.',
            'Type the official website address yourself instead of clicking.',
            'Hover (on desktop) to inspect the true destination, but never rely only on that.',
          ]
        : [
            'Even when no structural flags appear, prefer typing official domains yourself.',
            'Local analysis cannot check blacklists or live threat feeds.',
            'When in doubt, use CyberSahayak guidance or official reporting channels.',
          ];

  return {
    id: generateId(),
    type: 'url',
    input,
    riskScore,
    riskLevel,
    indicators,
    summary,
    explanations,
    recommendedActions,
    timestamp: new Date().toISOString(),
    disclaimer:
      'This is a local structural analysis only. Absence of indicators does NOT confirm safety. A real threat-intelligence database is required for reputation checks (not configured in this demo).',
  };
}

function emptyResult(input: string, msg: string): AnalysisResult {
  return {
    id: generateId(),
    type: 'url',
    input,
    riskScore: 0,
    riskLevel: 'Low',
    indicators: [],
    summary: msg,
    explanations: [msg],
    recommendedActions: ['Paste a full URL (including https:// if possible) and analyse again.'],
    timestamp: new Date().toISOString(),
    disclaimer: 'Local structural analysis only. Never opens the submitted URL.',
  };
}

export const DEMO_URLS = {
  suspicious: 'http://secure-sbi-kyc-update.tk/login?session=verify',
  ipBased: 'http://192.168.45.12/bank-login',
  shortener: 'https://bit.ly/3xFakeDemo',
  lookalike: 'https://paypa1-secure-login.xyz/verify',
  cleanLooking: 'https://www.example.com/about',
};
