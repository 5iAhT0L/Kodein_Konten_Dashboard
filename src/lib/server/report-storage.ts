import fs from 'fs';
import path from 'path';
import { MonthlyReportData } from '../types';
import { monthlyReportSchema } from '../validations';
import { SAMPLE_SEPTEMBER_2026 } from '../sample-data';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

const LOCAL_DATA_DIR = path.join(process.cwd(), '.data', 'reports');

function ensureLocalDir() {
  if (!fs.existsSync(LOCAL_DATA_DIR)) {
    fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    // Seed September 2026 if empty
    const seedFile = path.join(LOCAL_DATA_DIR, '2026-09.json');
    if (!fs.existsSync(seedFile)) {
      fs.writeFileSync(seedFile, JSON.stringify(SAMPLE_SEPTEMBER_2026, null, 2), 'utf-8');
    }
  }
}

/**
 * List all available saved report months (e.g. ['2026-09', ...])
 */
export async function listReportMonths(): Promise<string[]> {
  const db = getDb();
  if (db) {
    try {
      const records = await db.select({ month: schema.monthlyReports.month }).from(schema.monthlyReports);
      const months = records.map(r => r.month).sort().reverse();
      if (!months.includes('2026-09')) {
        months.push('2026-09');
      }
      return months;
    } catch (err) {
      console.warn('DB error in listReportMonths, falling back to local files:', err);
    }
  }

  // Local file fallback
  ensureLocalDir();
  try {
    const files = fs.readdirSync(LOCAL_DATA_DIR);
    const months = files
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''))
      .filter(m => /^\d{4}-\d{2}$/.test(m))
      .sort()
      .reverse();
    if (!months.includes('2026-09')) {
      months.push('2026-09');
    }
    return months;
  } catch {
    return ['2026-09'];
  }
}

/**
 * Get a monthly report by month (YYYY-MM)
 */
export async function getReportByMonth(month: string): Promise<MonthlyReportData | null> {
  const db = getDb();
  if (db) {
    try {
      const records = await db
        .select()
        .from(schema.monthlyReports)
        .where(eq(schema.monthlyReports.month, month))
        .limit(1);

      if (records.length > 0 && records[0].legacyPayload) {
        return records[0].legacyPayload as MonthlyReportData;
      }
    } catch (err) {
      console.warn(`DB error getting report ${month}, checking local files:`, err);
    }
  }

  // Check September 2026 seed
  if (month === '2026-09') {
    ensureLocalDir();
    const filePath = path.join(LOCAL_DATA_DIR, '2026-09.json');
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
      } catch {
        return SAMPLE_SEPTEMBER_2026;
      }
    }
    return SAMPLE_SEPTEMBER_2026;
  }

  // Check other local files
  ensureLocalDir();
  const filePath = path.join(LOCAL_DATA_DIR, `${month}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error(`Error reading ${filePath}:`, err);
      return null;
    }
  }

  return null;
}

/**
 * Save or update a monthly report
 */
export async function saveReport(report: MonthlyReportData): Promise<MonthlyReportData> {
  const parsed = monthlyReportSchema.parse(report);
  const now = new Date().toISOString();
  const reportWithMeta: MonthlyReportData = {
    ...parsed,
    updatedAt: now
  };

  const db = getDb();
  if (db) {
    try {
      await db
        .insert(schema.monthlyReports)
        .values({
          id: `rep_${parsed.month}`,
          month: parsed.month,
          pic: parsed.pic,
          targetEr: parsed.target,
          legacyPayload: reportWithMeta,
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: schema.monthlyReports.month,
          set: {
            pic: parsed.pic,
            targetEr: parsed.target,
            legacyPayload: reportWithMeta,
            updatedAt: new Date()
          }
        });
    } catch (err) {
      console.warn('DB error in saveReport, persisting locally:', err);
    }
  }

  // Always keep local file synchronized for resilience
  ensureLocalDir();
  const filePath = path.join(LOCAL_DATA_DIR, `${parsed.month}.json`);
  fs.writeFileSync(filePath, JSON.stringify(reportWithMeta, null, 2), 'utf-8');

  return reportWithMeta;
}
