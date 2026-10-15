/**
 * SMART TOURIST SAFETY MONITORING & INCIDENT RESPONSE SYSTEM
 * Deterministic Mock Dataset & Scenario Constants
 */

import {
  TouristProfile,
  EmergencyContact,
  Trip,
  RiskZone,
  AnomalyIncident,
  SafetyCheckIn,
  AlertNotification,
  PrivacyPreferences,
  SOSIncident
} from '../types';

export const MOCK_TOURIST: TouristProfile = {
  id: 'tourist_arjun_001',
  name: 'Arjun Sharma',
  age: 28,
  gender: 'Male',
  nationality: 'Indian',
  phone: '+91 98765 43210',
  bloodGroup: 'O+',
  allergies: 'Penicillin sensitivity (mild)',
  dtid: 'DTID-8F4K29',
  tier: 'Tier 3 Cleared',
  zonePass: 'Zone Pass #4',
  kycVersion: 'KYC V2',
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
};

export const MOCK_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'contact_priya_01',
    name: 'Priya Sharma',
    relationship: 'Wife / Primary Kin',
    phone: '+91 98765 43210',
    isPrimary: true,
    autoNotifyMissedCheckin: true,
    status: 'VERIFIED'
  },
  {
    id: 'contact_police_02',
    name: 'Tourist Police Dispatch',
    relationship: 'Meghalaya Zone Sentinel (State)',
    phone: '+91 3637 235222',
    isPrimary: false,
    autoNotifyMissedCheckin: false,
    status: 'VERIFIED'
  }
];

export const MOCK_TRIP: Trip = {
  id: 'trip_meghalaya_2026',
  touristId: 'tourist_arjun_001',
  title: 'Meghalaya Adventure',
  region: 'East Khasi Hills',
  startDate: '12 Oct 2026',
  endDate: '18 Oct 2026',
  currentDay: 3,
  totalDays: 7,
  safetyScore: 92,
  distanceCoveredKm: 118,
  totalDistanceKm: 284,
  status: 'ACTIVE',
  days: [
    {
      dayNumber: 1,
      dateLabel: '12 OCT',
      title: 'Day 1: Arrival & Guwahati Transit',
      subtitle: 'Corridor Cleared',
      isToday: false,
      isCompleted: true,
      stops: []
    },
    {
      dayNumber: 2,
      dateLabel: '13 OCT',
      title: 'Day 2: Shillong Heritage & Ward’s Lake',
      subtitle: 'Urban Safe Zone',
      isToday: false,
      isCompleted: true,
      stops: []
    },
    {
      dayNumber: 3,
      dateLabel: '14 OCT',
      title: 'Day 3: Shillong → Cherrapunji',
      subtitle: 'Mountain Highway NH 206 • 54 km corridor',
      isToday: true,
      isCompleted: false,
      stops: [
        {
          id: 'stop_1',
          dayNumber: 3,
          timeLabel: '08:30 AM',
          title: 'Police Bazar Breakfast & Briefing',
          description: 'Safety perimeter check logged. Local guide verified DTID credentials. Battery 98%, Biometrics OK.',
          status: 'COMPLETED',
          locationLabel: 'Shillong Central',
          latitude: 25.5788,
          longitude: 91.8933
        },
        {
          id: 'stop_2',
          dayNumber: 3,
          timeLabel: '10:45 AM',
          title: 'Elephant Falls Transit',
          description: 'Logged at Tourist Police Kiosk #4. Escort transit corridor cleared.',
          status: 'COMPLETED',
          locationLabel: 'Geo-tagged • Shillong Gate',
          imageUrl: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&w=600&q=80',
          latitude: 25.5342,
          longitude: 91.8219
        },
        {
          id: 'stop_3',
          dayNumber: 3,
          timeLabel: '02:30 PM',
          title: 'Mawkdok Dympep Valley View',
          description: 'Scenic canyon crossing with suspension footbridge. Safe altitude 1,480m.',
          status: 'ACTIVE',
          locationLabel: '18 km away',
          etaLabel: 'In 1h 15m',
          advisory: 'Advisory: Strong gorge crosswinds. Remain behind guardrails; follow marked viewpoints only.',
          advisoryType: 'info',
          cellularSignal: 'Strong 4G (Airtel)',
          assignedPatrol: 'Patrol Unit #12',
          latitude: 25.3526,
          longitude: 91.7314
        },
        {
          id: 'stop_4',
          dayNumber: 3,
          timeLabel: '04:45 PM',
          title: 'Arwah Cave Natural Trail',
          description: 'Prehistoric limestone cave exploration with illuminated fossil paths.',
          status: 'UPCOMING',
          locationLabel: 'Sohra Outskirts',
          advisory: 'Strict Daylight Advisory: Sunset at 5:24 PM. Heavy mountain fog reduces visibility after 5:00 PM. Registered guide required past Entry Post B.',
          advisoryType: 'warning',
          latitude: 25.2917,
          longitude: 91.7042
        },
        {
          id: 'stop_5',
          dayNumber: 3,
          timeLabel: '07:00 PM',
          title: 'Cherrapunji Holiday Resort',
          description: 'Safe haven accommodation. 24/7 solar power backup, dedicated satellite link, and first-responder certified staff.',
          status: 'UPCOMING',
          locationLabel: 'Laitkynsew Hills',
          isSafeHaven: true,
          latitude: 25.2689,
          longitude: 91.6833
        }
      ]
    },
    {
      dayNumber: 4,
      dateLabel: '15 OCT',
      title: 'Day 4: Living Root Bridges Trek',
      subtitle: 'Nongriat Guided Trek',
      isToday: false,
      isCompleted: false,
      stops: []
    },
    {
      dayNumber: 5,
      dateLabel: '16 OCT',
      title: 'Day 5: Dawki & Umngot River',
      subtitle: 'Clear Waters River Border',
      isToday: false,
      isCompleted: false,
      stops: []
    },
    {
      dayNumber: 6,
      dateLabel: '17 OCT',
      title: 'Day 6: Mawlynnong Cleanest Village',
      subtitle: 'Eco-Corridor Safe Haven',
      isToday: false,
      isCompleted: false,
      stops: []
    }
  ]
};

