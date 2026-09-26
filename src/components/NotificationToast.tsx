import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'critical' | 'success' | 'info';
  title: string;
  message: string;
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  toasts,
  onDismiss,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-xl shadow-2xl border flex items-start gap-3 backdrop-blur-md animate-in slide-in-from-bottom-3 duration-300 ${
            toast.type === 'critical'
              ? 'bg-[#29080e]/95 border-red-500/60 text-white'
              : toast.type === 'success'
              ? 'bg-[#092419]/95 border-emerald-500/60 text-white'
              : 'bg-[#14151c]/95 border-white/20 text-white'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] shrink-0 mt-0.5 ${
              toast.type === 'critical'
                ? 'text-red-400 animate-pulse'
                : toast.type === 'success'
                ? 'text-emerald-400'
                : 'text-sky-400'
            }`}
          >
            {toast.type === 'critical'
              ? 'crisis_alert'
              : toast.type === 'success'
              ? 'check_circle'
              : 'info'}
          </span>

          <div className="flex-1 flex flex-col">
            <h5 className="font-headline font-bold text-xs">{toast.title}</h5>
            <p className="text-[11px] text-slate-300 leading-snug mt-0.5">{toast.message}</p>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
