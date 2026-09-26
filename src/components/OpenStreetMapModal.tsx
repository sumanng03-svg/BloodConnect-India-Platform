import React, { useState } from 'react';

interface OpenStreetMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (facilityData: {
    name: string;
    coordinates: string;
    eta: string;
    address: string;
  }) => void;
  defaultFacility?: string;
}

export const OpenStreetMapModal: React.FC<OpenStreetMapModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  defaultFacility = 'AIIMS Main Trauma Centre, Ring Road, New Delhi',
}) => {
  const [searchQuery, setSearchQuery] = useState(defaultFacility);
  const [selectedPin, setSelectedPin] = useState<'aiims' | 'safdarjung' | 'redcross'>('aiims');
  const [zoomLevel, setZoomLevel] = useState(14);
  const [triageRadius, setTriageRadius] = useState<'5km' | '15km'>('5km');

  if (!isOpen) return null;

  const facilities = {
    aiims: {
      name: 'AIIMS - Main Trauma Centre',
      address: 'Ring Road, New Delhi',
      coords: '28.5672° N, 77.2100° E',
      eta: '12 mins ETA',
      route: 'Ring Road Express Bypass',
      banksInRange: 4,
    },
    safdarjung: {
      name: 'Safdarjung Hospital Emergency Bay',
      address: 'Sri Aurobindo Marg, New Delhi',
      coords: '28.5700° N, 77.2050° E',
      eta: '8 mins ETA',
      route: 'Aurobindo Flyover Green Corridor',
      banksInRange: 5,
    },
    redcross: {
      name: 'Indian Red Cross Blood Centre',
      address: '1 Red Cross Road, New Delhi',
      coords: '28.6219° N, 77.2090° E',
      eta: '16 mins ETA',
      route: 'Central Secretariat Transit Line',
      banksInRange: 3,
    },
  };

  const current = facilities[selectedPin];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.toLowerCase().includes('safdarjung')) {
      setSelectedPin('safdarjung');
    } else if (searchQuery.toLowerCase().includes('red cross')) {
      setSelectedPin('redcross');
    } else {
      setSelectedPin('aiims');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#14151a] w-full max-w-4xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[94vh] border border-[#3a141a] ring-1 ring-red-500/20">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#171822] border-b border-[#3a141a] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-900 text-white flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.4)] shrink-0 ring-1 ring-red-400/40">
              <span className="material-symbols-outlined text-[20px]">map</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Select Hospital or Delivery Coordinates
                </h3>
                <span className="px-1.5 py-0.5 rounded bg-[#241318] border border-red-900/60 font-mono text-[10px] font-bold text-red-300 uppercase">
                  OSM / Leaflet v1.9.4
                </span>
              </div>
              <p className="text-xs text-slate-400">
                OpenStreetMap Spatial Geocoding & DISHA Privacy Masking Relay
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#222433] hover:bg-[#2d3043] border border-[#373a4d] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="p-3 bg-[#101117] border-b border-[#2e181e] flex flex-col sm:flex-row gap-2 items-center shrink-0"
        >
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AIIMS, Safdarjung, Apollo or enter address / landmark"
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#181a24] border border-[#373a4c] text-white placeholder-slate-400 text-xs focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('AIIMS Main Trauma Centre, Ring Road, New Delhi');
                setSelectedPin('aiims');
              }}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#202230] hover:bg-[#2a2d3f] border border-[#373a4e] text-slate-200 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-400">my_location</span>
              <span>Current GPS</span>
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">travel_explore</span>
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Map Viewport Canvas */}
        <div className="relative w-full h-80 sm:h-96 bg-[#0b0c10] overflow-hidden select-none">
          {/* Base Dark Map Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70 filter invert-[0.92] hue-rotate-[195deg] brightness-[0.78] contrast-[1.25]"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBo3yiMSVFdmu4UB1oxeAXbRO91pemKq1nLHe6z-zgBLP51zgkGUmiR2uaFT416DnfhGYMFsvDfHo3DFVAGV5LONQ35H_HXUH75lzaktVtkmo3Z2TjT_NsW6QSDl3q7_JWPdRFY_ky2wLbGDSJJkj69cxJ-6YJ-uCH2XlDwKBsYg-i0y6RMuBfdFXOnPhNEbq8tzNzkJznfZad8pT8wnr6hHk4FvGWVoLoiPQSyTSezyJ6RzMWbOlXy')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e14] via-transparent to-[#0d0e14]/70 pointer-events-none" />

          {/* Left Zoom & Tool Controls */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
              className="w-8 h-8 rounded-lg bg-[#14151e]/90 hover:bg-[#232535] border border-[#34374b] text-white shadow-lg flex items-center justify-center font-bold text-base"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
              className="w-8 h-8 rounded-lg bg-[#14151e]/90 hover:bg-[#232535] border border-[#34374b] text-white shadow-lg flex items-center justify-center font-bold text-base"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => setSelectedPin('aiims')}
              className="w-8 h-8 rounded-lg bg-[#14151e]/90 hover:bg-[#232535] border border-[#34374b] text-slate-300 hover:text-red-400 shadow-lg flex items-center justify-center mt-1"
              title="Center on Target"
            >
              <span className="material-symbols-outlined text-[16px]">crosshairs</span>
            </button>
            <button
              type="button"
              onClick={() => setTriageRadius(triageRadius === '5km' ? '15km' : '5km')}
              className="w-8 h-8 rounded-lg bg-[#14151e]/90 hover:bg-[#232535] border border-[#34374b] text-slate-300 hover:text-red-400 shadow-lg flex items-center justify-center"
              title="Toggle Radius"
            >
              <span className="material-symbols-outlined text-[16px]">layers</span>
            </button>
          </div>

          {/* Top Right Corridor Status */}
          <div className="absolute top-3 right-3 z-10">
            <div className="px-3 py-1.5 rounded-lg bg-[#1a0a0f]/95 border border-red-700/60 shadow-[0_0_15px_rgba(220,38,38,0.3)] text-xs text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold text-red-300 font-mono">Emergency Corridor Lock</span>
              <span className="text-red-900">|</span>
              <span className="font-mono text-slate-300 text-[11px]">{triageRadius} Active Triage</span>
            </div>
          </div>

          {/* Animated Center Radar Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
            <div
              className={`rounded-full border-2 border-red-500/40 bg-red-950/20 animate-pulse flex items-center justify-center ${
                triageRadius === '5km' ? 'w-64 h-64' : 'w-84 h-84'
              }`}
            >
              <div className="w-40 h-40 rounded-full border border-dashed border-red-400/60 bg-red-900/30" />
            </div>
          </div>

          {/* Primary Target Destination Pin (AIIMS) */}
          <div
            onClick={() => {
              setSelectedPin('aiims');
              setSearchQuery('AIIMS Main Trauma Centre, Ring Road, New Delhi');
            }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-pointer transition-transform ${
              selectedPin === 'aiims' ? 'scale-110 -mt-6' : '-mt-4 opacity-90'
            }`}
          >
            <div className="px-3 py-1 rounded-lg bg-red-600 border border-red-400 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(220,38,38,0.8)] flex items-center gap-1.5 shrink-0 whitespace-nowrap animate-bounce">
              <span className="material-symbols-outlined text-[15px]">local_hospital</span>
              <span>AIIMS Trauma Centre (Destination)</span>
            </div>
            <div className="w-3 h-3 bg-red-600 rotate-45 -mt-1.5 shadow-md" />
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 mt-0.5 ring-2 ring-red-300" />
          </div>

          {/* Facility Marker 2: Safdarjung */}
          <div
            onClick={() => {
              setSelectedPin('safdarjung');
              setSearchQuery('Safdarjung Hospital Emergency Bay, New Delhi');
            }}
            className="absolute top-[36%] left-[28%] z-15 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="px-2.5 py-0.5 rounded-md bg-sky-600 border border-sky-400 text-white font-mono text-[11px] font-semibold shadow-[0_0_12px_rgba(2,132,199,0.7)] flex items-center gap-1 whitespace-nowrap">
              <span className="material-symbols-outlined text-[13px]">domain</span>
              <span>Safdarjung Hospital</span>
            </div>
            <div className="w-2 h-2 bg-sky-600 rotate-45 -mt-1" />
          </div>

          {/* Facility Marker 3: Indian Red Cross */}
          <div
            onClick={() => {
              setSelectedPin('redcross');
              setSearchQuery('Indian Red Cross Blood Centre, New Delhi');
            }}
            className="absolute bottom-[32%] right-[26%] z-15 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="px-2.5 py-0.5 rounded-md bg-emerald-600 border border-emerald-400 text-white font-mono text-[11px] font-semibold shadow-[0_0_12px_rgba(16,185,129,0.7)] flex items-center gap-1 whitespace-nowrap">
              <span className="material-symbols-outlined text-[13px]">bloodtype</span>
              <span>Indian Red Cross Centre</span>
            </div>
            <div className="w-2 h-2 bg-emerald-600 rotate-45 -mt-1" />
          </div>

          {/* Bottom Banner */}
          <div className="absolute bottom-2 left-2 right-2 z-10 pointer-events-none flex justify-center">
            <div className="bg-[#0f1118]/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#2b2e40] text-[11px] text-slate-300 font-medium flex items-center gap-1.5 shadow-lg">
              <span className="material-symbols-outlined text-emerald-400 text-[14px]">
                verified_user
              </span>
              <span>Sub-10m Spatial Resolution • Donor PII & Exact Coordinates Fully Masked</span>
            </div>
          </div>

          <div className="absolute bottom-1 right-2 z-10 text-[10px] text-slate-400 font-sans pointer-events-none">
            © OpenStreetMap contributors
          </div>
        </div>

        {/* Footer & Telemetry Grid */}
        <div className="p-4 bg-[#101117] border-t border-[#3a141a] flex flex-col gap-2 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-left">
            <div className="p-2.5 rounded-xl bg-[#171822] border border-[#2a2d3e]">
              <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                Selected Facility
              </span>
              <span className="block text-sm font-bold text-white truncate" title={current.name}>
                {current.name}
              </span>
              <span className="text-[11px] text-slate-400">{current.address}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#171822] border border-[#2a2d3e]">
              <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                Target Coordinates
              </span>
              <span className="block text-sm font-bold text-white font-mono">{current.coords}</span>
              <span className="text-[11px] text-slate-400">500m geohash masked</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#220a0f] border border-red-900/60">
              <span className="block text-[10px] uppercase font-mono tracking-wider text-red-400 font-bold">
                Ambulance Corridor
              </span>
              <span className="block text-sm font-bold text-red-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">electric_bolt</span>
                <span>{current.eta}</span>
              </span>
              <span className="text-[11px] text-slate-400">{current.route}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#171822] border border-[#2a2d3e]">
              <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                Active Dispatch Radius
              </span>
              <span className="block text-sm font-bold text-white">15 km Perimeter</span>
              <span className="text-[11px] text-emerald-400 font-semibold font-mono">
                {current.banksInRange} verified banks in range
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 mt-1 border-t border-[#26151a]">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="material-symbols-outlined text-emerald-400 text-[16px]">lock</span>
              <span>Complies with NBTC Transfusion Logistics Protocol & MoHFW standards</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#1f212e] hover:bg-[#2b2d3e] border border-[#383b4f] text-slate-200 text-xs font-mono font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm({
                    name: current.name,
                    coordinates: current.coords,
                    eta: current.eta,
                    address: current.address,
                  });
                  onClose();
                }}
                className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-mono font-bold shadow-[0_0_18px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Confirm Hospital Location & Proceed to Matching</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
