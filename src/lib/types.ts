/**
 * Types & Domain Interfaces for KODEIN Monthly Branding & Marketing Report
 * Standardized for Asia/Jakarta (WIB) timezone.
 */

export type ProductionStatus = 'Direncanakan' | 'Dalam proses' | 'Selesai';
export type PublicationStatus = 'Belum tayang' | 'Terjadwal' | 'Tayang' | 'Internal';
export type ReportStatus = 'Belum mulai' | 'Dalam proses' | 'Selesai';

export const SOCIAL_PLATFORMS = ['Instagram', 'Facebook', 'TikTok', 'YouTube'] as const;
export type SocialPlatform = typeof SOCIAL_PLATFORMS[number];

export const CONTENT_CHANNELS = [
  'Instagram',
  'Facebook',
  'TikTok',
  'YouTube',
  'WhatsApp',
  'TV internal',
  'Lainnya'
] as const;
export type ContentChannel = typeof CONTENT_CHANNELS[number];

export const ADS_PLATFORMS = ['Meta Ads', 'TikTok Ads', 'Google Ads', 'Lainnya'] as const;
export type AdsPlatform = typeof ADS_PLATFORMS[number];

export type DataSourceType = 'manual' | 'api';
export type SyncStatusType = 'synced' | 'pending' | 'failed' | 'manual' | 'stale';

/**
 * Week structure in a monthly report
 */
export interface WeekItem {
  id?: string;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  target: number;
  status: ReportStatus;
  issue: string;
  action: string;
  note: string;
  link: string;
}

/**
 * Daily content item from Log Konten
 */
export interface ContentItem {
  id?: string;
  name: string; // Unique name/code in the month
  day: string;  // Activity date (YYYY-MM-DD)
  format: string; // e.g. Edukasi / Reels
  stage: string;  // e.g. Script + Take video + editing
  production: ProductionStatus;
  publish: string; // Publish date (YYYY-MM-DD) or empty
  publication: PublicationStatus;
  channels: ContentChannel[];
  link: string;
  note: string;
}

/**
 * Raw engagement numbers for one platform.
 * Indices match: [Organik, Iklan, Like, Comment, Share, Save, Repost]
 * Value null = data not yet available / not checked.
 * Value 0 = verified 0.
 */
export type PlatformEngagementTuple = [
  number | null, // 0: Organic Impressions
  number | null, // 1: Ads Impressions
  number | null, // 2: Like
  number | null, // 3: Comment
  number | null, // 4: Share
  number | null, // 5: Save
  number | null  // 6: Repost
];

export interface EngagementRowCalculated {
  platform: string;
  organicImpressions: number | null;
  adsImpressions: number | null;
  totalImpressions: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  saves: number | null;
  reposts: number | null;
  totalInteractions: number | null;
  engagementRate: number | null; // percentage e.g. 2.45
  targetEr: number;              // default 2.0%
  status: 'Tercapai' | 'Di bawah target' | 'Belum ada data' | 'Belum lengkap' | 'Tanpa impressions';
  dataSource?: DataSourceType;
  lastSyncedAt?: string | null;
}

/**
 * Ad Campaign row
 */
export interface AdCampaignItem {
  id?: string;
  platform: AdsPlatform;
  name: string;
  budget: number | null;
  results: number | null;      // Leads / Hasil
  clicks: number | null;
  reach: number | null;
  impressions: number | null;
  spend: number | null;        // Dibelanjakan
  ctr: number | null;          // CTR %
  costPerResult?: number | null; // Calculated: spend / results
  cpc?: number | null;           // Calculated: spend / clicks
  cpm?: number | null;           // Calculated: (spend / impressions) * 1000
  dataSource?: DataSourceType;
  lastSyncedAt?: string | null;
}

/**
 * Unified Monthly Report representation
 */
export interface MonthlyReportData {
  id?: string;
  month: string; // YYYY-MM
  pic: string;
  target: number; // Monthly ER Target % (default 2)
  weeks: WeekItem[];
  engagement: PlatformEngagementTuple[]; // 4 platforms
  items: ContentItem[];
  ads: AdCampaignItem[];
  updatedAt?: string;
}

/**
 * Unified Weekly Summary Card & Breakdown Data
 * Combines: Content Production + Social Engagement + Leads Ads
 */
export interface UnifiedWeeklySummary {
  weekIndex: number;
  weekName: string; // e.g. "Pekan 1"
  periodLabel: string; // e.g. "31 Agu – 4 Sep 2026"
  startDate: string;
  endDate: string;
  status: ReportStatus;
  issue: string;
  action: string;
  note: string;
  link: string;

  // 1. Content Pillar
  content: {
    target: number;
    produced: number;
    published: number;
    inProgress: number;
    achievementPct: number | null;
    diffTarget: number;
    items: ContentItem[];
  };

  // 2. Engagement Pillar (prorated or week-windowed if available)
  engagement: {
    totalImpressions: number | null;
    totalInteractions: number | null;
    weightedEr: number | null;
    targetEr: number;
    status: 'Tercapai' | 'Di bawah target' | 'Belum ada data' | 'Belum lengkap' | 'Tanpa impressions';
    platformRows: EngagementRowCalculated[];
    hasApiSync: boolean;
  };

  // 3. Leads Ads Pillar
  ads: {
    campaignCount: number;
    totalSpend: number | null;
    totalResults: number | null; // Leads
    costPerResult: number | null;
    totalClicks: number | null;
    totalImpressions: number | null;
    totalReach: number | null;
    weightedCpc: number | null;
    weightedCpm: number | null;
    averageCtr: number | null;
    campaigns: AdCampaignItem[];
  };
}

/**
 * Overview Cards Data
 */
export interface DashboardOverviewCards {
  productionFinished: number;
  productionPending: number;
  publicationCount: number;
  targetContent: number;
  contentAchievementPct: number | null;
  overallEr: number | null;
  targetEr: number;
  erStatus: string;
  totalLeads: number | null;
  totalAdSpend: number | null;
  costPerLead: number | null;
}
