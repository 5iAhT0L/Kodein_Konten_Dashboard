'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  PlusCircle,
  Search,
  Filter,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Clock,
  Calendar
} from 'lucide-react';
import { ContentItem, WeekItem } from '@/lib/types';

interface ContentLogViewProps {
  items: ContentItem[];
  weeks: WeekItem[];
  onAddItem: () => void;
  onEditItem: (index: number) => void;
  onDeleteItem: (index: number) => void;
}

const getChannelBadgeClass = (channel: string) => {
  switch (channel.toLowerCase()) {
    case 'instagram':
      return 'bg-pink-50 text-pink-700 border-pink-200/90';
    case 'facebook':
      return 'bg-blue-50 text-blue-700 border-blue-200/90';
    case 'tiktok':
      return 'bg-slate-900 text-white border-slate-700';
    case 'youtube':
      return 'bg-red-50 text-red-700 border-red-200/90';
    case 'whatsapp':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/90';
    case 'tv internal':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200/90';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const getProductionConfig = (status: string) => {
  switch (status) {
    case 'Selesai':
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        dot: 'bg-emerald-500',
        Icon: CheckCircle2
      };
    case 'Dalam proses':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
        dot: 'bg-amber-500',
        Icon: Clock
      };
    default: // Direncanakan
      return {
        badge: 'bg-slate-100 text-slate-600 border-slate-200',
        dot: 'bg-slate-400',
        Icon: Calendar
      };
  }
};

const getPublicationConfig = (status: string) => {
  switch (status) {
    case 'Tayang':
      return {
        badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
        dot: 'bg-blue-500'
      };
    case 'Terjadwal':
      return {
        badge: 'bg-purple-50 text-purple-700 border-purple-200/80',
        dot: 'bg-purple-500'
      };
    case 'Internal':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
        dot: 'bg-amber-500'
      };
    default: // Belum tayang
      return {
        badge: 'bg-slate-100 text-slate-600 border-slate-200',
        dot: 'bg-slate-400'
      };
  }
};

