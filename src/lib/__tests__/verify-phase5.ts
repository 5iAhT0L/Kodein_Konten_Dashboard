import { monthlyReportSchema } from '../validations';
import {
  calculateEngagementRows,
  calculateAdCampaign,
  safeRatio,
  formatMonthIndo,
  formatPeriodRangeIndo
} from '../calculations';
import { sanitizeCsvValue } from '../csv-export';
import { PlatformEngagementTuple, AdCampaignItem } from '../types';

console.log('====================================================');
console.log('--- PHASE 5 COMPREHENSIVE DOMAIN & INTEGRITY TESTS ---');
console.log('====================================================\n');

let failedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    if (details) console.error(`    Details: ${details}`);
    failedTests++;
  }
}

// -----------------------------------------------------------------------------
// 1. Zero vs Null Differentiation in Engagement Metrics
// PlatformEngagementTuple indices:
// [0: orgImp, 1: adsImp, 2: like, 3: comment, 4: share, 5: save, 6: repost]
// -----------------------------------------------------------------------------
console.log('Test Suite 1: Zero vs Null Distinction');

// Case 1A: All Nulls (Data unverified / unintegrated)
const allNullTuple: PlatformEngagementTuple = [null, null, null, null, null, null, null];
const rowsNull = calculateEngagementRows([allNullTuple, allNullTuple, allNullTuple, allNullTuple], 2.0);
const igNull = rowsNull[0];
assert(igNull.totalInteractions === null, '1A. Null platform totalInteractions is null');
assert(igNull.totalImpressions === null, '1A. Null platform totalImpressions is null');
assert(igNull.engagementRate === null, '1A. Null platform ER is null');
assert(igNull.status === 'Belum ada data', '1A. Null platform status is "Belum ada data"');

// Case 1B: Verified 0 Interactions with valid impressions (1000 org, 0 ads)
const zeroInteractionsTuple: PlatformEngagementTuple = [1000, 0, 0, 0, 0, 0, 0];
const rowsZero = calculateEngagementRows([zeroInteractionsTuple, allNullTuple, allNullTuple, allNullTuple], 2.0);
const igZero = rowsZero[0];
assert(igZero.totalInteractions === 0, '1B. Verified 0 interactions yields totalInteractions = 0');
assert(igZero.totalImpressions === 1000, '1B. Impressions correctly parsed as 1000');
assert(igZero.engagementRate === 0.0, '1B. Engagement Rate is exactly 0.0% (not null)');
assert(igZero.status === 'Di bawah target', '1B. 0.0% ER against 2.0% target is "Di bawah target"');

// Case 1C: Zero impressions with interactions (0 org, 0 ads, 10 likes, 5 comments)
const zeroImpressionsTuple: PlatformEngagementTuple = [0, 0, 10, 5, 0, 0, 0];
const rowsZeroImp = calculateEngagementRows([zeroImpressionsTuple, allNullTuple, allNullTuple, allNullTuple], 2.0);
const igZeroImp = rowsZeroImp[0];
assert(igZeroImp.totalInteractions === 15, '1C. Total interactions counted as 15');
assert(igZeroImp.totalImpressions === 0, '1C. Impressions is 0');
assert(igZeroImp.engagementRate === null, '1C. ER is null when impressions is 0 (division by zero avoided)');
assert(igZeroImp.status === 'Tanpa impressions', '1C. Status is "Tanpa impressions"');

// Case 1D: All zeros (verified complete zero activity)
const allZeroTuple: PlatformEngagementTuple = [0, 0, 0, 0, 0, 0, 0];
const rowsAllZero = calculateEngagementRows([allZeroTuple, allNullTuple, allNullTuple, allNullTuple], 2.0);
const igAllZero = rowsAllZero[0];
assert(igAllZero.totalInteractions === 0, '1D. Total interactions is 0');
assert(igAllZero.totalImpressions === 0, '1D. Impressions is 0');
assert(igAllZero.engagementRate === null, '1D. ER is null (avoids 0/0 error)');
assert(igAllZero.status === 'Tanpa impressions', '1D. Status is "Tanpa impressions"');

// -----------------------------------------------------------------------------
// 2. Strict Weighted Engagement Rate Cross-Platform Calculation
// -----------------------------------------------------------------------------
console.log('\nTest Suite 2: Strict Weighted Engagement Rate (Non-Arithmetic Mean)');

// Platform 1 (Instagram): 1000 org impressions, 100 interactions (50 like + 20 comment + 20 share + 10 save) -> 10.0% ER
const p1Tuple: PlatformEngagementTuple = [1000, 0, 50, 20, 20, 10, 0];
// Platform 2 (Facebook): 10000 org impressions, 10 interactions (5 like + 2 comment + 2 share + 1 save) -> 0.1% ER
const p2Tuple: PlatformEngagementTuple = [10000, 0, 5, 2, 2, 1, 0];
// Platforms 3 & 4 (TikTok & YouTube): Verified zero activity for complete month audit
const p3Tuple: PlatformEngagementTuple = [0, 0, 0, 0, 0, 0, 0];
const p4Tuple: PlatformEngagementTuple = [0, 0, 0, 0, 0, 0, 0];
// Simple Average = (10.0% + 0.1%) / 2 = 5.05% (Falsely above 2.0% target!)
// Real Weighted ER = (100 + 10) / (1,000 + 10,000) = 110 / 11,000 = 1.00% (Accurately below 2.0% target!)
const weightedRows = calculateEngagementRows([p1Tuple, p2Tuple, p3Tuple, p4Tuple], 2.0);

