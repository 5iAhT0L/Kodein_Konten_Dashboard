'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { PlatformEngagementTuple, SOCIAL_PLATFORMS } from '@/lib/types';

interface EngagementModalProps {
  isOpen: boolean;
  platformIndex: number;
  initialData: PlatformEngagementTuple;
  onClose: () => void;
  onSave: (index: number, data: PlatformEngagementTuple) => void;
}

const METRIC_LABELS = [
  'Impresi Organik',
  'Impresi Iklan',
  'Like',
  'Comment',
  'Share',
  'Save',
  'Repost'
];

export const EngagementModal: React.FC<EngagementModalProps> = ({
  isOpen,
  platformIndex,
  initialData,
  onClose,
  onSave
}) => {
  const [values, setValues] = useState<PlatformEngagementTuple>([
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ]);

  useEffect(() => {
    if (initialData) {
      setValues([...initialData] as PlatformEngagementTuple);
    }
  }, [initialData, isOpen]);

  if (!isOpen || platformIndex < 0 || platformIndex >= SOCIAL_PLATFORMS.length) return null;

  const platformName = SOCIAL_PLATFORMS[platformIndex];

  const handleChange = (metricIdx: number, rawVal: string) => {
    const trimmed = rawVal.trim();
    const updated = [...values] as PlatformEngagementTuple;
    if (trimmed === '') {
      updated[metricIdx] = null;
    } else {
      const parsed = parseInt(trimmed, 10);
      updated[metricIdx] = isNaN(parsed) || parsed < 0 ? 0 : parsed;
    }
    setValues(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(platformIndex, values);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Ubah Data Engagement — {platformName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Isi <strong>0</strong> jika angka sudah diperiksa dan bernilai nol. Biarkan kosong jika data belum tersedia.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {METRIC_LABELS.map((label, idx) => {
              const currentVal = values[idx];
              return (
                <div key={label}>
                  <label className="font-semibold text-slate-700 block mb-1">{label}</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={currentVal === null ? '' : currentVal}
                    placeholder="Kosong = Belum ada data"
                    onChange={e => handleChange(idx, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              );
            })}
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
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-white shadow-sm transition-colors"
            >
              Terapkan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
