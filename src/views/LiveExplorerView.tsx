import React, { useState } from 'react';
import { BloodGroup, BloodComponent } from '../types/bloodConnect';

interface LiveExplorerViewProps {
  onNavigate: (view: string) => void;
  onQuickReserve: (bloodGroup: BloodGroup, component: BloodComponent, stateName: string) => void;
}

interface StateStockData {
  state: string;
  metroHub: string;
  activeBanks: number;
  stocks: Record<BloodGroup, number>;
  criticalShortage: BloodGroup[];
  telemetryStatus: 'Normal' | 'Shortage Warning' | 'Critical Shortage';
}

const STATE_DATA: StateStockData[] = [
  {
    state: 'Delhi NCR',
    metroHub: 'AIIMS / Safdarjung Corridor',
    activeBanks: 114,
    stocks: {
      'O-': 42,
      'O+': 412,
      'A-': 18,
      'A+': 389,
      'B-': 31,
      'B+': 512,
      'AB-': 9,
      'AB+': 184,
    },
    criticalShortage: ['O-', 'AB-'],
    telemetryStatus: 'Shortage Warning',
  },
  {
    state: 'Maharashtra',
    metroHub: 'Mumbai MMR Apex',
    activeBanks: 284,
    stocks: {
      'O-': 58,
      'O+': 620,
      'A-': 24,
      'A+': 540,
      'B-': 19,
      'B+': 690,
      'AB-': 14,
      'AB+': 260,
    },
    criticalShortage: ['B-'],
    telemetryStatus: 'Shortage Warning',
  },
  {
    state: 'Karnataka',
    metroHub: 'Bengaluru Urban Grid',
    activeBanks: 198,
    stocks: {
      'O-': 64,
      'O+': 510,
      'A-': 32,
      'A+': 430,
      'B-': 40,
      'B+': 580,
      'AB-': 8,
      'AB+': 210,
    },
    criticalShortage: ['AB-'],
    telemetryStatus: 'Critical Shortage',
  },
  {
    state: 'Tamil Nadu',
    metroHub: 'Chennai Core Trauma Hub',
    activeBanks: 176,
    stocks: {
      'O-': 80,
      'O+': 590,
      'A-': 45,
      'A+': 490,
      'B-': 52,
      'B+': 610,
      'AB-': 22,
      'AB+': 240,
    },
    criticalShortage: [],
    telemetryStatus: 'Normal',
  },
  {
    state: 'Telangana',
    metroHub: 'Hyderabad Metro Node',
    activeBanks: 142,
    stocks: {
      'O-': 38,
      'O+': 480,
      'A-': 19,
      'A+': 390,
      'B-': 28,
      'B+': 520,
      'AB-': 11,
      'AB+': 190,
    },
    criticalShortage: ['O-', 'A-'],
    telemetryStatus: 'Shortage Warning',
  },
  {
    state: 'West Bengal',
    metroHub: 'Kolkata Central Hub',
    activeBanks: 165,
    stocks: {
      'O-': 29,
      'O+': 440,
      'A-': 22,
      'A+': 360,
      'B-': 35,
      'B+': 490,
      'AB-': 10,
      'AB+': 175,
    },
    criticalShortage: ['O-'],
    telemetryStatus: 'Critical Shortage',
  },
];

