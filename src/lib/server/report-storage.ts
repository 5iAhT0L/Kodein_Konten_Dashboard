import fs from 'fs';
import path from 'path';
import os from 'os';
import { MonthlyReportData } from '../types';
import { monthlyReportSchema } from '../validations';
import { SAMPLE_SEPTEMBER_2026 } from '../sample-data';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

// In-memory reports cache: guarantees persistence within active serverless worker runtime
const memoryReportsCache = new Map<string, MonthlyReportData>();

function isServerless(): boolean {
  return (
    !!process.env.VERCEL ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.cwd().startsWith('/var/task')
  );
}

function getWritableDataDir(): string {
  // On Vercel and serverless platforms, process.cwd() is read-only (/var/task).
  // Only os.tmpdir() (/tmp) is writable.
  if (isServerless()) {
    return path.join(os.tmpdir(), 'kodein-data', 'reports');
  }
  return path.join(process.cwd(), '.data', 'reports');
}

function getBundledDataDir(): string {
  return path.join(process.cwd(), '.data', 'reports');
}

function ensureLocalDir() {
  const dir = getWritableDataDir();
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    console.warn('Could not create writable data directory:', err);
  }
}

/**
 * List all available saved report months (e.g. ['2026-09', ...])
 */
export async function listReportMonths(): Promise<string[]> {
  const monthSet = new Set<string>();
  monthSet.add('2026-09');

  // 1. From database
  const db = getDb();
  if (db) {
    try {
      const records = await db.select({ month: schema.monthlyReports.month }).from(schema.monthlyReports);
      records.forEach(r => monthSet.add(r.month));
    } catch (err) {
      console.warn('DB error in listReportMonths, checking memory/files:', err);
    }
  }

  // 2. From memory cache
  Array.from(memoryReportsCache.keys()).forEach(m => monthSet.add(m));

  // 3. From writable filesystem
  try {
    const writableDir = getWritableDataDir();
    if (fs.existsSync(writableDir)) {
      fs.readdirSync(writableDir)
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''))
        .filter(m => /^\d{4}-\d{2}$/.test(m))
        .forEach(m => monthSet.add(m));
    }
  } catch {}

  // 4. From bundled static filesystem (read-only)
  try {
    const bundledDir = getBundledDataDir();
    if (fs.existsSync(bundledDir)) {
      fs.readdirSync(bundledDir)
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''))
        .filter(m => /^\d{4}-\d{2}$/.test(m))
        .forEach(m => monthSet.add(m));
    }
  } catch {}

  return Array.from(monthSet).sort().reverse();
}

/**
 * Get a monthly report by month (YYYY-MM)
 */
export async function getReportByMonth(month: string): Promise<MonthlyReportData | null> {
  // 1. Check database first
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
      console.warn(`DB error getting report ${month}, checking memory/files:`, err);
    }
  }

  // 2. Check memory cache
  if (memoryReportsCache.has(month)) {
    return memoryReportsCache.get(month)!;
  }

  // 3. Check writable data directory (/tmp or .data)
  try {
    const writableDir = getWritableDataDir();
    const filePath = path.join(writableDir, `${month}.json`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      memoryReportsCache.set(month, data);
      return data;
    }
  } catch {}

  // 4. Check bundled read-only directory
  try {
    const bundledDir = getBundledDataDir();
    const filePath = path.join(bundledDir, `${month}.json`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      memoryReportsCache.set(month, data);
      return data;
    }
  } catch {}

  // 5. Default September 2026 seed fallback
  if (month === '2026-09') {
    return SAMPLE_SEPTEMBER_2026;
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

  // 1. Always update in-memory cache
  memoryReportsCache.set(parsed.month, reportWithMeta);

  // 2. Persist to PostgreSQL if configured
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
      console.warn('DB error in saveReport, falling back to local storage:', err);
    }
  }

  // 3. Persist to writable filesystem (/tmp on serverless, .data locally)
  try {
    ensureLocalDir();
    const writableDir = getWritableDataDir();
    const filePath = path.join(writableDir, `${parsed.month}.json`);
    fs.writeFileSync(filePath, JSON.stringify(reportWithMeta, null, 2), 'utf-8');
  } catch (fsErr) {
    // Crucial: In serverless read-only environments (e.g. AWS Lambda / Vercel),
    // never throw an unhandled exception if filesystem write is blocked.
    console.warn('Filesystem write warning (read-only environment):', fsErr);
  }

  return reportWithMeta;
}
