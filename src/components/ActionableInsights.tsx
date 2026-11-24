'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronRight,
  TrendingUp,
  Radio,
  FileText
} from 'lucide-react';
import { MonthlyReportData } from '@/lib/types';
import { calculateEngagementRows } from '@/lib/calculations';

interface ActionableInsightsProps {
  report: MonthlyReportData;
  onNavigateTab: (tab: 'weekly' | 'engagement' | 'items' | 'ads') => void;
  onOpenIntegrations: () => void;
}

export interface InsightItem {
  id: string;
  type: 'action' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const ActionableInsights: React.FC<ActionableInsightsProps> = ({
  report,
  onNavigateTab,
  onOpenIntegrations
}) => {
  const [filterType, setFilterType] = useState<'all' | 'action' | 'info'>('all');

  const insights = useMemo(() => {
    const list: InsightItem[] = [];

    // 1. Weekly targets check
    report.weeks.forEach((w, idx) => {
      const weekItems = report.items.filter(item => item.day >= w.start && item.day <= w.end);
      const published = weekItems.filter(item => item.publication === 'Tayang').length;
      if (published < w.target) {
        list.push({
          id: `week_target_${idx}`,
          type: 'action',
          title: `Pekan ${idx + 1}: Publikasi Konten di Bawah Target`,
          description: `Baru ${published} dari ${w.target} konten yang telah dipublikasikan (selisih: ${published - w.target}).`,
          actionText: 'Lihat Pekan Ini',
          onAction: () => onNavigateTab('weekly')
        });
      }
    });

    // 2. Internal / Unreleased content
    const internalItems = report.items.filter(
      item => item.publication === 'Internal' || (item.production === 'Selesai' && item.publication !== 'Tayang')
    );
    if (internalItems.length > 0) {
      list.push({
        id: 'content_pending_publish',
        type: 'info',
        title: `${internalItems.length} Konten Selesai Belum Tayang di Media Sosial`,
        description: `Terdapat konten selesai produksi (misal: ${internalItems[0].name}) yang masih berstatus Internal/Belum Tayang.`,
        actionText: 'Buka Log Konten',
        onAction: () => onNavigateTab('items')
      });
    }

    // 3. Engagement status check
    const engRows = calculateEngagementRows(report.engagement, report.target);
    const missingPlatforms = engRows.filter(
      r => r.platform !== 'TOTAL' && r.status === 'Belum ada data'
    );
    if (missingPlatforms.length > 0) {
      list.push({
        id: 'engagement_missing',
        type: 'warning',
        title: `${missingPlatforms.length} Platform Belum Memiliki Data Engagement`,
        description: `${missingPlatforms.map(p => p.platform).join(', ')} belum diisi. Anda dapat memasukkan angka manual atau melakukan sinkronisasi API.`,
        actionText: 'Sinkronkan API',
        onAction: onOpenIntegrations
      });
    }

    const belowErPlatforms = engRows.filter(
      r => r.platform !== 'TOTAL' && r.status === 'Di bawah target'
    );
    if (belowErPlatforms.length > 0) {
      list.push({
        id: 'engagement_below',
        type: 'warning',
        title: `${belowErPlatforms.map(p => p.platform).join(', ')} di Bawah Target ER ${report.target}%`,
        description: 'Tingkatkan keterlibatan audiens dengan hook video yang lebih kuat atau interaksi di kolom komentar.',
        actionText: 'Audit Engagement',
        onAction: () => onNavigateTab('engagement')
      });
    }

    // 4. Ads efficiency check
    if (report.ads.length > 0) {
      const totalSpend = report.ads.reduce((acc, a) => acc + (a.spend ?? 0), 0);
      const totalResults = report.ads.reduce((acc, a) => acc + (a.results ?? 0), 0);
      if (totalResults > 0) {
        const costPerLead = totalSpend / totalResults;
        list.push({
          id: 'ads_efficiency',
          type: 'success',
          title: 'Akuisisi Leads Ads Efisien',
          description: `Total ${totalResults} leads berhasil diperoleh dengan biaya rata-rata Rp ${costPerLead.toLocaleString('id-ID', { maximumFractionDigits: 0 })} per lead.`,
          actionText: 'Detail Ads',
          onAction: () => onNavigateTab('ads')
        });
      }
    }

    return list;
  }, [report, onNavigateTab, onOpenIntegrations]);

  const filtered = useMemo(() => {
    if (filterType === 'all') return insights;
    if (filterType === 'action') return insights.filter(i => i.type === 'action' || i.type === 'warning');
    return insights.filter(i => i.type === 'info' || i.type === 'success');
  }, [insights, filterType]);

  if (insights.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
              Actionable Insights &amp; Peringatan Operasional
            </h3>
            <p className="text-[11px] text-slate-500">
              Rekomendasi otomatis berbasis capaian data aktual KODEIN periode {report.month}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs font-semibold gap-1">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Semua ({insights.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('action')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterType === 'action'
                ? 'bg-white text-amber-700 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Perlu Tindakan ({insights.filter(i => i.type === 'action' || i.type === 'warning').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('info')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterType === 'info'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Info ({insights.filter(i => i.type === 'info' || i.type === 'success').length})
          </button>
        </div>
      </div>

      {/* Insight Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-3">
        {filtered.map(item => (
          <div
            key={item.id}
            className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
              item.type === 'action'
                ? 'bg-rose-50/40 border-rose-200/80 hover:border-rose-300'
                : item.type === 'warning'
                ? 'bg-amber-50/40 border-amber-200/80 hover:border-amber-300'
                : item.type === 'success'
                ? 'bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300'
                : 'bg-blue-50/40 border-blue-200/80 hover:border-blue-300'
            }`}
          >
            <div>
              <div className="flex items-start gap-2 mb-1.5">
                {item.type === 'action' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                {item.type === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}
                <h4 className="font-bold text-slate-900 text-xs leading-snug">{item.title}</h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>

            {item.actionText && item.onAction && (
              <div className="mt-3 pt-2 border-t border-slate-200/50 flex justify-end">
                <button
                  type="button"
                  onClick={item.onAction}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 hover:text-blue-700 transition-colors"
                >
                  <span>{item.actionText}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
