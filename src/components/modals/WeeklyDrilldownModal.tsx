'use client';

import React from 'react';
import { X, ExternalLink, CheckCircle2, Layers, BarChart2, Megaphone, Calendar } from 'lucide-react';
import { UnifiedWeeklySummary } from '@/lib/types';
import { formatNumber, formatPercent, formatRupiah } from '@/lib/calculations';

interface WeeklyDrilldownModalProps {
  isOpen: boolean;
  summary: UnifiedWeeklySummary | null;
  onClose: () => void;
}

export const WeeklyDrilldownModal: React.FC<WeeklyDrilldownModalProps> = ({
  isOpen,
  summary,
  onClose
}) => {
  if (!isOpen || !summary) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg">{summary.weekName}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                {summary.status}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{summary.periodLabel}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6 text-xs">
          {/* Pilar 1: Konten Detail */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Pilar 1 · Rincian Konten Pekan Ini ({summary.content.items.length} Entri)</span>
              </div>
              <span className="font-semibold text-blue-700">
                Tayang: {summary.content.published} / {summary.content.target} Target ({formatPercent(summary.content.achievementPct, 0)})
              </span>
            </div>

            {summary.content.items.length === 0 ? (
              <p className="text-slate-400 py-3 text-center bg-slate-50 rounded-lg border border-slate-100">
                Belum ada konten yang tercatat pada pekan ini.
              </p>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Tanggal</th>
                      <th className="py-2.5 px-3">Nama Konten</th>
                      <th className="py-2.5 px-2">Format</th>
                      <th className="py-2.5 px-2 text-center">Status</th>
                      <th className="py-2.5 px-3">Platform</th>
                      <th className="py-2.5 px-3">Bukti</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {summary.content.items.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{item.day}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{item.name}</td>
                        <td className="py-2.5 px-2 text-slate-600">{item.format || '—'}</td>
                        <td className="py-2.5 px-2 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              item.publication === 'Tayang'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.publication === 'Tayang' && (
                              <CheckCircle2 className="w-2.5 h-2.5" />
                            )}
                            <span>{item.publication}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-slate-600 text-[11px]">
                            {item.channels.join(', ') || '—'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Lihat</span>
                            </a>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pilar 2: Engagement Detail */}
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <span>Pilar 2 · Engagement Platform ({summary.engagement.status})</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {summary.engagement.platformRows.map(row => (
                <div key={row.platform} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <span className="font-semibold text-slate-800 block text-xs">{row.platform}</span>
                  <div className="mt-1 text-slate-600">
                    <span className="text-[10px] text-slate-400 block">Total Impresi</span>
                    <strong className="text-xs">{formatNumber(row.totalImpressions)}</strong>
                  </div>
                  <div className="mt-1">
                    <span className="text-[10px] text-slate-400 block">ER %</span>
                    <strong className="text-xs text-indigo-700">{formatPercent(row.engagementRate)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pilar 3: Leads Ads Detail */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Megaphone className="w-4 h-4 text-purple-600" />
                <span>Pilar 3 · Leads Ads ({summary.ads.campaignCount} Campaign)</span>
              </div>
              <span className="font-semibold text-purple-800">
                Total Leads: {formatNumber(summary.ads.totalResults)} ({formatRupiah(summary.ads.costPerResult)} / lead)
              </span>
            </div>

            {summary.ads.campaigns.length === 0 ? (
              <p className="text-slate-400 py-3 text-center bg-slate-50 rounded-lg border border-slate-100">
                Belum ada campaign iklan yang aktif pada periode ini.
              </p>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Platform</th>
                      <th className="py-2.5 px-3">Campaign</th>
                      <th className="py-2.5 px-3 text-right">Belanja</th>
                      <th className="py-2.5 px-3 text-right">Hasil (Leads)</th>
                      <th className="py-2.5 px-3 text-right">Biaya / Hasil</th>
                      <th className="py-2.5 px-3 text-right">CPC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {summary.ads.campaigns.map((ad, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-700">{ad.platform}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{ad.name}</td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-slate-800">{formatRupiah(ad.spend)}</td>
                        <td className="py-2.5 px-3 text-right tabular-nums font-bold text-purple-700">{formatNumber(ad.results)}</td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-slate-800">{formatRupiah(ad.costPerResult)}</td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">{formatRupiah(ad.cpc)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
