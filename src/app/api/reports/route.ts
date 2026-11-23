import { NextRequest, NextResponse } from 'next/server';
import { listReportMonths, getReportByMonth, saveReport } from '@/lib/server/report-storage';
import { monthlyReportSchema } from '@/lib/validations';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    if (!month) {
      const months = await listReportMonths();
      return NextResponse.json(months);
    }

    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return NextResponse.json({ error: 'Format bulan tidak valid (harus YYYY-MM).' }, { status: 400 });
    }

    const report = await getReportByMonth(month);
    return NextResponse.json(report);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan server.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = monthlyReportSchema.safeParse(body);

    if (!validated.success) {
      const errorMsg = validated.error.issues.map((i: z.ZodIssue) => i.message).join(' ');
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const saved = await saveReport(validated.data);
    return NextResponse.json(saved);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menyimpan laporan.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
