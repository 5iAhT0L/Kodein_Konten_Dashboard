'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import {
  ContentItem,
  CONTENT_CHANNELS,
  ContentChannel,
  ProductionStatus,
  PublicationStatus
} from '@/lib/types';
import { contentItemSchema } from '@/lib/validations';

interface ContentItemModalProps {
  isOpen: boolean;
  initialData: ContentItem | null;
  defaultDay: string;
  onClose: () => void;
  onSave: (item: ContentItem) => void;
}

export const ContentItemModal: React.FC<ContentItemModalProps> = ({
  isOpen,
  initialData,
  defaultDay,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<ContentItem>({
    name: '',
    day: defaultDay,
    format: '',
    stage: '',
    production: 'Direncanakan',
    publish: '',
    publication: 'Belum tayang',
    channels: [],
    link: '',
    note: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        day: defaultDay,
        format: '',
        stage: '',
        production: 'Direncanakan',
        publish: '',
        publication: 'Belum tayang',
        channels: [],
        link: '',
        note: ''
      });
    }
    setErrorMessage('');
  }, [initialData, defaultDay, isOpen]);

  if (!isOpen) return null;

  const handleChannelToggle = (channel: ContentChannel) => {
    setFormData(prev => {
      const exists = prev.channels.includes(channel);
      return {
        ...prev,
        channels: exists ? prev.channels.filter(c => c !== channel) : [...prev.channels, channel]
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Business check: Tayang or Internal must be Selesai
    if (['Tayang', 'Internal'].includes(formData.publication) && formData.production !== 'Selesai') {
      setErrorMessage('Konten dengan status "Tayang" atau "Internal" harus berstatus produksi "Selesai".');
      return;
    }

    if (['Tayang', 'Terjadwal'].includes(formData.publication)) {
      if (!formData.publish) {
        setErrorMessage('Konten "Tayang" atau "Terjadwal" wajib memiliki tanggal tayang.');
        return;
      }
      const hasSocial = formData.channels.some(c => c !== 'TV internal');
      if (!hasSocial) {
        setErrorMessage('Konten Tayang/Terjadwal harus memilih minimal 1 platform media sosial.');
        return;
      }
    }

    if (formData.publish && formData.publish < formData.day) {
      setErrorMessage('Tanggal tayang tidak boleh mendahului tanggal aktivitas.');
      return;
    }

    const val = contentItemSchema.safeParse(formData);
    if (!val.success) {
      setErrorMessage(val.error.issues[0]?.message || 'Input tidak valid.');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {initialData ? 'Ubah Konten' : 'Tambah Konten Baru'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Isi rincian produksi dan platform publikasi konten
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Nama Konten */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Nama / Kode Konten <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: PENA-001 — PENA EDU atau AG-017"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Tanggal Aktivitas */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Tanggal Aktivitas <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.day}
                onChange={e => setFormData({ ...formData, day: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Jenis / Format */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Jenis / Format</label>
              <input
                type="text"
                value={formData.format}
                onChange={e => setFormData({ ...formData, format: e.target.value })}
                placeholder="Contoh: Edukasi / Reels, Testimoni"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Tahap / Output */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tahap / Output Produksi</label>
            <input
              type="text"
              value={formData.stage}
              onChange={e => setFormData({ ...formData, stage: e.target.value })}
              placeholder="Contoh: Script + Take video + VO + editing / finish"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Status Produksi */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Status Produksi</label>
              <select
                value={formData.production}
                onChange={e =>
                  setFormData({ ...formData, production: e.target.value as ProductionStatus })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Direncanakan">Direncanakan</option>
                <option value="Dalam proses">Dalam proses</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>

            {/* Status Tayang */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Status Publikasi</label>
              <select
                value={formData.publication}
                onChange={e =>
                  setFormData({ ...formData, publication: e.target.value as PublicationStatus })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Belum tayang">Belum tayang</option>
                <option value="Terjadwal">Terjadwal</option>
                <option value="Tayang">Tayang</option>
                <option value="Internal">Internal Only</option>
              </select>
            </div>

            {/* Tanggal Tayang */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tanggal Tayang</label>
              <input
                type="date"
                value={formData.publish}
                onChange={e => setFormData({ ...formData, publish: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Platform Distribusi */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">
              Platform Publikasi
            </label>
            <div className="flex flex-wrap gap-2">
              {CONTENT_CHANNELS.map(ch => {
                const checked = formData.channels.includes(ch);
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => handleChannelToggle(ch)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      checked
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Link Bukti */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tautan Bukti / Evidence</label>
            <input
              type="url"
              value={formData.link}
              onChange={e => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://instagram.com/p/... atau link video drive"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Catatan / Kendala */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Catatan / Kendala</label>
            <textarea
              rows={2}
              value={formData.note}
              onChange={e => setFormData({ ...formData, note: e.target.value })}
              placeholder="Contoh: Jadwal take video diundur karena meeting, atau wifi lambat..."
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
              Simpan Entri
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
