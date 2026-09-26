import {
  EmergencyRequest,
  InventoryItem,
  HospitalFacility,
  DonorProfile,
  DonationArchiveRecord,
  AuditLogEntry
} from '../types/bloodConnect';

export const INITIAL_REQUESTS: EmergencyRequest[] = [
  {
    id: '#BCI-99214',
    timestamp: '14:22 IST',
    elapsedTime: 'T+ 00:04:12 elapsed',
    timeRemaining: '11m to hypoxia threshold',
    patientName: 'Male (34y), Blunt Thoracic Injury',
    patientAge: 34,
    patientGender: 'Male',
    patientCondition: 'SpO2 dropping, massive internal blood loss',
    facilityName: 'Trauma Bay 4 • AIIMS Apex',
    facilityLocation: 'Ansari Nagar, New Delhi',
    facilityTier: 'Apex Level 1',
    wardLocation: 'Trauma Bay 4',
    bloodGroup: 'O-',
    component: 'PRBC',
    unitsRequired: 4,
    urgency: 'CRITICAL',
    proximityKm: 2.4,
    corridorName: 'Ring Road Corridor • Green corridor priority #1',
    donorMatchingStatus: {
      confirmed: 1,
      contacted: 2,
      riderStatus: 'Rider #R-881 en route to bank'
    },
    crossMatchVerified: true,
    transitEtaMins: 12,
    assignedRider: 'Rider #R-881 (AIIMS Corridors)',
    coolerBoxId: 'Box #BX-19 (4.1°C)'
  },
  {
    id: '#BCI-99218',
    timestamp: '14:08 IST',
    elapsedTime: 'T+ 00:18:40 elapsed',
    timeRemaining: '42m buffer',
    patientName: 'Female (28y), Postpartum Hemorrhage',
    patientAge: 28,
    patientGender: 'Female',
    patientCondition: 'Acute obstetrical blood loss post-cesarean',
    facilityName: 'Safdarjung Hospital • Obs Ward',
    facilityLocation: 'Ring Road, New Delhi',
    facilityTier: 'Central Govt Node',
    wardLocation: 'Obstetrics ICU Block B',
    bloodGroup: 'AB+',
    component: 'FFP',
    unitsRequired: 2,
    urgency: 'URGENT',
    proximityKm: 4.8,
    corridorName: 'Mehrauli Badarpur Rd • ETA: 8 mins',
    donorMatchingStatus: {
      confirmed: 1,
      contacted: 1,
      details: 'Direct Transfer Matched (Source: Red Cross Blood Bank, Central)'
    },
    crossMatchVerified: true,
    transitEtaMins: 8,
    assignedRider: 'Red Cross Logistics Van 02',
    coolerBoxId: 'Box #CR-04 (-28.5°C)'
  },
  {
    id: '#BCI-99225',
    timestamp: '13:55 IST',
    elapsedTime: 'T+ 00:32:05 elapsed',
    timeRemaining: 'Needed by 8:00 PM Today',
    patientName: 'Male (12y), ALL Induction Chemo',
    patientAge: 12,
    patientGender: 'Male',
    patientCondition: 'Severe chemo-induced aplasia, Platelet count < 10k',
    facilityName: 'Rajiv Gandhi Cancer Institute',
    facilityLocation: 'Outer Ring Sector, Rohini, New Delhi',
    facilityTier: 'Oncology Partner Node',
    wardLocation: 'Pediatric Oncology Ward 3',
    bloodGroup: 'B+',
    component: 'Platelets',
    unitsRequired: 1,
    urgency: 'URGENT',
    proximityKm: 6.1,
    corridorName: 'Outer Ring Sector • ETA: 19 mins',
    donorMatchingStatus: {
      confirmed: 2,
      contacted: 4,
      details: 'Masked ID #D-9402 in Apheresis Chair • Pre-donation count: 280k'
    },
    crossMatchVerified: true,
    transitEtaMins: 19,
    assignedRider: 'BioCourier North #09',
    coolerBoxId: 'Box #PLT-11 (22.0°C Agitated)'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    bloodGroup: 'O-',
    prbcUnits: 42,
    prbcStatus: 'Low Reserves',
    ffpUnits: 118,
    plateletUnits: 6,
    plateletWarning: 'Expiring 48h',
    wholeBloodUnits: 19,
    shelfLifeStatus: '3d Platelets',
    shelfLifeType: 'alert'
  },
  {
    bloodGroup: 'O+',
    prbcUnits: 412,
    prbcStatus: 'Optimal',
    ffpUnits: 320,
    plateletUnits: 34,
    wholeBloodUnits: 88,
    shelfLifeStatus: '28d PRBC OK',
    shelfLifeType: 'ok'
  },
  {
    bloodGroup: 'A-',
    prbcUnits: 18,
    prbcStatus: 'Critical',
    ffpUnits: 45,
    plateletUnits: 4,
    wholeBloodUnits: 12,
    shelfLifeStatus: 'Re-stock SOS',
    shelfLifeType: 'alert'
  },
  {
    bloodGroup: 'A+',
    prbcUnits: 389,
    prbcStatus: 'Stable Buffer',
    ffpUnits: 290,
    plateletUnits: 28,
    wholeBloodUnits: 62,
    shelfLifeStatus: 'Stable Buffer',
    shelfLifeType: 'ok'
  },
  {
    bloodGroup: 'B+',
    prbcUnits: 512,
    prbcStatus: 'Surplus Tier',
    ffpUnits: 402,
    plateletUnits: 41,
    wholeBloodUnits: 94,
    shelfLifeStatus: 'Surplus Tier',
    shelfLifeType: 'ok'
  },
  {
    bloodGroup: 'AB-',
    prbcUnits: 9,
    prbcStatus: 'Zero Buffer',
    ffpUnits: 22,
    plateletUnits: 1,
    wholeBloodUnits: 5,
    shelfLifeStatus: 'Donor Ping Out',
    shelfLifeType: 'alert'
  }
];