export const ContentLogView: React.FC<ContentLogViewProps> = ({
  items,
  weeks,
  onAddItem,
  onEditItem,
  onDeleteItem
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<string>('all');
  const [selectedPublicationFilter, setSelectedPublicationFilter] = useState<string>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute Week labels for each item
  const enrichedItems = useMemo(() => {
    return items.map((item, originalIndex) => {
      const weekIdx = weeks.findIndex(w => item.day >= w.start && item.day <= w.end);
      const weekLabel = weekIdx >= 0 ? `Pekan ${weekIdx + 1}` : 'Di luar pekan';
      return {
        ...item,
        originalIndex,
        weekIdx,
        weekLabel
      };
    });
  }, [items, weeks]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return enrichedItems.filter(item => {
      const matchSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.format.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.stage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.note.toLowerCase().includes(searchQuery.toLowerCase());

      const matchWeek =
        selectedWeekFilter === 'all' || item.weekIdx === parseInt(selectedWeekFilter, 10);

      const matchPublication =
        selectedPublicationFilter === 'all' || item.publication === selectedPublicationFilter;

      return matchSearch && matchWeek && matchPublication;
    });
  }, [enrichedItems, searchQuery, selectedWeekFilter, selectedPublicationFilter]);

  // Status counts for quick chips
  const counts = useMemo(() => {
    return {
      all: items.length,
      tayang: items.filter(i => i.publication === 'Tayang').length,
      terjadwal: items.filter(i => i.publication === 'Terjadwal').length,
      internal: items.filter(i => i.publication === 'Internal').length,
      belumTayang: items.filter(i => i.publication === 'Belum tayang').length
    };
  }, [items]);

  return (
    <div className="space-y-6">
      {/* Top Action & Stats Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Monitoring Produksi Konten Harian
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Pencatatan produksi satu entri per konten. Setiap status produksi dan tanggal tayang secara otomatis memperbarui rekap KPI mingguan.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddItem}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Tambah Konten Baru</span>
        </button>
      </div>

      {/* Filter & Search Toolbar (shadcn style) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-wrap items-center gap-3 text-xs">
        {/* Search Input with Clear Button & Shortcut Badge */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari konten, format, kendala... (tekan '/' untuk cari)"
            className="w-full pl-8 pr-14 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
              /
            </kbd>
          )}
        </div>

        {/* Filter Week */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedWeekFilter}
            onChange={e => setSelectedWeekFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">Semua Pekan</option>
            {weeks.map((_, i) => (
              <option key={i} value={i}>
                Pekan {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Publication */}
        <div>
          <select
            value={selectedPublicationFilter}
            onChange={e => setSelectedPublicationFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">Semua Status Publikasi</option>
            <option value="Tayang">Tayang</option>
            <option value="Terjadwal">Terjadwal</option>
            <option value="Belum tayang">Belum tayang</option>
            <option value="Internal">Internal Only</option>
          </select>
        </div>

        <span className="text-slate-400 text-xs ml-auto font-medium">
          Menampilkan <strong className="text-slate-700">{filteredItems.length}</strong> dari {items.length} konten
        </span>
      </div>

      {/* Quick Filter Status Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedPublicationFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedPublicationFilter === 'all'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Semua Konten ({counts.all})
        </button>
        <button
          type="button"
          onClick={() => setSelectedPublicationFilter('Tayang')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedPublicationFilter === 'Tayang'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Tayang ({counts.tayang})</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedPublicationFilter('Terjadwal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedPublicationFilter === 'Terjadwal'
              ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-purple-50 hover:text-purple-700'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          <span>Terjadwal ({counts.terjadwal})</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedPublicationFilter('Internal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedPublicationFilter === 'Internal'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Internal ({counts.internal})</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <p className="font-bold text-slate-800 text-sm">Tidak ada konten yang ditemukan</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian Anda atau reset filter pekan/status untuk menampilkan data.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedWeekFilter('all');
                setSelectedPublicationFilter('all');
              }}
              className="mt-4 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="sticky top-0 bg-slate-50/95 backdrop-blur-xs z-10 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3 w-12 text-center">No</th>
                    <th className="py-3 px-3 w-24 text-center">Pekan</th>
                    <th className="py-3 px-3 w-28">Tanggal</th>
                    <th className="py-3 px-4 min-w-[220px]">Nama / Kode Konten</th>
                    <th className="py-3 px-3 min-w-[160px]">Format &amp; Tahap</th>
                    <th className="py-3 px-3 text-center w-32">Produksi</th>
                    <th className="py-3 px-3 text-center w-36">Status Tayang</th>
                    <th className="py-3 px-3 min-w-[150px]">Platform</th>
                    <th className="py-3 px-3 text-center w-24">Bukti</th>
                    <th className="py-3 px-4 min-w-[180px] max-w-[260px]">Catatan / Kendala</th>
                    <th className="py-3 px-3 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item, idx) => {
                    const prodConfig = getProductionConfig(item.production);
                    const pubConfig = getPublicationConfig(item.publication);

                    return (
                      <tr
                        key={item.name + idx}
                        className="even:bg-slate-50/40 hover:bg-blue-50/40 transition-colors group"
                      >
                        <td className="py-3.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            {item.weekLabel}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap text-slate-600 font-mono text-xs tabular-nums font-medium">
                          {item.day}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block group-hover:text-blue-600 transition-colors text-xs leading-snug">
                            {item.name}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex flex-col gap-1 items-start">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80">
                              {item.format || '—'}
                            </span>
                            <span className="text-slate-500 text-[11px] leading-tight">
                              {item.stage}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${prodConfig.badge}`}
                          >
                            <prodConfig.Icon className="w-3 h-3 shrink-0" />
                            <span>{item.production}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${pubConfig.badge}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${pubConfig.dot}`} />
                            <span>{item.publication}</span>
                          </span>
                          {item.publish && (
                            <span className="text-[10px] text-slate-400 block mt-1 font-mono font-medium tabular-nums">
                              {item.publish}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap gap-1">
                            {item.channels.length > 0 ? (
                              item.channels.map(ch => (
                                <span
                                  key={ch}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shadow-2xs ${getChannelBadgeClass(ch)}`}
                                >
                                  {ch}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-300 text-xs">—</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/70 transition-all active:scale-95 shadow-2xs"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Buka</span>
                            </a>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.note ? (
                            <p className="line-clamp-2 leading-relaxed text-xs" title={item.note}>
                              {item.note}
                            </p>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => onEditItem(item.originalIndex)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ubah Konten"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteItem(item.originalIndex)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus Konten"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Summary Bar */}
            <div className="bg-slate-50/90 border-t border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium">
              <div>
                Menampilkan <strong className="text-slate-800">{filteredItems.length}</strong> dari {items.length} konten
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[11px]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Selesai: <strong className="text-slate-800">{counts.all - counts.internal}</strong></span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Tayang: <strong className="text-slate-800">{counts.tayang}</strong></span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Terjadwal: <strong className="text-slate-800">{counts.terjadwal}</strong></span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
