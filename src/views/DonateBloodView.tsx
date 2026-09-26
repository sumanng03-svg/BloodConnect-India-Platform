import React, { useState } from 'react';
import { DonorProfile, DonationArchiveRecord } from '../types/bloodConnect';
import { DonorIdTokenModal } from '../components/DonorIdTokenModal';

interface DonateBloodViewProps {
  donor: DonorProfile;
  archives: DonationArchiveRecord[];
  onUpdateDonor: (updated: Partial<DonorProfile>) => void;
  onAddArchiveRecord: (record: DonationArchiveRecord) => void;
  onNavigate: (view: string) => void;
}

export const DonateBloodView: React.FC<DonateBloodViewProps> = ({
  donor,
  archives,
  onUpdateDonor,
  onAddArchiveRecord,
  onNavigate,
}) => {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineHospital, setDeclineHospital] = useState('');
  const [declineReason, setDeclineReason] = useState('distance');

  // Emergency SOS Card acceptance states
  const [safdarjungAccepted, setSafdarjungAccepted] = useState(false);
  const [aiimsAccepted, setAiimsAccepted] = useState(false);

  // "I Donated Blood" Hub Form State
  const [linkedReqId, setLinkedReqId] = useState('#BCI-2025-99214');
  const [selectedCenter, setSelectedCenter] = useState('Safdarjung Blood Centre, New Delhi');
  const [donationDateTime, setDonationDateTime] = useState('2025-01-10T11:30');
  const [donatedComponent, setDonatedComponent] = useState('Packed Red Blood Cells (PRBC - 450ml)');
  const [uploadedSlipName, setUploadedSlipName] = useState('safdarjung_donation_slip_99214.pdf (1.4 MB)');
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Preference slider
  const [radiusVal, setRadiusVal] = useState(donor.notificationRadiusKm);
  const [dndChecked, setDndChecked] = useState(donor.dndNightProtocol);
  const [hideDistrictChecked, setHideDistrictChecked] = useState(donor.hidePreciseDistrict);

  const handleAcceptSOS = (hospitalName: string, reqId: string) => {
    const ok = window.confirm(
      `CONFIRM IMMEDIATE DISPATCH:\n\nYou are committing to arrive at ${hospitalName} within 90 minutes. Clinical staff will be alerted and your transit fast-pass activated.\n\nProceed to live secure navigation?`
    );
    if (ok) {
      if (hospitalName.includes('Safdarjung')) setSafdarjungAccepted(true);
      if (hospitalName.includes('AIIMS')) setAiimsAccepted(true);
      alert(`Transit Protocol Activated! Emergency coordinator at ${hospitalName} informed. Tracking ID: ${reqId}`);
    }
  };

  const handleDeclineConfirm = () => {
    setIsDeclineModalOpen(false);
    alert(
      `Alert for ${declineHospital} declined (${declineReason}). System has automatically rerouted notification to the next nearest O- reserve donor.`
    );
  };

  const handleShareToCircle = (hospital: string, component: string) => {
    if (navigator.share) {
      navigator.share({
        title: `Emergency Blood Need: ${hospital}`,
        text: `Urgent need for ${component} at ${hospital} via BloodConnect India verified corridor.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert(`Emergency Dispatch link copied to clipboard for ${hospital}! Share with family and donor groups.`);
    }
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSubmitting(true);

    setTimeout(() => {
      setClaimSubmitting(false);
      setClaimSuccess(true);
      const newArchive: DonationArchiveRecord = {
        id: `REC-${Date.now().toString().slice(-4)}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        bloodCentre: selectedCenter,
        licenseNumber: 'Lic: DL-BB-2024-REG',
        componentAndVol: donatedComponent,
        clinicalCertNumber: `#NACO-DL-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'Clinically Verified',
      };
      onAddArchiveRecord(newArchive);
      onUpdateDonor({
        totalDonations: donor.totalDonations + 1,
        livesTouched: donor.livesTouched + 3,
        lastDonationDaysAgo: 0,
      });
      alert(
        `Donation Claim Logged!\n\nReference: #CLM-2025-${Math.floor(10000 + Math.random() * 90000)}\nBlood Bank Medical Officer has received your submission. Your NACO Certificate & updated badge will reflect in 4 hours after bag inventory reconciliation.`
      );
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="relative w-full max-w-7xl mx-auto px-4 flex flex-col gap-8 pt-4">
        {/* TOP DONOR PROFILE BAR */}
        <section className="w-full bg-[#14151c]/90 border border-[#2e141a] rounded-2xl p-6 shadow-2xl backdrop-blur-md flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
            {/* Donor Avatar with Verified Badge Overlay */}
            <div className="relative w-20 h-20 rounded-xl bg-[#1c1d27] border border-red-900/40 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
              <img
                className="w-full h-full object-cover"
                alt="Portrait of Vikramaditya Sharma voluntary donor"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpgXRZCAuwBTtZDC2rTbZjIEmxCAs7BjlCyhWRB87p8i1aJ6iT8kGpWSIie9QdZhcqgKpHfDJCzOOJcPukTawNw9AvGBxq0jlf2xTvGB_qHZ_pmyBEx9YIKQjo3nBl8oPVebF1IMG-Ldt_cWRznR9qPFAmnJYaKI04lpUKV9pv2ElcV7wtmELa3amoDgC9L3Lw18aivDOkBn84Gv4HfO7DPYNKHZamRdmqUUheReeBDRlILqQ5ESMt"
              />
              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-md font-bold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-headline text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {donor.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-semibold">
                  <span className="material-symbols-outlined text-[13px]">shield</span>
                  Verified Active Donor
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs font-bold text-red-300 px-2 py-0.5 rounded bg-red-950/80 border border-red-700/60">
                    O Negative
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    (Universal Donor • Critical Reserve)
                  </span>
                </div>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-200">
                  <span className="material-symbols-outlined text-red-500 text-[16px]">favorite</span>
                  <strong className="text-white font-semibold">{donor.totalDonations} Donations</strong> ({donor.livesTouched} Lives Touched)
                </span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  Last donated: {donor.lastDonationDaysAgo} days ago (Eligible Today)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Toggles & Dispatch Status */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start xl:justify-end gap-3 pt-2 xl:pt-0 relative z-10">
            {/* Live Dispatch Availability Pill Toggle */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#1b1a23] border border-red-950/70 shadow-inner">
              <div className="relative flex items-center justify-center">
                <span
                  className={`w-3 h-3 rounded-full animate-ping absolute inline-flex ${
                    donor.availableForSos ? 'bg-emerald-400' : 'bg-gray-500'
                  }`}
                />
                <span
                  className={`w-2.5 h-2.5 rounded-full relative inline-flex ${
                    donor.availableForSos ? 'bg-emerald-400' : 'bg-gray-500'
                  }`}
                />
              </div>

              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Emergency Dispatch
                </span>
                <span
                  className={`font-mono text-xs font-bold ${
                    donor.availableForSos ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {donor.availableForSos ? 'AVAILABLE FOR SOS' : 'STANDBY PAUSED'}
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer ml-2">
                <input
                  type="checkbox"
                  checked={donor.availableForSos}
                  onChange={(e) => onUpdateDonor({ availableForSos: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#262835] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
              </label>
            </div>

            {/* Rapid Barcode ID Pill */}
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#1d1f2b] hover:bg-[#282a3b] border border-white/10 transition-colors flex items-center gap-2 text-slate-200 hover:text-white font-mono text-xs shadow-md"
            >
              <span className="material-symbols-outlined text-[18px] text-red-400">qr_code_2</span>
              <span>Donor ID Token</span>
            </button>
          </div>
        </section>

        {/* MAIN TWO COLUMN WORKSPACE */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Nearby Compatible Emergency Dispatches (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
                <h2 className="font-headline text-lg font-bold text-white">Emergency Demands Match</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 font-mono text-xs font-semibold">
                2 Critical Alerts
              </span>
            </div>

            {/* EMERGENCY CARD 1: SAFDARJUNG HOSPITAL */}
            <article className="bg-[#14151d] border border-[#38161d] rounded-2xl shadow-xl overflow-hidden relative transition-all hover:border-red-600/50 hover:shadow-2xl">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 to-red-700 shadow-[0_0_12px_#ef4444]" />
              <div className="p-5 flex flex-col gap-4 pl-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] uppercase font-bold tracking-wider shadow-sm">
                        CODE RED SOS
                      </span>
                      <span className="font-mono text-xs text-slate-400 font-semibold">Trauma Care Center</span>
                    </div>
                    <h3 className="font-headline text-base sm:text-lg font-bold text-white mt-1">
                      Safdarjung Hospital, New Delhi
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[11px] text-slate-400 block">Needed within</span>
                    <span className="font-headline text-base font-bold text-red-400 animate-pulse">
                      84 mins
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#191b24] border border-white/5 rounded-xl p-3 text-center">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-slate-400 uppercase">Target Units</span>
                    <span className="font-headline text-base font-bold text-red-400">2 Units O-</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-slate-400 uppercase">Approx. Distance</span>
                    <span className="font-headline text-base font-bold text-slate-200">~4.1 km</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-slate-400 uppercase">Trauma Node</span>
                    <span className="font-headline text-base font-bold text-slate-200">ICU Ward 4</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">lock</span>
                  <span>Patient identifiers sealed under DISHA Act 2024. Obfuscated corridor routing.</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  {safdarjungAccepted ? (
                    <div className="w-full py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">navigation</span>
                      <span>Transit Active (Safdarjung Trauma Node Informed)</span>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAcceptSOS('Safdarjung Hospital', 'BCI-2025-99214')}
                        className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/70 border border-red-500/50"
                      >
                        <span className="material-symbols-outlined text-[18px]">near_me</span>
                        <span>Accept & Open Transit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeclineHospital('Safdarjung Hospital');
                          setIsDeclineModalOpen(true);
                        }}
                        className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#20222e] hover:bg-[#2b2d3d] text-slate-300 hover:text-white border border-white/10 font-mono text-xs font-semibold transition-colors"
                      >
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>

            {/* URGENT CARD 2: AIIMS TRAUMA CENTER */}
            <article className="bg-[#14151d] border border-[#38161d] rounded-2xl shadow-xl overflow-hidden relative transition-all hover:border-red-600/50 hover:shadow-2xl">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-500 to-red-800" />
              <div className="p-5 flex flex-col gap-4 pl-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-600/60 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-wider">
                        URGENT APHERESIS
                      </span>
                      <span className="font-mono text-xs text-slate-400 font-semibold">Haematology Unit</span>
                    </div>
                    <h3 className="font-headline text-base sm:text-lg font-bold text-white mt-1">
                      AIIMS Trauma Center, Ring Road
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[11px] text-slate-400 block">Requested by</span>
                    <span className="font-mono text-xs font-bold text-slate-200">8:00 PM Today</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#191b24] border border-white/5 rounded-xl p-3 text-center">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-slate-400 uppercase">Component</span>
                    <span className="font-headline text-base font-bold text-red-400">Platelets</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-slate-400 uppercase">Approx Range</span>
                    <span className="font-headline text-base font-bold text-slate-200">~6.8 km</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-slate-400 uppercase">Crossmatch Status</span>
                    <span className="font-headline text-base font-bold text-emerald-400">Pre-Cleared</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">security</span>
                  <span>Direct coordination handled via NACO Emergency Routing Engine.</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  {aiimsAccepted ? (
                    <div className="w-full py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Accepted for Apheresis Session</span>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAcceptSOS('AIIMS Trauma Center', 'BCI-2025-44109')}
                        className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#222432] hover:bg-red-950/60 border border-red-900/60 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px] text-emerald-400">
                          check_circle
                        </span>
                        <span>Accept Request</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShareToCircle('AIIMS Trauma Center', 'O- Platelets')}
                        className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#1a1b24] hover:bg-[#252733] border border-white/10 text-slate-300 hover:text-white font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[18px]">share</span>
                        <span>Share to Circle</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>

            {/* PRIVACY PREFERENCE ACCORDION / CARD */}
            <section className="bg-[#14151d] border border-[#2e141a] rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">tune</span>
                  <h3 className="font-headline text-base font-bold text-white">
                    Dispatch & Geofence Preferences
                  </h3>
                </div>
                <span className="font-mono text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Privacy Guard Active
                </span>
              </div>

              {/* Radius Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-300 font-semibold">SOS Alert Notification Radius</span>
                  <span className="font-bold text-red-400 font-headline text-sm">{radiusVal} km</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="50"
                  value={radiusVal}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setRadiusVal(val);
                    onUpdateDonor({ notificationRadiusKm: val });
                  }}
                  className="w-full accent-red-600 cursor-pointer h-2 bg-[#20222e] rounded-lg"
                />
                <div className="flex justify-between font-mono text-[10px] text-slate-400">
                  <span>3 km (Neighborhood)</span>
                  <span>50 km (NCR Regional)</span>
                </div>
              </div>

              {/* Discrete Toggles */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#191b24] border border-white/5">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-semibold text-white">
                      Do Not Disturb (Night Protocol)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Mute requests between 11:00 PM – 06:00 AM unless Code Red
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dndChecked}
                    onChange={(e) => {
                      setDndChecked(e.target.checked);
                      onUpdateDonor({ dndNightProtocol: e.target.checked });
                    }}
                    className="accent-red-600 w-5 h-5 cursor-pointer bg-[#222432] rounded border-white/20"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#191b24] border border-white/5">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-semibold text-white">
                      Hide Precise District Info
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Only verified tertiary trauma coordinators can view your sub-locality
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hideDistrictChecked}
                    onChange={(e) => {
                      setHideDistrictChecked(e.target.checked);
                      onUpdateDonor({ hidePreciseDistrict: e.target.checked });
                    }}
                    className="accent-red-600 w-5 h-5 cursor-pointer bg-[#222432] rounded border-white/20"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Verification, Self-Reporting Hub & Archive (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* MODULE 1: CLINICAL LIVENESS & BIOMETRIC VERIFICATION */}
            <section className="bg-[#14151d] border border-[#2e141a] rounded-2xl p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/40">
                    <span className="material-symbols-outlined text-[28px]">enhanced_encryption</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline text-base sm:text-lg font-bold text-white">
                        Biometric Liveness & Aadhaar Authentication
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 font-mono text-[10px] font-bold">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Compliant with NBTC Clinical Verification Standards & ISO 30107-3 Liveness
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end">
                  <span className="font-mono text-xs text-slate-400 font-semibold">
                    Liveness Confidence
                  </span>
                  <span className="font-headline text-2xl font-extrabold text-emerald-400">
                    {donor.livenessConfidence}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-[#191b24] border border-white/5 flex flex-col gap-1">
                  <span className="font-mono text-[11px] text-slate-400">Verified Document</span>
                  <span className="font-mono text-xs font-bold text-white flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
                    Aadhaar (UIDAI Masked)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#191b24] border border-white/5 flex flex-col gap-1">
                  <span className="font-mono text-[11px] text-slate-400">Session Timestamp</span>
                  <span className="font-mono text-xs font-bold text-slate-200">08 Jan 2025, 14:22 IST</span>
                </div>
                <div className="p-3 rounded-xl bg-[#191b24] border border-white/5 flex flex-col gap-1">
                  <span className="font-mono text-[11px] text-slate-400">Audit Hash</span>
                  <span className="font-mono text-xs font-bold text-red-300">{donor.auditHash}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#1c1d27] border border-red-950/50 font-mono text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-red-400">info</span>
                  <span>Verification architecture active in Demo/Sandbox mode with ISO 30107-3 simulation.</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Biometric depth re-verification complete. 99.4% confidence re-anchored.')}
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
                >
                  Re-check
                </button>
              </div>
            </section>

            {/* MODULE 2: "I DONATED BLOOD" SELF-REPORTING WORKFLOW HUB */}
            <section className="bg-[#14151d] border border-[#2e141a] rounded-2xl p-6 shadow-xl flex flex-col gap-5">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-400">
                      <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                    </span>
                    <h2 className="font-headline text-lg font-bold text-white">"I Donated Blood" Hub</h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Submit your authorized donation slip to mint certified donor hours and unlock your NACO Certificate.
                  </p>
                </div>
                <span className="px-3 py-1 rounded bg-[#1e202d] border border-white/10 font-mono text-[11px] text-slate-300 font-semibold">
                  Self-Claim Protocol v3.2
                </span>
              </div>

              {/* 3-Step Lifecycle Tracker */}
              <div className="w-full bg-[#191b24] border border-white/5 rounded-xl p-4">
                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Verification Chain
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex items-start gap-2 p-2 bg-[#13141a] border border-emerald-900/40 rounded-lg shadow-sm">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                      1
                    </span>
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-white">Donation Reported</span>
                      <span className="text-[11px] text-emerald-400 font-semibold">Completed by Donor</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 bg-[#13141a] border border-white/5 rounded-lg shadow-sm">
                    <span className="w-6 h-6 rounded-full bg-[#2a2c3a] text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                      2
                    </span>
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-slate-200">Clinical Review</span>
                      <span className="text-[11px] text-slate-400">Blood Bank MO Sign-off</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 bg-[#13141a] border border-white/5 rounded-lg shadow-sm">
                    <span className="w-6 h-6 rounded-full bg-[#1c1d27] text-slate-500 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                      3
                    </span>
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-slate-300">Digital Certificate</span>
                      <span className="text-[11px] text-slate-400">NACO Badge Issued</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleClaimSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs font-semibold text-slate-200">
                      Linked Emergency Request ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={linkedReqId}
                        onChange={(e) => setLinkedReqId(e.target.value)}
                        className="w-full px-3.5 py-2 bg-[#191b25] border border-white/10 text-white font-mono text-xs rounded-lg outline-none focus:border-red-500 shadow-inner"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-2 text-emerald-400 text-[18px]">
                        verified
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">Auto-linked from accepted dispatch SOS</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs font-semibold text-slate-200">
                      Hospital / Blood Centre
                    </label>
                    <select
                      value={selectedCenter}
                      onChange={(e) => setSelectedCenter(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#191b25] border border-white/10 text-white font-mono text-xs rounded-lg outline-none focus:border-red-500 shadow-inner cursor-pointer"
                    >
                      <option value="Safdarjung Blood Centre, New Delhi">
                        Safdarjung Blood Centre, New Delhi
                      </option>
                      <option value="AIIMS Regional Transfusion Center">
                        AIIMS Regional Transfusion Center
                      </option>
                      <option value="Red Cross Society Blood Bank, Central Delhi">
                        Red Cross Society Blood Bank, Central Delhi
                      </option>
                      <option value="Max Super Speciality Blood Bank, Saket">
                        Max Super Speciality Blood Bank, Saket
                      </option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs font-semibold text-slate-200">
                      Date & Time of Donation
                    </label>
                    <input
                      type="datetime-local"
                      value={donationDateTime}
                      onChange={(e) => setDonationDateTime(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#191b25] border border-white/10 text-white font-mono text-xs rounded-lg outline-none focus:border-red-500 shadow-inner [color-scheme:dark]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs font-semibold text-slate-200">
                      Component Donated
                    </label>
                    <select
                      value={donatedComponent}
                      onChange={(e) => setDonatedComponent(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#191b25] border border-white/10 text-white font-mono text-xs rounded-lg outline-none focus:border-red-500 shadow-inner cursor-pointer"
                    >
                      <option value="Packed Red Blood Cells (PRBC - 450ml)">
                        Packed Red Blood Cells (PRBC - 450ml)
                      </option>
                      <option value="Single Donor Platelets (SDP)">
                        Single Donor Platelets (SDP)
                      </option>
                      <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                      <option value="Whole Blood (WB - 350ml)">Whole Blood (WB - 350ml)</option>
                    </select>
                  </div>
                </div>

                {/* Slip Upload & Document Preview */}
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs font-semibold text-slate-200">
                    Upload Official Blood Donation Slip / Card
                  </label>
                  <div className="p-4 rounded-xl bg-[#191b25] border border-white/5 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-24 h-24 rounded-lg bg-[#111218] border border-red-950/70 shadow-sm shrink-0 overflow-hidden flex items-center justify-center relative group">
                      <img
                        className="w-full h-full object-cover opacity-85"
                        alt="Blood donation official clinical stamped slip"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzrNXLiW0sUUYKHXmAjZk_W1cuqzHGloG_ECjTSl5Q7E4T9xQh1KBKtOAljRuR5CcDxSw_15IPSupMtWoF9cgfMeQMn5g76WhNhyBvGFraob3VT8fqCbj1MptUFDhuTpv6qeEkRHvddMkiG2DGRWWwZF5G1MJ0Cu0mV7SNBenMobsIksBw5MnHxweXBpCPIDXpqyKO-nEsLydJpaztnK1xeCECDFvUMKLgRTlTYmd-enQtMC45oz7M"
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white text-[20px]">zoom_in</span>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <label className="px-4 py-2 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-white font-mono text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer">
                          <span className="material-symbols-outlined text-[16px] text-red-300">
                            upload_file
                          </span>
                          <span>Select Certificate / Slip</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setUploadedSlipName(`${e.target.files[0].name} (${(e.target.files[0].size / 1024 / 1024).toFixed(1)} MB)`);
                              }
                            }}
                          />
                        </label>
                        <span className="font-mono text-xs text-emerald-400 font-bold truncate max-w-xs">
                          {uploadedSlipName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Ensure Medical Officer signature, Unit Bag No, and Hemoglobin reading are clearly legible.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-xs">
                    <span className="material-symbols-outlined text-[16px] text-emerald-400">
                      health_and_safety
                    </span>
                    <span>Protected by NBTC Donor Integrity System</span>
                  </div>

                  <button
                    type="submit"
                    disabled={claimSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 border border-red-500/50 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-red-950/70 flex items-center gap-2"
                  >
                    {claimSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[18px]">
                          progress_activity
                        </span>
                        <span>Validating with Blood Bank...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        <span>Submit Claim for Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>

            {/* MODULE 3: DONATION HISTORY TABLE */}
            <section className="bg-[#14151d] border border-[#2e141a] rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400 text-[20px]">history</span>
                  <h3 className="font-headline text-base sm:text-lg font-bold text-white">
                    Verified Clinical Donation Archive
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Downloading official NACO-certified donor transcript PDF...')}
                  className="font-mono text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Export All Records (PDF)</span>
                  <span className="material-symbols-outlined text-[14px]">download</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#1b1c26] text-slate-300 font-mono text-[11px] uppercase border-b border-white/5">
                      <th className="py-2.5 px-3 rounded-l-lg">Date & Time</th>
                      <th className="py-2.5 px-3">Blood Centre</th>
                      <th className="py-2.5 px-3">Component & Vol</th>
                      <th className="py-2.5 px-3">Clinical Cert #</th>
                      <th className="py-2.5 px-3 rounded-r-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {archives.map((rec) => (
                      <tr key={rec.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-3 font-semibold text-white">{rec.date}</td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-200 block">{rec.bloodCentre}</span>
                          <span className="font-mono text-[10px] text-slate-400">{rec.licenseNumber}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-300">{rec.componentAndVol}</td>
                        <td className="py-3 px-3 font-mono text-red-300">{rec.clinicalCertNumber}</td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
                            <span className="material-symbols-outlined text-[12px]">verified</span>
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Decline Reason Modal */}
      {isDeclineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#161720] border border-[#3e171e] rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-base font-bold text-white">
                Decline Urgent Dispatch
              </h3>
              <button
                type="button"
                onClick={() => setIsDeclineModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reporting an accurate decline reason helps the dispatch network instantly route the notification to the next nearest O- donor without losing critical minutes.
            </p>
            <div className="flex flex-col gap-2 font-mono text-xs">
              {[
                { val: 'distance', label: 'Currently travelling / Out of 15km area' },
                { val: 'health', label: 'Mild illness / Medication in last 48 hours' },
                { val: 'unreachable', label: 'Work / Personal commitment constraint' },
              ].map((opt) => (
                <label
                  key={opt.val}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#1d1f2b] border border-white/5 cursor-pointer hover:bg-[#252737] text-slate-200"
                >
                  <input
                    type="radio"
                    name="declineReason"
                    checked={declineReason === opt.val}
                    onChange={() => setDeclineReason(opt.val)}
                    className="accent-red-600"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeclineModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:text-white font-mono text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeclineConfirm}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 border border-red-500/50 text-white font-mono text-xs font-bold shadow-md"
              >
                Confirm & Pass to Next Donor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Fast Pass Modal */}
      <DonorIdTokenModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        donor={donor}
      />
    </div>
  );
};
