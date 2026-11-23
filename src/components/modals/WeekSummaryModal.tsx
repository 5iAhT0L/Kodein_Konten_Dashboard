'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { WeekItem, ReportStatus } from '@/lib/types';

interface WeekSummaryModalProps {
  isOpen: boolean;
  weekIndex: number;
  initialData: WeekItem | null;
  onClose: () => void;
  onSave: (weekIndex: number, week: WeekItem) => void;
}

export const WeekSummaryModal: React.FC<WeekSummaryModalProps> = ({
  isOpen,
  weekIndex,
  initialData,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<WeekItem>({
    start: '',
    end: '',
    target: 5,
    status: 'Belum mulai',
    issue: '',
    action: '',
    note: '',
    link: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData, isOpen]);

  if (!isOpen || !initialData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(weekIndex, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Edit Rekap Pekan {weekIndex + 1}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Perbarui target konten, kendala lapangan, dan tindakan korektif
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tanggal Mulai</label>
              <input
                type="date"
                required
                value={formData.start}
                onChange={e => setFormData({ ...formData, start: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tanggal Selesai</label>
              <input
                type="date"
                required
                value={formData.end}
                onChange={e => setFormData({ ...formData, end: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Konten</label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={formData.target}
                onChange={e => setFormData({ ...formData, target: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Status Laporan</label>
              <select
                value={formData.status}
                onChange={e =>
                  setFormData({ ...formData, status: e.target.value as ReportStatus })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Belum mulai">Belum mulai</option>
                <option value="Dalam proses">Dalam proses</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Kendala</label>
            <textarea
              rows={2}
              value={formData.issue}
              onChange={e => setFormData({ ...formData, issue: e.target.value })}
              placeholder="Contoh: 1 hari terdapat meeting eksternal sehingga produksi tertunda..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tindak Lanjut / Solusi</label>
            <textarea
              rows={2}
              value={formData.action}
              onChange={e => setFormData({ ...formData, action: e.target.value })}
              placeholder="Contoh: Dilanjutkan pada hari kerja berikutnya..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tautan Bukti / Evidence</label>
            <input
              type="url"
              value={formData.link}
              onChange={e => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Catatan Tambahan</label>
            <input
              type="text"
              value={formData.note}
              onChange={e => setFormData({ ...formData, note: e.target.value })}
              placeholder="Contoh: Realisasi 4/5 konten = 80%"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold text-slate-600 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-white shadow-sm transition-colors"
            >
              Simpan Rekap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
