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
  if (score >= 50) return 'High';
  if (score >= 22) return 'Medium';
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

function parseUrl(raw: string): { hostname: string; pathname: string; protocol: string; href: string } {
  try {
    const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    return {
      hostname: u.hostname.toLowerCase(),
      pathname: (u.pathname + u.search).toLowerCase(),
      protocol: u.protocol,
      href: u.href.toLowerCase(),
    };
  } catch {
    return { hostname: '', pathname: '', protocol: '', href: raw.toLowerCase() };
  }
}

const LOOKALIKE_PATTERNS: { brand: string; pattern: RegExp; weight: number }[] = [
  { brand: 'paypal', pattern: /paypa[l1]|pay-pal|paypa1/i, weight: 24 },
  { brand: 'google', pattern: /g[o0]{2}gle|gooogle|g00gle/i, weight: 22 },
  { brand: 'microsoft', pattern: /micr[o0]soft|mircosoft|micros0ft/i, weight: 22 },
  { brand: 'amazon', pattern: /amaz[o0]n|arnazon|amaz0n/i, weight: 22 },
  { brand: 'apple', pattern: /app1e|appie/i, weight: 20 },
  { brand: 'facebook', pattern: /faceb[o0]{2}k|facebok/i, weight: 20 },
  { brand: 'instagram', pattern: /instagr[a@]m/i, weight: 18 },
  { brand: 'whatsapp', pattern: /whattsapp|whatsap/i, weight: 18 },
  { brand: 'sbi', pattern: /sbi[-.]?(bank|online|secure|kyc)|state[-]?bank/i, weight: 24 },
  { brand: 'hdfc', pattern: /hdfc[-.]?(bank|secure|login|kyc)/i, weight: 24 },
  { brand: 'icici', pattern: /icici[-.]?(bank|secure|login)/i, weight: 22 },
  { brand: 'axis', pattern: /axis[-.]?(bank|secure|login)/i, weight: 20 },
  { brand: 'paytm', pattern: /paytm[-.]?(secure|login|verify)/i, weight: 20 },
  { brand: 'phonepe', pattern: /phonepe[-.]?(secure|login)/i, weight: 20 },
];

const SHORTENER_HOSTS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'rebrand.ly', 'cutt.ly',
  'rb.gy', 'ow.ly', 'is.gd', 'buff.ly', 'adf.ly', 'j.mp', 'bl.ink',
];

