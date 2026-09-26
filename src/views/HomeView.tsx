import React, { useState } from 'react';
import { BloodGroup, BloodComponent, HospitalFacility } from '../types/bloodConnect';
import { FAQ_DATA, COMPATIBILITY_MATRIX } from '../data/mockData';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  hospitals: HospitalFacility[];
  onQuickReserve: (hospital: HospitalFacility, group: BloodGroup, component: BloodComponent) => void;
  onEnrolSuccess: (donorData: { name: string; group: BloodGroup; mobile: string; city: string }) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  hospitals,
  onQuickReserve,
  onEnrolSuccess,
}) => {
  // Availability Search Controller State
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O+');
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent>('PRBC');
  const [selectedRegion, setSelectedRegion] = useState('delhi');
  const [selectedRadius, setSelectedRadius] = useState('15');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // AI Transfusion Assistant State
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Volunteer Enrolment Form State
  const [enrolName, setEnrolName] = useState('');
  const [enrolGroup, setEnrolGroup] = useState<BloodGroup>('O+');
  const [enrolMobile, setEnrolMobile] = useState('');
  const [enrolCity, setEnrolCity] = useState('');
  const [enrolConsent, setEnrolConsent] = useState(false);
  const [enrolSubmitted, setEnrolSubmitted] = useState(false);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleAiQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      const queryLower = aiQuery.toLowerCase();
      if (queryLower.includes('ab-') || queryLower.includes('ab negative')) {
        setAiResponse(
          'For AB- patients: Compatible PRBC units are AB-, A-, B-, and O-. For Plasma (FFP), AB is the universal donor. Within your 15km perimeter, 14 compatible units are currently indexed across AIIMS and Red Cross nodes.'
        );
      } else if (queryLower.includes('o-') || queryLower.includes('o negative')) {
        setAiResponse(
          'O- is the Universal Red Blood Cell Donor, but an O- patient can ONLY receive O- packed red cells safely. 42 units are currently in regional reserves; 3 dispatches are active.'
        );
      } else if (queryLower.includes('shelf') || queryLower.includes('life') || queryLower.includes('platelet')) {
        setAiResponse(
          'Clinical shelf-life standards: Platelets: 5 days at 20°C–24°C with continuous agitation; PRBC: 35–42 days at 2°C–6°C; FFP: 1 year at -30°C or colder; Cryo: 1 year at -30°C.'
        );
      } else {
        setAiResponse(
          `Analysis for "${aiQuery}": According to NACO Transfusion Guidelines 2024, crossmatch testing requires mandatory ABO/Rh typing and irregular antibody screening before bedside infusion. Compatible units for ${selectedGroup} are currently ready for emergency crossmatch reserve.`
        );
      }
    }, 700);
  };

  const handleEnrolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrolConsent) {
      alert('Please agree to the National Voluntary Donor Charter to continue.');
      return;
    }
    setEnrolSubmitted(true);
    onEnrolSuccess({
      name: enrolName,
      group: enrolGroup,
      mobile: enrolMobile,
      city: enrolCity,
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. TOP EMERGENCY DISPATCH TICKER (Below Shell Header) */}
      <div className="w-full bg-[#1b080b] border-b border-[#3b1218] text-[#ffd2d5] py-2 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[11px] uppercase tracking-wider shrink-0 animate-pulse shadow-[0_0_10px_rgba(230,25,55,0.5)] font-bold">
              <span className="material-symbols-outlined text-[13px]">sensors</span>
              Live Dispatch
            </span>
            <p className="text-xs text-gray-200 truncate font-semibold">
              Active critical shortages in New Delhi (O-), Mumbai (B-), Bengaluru (AB-). Fast-track dispatches active.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0 font-mono text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#00e2a0]" />
              1,420+ Clinical Hubs Online
            </span>
            <span className="hidden sm:inline text-gray-600">/</span>
            <span className="hidden sm:flex items-center gap-1 text-red-400 font-bold">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              Median Match: 18m
            </span>
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION WITH CLINICAL PRECISION */}
      <section className="relative w-full bg-gradient-to-b from-[#0d0e12] via-[#16080b] to-[#0d0e12] border-b border-[#241014] overflow-hidden py-12 lg:py-16">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(#e61937_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-[#7a0011]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-start justify-between gap-12">
          {/* Left Column: Primary Pitch & Urgent Actions */}
          <div className="w-full lg:w-7/12 flex flex-col gap-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181920]/90 border border-[#3e1920] text-emerald-400 font-mono text-xs self-start shadow-[0_0_12px_rgba(0,226,160,0.1)]">
              <span className="material-symbols-outlined text-[16px] text-emerald-400">verified_user</span>
              <span>Official NACO & NBTC Aligned Healthcare Logistics System</span>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05] font-extrabold">
                Find blood.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d61] via-red-500 to-[#ff8090] drop-shadow-[0_0_20px_rgba(230,25,55,0.3)]">
                  Help someone.
                </span><br />
                Save a life.
              </h1>
              <p className="font-headline text-lg sm:text-xl text-gray-300 max-w-xl font-normal pt-2 leading-relaxed">
                Blood that connects people when it matters. Real-time emergency crossmatch, verified institutional stocks, and anonymous volunteer dispatches across India.
              </p>
            </div>

            {/* High-Impact Dual Action Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('request-blood')}
                className="h-14 px-6 rounded-xl bg-gradient-to-r from-red-600 to-[#b7001e] text-white font-headline text-base sm:text-lg font-bold flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(230,25,55,0.45)] border border-[#ff4d61]/40 hover:from-[#ff2b49] hover:to-red-600 transition-all group"
              >
                <span className="material-symbols-outlined text-[24px] text-white animate-ping group-hover:scale-110">
                  crisis_alert
                </span>
                <span>Emergency Blood Request</span>
              </button>

              <button
                onClick={() => {
                  const elem = document.getElementById('volunteer-register');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-14 px-6 rounded-xl bg-[#181920] border border-[#381c22] text-white font-headline text-base sm:text-lg font-semibold flex items-center justify-center gap-3 hover:bg-[#22171c] hover:border-red-500/40 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[22px] text-emerald-400">
                  volunteer_activism
                </span>
                <span>Apply as Voluntary Donor</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#14151c]/90 border border-[#2b171c] text-white">
                <span className="material-symbols-outlined text-red-500 text-[20px]">verified</span>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-gray-100">NBTC / NACO Compliant</span>
                  <span className="text-[11px] text-gray-400 leading-tight">Statutory oversight</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#14151c]/90 border border-[#2b171c] text-white">
                <span className="material-symbols-outlined text-emerald-400 text-[20px]">money_off</span>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-gray-100">100% Voluntary Guarantee</span>
                  <span className="text-[11px] text-gray-400 leading-tight">Strict zero commercial sale</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#14151c]/90 border border-[#2b171c] text-white">
                <span className="material-symbols-outlined text-gray-400 text-[20px]">lock_clock</span>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-gray-100">Strict Geo-Privacy</span>
                  <span className="text-[11px] text-gray-400 leading-tight">Approx. proximity only</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Real-time Dispatch Hero Graphic & Live Telemetry */}
          <div className="w-full lg:w-5/12 flex flex-col gap-4">
            <div className="w-full rounded-2xl bg-[#14151c]/95 border border-[#36171e] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping shadow-[0_0_8px_#e61937]" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Live Rapid Response Matrix
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#201518] border border-[#3e1820] font-mono text-[11px] text-gray-300">
                  Trauma Hub NCR #04
                </span>
              </div>

              {/* Clinical Image Feature */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md border border-[#311c21]">
                <img
                  className="w-full h-full object-cover"
                  alt="Clinical blood bank laboratory cold storage"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUnZiuiBq470oQaNlj8AR6cfdUkd0vFbJyirs1vR8PR812VJ5PTx-jhlRfLmVDDPy_jNk8HsCyFOcgnq5ofseu43jH6MOqEp_VQo42F8b0UfCCvBtKG07YPd7LEny1qg9xyv_2l8vyZZbY4ma9meedn8QQoDzbu8XZ5ZGN0ZhPPI3PaIgkqECax3xLFYI12EoUtcNtI-g84uOawlxQILgyLF3Q0po6bCNMLDVlqLp7X075VBwKMqsr"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-black/40 to-transparent flex items-end p-3">
                  <div className="flex items-center justify-between w-full text-white font-mono text-xs">
                    <span className="flex items-center gap-1 font-semibold text-emerald-400">
                      <span className="material-symbols-outlined text-[16px]">thermostat</span>
                      Cold-Chain 4.1°C Compliant
                    </span>
                    <span className="bg-red-600/90 px-2 py-0.5 rounded text-white font-bold shadow-[0_0_8px_rgba(230,25,55,0.6)]">
                      Escalated Priority
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Matching Simulation Stream */}
              <div className="flex flex-col gap-2 text-xs relative z-10">
                <div className="p-2.5 rounded-lg bg-[#0d0e12] border border-[#2b171c] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-[#380910] border border-red-500/40 text-red-400 font-headline text-base font-bold flex items-center justify-center">
                      O-
                    </span>
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-white">Emergency PRBC Dispatched</span>
                      <span className="text-gray-400 text-[11px]">Safdarjung Trauma Centre • ETA 14m</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-[#351016] border border-[#5c1c25] text-red-400 font-mono text-[10px] font-bold">
                    Transit
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0d0e12] border border-[#2b171c] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-[#04261d] border border-emerald-500/40 text-emerald-400 font-headline text-base font-bold flex items-center justify-center">
                      B+
                    </span>
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-white">Donor Matched & In-Route</span>
                      <span className="text-gray-400 text-[11px]">Indiranagar Node • Mumbai Trajectory</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-[#033b2a] border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                    Confirmed
                  </span>
                </div>
              </div>

              {/* Fast stats footer */}
              <div className="pt-1 flex items-center justify-between text-gray-400 font-mono text-xs relative z-10 border-t border-white/5">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">lock</span>
                  Zero Identity Disclosure
                </span>
                <span className="text-gray-300 font-semibold">Audited DISHA Architecture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INSTANT AVAILABILITY & INTERACTIVE SEARCH WIDGET */}
      <section className="w-full py-12 bg-gradient-to-b from-[#0d0e12] via-[#12070a] to-[#0d0e12] border-b border-[#241014] scroll-mt-24" id="search-widget">
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-red-500 font-mono text-xs uppercase tracking-widest font-bold">
                <span className="material-symbols-outlined text-[16px]">travel_explore</span>
                Real-Time Blood Availability Grid
              </div>
              <h2 className="font-headline text-2xl sm:text-3xl text-white font-bold tracking-tight">
                Find Compatible Units in Seconds
              </h2>
              <p className="text-sm text-gray-300">
                Filter certified blood banks, clinical cold-chain stocks, and voluntary pools by geographic distance.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#181920] border border-[#311c21] text-gray-300 text-xs font-mono shadow-sm self-start md:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#00e2a0]" />
              <span>Last automated sync: 12 seconds ago</span>
            </div>
          </div>

          {/* Main Search Controller Box */}
          <div className="w-full bg-[#14151c]/95 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-[#36171e] flex flex-col gap-5">
            {/* Blood Group Fast Toggles */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs text-white font-bold flex items-center justify-between uppercase">
                <span>1. Select Required Blood Group</span>
                <span className="text-gray-400 font-normal lowercase">Universal Donors Highlighted</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {bloodGroups.map((group) => {
                  const isSelected = selectedGroup === group;
                  const isUniversal = group === 'O-';
                  return (
                    <button
                      key={group}
                      type="button"
                      onClick={() => setSelectedGroup(group)}
                      className={`h-12 rounded-lg font-headline text-base font-bold flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-br from-red-600 to-[#b7001e] text-white shadow-[0_0_15px_rgba(230,25,55,0.45)] border border-[#ff4d61]/40'
                          : 'bg-[#1f2029] border border-[#381c22] text-gray-200 hover:bg-[#28181d] hover:border-red-500/50'
                      }`}
                    >
                      <span>{group}</span>
                      {isUniversal && !isSelected && (
                        <span className="absolute bottom-0 text-[8px] uppercase tracking-tighter text-red-400 font-extrabold leading-none pb-0.5 font-mono">
                          Universal
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Component, Node, Radius Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Component Select */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-gray-200 font-semibold uppercase">
                  2. Blood Component Type
                </label>
                <div className="relative">
                  <select
                    value={selectedComponent}
                    onChange={(e) => setSelectedComponent(e.target.value as BloodComponent)}
                    className="w-full h-11 pl-3 pr-8 rounded-xl bg-[#1b1c24] border border-[#381c22] text-white text-xs font-mono appearance-none focus:outline-none focus:border-red-500 transition-colors"
                  >
                    <option value="PRBC">Packed Red Blood Cells (PRBC)</option>
                    <option value="Platelets">Platelet Concentrates / SDP</option>
                    <option value="FFP">Fresh Frozen Plasma (FFP)</option>
                    <option value="Cryo">Cryoprecipitate</option>
                    <option value="Whole Blood">Whole Blood (WB)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-gray-400 text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* State / Metropolitan Node */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-gray-200 font-semibold uppercase">
                  3. State / Metropolitan Node
                </label>
                <div className="relative">
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full h-11 pl-3 pr-8 rounded-xl bg-[#1b1c24] border border-[#381c22] text-white text-xs font-mono appearance-none focus:outline-none focus:border-red-500 transition-colors"
                  >
                    <option value="delhi">Delhi NCR (Trauma Corridor)</option>
                    <option value="mumbai">Maharashtra - Mumbai & MMR</option>
                    <option value="bengaluru">Karnataka - Bengaluru Urban</option>
                    <option value="chennai">Tamil Nadu - Chennai Core</option>
                    <option value="hyderabad">Telangana - Hyderabad Metro</option>
                    <option value="kolkata">West Bengal - Kolkata Hub</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-gray-400 text-[18px]">
                    location_city
                  </span>
                </div>
              </div>

              {/* Radius Proximity */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-gray-200 font-semibold uppercase">
                  4. Radius Proximity Clamping
                </label>
                <div className="relative">
                  <select
                    value={selectedRadius}
                    onChange={(e) => setSelectedRadius(e.target.value)}
                    className="w-full h-11 pl-3 pr-8 rounded-xl bg-[#1b1c24] border border-[#381c22] text-white text-xs font-mono appearance-none focus:outline-none focus:border-red-500 transition-colors"
                  >
                    <option value="5">Within 5 km (Immediate Critical)</option>
                    <option value="15">Within 15 km (Standard Hubs)</option>
                    <option value="30">Within 30 km (District Corridor)</option>
                    <option value="50">Within 50 km (Regional Inter-State)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-gray-400 text-[18px]">
                    near_me
                  </span>
                </div>
              </div>
            </div>

            {/* Trigger Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
                <span className="material-symbols-outlined text-[18px] text-emerald-400">shield</span>
                <span>Government and NABH/NACO accredited blood repositories only</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  alert(`Availability Grid Synced for ${selectedGroup} ${selectedComponent} in ${selectedRegion.toUpperCase()} within ${selectedRadius}km.`);
                }}
                className="w-full sm:w-auto h-11 px-6 rounded-xl bg-gradient-to-r from-red-600 to-[#b7001e] text-white font-mono text-xs font-bold flex items-center justify-center gap-2 hover:from-[#ff2b49] hover:to-red-600 transition-all shadow-[0_0_18px_rgba(230,25,55,0.4)] border border-[#ff4d61]/40"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span>Update Availability Query</span>
              </button>
            </div>
          </div>

          {/* Results Cards (AIIMS, Red Cross, Safdarjung) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {hospitals.slice(0, 3).map((hosp, idx) => {
              const units = idx === 0 ? 18 : idx === 1 ? 31 : 3;
              const isLowStock = idx === 2;

              return (
                <div
                  key={hosp.id}
                  className="rounded-xl bg-[#14151c]/95 border border-[#311c21] p-5 shadow-lg flex flex-col justify-between gap-4 hover:border-red-500/50 transition-all"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold flex items-center gap-1 ${
                          isLowStock
                            ? 'bg-[#350a0f] border border-red-500/40 text-red-400'
                            : 'bg-[#033b2a] border border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {isLowStock ? 'warning' : 'verified'}
                        </span>
                        {hosp.level}
                      </span>
                      <span className="font-mono text-xs text-gray-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">navigation</span>
                        {hosp.distanceKm} km away
                      </span>
                    </div>

                    <h3 className="font-headline text-base font-bold text-white pt-1">
                      {hosp.name}
                    </h3>
                    <p className="text-xs text-gray-400">{hosp.address} • {hosp.type}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0d0e12] border border-[#2b171c] flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-gray-400 uppercase font-semibold">
                        Available {selectedGroup} {selectedComponent}
                      </span>
                      <span
                        className={`font-headline text-2xl font-bold ${
                          isLowStock ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {units} Units
                      </span>
                    </div>

                    <div className="flex flex-col text-right">
                      <span className="text-[10px] font-mono text-gray-400 uppercase font-semibold">
                        Cold Chain
                      </span>
                      <span className="font-mono text-xs text-emerald-400 font-bold flex items-center gap-1 justify-end">
                        <span className="material-symbols-outlined text-[15px]">check_circle</span>
                        Validated
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onQuickReserve(hosp, selectedGroup, selectedComponent)}
                      className="flex-1 h-10 rounded-lg bg-gradient-to-r from-red-600 to-[#b7001e] text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 hover:from-[#ff2b49] hover:to-red-600 transition-all shadow-[0_0_12px_rgba(230,25,55,0.35)] border border-[#ff4d61]/30"
                    >
                      <span className="material-symbols-outlined text-[16px]">send_time_extension</span>
                      <span>Reserve / Crossmatch</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        alert(
                          `Clinical Dossier: ${hosp.name}\n\n- License: DL-BB-2024-REG\n- Contact: ${hosp.contactNumber}\n- PRBC Stock: ${units} units\n- NAT Testing: 100% Certified\n- Cold-chain range: 2°C - 6°C`
                        );
                      }}
                      className="w-10 h-10 rounded-lg bg-[#1f2029] border border-[#381c22] text-gray-300 hover:text-white flex items-center justify-center hover:bg-[#2a171d] transition-colors"
                      title="View Verification Dossier"
                    >
                      <span className="material-symbols-outlined text-[18px]">info</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. EMERGENCY MODE SECTION (HIGH CONTRAST URGENCY CALLOUT) */}
      <section className="w-full py-8 bg-[#0d0e12] border-b border-[#241014]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-full rounded-2xl bg-gradient-to-r from-[#2c080d] via-[#380a11] to-[#1c0508] border border-[#5c1c24] p-6 shadow-[0_8px_32px_rgba(230,25,55,0.25)] flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col gap-2 max-w-2xl relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping shadow-[0_0_8px_#e61937]" />
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[11px] font-bold uppercase tracking-wider shadow-[0_0_8px_rgba(230,25,55,0.4)]">
                  Critical Emergency Protocol 104
                </span>
              </div>
              <h3 className="font-headline text-xl sm:text-2xl text-white font-bold tracking-tight">
                Urgent Trauma, Maternal Hemorrhage & Thalassemia Alert
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                If you are managing an acute surgical trauma, peripartum hemorrhage, severe pediatric anemia, or active operative requirement, do not wait for standard matching. Escalate to the National Medical Call Desk immediately.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-gray-400 text-xs font-mono">
                <span className="flex items-center gap-1 text-gray-300">
                  <span className="material-symbols-outlined text-[16px] text-red-500">local_hospital</span>
                  Direct Doctor-to-Doctor Handoff
                </span>
                <span className="flex items-center gap-1 text-gray-300">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">ambulance</span>
                  Green Corridor Logistics Authorized
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0 relative z-10">
              <a
                href="tel:104"
                className="h-14 px-6 rounded-xl bg-gradient-to-r from-red-600 to-[#b7001e] text-white font-headline text-lg font-bold flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(230,25,55,0.5)] border border-[#ff4d61]/40 hover:from-[#ff2b49] hover:to-red-600 transition-all"
              >
                <span className="material-symbols-outlined text-[24px]">phone_in_talk</span>
                <span>Dial 104 / 1910 Now</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  alert(
                    'Regional Flash SOS Triggered!\n\nEncrypted broadcast dispatched to 142 voluntary donors within 10km radius. Trauma nodal officer notified.'
                  );
                }}
                className="h-11 px-4 rounded-xl bg-[#14151c] border border-[#3e1920] text-gray-200 hover:text-white font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#201518] hover:border-red-500/40 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-red-500">notifications_active</span>
                <span>Broadcast Regional Flash SOS</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS: END-TO-END CLINICAL ARCHITECTURE */}
      <section className="w-full py-16 bg-[#0d0e12] border-b border-[#241014]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-12">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-2">
            <span className="font-mono text-xs text-red-500 uppercase font-bold tracking-widest">
              Protocolized Clinical Workflow
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl text-white font-bold tracking-tight">
              How BloodConnect India Operates
            </h2>
            <p className="text-sm text-gray-300">
              A zero-friction, encrypted 5-stage coordination mechanism connecting critical clinical needs with certified voluntary donors and compliant blood centers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#14151c]/95 border border-[#311c21] hover:border-red-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-[#23242e] border border-gray-700 text-white font-headline text-sm font-bold flex items-center justify-center shadow-sm">
                  01
                </span>
                <span className="material-symbols-outlined text-gray-400 text-[22px]">clinical_notes</span>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-headline text-base font-bold text-white">Clinical Request</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Hospital doctor or verified attendant logs diagnosis, units, component requirement, and requisition slip.
                </p>
              </div>
              <span className="mt-auto pt-2 font-mono text-[11px] text-emerald-400 font-semibold flex items-center gap-1 border-t border-white/5">
                <span className="material-symbols-outlined text-[14px]">shield_with_heart</span> Doctor Verified
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#14151c]/95 border border-[#311c21] hover:border-red-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-emerald-500 text-black font-headline text-sm font-bold flex items-center justify-center shadow-[0_0_12px_rgba(0,226,160,0.3)]">
                  02
                </span>
                <span className="material-symbols-outlined text-emerald-400 text-[22px]">map</span>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-headline text-base font-bold text-white">PostGIS Geo-Match</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Spatial engine matches compatible blood stocks and notifies anonymous voluntary donors within dynamic travel radius.
                </p>
              </div>
              <span className="mt-auto pt-2 font-mono text-[11px] text-emerald-400 font-semibold flex items-center gap-1 border-t border-white/5">
                <span className="material-symbols-outlined text-[14px]">lock</span> Geo-Privacy Preserved
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#14151c]/95 border border-[#311c21] hover:border-red-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-[#23242e] border border-gray-700 text-white font-headline text-sm font-bold flex items-center justify-center shadow-sm">
                  03
                </span>
                <span className="material-symbols-outlined text-gray-400 text-[22px]">phonelink_lock</span>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-headline text-base font-bold text-white">Secure Dispatch</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  End-to-end encrypted dispatch protocol. Private phone numbers are never shared; in-app routed proxy communications.
                </p>
              </div>
              <span className="mt-auto pt-2 font-mono text-[11px] text-gray-400 font-semibold flex items-center gap-1 border-t border-white/5">
                <span className="material-symbols-outlined text-[14px]">visibility_off</span> Masked Identities
              </span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#14151c]/95 border border-[#311c21] hover:border-red-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-[#23242e] border border-gray-700 text-white font-headline text-sm font-bold flex items-center justify-center shadow-sm">
                  04
                </span>
                <span className="material-symbols-outlined text-gray-400 text-[22px]">ac_unit</span>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-headline text-base font-bold text-white">Cold-Chain Transit</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Apheresis or packed donation occurs at accredited clinical blood bank under monitored 2°C–6°C cold-chain standards.
                </p>
              </div>
              <span className="mt-auto pt-2 font-mono text-[11px] text-gray-400 font-semibold flex items-center gap-1 border-t border-white/5">
                <span className="material-symbols-outlined text-[14px]">thermostat</span> ISO/NACO Standard
              </span>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#14151c]/95 border border-[#311c21] hover:border-red-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-[#b7001e] text-white font-headline text-sm font-bold flex items-center justify-center shadow-[0_0_12px_rgba(230,25,55,0.4)]">
                  05
                </span>
                <span className="material-symbols-outlined text-red-500 text-[22px]">task_alt</span>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-headline text-base font-bold text-white">Verified Fulfillment</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Barcode scanned crossmatch verification completed at receiving bedside. Electronic chain-of-custody sealed.
                </p>
              </div>
              <span className="mt-auto pt-2 font-mono text-[11px] text-red-400 font-semibold flex items-center gap-1 border-t border-white/5">
                <span className="material-symbols-outlined text-[14px]">done_all</span> Complete Lifecycle
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INSTITUTIONAL NETWORK & CLINICAL CREDENTIALS */}
      <section className="w-full py-16 bg-gradient-to-b from-[#0d0e12] via-[#14080b] to-[#0d0e12] border-b border-[#241014]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-emerald-400 uppercase font-bold tracking-widest">
                Institutional Federation
              </span>
              <h2 className="font-headline text-2xl sm:text-3xl text-white font-bold tracking-tight">
                Nationwide Integrated Hospital Network
              </h2>
              <p className="text-sm text-gray-300">
                Partnered with apex government institutions, autonomous research trusts, and licensed medical colleges.
              </p>
            </div>

            {/* Key Metrics Strip */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-[#14151c]/95 border border-[#311c21] shadow-md flex flex-col">
                <span className="font-headline text-2xl font-extrabold text-white">1,420+</span>
                <span className="font-mono text-[11px] text-gray-400">Verified Institutions</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-[#14151c]/95 border border-[#311c21] shadow-md flex flex-col">
                <span className="font-headline text-2xl font-extrabold text-red-500">84,200+</span>
                <span className="font-mono text-[11px] text-gray-400">Active Donors</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-[#14151c]/95 border border-[#311c21] shadow-md flex flex-col">
                <span className="font-headline text-2xl font-extrabold text-emerald-400">18 mins</span>
                <span className="font-mono text-[11px] text-gray-400">Median Match Time</span>
              </div>
            </div>
          </div>

          {/* Institutional Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'AIIMS New Delhi', tier: 'Apex Trauma Node', icon: 'apartment', red: true },
              { name: 'Safdarjung Hospital', tier: 'Central Trauma Unit', icon: 'domain', red: true },
              { name: 'Tata Memorial', tier: 'Oncology Transfusion', icon: 'health_and_safety', emerald: true },
              { name: 'Manipal Hospitals', tier: 'South Regional Grid', icon: 'local_hospital' },
              { name: 'Apollo Health City', tier: 'NABH Accredited', icon: 'medical_services' },
              { name: 'Indian Red Cross', tier: 'National Processing', icon: 'emergency', red: true },
            ].map((node) => (
              <div
                key={node.name}
                className="p-4 rounded-xl bg-[#14151c]/95 border border-[#311c21] flex flex-col items-center text-center justify-center gap-2 shadow-md hover:border-red-500/40 transition-all"
              >
                <span
                  className={`material-symbols-outlined text-[32px] ${
                    node.red ? 'text-red-500' : node.emerald ? 'text-emerald-400' : 'text-gray-400'
                  }`}
                >
                  {node.icon}
                </span>
                <span className="font-headline text-xs font-bold text-white">{node.name}</span>
                <span className="font-mono text-[10px] text-emerald-400">{node.tier}</span>
              </div>
            ))}
          </div>

          {/* Cold-Chain Compliance & Live Telemetry Card */}
          <div className="w-full rounded-2xl bg-[#14151c]/95 border border-[#36171e] p-6 shadow-lg flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-7/12 rounded-xl overflow-hidden shadow-sm h-64 relative border border-[#2b171c] bg-[#0a0a0e]">
              <div className="absolute inset-0 bg-[radial-gradient(#e61937_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full border border-red-500/30 animate-ping absolute" />
                  <div className="w-24 h-24 rounded-full border border-red-500/50 absolute" />
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-[0_0_15px_#e61937]">
                    <span className="material-symbols-outlined text-[16px]">local_hospital</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-3 left-3 px-3 py-1 rounded bg-[#0d0e12]/90 border border-[#3b1218] text-gray-200 font-mono text-xs backdrop-blur-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>NCR Live Regional Logistics Route: AIIMS ↔ Safdarjung Corridors</span>
              </div>
            </div>

            <div className="w-full lg:w-5/12 flex flex-col gap-3">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Audited Platform Log Extract
              </div>
              <h3 className="font-headline text-lg font-bold text-white">
                Cold-Chain Verified Chain of Custody
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                All blood components transported via coordinated dispatches are maintained in temperature-logged smart carrier vaults. Barcode telemetry is committed at each node to guarantee donor-to-recipient biological integrity.
              </p>
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between font-mono text-xs text-gray-400">
                  <span>National Cold-Chain Compliance</span>
                  <span className="font-bold text-emerald-400">99.84%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1e2029] overflow-hidden">
                  <div className="w-[99.8%] h-full bg-emerald-400 rounded-full shadow-[0_0_8px_#00e2a0]" />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-1 font-mono text-xs text-gray-400">
                <span className="flex items-center gap-1 font-semibold text-gray-200">
                  <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
                  ISO 9001:2015
                </span>
                <span className="flex items-center gap-1 font-semibold text-gray-200">
                  <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
                  NACO 2024 Standards
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRUST, SAFETY & STRICT ZERO-SALE STATUTORY NOTICE */}
      <section className="w-full py-16 bg-[#0d0e12] border-b border-[#241014]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-12">
          {/* Legal Callout */}
          <div className="w-full rounded-2xl bg-gradient-to-r from-[#171822] via-[#1f161c] to-[#171822] border border-[#3b1921] p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#28181d] border border-red-500/40 text-red-500 flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[28px]">gavel</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-headline text-base font-bold text-white">
                  Statutory Zero Commercialization Notice
                </h3>
                <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
                  In accordance with the Supreme Court of India directive (1996) and the National Blood Policy (NACO/NBTC), human blood and blood components can NEVER be sold or purchased. Only statutory processing and testing service charges regulated by the Ministry of Health are permissible at licensed facilities.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('console')}
              className="px-4 py-2 rounded-xl bg-[#20212b] border border-[#3e1920] text-gray-200 hover:text-white hover:border-red-500/50 font-mono text-xs font-bold whitespace-nowrap transition-colors"
            >
              Read NBTC Policy
            </button>
          </div>

          {/* Grid: FAQ & AI Transfusion Assistant */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* FAQ Accordion (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div>
                <span className="font-mono text-xs text-red-500 uppercase font-bold tracking-widest">
                  Knowledge Repository
                </span>
                <h3 className="font-headline text-xl font-bold text-white">
                  Frequently Asked Clinical Questions
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                {FAQ_DATA.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className="rounded-xl bg-[#14151c]/95 border border-[#2e191d] overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 font-headline text-xs sm:text-sm font-bold text-white hover:text-red-400 transition-colors"
                      >
                        <span>{faq.question}</span>
                        <span
                          className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-red-400' : ''
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-gray-300 text-xs leading-relaxed border-t border-white/5 pt-2">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Transfusion Assistant Widget (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="rounded-2xl bg-[#14151c]/95 border border-[#36171e] p-5 shadow-lg flex flex-col justify-between gap-4 h-full">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-red-500 font-mono text-xs font-bold">
                      <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                      <span>AI Clinical Triage Assistant</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#201518] border border-[#3b151d] font-mono text-[10px] text-gray-300">
                      Beta
                    </span>
                  </div>

                  <h4 className="font-headline text-base font-bold text-white">
                    Check Blood Compatibility & Requirements
                  </h4>
                  <p className="text-xs text-gray-300">
                    Type your patient's blood type, clinical condition, or query to get instant NACO-standard compatibility matrices and replacement protocols.
                  </p>

                  {/* Interactive Query & Response */}
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="p-3 rounded-xl bg-[#0d0e12] border border-[#2b171c] shadow-sm flex flex-col gap-1">
                      <span className="font-mono text-[10px] text-gray-400 uppercase font-semibold">
                        Sample Clinical Inquiry:
                      </span>
                      <p className="text-xs text-gray-200 italic">
                        "Patient is AB Negative scheduled for cardiac bypass. What compatible donor PRBC units can be safely crossmatched?"
                      </p>
                    </div>

                    {aiResponse && (
                      <div className="p-3 rounded-xl bg-[#1c1d27] border border-red-900/60 flex flex-col gap-1.5 animate-in fade-in duration-300">
                        <div className="flex items-center gap-1 font-mono text-xs text-emerald-400 font-bold">
                          <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                          <span>Clinical Engine Response:</span>
                        </div>
                        <p className="text-xs text-gray-200 leading-relaxed">{aiResponse}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Question Input Form */}
                <form onSubmit={handleAiQuerySubmit} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Ask about transfusion guidelines..."
                    className="flex-1 h-11 px-3.5 rounded-xl bg-[#0d0e12] border border-[#381c22] text-white placeholder-gray-500 text-xs focus:outline-none focus:border-red-500 shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="h-11 px-4 rounded-xl bg-gradient-to-r from-red-600 to-[#b7001e] text-white font-mono text-xs font-bold flex items-center justify-center hover:from-[#ff2b49] hover:to-red-600 transition-all shadow-[0_0_12px_rgba(230,25,55,0.4)] border border-[#ff4d61]/30 shrink-0"
                  >
                    {aiLoading ? (
                      <span className="material-symbols-outlined animate-spin text-[18px]">
                        progress_activity
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. VOLUNTARY DONOR REGISTRATION CONVERTOR SECTION */}
      <section className="w-full py-16 bg-gradient-to-b from-[#0d0e12] via-[#16070a] to-[#0d0e12] border-b border-[#241014] scroll-mt-24" id="volunteer-register">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="w-full lg:w-6/12 flex flex-col gap-4">
            <span className="font-mono text-xs text-red-500 uppercase font-bold tracking-widest">
              Join India's Critical Defense Line
            </span>
            <h2 className="font-headline text-2xl sm:text-4xl text-white font-bold tracking-tight">
              Be on standby when someone in your city needs blood to survive.
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Voluntary donors receive priority alert notifications strictly matching their blood group within their designated travel distance. You are never obliged; you confirm via simple tap when eligible.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[20px] shrink-0">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-headline text-xs font-bold text-white">Encrypted Data</span>
                  <span className="text-xs text-gray-400">Your identity is completely masked from requesters.</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[20px] shrink-0">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-headline text-xs font-bold text-white">Frequency Caps</span>
                  <span className="text-xs text-gray-400">Automatic 90-day biological cooldown enforced.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Signup Box */}
          <div className="w-full lg:w-5/12 bg-[#14151c]/95 border border-[#36171e] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-base font-bold text-white">Fast 60-Second Enrolment</h3>
              <span className="px-2 py-0.5 rounded bg-[#033b2a] border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
                100% Free
              </span>
            </div>

            {enrolSubmitted ? (
              <div className="p-6 bg-[#0d0e13] border border-emerald-900/60 rounded-xl text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">verified</span>
                </div>
                <h4 className="font-headline text-lg font-bold text-white">Welcome, {enrolName}!</h4>
                <p className="text-xs text-slate-300">
                  Your voluntary donor profile ({enrolGroup}) is registered with National Blood Grid Node {enrolCity}. Your fast-pass token is now activated.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('donate-blood')}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-mono text-xs font-bold hover:bg-red-500 transition-colors shadow-md"
                >
                  View My Donor Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnrolSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono font-semibold text-gray-300 uppercase">
                    Full Name (Legal ID Match)
                  </label>
                  <input
                    type="text"
                    required
                    value={enrolName}
                    onChange={(e) => setEnrolName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full h-11 px-3.5 rounded-lg bg-[#1b1c24] border border-[#381c22] text-white placeholder-gray-500 text-xs focus:outline-none focus:border-red-500 transition-colors font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-mono font-semibold text-gray-300 uppercase">
                      Blood Type
                    </label>
                    <select
                      value={enrolGroup}
                      onChange={(e) => setEnrolGroup(e.target.value as BloodGroup)}
                      className="w-full h-11 px-3 rounded-lg bg-[#1b1c24] border border-[#381c22] text-white text-xs font-mono focus:outline-none focus:border-red-500 transition-colors"
                    >
                      {bloodGroups.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-mono font-semibold text-gray-300 uppercase">
                      Mobile (OTP Auth)
                    </label>
                    <input
                      type="tel"
                      required
                      value={enrolMobile}
                      onChange={(e) => setEnrolMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full h-11 px-3.5 rounded-lg bg-[#1b1c24] border border-[#381c22] text-white placeholder-gray-500 text-xs font-mono focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono font-semibold text-gray-300 uppercase">
                    City / Sector Node
                  </label>
                  <input
                    type="text"
                    required
                    value={enrolCity}
                    onChange={(e) => setEnrolCity(e.target.value)}
                    placeholder="e.g. New Delhi, South Extension"
                    className="w-full h-11 px-3.5 rounded-lg bg-[#1b1c24] border border-[#381c22] text-white placeholder-gray-500 text-xs font-mono focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={enrolConsent}
                    onChange={(e) => setEnrolConsent(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-0 bg-[#1b1c24] border-[#381c22] cursor-pointer"
                  />
                  <label htmlFor="consent" className="text-xs text-gray-400 cursor-pointer">
                    I agree to the{' '}
                    <a href="#charter" className="text-red-400 underline hover:text-red-300">
                      National Voluntary Donor Charter
                    </a>{' '}
                    & confirm age ≥ 18.
                  </label>
                </div>

                <button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-red-600 to-[#b7001e] text-white font-headline text-sm font-bold flex items-center justify-center gap-2 hover:from-[#ff2b49] hover:to-red-600 transition-all shadow-[0_0_18px_rgba(230,25,55,0.4)] border border-[#ff4d61]/40 mt-1"
                >
                  <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                  <span>Register as Verified Donor</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