export const INITIAL_HOSPITALS: HospitalFacility[] = [
  {
    id: 'aiims-nd',
    name: 'All India Institute of Medical Sciences (AIIMS)',
    type: 'Apex Level-1 Trauma Center',
    city: 'New Delhi',
    state: 'Delhi NCR',
    address: 'Ansari Nagar, New Delhi - 110029',
    distanceKm: 2.4,
    contactNumber: '+91-11-26588500 / Ext 410',
    verified: true,
    level: 'AIIMS Main Center',
    stockPrbcOPlus: 18,
    stockPrbcONeg: 8,
    coldChainCompliant: true,
    apheresisActive: true,
    lat: 28.5672,
    lng: 77.2100
  },
  {
    id: 'red-cross-hq',
    name: 'Indian Red Cross Society National HQ',
    type: 'Central Processing & Regional Hub',
    city: 'New Delhi',
    state: 'Delhi NCR',
    address: '1 Red Cross Road, New Delhi - 110001',
    distanceKm: 4.1,
    contactNumber: '+91-11-23716441',
    verified: true,
    level: 'Red Cross Regional Hub',
    stockPrbcOPlus: 31,
    stockPrbcONeg: 14,
    coldChainCompliant: true,
    apheresisActive: true,
    lat: 28.6219,
    lng: 77.2090
  },
  {
    id: 'safdarjung-hosp',
    name: 'Safdarjung Trauma Facility Blood Bank',
    type: 'Central Government Emergency Receiving',
    city: 'New Delhi',
    state: 'Delhi NCR',
    address: 'Ring Road, Opposite AIIMS, New Delhi - 110029',
    distanceKm: 6.8,
    contactNumber: '+91-11-26165060 / 104',
    verified: true,
    level: 'Low Stock Alert',
    stockPrbcOPlus: 3,
    stockPrbcONeg: 1,
    coldChainCompliant: true,
    apheresisActive: true,
    lat: 28.5700,
    lng: 77.2050
  },
  {
    id: 'tata-memorial',
    name: 'Tata Memorial Hospital Transfusion Medicine',
    type: 'Oncology Transfusion Apex Node',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Dr. E Borges Road, Parel, Mumbai - 400012',
    distanceKm: 14.2,
    contactNumber: '+91-22-24177000',
    verified: true,
    level: 'NABH Oncology Node',
    stockPrbcOPlus: 26,
    stockPrbcONeg: 9,
    coldChainCompliant: true,
    apheresisActive: true,
    lat: 19.0048,
    lng: 72.8427
  },
  {
    id: 'manipal-blr',
    name: 'Manipal Hospitals Blood Bank Centre',
    type: 'South Regional Grid Trauma Unit',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '98 HAL Old Airport Rd, Kodihalli, Bengaluru - 560017',
    distanceKm: 8.5,
    contactNumber: '+91-80-25024444',
    verified: true,
    level: 'NABH Accredited',
    stockPrbcOPlus: 45,
    stockPrbcONeg: 12,
    coldChainCompliant: true,
    apheresisActive: true,
    lat: 12.9592,
    lng: 77.6499
  },
  {
    id: 'apollo-hyd',
    name: 'Apollo Health City Transfusion Center',
    type: 'Apex Organ & Trauma Center',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Road No 72, Jubilee Hills, Hyderabad - 500033',
    distanceKm: 11.0,
    contactNumber: '+91-40-23607777',
    verified: true,
    level: 'NABH Accredited',
    stockPrbcOPlus: 38,
    stockPrbcONeg: 10,
    coldChainCompliant: true,
    apheresisActive: true,
    lat: 17.4259,
    lng: 78.4144
  }
];