const OFFICIAL_BRAND_HOSTS = [
  'sbi.co.in', 'onlinesbi.sbi', 'hdfcbank.com', 'icicibank.com', 'axisbank.com',
  'paypal.com', 'google.com', 'microsoft.com', 'amazon.in', 'amazon.com',
  'apple.com', 'facebook.com', 'instagram.com', 'whatsapp.com', 'paytm.com',
  'phonepe.com', 'rbi.org.in', 'uidai.gov.in', 'income-tax.gov.in',
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

  const { hostname, pathname, protocol, href } = parseUrl(input);
  const fullLower = href || input.toLowerCase();

  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.startsWith('[')) {
    indicators.push({
      id: 'ip_host',
      label: 'IP-address used as host',
      description: 'Legitimate sites rarely use raw IP addresses in the browser bar. This is a common phishing tactic.',
      weight: 30,
      category: 'Structure',
    });
    score += 30;
  }

  if (SHORTENER_HOSTS.some((s) => hostname === s || hostname.endsWith(`.${s}`))) {
    indicators.push({
      id: 'shortener',
      label: 'URL shortener detected',
      description: 'Shortened links hide the real destination. Treat them as higher risk until expanded safely.',
      weight: 22,
      category: 'Obfuscation',
    });
    score += 22;
  }

  if (/[^\x00-\x7F]/.test(hostname) || hostname.includes('xn--')) {
    indicators.push({
      id: 'non_ascii',
      label: 'Non-ASCII or punycode hostname',
      description: 'Internationalised domain names can be used for lookalike attacks (homograph phishing).',
      weight: 24,
      category: 'Obfuscation',
    });
    score += 24;
  }

  const labels = hostname.split('.').filter(Boolean);
  if (labels.length >= 5) {
    indicators.push({
      id: 'deep_subdomain',
      label: 'Unusually deep subdomain structure',
      description: 'Many nested subdomains can make a malicious domain look longer and more official.',
      weight: 16,
      category: 'Structure',
    });
    score += 16;
  }

  if (input.includes('@') && input.indexOf('@') < input.lastIndexOf('.')) {
    indicators.push({
      id: 'at_trick',
      label: 'Possible credential or redirect trick (@)',
      description: 'The @ character in URLs can hide the real host that the browser will connect to.',
      weight: 28,
      category: 'Obfuscation',
    });
    score += 28;
  }

  for (const item of LOOKALIKE_PATTERNS) {
    if (item.pattern.test(hostname) || item.pattern.test(fullLower)) {
      const isOfficial = OFFICIAL_BRAND_HOSTS.some(
        (h) => hostname === h || hostname.endsWith(`.${h}`)
      );
      if (!isOfficial) {
        indicators.push({
          id: `lookalike_${item.brand}`,
          label: `Possible lookalike / brand misuse ("${item.brand}")`,
          description:
            'Hostname or path resembles a known brand but is not on a recognised official domain. Structural warning only.',
          weight: item.weight,
          category: 'Lookalike',
        });
        score += item.weight;
        break;
      }
    }
  }

  const tld = labels[labels.length - 1] || '';
  const suspiciousTlds = [
    'tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'club', 'work', 'click',
    'loan', 'win', 'online', 'site', 'icu', 'rest', 'cfd',
  ];
  if (suspiciousTlds.includes(tld)) {
    indicators.push({
      id: 'suspicious_tld',
      label: `Uncommon / frequently-abused TLD (.${tld})`,
      description: 'Some TLDs appear more often in phishing campaigns. This alone does not prove malice.',
      weight: 18,
      category: 'Structure',
    });
    score += 18;
  }

  const phishingPath =
    /(kyc|verify|login|signin|secure|account[-_]?update|password[-_]?reset|claim[-_]?reward|confirm[-_]?identity|unlock[-_]?account|suspended|blocked)/i;
  if (phishingPath.test(pathname) || phishingPath.test(hostname)) {
    indicators.push({
      id: 'phishing_keywords',
      label: 'Phishing-style keywords in path or host',
      description:
        'Words like KYC, login, verify, secure, claim often appear in fake banking / account pages.',
      weight: 20,
      category: 'Phishing Pattern',
    });
    score += 20;
  }

  if (protocol === 'http:' && phishingPath.test(fullLower)) {
    indicators.push({
      id: 'http_sensitive',
      label: 'Non-HTTPS link with sensitive-looking path',
      description: 'Sensitive actions over plain HTTP are a strong red flag.',
      weight: 16,
      category: 'Structure',
    });
    score += 16;
  } else if (protocol === 'http:' && hostname && !hostname.includes('localhost')) {
    indicators.push({
      id: 'insecure_http',
      label: 'Uses plain HTTP (not HTTPS)',
      description: 'Modern trusted sites use HTTPS. Plain HTTP is easier to intercept or spoof.',
      weight: 10,
      category: 'Structure',
    });
    score += 10;
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

  if ((hostname.match(/-/g) || []).length >= 3) {
    indicators.push({
      id: 'hyphen_host',
      label: 'Hyphen-heavy hostname',
      description: 'Long hyphenated hostnames are often used to imitate brands (e.g. secure-sbi-kyc-update).',
      weight: 14,
      category: 'Structure',
    });
    score += 14;
  }

  if (indicators.length >= 3) score += 10;
  if (indicators.length >= 4) score += 8;

  const riskScore = Math.min(100, score);
  const riskLevel = scoreToLevel(riskScore);

  const summary =
    riskLevel === 'High'
      ? 'Several structural red flags were found. Do not visit this URL.'
      : riskLevel === 'Medium'
        ? 'Some suspicious structural patterns were detected. Verify the domain carefully before visiting.'
        : indicators.length === 0
          ? 'No strong structural indicators found. This does NOT mean the URL is safe — local checks cannot confirm reputation.'
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