const totalRow = weightedRows.find(r => r.platform === 'TOTAL')!;
assert(totalRow.totalInteractions === 110, '2A. TOTAL interactions is 110 (100 + 10)');
assert(totalRow.totalImpressions === 11000, '2B. TOTAL impressions is 11,000 (1,000 + 10,000)');
assert(totalRow.engagementRate === 1.0, `2C. TOTAL Weighted ER is exactly 1.0% (got ${totalRow.engagementRate})`);
assert(totalRow.status === 'Di bawah target', '2D. TOTAL status correctly evaluates to "Di bawah target"');
assert(totalRow.engagementRate !== 5.05, '2E. Proved: Arithmetic average (5.05%) is NOT used');

// -----------------------------------------------------------------------------
// 3. Ads Division by Zero & Edge Cases
// -----------------------------------------------------------------------------
console.log('\nTest Suite 3: Ads Metrics Calculation & Division by Zero Safety');

// Case 3A: Zero leads (spend > 0, results = 0)
const adZeroLeads = calculateAdCampaign({
  platform: 'Meta Ads',
  name: 'Zero Leads Test',
  budget: 1000000,
  spend: 500000,
  results: 0,
  impressions: 10000,
  clicks: 200,
  reach: 8000,
  ctr: 2.0
});
assert(adZeroLeads.costPerResult === null, '3A. Cost per Result returns null when results is 0 (avoids Infinity/NaN)');

// Case 3B: Zero clicks (spend > 0, clicks = 0)
const adZeroClicks = calculateAdCampaign({
  platform: 'Meta Ads',
  name: 'Zero Clicks Test',
  budget: 1000000,
  spend: 500000,
  results: 10,
  impressions: 10000,
  clicks: 0,
  reach: 8000,
  ctr: 0.0
});
assert(adZeroClicks.cpc === null, '3B. CPC returns null when clicks is 0');

// Case 3C: Zero impressions (clicks > 0, impressions = 0)
const adZeroImp = calculateAdCampaign({
  platform: 'Google Ads',
  name: 'Zero Imp Test',
  budget: 500000,
  spend: 250000,
  results: 5,
  impressions: 0,
  clicks: 50,
  reach: 0,
  ctr: null
});
assert(adZeroImp.cpm === null, '3C. CPM returns null when impressions is 0');

// Case 3D: Normal Ads math validation
const adNormal = calculateAdCampaign({
  platform: 'Meta Ads',
  name: 'PMB Gelombang 1',
  budget: 5000000,
  spend: 4250000,
  results: 42,
  impressions: 48000,
  clicks: 1250,
  reach: 34500,
  ctr: 2.6
});
assert(Math.round(adNormal.costPerResult ?? 0) === 101190, '3D. Cost per result: Rp 4.250.000 / 42 = Rp 101.190');
assert(adNormal.cpc === 3400, '3D. CPC: Rp 4.250.000 / 1.250 = Rp 3.400');
assert(Math.round(adNormal.cpm ?? 0) === 88542, '3D. CPM: (Rp 4.250.000 / 48.000) * 1000 = Rp 88.542');
assert(adNormal.ctr === 2.6, '3D. CTR: 2.6%');

// -----------------------------------------------------------------------------
// 4. CSV Formula Injection Security Sanitization
// -----------------------------------------------------------------------------
console.log('\nTest Suite 4: CSV Export Security & Formula Injection Sanitization');

const testCases = [
  { input: '=SUM(A1:A10)', expectedStart: '"\'=' },
  { input: '+cmd|\' /C calc\'!A0', expectedStart: '"\'\+' },
  { input: '-10+20', expectedStart: '"\'-' },
  { input: '@SUM(1,2)', expectedStart: '"\'@' },
  { input: '\tmalicious', expectedStart: '"\'\t' },
  { input: '\rmalicious', expectedStart: '"\'\r' },
  { input: 'KODEIN Sekolah Developer', expected: '"KODEIN Sekolah Developer"' },
  { input: 1250000, expected: '"1250000"' },
  { input: null, expected: '""' }
];

testCases.forEach((tc, i) => {
  const result = sanitizeCsvValue(tc.input);
  if (tc.expectedStart) {
    assert(result.startsWith(tc.expectedStart), `4.${i + 1} Prefix dangerous formula '${String(tc.input).substring(0, 5)}' with single quote`);
  } else {
    assert(result === tc.expected, `4.${i + 1} Safe input '${tc.input}' matches expected ${tc.expected}`);
  }
});

// -----------------------------------------------------------------------------
// 5. Date Boundaries & Schema Validation
// -----------------------------------------------------------------------------
console.log('\nTest Suite 5: Date Boundaries & Schema Validation');

assert(formatMonthIndo('2026-09') === 'September 2026', '5A. formatMonthIndo converts 2026-09 to "September 2026"');
assert(formatPeriodRangeIndo('2026-09-01', '2026-09-07') === '1–7 Sep 2026', '5B. formatPeriodRangeIndo formats "1–7 Sep 2026"');

// Schema rejects invalid month
const invalidMonthReport = {
  month: 'invalid-month',
  pic: 'Hamoto',
  target: 2.0,
  weeks: [],
  items: [],
  engagement: [allNullTuple, allNullTuple, allNullTuple, allNullTuple],
  ads: []
};
const parseFail = monthlyReportSchema.safeParse(invalidMonthReport);
assert(!parseFail.success, '5C. Schema rejects invalid month string pattern');

console.log('\n====================================================');
if (failedTests === 0) {
  console.log('🎉 ALL PHASE 5 TESTS PASSED SUCCESSFULLY! (0 Failures)');
  console.log('====================================================\n');
  process.exit(0);
} else {
  console.error(`❌ ${failedTests} TEST(S) FAILED!`);
  console.log('====================================================\n');
  process.exit(1);
}