export const MOCK_RISK_ZONE: RiskZone = {
  id: 'zone_mawryngkneng_01',
  name: 'Mawryngkneng Forest Zone',
  riskLevel: 'HIGH',
  riskCategory: 'FOREST',
  description: 'High-sensitivity restricted terrain with dense canopy and intermittent cellular carrier coverage.',
  boundaryName: 'Mawryngkneng Geofence Boundary',
  distanceMeters: 420,
  whyExists: 'Dense canopy, sudden valley fog after 5:00 PM, and intermittent mobile carrier dropouts across 14 km.',
  whatToComply: 'Daylight transit only. Forest entry restricted after 6:00 PM without state-registered guide accompaniment.',
  recommendedAction: 'Engage designated NH 206 bypass route (+12 min, fully patrolled). Avoid unpaved spurs.',
  activeHours: '06:00 AM - 05:30 PM Daylight Only',
  updatedAt: 'Today, 10:15 AM by Meghalaya Forest Dept',
  centerLatitude: 25.5891,
  centerLongitude: 91.9542
};

export const MOCK_ANOMALY: AnomalyIncident = {
  id: 'anom_diverge_091',
  type: 'ROUTE_DIVERGENCE',
  title: 'Something looks different',
  explanation: 'Your recent movement differs from your planned route to Cherrapunji. Exploring scenic detours is normal, but this corridor enters reduced coverage.',
  detectedAt: '14:32 PM',
  status: 'PENDING',
  deviationDistance: '2.4 km East',
  proximityBuffer: '650m to Reserved Forest',
  missedWindow: '+15 min past scheduled check-in',
  autoEscalationSeconds: 890,
  guardianName: 'Priya Sharma'
};

