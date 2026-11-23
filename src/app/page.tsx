'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from '@/components/Header';
import { OverviewCards } from '@/components/OverviewCards';
import { UnifiedWeeklyView } from '@/components/UnifiedWeeklyView';
import { EngagementView } from '@/components/EngagementView';
import { ContentLogView } from '@/components/ContentLogView';
import { LeadsAdsView } from '@/components/LeadsAdsView';
import { ContentItemModal } from '@/components/modals/ContentItemModal';
import { EngagementModal } from '@/components/modals/EngagementModal';
import { AdCampaignModal } from '@/components/modals/AdCampaignModal';
import { WeekSummaryModal } from '@/components/modals/WeekSummaryModal';
import { WeeklyDrilldownModal } from '@/components/modals/WeeklyDrilldownModal';
import { TargetErModal } from '@/components/modals/TargetErModal';
import { IntegrationModal } from '@/components/integrations/IntegrationModal';
import { PrintReport } from '@/components/PrintReport';
import { ToastProvider, useToast } from '@/components/ui/Toast';

import {
  MonthlyReportData,
  ContentItem,
  PlatformEngagementTuple,
  AdCampaignItem,
  WeekItem
} from '@/lib/types';
import {
  createBlankReport,
  calculateOverviewCards,
  calculateUnifiedWeeklySummaries
} from '@/lib/calculations';
import { SAMPLE_SEPTEMBER_2026 } from '@/lib/sample-data';
import { exportReportToCsv } from '@/lib/csv-export';
import { Layers, BarChart2, FileText, Megaphone } from 'lucide-react';

