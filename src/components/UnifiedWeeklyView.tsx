'use client';

import React from 'react';
import {
  Calendar,
  Layers,
  BarChart2,
  Megaphone,
  CheckCircle2,
  ExternalLink,
  Edit3,
  PlusCircle,
  Eye,
  Copy,
  Info
} from 'lucide-react';
import { UnifiedWeeklySummary } from '@/lib/types';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { ShinyBadge } from '@/components/ui/ShinyBadge';
import { useToast } from '@/components/ui/Toast';
import { formatNumber, formatPercent, formatRupiah } from '@/lib/calculations';

interface UnifiedWeeklyViewProps {
  summaries: UnifiedWeeklySummary[];
  onOpenDrilldown: (weekIndex: number) => void;
  onEditWeekSummary: (weekIndex: number) => void;
  onAddWeek: () => void;
}

export const UnifiedWeeklyView: React.FC<UnifiedWeeklyViewProps> = ({
  summaries,
  onOpenDrilldown,
  onEditWeekSummary,
  onAddWeek
}) => {
  const { showToast } = useToast();

  const handleCopyLink = (link: string, weekName: string) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    showToast('info', 'Tautan Disalin', `Bukti ${weekName} telah disalin ke clipboard.`);
  };

  return (
    <div className="space-y-6">
      {/* Banner Rekap Terpadu (React Bits Style) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 shadow-xl border border-blue-900/40">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <ShinyBadge variant="blue">
                <Layers className="w-3.5 h-3.5" />
                <span>Konsolidasi Mingguan Terpadu</span>
              </ShinyBadge>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">
              Ringkasan Kinerja Pekanan KODEIN
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Menyatukan metrik produksi harian, keterlibatan audiens media sosial, dan efisiensi iklan PMB ke dalam satu rentang pekan yang dapat ditelusuri (*drilldown*) hingga bukti postingan.
            </p>
          </div>

          <button
            type="button"
            onClick={onAddWeek}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 hover:shadow-blue-600/50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Tambah Pekan Baru</span>
          </button>
        </div>
      </div>

      {/* Week Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {summaries.map(week => {
          const contentAchieved =
            week.content.achievementPct !== null && week.content.achievementPct >= 100;

          return (
            <SpotlightCard
              key={week.weekIndex}
              spotlightColor="rgba(59, 130, 246, 0.08)"
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div>
                {/* Card Header */}
                <div className="bg-slate-50/80 border-b border-slate-100 p-4 sm:p-5 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-slate-900 text-base">
                        {week.weekName}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          week.status === 'Selesai'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : week.status === 'Dalam proses'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {week.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{week.periodLabel}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEditWeekSummary(week.weekIndex)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all"
                      title="Ubah Target & Catatan Pekan"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenDrilldown(week.weekIndex)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 hover:border-blue-400 text-blue-700 hover:bg-blue-50/70 rounded-xl shadow-xs transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Buka Rincian</span>
                    </button>
                  </div>
                </div>

                {/* 3 Pillars Summary Body */}
                <div className="p-4 sm:p-5 space-y-3.5">
                  {/* Pilar 1: Konten */}
                  <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100/90 hover:border-slate-200 transition-colors">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        <span>Pilar 1 · Produksi &amp; Publikasi Konten</span>
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          contentAchieved ? 'text-emerald-600' : 'text-blue-600'
                        }`}
                      >
                        {formatPercent(week.content.achievementPct, 0)} Capaian
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-medium block">Target</span>
                        <strong className="text-slate-800 text-sm">{week.content.target}</strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-medium block">Selesai</span>
                        <strong className="text-slate-800 text-sm">{week.content.produced}</strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-medium block">Tayang</span>
                        <strong className="text-blue-700 text-sm">{week.content.published}</strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-medium block">Selisih</span>
                        <strong
                          className={`text-sm ${
                            week.content.diffTarget >= 0 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {week.content.diffTarget > 0 ? `+${week.content.diffTarget}` : week.content.diffTarget}
                        </strong>
                      </div>
                    </div>

                    <div className="mt-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenDrilldown(week.weekIndex)}
                        className="text-[11px] text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 font-semibold hover:underline"
                      >
                        <span>Lihat {week.content.items.length} konten pekan ini &rarr;</span>
                      </button>
                    </div>
                  </div>

                  {/* Pilar 2: Engagement Media Sosial */}
                  <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100/90 hover:border-slate-200 transition-colors">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Pilar 2 · Engagement (IG, FB, TikTok, YT)</span>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                        {week.engagement.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-medium block">Total Impresi</span>
                        <strong className="text-slate-800 text-sm">
                          {formatNumber(week.engagement.totalImpressions)}
                        </strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-medium block">Interaksi</span>
                        <strong className="text-slate-800 text-sm">
                          {formatNumber(week.engagement.totalInteractions)}
                        </strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-medium block">Weighted ER</span>
                        <strong
                          className={`text-sm ${
                            week.engagement.weightedEr !== null &&
                            week.engagement.weightedEr >= week.engagement.targetEr
                              ? 'text-emerald-600'
                              : 'text-indigo-700'
                          }`}
                        >
                          {formatPercent(week.engagement.weightedEr)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Pilar 3: Leads Ads */}
                  <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100/90 hover:border-slate-200 transition-colors">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Megaphone className="w-3.5 h-3.5 text-purple-600" />
                        <span>Pilar 3 · Leads Ads ({week.ads.campaignCount} Campaign)</span>
                      </div>
                      <span className="text-xs font-bold text-purple-800">
                        {formatRupiah(week.ads.totalSpend)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-medium block">Hasil Leads</span>
                        <strong className="text-purple-700 text-sm">
                          {formatNumber(week.ads.totalResults)}
                        </strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-medium block">Biaya / Lead</span>
                        <strong className="text-slate-800 text-sm">
                          {formatRupiah(week.ads.costPerResult)}
                        </strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-medium block">Klik Tautan</span>
                        <strong className="text-slate-800 text-sm">
                          {formatNumber(week.ads.totalClicks)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Kendala & Tindak Lanjut jika ada */}
                  {(week.issue || week.action || week.note) && (
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs space-y-1.5">
                      {week.issue && (
                        <div className="text-amber-900 leading-relaxed">
                          <strong className="font-bold text-amber-950">Kendala: </strong>
                          <span>{week.issue}</span>
                        </div>
                      )}
                      {week.action && (
                        <div className="text-amber-900 leading-relaxed">
                          <strong className="font-bold text-amber-950">Tindak Lanjut: </strong>
                          <span>{week.action}</span>
                        </div>
                      )}
                      {week.note && (
                        <div className="text-slate-600 text-[11px] italic">
                          Catatan: {week.note}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Evidence Link with Copy Shortcut */}
              <div className="bg-slate-50/90 px-4 sm:px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {week.link ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={week.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Bukti</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(week.link, week.weekName)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200 transition-colors"
                      title="Salin Tautan Bukti"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span className="text-slate-400 text-[11px] font-medium">Belum ada tautan bukti</span>
                )}

                <span className="text-slate-400 text-[11px] font-medium">
                  {week.content.items.length} Konten Pekan Ini
                </span>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
};