export const MOCK_DONOR_PROFILE: DonorProfile = {
  id: 'BCI-D-78210',
  name: 'Vikramaditya Sharma',
  bloodGroup: 'O-',
  isUniversalDonor: true,
  verified: true,
  totalDonations: 7,
  livesTouched: 21,
  lastDonationDaysAgo: 94,
  isEligibleToday: true,
  availableForSos: true,
  notificationRadiusKm: 15,
  dndNightProtocol: true,
  hidePreciseDistrict: true,
  livenessConfidence: 99.4,
  aadhaarMasked: 'XXXX-XXXX-8921',
  auditHash: '#0x7B9E21...4A82'
};

export const MOCK_DONATION_ARCHIVES: DonationArchiveRecord[] = [
  {
    id: 'REC-01',
    date: '08 Oct 2024',
    bloodCentre: 'AIIMS Trauma Node',
    licenseNumber: 'Lic: DL-BB-2018-09',
    componentAndVol: 'PRBC (450 ml)',
    clinicalCertNumber: '#NACO-DL-98214',
    status: 'Clinically Verified'
  },
  {
    id: 'REC-02',
    date: '14 Jun 2024',
    bloodCentre: 'Safdarjung Blood Bank',
    licenseNumber: 'Lic: DL-BB-1999-44',
    componentAndVol: 'Whole Blood (350 ml)',
    clinicalCertNumber: '#NACO-DL-66103',
    status: 'Clinically Verified'
  },
  {
    id: 'REC-03',
    date: '19 Feb 2024',
    bloodCentre: 'Indian Red Cross National HQ',
    licenseNumber: 'Lic: DL-BB-1977-01',
    componentAndVol: 'Platelets (SDP)',
    clinicalCertNumber: '#NACO-DL-41982',
    status: 'Clinically Verified'
  }
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-01',
    timestamp: '14:28:19 IST',
    title: 'Admin verified Safdarjung Blood Centre inventory sync',
    description: 'Batch Sync: 320 units cataloged • Cold-chain certificates validated (MD5: e9c5...f881)',
    officer: 'Dr. A. Verma (AIIMS-TC)',
    type: 'admin',
    hash: 'e9c5f881a293'
  },
  {
    id: 'LOG-02',
    timestamp: '14:26:02 IST',
    title: 'Donor #D-4019 contact initiated via masked proxy',
    description: 'Virtual VOIP routing session • No phone number or resident address exposed to requester.',
    officer: 'Triage Bot Auto-Trigger',
    type: 'donor_proxy',
    hash: '8f0011b90c3d'
  },
  {
    id: 'LOG-03',
    timestamp: '14:22:45 IST',
    title: 'Emergency request #99214 upgraded to Level 1 Triage',
    description: 'Triggered by AIIMS Trauma Bay 4 attending physician (SpO2 dropping, massive internal blood loss).',
    officer: 'Attending: Dr. R. Sen (Reg #DEL-9082)',
    type: 'triage_upgrade',
    hash: '99214level1pri'
  },
  {
    id: 'LOG-04',
    timestamp: '14:15:30 IST',
    title: 'Cold storage unit #FRZ-08 temperature calibrated',
    description: 'Sensor audit: -31.8°C (Optimal for FFP storage) • Verified by Biomedical Engineer node.',
    officer: 'Automated IoT Telemetry Node',
    type: 'iot_telemetry',
    hash: 'frz08sensor318'
  }
];

