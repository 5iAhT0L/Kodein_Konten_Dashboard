import { z } from 'zod';
import {
  CONTENT_CHANNELS,
  ADS_PLATFORMS,
  ProductionStatus,
  PublicationStatus,
  ReportStatus
} from './types';

export const isMonthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
export const isDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export function isValidIsoDate(str: string): boolean {
  if (!isDateRegex.test(str)) return false;
  const t = Date.parse(str);
  if (Number.isNaN(t)) return false;
  return new Date(t).toISOString().slice(0, 10) === str;
}

export const weekItemSchema = z.object({
  id: z.string().optional(),
  start: z.string().refine(isValidIsoDate, { message: 'Format tanggal mulai harus YYYY-MM-DD valid.' }),
  end: z.string().refine(isValidIsoDate, { message: 'Format tanggal selesai harus YYYY-MM-DD valid.' }),
  target: z.number().int().min(0).max(1000).default(5),
  status: z.enum(['Belum mulai', 'Dalam proses', 'Selesai'] as const).default('Belum mulai'),
  issue: z.string().max(2000).default(''),
  action: z.string().max(2000).default(''),
  note: z.string().max(2000).default(''),
  link: z.string().max(2000).refine(val => !val || /^https?:\/\/[^\s]+$/i.test(val), {
    message: 'Tautan bukti harus berupa URL yang valid (diawali http:// atau https://)'
  }).default('')
});

export const contentItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nama / kode konten tidak boleh kosong').max(500),
  day: z.string().refine(isValidIsoDate, { message: 'Format tanggal aktivitas harus YYYY-MM-DD valid.' }),
  format: z.string().max(200).default(''),
  stage: z.string().max(300).default(''),
  production: z.enum(['Direncanakan', 'Dalam proses', 'Selesai'] as const).default('Direncanakan'),
  publish: z.string().refine(val => !val || isValidIsoDate(val), { message: 'Format tanggal tayang harus YYYY-MM-DD valid.' }).default(''),
  publication: z.enum(['Belum tayang', 'Terjadwal', 'Tayang', 'Internal'] as const).default('Belum tayang'),
  channels: z.array(z.enum(CONTENT_CHANNELS)).default([]),
  link: z.string().max(2000).refine(val => !val || /^https?:\/\/[^\s]+$/i.test(val), {
    message: 'Tautan bukti harus URL valid.'
  }).default(''),
  note: z.string().max(2000).default('')
});

export const platformEngagementTupleSchema = z.tuple([
  z.number().int().min(0).nullable(), // Organic
  z.number().int().min(0).nullable(), // Ads
  z.number().int().min(0).nullable(), // Like
  z.number().int().min(0).nullable(), // Comment
  z.number().int().min(0).nullable(), // Share
  z.number().int().min(0).nullable(), // Save
  z.number().int().min(0).nullable()  // Repost
]);

export const adCampaignItemSchema = z.object({
  id: z.string().optional(),
  platform: z.enum(ADS_PLATFORMS).default('Meta Ads'),
  name: z.string().min(1, 'Nama campaign wajib diisi').max(300),
  budget: z.number().int().min(0).nullable().default(null),
  results: z.number().int().min(0).nullable().default(null),
  clicks: z.number().int().min(0).nullable().default(null),
  reach: z.number().int().min(0).nullable().default(null),
  impressions: z.number().int().min(0).nullable().default(null),
  spend: z.number().int().min(0).nullable().default(null),
  ctr: z.number().min(0).max(100).nullable().default(null)
});

export const monthlyReportSchema = z.object({
  id: z.string().optional(),
  month: z.string().regex(isMonthRegex, 'Format bulan harus YYYY-MM'),
  pic: z.string().min(1, 'Nama PIC tidak boleh kosong').max(150),
  target: z.number().min(0).max(100).default(2.0),
  weeks: z.array(weekItemSchema).min(4, 'Minimal harus terdapat 4 pekan').max(6, 'Maksimal 6 pekan per bulan'),
  engagement: z.array(platformEngagementTupleSchema).length(4, 'Harus mencakup 4 platform: IG, FB, TikTok, YT'),
  items: z.array(contentItemSchema).max(1000),
  ads: z.array(adCampaignItemSchema).max(200)
}).superRefine((data, ctx) => {
  // 1. Verify weeks ordering & no overlap
  for (let i = 0; i < data.weeks.length; i++) {
    const w = data.weeks[i];
    if (w.start > w.end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['weeks', i, 'end'],
        message: `Tanggal selesai (${w.end}) tidak boleh sebelum tanggal mulai (${w.start}).`
      });
    }
    if (i > 0 && w.start <= data.weeks[i - 1].end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['weeks', i, 'start'],
        message: `Pekan ${i + 1} tumpang tindih dengan Pekan ${i}.`
      });
    }
  }

  // 2. Verify content item constraints
  const seenNames = new Set<string>();
  data.items.forEach((item, index) => {
    const norm = item.name.trim().toLowerCase();
    if (seenNames.has(norm)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['items', index, 'name'],
        message: `Nama/kode konten "${item.name}" terdaftar ganda.`
      });
    }
    seenNames.add(norm);

    // Activity date must fall within at least one defined week
    const inWeek = data.weeks.some(w => w.start <= item.day && item.day <= w.end);
    if (!inWeek) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['items', index, 'day'],
        message: `Tanggal aktivitas (${item.day}) berada di luar seluruh rentang pekan laporan.`
      });
    }

    if (item.publish && item.publish < item.day) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['items', index, 'publish'],
        message: 'Tanggal tayang tidak boleh mendahului tanggal aktivitas.'
      });
    }

    if (['Tayang', 'Terjadwal'].includes(item.publication)) {
      if (!item.publish) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['items', index, 'publish'],
          message: 'Konten Tayang atau Terjadwal wajib memiliki tanggal tayang.'
        });
      }
      const hasSocial = item.channels.some(c => c !== 'TV internal');
      if (!hasSocial) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['items', index, 'channels'],
          message: 'Konten Tayang/Terjadwal harus memilih minimal 1 platform media sosial.'
        });
      }
    }

    if (['Tayang', 'Internal'].includes(item.publication) && item.production !== 'Selesai') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['items', index, 'production'],
        message: 'Konten Tayang atau Internal harus berstatus produksi "Selesai".'
      });
    }
  });

  // 3. Verify engagement sanity: interaction without impressions
  data.engagement.forEach((row, platformIdx) => {
    const org = row[0] ?? 0;
    const ads = row[1] ?? 0;
    const totalImp = org + ads;
    const interactions = (row[2] ?? 0) + (row[3] ?? 0) + (row[4] ?? 0) + (row[5] ?? 0) + (row[6] ?? 0);
    if (row[0] !== null && row[1] !== null && totalImp === 0 && interactions > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['engagement', platformIdx],
        message: 'Terdapat interaksi namun total impressions bernilai 0. Periksa input engagement.'
      });
    }
  });
});