export const LiveExplorerView: React.FC<LiveExplorerViewProps> = ({
  onNavigate,
  onQuickReserve,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedComp, setSelectedComp] = useState<BloodComponent>('PRBC');
  const [stateSearch, setStateSearch] = useState('');

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredStates = STATE_DATA.filter((s) =>
    s.state.toLowerCase().includes(stateSearch.toLowerCase()) ||
    s.metroHub.toLowerCase().includes(stateSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 py-8 gap-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#2e1318] pb-6">
        <div>
          <div className="flex items-center gap-2 text-red-500 font-mono text-xs uppercase tracking-widest font-bold">
            <span className="material-symbols-outlined text-[18px]">travel_explore</span>
            National Blood Grid Live Telemetry
          </div>
          <h1 className="font-headline text-3xl font-bold text-white tracking-tight mt-1">
            Live Blood Availability Explorer
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Real-time verified inventory across state health departments, Red Cross nodes, and regional trauma centers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('request-blood')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-[#b7001e] text-white font-mono text-xs font-bold shadow-lg shadow-red-950/70 hover:from-[#ff2b49] hover:to-red-600 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">crisis_alert</span>
          <span>Initiate Emergency Request</span>
        </button>
      </div>

      {/* Control Strip */}
      <div className="bg-[#14151c] border border-[#3b1218] p-5 rounded-2xl shadow-xl flex flex-col gap-4">
        {/* Component Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400 font-bold uppercase">Component:</span>
            {(['PRBC', 'Platelets', 'FFP', 'Whole Blood'] as BloodComponent[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedComp(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  selectedComp === c
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-[#1b1c24] text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={stateSearch}
              onChange={(e) => setStateSearch(e.target.value)}
              placeholder="Filter state or metro corridor..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#0b0c10] border border-[#2e171c] text-white rounded-xl text-xs font-mono focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Group Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <span className="font-mono text-xs text-slate-400 font-bold uppercase">Blood Group:</span>
          <button
            type="button"
            onClick={() => setSelectedGroup('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              selectedGroup === 'ALL'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-[#1b1c24] text-slate-300 hover:text-white'
            }`}
          >
            All Groups
          </button>
          {bloodGroups.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGroup(g)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedGroup === g
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-[#1b1c24] text-slate-300 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* State Availability Matrix Table */}
      <div className="bg-[#14151c] border border-[#311c21] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#181922] text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-[#2a171a]">
                <th className="py-3 px-4">State & Nodal Corridor</th>
                <th className="py-3 px-4">Active Banks</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Critical Shortages</th>
                <th className="py-3 px-4">Stock Breakdown</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22161b]">
              {filteredStates.map((st) => {
                const isShortage = st.telemetryStatus === 'Critical Shortage';
                const isWarning = st.telemetryStatus === 'Shortage Warning';

                return (
                  <tr key={st.state} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-headline font-bold text-white text-sm block">
                        {st.state}
                      </span>
                      <span className="font-mono text-xs text-slate-400">{st.metroHub}</span>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-white">
                      {st.activeBanks} Verified Hubs
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          isShortage
                            ? 'bg-[#3f0f17] border border-red-500/40 text-red-300'
                            : isWarning
                            ? 'bg-[#42220f] border border-amber-500/40 text-amber-300'
                            : 'bg-[#0f2e22] border border-emerald-500/40 text-emerald-300'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {st.telemetryStatus}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {st.criticalShortage.length > 0 ? (
                        <div className="flex gap-1">
                          {st.criticalShortage.map((bg) => (
                            <span
                              key={bg}
                              className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-xs font-bold"
                            >
                              {bg}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="font-mono text-emerald-400 text-xs font-semibold">
                          Optimal Reserves
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                        {selectedGroup === 'ALL'
                          ? bloodGroups.slice(0, 4).map((g) => (
                              <span
                                key={g}
                                className="px-2 py-0.5 bg-[#0e0f14] border border-[#2b171c] rounded text-slate-300"
                              >
                                {g}: <strong className="text-white">{st.stocks[g]}</strong>
                              </span>
                            ))
                          : (
                            <span className="px-2.5 py-1 bg-red-950 border border-red-600/40 rounded text-red-300 font-bold">
                              {selectedGroup}: {st.stocks[selectedGroup]} Units Available
                            </span>
                          )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          onQuickReserve(
                            selectedGroup === 'ALL' ? 'O-' : selectedGroup,
                            selectedComp,
                            st.state
                          )
                        }
                        className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-colors shadow-sm"
                      >
                        Reserve
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