export const FAQ_DATA = [
  {
    question: 'Who is eligible to donate blood under Indian regulatory standards?',
    answer: 'Healthy adults between 18 and 65 years old weighing at least 45 kg with a hemoglobin count of ≥ 12.5 g/dL. Must not have undergone major surgery in the past 6 months, received blood transfusions in 12 months, or had active viral infections.'
  },
  {
    question: 'How is voluntary donor privacy guarded during an emergency call?',
    answer: 'BloodConnect India utilizes spatial obfuscation algorithms. Requesters only see approximate proximity (e.g., "Approx. 3.2 km away • Sector 4"). Direct phone numbers are never displayed; communication is coordinated via verified push triggers and automated hospital dispatch queues.'
  },
  {
    question: 'What is the difference between Whole Blood and PRBC?',
    answer: 'Packed Red Blood Cells (PRBC) are separated from plasma and platelets via centrifugation, delivering concentrated oxygen-carrying capacity without fluid volume overload. PRBC is the modern standard for trauma resuscitations and surgical hemotherapy.'
  },
  {
    question: 'Are there statutory blood processing fees at government hospitals?',
    answer: 'Blood itself is completely free of cost as mandated by the Supreme Court of India. Government-authorized facilities may levy nominal statutory processing charges (for mandatory NAT screening, HIV, Hepatitis B/C, Malaria, and Syphilis testing) strictly capped under the National Blood Policy gazette notification.'
  }
];

export const COMPATIBILITY_MATRIX: Record<string, { donors: string[]; universalRole: string }> = {
  'O-': { donors: ['O-'], universalRole: 'Universal Red Blood Cell Donor' },
  'O+': { donors: ['O+', 'O-'], universalRole: 'Can donate to O+, A+, B+, AB+' },
  'A-': { donors: ['A-', 'O-'], universalRole: 'Can donate to A-, A+, AB-, AB+' },
  'A+': { donors: ['A+', 'A-', 'O+', 'O-'], universalRole: 'Can donate to A+, AB+' },
  'B-': { donors: ['B-', 'O-'], universalRole: 'Can donate to B-, B+, AB-, AB+' },
  'B+': { donors: ['B+', 'B-', 'O+', 'O-'], universalRole: 'Can donate to B+, AB+' },
  'AB-': { donors: ['AB-', 'A-', 'B-', 'O-'], universalRole: 'Plasma Universal Donor' },
  'AB+': { donors: ['All Blood Groups (AB+, AB-, A+, A-, B+, B-, O+, O-)'], universalRole: 'Universal Red Blood Cell Recipient' }
};
