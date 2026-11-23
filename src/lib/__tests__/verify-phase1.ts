import { monthlyReportSchema } from '../validations';
import { SAMPLE_SEPTEMBER_2026 } from '../sample-data';
import {
  calculateOverviewCards,
  calculateUnifiedWeeklySummaries,
  calculateEngagementRows,
  calculateAdCampaign,
  safeRatio
} from '../calculations';

console.log('--- STARTING PHASE 1 DOMAIN & FORMULA VERIFICATION ---');

// 1. Validate Schema
const validationResult = monthlyReportSchema.safeParse(SAMPLE_SEPTEMBER_2026);
if (!validationResult.success) {
  console.error('Validation FAILED:', validationResult.error.issues);
  process.exit(1);
}
console.log('✓ Validation PASSED: SAMPLE_SEPTEMBER_2026 matches Zod schema.');

// 2. Test Overview Cards calculation
const overview = calculateOverviewCards(SAMPLE_SEPTEMBER_2026);
console.log('Overview Cards Output:');
console.log('  Target Konten:', overview.targetContent);
console.log('  Produksi Selesai:', overview.productionFinished);
console.log('  Publikasi Selesai:', overview.publicationCount);
console.log('  Capaian Produksi (%):', overview.contentAchievementPct);
console.log('  Total Leads Ads:', overview.totalLeads);
console.log('  Total Ad Spend:', overview.totalAdSpend);
console.log('  Cost per Lead:', overview.costPerLead);

if (overview.targetContent !== 20 || overview.publicationCount !== 19 || overview.productionFinished !== 20) {
  console.error('Overview numbers mismatch! Expected 20 target, 19 published, 20 finished.');
  process.exit(1);
}
console.log('✓ Overview Cards calculations match Excel reference.');

// 3. Test Unified Weekly Summaries
const weeklySummaries = calculateUnifiedWeeklySummaries(SAMPLE_SEPTEMBER_2026);
console.log(`\nUnified Weekly Summaries (${weeklySummaries.length} weeks):`);
weeklySummaries.forEach(w => {
  console.log(`  [${w.weekName}] ${w.periodLabel}:`);
  console.log(`    Konten: ${w.content.published}/${w.content.target} (${w.content.achievementPct?.toFixed(1)}%) | Diff: ${w.content.diffTarget}`);
  console.log(`    Status Pekan: ${w.status} | Item count: ${w.content.items.length}`);
});

// Pekan 1: target 5, produced 4, published 4
if (weeklySummaries[0].content.published !== 4 || weeklySummaries[0].content.target !== 5) {
  console.error('Pekan 1 content numbers mismatch!');
  process.exit(1);
}
// Pekan 2: target 5, produced 5, published 4
if (weeklySummaries[1].content.produced !== 5 || weeklySummaries[1].content.published !== 4) {
  console.error('Pekan 2 content numbers mismatch!');
  process.exit(1);
}
// Pekan 3: target 5, produced 6, published 6
if (weeklySummaries[2].content.produced !== 6 || weeklySummaries[2].content.published !== 6) {
  console.error('Pekan 3 content numbers mismatch!');
  process.exit(1);
}
// Pekan 4: target 5, produced 5, published 5
if (weeklySummaries[3].content.produced !== 5 || weeklySummaries[3].content.published !== 5) {
  console.error('Pekan 4 content numbers mismatch!');
  process.exit(1);
}
console.log('✓ All 4 weeks content production counts match Excel reference perfectly.');

// 4. Test Weighted Engagement Rate calculation
const mockEngagement: any = [
  [1000, 500, 20, 5, 3, 2, 0], // IG: 1500 imp, 30 int -> 2.0% (Tercapai)
  [2000, 0, 15, 5, 0, 0, 0],   // FB: 2000 imp, 20 int -> 1.0% (Di bawah target)
  [0, 0, 0, 0, 0, 0, 0],       // TikTok: 0 imp, 0 int -> Tanpa impressions
  [null, null, null, null, null, null, null] // YT: Belum ada data
];
const engRows = calculateEngagementRows(mockEngagement, 2.0);
console.log('\nEngagement Rows verification:');
engRows.forEach(r => {
  console.log(`  [${r.platform}] Imp: ${r.totalImpressions} | Int: ${r.totalInteractions} | ER: ${r.engagementRate?.toFixed(2)}% | Status: ${r.status}`);
});
// Total impressions: 1500 + 2000 + 0 = 3500. Total interactions: 30 + 20 + 0 = 50. Weighted ER = 50/3500 * 100 = 1.428%
const totalEr = engRows.find(r => r.platform === 'TOTAL')?.engagementRate;
if (!totalEr || Math.abs(totalEr - (50 / 3500 * 100)) > 0.001) {
  console.error('Weighted ER calculation error!');
  process.exit(1);
}
console.log('✓ Weighted ER arithmetic verification PASSED (never takes simple average).');

// 5. Test Ads calculation
const sampleAd = SAMPLE_SEPTEMBER_2026.ads[0];
const calculatedAd = calculateAdCampaign(sampleAd);
console.log('\nAd Campaign calculation:');
console.log('  Campaign:', calculatedAd.name);
console.log('  Spend:', calculatedAd.spend);
console.log('  Results (Leads):', calculatedAd.results);
console.log('  Cost per Result:', calculatedAd.costPerResult);
console.log('  CPC:', calculatedAd.cpc);
console.log('  CPM:', calculatedAd.cpm);

// Cost per result: 4250000 / 42 = 101190.476...
if (!calculatedAd.costPerResult || Math.abs(calculatedAd.costPerResult - (4250000 / 42)) > 0.01) {
  console.error('Cost per result calculation mismatch!');
  process.exit(1);
}
// CPC: 4250000 / 1250 = 3400
if (calculatedAd.cpc !== 3400) {
  console.error('CPC mismatch! Expected 3400.');
  process.exit(1);
}
// CPM: (4250000 / 48000) * 1000 = 88541.666...
if (!calculatedAd.cpm || Math.abs(calculatedAd.cpm - (4250000 / 48000 * 1000)) > 0.01) {
  console.error('CPM mismatch!');
  process.exit(1);
}
console.log('✓ Ad metrics (Biaya/Hasil, CPC, CPM) match Excel reference formulas.');

console.log('\n=== ALL PHASE 1 VERIFICATION CHECKS PASSED SUCCESSFULLY ===');
