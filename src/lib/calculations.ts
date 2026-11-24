import {
  MonthlyReportData,
  WeekItem,
  ContentItem,
  PlatformEngagementTuple,
  EngagementRowCalculated,
  AdCampaignItem,
  UnifiedWeeklySummary,
  DashboardOverviewCards,
  SOCIAL_PLATFORMS
} from './types';

/**
 * Safe sum helper. Returns null if all elements are null/undefined.
 */
export function safeSum(values: (number | null | undefined)[]): number | null {
  const filtered = values.filter((v): v is number => v !== null && v !== undefined);
  if (filtered.length === 0) return null;
  return filtered.reduce((acc, x) => acc + x, 0);
}

/**
 * Safe ratio helper. Returns null if denominator is 0, null, or undefined.
 */
export function safeRatio(num: number | null | undefined, den: number | null | undefined): number | null {
  if (num === null || num === undefined || den === null || den === undefined) return null;
  if (den <= 0) return null;
  return num / den;
}

export function formatNumber(val: number | null | undefined, maxFraction = 0): string {
  if (val === null || val === undefined) return '—';
  return val.toLocaleString('id-ID', { maximumFractionDigits: maxFraction });
}

export function formatPercent(val: number | null | undefined, maxFraction = 2): string {
  if (val === null || val === undefined) return '—';
  return `${val.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: maxFraction })}%`;
}

export function formatRupiah(val: number | null | undefined): string {
  if (val === null || val === undefined) return '—';
  return `Rp ${val.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
}

export function formatMonthIndo(monthStr: string): string {
  if (!/^\d{4}-\d{2}$/.test(monthStr)) return monthStr;
  const [year, month] = monthStr.split('-').map(Number);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${months[month - 1]} ${year}`;
}

