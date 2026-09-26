import React, { useState, useEffect } from 'react';
import { BloodGroup, BloodComponent, TriageUrgency, EmergencyRequest } from '../types/bloodConnect';
import { OpenStreetMapModal } from '../components/OpenStreetMapModal';

interface RequestBloodViewProps {
  onNavigate: (view: string) => void;
  onRequestCreated: (newRequest: EmergencyRequest) => void;
}

export const RequestBloodView: React.FC<RequestBloodViewProps> = ({
  onNavigate,
  onRequestCreated,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Form Fields State
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('B+');
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent>('PRBC');
  const [unitsCount, setUnitsCount] = useState(3);
  const [urgencyTier, setUrgencyTier] = useState<TriageUrgency>('CRITICAL');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('Trauma & Hemorrhagic Shock');

  const [patientName, setPatientName] = useState('Rajesh Kumar Verma');
  const [patientAge, setPatientAge] = useState(48);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [hospitalFacility, setHospitalFacility] = useState(
    'Safdarjung Hospital, New Delhi (Apex Tertiary Center)'
  );
  const [wardLocation, setWardLocation] = useState('Trauma ICU - Block B, Bed 14');
  const [physicianName, setPhysicianName] = useState('Dr. V. Sen (MCI-74892)');

  const [targetCoordinates, setTargetCoordinates] = useState('28.5672° N, 77.2100° E');
  const [transitEta, setTransitEta] = useState('12 mins ETA Corridor');

  const [consentStatutory, setConsentStatutory] = useState(true);
  const [consentDpdpa, setConsentDpdpa] = useState(true);

  // SLA Target Timer Countdown
  const [slaSeconds, setSlaSeconds] = useState(6138); // ~01:42:18

  useEffect(() => {
    const timer = setInterval(() => {
      setSlaSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSla = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const remainingSec = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${remainingSec
      .toString()
      .padStart(2, '0')} REMAINING`;
  };

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const diagnosisList = [
    'Trauma & Hemorrhagic Shock',
    'Major Cardiovascular Surgery',
    'Thalassemia Major / Sickle Cell',
    'Chemotherapy-Induced Aplasia',
    'Obstetric Hemorrhage (PPH)',
  ];

  const handleStepSubmit = () => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
    } else if (activeStep === 4) {
      // Create new request and activate live matching in step 5
      const newReq: EmergencyRequest = {
        id: `#BCI-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: 'Just now',
        elapsedTime: 'T+ 00:00:15 elapsed',
        timeRemaining: urgencyTier === 'CRITICAL' ? 'Hypoxia threshold: 18m' : 'Standard 2h buffer',
        patientName: `${patientName} (${patientAge} ${patientGender.charAt(0)})`,
        patientAge,
        patientGender,
        patientCondition: selectedDiagnosis,
        facilityName: hospitalFacility,
        facilityLocation: 'Delhi Trauma Grid',
        facilityTier: 'Apex Level 1',
        wardLocation,
        bloodGroup: selectedGroup,
        component: selectedComponent,
        unitsRequired: unitsCount,
        urgency: urgencyTier,
        proximityKm: 3.2,
        corridorName: 'AIIMS - Safdarjung Express Bypass',
        donorMatchingStatus: {
          confirmed: 1,
          contacted: 3,
          riderStatus: 'Autonomous spatial ping broadcasting',
        },
        crossMatchVerified: false,
        transitEtaMins: 12,
        assignedRider: 'BioCourier NCR Node #04',
        coolerBoxId: 'Box #BX-82 (4.0°C)',
      };
      onRequestCreated(newReq);
      setActiveStep(5);
    }
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* 1. Critical Emergency Triage Banner */}
      <section className="w-full bg-[#111218] border-b border-[#3a141a]/80 px-4 py-4 shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-900 text-white flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(220,38,38,0.45)] ring-1 ring-red-400/30">
              <span className="material-symbols-outlined text-[28px] animate-pulse">crisis_alert</span>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-600/50 text-red-300 text-[11px] font-mono uppercase tracking-wider font-bold">
                  Priority Triage
                </span>
                <span className="text-base font-bold text-white tracking-tight">
                  Emergency Blood Requirement Submission #BCI-REQ-8492
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                <span className="material-symbols-outlined text-[15px] text-emerald-400">verified_user</span>
                Safdarjung Regional Trauma Center Dispatch • Auto-Assigned Officer: Dr. A. Mathur (Trauma Liaison)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-[#220a0f] border border-red-900/60 px-4 py-2.5 rounded-xl shadow-inner">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider">
                Urgency Escalation Tier
              </span>
              <span className="text-sm sm:text-base font-extrabold text-red-300 flex items-center gap-1.5 justify-end">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                {urgencyTier === 'CRITICAL' ? 'CRITICAL / WITHIN 2 HOURS' : 'HIGH PRIORITY DISPATCH'}
              </span>
            </div>
            <div className="h-8 w-px bg-red-900/60 hidden sm:block" />
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-mono text-slate-400 uppercase">SLA Target</span>
              <span className="text-sm font-bold font-mono text-white">{formatSla(slaSeconds)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Step Progress Bar */}
      <section className="w-full bg-[#0d0e13] border-b border-[#231518] py-3.5 px-4">
        <div className="max-w-7xl mx-auto">
          <nav aria-label="Requisition Flow Progress" className="w-full overflow-x-auto">
            <div className="flex items-center justify-between min-w-[720px] py-1">
              {[
                { step: 1, title: 'Requirement' },
                { step: 2, title: 'Patient & Hospital' },
                { step: 3, title: 'Geolocation' },
                { step: 4, title: 'NBTC Consent' },
                { step: 5, title: 'Live Matching' },
              ].map((item, idx) => {
                const isCurrent = activeStep === item.step;
                const isPassed = activeStep > item.step;
                return (
                  <React.Fragment key={item.step}>
                    <button
                      type="button"
                      onClick={() => setActiveStep(item.step)}
                      className="flex items-center gap-2.5 text-left group focus:outline-none"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all duration-200 ${
                          isCurrent
                            ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                            : isPassed
                            ? 'bg-emerald-950 border border-emerald-500 text-emerald-400'
                            : 'bg-[#1b1d28] border border-[#2e3144] text-slate-400'
                        }`}
                      >
                        {isPassed ? '✓' : `0${item.step}`}
                      </div>
                      <div>
                        <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">
                          Step {item.step}
                        </span>
                        <span
                          className={`block text-sm font-semibold ${
                            isCurrent
                              ? 'text-emerald-400 font-bold'
                              : isPassed
                              ? 'text-emerald-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>
                    </button>
                    {idx < 4 && (
                      <div
                        className={`flex-1 h-1 mx-3 rounded-full transition-all ${
                          isPassed ? 'bg-emerald-500/60' : 'bg-[#1e202d]'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </nav>
        </div>
      </section>

      {/* 3. Main Form & Sidebar Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Wizard Container (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* STEP 1: BLOOD REQUIREMENT */}
            {activeStep === 1 && (
              <div className="bg-[#14151a] border border-[#3a141a] p-6 rounded-2xl shadow-xl flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold">
                      Requisition Matrix
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Select Blood Requirement Specifications
                    </h2>
                  </div>
                  <span className="px-3 py-1 bg-[#1e1419] border border-emerald-900/50 text-emerald-400 text-xs font-mono rounded-lg flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">science</span>
                    Clinical Standards
                  </span>
                </div>

                {/* Blood Group Grid */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wide text-slate-300 font-semibold mb-2">
                    Target Patient ABO/Rh(D) Blood Group <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {bloodGroups.map((group) => {
                      const isSelected = selectedGroup === group;
                      return (
                        <button
                          key={group}
                          type="button"
                          onClick={() => setSelectedGroup(group)}
                          className={`py-3 px-2 rounded-xl text-center font-bold text-base transition-all focus:outline-none ${
                            isSelected
                              ? 'bg-red-600 border border-red-400 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                              : 'bg-[#1b1d26] hover:bg-[#252837] border border-[#2d3043] text-slate-200'
                          }`}
                        >
                          {group}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-400">info</span>
                    Selected: <strong className="text-red-400">{selectedGroup}</strong> • Compatible universal donor fallback: O+ / O-
                  </p>
                </div>

                {/* Component Selector */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wide text-slate-300 font-semibold mb-2">
                    Specific Blood Component Requisition <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        val: 'PRBC' as BloodComponent,
                        title: 'PRBC (Packed Red Blood Cells)',
                        desc: 'Trauma resuscitations, severe anemia, intraoperative surgical transfusions.',
                      },
                      {
                        val: 'Platelets' as BloodComponent,
                        title: 'Platelet Concentrate / RDP / SDP',
                        desc: 'Dengue hemorrhagic, acute thrombocytopenia, oncologic marrow support.',
                      },
                      {
                        val: 'FFP' as BloodComponent,
                        title: 'Fresh Frozen Plasma (FFP)',
                        desc: 'Coagulation factor replenishment, massive trauma coagulopathy, liver disease.',
                      },
                      {
                        val: 'Cryo' as BloodComponent,
                        title: 'Cryoprecipitate',
                        desc: 'Hypofibrinogenemia, Hemophilia A, Von Willebrand factor deficits.',
                      },
                    ].map((comp) => (
                      <label
                        key={comp.val}
                        className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-colors border ${
                          selectedComponent === comp.val
                            ? 'bg-[#1b1d26] border-red-600/80'
                            : 'bg-[#121319] border-[#262837] hover:border-[#3d4157]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="blood_comp"
                          checked={selectedComponent === comp.val}
                          onChange={() => setSelectedComponent(comp.val)}
                          className="mt-1 accent-red-600 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white">{comp.title}</span>
                          <span className="text-xs text-slate-400 mt-0.5">{comp.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Units Counter & Urgency Tier */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Units Counter */}
                  <div className="p-4 bg-[#111218] border border-[#2b161c] rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                        Standard Blood Units
                      </span>
                      <p className="text-sm font-bold text-white">Units Required (350ml / 450ml)</p>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <button
                        type="button"
                        onClick={() => setUnitsCount((c) => Math.max(1, c - 1))}
                        className="w-11 h-11 rounded-xl bg-[#1f212d] hover:bg-[#2c2f40] border border-[#373a4d] text-white font-bold text-lg flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <div className="px-5 py-2 bg-[#090a0d] border border-[#3a141a] rounded-xl text-center">
                        <span className="text-2xl font-extrabold text-red-400 font-mono">
                          {unitsCount}
                        </span>
                        <span className="block text-[10px] font-mono uppercase text-slate-400">
                          Units
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUnitsCount((c) => Math.min(10, c + 1))}
                        className="w-11 h-11 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-lg flex items-center justify-center transition-colors shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-slate-400 mt-2">
                      Estimated volume: ~{unitsCount * 350} mL packed {selectedComponent}
                    </span>
                  </div>

                  {/* Urgency Tier */}
                  <div className="flex flex-col gap-2">
                    <label className="block text-xs font-mono uppercase tracking-wide text-slate-300 font-semibold">
                      Clinical Urgency Tier <span className="text-red-400">*</span>
                    </label>
                    <div className="flex flex-col gap-2">
                      {[
                        {
                          val: 'CRITICAL' as TriageUrgency,
                          title: 'Immediate Emergency',
                          desc: '< 2 Hours (Level-1 Dispatch Activation)',
                          icon: 'bolt',
                        },
                        {
                          val: 'URGENT' as TriageUrgency,
                          title: 'Urgent Transfusion',
                          desc: '< 12 Hours (High Priority Alert)',
                          icon: 'schedule',
                        },
                        {
                          val: 'SCHEDULED' as TriageUrgency,
                          title: 'Scheduled / Elective Procedure',
                          desc: '24 - 48 Hours Window',
                          icon: 'event',
                        },
                      ].map((urg) => (
                        <label
                          key={urg.val}
                          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border ${
                            urgencyTier === urg.val
                              ? 'bg-[#260c12] border-red-800/70 text-white shadow-inner'
                              : 'bg-[#14151c] border-[#2b2e3e] text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="urgency_radio"
                              checked={urgencyTier === urg.val}
                              onChange={() => setUrgencyTier(urg.val)}
                              className="accent-red-600"
                            />
                            <div>
                              <span className="text-sm font-bold text-white">{urg.title}</span>
                              <span className="block text-xs text-slate-400">{urg.desc}</span>
                            </div>
                          </div>
                          <span
                            className={`material-symbols-outlined text-[20px] ${
                              urgencyTier === urg.val ? 'text-red-400' : 'text-slate-500'
                            }`}
                          >
                            {urg.icon}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clinical Diagnosis Pills */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wide text-slate-300 font-semibold mb-2">
                    Indication / Primary Clinical Diagnosis <span className="text-red-400">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {diagnosisList.map((diag) => {
                      const isSelected = selectedDiagnosis === diag;
                      return (
                        <button
                          key={diag}
                          type="button"
                          onClick={() => setSelectedDiagnosis(diag)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-red-600 text-white border border-red-400 shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                              : 'bg-[#181a24] text-slate-300 hover:bg-[#222432] border border-[#2c2f42]'
                          }`}
                        >
                          {diag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsMapModalOpen(true)}
                    className="px-3.5 py-2 bg-[#1a1c26] hover:bg-[#242735] border border-[#303447] text-slate-300 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-red-400">map</span>
                    <span>Open Map Coordinates</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold font-mono tracking-wide flex items-center gap-2 shadow-[0_0_16px_rgba(220,38,38,0.4)] transition-all"
                  >
                    <span>Proceed to Patient Details</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PATIENT & ATTENDING HOSPITAL */}
            {activeStep === 2 && (
              <div className="bg-[#14151a] border border-[#3a141a] p-6 rounded-2xl shadow-xl flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold">
                      Institutional Validation
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Patient & Attending Hospital Credentials
                    </h2>
                  </div>
                  <span className="px-3 py-1 bg-[#1e1419] border border-emerald-900/50 text-emerald-400 text-xs font-mono rounded-lg flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">local_hospital</span>
                    NABH/NABL Audited
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wide text-slate-300 font-semibold">
                      Patient Full Legal Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-[#3a141a] text-white text-sm focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wide text-slate-300 font-semibold">
                        Patient Age <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        value={patientAge}
                        onChange={(e) => setPatientAge(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-[#3a141a] text-white text-sm focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wide text-slate-300 font-semibold">
                        Gender <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value as any)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-[#3a141a] text-white text-sm focus:border-red-500 focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wide text-slate-300 font-semibold">
                      Admitted Hospital Facility <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={hospitalFacility}
                        onChange={(e) => setHospitalFacility(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#1b1c24] border border-[#373a4c] text-white text-sm font-semibold focus:outline-none"
                      />
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-emerald-400 text-[18px]">
                        domain_verification
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wide text-slate-300 font-semibold">
                      Ward / Bed / Department Location <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={wardLocation}
                      onChange={(e) => setWardLocation(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-[#3a141a] text-white text-sm focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-mono uppercase tracking-wide text-slate-300 font-semibold">
                      Attending Physician & Registration ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={physicianName}
                      onChange={(e) => setPhysicianName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0c10] border border-[#3a141a] text-white text-sm focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="px-4 py-2 bg-[#181a24] hover:bg-[#222432] border border-[#303345] text-slate-300 rounded-xl text-xs font-mono"
                  >
                    Back to Requirement
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold font-mono tracking-wide flex items-center gap-2 shadow-[0_0_16px_rgba(220,38,38,0.4)]"
                  >
                    <span>Proceed to Geolocation & Delivery</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PRECISE GEOLOCATION & DELIVERY */}
            {activeStep === 3 && (
              <div className="bg-[#14151a] border border-[#3a141a] p-6 rounded-2xl shadow-xl flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold">
                      Cold-Chain Transit Radius
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Precise Geolocation & Hospital Delivery Bay
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMapModalOpen(true)}
                    className="px-3.5 py-1.5 bg-red-950/60 border border-red-700/60 text-red-300 text-xs font-mono rounded-lg flex items-center gap-1.5 hover:bg-red-900 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-red-400">map</span>
                    <span>Open Interactive Map</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#2b171c] text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span>
                      Active Facility Node: <strong>{hospitalFacility}</strong>
                    </span>
                    <span className="text-gray-400 font-mono">
                      Target Coordinates: {targetCoordinates} (Sub-10m GPS Geohash)
                    </span>
                  </div>
                  <span className="text-red-400 font-mono font-bold bg-[#260c12] border border-red-900/60 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                    {transitEta}
                  </span>
                </div>

                {/* Map Mini Preview */}
                <div
                  onClick={() => setIsMapModalOpen(true)}
                  className="relative w-full h-56 rounded-xl overflow-hidden border border-[#3a141a] cursor-pointer group"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center filter invert-[0.92] hue-rotate-[195deg] brightness-[0.78] contrast-[1.25] group-hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBo3yiMSVFdmu4UB1oxeAXbRO91pemKq1nLHe6z-zgBLP51zgkGUmiR2uaFT416DnfhGYMFsvDfHo3DFVAGV5LONQ35H_HXUH75lzaktVtkmo3Z2TjT_NsW6QSDl3q7_JWPdRFY_ky2wLbGDSJJkj69cxJ-6YJ-uCH2XlDwKBsYg-i0y6RMuBfdFXOnPhNEbq8tzNzkJznfZad8pT8wnr6hHk4FvGWVoLoiPQSyTSezyJ6RzMWbOlXy')",
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="px-4 py-2 rounded-xl bg-red-600/90 text-white font-mono text-xs font-bold shadow-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">explore</span>
                      <span>Click to Re-position Delivery Coordinates</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="px-4 py-2 bg-[#181a24] hover:bg-[#222432] border border-[#303345] text-slate-300 rounded-xl text-xs font-mono"
                  >
                    Back to Patient Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(4)}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold font-mono tracking-wide flex items-center gap-2 shadow-[0_0_16px_rgba(220,38,38,0.4)]"
                  >
                    <span>Proceed to NBTC Verification</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: VERIFICATION & CONSENT */}
            {activeStep === 4 && (
              <div className="bg-[#14151a] border border-[#3a141a] p-6 rounded-2xl shadow-xl flex flex-col gap-6 animate-in fade-in duration-200">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold">
                    Statutory Undertaking
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Requester Verification & Clinical Undertaking
                  </h2>
                </div>

                <div className="p-4 rounded-xl bg-[#260c12] border border-red-800/70 text-slate-300 text-xs leading-relaxed">
                  <p className="font-semibold text-white mb-1">
                    Mandatory Declaration under NBTC Regulations 2024 & Drugs and Cosmetics Act:
                  </p>
                  I hereby certify under statutory penalty that this requisition is exclusively for therapeutic patient treatment at {hospitalFacility}. Human blood or blood components will never be bought, sold, or transferred commercially.
                </div>

                <div className="flex flex-col gap-3">
                  <label className="flex items-start gap-3 p-3 bg-[#0d0e12] border border-[#262837] rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentStatutory}
                      onChange={(e) => setConsentStatutory(e.target.checked)}
                      className="mt-1 accent-red-600"
                    />
                    <div className="text-xs text-slate-300">
                      I confirm that the requisition details and medical condition are authenticated by an authorized registered medical practitioner ({physicianName}).
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-[#0d0e12] border border-[#262837] rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentDpdpa}
                      onChange={(e) => setConsentDpdpa(e.target.checked)}
                      className="mt-1 accent-red-600"
                    />
                    <div className="text-xs text-slate-300">
                      I authorize BloodConnect India to coordinate dispatch routing via encrypted proxy protocols adhering to DPDPA 2023 & DISHA standards.
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="px-4 py-2 bg-[#181a24] hover:bg-[#222432] border border-[#303345] text-slate-300 rounded-xl text-xs font-mono"
                  >
                    Back to Geolocation
                  </button>
                  <button
                    type="button"
                    disabled={!consentStatutory || !consentDpdpa}
                    onClick={handleStepSubmit}
                    className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold font-mono tracking-wide flex items-center gap-2 shadow-[0_0_16px_rgba(220,38,38,0.4)]"
                  >
                    <span>Dispatch Emergency Matching Engine</span>
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: REAL-TIME MATCHING ENGINE RESULTS */}
            {activeStep === 5 && (
              <div className="bg-[#14151a] border border-[#3a141a] p-6 rounded-2xl shadow-xl flex flex-col gap-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-4 border-b border-[#2d181e]">
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">sensors</span>
                      Telemetry Dispatch Active
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      Case Tracking #BCI-REQ-8492
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-red-950/80 border border-red-600 text-red-300 text-xs font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    Live Broadcast
                  </span>
                </div>

                <div className="p-4 bg-[#0d0e12] border border-[#2b171c] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-red-600 text-white font-headline font-bold text-lg flex items-center justify-center">
                      {selectedGroup}
                    </span>
                    <div>
                      <span className="font-bold text-white text-sm">
                        {unitsCount} Units of {selectedComponent} Requested
                      </span>
                      <span className="text-xs text-gray-400 block">
                        Destination: {hospitalFacility} ({wardLocation})
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-red-950/90 text-red-400 font-mono text-xs font-bold border border-red-700/60">
                    SLA: {formatSla(slaSeconds)}
                  </span>
                </div>

                {/* Simulation Stream */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Autonomous Response Log
                  </h4>

                  <div className="p-3.5 rounded-xl bg-[#1b1d28] border border-emerald-900/60 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-emerald-400 text-[20px] mt-0.5">
                        check_circle
                      </span>
                      <div>
                        <span className="text-sm font-bold text-white block">
                          AIIMS Apex Trauma Center Stock Locked
                        </span>
                        <span className="text-xs text-slate-400 block">
                          2 Units of {selectedGroup} {selectedComponent} reserved in cold-vault #FRZ-04. Crossmatch specimen transit dispatched.
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-emerald-400 font-bold shrink-0">
                      Confirmed
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1b1d28] border border-white/5 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-red-400 text-[20px] mt-0.5 animate-pulse">
                        emergency
                      </span>
                      <div>
                        <span className="text-sm font-bold text-white block">
                          Voluntary Donor Ping Broadcasted (15 km Corridor)
                        </span>
                        <span className="text-xs text-slate-400 block">
                          4 eligible {selectedGroup} registered donors notified via masked proxy push. 1 donor accepted transit.
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-slate-300 font-bold shrink-0">
                      Rider En Route
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="px-4 py-2 bg-[#181a24] hover:bg-[#222432] border border-[#303345] text-slate-300 rounded-xl text-xs font-mono"
                  >
                    Submit Another Request
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('console')}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold font-mono tracking-wide flex items-center gap-2 shadow-[0_0_16px_rgba(220,38,38,0.4)]"
                  >
                    <span>View Hospital Admin Console</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Context & Hospital Sidebar (4 cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#14151a] border border-[#3a141a] p-5 rounded-2xl shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#2d181e] pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Live Summary
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-700/60 text-red-300 text-[11px] font-mono font-bold uppercase">
                  Emergency Active
                </span>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-[#20222f]">
                  <span className="text-slate-400">Requirement:</span>
                  <span className="font-bold text-red-400">
                    {unitsCount} Units • {selectedGroup} ({selectedComponent})
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#20222f]">
                  <span className="text-slate-400">Patient:</span>
                  <span className="font-semibold text-white">
                    {patientName} ({patientAge} {patientGender.charAt(0)})
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#20222f]">
                  <span className="text-slate-400">Destination:</span>
                  <span className="font-semibold text-white truncate max-w-[180px]" title={hospitalFacility}>
                    {hospitalFacility}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#20222f]">
                  <span className="text-slate-400">Physician:</span>
                  <span className="font-semibold text-white">{physicianName}</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Time Window:</span>
                  <span className="font-bold text-red-400 font-mono">
                    {urgencyTier === 'CRITICAL' ? '< 2 Hours (Level-1 Code)' : '< 12 Hours'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#0d0e13] border border-[#262837] rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
                  Government Quota
                </span>
                <span className="font-mono text-emerald-400 font-bold">₹0 FEE</span>
              </div>
            </div>

            {/* Inter-Hospital Airlift & Green Corridor Callout */}
            <div className="bg-gradient-to-br from-[#3b0a11] to-[#1e070b] border border-red-800/60 p-5 rounded-2xl shadow-xl flex flex-col gap-3 relative overflow-hidden">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-red-300 font-bold">
                <span className="material-symbols-outlined text-[18px]">emergency</span>
                24/7 Clinical Dispatch
              </div>
              <h4 className="text-lg font-bold text-white leading-tight">
                Need Immediate Inter-Hospital Blood Airlift?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect directly with Delhi Emergency Blood Logistics for critical green corridor approvals.
              </p>
              <a
                href="tel:104"
                className="mt-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs rounded-xl text-center shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>Dial Emergency: 104 / 1910</span>
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* OpenStreetMap Modal Instance */}
      <OpenStreetMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        defaultFacility={hospitalFacility}
        onConfirm={(data) => {
          setHospitalFacility(data.name);
          setTargetCoordinates(data.coordinates);
          setTransitEta(data.eta);
        }}
      />
    </div>
  );
};
