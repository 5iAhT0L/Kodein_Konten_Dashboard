'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { AdCampaignItem, ADS_PLATFORMS, AdsPlatform } from '@/lib/types';
import { adCampaignItemSchema } from '@/lib/validations';

interface AdCampaignModalProps {
  isOpen: boolean;
  initialData: AdCampaignItem | null;
  onClose: () => void;
  onSave: (campaign: AdCampaignItem) => void;
}

export const AdCampaignModal: React.FC<AdCampaignModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<AdCampaignItem>({
    platform: 'Meta Ads',
    name: '',
    budget: null,
    results: null,
    clicks: null,
    reach: null,
    impressions: null,
    spend: null,
    ctr: null
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        platform: 'Meta Ads',
        name: '',
        budget: null,
        results: null,
        clicks: null,
        reach: null,
        impressions: null,
        spend: null,
        ctr: null
      });
    }
    setErrorMessage('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleNumChange = (key: keyof AdCampaignItem, rawVal: string, isFloat = false) => {
    const trimmed = rawVal.trim();
    if (trimmed === '') {
      setFormData(prev => ({ ...prev, [key]: null }));
    } else {
      const parsed = isFloat ? parseFloat(trimmed) : parseInt(trimmed, 10);
      setFormData(prev => ({ ...prev, [key]: isNaN(parsed) ? null : parsed }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const val = adCampaignItemSchema.safeParse(formData);
    if (!val.success) {
      setErrorMessage(val.error.issues[0]?.message || 'Input campaign tidak valid.');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {initialData ? 'Ubah Campaign Ads' : 'Tambah Campaign Ads'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Masukkan metrik iklan dari dashboard pengelola iklan
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
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Platform */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Platform Iklan</label>
              <select
                value={formData.platform}
                onChange={e =>
                  setFormData({ ...formData, platform: e.target.value as AdsPlatform })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
              >
                {ADS_PLATFORMS.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Nama Campaign */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nama Campaign <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: PMB Gelombang 1 — Reels"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:bg-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Anggaran */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Anggaran (Rp)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.budget === null ? '' : formData.budget}
                onChange={e => handleNumChange('budget', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {/* Spend / Belanja */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Jumlah Dibelanjakan (Rp)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.spend === null ? '' : formData.spend}
                onChange={e => handleNumChange('spend', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:bg-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Hasil / Leads */}
            <div>
              <label className="font-semibold text-purple-800 block mb-1">
                Hasil / Leads Terdata
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.results === null ? '' : formData.results}
                onChange={e => handleNumChange('results', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-lg text-purple-900 font-bold focus:bg-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {/* Klik Tautan */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Klik Tautan</label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.clicks === null ? '' : formData.clicks}
                onChange={e => handleNumChange('clicks', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Jangkauan */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Jangkauan (Reach)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.reach === null ? '' : formData.reach}
                onChange={e => handleNumChange('reach', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {/* Impresi */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Impresi</label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.impressions === null ? '' : formData.impressions}
                onChange={e => handleNumChange('impressions', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {/* CTR % */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">CTR Semua (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.ctr === null ? '' : formData.ctr}
                onChange={e => handleNumChange('ctr', e.target.value, true)}
                placeholder="Contoh: 2.45"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </div>
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
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 font-semibold text-white shadow-sm transition-colors"
            >
              Simpan Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
