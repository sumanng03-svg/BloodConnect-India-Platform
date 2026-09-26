import React, { useState, useEffect } from 'react';
import { UserRole } from '../types/bloodConnect';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenAuth: () => void;
  language: 'EN' | 'HI';
  onLanguageChange: (lang: 'EN' | 'HI') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  userRole,
  onRoleChange,
  onOpenAuth,
  language,
  onLanguageChange,
}) => {
  const [refreshTimer, setRefreshTimer] = useState(32);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTimer((prev) => (prev <= 1 ? 45 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { id: 'home', label: language === 'HI' ? 'होम' : 'Home' },
    {
      id: 'request-blood',
      label: language === 'HI' ? 'रक्त अनुरोध' : 'Request Blood',
      pulse: true,
    },
    { id: 'donate-blood', label: language === 'HI' ? 'रक्तदान करें' : 'Donate Blood' },
    {
      id: 'hospital-network',
      label: language === 'HI' ? 'अस्पताल नेटवर्क' : 'Hospital Network',
    },
    {
      id: 'live-explorer',
      label: language === 'HI' ? 'लाइव खोज' : 'Live Explorer',
    },
    {
      id: 'console',
      label: language === 'HI' ? 'कंसोल' : 'Console',
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d0e13]/95 backdrop-blur-md border-b border-[#2e1318] shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      {/* Top Emergency Response Ticker Bar */}
      <div className="bg-gradient-to-r from-[#2a060b] via-[#3a080f] to-[#1c0407] text-[#ffdad6] px-4 py-1.5 border-b border-[#4d161d]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping shrink-0" />
            <span className="font-bold uppercase tracking-wider text-red-400 text-[11px]">
              CRITICAL RESPONSE ACTIVE:
            </span>
            <span className="text-gray-300 hidden md:inline truncate">
              {language === 'HI'
                ? 'एनसीआर, मुंबई और बेंगलुरु क्षेत्रीय ट्रॉमा नोड्स के लिए देशव्यापी आपातकालीन रक्त आपूर्ति समन्वय प्रोटोकॉल सक्रिय है।'
                : 'Nationwide emergency blood supply coordination protocol active for NCR, Mumbai & Bengaluru regional trauma nodes.'}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:104"
              className="flex items-center gap-1 text-red-400 font-bold hover:text-red-300 transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">call</span>
              <span>Toll-Free: 104 / 1910</span>
            </a>
            <span className="text-[#5c242a]">|</span>
            <span className="text-gray-400 text-[11px] flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-emerald-400">autorenew</span>
              Live Grid: {refreshTimer}s
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="h-16 md:h-20 max-w-7xl mx-auto px-4 flex items-center justify-between gap-3">
        {/* Brand Logo & Verification Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-[#7a0011] flex items-center justify-center text-white shadow-[0_0_15px_rgba(230,25,55,0.4)] border border-[#ff4d61]/40 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">emergency</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-headline font-bold text-lg tracking-tight text-white">
                  BloodConnect
                </span>
                <span className="font-headline font-bold text-lg tracking-tight text-red-500">
                  India
                </span>
              </div>
              <p className="text-[11px] font-mono text-gray-400 leading-none">
                Blood that connects people when it matters.
              </p>
            </div>
          </button>

          <div className="hidden xl:flex items-center gap-1 px-2.5 py-1 bg-[#1a0f12] border border-[#3e1920] rounded-full text-emerald-400 text-xs font-mono">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span>Govt & Clinical Verified</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-1.5 text-xs transition-all rounded-lg flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#4a0e17] to-[#2a0910] text-white font-bold border border-red-700/60 shadow-[0_0_10px_rgba(230,25,55,0.2)]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5 font-medium'
                }`}
              >
                {link.pulse && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Lang, Role, Sign In, Emergency Request */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-[#15161c] border border-[#2e191d] rounded-lg text-xs font-mono text-gray-300">
            <button
              onClick={() => onLanguageChange('EN')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                language === 'EN' ? 'text-emerald-400 font-bold bg-[#032a1f]' : 'hover:text-white'
              }`}
            >
              EN
            </button>
            <span className="text-gray-600">/</span>
            <button
              onClick={() => onLanguageChange('HI')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                language === 'HI' ? 'text-emerald-400 font-bold bg-[#032a1f]' : 'hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="hidden 2xl:flex items-center gap-1.5 px-3 py-1 bg-[#181920] border border-[#2e191d] hover:border-red-900/60 rounded-full text-xs font-mono text-gray-300 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px] text-red-400">badge</span>
              <span className="text-gray-400">Role:</span>
              <span className="text-white font-bold capitalize">{userRole}</span>
              <span className="material-symbols-outlined text-[14px] text-gray-500">arrow_drop_down</span>
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#14151c] border border-[#3b1218] rounded-xl shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-gray-400 border-b border-[#2b161c]">
                  Select Portal Role
                </div>
                {(['requester', 'donor', 'hospital', 'admin'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role);
                      setRoleDropdownOpen(false);
                      if (role === 'admin' || role === 'hospital') onNavigate('console');
                      if (role === 'donor') onNavigate('donate-blood');
                      if (role === 'requester') onNavigate('request-blood');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      userRole === role
                        ? 'bg-red-950/80 text-white font-bold border-l-2 border-red-500'
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="capitalize">{role} Portal</span>
                    {userRole === role && (
                      <span className="material-symbols-outlined text-emerald-400 text-[14px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sign In Button */}
          <button
            onClick={onOpenAuth}
            className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-medium text-gray-200 bg-[#15161c] border border-[#311c21] hover:bg-[#20212b] hover:text-white transition-colors rounded-lg"
          >
            {language === 'HI' ? 'लॉग इन' : 'Sign In'}
          </button>

          {/* Emergency Request Button */}
          <button
            onClick={() => onNavigate('request-blood')}
            className="px-3.5 py-1.5 text-xs text-white bg-gradient-to-r from-red-600 to-[#b7001e] hover:from-[#ff2b49] hover:to-red-600 transition-all rounded-lg flex items-center gap-1.5 shadow-[0_0_15px_rgba(230,25,55,0.4)] border border-[#ff4d61]/30 font-bold shrink-0"
          >
            <span className="material-symbols-outlined text-[16px] animate-pulse">crisis_alert</span>
            <span className="hidden sm:inline">
              {language === 'HI' ? 'आपातकालीन अनुरोध' : 'Emergency Request'}
            </span>
            <span className="sm:hidden">SOS</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-8 h-8 rounded-lg bg-[#181920] border border-[#2e191d] flex items-center justify-center text-gray-300 hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d0e13] border-b border-[#2e1318] px-4 py-3 flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                currentView === link.id
                  ? 'bg-red-950/70 text-white font-bold border-l-2 border-red-500'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <span>{link.label}</span>
              {link.pulse && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            </button>
          ))}

          <div className="pt-2 border-t border-[#2e1318] flex items-center justify-between">
            <span className="text-xs text-gray-400 font-mono">Select Role:</span>
            <div className="flex gap-1">
              {(['requester', 'donor', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onRoleChange(r);
                    setMobileMenuOpen(false);
                    if (r === 'admin') onNavigate('console');
                    if (r === 'donor') onNavigate('donate-blood');
                    if (r === 'requester') onNavigate('request-blood');
                  }}
                  className={`px-2 py-1 rounded text-xs capitalize font-mono ${
                    userRole === r ? 'bg-red-600 text-white font-bold' : 'bg-[#1b1c24] text-gray-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
