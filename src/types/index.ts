/**
 * SMART TOURIST SAFETY MONITORING & INCIDENT RESPONSE SYSTEM
 * Core TypeScript Definitions & Models
 */

export type SafetyStatus = 'SAFE' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';

export type ConnectivityState = 'ONLINE' | 'OFFLINE' | 'RECONNECTING' | 'SYNC_PENDING' | 'SYNC_FAILED';

export interface LocationSnapshot {
  latitude: number;
  longitude: number;
  altitudeMeters?: number;
  accuracyMeters: number;
  capturedAt: string;
  source: 'CURRENT_GPS' | 'LAST_KNOWN' | 'CACHED' | 'MANUAL_PIN';
  heading?: number;
  speedKmh?: number;
}

export type LocationConfidence = 'HIGH' | 'MODERATE' | 'LOW' | 'STALE' | 'UNAVAILABLE';

export interface TouristProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  nationality: string;
  phone: string;
  photoUrl?: string;
  bloodGroup: string;
  allergies: string;
  dtid: string; // e.g. DTID-8F4K29
  tier: string; // e.g. 'Tier 3 Cleared'
  zonePass: string; // e.g. 'Zone Pass #4'
  kycVersion: string; // e.g. 'KYC V2'
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
  autoNotifyMissedCheckin: boolean;
  status: 'VERIFIED' | 'PENDING';
}

export type TripStatus = 'DRAFT' | 'PENDING_VERIFICATION' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';

export interface ItineraryStop {
  id: string;
  dayNumber: number;
  timeLabel: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'ACTIVE' | 'UPCOMING';
  locationLabel: string;
  distanceKm?: number;
  etaLabel?: string;
  advisory?: string;
  advisoryType?: 'caution' | 'warning' | 'info';
  cellularSignal?: string;
  assignedPatrol?: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  isSafeHaven?: boolean;
}

export interface TripItineraryDay {
  dayNumber: number;
  dateLabel: string;
  title: string;
  subtitle: string;
  isToday: boolean;
  isCompleted: boolean;
  stops: ItineraryStop[];
}

export interface Trip {
  id: string;
  touristId: string;
  title: string;
  region: string;
  startDate: string;
  endDate: string;
  currentDay: number;
  totalDays: number;
  safetyScore: number;
  distanceCoveredKm: number;
  totalDistanceKm: number;
  status: TripStatus;
  days: TripItineraryDay[];
}

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface RiskZone {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  riskCategory: 'FOREST' | 'TERRAIN' | 'WEATHER' | 'CONNECTIVITY_DROP';
  description: string;
  boundaryName: string;
  distanceMeters: number;
  whyExists: string;
  whatToComply: string;
  recommendedAction: string;
  activeHours?: string;
  updatedAt: string;
  centerLatitude: number;
  centerLongitude: number;
}

export type AnomalyType = 'ROUTE_DIVERGENCE' | 'PROLONGED_INACTIVITY' | 'MISSED_CHECKIN' | 'GEOFENCE_BREACH' | 'SUDDEN_DROP';

export type AnomalyStatus = 'PENDING' | 'CONFIRMED_SAFE' | 'HELP_REQUESTED' | 'ESCALATED' | 'CLOSED';

export interface AnomalyIncident {
  id: string;
  type: AnomalyType;
  title: string;
  explanation: string;
  detectedAt: string;
  status: AnomalyStatus;
  deviationDistance?: string;
  proximityBuffer?: string;
  missedWindow?: string;
  autoEscalationSeconds: number;
  guardianName: string;
}

export type CheckInStatus = 'UPCOMING' | 'DUE' | 'COMPLETED' | 'MISSED' | 'UNDER_REVIEW' | 'ESCALATED';

export interface SafetyCheckIn {
  id: string;
  tripId: string;
  scheduledTime: string;
  status: CheckInStatus;
  completedAt?: string;
  verificationMethod?: 'BIOMETRIC_OR_PIN' | 'GPS_CORRIDOR' | 'ONE_TAP';
  batteryPercent?: number;
  notes?: string;
}

export type SOSEventState = 
  | 'IDLE'
  | 'CONFIRMING'
  | 'SENDING'
  | 'SUBMITTED'
  | 'ACKNOWLEDGED'
  | 'RESPONDING'
  | 'RESOLVED'
  | 'CANCELLED_BEFORE_SUBMISSION'
  | 'QUEUED_OFFLINE';

export interface SOSIncident {
  incidentId: string;
  ticketNumber: string;
  status: SOSEventState;
  timestamp: string;
  location: LocationSnapshot;
  connectivityStatus: ConnectivityState;
  touristDtid: string;
  touristName: string;
  batteryPercent: number;
  strobeActive: boolean;
  assignedUnit?: {
    name: string;
    officer: string;
    etaMinutes: number;
    channel: string;
    phone: string;
  };
  checklist: {
    tokenGenerated: boolean;
    gpsAnchored: boolean;
    dispatchNotified: boolean;
    smsAlertQueued: boolean;
    patrolAssigned: boolean;
  };
}

export interface AlertNotification {
  id: string;
  category: 'GEOFENCE' | 'DISPATCH' | 'HAZARD' | 'CHECKIN' | 'OFFLINE_CACHE';
  title: string;
  subtitle?: string;
  description: string;
  timestamp: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  isNew: boolean;
  actionLabel?: string;
  ticketId?: string;
  unitMeta?: {
    officer: string;
    eta: string;
    channel: string;
  };
}

export interface PrivacyPreferences {
  safetyGeofenceOnly: boolean;
  kinBreadcrumbRelay: boolean;
  edgeAnomalyDetection: boolean;
  offlineEncryptedSmsFallback: boolean;
  sosButtonSize: 'standard' | 'high-affordance';
  displayLanguage: string;
}
