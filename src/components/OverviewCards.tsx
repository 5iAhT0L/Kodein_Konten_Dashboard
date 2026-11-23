'use client';

import React from 'react';
import { CheckCircle2, TrendingUp, BarChart3, Megaphone, ArrowUpRight } from 'lucide-react';
import { DashboardOverviewCards } from '@/lib/types';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { ShinyBadge } from '@/components/ui/ShinyBadge';
import { formatNumber, formatPercent, formatRupiah } from '@/lib/calculations';

interface OverviewCardsProps {
  cards: DashboardOverviewCards;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ cards }) => {
  const isErAchieved = cards.overallEr !== null && cards.overallEr >= cards.targetEr;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Produksi Konten */}
      <SpotlightCard
        spotlightColor="rgba(37, 99, 235, 0.12)"
        className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group"
      >
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Produksi Konten
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              <AnimatedNumber value={cards.productionFinished} />
            </span>
            <span className="text-xs text-slate-500 font-semibold">konten selesai</span>
          </div>

          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {cards.productionPending > 0
              ? `${cards.productionPending} masih dalam proses / rencana`
              : 'Semua rencana telah rampung'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Total dicatat: {cards.productionFinished + cards.productionPending} entri</span>
          <span className="text-blue-600 font-semibold text-[11px] flex items-center gap-0.5">
            Log Konten &rarr;
          </span>
        </div>
      </SpotlightCard>

      {/* 2. Publikasi vs Target */}
      <SpotlightCard
        spotlightColor="rgba(16, 185, 129, 0.12)"
        className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
      >
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Publikasi Konten
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              <AnimatedNumber value={cards.publicationCount} />
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              / {cards.targetContent} target tayang
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                (cards.contentAchievementPct ?? 0) >= 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-500'
              }`}
              style={{ width: `${Math.min(cards.contentAchievementPct ?? 0, 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Capaian Tayang:</span>
          <span
            className={`font-bold ${
              (cards.contentAchievementPct ?? 0) >= 100 ? 'text-emerald-600' : 'text-blue-600'
            }`}
          >
            <AnimatedNumber
              value={cards.contentAchievementPct}
              decimals={1}
              suffix="%"
              fallback="0%"
            />
          </span>
        </div>
      </SpotlightCard>

      {/* 3. Engagement Rate Bulanan (Weighted) */}
      <SpotlightCard
        spotlightColor="rgba(99, 102, 241, 0.12)"
        className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
      >
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Engagement Rate (ER)
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              {cards.overallEr !== null ? (
                <AnimatedNumber value={cards.overallEr} decimals={2} suffix="%" />
              ) : (
                '—'
              )}
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              (Target: {formatPercent(cards.targetEr)})
            </span>
          </div>

          <div className="mt-2.5">
            <ShinyBadge
              variant={
                cards.overallEr === null
                  ? 'blue'
                  : isErAchieved
                  ? 'emerald'
                  : 'amber'
              }
            >
              {cards.erStatus}
            </ShinyBadge>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Weighted lintas platform</span>
          <span className="text-indigo-600 font-semibold text-[11px]">Audit &rarr;</span>
        </div>
      </SpotlightCard>

      {/* 4. Leads Ads (PMB) */}
      <SpotlightCard
        spotlightColor="rgba(168, 85, 247, 0.12)"
        className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between group"
      >
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Leads Ads (PMB)
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              {cards.totalLeads !== null ? (
                <AnimatedNumber value={cards.totalLeads} />
              ) : (
                '—'
              )}
            </span>
            <span className="text-xs text-slate-500 font-semibold">leads terdata</span>
          </div>

          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Belanja: {formatRupiah(cards.totalAdSpend)}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Biaya / Lead:</span>
          <span className="font-bold text-slate-800">
            {formatRupiah(cards.costPerLead)}
          </span>
        </div>
      </SpotlightCard>
    </div>
  );
};
