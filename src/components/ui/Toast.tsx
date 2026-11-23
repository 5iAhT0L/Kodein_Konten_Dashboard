'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
  AlertCircle
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, default 4000
  createdAt: number;
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface ToastContextValue {
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ToastCard: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;
    const interval = 50;
    const step = (interval / toast.duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [toast.duration]);

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl transition-all transform animate-in slide-in-from-bottom-5 duration-200 p-4 ${
        toast.type === 'success'
          ? 'bg-slate-950/95 border-emerald-500/30 text-white shadow-emerald-950/20'
          : toast.type === 'error'
          ? 'bg-slate-950/95 border-rose-500/30 text-white shadow-rose-950/20'
          : toast.type === 'warning'
          ? 'bg-slate-950/95 border-amber-500/30 text-white shadow-amber-950/20'
          : 'bg-slate-950/95 border-blue-500/30 text-white shadow-blue-950/20'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <h4 className="font-bold text-xs tracking-tight text-white">{toast.title}</h4>
          {toast.message && (
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed font-normal">
              {toast.message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* React Bits countdown progress bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className={`h-full transition-all linear ${
              toast.type === 'success'
                ? 'bg-emerald-400'
                : toast.type === 'error'
                ? 'bg-rose-400'
                : toast.type === 'warning'
                ? 'bg-amber-400'
                : 'bg-blue-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<{
    options: ConfirmOptions;
    resolve: (val: boolean) => void;
  } | null>(null);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastItem = { id, type, title, message, duration, createdAt: Date.now() };

      setToasts(prev => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setConfirmState({ options, resolve });
    });
  }, []);

  const handleConfirmAction = (res: boolean) => {
    if (confirmState) {
      confirmState.resolve(res);
      setConfirmState(null);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, confirm }}>
      {children}

      {/* Floating Animated Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <ToastCard key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>

      {/* Sleek Animated Confirmation Dialog */}
      {confirmState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div
                className={`p-3.5 rounded-2xl shrink-0 ${
                  confirmState.options.variant === 'danger'
                    ? 'bg-rose-50 text-rose-600 border border-rose-100 ring-4 ring-rose-500/10'
                    : confirmState.options.variant === 'warning'
                    ? 'bg-amber-50 text-amber-600 border border-amber-100 ring-4 ring-amber-500/10'
                    : 'bg-blue-50 text-blue-600 border border-blue-100 ring-4 ring-blue-500/10'
                }`}
              >
                {confirmState.options.variant === 'danger' ? (
                  <XCircle className="w-6 h-6" />
                ) : confirmState.options.variant === 'warning' ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-base">
                  {confirmState.options.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
                  {confirmState.options.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleConfirmAction(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all hover:border-slate-300"
              >
                {confirmState.options.cancelText || 'Batal'}
              </button>

              <button
                type="button"
                onClick={() => handleConfirmAction(true)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all ${
                  confirmState.options.variant === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/25 active:scale-95'
                    : confirmState.options.variant === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/25 active:scale-95'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/25 active:scale-95'
                }`}
              >
                {confirmState.options.confirmText || 'Konfirmasi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
