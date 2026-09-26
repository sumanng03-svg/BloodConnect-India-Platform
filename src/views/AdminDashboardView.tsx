import React, { useState } from 'react';
import {
  EmergencyRequest,
  InventoryItem,
  AuditLogEntry,
  HospitalFacility
} from '../types/bloodConnect';

interface AdminDashboardViewProps {
  requests: EmergencyRequest[];
  inventory: InventoryItem[];
  auditLogs: AuditLogEntry[];
  hospitals: HospitalFacility[];
  onTransitAssigned: (reqId: string) => void;
  onManualEscalate: (data: {
    bloodGroup: string;
    units: number;
    patientDetails: string;
  }) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  requests,
  inventory,
  auditLogs,
  hospitals,
  onTransitAssigned,
  onManualEscalate,
}) => {
  const [activeConsoleTab, setActiveConsoleTab] = useState<
    'overview' | 'dispatch' | 'inventory' | 'audit'
  >('overview');
  const [searchFilter, setSearchFilter] = useState('');
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);

  // Manual Escalation Form State
  const [escalateGroup, setEscalateGroup] = useState('O-');
  const [escalateUnits, setEscalateUnits] = useState(4);
  const [escalateDetails, setEscalateDetails] = useState('Severe polytrauma in ICU Bay 2');

  const filteredRequests = requests.filter(
    (r) =>
      r.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.patientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.facilityName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.bloodGroup.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleEscalateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onManualEscalate({
      bloodGroup: escalateGroup,
      units: escalateUnits,
      patientDetails: escalateDetails,
    });
    setIsEscalateModalOpen(false);
    alert(
      `Manual Triage Escalation Dispatched!\n\nCode Red broadcast triggered for ${escalateUnits} units of ${escalateGroup}. Zonal blood banks locked.`
    );
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0b0c10] text-white">
      {/* Top AIIMS Node Header Bar */}
      <div className="bg-[#0e0f14]/90 border-b border-[#2a171a] px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#181922] border border-[#2e1d22] rounded-lg text-slate-300 font-mono text-xs">
            <span className="material-symbols-outlined text-[16px] text-red-400">domain</span>
            <span>All India Institute of Medical Sciences (AIIMS) - Trauma Centre Node</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-red-400 font-mono text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>{requests.filter((r) => r.urgency === 'CRITICAL').length} Critical Requests Pending</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#3d0f16] border border-red-500/40 text-red-200 rounded-lg font-mono text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px] text-red-400">phone_in_talk</span>
            <span>SOS Desk: 104 / 1910</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-[#15161c] border border-white/10 rounded-lg text-xs font-mono">
            <span className="text-slate-400">Node Latency:</span>
            <span className="text-emerald-400 font-bold">18 ms</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6 w-full">
        {/* Tactical Ribbon */}
        <section className="bg-[#15161c] border border-[#2a171a] p-4 rounded-xl shadow-lg flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Active Emergency Metric */}
            <div className="flex items-center gap-2 bg-[#360e15] border border-red-500/40 text-red-200 px-3 py-1.5 rounded-lg shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-300">
                Active Emergencies:
              </span>
              <span className="font-headline text-lg font-bold ml-1 text-white">
                {requests.length + 11}
              </span>
            </div>

            <div className="h-6 w-px bg-[#2a171a] hidden md:block" />

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1c24] border border-[#2e2026] rounded-lg text-white font-mono text-xs">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">verified</span>
              <span className="text-slate-400">Verified Banks:</span>
              <span className="font-bold text-white">1,420</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1c24] border border-[#2e2026] rounded-lg text-white font-mono text-xs">
              <span className="material-symbols-outlined text-red-400 text-[18px]">vaccines</span>
              <span className="text-slate-400">National Stock:</span>
              <span className="font-bold text-red-400">38,910 U</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1c24] border border-[#2e2026] rounded-lg text-white font-mono text-xs">
              <span className="material-symbols-outlined text-amber-400 text-[18px]">pending_actions</span>
              <span className="text-slate-400">Pending Verifications:</span>
              <span className="font-bold text-amber-400">28</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1c24] border border-[#2e2026] rounded-lg text-white font-mono text-xs">
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">schedule</span>
              <span className="text-slate-400">Avg Transit:</span>
              <span className="font-bold text-emerald-400">14m 20s</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start xl:self-auto bg-[#181a22] border border-[#26212b] px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">cloud_done</span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs font-semibold text-white">
                  PostGIS Zonal Mirrors Healthy
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                Sub-10m Spatial Resolution Active
              </span>
            </div>
          </div>
        </section>

        {/* Role Navigation Tabs & Secondary Actions */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-[#15161c] border border-[#2a171a] p-1 rounded-xl shadow-inner overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveConsoleTab('overview')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeConsoleTab === 'overview'
                  ? 'bg-[#340f17] text-white border border-red-500/50 shadow-sm'
                  : 'text-slate-300 hover:bg-[#1f1d24] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-red-500">analytics</span>
              <span>Admin Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveConsoleTab('dispatch')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeConsoleTab === 'dispatch'
                  ? 'bg-[#340f17] text-white border border-red-500/50 shadow-sm'
                  : 'text-slate-300 hover:bg-[#1f1d24] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-red-400">emergency_home</span>
              <span>Hospital Ward Dispatch</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveConsoleTab('inventory')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeConsoleTab === 'inventory'
                  ? 'bg-[#340f17] text-white border border-red-500/50 shadow-sm'
                  : 'text-slate-300 hover:bg-[#1f1d24] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-red-300">inventory_2</span>
              <span>Blood Bank Stock Manager</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveConsoleTab('audit')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeConsoleTab === 'audit'
                  ? 'bg-[#340f17] text-white border border-red-500/50 shadow-sm'
                  : 'text-slate-300 hover:bg-[#1f1d24] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-400">verified_user</span>
              <span>Audit Logs & NBTC Compliance</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center flex-1 sm:flex-initial">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Track Case ID / Donor Mask / Bank..."
                className="bg-[#15161c] border border-[#2a171a] text-white placeholder:text-slate-400 pl-9 pr-4 py-2 rounded-lg font-mono text-xs outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 shadow-sm w-full sm:w-64"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsEscalateModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-mono text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(230,25,55,0.35)] transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">add_alert</span>
              <span>Manual Triage Escalation</span>
            </button>
          </div>
        </section>

        {/* SECTION 1: LIVE CLINICAL DISPATCH TRIAGE */}
        <section className="bg-[#15161c] border border-[#2a171a] rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-[#181922] border-b border-[#2a171a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-red-600 rounded-full shadow-[0_0_8px_rgba(230,25,55,0.8)]" />
              <div>
                <h2 className="font-headline text-base font-bold text-white">
                  Live Clinical Dispatch Triage
                </h2>
                <p className="text-xs text-slate-400">
                  Autonomous proximity matching active via encrypted spatial polygons. Sub-minute transit routing.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#231a22] border border-[#3d2028] text-white rounded-lg font-mono text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">tune</span>
                <span>Triage Auto-Sorter: On</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#1a1b22] border border-[#2c2733] rounded-lg font-mono text-xs text-slate-400">
                Syncing in 4s
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#13141a] text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-[#2a171a]">
                  <th className="py-3 px-4">Request ID & Timeline</th>
                  <th className="py-3 px-4">Patient & Facility Node</th>
                  <th className="py-3 px-4">Group & Component</th>
                  <th className="py-3 px-4">Triage Tier</th>
                  <th className="py-3 px-4">Spatial Proximity</th>
                  <th className="py-3 px-4">Donor Matching Matrix</th>
                  <th className="py-3 px-4 text-right">Emergency Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24171d]">
                {filteredRequests.map((req) => {
                  const isCritical = req.urgency === 'CRITICAL';
                  return (
                    <tr
                      key={req.id}
                      className={`transition-colors ${
                        isCritical
                          ? 'bg-[#240e14]/60 hover:bg-[#2e1019]/80 border-l-4 border-l-red-600'
                          : 'hover:bg-[#1b1c24]/60'
                      }`}
                    >
                      <td className="py-4 px-4 align-top">
                        <span
                          className={`font-headline text-sm font-bold block leading-none ${
                            isCritical ? 'text-red-400' : 'text-white'
                          }`}
                        >
                          {req.id}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400 mt-1 block">
                          {req.elapsedTime}
                        </span>
                        {req.timeRemaining && (
                          <span
                            className={`font-mono text-[11px] font-bold flex items-center gap-1 mt-0.5 ${
                              isCritical ? 'text-red-400' : 'text-slate-400'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[13px]">timer</span>
                            {req.timeRemaining}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 align-top">
                        <div className="font-headline font-bold text-white">{req.facilityName}</div>
                        <div className="text-slate-400 mt-0.5">{req.patientName}</div>
                        <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-300 bg-[#0f2e22] border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                          <span className="material-symbols-outlined text-[13px]">shield</span>
                          {req.facilityTier}
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 bg-red-600 text-white font-headline text-sm font-extrabold rounded-lg shadow-[0_0_10px_rgba(230,25,55,0.4)]">
                            {req.bloodGroup}
                          </span>
                          <span className="font-mono font-bold text-white">{req.component}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-red-400 block mt-1">
                          {req.unitsRequired} Units Required
                        </span>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[11px] font-bold ${
                            isCritical
                              ? 'bg-red-600 text-white shadow-[0_0_8px_rgba(230,25,55,0.5)]'
                              : 'bg-[#42220f] border border-amber-500/40 text-amber-300'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {isCritical ? 'crisis_alert' : 'warning'}
                          </span>
                          {req.urgency}
                        </span>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <span className="font-bold text-white block font-mono">{req.proximityKm} km</span>
                        <span className="text-slate-400 block text-[11px]">{req.corridorName}</span>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] text-black font-bold font-mono">
                            ✓
                          </span>
                          <span className="font-mono text-xs font-bold text-white">
                            {req.donorMatchingStatus.confirmed} Confirmed
                          </span>
                          <span className="font-mono text-xs text-slate-400">
                            ({req.donorMatchingStatus.contacted} Contacted)
                          </span>
                        </div>
                        <div className="w-36 bg-[#1f1d26] rounded-full h-1.5 overflow-hidden flex border border-[#34242d]">
                          <div className="bg-emerald-400 h-full w-2/3" />
                          <div className="bg-red-600 h-full w-1/3 animate-pulse" />
                        </div>
                        <span className="font-mono text-[11px] text-slate-400 mt-1 block">
                          {req.donorMatchingStatus.riderStatus || req.donorMatchingStatus.details}
                        </span>
                      </td>

                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex flex-col gap-1.5 items-end">
                          <button
                            type="button"
                            onClick={() => onTransitAssigned(req.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded font-mono text-[11px] font-bold shadow-[0_0_12px_rgba(230,25,55,0.35)] transition-all flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[15px]">ac_unit</span>
                            <span>Assign Cold-Chain Transit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Dispatch token for ${req.id} generated:\n\nCarrier: ${req.assignedRider}\nCooler: ${req.coolerBoxId}\nETA: ${req.transitEtaMins} mins`);
                            }}
                            className="bg-[#1b1c24] hover:bg-[#252733] border border-[#2e2026] text-slate-300 px-3 py-1 rounded font-mono text-[11px] font-semibold transition-all"
                          >
                            View Dispatch Token
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 2: DUAL LAYOUT (COLD-CHAIN INVENTORY + SPATIAL MAP TRACKER) */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column: Cold Chain & Component Inventory (8 cols) */}
          <div className="xl:col-span-8 flex flex-col gap-4">
            <div className="bg-[#15161c] border border-[#2a171a] p-5 rounded-xl shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 border-b border-[#2a171a]">
                <div>
                  <h3 className="font-headline text-base font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-400 text-[24px]">thermostat</span>
                    <span>Regional Cold-Chain & Component Inventory</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time IoT telemetry from 14 blood vault nodes and active transit coolers.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#0b291d] border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                  <span className="material-symbols-outlined text-emerald-400 text-[18px]">sensors</span>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-emerald-300 block">
                      Telemetry: 3.4°C [OK]
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 block">
                      Range: 2°C - 6°C PRBC / -30°C FFP
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#121318] text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-[#2a171a]">
                      <th className="py-2.5 px-3">Blood Group</th>
                      <th className="py-2.5 px-3">PRBC (Packed Cells)</th>
                      <th className="py-2.5 px-3">Fresh Frozen Plasma</th>
                      <th className="py-2.5 px-3">Platelet Apheresis</th>
                      <th className="py-2.5 px-3">Whole Blood</th>
                      <th className="py-2.5 px-3">Critical Shelf-Life</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#22161b] font-mono">
                    {inventory.map((item) => {
                      const isAlert = item.shelfLifeType === 'alert';
                      return (
                        <tr key={item.bloodGroup} className="hover:bg-[#1b1c24] transition-colors">
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded font-headline font-bold bg-[#261d24] border border-[#44222d] text-white inline-block">
                              {item.bloodGroup}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`font-bold ${
                                item.prbcUnits < 20 ? 'text-red-400' : 'text-emerald-400'
                              }`}
                            >
                              {item.prbcUnits} Units
                            </span>
                            <span className="text-[10px] text-slate-400 block">{item.prbcStatus}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-white">{item.ffpUnits} Units</span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`font-bold ${
                                item.plateletUnits <= 6 ? 'text-red-400' : 'text-white'
                              }`}
                            >
                              {item.plateletUnits} Units
                            </span>
                            {item.plateletWarning && (
                              <span className="text-[10px] text-red-400 block">
                                {item.plateletWarning}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-white">
                              {item.wholeBloodUnits} Units
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                                isAlert
                                  ? 'text-red-200 bg-[#3f0f17] border border-red-500/30'
                                  : 'text-emerald-300 bg-[#0f2e22] border border-emerald-500/30'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[13px]">
                                {isAlert ? 'alarm' : 'check'}
                              </span>
                              {item.shelfLifeStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 bg-[#121318] border border-[#2a171a] p-3 rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400 text-[18px]">science</span>
                  <span className="text-slate-300">
                    NAT (Nucleic Acid Testing) Batch #992 verified 100% negative for HBV/HCV/HIV-1/2
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Downloading official encrypted NBTC State Inventory Manifest (JSON/CSV)...')}
                  className="bg-[#24171d] hover:bg-[#341d26] border border-[#44222d] text-white px-3 py-1.5 rounded font-mono font-semibold transition-all"
                >
                  Download State Inventory Manifest
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Spatial Corridor & Active Couriers (4 cols) */}
          <div className="xl:col-span-4 flex flex-col gap-4">
            <div className="bg-[#15161c] border border-[#2a171a] p-5 rounded-xl shadow-lg flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-red-400 text-[20px]">near_me</span>
                    <h4 className="font-headline text-base font-bold text-white">Transit Spatial Corridor</h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-300 bg-[#0f2e22] border border-emerald-500/30 px-2 py-0.5 rounded">
                    3 Couriers Live
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Real-time GPS and temperature logs for units in rapid transit across Delhi NCR nodes.
                </p>

                {/* Map Graphic with Telemetry */}
                <div
                  className="w-full h-52 bg-cover bg-center rounded-xl relative overflow-hidden shadow-inner border border-[#301c23]"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDuSVnr3qmskdRfssoYnSTNDer_MgvN2Vq4szXKNwOBw_EgY9yEdzusmmvRlY3QokjcdSFvoM7-cwIUpgY8msFuSMj367P73fmdQdpYYEKDNpVrorIvtmZbpjfOJOnpBIh9uryXHE63XupTlq8Hqz5Kfex4VHn-7w7yS1TRQlSl23dR1WX45IRVmSm1dN6Lpw1GSPNOjH0qHY8J9n5FVYgCPpzp0Uw0Vx3UwUa_nUUlbknaWyLdqRqI')",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/40 to-transparent flex flex-col justify-end p-2.5">
                    <div className="bg-[#15161c]/95 border border-[#3e1d25] backdrop-blur-md p-2 rounded-lg flex items-center justify-between text-white shadow-lg">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                        <span className="font-mono text-xs font-bold text-white">
                          Courier #R-881 (AIIMS Corridors)
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        4.1°C • Box #BX-19
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transit Corridor Telemetry Feed */}
              <div className="mt-4 flex flex-col gap-2 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 bg-[#191a22] border border-[#2b1f28] rounded-lg">
                  <span className="text-slate-400">Safdarjung Node → AIIMS Apex</span>
                  <span className="font-bold text-white">ETA: 4 mins (1.2 km)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#191a22] border border-[#2b1f28] rounded-lg">
                  <span className="text-slate-400">Red Cross Central → RGCI Rohini</span>
                  <span className="font-bold text-white">ETA: 19 mins (8.4 km)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#191a22] border border-[#2b1f28] rounded-lg">
                  <span className="text-slate-400">RML Hospital → Holy Family Node</span>
                  <span className="font-bold text-white">ETA: 11 mins (4.7 km)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: NBTC NATIONAL SERVICE CHARGES & SUBSIDIES STANDARD */}
        <section className="bg-[#15161c] border border-[#2a171a] p-6 rounded-xl shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 gap-4 border-b border-[#2a171a]">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400 text-[24px]">gavel</span>
                <h3 className="font-headline text-base sm:text-lg font-bold text-white">
                  NBTC National Service Charges & Subsidies Standard
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Mandated by National Blood Transfusion Council (NBTC) & Ministry of Health & Family Welfare. Strict non-commercial compliance.
              </p>
            </div>

            <div className="max-w-xl bg-[#230f16] border border-red-500/40 p-3 rounded-lg flex items-start gap-2">
              <span className="material-symbols-outlined text-red-400 text-[20px] mt-0.5">info</span>
              <div>
                <span className="font-mono text-xs font-bold text-red-200 block uppercase tracking-wide">
                  Blood is 100% Free of Charge
                </span>
                <span className="text-xs text-slate-300 block leading-snug">
                  Charges represent processing, NAT viral testing, leukodepletion, cross-matching, and cold storage maintenance only. Blood sale is illegal under Drugs & Cosmetics Act.
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* PRBC Pricing Card */}
            <div className="p-4 bg-[#181922] border border-[#2a171a] rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline text-sm font-bold text-white">PRBC (Packed Red Cells)</span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#261d24] text-slate-300">
                    Per Unit
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Includes automated blood grouping, antibody screening & cross-match.
                </p>
                <div className="space-y-2 mb-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Govt Hospitals:</span>
                    <span className="font-bold text-white">₹1,050 (Standard)</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#0c241a] border border-emerald-500/30 p-2 rounded-lg">
                    <span className="font-bold text-emerald-300">Thalassemia / Hemophilia:</span>
                    <span className="font-headline text-base font-extrabold text-emerald-400">₹0 (100% Free)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Private Bank Max Cap:</span>
                    <span className="font-bold text-white">₹1,550 Max</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between font-mono text-[10px] text-slate-400 border-t border-[#261c22]">
                <span>Gazette Ref: NBTC/2023-REV</span>
                <span className="text-emerald-400 font-bold">Strict Audit Logged</span>
              </div>
            </div>

            {/* Platelet Apheresis Pricing Card */}
            <div className="p-4 bg-[#181922] border border-[#2a171a] rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline text-sm font-bold text-white">Platelet Apheresis (SDP)</span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#261d24] text-slate-300">
                    Single Donor
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Single donor automated cell separation kit & apheresis consumables charge.
                </p>
                <div className="space-y-2 mb-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Govt Institutional Cost:</span>
                    <span className="font-bold text-white">₹9,500</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#0c241a] border border-emerald-500/30 p-2 rounded-lg">
                    <span className="font-bold text-emerald-300">BPL / Oncology Subsidy:</span>
                    <span className="font-headline text-base font-extrabold text-emerald-400">50% Waived</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Statutory Maximum Cap:</span>
                    <span className="font-bold text-red-400">₹11,000 Cap</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between font-mono text-[10px] text-slate-400 border-t border-[#261c22]">
                <span>Apheresis Kit Price Controlled</span>
                <span className="text-emerald-400 font-bold">Zero Margin Rule</span>
              </div>
            </div>

            {/* FFP / Cryo Card */}
            <div className="p-4 bg-[#181922] border border-[#2a171a] rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline text-sm font-bold text-white">FFP / Cryoprecipitate</span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#261d24] text-slate-300">
                    Component Unit
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Separation, -30°C ultra-low freezing, and coagulation factor preservation.
                </p>
                <div className="space-y-2 mb-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Govt Hospital Standard:</span>
                    <span className="font-bold text-white">₹400 / Unit</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#0c241a] border border-emerald-500/30 p-2 rounded-lg">
                    <span className="font-bold text-emerald-300">Trauma Resuscitation Node:</span>
                    <span className="font-headline text-base font-extrabold text-emerald-400">Emergency Grant</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Private Bank Max Cap:</span>
                    <span className="font-bold text-white">₹500 Max</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between font-mono text-[10px] text-slate-400 border-t border-[#261c22]">
                <span>Mandatory Barcode Tagged</span>
                <span className="text-emerald-400 font-bold">Standard Cap</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: IMMUTABLE NBTC REGULATORY AUDIT STREAM */}
        <section className="bg-[#15161c] border border-[#2a171a] rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-[#181922] border-b border-[#2a171a] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-red-400 text-[24px]">policy</span>
              <div>
                <h3 className="font-headline text-sm font-bold text-white">
                  Immutable NBTC Regulatory Audit Stream
                </h3>
                <p className="text-xs text-slate-400">
                  Cryptographically anchored event ledger adhering to DISHA and Indian Digital Personal Data Protection standards.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#10241b] border border-emerald-500/30 text-emerald-300 rounded-lg font-bold">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">lock</span>
                DISHA Compliant
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#10241b] border border-emerald-500/30 text-emerald-300 rounded-lg font-bold">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">visibility_off</span>
                Zero PII Masking
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#10241b] border border-emerald-500/30 text-emerald-300 rounded-lg font-bold">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">dataset</span>
                PostGIS Cryptohash
              </span>
            </div>
          </div>

          <div className="divide-y divide-[#22161b] text-xs">
            {auditLogs.map((log) => {
              const isAlert = log.type === 'triage_upgrade';
              const isDonor = log.type === 'donor_proxy';
              const isCalib = log.type === 'iot_telemetry';

              return (
                <div
                  key={log.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#1c1d27]/70 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isAlert
                          ? 'bg-[#420f18] border border-red-500/40 text-red-300'
                          : isDonor
                          ? 'bg-[#351019] border border-red-500/30 text-red-400'
                          : 'bg-[#0f2e22] border border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isAlert ? 'upgrade' : isDonor ? 'phone_in_talk' : isCalib ? 'ac_unit' : 'verified'}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`font-headline font-bold block ${
                          isAlert ? 'text-red-400' : 'text-white'
                        }`}
                      >
                        {log.title}
                      </span>
                      <span className="text-slate-400 text-xs block leading-relaxed">
                        {log.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between font-mono text-xs text-slate-400 shrink-0">
                    <span className="font-bold text-white">{log.timestamp}</span>
                    <span className="text-[11px]">{log.officer}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Manual Triage Escalation Modal */}
      {isEscalateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#161720] border border-red-800/80 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                <h3 className="font-headline text-lg font-bold text-white">
                  Manual Code Red Escalation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEscalateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Triggering manual triage immediately alerts all nodal blood banks within 25km and requests emergency police green corridor dispatch.
            </p>

            <form onSubmit={handleEscalateSubmit} className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-slate-300 uppercase">Target Blood Group</label>
                <select
                  value={escalateGroup}
                  onChange={(e) => setEscalateGroup(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0b0c10] border border-red-900/60 rounded-xl text-white focus:outline-none focus:border-red-500"
                >
                  {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 uppercase">Emergency Units Required</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={escalateUnits}
                  onChange={(e) => setEscalateUnits(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0b0c10] border border-red-900/60 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 uppercase">Clinical Condition / Ward Reason</label>
                <input
                  type="text"
                  required
                  value={escalateDetails}
                  onChange={(e) => setEscalateDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0b0c10] border border-red-900/60 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsEscalateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg"
                >
                  Dispatch Priority Flash SOS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
