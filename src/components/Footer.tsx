import React from 'react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#0a0a0e] border-t border-[#241014] text-white py-12 mt-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Branding & Clinical Mandate */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-[#7a0011] flex items-center justify-center text-white border border-[#ff4d61]/40 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">emergency</span>
              </div>
              <span className="font-headline text-base font-bold text-white">BloodConnect India</span>
            </div>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Nationwide real-time emergency blood coordination platform integrating NBTC and NACO-certified blood centers, verified volunteer donors, and tertiary trauma facilities under strict privacy encryption standards.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono pt-1">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>End-to-End HIPAA/DISHA Compliant Clinical Data Architecture</span>
            </div>
          </div>

          {/* Col 3: Clinical Operations */}
          <div>
            <h4 className="font-headline text-sm font-bold text-white mb-3">Clinical Operations</h4>
            <ul className="flex flex-col gap-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => onNavigate('live-explorer')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Blood Availability Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('request-blood')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Emergency Crossmatch Request
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('donate-blood')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Voluntary Donor Registration
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hospital-network')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Authorized Blood Banks Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Compatibility Reference Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Compliance & Legal */}
          <div>
            <h4 className="font-headline text-sm font-bold text-white mb-3">Compliance & Legal</h4>
            <ul className="flex flex-col gap-2 text-xs text-gray-400">
              <li>
                <a href="#nbtc-policy" className="hover:text-red-400 transition-colors">
                  NBTC Guidelines 2024
                </a>
              </li>
              <li>
                <a href="#naco-safety" className="hover:text-red-400 transition-colors">
                  NACO Blood Safety Standard
                </a>
              </li>
              <li>
                <a href="#donor-charter" className="hover:text-red-400 transition-colors">
                  Donor Anonymity Charter
                </a>
              </li>
              <li>
                <a href="#reciprocal" className="hover:text-red-400 transition-colors">
                  Reciprocal Consent Protocol
                </a>
              </li>
              <li>
                <a href="#audit-log" className="hover:text-red-400 transition-colors">
                  Clinical Audit & Transfusion Log
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Emergency Helplines */}
          <div>
            <h4 className="font-headline text-sm font-bold text-white mb-3">Emergency Helplines</h4>
            <div className="flex flex-col gap-2.5">
              <div className="p-3 bg-[#14151c] border border-[#3b1218] rounded-xl shadow-inner">
                <span className="text-[11px] font-mono text-gray-400 block">National Blood Emergency</span>
                <a
                  href="tel:104"
                  className="font-headline text-lg text-red-400 font-bold block hover:underline"
                >
                  104 / 1910
                </a>
                <span className="text-[11px] text-gray-400 block">24x7 Multi-lingual Dispatch</span>
              </div>
              <div className="p-3 bg-[#14151c] border border-white/5 rounded-xl shadow-inner">
                <span className="text-[11px] font-mono text-gray-400 block">Clinical Grievance Cell</span>
                <span className="font-headline text-xs text-white font-bold block">1800-11-2334</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metadata & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-gray-500 text-xs border-t border-[#1f202b]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>256-bit SHA Encrypted</span>
            </span>
            <span>Ministry of Health & Family Welfare Integration</span>
          </div>
          <div>© 2025 BloodConnect India. Authorized Clinical Public Infrastructure.</div>
        </div>
      </div>
    </footer>
  );
};
