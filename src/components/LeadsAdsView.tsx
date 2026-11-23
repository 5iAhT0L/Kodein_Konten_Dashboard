'use client';

import React from 'react';
import { PlusCircle, Megaphone, Edit3, Trash2, TrendingUp, Info } from 'lucide-react';
import { AdCampaignItem } from '@/lib/types';
import { calculateAdCampaign, formatNumber, formatPercent, formatRupiah } from '@/lib/calculations';

interface LeadsAdsViewProps {
  ads: AdCampaignItem[];
  onAddCampaign: () => void;
  onEditCampaign: (index: number) => void;
  onDeleteCampaign: (index: number) => void;
}

export const LeadsAdsView: React.FC<LeadsAdsViewProps> = ({
  ads,
  onAddCampaign,
  onEditCampaign,
  onDeleteCampaign
}) => {
  const enrichedAds = ads.map(calculateAdCampaign);

  // Totals
  const totalBudget = enrichedAds.reduce((acc, a) => acc + (a.budget ?? 0), 0);
  const totalSpend = enrichedAds.reduce((acc, a) => acc + (a.spend ?? 0), 0);
  const totalResults = enrichedAds.reduce((acc, a) => acc + (a.results ?? 0), 0);
  const totalClicks = enrichedAds.reduce((acc, a) => acc + (a.clicks ?? 0), 0);
  const totalImpressions = enrichedAds.reduce((acc, a) => acc + (a.impressions ?? 0), 0);
  const totalReach = enrichedAds.reduce((acc, a) => acc + (a.reach ?? 0), 0);

  const avgCostPerResult = totalResults > 0 ? totalSpend / totalResults : null;
  const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : null;
  const avgCpm = totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : null;

  return (
    <div className="space-y-6">
      {/* Header Info & Add Button */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Monitoring Leads Ads (Pendukung KPI PMB)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Masukkan angka dari Ads Manager (Meta Ads, TikTok Ads, Google Ads). Biaya per hasil, CPC, dan CPM dihitung secara otomatis.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddCampaign}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg shadow transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Tambah Campaign</span>
        </button>
      </div>

      {/* Aggregate Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] text-slate-500 block">Total Belanja</span>
          <strong className="text-slate-900 text-sm font-bold block mt-0.5">
            {formatRupiah(totalSpend)}
          </strong>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] text-slate-500 block">Total Leads</span>
          <strong className="text-purple-700 text-sm font-bold block mt-0.5">
            {formatNumber(totalResults)}
          </strong>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] text-slate-500 block">Rata-rata Biaya/Lead</span>
          <strong className="text-slate-900 text-sm font-bold block mt-0.5">
            {formatRupiah(avgCostPerResult)}
          </strong>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] text-slate-500 block">Total Klik Tautan</span>
          <strong className="text-slate-900 text-sm font-bold block mt-0.5">
            {formatNumber(totalClicks)}
          </strong>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] text-slate-500 block">CPC Rata-rata</span>
          <strong className="text-slate-900 text-sm font-bold block mt-0.5">
            {formatRupiah(avgCpc)}
          </strong>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] text-slate-500 block">CPM Rata-rata</span>
          <strong className="text-slate-900 text-sm font-bold block mt-0.5">
            {formatRupiah(avgCpm)}
          </strong>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        {enrichedAds.length === 0 ? (
          <div className="text-center py-12 px-4 text-slate-500">
            <p className="font-semibold text-sm">Belum ada campaign iklan untuk periode ini.</p>
            <p className="text-xs text-slate-400 mt-1">
              Klik &ldquo;+ Tambah Campaign&rdquo; untuk mencatat performa iklan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Platform</th>
                  <th className="py-3 px-4 min-w-[200px]">Nama Campaign</th>
                  <th className="py-3 px-3 text-right">Anggaran</th>
                  <th className="py-3 px-3 text-right font-bold text-purple-700">Hasil (Leads)</th>
                  <th className="py-3 px-3 text-right">Biaya / Hasil</th>
                  <th className="py-3 px-3 text-right">Klik</th>
                  <th className="py-3 px-3 text-right">Jangkauan</th>
                  <th className="py-3 px-3 text-right">Impresi</th>
                  <th className="py-3 px-3 text-right font-semibold">Belanja</th>
                  <th className="py-3 px-3 text-right">CTR %</th>
                  <th className="py-3 px-3 text-right">CPC</th>
                  <th className="py-3 px-3 text-right">CPM</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrichedAds.map((ad, idx) => (
                  <tr key={ad.name + idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {ad.platform}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{ad.name}</td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-600">
                      {formatRupiah(ad.budget)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold text-purple-700">
                      {formatNumber(ad.results)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-semibold text-slate-800">
                      {formatRupiah(ad.costPerResult)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-600">
                      {formatNumber(ad.clicks)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-600">
                      {formatNumber(ad.reach)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-600">
                      {formatNumber(ad.impressions)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-900">
                      {formatRupiah(ad.spend)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-700">
                      {formatPercent(ad.ctr)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-700">
                      {formatRupiah(ad.cpc)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-700">
                      {formatRupiah(ad.cpm)}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEditCampaign(idx)}
                          className="p-1 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                          title="Ubah Campaign"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteCampaign(idx)}
                          className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Hapus Campaign"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Calculation footnote */}
        <div className="bg-slate-50/80 p-3.5 border-t border-slate-200/80 flex items-start gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <p>
            Biaya per Hasil = Belanja ÷ Hasil. CPC = Belanja ÷ Klik Tautan. CPM = (Belanja ÷ Impresi) × 1.000. Seluruh rasio dihitung ulang langsung dari data pembentuk.
          </p>
        </div>
      </div>
    </div>
  );
};
