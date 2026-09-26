/**
 * BloodConnect India Platform Type Definitions
 */

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type BloodComponent = 'PRBC' | 'Platelets' | 'FFP' | 'Cryo' | 'Whole Blood';

export type TriageUrgency = 'CRITICAL' | 'URGENT' | 'SCHEDULED';

export type UserRole = 'requester' | 'donor' | 'hospital' | 'admin';

export interface EmergencyRequest {
  id: string;
  timestamp: string;
  elapsedTime: string;
  timeRemaining?: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientCondition: string;
  facilityName: string;
  facilityLocation: string;
  facilityTier: 'Apex Level 1' | 'Central Govt Node' | 'Oncology Partner Node' | 'NABH Accredited';
  wardLocation: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  unitsRequired: number;
  urgency: TriageUrgency;
  proximityKm: number;
  corridorName: string;
  donorMatchingStatus: {
    confirmed: number;
    contacted: number;
    riderStatus?: string;
    details?: string;
  };
  crossMatchVerified?: boolean;
  transitEtaMins: number;
  assignedRider?: string;
  coolerBoxId?: string;
}

export interface InventoryItem {
  bloodGroup: BloodGroup;
  prbcUnits: number;
  prbcStatus: 'Low Reserves' | 'Critical' | 'Optimal' | 'Stable Buffer' | 'Surplus Tier' | 'Zero Buffer';
  ffpUnits: number;
  plateletUnits: number;
  plateletWarning?: string;
  wholeBloodUnits: number;
  shelfLifeStatus: string;
  shelfLifeType: 'ok' | 'warning' | 'alert';
}

export interface HospitalFacility {
  id: string;
  name: string;
  type: string;
  city: string;
  state: string;
  address: string;
  distanceKm: number;
  contactNumber: string;
  verified: boolean;
  level: string;
  stockPrbcOPlus: number;
  stockPrbcONeg: number;
  coldChainCompliant: boolean;
  apheresisActive: boolean;
  lat: number;
  lng: number;
}

export interface DonorProfile {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  isUniversalDonor: boolean;
  verified: boolean;
  totalDonations: number;
  livesTouched: number;
  lastDonationDaysAgo: number;
  isEligibleToday: boolean;
  availableForSos: boolean;
  notificationRadiusKm: number;
  dndNightProtocol: boolean;
  hidePreciseDistrict: boolean;
  livenessConfidence: number;
  aadhaarMasked: string;
  auditHash: string;
}

export interface DonationArchiveRecord {
  id: string;
  date: string;
  bloodCentre: string;
  licenseNumber: string;
  componentAndVol: string;
  clinicalCertNumber: string;
  status: 'Clinically Verified' | 'Pending Verification' | 'Processing';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  officer: string;
  type: 'admin' | 'donor_proxy' | 'triage_upgrade' | 'iot_telemetry';
  hash?: string;
}