export const MOCK_CHECKIN: SafetyCheckIn = {
  id: 'checkin_d3_midday',
  tripId: 'trip_meghalaya_2026',
  scheduledTime: '06:00 PM',
  status: 'UPCOMING',
  batteryPercent: 84,
  verificationMethod: 'ONE_TAP'
};

export const MOCK_INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'alert_geo_01',
    category: 'GEOFENCE',
    title: 'High-Sensitivity Zone',
    subtitle: '400m Away • Now',
    description: 'Mawryngkneng Forest perimeter entered. Sunset occurs in 4h 09m. Mandatory certified guide required past Entry Post B.',
    timestamp: 'Just now',
    severity: 'WARNING',
    isNew: true,
    actionLabel: 'View Safe Route'
  },
  {
    id: 'alert_sos_02',
    category: 'DISPATCH',
    title: 'SOS Handshake Confirmed',
    subtitle: 'Ticket #INC-9941',
    description: 'Shillong Central Command responder desk acknowledged alert dispatch. Meghalaya Tourist Police Patrol Unit #14 is en route to beacon telemetry coordinates.',
    timestamp: '12:04 PM',
    severity: 'CRITICAL',
    isNew: true,
    ticketId: '#INC-9941',
    unitMeta: {
      officer: 'Inspector P. Sangma',
      eta: '~7 mins',
      channel: 'Unit VHF Ch 12'
    }
  },
  {
    id: 'alert_hazard_03',
    category: 'HAZARD',
    title: 'Dense Mountain Fog Advisory',
    subtitle: 'SoH-Met Dept',
    description: 'Visibility expected to drop below <20m along Mawkdok Dympep valley gorge after 5:00 PM. High-altitude condensation advisory active.',
    timestamp: '10:45 AM',
    severity: 'WARNING',
    isNew: false,
    actionLabel: 'Mandatory detour: NH 206'
  },
  {
    id: 'alert_checkin_04',
    category: 'CHECKIN',
    title: 'Morning Safety Check-in Complete',
    subtitle: 'DTID-8F4K29',
    description: 'Biometric handshake verified at Tourist Police Bazar Kiosk. Device power healthy at 98%, local satellite beacon telemetry nominal.',
    timestamp: '08:30 AM',
    severity: 'SUCCESS',
    isNew: false
  },
  {
    id: 'alert_cache_05',
    category: 'OFFLINE_CACHE',
    title: 'Offline Dossier Cached',
    subtitle: '48.2 MB Package',
    description: 'High-density vector terrain contours and emergency telephone registry cached to secure device vault. Unrestricted offline navigation available in zero-cellular valleys.',
    timestamp: 'Yesterday',
    severity: 'INFO',
    isNew: false
  }
];

export const MOCK_PRIVACY_PREFS: PrivacyPreferences = {
  safetyGeofenceOnly: true,
  kinBreadcrumbRelay: false,
  edgeAnomalyDetection: true,
  offlineEncryptedSmsFallback: true,
  sosButtonSize: 'standard',
  displayLanguage: 'en'
};

export const MOCK_INITIAL_SOS: SOSIncident = {
  incidentId: 'INC-9941-MEG',
  ticketNumber: '#INC-9941-MEG',
  status: 'IDLE',
  timestamp: new Date().toISOString(),
  location: {
    latitude: 25.5788,
    longitude: 91.8933,
    accuracyMeters: 3.2,
    altitudeMeters: 1420,
    capturedAt: new Date().toISOString(),
    source: 'CURRENT_GPS'
  },
  connectivityStatus: 'ONLINE',
  touristDtid: 'DTID-8F4K29',
  touristName: 'Arjun Sharma',
  batteryPercent: 78,
  strobeActive: true,
  checklist: {
    tokenGenerated: true,
    gpsAnchored: true,
    dispatchNotified: true,
    smsAlertQueued: false,
    patrolAssigned: false
  },
  assignedUnit: {
    name: 'Meghalaya Tourist Police Patrol Unit #14',
    officer: 'Inspector P. Sangma',
    etaMinutes: 7,
    channel: 'Unit VHF Ch 12',
    phone: '+91 3637 235222'
  }
};
