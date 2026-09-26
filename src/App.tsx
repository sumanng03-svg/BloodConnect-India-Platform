import React, { useState } from 'react';
import {
  UserRole,
  EmergencyRequest,
  InventoryItem,
  HospitalFacility,
  DonorProfile,
  DonationArchiveRecord,
  AuditLogEntry,
  BloodGroup,
  BloodComponent
} from './types/bloodConnect';
import {
  INITIAL_REQUESTS,
  INITIAL_INVENTORY,
  INITIAL_HOSPITALS,
  MOCK_DONOR_PROFILE,
  MOCK_DONATION_ARCHIVES,
  MOCK_AUDIT_LOGS
} from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { NotificationToast, ToastMessage } from './components/NotificationToast';

import { HomeView } from './views/HomeView';
import { RequestBloodView } from './views/RequestBloodView';
import { DonateBloodView } from './views/DonateBloodView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { HospitalNetworkView } from './views/HospitalNetworkView';
import { LiveExplorerView } from './views/LiveExplorerView';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole>('donor');
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');

  // Core Data State
  const [requests, setRequests] = useState<EmergencyRequest[]>(INITIAL_REQUESTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [hospitals, setHospitals] = useState<HospitalFacility[]>(INITIAL_HOSPITALS);
  const [donorProfile, setDonorProfile] = useState<DonorProfile>(MOCK_DONOR_PROFILE);
  const [donationArchives, setDonationArchives] = useState<DonationArchiveRecord[]>(MOCK_DONATION_ARCHIVES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);

  // UI Modals & Toasts
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([
    {
      id: 'init-1',
      type: 'critical',
      title: 'Active Code Red Triage',
      message: 'Trauma Bay 4 AIIMS Apex: 4 Units O- PRBC requested. Green corridor active.',
    },
  ]);

  const addToast = (type: 'critical' | 'success' | 'info', title: string, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // User Actions
  const handleRequestCreated = (newReq: EmergencyRequest) => {
    setRequests((prev) => [newReq, ...prev]);
    // Add audit log
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      title: `Emergency Requisition ${newReq.id} Logged`,
      description: `Target: ${newReq.unitsRequired} Units ${newReq.bloodGroup} ${newReq.component} for ${newReq.facilityName}.`,
      officer: 'Automated PostGIS Triage Engine',
      type: 'triage_upgrade',
      hash: '0x' + Math.random().toString(16).slice(2, 10),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    addToast(
      'critical',
      `Emergency Request ${newReq.id} Broadcasted`,
      `${newReq.unitsRequired} units ${newReq.bloodGroup} ${newReq.component} dispatched for ${newReq.facilityName}.`
    );
  };

  const handleQuickReserve = (hosp: HospitalFacility, group: BloodGroup, component: BloodComponent) => {
    addToast(
      'success',
      `Unit Reserved at ${hosp.name}`,
      `1 Unit of ${group} ${component} held for 45 minutes crossmatch testing.`
    );
    // Decrease stock locally to reflect real-time update
    setHospitals((prev) =>
      prev.map((h) =>
        h.id === hosp.id
          ? {
              ...h,
              stockPrbcOPlus: Math.max(0, h.stockPrbcOPlus - 1),
            }
          : h
      )
    );
  };

  const handleTransitAssigned = (reqId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              donorMatchingStatus: {
                ...r.donorMatchingStatus,
                riderStatus: 'Transit courier locked • Smart box temp verified 4.1°C',
              },
            }
          : r
      )
    );
    addToast(
      'success',
      'Cold-Chain Transit Assigned',
      `Rider locked for ${reqId}. Temperature monitoring box #BX-19 active.`
    );
  };

  const handleManualEscalate = (data: {
    bloodGroup: string;
    units: number;
    patientDetails: string;
  }) => {
    const newReq: EmergencyRequest = {
      id: `#BCI-ESC-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      elapsedTime: 'T+ 00:00:05 elapsed',
      timeRemaining: 'Hypoxia threshold: 12m',
      patientName: data.patientDetails,
      patientAge: 38,
      patientGender: 'Male',
      patientCondition: 'Trauma Resuscitation Alert',
      facilityName: 'AIIMS Apex Trauma Center Bay 2',
      facilityLocation: 'Ansari Nagar, New Delhi',
      facilityTier: 'Apex Level 1',
      wardLocation: 'Resuscitation Suite',
      bloodGroup: data.bloodGroup as BloodGroup,
      component: 'PRBC',
      unitsRequired: data.units,
      urgency: 'CRITICAL',
      proximityKm: 1.8,
      corridorName: 'AIIMS Inner Perimeter',
      donorMatchingStatus: {
        confirmed: 1,
        contacted: 5,
        riderStatus: 'Flash SOS ping acknowledged',
      },
      crossMatchVerified: true,
      transitEtaMins: 6,
      assignedRider: 'Apex Rapid Runner #01',
      coolerBoxId: 'Box #BX-01 (3.8°C)',
    };
    handleRequestCreated(newReq);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 flex flex-col font-body selection:bg-red-900 selection:text-white relative">
      {/* Shell Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        userRole={userRole}
        onRoleChange={setUserRole}
        onOpenAuth={() => setAuthModalOpen(true)}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Main View Router */}
      <main className="w-full flex-1 pt-24 md:pt-28">
        {currentView === 'home' && (
          <HomeView
            onNavigate={setCurrentView}
            hospitals={hospitals}
            onQuickReserve={handleQuickReserve}
            onEnrolSuccess={(data) => {
              setDonorProfile((prev) => ({
                ...prev,
                name: data.name,
                bloodGroup: data.group,
              }));
              addToast(
                'success',
                'Voluntary Donor Registered',
                `Welcome ${data.name}! Your emergency fast-pass token is now active.`
              );
            }}
          />
        )}

        {currentView === 'request-blood' && (
          <RequestBloodView
            onNavigate={setCurrentView}
            onRequestCreated={handleRequestCreated}
          />
        )}

        {currentView === 'donate-blood' && (
          <DonateBloodView
            donor={donorProfile}
            archives={donationArchives}
            onUpdateDonor={(up) => setDonorProfile((prev) => ({ ...prev, ...up }))}
            onAddArchiveRecord={(rec) => setDonationArchives((prev) => [rec, ...prev])}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'console' && (
          <AdminDashboardView
            requests={requests}
            inventory={inventory}
            auditLogs={auditLogs}
            hospitals={hospitals}
            onTransitAssigned={handleTransitAssigned}
            onManualEscalate={handleManualEscalate}
          />
        )}

        {currentView === 'hospital-network' && (
          <HospitalNetworkView
            hospitals={hospitals}
            onNavigate={setCurrentView}
            onReserve={(h, g, c) => {
              handleQuickReserve(h, g, c);
              setCurrentView('request-blood');
            }}
          />
        )}

        {currentView === 'live-explorer' && (
          <LiveExplorerView
            onNavigate={setCurrentView}
            onQuickReserve={(g, c, st) => {
              addToast(
                'success',
                `Reserve Request Broadcasted in ${st}`,
                `Checking cold storage compatibility for ${g} ${c}.`
              );
              setCurrentView('request-blood');
            }}
          />
        )}
      </main>

      {/* Shell Footer */}
      <Footer onNavigate={setCurrentView} />

      {/* Toast Alerts System */}
      <NotificationToast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(role, name) => {
          setUserRole(role);
          addToast('success', `Signed In as ${name}`, `Switched to ${role.toUpperCase()} session.`);
          if (role === 'admin' || role === 'hospital') setCurrentView('console');
          if (role === 'donor') setCurrentView('donate-blood');
        }}
      />
    </div>
  );
}
