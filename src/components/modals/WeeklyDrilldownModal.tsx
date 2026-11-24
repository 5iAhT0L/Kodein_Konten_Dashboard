'use client';

import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  CheckCircle2,
  Layers,
  BarChart2,
  Megaphone,
  Calendar,
  AlertTriangle,
  Search
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'content' | 'engagement' | 'ads' | 'notes'>('content');
  const [contentSearch, setContentSearch] = useState('');

  if (!isOpen || !summary) return null;

  const filteredContent = summary.content.items.filter(
    item =>
      contentSearch === '' ||
      item.name.toLowerCase().includes(contentSearch.toLowerCase()) ||
      item.format.toLowerCase().includes(contentSearch.toLowerCase()) ||
      item.stage.toLowerCase().includes(contentSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-white z-10 shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-slate-900 text-xl tracking-tight">
                Audit Rincian {summary.weekName}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                {summary.status}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{summary.periodLabel}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls (Segmented Control style) */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="inline-flex p-1 bg-slate-200/60 rounded-xl gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'content'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Daftar Konten ({summary.content.items.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('engagement')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'engagement'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Engagement</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ads')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'ads'
                  ? 'bg-white text-purple-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Leads Ads ({summary.ads.campaignCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'notes'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Kendala &amp; Solusi</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            <span>Tayang: </span>
            <strong className="text-blue-700">
              {summary.content.published}/{summary.content.target} ({formatPercent(summary.content.achievementPct, 0)})
            </strong>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {activeTab === 'content' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={contentSearch}
                  onChange={e => setContentSearch(e.target.value)}
                  placeholder="Cari konten di pekan ini..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {filteredContent.length === 0 ? (
                <p className="text-slate-400 py-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                  Tidak ada konten yang sesuai pencarian di pekan ini.
                </p>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Tanggal</th>
                        <th className="py-2.5 px-4">Nama / Kode Konten</th>
                        <th className="py-2.5 px-3">Format</th>
                        <th className="py-2.5 px-2 text-center">Produksi</th>
                        <th className="py-2.5 px-2 text-center">Publikasi</th>
                        <th className="py-2.5 px-3">Platform</th>
                        <th className="py-2.5 px-3">Bukti</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredContent.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{item.day}</td>
                          <td className="py-3 px-4 font-extrabold text-slate-900">{item.name}</td>
                          <td className="py-3 px-3 text-slate-700">{item.format || '—'}</td>
                          <td className="py-3 px-2 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.production === 'Selesai'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              <span>{item.production}</span>
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                          <td className="py-3 px-3 text-slate-600 text-[11px]">
                            {item.channels.join(', ') || '—'}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            {item.link ? (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline inline-flex items-center gap-1 font-bold"
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
          )}

          {activeTab === 'engagement' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-indigo-950 text-sm">Capaian Engagement Media Sosial</h4>
                  <p className="text-xs text-indigo-800/80 mt-0.5">
                    Total Impresi: {formatNumber(summary.engagement.totalImpressions)} | Total Interaksi: {formatNumber(summary.engagement.totalInteractions)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-indigo-500 block">Weighted ER</span>
                  <span className="text-2xl font-extrabold text-indigo-700">
                    {formatPercent(summary.engagement.weightedEr)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {summary.engagement.platformRows.map(row => (
                  <div key={row.platform} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                    <span className="font-bold text-slate-900 block text-xs">{row.platform}</span>
                    <div className="mt-2 text-slate-600">
                      <span className="text-[10px] text-slate-400 font-medium block">Total Impresi</span>
                      <strong className="text-xs">{formatNumber(row.totalImpressions)}</strong>
                    </div>
                    <div className="mt-1.5">
                      <span className="text-[10px] text-slate-400 font-medium block">ER %</span>
                      <strong className="text-xs text-indigo-700 font-bold">{formatPercent(row.engagementRate)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-purple-950 text-sm">Akuisisi Leads Kampanye Iklan</h4>
                  <p className="text-xs text-purple-800/80 mt-0.5">
                    Total Anggaran Belanja: {formatRupiah(summary.ads.totalSpend)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-purple-500 block">Total Hasil (Leads)</span>
                  <span className="text-2xl font-extrabold text-purple-700">
                    {formatNumber(summary.ads.totalResults)}
                  </span>
                </div>
              </div>

              {summary.ads.campaigns.length === 0 ? (
                <p className="text-slate-400 py-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                  Tidak ada campaign iklan yang aktif.
                </p>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Platform</th>
                        <th className="py-2.5 px-4">Nama Campaign</th>
                        <th className="py-2.5 px-3 text-right">Belanja</th>
                        <th className="py-2.5 px-3 text-right font-bold text-purple-700">Hasil (Leads)</th>
                        <th className="py-2.5 px-3 text-right">Biaya / Hasil</th>
                        <th className="py-2.5 px-3 text-right">CPC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {summary.ads.campaigns.map((ad, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-bold text-slate-700">{ad.platform}</td>
                          <td className="py-3 px-4 font-extrabold text-slate-900">{ad.name}</td>
                          <td className="py-3 px-3 text-right tabular-nums text-slate-800">{formatRupiah(ad.spend)}</td>
                          <td className="py-3 px-3 text-right tabular-nums font-bold text-purple-700">{formatNumber(ad.results)}</td>
                          <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-900">{formatRupiah(ad.costPerResult)}</td>
                          <td className="py-3 px-3 text-right tabular-nums text-slate-700">{formatRupiah(ad.cpc)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                <div>
                  <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wider mb-1">
                    Kendala Lapangan:
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed font-normal">
                    {summary.issue || 'Tidak ada kendala tercatat pada pekan ini.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-200/60">
                  <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wider mb-1">
                    Tindak Lanjut / Corrective Action:
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed font-normal">
                    {summary.action || 'Tidak ada tindakan korektif khusus.'}
                  </p>
                </div>

                {summary.note && (
                  <div className="pt-2 border-t border-amber-200/60">
                    <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wider mb-1">
                      Catatan Tambahan:
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      {summary.note}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 font-medium">
            Dokumen internal Branding &amp; Marketing KODEIN
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Tutup Rincian
          </button>
        </div>
      </div>
    </div>
  );
};
