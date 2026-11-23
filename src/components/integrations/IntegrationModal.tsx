'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ExternalLink,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { IntegrationConnectionState, SyncAuditEntry, ProviderId } from '@/lib/integrations/types';
import { useToast } from '@/components/ui/Toast';

interface IntegrationModalProps {
  isOpen: boolean;
  currentMonth: string;
  onClose: () => void;
  onSyncComplete: () => void;
}

export const IntegrationModal: React.FC<IntegrationModalProps> = ({
  isOpen,
  currentMonth,
  onClose,
  onSyncComplete
}) => {
  const { showToast } = useToast();
  const [connections, setConnections] = useState<IntegrationConnectionState[]>([]);
  const [auditLogs, setAuditLogs] = useState<SyncAuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/integrations');
      if (res.ok) {
        const data = await res.json();
        setConnections(data.connections || []);
        setAuditLogs(data.auditLogs || []);
      }
    } catch (err) {
      console.warn('Gagal memuat status integrasi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSyncOne = async (providerId: ProviderId) => {
    setSyncingProvider(providerId);
    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', providerId, month: currentMonth })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Sinkronisasi Berhasil', data.summary);
        fetchStatus();
        onSyncComplete();
      } else {
        showToast('error', 'Gagal Sinkronisasi', data.error || 'Terjadi kesalahan.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kesalahan jaringan.';
      showToast('error', 'Error Jaringan', msg);
    } finally {
      setSyncingProvider(null);
    }
  };

  const handleSyncAll = async () => {
    setSyncingProvider('all');
    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync_all', month: currentMonth })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Sinkronisasi Selesai', 'Seluruh provider media sosial & ads diperbarui.');
        fetchStatus();
        onSyncComplete();
      } else {
        showToast('error', 'Gagal Sinkronisasi Semua', data.error || 'Terjadi kesalahan.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kesalahan jaringan.';
      showToast('error', 'Error Jaringan', msg);
    } finally {
      setSyncingProvider(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Pengaturan Integrasi API Sosial &amp; Ads
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Koneksi server-side resmi KODEIN untuk Instagram, Facebook, YouTube, TikTok, dan Meta Ads
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={syncingProvider !== null}
              onClick={handleSyncAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${syncingProvider === 'all' ? 'animate-spin' : ''}`}
              />
              <span>Sinkronkan Semua</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {/* Security Notice */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-slate-600 leading-relaxed">
              <strong className="text-slate-900 font-semibold block">
                Arsitektur Server-Side Aman (Zero Client Token Leak)
              </strong>
              <p>
                Seluruh kunci API, Client Secret, dan token otorisasi disimpan secara aman di backend Node.js dan tidak pernah diekspos ke browser pengguna. Ketika kredensial live belum dimasukkan di <code>.env.local</code>, sistem menjalankan <strong>Sandbox Simulasi Realistis</strong> berlabel jelas.
              </p>
            </div>
          </div>

          {/* Provider Connections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections.map(conn => {
              const isSyncing = syncingProvider === conn.providerId || syncingProvider === 'all';
              const isConnected = conn.status === 'connected';
              const isSandbox = conn.status === 'sandbox';

              return (
                <div
                  key={conn.providerId}
                  className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-bold text-slate-900 text-sm">{conn.name}</h4>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                          isConnected
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isSandbox
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {isConnected ? 'Live Connected' : isSandbox ? 'Dev Sandbox' : 'Disconnected'}
                      </span>
                    </div>

                    <p className="text-slate-600 font-medium text-[11px] mb-2">{conn.targetAccount}</p>

                    <div className="text-[11px] text-slate-500 space-y-1 mb-3">
                      <div>
                        <strong>Dukungan: </strong>
                        <span className="text-slate-700">{conn.supportedMetrics.join(', ')}</span>
                      </div>
                      {conn.unsupportedMetrics.length > 0 && (
                        <div>
                          <strong className="text-slate-400">Batasan Provider: </strong>
                          <span className="text-slate-400">{conn.unsupportedMetrics.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {conn.lastSyncedAt
                        ? `Sinkron: ${new Date(conn.lastSyncedAt).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}`
                        : 'Belum pernah sinkron'}
                    </span>

                    <button
                      type="button"
                      disabled={isSyncing}
                      onClick={() => handleSyncOne(conn.providerId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
                      <span>{isSyncing ? 'Menarik...' : 'Tarik Data'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Audit Logs Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="bg-slate-50 p-3 border-b border-slate-200 font-bold text-slate-700 flex items-center justify-between">
              <span>Riwayat Audit Sinkronisasi Terbaru</span>
              <span className="text-[10px] text-slate-400 font-normal">
                {auditLogs.length} Aktivitas tercatat
              </span>
            </div>

            {auditLogs.length === 0 ? (
              <p className="p-4 text-center text-slate-400 italic">
                Belum ada riwayat aktivitas sinkronisasi.
              </p>
            ) : (
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 text-[11px]">
                {auditLogs.slice(0, 10).map(log => (
                  <div key={log.id} className="p-2.5 px-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {log.status === 'success' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      )}
                      <span className="font-semibold text-slate-800 uppercase text-[10px]">
                        {log.providerId}
                      </span>
                      <span className="text-slate-600">{log.message}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
