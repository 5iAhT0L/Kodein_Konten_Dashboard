import { NextRequest, NextResponse } from 'next/server';
import {
  getIntegrationStates,
  getAuditLogs,
  syncProvider
} from '@/lib/integrations/manager';
import { ProviderId } from '@/lib/integrations/types';

export async function GET() {
  try {
    const states = await getIntegrationStates();
    const auditLogs = getAuditLogs();
    return NextResponse.json({
      connections: states,
      auditLogs
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal mengambil status integrasi.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, providerId, month } = body;

    if (action === 'sync') {
      if (!providerId || !month) {
        return NextResponse.json(
          { error: 'providerId dan month diperlukan untuk sinkronisasi.' },
          { status: 400 }
        );
      }

      const result = await syncProvider(providerId as ProviderId, month);
      return NextResponse.json(result);
    }

    if (action === 'sync_all') {
      if (!month) {
        return NextResponse.json({ error: 'month diperlukan untuk sinkronisasi.' }, { status: 400 });
      }

      const providers: ProviderId[] = ['meta', 'youtube', 'tiktok', 'meta_ads'];
      const results = [];
      for (const p of providers) {
        const r = await syncProvider(p, month);
        results.push(r);
      }
      return NextResponse.json({ results });
    }

    return NextResponse.json({ error: 'Aksi tidak dikenal.' }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Kesalahan internal server integrasi.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
