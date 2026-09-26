import React, { useState } from 'react';
import { HospitalFacility, BloodGroup, BloodComponent } from '../types/bloodConnect';

interface HospitalNetworkViewProps {
  hospitals: HospitalFacility[];
  onNavigate: (view: string) => void;
  onReserve: (hosp: HospitalFacility, group: BloodGroup, component: BloodComponent) => void;
}

export const HospitalNetworkView: React.FC<HospitalNetworkViewProps> = ({
  hospitals,
  onNavigate,
  onReserve,
}) => {
  const [cityFilter, setCityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHospitals = hospitals.filter((h) => {
    const matchesCity = cityFilter === 'all' || h.city.toLowerCase() === cityFilter.toLowerCase();
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 py-8 gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#2e1318] pb-6">
        <div>
          <div className="flex items-center gap-2 text-red-500 font-mono text-xs uppercase tracking-widest font-bold">
            <span className="material-symbols-outlined text-[18px]">domain</span>
            Institutional Federation Matrix
          </div>
          <h1 className="font-headline text-3xl font-bold text-white tracking-tight mt-1">
            Nationwide Hospital & Blood Bank Network
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Certified government apex institutions, autonomous medical college blood centres, and licensed NABH emergency transfusion nodes across India.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
            1,420 Certified Hubs
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#1a1215] border border-red-900/60 text-red-300 font-mono text-xs font-semibold">
            99.8% Cold-Chain
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#14151c] border border-[#3b1218] p-4 rounded-xl shadow-lg">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hospital name, address, or trauma level..."
            className="w-full pl-9 pr-4 py-2 bg-[#0b0c10] border border-[#2e171c] text-white rounded-xl text-xs font-mono focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="font-mono text-xs text-slate-400 whitespace-nowrap">State/City:</span>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 bg-[#0b0c10] border border-[#2e171c] text-white rounded-xl text-xs font-mono focus:outline-none focus:border-red-500"
          >
            <option value="all">All Metros & Corridors</option>
            <option value="New Delhi">Delhi NCR</option>
            <option value="Mumbai">Mumbai & MMR</option>
            <option value="Bengaluru">Bengaluru Urban</option>
            <option value="Hyderabad">Hyderabad Metro</option>
          </select>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="bg-[#14151c] border border-[#311c21] rounded-2xl p-5 shadow-lg flex flex-col justify-between gap-5 hover:border-red-500/50 transition-all group"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  {hosp.level}
                </span>
                <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">navigation</span>
                  {hosp.distanceKm} km
                </span>
              </div>

              <h3 className="font-headline text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                {hosp.name}
              </h3>
              <span className="text-xs text-slate-400">{hosp.type}</span>
              <p className="text-xs text-slate-400 mt-1">{hosp.address}</p>
            </div>

            {/* Live Inventory Preview */}
            <div className="p-3 bg-[#0d0e12] border border-[#2b171c] rounded-xl flex items-center justify-between font-mono text-xs">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] uppercase">PRBC (O+)</span>
                <span className="font-bold text-emerald-400 text-sm">{hosp.stockPrbcOPlus} Units</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] uppercase">PRBC (O-)</span>
                <span className="font-bold text-red-400 text-sm">{hosp.stockPrbcONeg} Units</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-slate-400 text-[10px] uppercase">Cold-Chain</span>
                <span className="font-bold text-emerald-400 text-[11px] flex items-center gap-0.5 justify-end">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  Pass
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-white/5">
              <button
                type="button"
                onClick={() => onReserve(hosp, 'O-', 'PRBC')}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-red-600 to-[#b7001e] text-white font-mono text-xs font-bold hover:from-[#ff2b49] hover:to-red-600 transition-all shadow-md flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">send_time_extension</span>
                <span>Direct Requisition</span>
              </button>
              <a
                href={`tel:${hosp.contactNumber.split('/')[0].trim()}`}
                className="w-10 h-10 rounded-xl bg-[#1f2029] border border-[#381c22] text-slate-300 hover:text-white flex items-center justify-center hover:bg-[#2a171d] transition-colors"
                title={`Call ${hosp.contactNumber}`}
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
