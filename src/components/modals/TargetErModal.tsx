'use client';

import React, { useState, useEffect } from 'react';
import { X, Target } from 'lucide-react';

interface TargetErModalProps {
  isOpen: boolean;
  currentTarget: number;
  onClose: () => void;
  onSave: (newTarget: number) => void;
}

export const TargetErModal: React.FC<TargetErModalProps> = ({
  isOpen,
  currentTarget,
  onClose,
  onSave
}) => {
  const [targetVal, setTargetVal] = useState<number>(2.0);

  useEffect(() => {
    setTargetVal(currentTarget);
  }, [currentTarget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(targetVal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Target ER Bulanan</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-4 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Target Engagement Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              required
              value={targetVal}
              onChange={e => setTargetVal(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold text-base focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Standar KPI acuan KODEIN adalah <strong>≥ 2.0%</strong>.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold text-slate-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-white shadow-sm"
            >
              Simpan Target
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