export function formatDateShortIndo(dateStr: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const [year, m, d] = dateStr.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d} ${months[m - 1]}`;
}

export function formatPeriodRangeIndo(startDate: string, endDate: string): string {
  const [y1, m1, d1] = startDate.split('-').map(Number);
  const [y2, m2, d2] = endDate.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  if (y1 === y2 && m1 === m2) {
    return `${d1}–${d2} ${months[m1 - 1]} ${y1}`;
  }
  return `${d1} ${months[m1 - 1]} – ${d2} ${months[m2 - 1]} ${y2}`;
}

/**
 * Generate default contiguous calendar weeks for a month (Asia/Jakarta boundary)
 */
export function generateDefaultWeeks(monthStr: string): WeekItem[] {
  const [year, month] = monthStr.split('-').map(Number);
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const lastDay = new Date(Date.UTC(year, month, 0));

  const weeks: WeekItem[] = [];
  const current = new Date(firstDay);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const toIso = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

  while (current <= lastDay) {
    const start = new Date(current);
    // Align to Sunday as week end (or lastDay if end of month)
    const end = new Date(current);
    // In UTC, Sunday is 0. Distance to Sunday:
    const dayOfWeek = end.getUTCDay();
    const daysUntilSunday = (7 - dayOfWeek) % 7;
    end.setUTCDate(end.getUTCDate() + daysUntilSunday);

    const stop = end < lastDay ? end : lastDay;

    weeks.push({
      start: toIso(start),
      end: toIso(stop),
      target: 5,
      status: 'Belum mulai',
      issue: '',
      action: '',
      note: '',
      link: ''
    });

    current.setUTCDate(stop.getUTCDate() + 1);
  }

  return weeks;
}

/**
 * Create a new empty MonthlyReportData structure for a given month
 */
export function createBlankReport(monthStr: string, pic = ''): MonthlyReportData {
  return {
    month: monthStr,
    pic,
    target: 2.0,
    weeks: generateDefaultWeeks(monthStr),
    engagement: [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null]
    ],
    items: [],
    ads: []
  };
}

/**
 * Calculate per-platform engagement rows plus weighted TOTAL row.
 */
export function calculateEngagementRows(
  engagementTuples: PlatformEngagementTuple[],
  targetEr = 2.0
): EngagementRowCalculated[] {
  const rows: EngagementRowCalculated[] = [];

  let grandOrganic: number | null = null;
  let grandAds: number | null = null;
  let grandLikes: number | null = null;
  let grandComments: number | null = null;
  let grandShares: number | null = null;
  let grandSaves: number | null = null;
  let grandReposts: number | null = null;

  SOCIAL_PLATFORMS.forEach((platform, idx) => {
    const t = engagementTuples[idx] || [null, null, null, null, null, null, null];
    const [org, ads, like, comment, share, save, repost] = t;

    // Organic + Ads
    const totalImpressions = (org !== null || ads !== null) ? (org ?? 0) + (ads ?? 0) : null;
    const hasAnyInteraction = [like, comment, share, save, repost].some(v => v !== null);
    const totalInteractions = hasAnyInteraction
      ? (like ?? 0) + (comment ?? 0) + (share ?? 0) + (save ?? 0) + (repost ?? 0)
      : null;

    const er = (totalInteractions !== null && totalImpressions !== null && totalImpressions > 0)
      ? (totalInteractions / totalImpressions) * 100
      : null;

    let status: EngagementRowCalculated['status'] = 'Belum ada data';
    if (t.every(v => v === null)) {
      status = 'Belum ada data';
    } else if (t.includes(null)) {
      status = 'Belum lengkap';
    } else if (totalImpressions === 0) {
      status = 'Tanpa impressions';
    } else if (er !== null) {
      status = er >= targetEr ? 'Tercapai' : 'Di bawah target';
    }

    rows.push({
      platform,
      organicImpressions: org,
      adsImpressions: ads,
      totalImpressions,
      likes: like,
      comments: comment,
      shares: share,
      saves: save,
      reposts: repost,
      totalInteractions,
      engagementRate: er,
      targetEr,
      status
    });

    if (org !== null) grandOrganic = (grandOrganic ?? 0) + org;
    if (ads !== null) grandAds = (grandAds ?? 0) + ads;
    if (like !== null) grandLikes = (grandLikes ?? 0) + like;
    if (comment !== null) grandComments = (grandComments ?? 0) + comment;
    if (share !== null) grandShares = (grandShares ?? 0) + share;
    if (save !== null) grandSaves = (grandSaves ?? 0) + save;
    if (repost !== null) grandReposts = (grandReposts ?? 0) + repost;
  });

  // Calculate Weighted TOTAL Row
  const totalGrandImpressions = (grandOrganic !== null || grandAds !== null)
    ? (grandOrganic ?? 0) + (grandAds ?? 0)
    : null;
  const totalGrandInteractions = (grandLikes !== null || grandComments !== null || grandShares !== null || grandSaves !== null || grandReposts !== null)
    ? (grandLikes ?? 0) + (grandComments ?? 0) + (grandShares ?? 0) + (grandSaves ?? 0) + (grandReposts ?? 0)
    : null;

  const weightedTotalEr = (totalGrandInteractions !== null && totalGrandImpressions !== null && totalGrandImpressions > 0)
    ? (totalGrandInteractions / totalGrandImpressions) * 100
    : null;

  let grandStatus: EngagementRowCalculated['status'] = 'Belum ada data';
  if (rows.every(r => r.status === 'Belum ada data')) {
    grandStatus = 'Belum ada data';
  } else if (rows.some(r => r.status === 'Belum lengkap' || r.status === 'Belum ada data')) {
    grandStatus = 'Belum lengkap';
  } else if (weightedTotalEr !== null) {
    grandStatus = weightedTotalEr >= targetEr ? 'Tercapai' : 'Di bawah target';
  }

  rows.push({
    platform: 'TOTAL',
    organicImpressions: grandOrganic,
    adsImpressions: grandAds,
    totalImpressions: totalGrandImpressions,
    likes: grandLikes,
    comments: grandComments,
    shares: grandShares,
    saves: grandSaves,
    reposts: grandReposts,
    totalInteractions: totalGrandInteractions,
    engagementRate: weightedTotalEr,
    targetEr,
    status: grandStatus
  });

  return rows;
}

/**
 * Calculate derived metrics for an Ad Campaign
 */
export function calculateAdCampaign(ad: AdCampaignItem): AdCampaignItem {
  const costPerResult = safeRatio(ad.spend, ad.results);
  const cpc = safeRatio(ad.spend, ad.clicks);
  const cpm = (ad.spend !== null && ad.impressions !== null && ad.impressions > 0)
    ? (ad.spend / ad.impressions) * 1000
    : null;

  return {
    ...ad,
    costPerResult,
    cpc,
    cpm
  };
}

/**
 * Calculate high-level Dashboard Overview Cards
 */
export function calculateOverviewCards(report: MonthlyReportData): DashboardOverviewCards {
  const targetContent = report.weeks.reduce((acc, w) => acc + (w.target || 0), 0);
  const productionFinished = report.items.filter(x => x.production === 'Selesai').length;
  const productionPending = report.items.filter(x => x.production !== 'Selesai').length;
  const publicationCount = report.items.filter(x => x.publication === 'Tayang').length;
  const contentAchievementPct = targetContent > 0 ? (publicationCount / targetContent) * 100 : null;

  // Engagement overall
  const engRows = calculateEngagementRows(report.engagement, report.target);
  const totalRow = engRows[engRows.length - 1];
  const overallEr = totalRow.engagementRate;
  const erStatus = totalRow.status;

  // Ads overall
  const totalLeads = safeSum(report.ads.map(a => a.results));
  const totalAdSpend = safeSum(report.ads.map(a => a.spend));
  const costPerLead = safeRatio(totalAdSpend, totalLeads);

  return {
    productionFinished,
    productionPending,
    publicationCount,
    targetContent,
    contentAchievementPct,
    overallEr,
    targetEr: report.target,
    erStatus,
    totalLeads,
    totalAdSpend,
    costPerLead
  };
}

/**
 * Calculate Unified Weekly Summaries combining:
 * 1. Content Log
 * 2. Engagement Rate & Impressions
 * 3. Leads Ads & Spend
 */
export function calculateUnifiedWeeklySummaries(report: MonthlyReportData): UnifiedWeeklySummary[] {
  const engRows = calculateEngagementRows(report.engagement, report.target);
  const monthlyTotalEng = engRows[engRows.length - 1];

  const enrichedAds = report.ads.map(calculateAdCampaign);
  const totalAdSpend = safeSum(enrichedAds.map(a => a.spend));
  const totalAdResults = safeSum(enrichedAds.map(a => a.results));
  const totalAdClicks = safeSum(enrichedAds.map(a => a.clicks));
  const totalAdImpressions = safeSum(enrichedAds.map(a => a.impressions));
  const totalAdReach = safeSum(enrichedAds.map(a => a.reach));

  const weightedCpc = safeRatio(totalAdSpend, totalAdClicks);
  const weightedCpm = (totalAdSpend !== null && totalAdImpressions !== null && totalAdImpressions > 0)
    ? (totalAdSpend / totalAdImpressions) * 1000
    : null;
  const costPerResult = safeRatio(totalAdSpend, totalAdResults);

  const ctrValues = enrichedAds.map(a => a.ctr).filter((v): v is number => v !== null);
  const averageCtr = ctrValues.length > 0 ? ctrValues.reduce((a, b) => a + b, 0) / ctrValues.length : null;

  return report.weeks.map((week, idx) => {
    // 1. Content for this week
    const weekItems = report.items.filter(item => item.day >= week.start && item.day <= week.end);
    const produced = weekItems.filter(item => item.production === 'Selesai').length;
    const published = weekItems.filter(item => item.publication === 'Tayang').length;
    const inProgress = weekItems.filter(item => item.production !== 'Selesai').length;
    const achievementPct = week.target > 0 ? (published / week.target) * 100 : null;
    const diffTarget = published - week.target;

    return {
      weekIndex: idx,
      weekName: `Pekan ${idx + 1}`,
      periodLabel: formatPeriodRangeIndo(week.start, week.end),
      startDate: week.start,
      endDate: week.end,
      status: week.status,
      issue: week.issue,
      action: week.action,
      note: week.note,
      link: week.link,

      content: {
        target: week.target,
        produced,
        published,
        inProgress,
        achievementPct,
        diffTarget,
        items: weekItems
      },

      engagement: {
        totalImpressions: monthlyTotalEng.totalImpressions,
        totalInteractions: monthlyTotalEng.totalInteractions,
        weightedEr: monthlyTotalEng.engagementRate,
        targetEr: report.target,
        status: monthlyTotalEng.status,
        platformRows: engRows.slice(0, 4),
        hasApiSync: false
      },

      ads: {
        campaignCount: enrichedAds.length,
        totalSpend: totalAdSpend,
        totalResults: totalAdResults,
        costPerResult,
        totalClicks: totalAdClicks,
        totalImpressions: totalAdImpressions,
        totalReach: totalAdReach,
        weightedCpc,
        weightedCpm,
        averageCtr,
        campaigns: enrichedAds
      }
    };
  });
}
