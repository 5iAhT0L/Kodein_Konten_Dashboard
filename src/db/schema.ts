import {
  pgTable,
  text,
  varchar,
  integer,
  real,
  bigint,
  date,
  timestamp,
  jsonb
} from 'drizzle-orm/pg-core';

/**
 * Monthly Reports Table
 * Keeps legacy_payload jsonb for 100% loss-free backward compatibility.
 */
export const monthlyReports = pgTable('monthly_reports', {
  id: varchar('id', { length: 64 }).primaryKey(),
  month: varchar('month', { length: 7 }).notNull().unique(), // YYYY-MM
  pic: varchar('pic', { length: 150 }).notNull(),
  targetEr: real('target_er').notNull().default(2.0),
  legacyPayload: jsonb('legacy_payload'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

/**
 * Normalized Content Items
 */
export const contentItems = pgTable('content_items', {
  id: varchar('id', { length: 64 }).primaryKey(),
  reportMonth: varchar('report_month', { length: 7 }).notNull(),
  name: varchar('name', { length: 500 }).notNull(),
  day: date('day').notNull(),
  format: varchar('format', { length: 200 }),
  stage: varchar('stage', { length: 300 }),
  production: varchar('production', { length: 50 }).notNull(),
  publish: date('publish'),
  publication: varchar('publication', { length: 50 }).notNull(),
  channels: jsonb('channels').$type<string[]>().default([]),
  link: text('link'),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

/**
 * Engagement Metrics Snapshots
 */
export const engagementSnapshots = pgTable('engagement_snapshots', {
  id: varchar('id', { length: 64 }).primaryKey(),
  reportMonth: varchar('report_month', { length: 7 }).notNull(),
  platform: varchar('platform', { length: 50 }).notNull(),
  startDate: date('start_date'),
  endDate: date('end_date'),
  organicImpressions: integer('organic_impressions'),
  adsImpressions: integer('ads_impressions'),
  likes: integer('likes'),
  comments: integer('comments'),
  shares: integer('shares'),
  saves: integer('saves'),
  reposts: integer('reposts'),
  source: varchar('source', { length: 20 }).notNull().default('manual'), // 'manual' | 'api'
  lastSyncedAt: timestamp('last_synced_at', { withTimezone: true })
});

/**
 * Ad Campaigns
 */
export const adCampaigns = pgTable('ad_campaigns', {
  id: varchar('id', { length: 64 }).primaryKey(),
  reportMonth: varchar('report_month', { length: 7 }).notNull(),
  platform: varchar('platform', { length: 50 }).notNull(),
  name: varchar('name', { length: 300 }).notNull(),
  budget: bigint('budget', { mode: 'number' }),
  results: integer('results'),
  clicks: integer('clicks'),
  reach: integer('reach'),
  impressions: integer('impressions'),
  spend: bigint('spend', { mode: 'number' }),
  ctr: real('ctr'),
  source: varchar('source', { length: 20 }).notNull().default('manual'),
  lastSyncedAt: timestamp('last_synced_at', { withTimezone: true })
});

/**
 * API Provider Integration Connections
 */
export const integrationConnections = pgTable('integration_connections', {
  id: varchar('id', { length: 64 }).primaryKey(),
  provider: varchar('provider', { length: 50 }).notNull().unique(), // 'meta', 'youtube', 'tiktok', 'meta_ads'
  status: varchar('status', { length: 50 }).notNull().default('disconnected'),
  accountId: varchar('account_id', { length: 150 }),
  accountName: varchar('account_name', { length: 150 }),
  scopes: jsonb('scopes').$type<string[]>().default([]),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  tokenExpiresAt: timestamp('token_expires_at', { withTimezone: true }),
  lastSyncAt: timestamp('last_sync_at', { withTimezone: true }),
  lastError: text('last_error')
});

/**
 * Sync Audit Logs
 */
export const syncAuditLogs = pgTable('sync_audit_logs', {
  id: varchar('id', { length: 64 }).primaryKey(),
  provider: varchar('provider', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(), // 'success' | 'failed'
  message: text('message'),
  metricsPayload: jsonb('metrics_payload'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});
