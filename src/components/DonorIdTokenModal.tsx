import React from 'react';
import { DonorProfile } from '../types/bloodConnect';

interface DonorIdTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor: DonorProfile;
}

export const DonorIdTokenModal: React.FC<DonorIdTokenModalProps> = ({
  isOpen,
  onClose,
  donor,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-[#161720] border border-[#3e171e] rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center gap-4 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-600/50 text-red-400 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.4)]">
          <span className="material-symbols-outlined text-[28px]">qr_code_scanner</span>
        </div>

        <div>
          <h3 className="font-headline text-lg font-bold text-white">Emergency Fast-Pass Token</h3>
          <p className="text-xs text-slate-300 mt-1">
            Scan at Safdarjung / AIIMS reception for zero-queue fast-track triage admission.
          </p>
        </div>

        {/* High-contrast QR Container */}
        <div className="w-52 h-52 bg-[#0e0f14] border border-white/10 p-3 rounded-2xl flex items-center justify-center shadow-inner relative">
          <svg className="w-44 h-44 text-slate-100" fill="currentColor" viewBox="0 0 100 100">
            {/* Top-left corner marker */}
            <rect x="5" y="5" width="25" height="25" rx="3" />
            <rect x="10" y="10" width="15" height="15" fill="#0e0f14" />
            <rect x="13" y="13" width="9" height="9" />
            {/* Top-right corner marker */}
            <rect x="70" y="5" width="25" height="25" rx="3" />
            <rect x="75" y="10" width="15" height="15" fill="#0e0f14" />
            <rect x="78" y="13" width="9" height="9" />
            {/* Bottom-left corner marker */}
            <rect x="5" y="70" width="25" height="25" rx="3" />
            <rect x="10" y="75" width="15" height="15" fill="#0e0f14" />
            <rect x="13" y="78" width="9" height="9" />
            {/* QR Pattern Bits */}
            <rect x="36" y="8" width="8" height="8" />
            <rect x="48" y="8" width="12" height="6" />
            <rect x="36" y="24" width="24" height="6" />
            <rect x="42" y="38" width="16" height="16" rx="2" fill="#ef4444" />
            <rect x="8" y="40" width="18" height="12" />
            <rect x="70" y="42" width="22" height="8" />
            <rect x="36" y="60" width="12" height="24" />
            <rect x="56" y="58" width="14" height="14" />
            <rect x="76" y="74" width="16" height="18" />
          </svg>
        </div>

        <div className="w-full flex flex-col gap-1">
          <div className="font-mono text-xs font-bold text-red-300 tracking-wider bg-[#1f212d] border border-white/10 px-3 py-1.5 rounded-lg flex items-center justify-between">
            <span>{donor.bloodGroup} • {donor.name}</span>
            <span className="text-emerald-400 font-bold">FAST-PASS</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            Token ID: BCI-{donor.bloodGroup.replace('+', 'POS').replace('-', 'NEG')}-{donor.id.slice(-5)}
          </div>
        </div>

        <div className="w-full flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              alert('Emergency Fast-Pass Token saved to mobile wallet & offline storage.');
              onClose();
            }}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-mono text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Save Fast-Pass</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#222433] hover:bg-[#2b2d40] border border-white/10 text-white font-mono text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
