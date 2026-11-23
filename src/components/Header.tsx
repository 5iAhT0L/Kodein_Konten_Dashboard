'use client';

import React from 'react';
import { Calendar, User, FileSpreadsheet, Printer, Save, RefreshCw, CheckCircle2, AlertCircle, Radio } from 'lucide-react';
import { formatMonthIndo } from '@/lib/calculations';

interface HeaderProps {
  month: string;
  pic: string;
  archiveMonths: string[];
  isDirty: boolean;
  isSaving: boolean;
  saveMessage: { text: string; type: 'success' | 'error' | 'info' | '' };
  isSampleMode: boolean;
  onMonthChange: (month: string) => void;
  onPicChange: (pic: string) => void;
  onSelectArchive: (month: string) => void;
  onToggleSample: () => void;
  onExportCsv: () => void;
  onPrint: () => void;
  onSave: () => void;
  onOpenIntegrations: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  month,
  pic,
  archiveMonths,
  isDirty,
  isSaving,
  saveMessage,
  isSampleMode,
  onMonthChange,
  onPicChange,
  onSelectArchive,
  onToggleSample,
  onExportCsv,
  onPrint,
  onSave,
  onOpenIntegrations
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white font-extrabold tracking-tight text-lg">
            K
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">KODEIN</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-medium">
                Sekolah Developer
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Branding & Marketing · Laporan Kerja Bulanan
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center flex-wrap gap-2 text-sm">
          <button
            type="button"
            onClick={onOpenIntegrations}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-200 text-xs font-semibold transition-colors shadow-sm"
            title="Kelola sinkronisasi akun media sosial dan ads resmi"
          >
            <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Integrasi API</span>
          </button>

          <button
            type="button"
            onClick={onToggleSample}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isSampleMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isSampleMode ? '✕ Keluar Contoh' : 'Contoh September'}
          </button>

          <button
            type="button"
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            title="Unduh seluruh data ke file CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ekspor CSV</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            title="Cetak format formal atau simpan sebagai PDF"
          >
            <Printer className="w-3.5 h-3.5 text-sky-400" />
            <span>Cetak / PDF</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || isSampleMode}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              isSaving
                ? 'bg-blue-600/50 text-blue-200 cursor-wait'
                : isSampleMode
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : isDirty
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25 ring-2 ring-blue-400/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Laporan'}</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Periode, PIC, Arsip & Save Status */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Periode Month Input */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <label htmlFor="report-month" className="text-slate-400 font-medium">
                Periode:
              </label>
              <input
                id="report-month"
                type="month"
                value={month}
                onChange={e => onMonthChange(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1 text-slate-100 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* PIC Input */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <label htmlFor="report-pic" className="text-slate-400 font-medium">
                PIC:
              </label>
              <input
                id="report-pic"
                type="text"
                value={pic}
                placeholder="Nama Penanggung Jawab"
                onChange={e => onPicChange(e.target.value)}
                maxLength={100}
                className="bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1 text-slate-100 font-medium placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:outline-none w-44 sm:w-56"
              />
            </div>

            {/* Arsip Dropdown */}
            {archiveMonths.length > 0 && (
              <div className="flex items-center gap-2">
                <label htmlFor="report-archive" className="text-slate-400 font-medium">
                  Arsip:
                </label>
                <select
                  id="report-archive"
                  value={archiveMonths.includes(month) && !isSampleMode ? month : ''}
                  onChange={e => e.target.value && onSelectArchive(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-slate-300 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Pilih arsip bulan...</option>
                  {archiveMonths.map(m => (
                    <option key={m} value={m}>
                      {formatMonthIndo(m)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Status Message */}
          <div className="flex items-center gap-2">
            {saveMessage.text ? (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  saveMessage.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : saveMessage.type === 'error'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}
              >
                {saveMessage.type === 'success' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                <span>{saveMessage.text}</span>
              </div>
            ) : isDirty ? (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Ada perubahan belum disimpan</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Laporan sinkron</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
