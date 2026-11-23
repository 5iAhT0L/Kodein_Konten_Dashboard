'use client';

import React from 'react';
import { Edit3, Target, BarChart2, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PlatformEngagementTuple } from '@/lib/types';
import { calculateEngagementRows, formatNumber, formatPercent } from '@/lib/calculations';

interface EngagementViewProps {
  engagement: PlatformEngagementTuple[];
  targetEr: number;
  onEditPlatform: (index: number) => void;
  onEditTarget: () => void;
}

export const EngagementView: React.FC<EngagementViewProps> = ({
  engagement,
  targetEr,
  onEditPlatform,
  onEditTarget
}) => {
  const rows = calculateEngagementRows(engagement, targetEr);

  return (
    <div className="space-y-6">
      {/* Header Info & Target ER Button */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              KPI Engagement Media Sosial (Bulanan)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Diisi secara manual atau ditarik via API. Masukkan angka <strong>0</strong> jika metrik sudah diperiksa dan bernilai nol; biarkan kosong jika belum diperiksa.
          </p>
        </div>

        <button
          type="button"
          onClick={onEditTarget}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-lg transition-colors"
        >
          <Target className="w-4 h-4 text-indigo-600" />
          <span>Target ER: {formatPercent(targetEr)}</span>
        </button>
      </div>

      {/* Engagement Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-3 text-right">Organik</th>
                <th className="py-3 px-3 text-right">Iklan</th>
                <th className="py-3 px-3 text-right bg-slate-100/50">Total Impresi</th>
                <th className="py-3 px-2 text-right">Like</th>
                <th className="py-3 px-2 text-right">Comment</th>
                <th className="py-3 px-2 text-right">Share</th>
                <th className="py-3 px-2 text-right">Save</th>
                <th className="py-3 px-2 text-right">Repost</th>
                <th className="py-3 px-3 text-right bg-slate-100/50 font-bold">Total Interaksi</th>
                <th className="py-3 px-3 text-right font-bold text-indigo-700">ER %</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, idx) => {
                const isTotal = row.platform === 'TOTAL';
                return (
                  <tr
                    key={row.platform}
                    className={
                      isTotal
                        ? 'bg-slate-50/90 font-bold border-t-2 border-slate-300'
                        : 'hover:bg-slate-50/50 transition-colors'
                    }
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{row.platform}</span>
                        {!isTotal && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-normal">
                            Manual
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-700">
                      {formatNumber(row.organicImpressions)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-700">
                      {formatNumber(row.adsImpressions)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-semibold bg-slate-50/50 text-slate-900">
                      {formatNumber(row.totalImpressions)}
                    </td>
                    <td className="py-3 px-2 text-right tabular-nums text-slate-700">
                      {formatNumber(row.likes)}
                    </td>
                    <td className="py-3 px-2 text-right tabular-nums text-slate-700">
                      {formatNumber(row.comments)}
                    </td>
                    <td className="py-3 px-2 text-right tabular-nums text-slate-700">
                      {formatNumber(row.shares)}
                    </td>
                    <td className="py-3 px-2 text-right tabular-nums text-slate-700">
                      {formatNumber(row.saves)}
                    </td>
                    <td className="py-3 px-2 text-right tabular-nums text-slate-700">
                      {formatNumber(row.reposts)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-semibold bg-slate-50/50 text-slate-900">
                      {formatNumber(row.totalInteractions)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold text-indigo-700">
                      {formatPercent(row.engagementRate)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          row.status === 'Tercapai'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : row.status === 'Di bawah target'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : row.status === 'Tanpa impressions'
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {row.status === 'Tercapai' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : row.status === 'Di bawah target' ? (
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                        ) : null}
                        <span>{row.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {!isTotal && (
                        <button
                          type="button"
                          onClick={() => onEditPlatform(idx)}
                          className="px-2.5 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded font-medium transition-colors"
                        >
                          Ubah
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footnote / Explanation */}
        <div className="bg-slate-50/80 p-3.5 border-t border-slate-200/80 flex items-start gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <p>
            <strong>Rumus Weighted Engagement Rate:</strong> Total Interaksi seluruh platform (Like + Comment + Share + Save + Repost) dibagi Total Impresi seluruh platform (Organik + Iklan) dikalikan 100%. Sistem tidak memakai rata-rata sederhana dari persentase tiap platform agar angka representatif terhadap volume audiens.
          </p>
        </div>
      </div>
    </div>
  );
};
