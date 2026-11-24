import { MonthlyReportData } from './types';
import {
  calculateEngagementRows,
  calculateAdCampaign,
  formatNumber,
  formatPercent,
  formatRupiah,
  formatMonthIndo,
  formatPeriodRangeIndo
} from './calculations';

export function sanitizeCsvValue(val: unknown): string {
  let str = String(val ?? '');
  // Protect against Excel formula injection (=, +, -, @, \t, \r)
  if (typeof val === 'string' && /^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export function exportReportToCsv(report: MonthlyReportData) {
  const sanitize = sanitizeCsvValue;

  const rows: string[][] = [
    ['LAPORAN KERJA BULANAN TIM BRANDING & MARKETING KODEIN'],
    ['Periode', formatMonthIndo(report.month)],
    ['PIC', report.pic],
    ['Target ER Bulanan', `${report.target}%`],
    ['Waktu Ekspor', new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })],
    []
  ];

  // Seksi A · KPI Produksi Konten Pekanan
  rows.push(['A. KPI PRODUKSI KONTEN PEKANAN']);
  rows.push([
    'Pekan',
    'Periode',
    'Target Konten',
    'Diproduksi',
    'Diposting',
    'Capaian %',
    'Selisih',
    'Status Laporan',
    'Kendala',
    'Tindak Lanjut',
    'Bukti / Link',
    'Catatan'
  ]);

  let totalTarget = 0;
  let totalProduced = 0;
  let totalPublished = 0;

  report.weeks.forEach((w, idx) => {
    const weekItems = report.items.filter(item => item.day >= w.start && item.day <= w.end);
    const produced = weekItems.filter(item => item.production === 'Selesai').length;
    const published = weekItems.filter(item => item.publication === 'Tayang').length;
    const pct = w.target > 0 ? `${((published / w.target) * 100).toFixed(1)}%` : '0%';
    const diff = published - w.target;

    totalTarget += w.target;
    totalProduced += produced;
    totalPublished += published;

    rows.push([
      `Pekan ${idx + 1}`,
      formatPeriodRangeIndo(w.start, w.end),
      String(w.target),
      String(produced),
      String(published),
      pct,
      String(diff),
      w.status,
      w.issue,
      w.action,
      w.link,
      w.note
    ]);
  });

  const totalPct = totalTarget > 0 ? `${((totalPublished / totalTarget) * 100).toFixed(1)}%` : '0%';
  rows.push([
    'TOTAL',
    formatMonthIndo(report.month),
    String(totalTarget),
    String(totalProduced),
    String(totalPublished),
    totalPct,
    String(totalPublished - totalTarget),
    '',
    '',
    '',
    '',
    ''
  ]);
  rows.push([]);

  // Seksi B · KPI Engagement Bulanan
  rows.push(['B. KPI ENGAGEMENT BULANAN (WEIGHTED)']);
  rows.push([
    'Platform',
    'Impresi Organik',
    'Impresi Iklan',
    'Total Impresi',
    'Like',
    'Comment',
    'Share',
    'Save',
    'Repost',
    'Total Interaksi',
    'ER %',
    'Target ER %',
    'Status'
  ]);

  const engRows = calculateEngagementRows(report.engagement, report.target);
  engRows.forEach(r => {
    rows.push([
      r.platform,
      formatNumber(r.organicImpressions),
      formatNumber(r.adsImpressions),
      formatNumber(r.totalImpressions),
      formatNumber(r.likes),
      formatNumber(r.comments),
      formatNumber(r.shares),
      formatNumber(r.saves),
      formatNumber(r.reposts),
      formatNumber(r.totalInteractions),
      formatPercent(r.engagementRate),
      formatPercent(r.targetEr),
      r.status
    ]);
  });
  rows.push([]);

  // Seksi C · Monitoring Produksi Konten Harian
  rows.push(['C. MONITORING PRODUKSI KONTEN HARIAN']);
  rows.push([
    'No',
    'Pekan',
    'Tanggal Aktivitas',
    'Nama / Kode Konten',
    'Jenis / Format',
    'Tahap / Output',
    'Status Produksi',
    'Tanggal Tayang',
    'Status Tayang',
    'Platform Publikasi',
    'Tautan Bukti',
    'Catatan / Kendala'
  ]);

  report.items.forEach((item, idx) => {
    const weekIdx = report.weeks.findIndex(w => item.day >= w.start && item.day <= w.end);
    const weekLabel = weekIdx >= 0 ? `Pekan ${weekIdx + 1}` : '—';
    rows.push([
      String(idx + 1),
      weekLabel,
      item.day,
      item.name,
      item.format,
      item.stage,
      item.production,
      item.publish || '—',
      item.publication,
      item.channels.join(', '),
      item.link,
      item.note
    ]);
  });
  rows.push([]);

  // Seksi D · Monitoring Leads Ads
  rows.push(['D. MONITORING LEADS ADS']);
  rows.push([
    'Platform Ads',
    'Nama Campaign',
    'Anggaran (Rp)',
    'Hasil (Leads)',
    'Biaya per Hasil (Rp)',
    'Klik Tautan',
    'Jangkauan',
    'Impresi',
    'Jumlah Belanja (Rp)',
    'CTR %',
    'CPC (Rp)',
    'CPM (Rp)'
  ]);

  report.ads.forEach(ad => {
    const enriched = calculateAdCampaign(ad);
    rows.push([
      enriched.platform,
      enriched.name,
      formatRupiah(enriched.budget),
      formatNumber(enriched.results),
      formatRupiah(enriched.costPerResult),
      formatNumber(enriched.clicks),
      formatNumber(enriched.reach),
      formatNumber(enriched.impressions),
      formatRupiah(enriched.spend),
      formatPercent(enriched.ctr),
      formatRupiah(enriched.cpc),
      formatRupiah(enriched.cpm)
    ]);
  });

  // Construct CSV String
  const csvContent = '\uFEFF' + rows.map(r => r.map(sanitize).join(';')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `KODEIN-Laporan-Kerja-${report.month}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
