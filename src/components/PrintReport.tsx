'use client';

import React from 'react';
import { MonthlyReportData } from '@/lib/types';
import {
  calculateEngagementRows,
  calculateAdCampaign,
  formatNumber,
  formatPercent,
  formatRupiah,
  formatMonthIndo,
  formatPeriodRangeIndo
} from '@/lib/calculations';

interface PrintReportProps {
  report: MonthlyReportData;
}

export const PrintReport: React.FC<PrintReportProps> = ({ report }) => {
  const [printDate, setPrintDate] = React.useState<string>('');

  React.useEffect(() => {
    setPrintDate(new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }));
  }, []);

  const engRows = calculateEngagementRows(report.engagement, report.target);
  const adsRows = report.ads.map(calculateAdCampaign);

  let totalTarget = 0;
  let totalProduced = 0;
  let totalPublished = 0;

  report.weeks.forEach(w => {
    const weekItems = report.items.filter(item => item.day >= w.start && item.day <= w.end);
    totalTarget += w.target;
    totalProduced += weekItems.filter(item => item.production === 'Selesai').length;
    totalPublished += weekItems.filter(item => item.publication === 'Tayang').length;
  });

  const totalPct = totalTarget > 0 ? ((totalPublished / totalTarget) * 100).toFixed(1) : '0';

  return (
    <div id="printout" className="hidden print:block p-8 bg-white text-slate-900 font-sans text-xs">
      {/* Letterhead */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
            KODEIN · SEKOLAH DEVELOPER INDONESIA
          </h1>
          <p className="text-sm font-bold text-slate-700 mt-0.5">
            LAPORAN KINERJA BULANAN TIM BRANDING & MARKETING
          </p>
          <p className="text-xs text-slate-500">
            Sistem Informasi Monitoring Produksi, Engagement Media Sosial &amp; Performa Leads Ads
          </p>
        </div>
        <div className="text-right text-xs">
          <p className="font-semibold text-slate-900">
            Periode: <span className="font-bold">{formatMonthIndo(report.month)}</span>
          </p>
          <p className="text-slate-600">
            PIC: <span className="font-bold text-slate-900">{report.pic || '—'}</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Dicetak: {printDate || 'WIB'}
          </p>
        </div>
      </div>

      {/* Seksi A: KPI Produksi Konten Pekanan */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
          A. KPI Produksi Konten Pekanan
        </h2>
        <table className="w-full text-[11px] border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300">
              <th className="border border-slate-300 p-1.5 text-left">Pekan</th>
              <th className="border border-slate-300 p-1.5 text-left">Periode</th>
              <th className="border border-slate-300 p-1.5 text-center">Target</th>
              <th className="border border-slate-300 p-1.5 text-center">Diproduksi</th>
              <th className="border border-slate-300 p-1.5 text-center">Diposting</th>
              <th className="border border-slate-300 p-1.5 text-center">Capaian %</th>
              <th className="border border-slate-300 p-1.5 text-center">Selisih</th>
              <th className="border border-slate-300 p-1.5 text-center">Status</th>
              <th className="border border-slate-300 p-1.5 text-left">Kendala &amp; Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            {report.weeks.map((w, idx) => {
              const weekItems = report.items.filter(item => item.day >= w.start && item.day <= w.end);
              const produced = weekItems.filter(item => item.production === 'Selesai').length;
              const published = weekItems.filter(item => item.publication === 'Tayang').length;
              const pct = w.target > 0 ? ((published / w.target) * 100).toFixed(1) : '0';
              const diff = published - w.target;

              return (
                <tr key={idx} className="border-b border-slate-200">
                  <td className="border border-slate-300 p-1.5 font-bold">Pekan {idx + 1}</td>
                  <td className="border border-slate-300 p-1.5">{formatPeriodRangeIndo(w.start, w.end)}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{w.target}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{produced}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold">{published}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{pct}%</td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold">
                    {diff > 0 ? `+${diff}` : diff}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center">{w.status}</td>
                  <td className="border border-slate-300 p-1.5 text-[10px]">
                    {w.issue && <div><strong>Kendala:</strong> {w.issue}</div>}
                    {w.action && <div><strong>Solusi:</strong> {w.action}</div>}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
              <td className="border border-slate-300 p-1.5" colSpan={2}>TOTAL TARGET KONTEN BULANAN</td>
              <td className="border border-slate-300 p-1.5 text-center">{totalTarget}</td>
              <td className="border border-slate-300 p-1.5 text-center">{totalProduced}</td>
              <td className="border border-slate-300 p-1.5 text-center">{totalPublished}</td>
              <td className="border border-slate-300 p-1.5 text-center">{totalPct}%</td>
              <td className="border border-slate-300 p-1.5 text-center">{totalPublished - totalTarget}</td>
              <td className="border border-slate-300 p-1.5 text-center" colSpan={2}>
                {totalPublished >= totalTarget ? 'TARGET TERCAPAI' : 'ON PROGRESS'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Seksi B: KPI Engagement Bulanan */}
      <div className="mb-6 page-break-inside-avoid">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
          B. KPI Engagement Bulanan (Weighted Target: {formatPercent(report.target)})
        </h2>
        <table className="w-full text-[11px] border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-[10px]">
              <th className="border border-slate-300 p-1.5 text-left">Platform</th>
              <th className="border border-slate-300 p-1.5 text-right">Organik</th>
              <th className="border border-slate-300 p-1.5 text-right">Iklan</th>
              <th className="border border-slate-300 p-1.5 text-right font-bold">Total Impresi</th>
              <th className="border border-slate-300 p-1 text-right">Like</th>
              <th className="border border-slate-300 p-1 text-right">Comment</th>
              <th className="border border-slate-300 p-1 text-right">Share</th>
              <th className="border border-slate-300 p-1 text-right">Save</th>
              <th className="border border-slate-300 p-1 text-right">Repost</th>
              <th className="border border-slate-300 p-1.5 text-right font-bold">Total Interaksi</th>
              <th className="border border-slate-300 p-1.5 text-right font-bold">ER %</th>
              <th className="border border-slate-300 p-1.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {engRows.map((r, i) => (
              <tr key={i} className={r.platform === 'TOTAL' ? 'bg-slate-100 font-bold border-t-2 border-slate-400' : ''}>
                <td className="border border-slate-300 p-1.5 font-bold">{r.platform}</td>
                <td className="border border-slate-300 p-1.5 text-right">{formatNumber(r.organicImpressions)}</td>
                <td className="border border-slate-300 p-1.5 text-right">{formatNumber(r.adsImpressions)}</td>
                <td className="border border-slate-300 p-1.5 text-right font-semibold">{formatNumber(r.totalImpressions)}</td>
                <td className="border border-slate-300 p-1 text-right">{formatNumber(r.likes)}</td>
                <td className="border border-slate-300 p-1 text-right">{formatNumber(r.comments)}</td>
                <td className="border border-slate-300 p-1 text-right">{formatNumber(r.shares)}</td>
                <td className="border border-slate-300 p-1 text-right">{formatNumber(r.saves)}</td>
                <td className="border border-slate-300 p-1 text-right">{formatNumber(r.reposts)}</td>
                <td className="border border-slate-300 p-1.5 text-right font-bold">{formatNumber(r.totalInteractions)}</td>
                <td className="border border-slate-300 p-1.5 text-right font-bold">{formatPercent(r.engagementRate)}</td>
                <td className="border border-slate-300 p-1.5 text-center text-[10px]">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Seksi C: Log Konten Harian */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
          C. Log Konten Harian ({report.items.length} Konten)
        </h2>
        <table className="w-full text-[10px] border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300">
              <th className="border border-slate-300 p-1 text-center w-8">No</th>
              <th className="border border-slate-300 p-1 text-left w-20">Tanggal</th>
              <th className="border border-slate-300 p-1 text-left">Nama / Kode Konten</th>
              <th className="border border-slate-300 p-1 text-left">Format</th>
              <th className="border border-slate-300 p-1 text-center">Produksi</th>
              <th className="border border-slate-300 p-1 text-center">Tayang</th>
              <th className="border border-slate-300 p-1 text-left">Platform</th>
              <th className="border border-slate-300 p-1 text-left">Catatan</th>
            </tr>
          </thead>
          <tbody>
            {report.items.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-200">
                <td className="border border-slate-300 p-1 text-center text-slate-500">{idx + 1}</td>
                <td className="border border-slate-300 p-1 whitespace-nowrap">{item.day}</td>
                <td className="border border-slate-300 p-1 font-semibold">{item.name}</td>
                <td className="border border-slate-300 p-1">{item.format || '—'}</td>
                <td className="border border-slate-300 p-1 text-center">{item.production}</td>
                <td className="border border-slate-300 p-1 text-center">{item.publication}</td>
                <td className="border border-slate-300 p-1">{item.channels.join(', ') || '—'}</td>
                <td className="border border-slate-300 p-1 text-[9px] text-slate-600">{item.note || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Seksi D: Monitoring Leads Ads */}
      <div className="mb-8 page-break-inside-avoid">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
          D. Monitoring Leads Ads (Pendukung Utama PMB)
        </h2>
        {adsRows.length === 0 ? (
          <p className="text-slate-400 italic">Tidak ada campaign iklan tercatat.</p>
        ) : (
          <table className="w-full text-[10px] border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="border border-slate-300 p-1.5 text-left">Platform</th>
                <th className="border border-slate-300 p-1.5 text-left">Nama Campaign</th>
                <th className="border border-slate-300 p-1.5 text-right">Hasil (Leads)</th>
                <th className="border border-slate-300 p-1.5 text-right">Belanja</th>
                <th className="border border-slate-300 p-1.5 text-right font-bold">Biaya / Hasil</th>
                <th className="border border-slate-300 p-1.5 text-right">Klik</th>
                <th className="border border-slate-300 p-1.5 text-right">CTR %</th>
                <th className="border border-slate-300 p-1.5 text-right">CPC</th>
                <th className="border border-slate-300 p-1.5 text-right">CPM</th>
              </tr>
            </thead>
            <tbody>
              {adsRows.map((ad, idx) => (
                <tr key={idx} className="border-b border-slate-200">
                  <td className="border border-slate-300 p-1.5 font-bold">{ad.platform}</td>
                  <td className="border border-slate-300 p-1.5">{ad.name}</td>
                  <td className="border border-slate-300 p-1.5 text-right font-bold">{formatNumber(ad.results)}</td>
                  <td className="border border-slate-300 p-1.5 text-right">{formatRupiah(ad.spend)}</td>
                  <td className="border border-slate-300 p-1.5 text-right font-bold">{formatRupiah(ad.costPerResult)}</td>
                  <td className="border border-slate-300 p-1.5 text-right">{formatNumber(ad.clicks)}</td>
                  <td className="border border-slate-300 p-1.5 text-right">{formatPercent(ad.ctr)}</td>
                  <td className="border border-slate-300 p-1.5 text-right">{formatRupiah(ad.cpc)}</td>
                  <td className="border border-slate-300 p-1.5 text-right">{formatRupiah(ad.cpm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Signature Section */}
      <div className="pt-8 border-t border-slate-400 grid grid-cols-2 gap-8 text-center text-xs page-break-inside-avoid">
        <div>
          <p className="text-slate-500 mb-12">Disiapkan oleh,</p>
          <p className="font-bold underline text-slate-900">{report.pic || '( ........................................ )'}</p>
          <p className="text-[11px] text-slate-500">PIC Branding &amp; Marketing</p>
        </div>
        <div>
          <p className="text-slate-500 mb-12">Disetujui oleh,</p>
          <p className="font-bold underline text-slate-900">( ........................................ )</p>
          <p className="text-[11px] text-slate-500">Pimpinan / Manajemen KODEIN</p>
        </div>
      </div>
    </div>
  );
};