function DashboardContent() {
  const { showToast, confirm } = useToast();

  const [report, setReport] = useState<MonthlyReportData>(() =>
    createBlankReport('2026-09', 'Harnoto')
  );
  const [activeTab, setActiveTab] = useState<'weekly' | 'engagement' | 'items' | 'ads'>('weekly');
  const [archiveMonths, setArchiveMonths] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info' | '';
  }>({ text: '', type: '' });
  const [isSampleMode, setIsSampleMode] = useState<boolean>(false);
  const [priorReport, setPriorReport] = useState<MonthlyReportData | null>(null);

  // Modals state
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [editingContentIndex, setEditingContentIndex] = useState<number | null>(null);

  const [engagementModalOpen, setEngagementModalOpen] = useState(false);
  const [editingPlatformIndex, setEditingPlatformIndex] = useState<number>(-1);

  const [adModalOpen, setAdModalOpen] = useState(false);
  const [editingAdIndex, setEditingAdIndex] = useState<number | null>(null);

  const [weekModalOpen, setWeekModalOpen] = useState(false);
  const [editingWeekIndex, setEditingWeekIndex] = useState<number>(-1);

  const [drilldownModalOpen, setDrilldownModalOpen] = useState(false);
  const [drilldownWeekIndex, setDrilldownWeekIndex] = useState<number>(-1);

  const [targetErModalOpen, setTargetErModalOpen] = useState(false);
  const [integrationModalOpen, setIntegrationModalOpen] = useState(false);

  // Fetch archives list
  const loadArchives = useCallback(async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const months = await res.json();
        setArchiveMonths(months);
      }
    } catch (err) {
      console.warn('Failed to fetch archive months:', err);
    }
  }, []);

  // Load report for a given month
  const loadMonthReport = useCallback(
    async (targetMonth: string) => {
      if (isDirty) {
        const ok = await confirm({
          title: 'Konfirmasi Pindah Periode',
          message: 'Terdapat perubahan yang belum disimpan. Yakin ingin berpindah periode tanpa menyimpan?',
          confirmText: 'Pindah Periode',
          cancelText: 'Tetap di Sini',
          variant: 'warning'
        });
        if (!ok) return;
      }

      try {
        const res = await fetch(`/api/reports?month=${encodeURIComponent(targetMonth)}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setReport(data);
            setIsDirty(false);
            setIsSampleMode(false);
            showToast('info', 'Laporan Dimuat', `Laporan periode ${targetMonth} berhasil dimuat.`);
            return;
          }
        }
        // Fallback to blank report
        setReport(createBlankReport(targetMonth, report.pic));
        setIsDirty(false);
        setIsSampleMode(false);
        showToast('info', 'Laporan Baru', `Memulai laporan baru untuk periode ${targetMonth}.`);
      } catch (err) {
        console.error('Error loading report:', err);
        setReport(createBlankReport(targetMonth, report.pic));
      }
    },
    [isDirty, report.pic, confirm, showToast]
  );

  // Initial mount
  useEffect(() => {
    loadArchives();
    fetch('/api/reports?month=2026-09')
      .then(r => r.json())
      .then(data => {
        if (data) {
          setReport(data);
        }
      })
      .catch(() => {});
  }, [loadArchives]);

  // Calculations
  const overviewCards = useMemo(() => calculateOverviewCards(report), [report]);
  const weeklySummaries = useMemo(() => calculateUnifiedWeeklySummaries(report), [report]);

  // Handlers for global controls
  const handleMonthChange = (newMonth: string) => {
    if (!newMonth || newMonth === report.month) return;
    loadMonthReport(newMonth);
  };

  const handlePicChange = (newPic: string) => {
    setReport(prev => ({ ...prev, pic: newPic }));
    setIsDirty(true);
  };

  const handleSelectArchive = (month: string) => {
    if (!month) return;
    loadMonthReport(month);
  };

  const handleToggleSample = () => {
    if (isSampleMode) {
      if (priorReport) {
        setReport(priorReport);
      } else {
        loadMonthReport('2026-09');
      }
      setIsSampleMode(false);
      setIsDirty(false);
      showToast('info', 'Keluar Contoh', 'Kembali ke sesi laporan Anda.');
    } else {
      setPriorReport(report);
      setReport(SAMPLE_SEPTEMBER_2026);
      setIsSampleMode(true);
      setIsDirty(false);
      showToast('info', 'Mode Contoh Aktif', 'Menampilkan data aktual September 2026 PIC Harnoto.');
    }
  };

  const handleSaveReport = async () => {
    if (isSampleMode) {
      showToast('warning', 'Mode Contoh', 'Perubahan pada contoh laporan tidak disimpan ke database.');
      return;
    }
    if (!report.pic.trim()) {
      showToast('error', 'Validasi Gagal', 'Nama PIC wajib diisi sebelum menyimpan laporan.');
      return;
    }

    setIsSaving(true);
    setSaveMessage({ text: 'Sedang menyimpan...', type: 'info' });

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan laporan.');
      }
      setReport(data);
      setIsDirty(false);
      showToast('success', 'Tersimpan', `Laporan periode ${report.month} berhasil disimpan.`);
      loadArchives();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kegagalan jaringan.';
      showToast('error', 'Gagal Simpan', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportCsv = () => {
    exportReportToCsv(report);
    showToast('success', 'Ekspor Selesai', `File CSV KODEIN-${report.month} berhasil diunduh.`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Content Handlers
  const handleOpenAddContent = () => {
    setEditingContentIndex(null);
    setContentModalOpen(true);
  };

  const handleOpenEditContent = (index: number) => {
    setEditingContentIndex(index);
    setContentModalOpen(true);
  };

  const handleSaveContentItem = (item: ContentItem) => {
    setReport(prev => {
      const items = [...prev.items];
      if (editingContentIndex !== null && editingContentIndex >= 0) {
        items[editingContentIndex] = item;
      } else {
        items.push(item);
      }
      return { ...prev, items };
    });
    setIsDirty(true);
    showToast('success', 'Konten Disimpan', `Entri "${item.name}" berhasil dicatat.`);
  };

  const handleDeleteContentItem = async (index: number) => {
    const item = report.items[index];
    const ok = await confirm({
      title: 'Hapus Entri Konten',
      message: `Apakah Anda yakin ingin menghapus konten "${item?.name}" dari laporan?`,
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      variant: 'danger'
    });

    if (ok) {
      setReport(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
      setIsDirty(true);
      showToast('info', 'Konten Dihapus', `Konten "${item?.name}" telah dihapus.`);
    }
  };

  // Engagement Handlers
  const handleOpenEditPlatform = (index: number) => {
    setEditingPlatformIndex(index);
    setEngagementModalOpen(true);
  };

  const handleSavePlatformEngagement = (index: number, tuple: PlatformEngagementTuple) => {
    setReport(prev => {
      const engagement = [...prev.engagement] as PlatformEngagementTuple[];
      engagement[index] = tuple;
      return { ...prev, engagement };
    });
    setIsDirty(true);
    showToast('success', 'Engagement Diperbarui', 'Data metrik platform berhasil disimpan.');
  };

  const handleSaveTargetEr = (newTarget: number) => {
    setReport(prev => ({ ...prev, target: newTarget }));
    setIsDirty(true);
    showToast('success', 'Target Diperbarui', `Target ER bulanan ditetapkan menjadi ${newTarget}%.`);
  };

  // Ad Handlers
  const handleOpenAddCampaign = () => {
    setEditingAdIndex(null);
    setAdModalOpen(true);
  };

  const handleOpenEditCampaign = (index: number) => {
    setEditingAdIndex(index);
    setAdModalOpen(true);
  };

  const handleSaveCampaign = (campaign: AdCampaignItem) => {
    setReport(prev => {
      const ads = [...prev.ads];
      if (editingAdIndex !== null && editingAdIndex >= 0) {
        ads[editingAdIndex] = campaign;
      } else {
        ads.push(campaign);
      }
      return { ...prev, ads };
    });
    setIsDirty(true);
    showToast('success', 'Campaign Disimpan', `Campaign "${campaign.name}" berhasil dicatat.`);
  };

  const handleDeleteCampaign = async (index: number) => {
    const camp = report.ads[index];
    const ok = await confirm({
      title: 'Hapus Campaign Iklan',
      message: `Apakah Anda yakin ingin menghapus campaign "${camp?.name}"?`,
      confirmText: 'Hapus Campaign',
      cancelText: 'Batal',
      variant: 'danger'
    });

    if (ok) {
      setReport(prev => ({
        ...prev,
        ads: prev.ads.filter((_, i) => i !== index)
      }));
      setIsDirty(true);
      showToast('info', 'Campaign Dihapus', `Campaign "${camp?.name}" telah dihapus.`);
    }
  };

  // Week Handlers
  const handleOpenEditWeekSummary = (index: number) => {
    setEditingWeekIndex(index);
    setWeekModalOpen(true);
  };

  const handleSaveWeekSummary = (index: number, week: WeekItem) => {
    setReport(prev => {
      const weeks = [...prev.weeks];
      weeks[index] = week;
      return { ...prev, weeks };
    });
    setIsDirty(true);
    showToast('success', 'Rekap Pekan Disimpan', `Pekan ${index + 1} berhasil diperbarui.`);
  };

  const handleOpenDrilldown = (index: number) => {
    setDrilldownWeekIndex(index);
    setDrilldownModalOpen(true);
  };

  const handleAddWeek = () => {
    setReport(prev => {
      const lastWeek = prev.weeks[prev.weeks.length - 1];
      let start = `${prev.month}-28`;
      let end = `${prev.month}-30`;
      if (lastWeek) {
        const nextDay = new Date(Date.parse(lastWeek.end) + 86400000);
        start = nextDay.toISOString().slice(0, 10);
        const endDay = new Date(nextDay.getTime() + 6 * 86400000);
        end = endDay.toISOString().slice(0, 10);
      }
      const newWeek: WeekItem = {
        start,
        end,
        target: 5,
        status: 'Belum mulai',
        issue: '',
        action: '',
        note: '',
        link: ''
      };
      return {
        ...prev,
        weeks: [...prev.weeks, newWeek]
      };
    });
    setIsDirty(true);
    showToast('success', 'Pekan Ditambahkan', `Pekan ${report.weeks.length + 1} baru berhasil dibuat.`);
  };

  const handleSyncComplete = async () => {
    // Reload report data from server
    try {
      const res = await fetch(`/api/reports?month=${encodeURIComponent(report.month)}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setReport(data);
          setIsDirty(false);
        }
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      {/* Top Application Header */}
      <Header
        month={report.month}
        pic={report.pic}
        archiveMonths={archiveMonths}
        isDirty={isDirty}
        isSaving={isSaving}
        saveMessage={saveMessage}
        isSampleMode={isSampleMode}
        onMonthChange={handleMonthChange}
        onPicChange={handlePicChange}
        onSelectArchive={handleSelectArchive}
        onToggleSample={handleToggleSample}
        onExportCsv={handleExportCsv}
        onPrint={handlePrint}
        onSave={handleSaveReport}
        onOpenIntegrations={() => setIntegrationModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 print:hidden">
        {/* Top Executive Overview Cards */}
        <OverviewCards cards={overviewCards} />

        {/* Tab Navigation (shadcn/ui Segmented Pill Control) */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 mb-6">
          <div className="inline-flex p-1 bg-slate-200/70 rounded-xl gap-1 overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab('weekly')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm transition-all whitespace-nowrap rounded-lg ${
                activeTab === 'weekly'
                  ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/50'
              }`}
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>A · KPI Pekanan Terpadu</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded-full font-bold">
                Utama
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('engagement')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm transition-all whitespace-nowrap rounded-lg ${
                activeTab === 'engagement'
                  ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/50'
              }`}
            >
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <span>B · Engagement Sosmed</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('items')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm transition-all whitespace-nowrap rounded-lg ${
                activeTab === 'items'
                  ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/50'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>C · Log Konten Harian</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-full font-semibold border border-slate-200">
                {report.items.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ads')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm transition-all whitespace-nowrap rounded-lg ${
                activeTab === 'ads'
                  ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/50'
              }`}
            >
              <Megaphone className="w-4 h-4 text-purple-600" />
              <span>D · Leads Ads</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-full font-semibold border border-slate-200">
                {report.ads.length}
              </span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>KODEIN Dashboard</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Auto-Synced
            </span>
          </div>
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'weekly' && (
          <UnifiedWeeklyView
            summaries={weeklySummaries}
            onOpenDrilldown={handleOpenDrilldown}
            onEditWeekSummary={handleOpenEditWeekSummary}
            onAddWeek={handleAddWeek}
          />
        )}

        {activeTab === 'engagement' && (
          <EngagementView
            engagement={report.engagement}
            targetEr={report.target}
            onEditPlatform={handleOpenEditPlatform}
            onEditTarget={() => setTargetErModalOpen(true)}
          />
        )}

        {activeTab === 'items' && (
          <ContentLogView
            items={report.items}
            weeks={report.weeks}
            onAddItem={handleOpenAddContent}
            onEditItem={handleOpenEditContent}
            onDeleteItem={handleDeleteContentItem}
          />
        )}

        {activeTab === 'ads' && (
          <LeadsAdsView
            ads={report.ads}
            onAddCampaign={handleOpenAddCampaign}
            onEditCampaign={handleOpenEditCampaign}
            onDeleteCampaign={handleDeleteCampaign}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white text-slate-400 text-xs text-center print:hidden">
        <p>
          KODEIN · Sekolah Developer Indonesia &mdash; Sistem Laporan Kerja Bulanan Branding & Marketing
        </p>
      </footer>

      {/* Modals */}
      <ContentItemModal
        isOpen={contentModalOpen}
        initialData={editingContentIndex !== null ? report.items[editingContentIndex] : null}
        defaultDay={report.weeks[0]?.start || `${report.month}-01`}
        onClose={() => setContentModalOpen(false)}
        onSave={handleSaveContentItem}
      />

      <EngagementModal
        isOpen={engagementModalOpen}
        platformIndex={editingPlatformIndex}
        initialData={report.engagement[editingPlatformIndex] || [null, null, null, null, null, null, null]}
        onClose={() => setEngagementModalOpen(false)}
        onSave={handleSavePlatformEngagement}
      />

      <AdCampaignModal
        isOpen={adModalOpen}
        initialData={editingAdIndex !== null ? report.ads[editingAdIndex] : null}
        onClose={() => setAdModalOpen(false)}
        onSave={handleSaveCampaign}
      />

      <WeekSummaryModal
        isOpen={weekModalOpen}
        weekIndex={editingWeekIndex}
        initialData={editingWeekIndex >= 0 ? report.weeks[editingWeekIndex] : null}
        onClose={() => setWeekModalOpen(false)}
        onSave={handleSaveWeekSummary}
      />

      <WeeklyDrilldownModal
        isOpen={drilldownModalOpen}
        summary={drilldownWeekIndex >= 0 ? weeklySummaries[drilldownWeekIndex] : null}
        onClose={() => setDrilldownModalOpen(false)}
      />

      <TargetErModal
        isOpen={targetErModalOpen}
        currentTarget={report.target}
        onClose={() => setTargetErModalOpen(false)}
        onSave={handleSaveTargetEr}
      />

      <IntegrationModal
        isOpen={integrationModalOpen}
        currentMonth={report.month}
        onClose={() => setIntegrationModalOpen(false)}
        onSyncComplete={handleSyncComplete}
      />

      {/* Dedicated Printout Layout (only visible during print) */}
      <PrintReport report={report} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}
