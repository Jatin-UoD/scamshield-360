/**
 * Basic deterministic tests for local analyzers.
 * Run with: npx tsx src/services/__tests__/analyzers.test.ts
 * (or integrate into vitest later)
 */

import { analyseMessage, DEMO_MESSAGES } from '../messageAnalyzer';
import { analyseUrl, DEMO_URLS } from '../urlAnalyzer';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`PASS: ${msg}`);
}

// Message analyzer
const scam = analyseMessage(DEMO_MESSAGES.scholarshipScam);
assert(scam.riskScore >= 55, `scholarship scam should be High-ish (got ${scam.riskScore})`);
assert(scam.riskLevel === 'High' || scam.riskLevel === 'Medium', 'scholarship risk level elevated');
assert(scam.indicators.length >= 2, 'scholarship should match multiple indicators');

const harmless = analyseMessage(DEMO_MESSAGES.harmless);
assert(harmless.riskScore < 30, `harmless message should be Low (got ${harmless.riskScore})`);
assert(harmless.riskLevel === 'Low', 'harmless risk level Low');

const empty = analyseMessage('');
assert(empty.riskScore === 0, 'empty message score 0');

// URL analyzer
const sus = analyseUrl(DEMO_URLS.suspicious);
assert(sus.riskScore >= 28, `suspicious URL elevated (got ${sus.riskScore})`);
assert(sus.indicators.length >= 1, 'suspicious URL has indicators');

const ip = analyseUrl(DEMO_URLS.ipBased);
assert(ip.indicators.some((i) => i.id === 'ip_host'), 'IP host detected');

const clean = analyseUrl(DEMO_URLS.cleanLooking);
assert(clean.riskLevel === 'Low', 'example.com should be Low structurally');

console.log('\nAll analyzer checks passed.');
