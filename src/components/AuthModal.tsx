import React, { useState } from 'react';
import { UserRole } from '../types/bloodConnect';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole, userName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'donor' | 'hospital' | 'admin'>('donor');
  const [mobileOrId, setMobileOrId] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      let role: UserRole = 'donor';
      let name = 'Vikramaditya Sharma';
      if (activeTab === 'hospital') {
        role = 'hospital';
        name = 'Dr. A. Mathur (Trauma Liaison)';
      } else if (activeTab === 'admin') {
        role = 'admin';
        name = 'Dr. A. Verma (Nodal Officer)';
      }
      onLoginSuccess(role, name);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#14151c] border border-[#3b1218] rounded-2xl shadow-2xl p-6 flex flex-col gap-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Brand header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-[#7a0011] flex items-center justify-center text-white border border-[#ff4d61]/40 shadow-sm">
            <span className="material-symbols-outlined text-[22px]">emergency</span>
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold text-white">BloodConnect Clinical Auth</h3>
            <p className="text-xs text-slate-400">NACO & MoHFW Clinical Gateway</p>
          </div>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#0b0c10] border border-[#2b171c] rounded-xl text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setActiveTab('donor');
              setOtpSent(false);
            }}
            className={`py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'donor'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Donor
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('hospital');
              setOtpSent(false);
            }}
            className={`py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'hospital'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hospital
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setOtpSent(false);
            }}
            className={`py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Form */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                {activeTab === 'donor'
                  ? 'Aadhaar Registered Mobile / Donor ID'
                  : activeTab === 'hospital'
                  ? 'NABH / Hospital License ID or Registered Mobile'
                  : 'Nodal Officer Gov.in Email / Security Key'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={mobileOrId}
                  onChange={(e) => setMobileOrId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0b0c10] border border-[#3b1218] rounded-xl text-white text-sm focus:outline-none focus:border-red-500 font-mono"
                  placeholder={
                    activeTab === 'donor'
                      ? '+91 98765 43210'
                      : activeTab === 'hospital'
                      ? 'AIIMS-TC-LOG-01'
                      : 'dr.verma@aiims.gov.in'
                  }
                />
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-emerald-400 text-[18px]">
                  verified
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Encrypted OTP dispatched via CDAC National SMS Gateway.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-mono text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  <span>Generating Secure Token...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Request 6-Digit OTP</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div className="p-3 bg-[#0d0e13] border border-emerald-900/40 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>OTP dispatched to {mobileOrId}. (Demo OTP: 409218)</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                Enter 6-Digit Authentication OTP
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="409218"
                className="w-full px-3.5 py-2.5 bg-[#0b0c10] border border-red-900/60 rounded-xl text-center text-white text-lg tracking-widest focus:outline-none focus:border-red-500 font-mono font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-mono text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">lock_open</span>
                  <span>Authenticate & Enter Portal</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-[11px] text-slate-500 text-center font-mono border-t border-[#2b171c] pt-3">
          DISHA 2024 & NBTC Security Standard Compliant
        </div>
      </div>
    </div>
  );
};
