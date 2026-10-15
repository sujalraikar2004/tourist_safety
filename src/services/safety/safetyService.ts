/**
 * SMART TOURIST SAFETY MONITORING & INCIDENT RESPONSE SYSTEM
 * Safety Score & Telemetry Management Service
 */

import { SafetyStatus, LocationConfidence, ConnectivityState } from '../../types';
import { apiClient } from '../api/apiClient';

export interface SafetyTelemetrySnapshot {
  safetyScore: number; // 0 - 100
  safetyStatus: SafetyStatus;
  locationConfidence: LocationConfidence;
  connectivityState: ConnectivityState;
  areaZoneLabel: string;
  routeStatusLabel: string;
  checkInStatusLabel: string;
  batteryPercent: number;
  explanation: string;
  factors: {
    name: string;
    score: number;
    description: string;
  }[];
}

class SafetyService {
  private currentTelemetry: SafetyTelemetrySnapshot = {
    safetyScore: 92,
    safetyStatus: 'SAFE',
    locationConfidence: 'HIGH',
    connectivityState: 'ONLINE',
    areaZoneLabel: 'Low Risk',
    routeStatusLabel: 'On Schedule',
    checkInStatusLabel: 'Up-to-date',
    batteryPercent: 84,
    explanation: 'No active safety concerns in your current area. Tap for real-time confidence telemetry.',
    factors: [
      { name: 'Itinerary Adherence', score: 98, description: 'Route within 100m of nominal NH 206 corridor.' },
      { name: 'Check-In Verification', score: 95, description: 'Morning check-in completed on time with guide signature.' },
      { name: 'Risk Zone Proximity', score: 88, description: 'Mawryngkneng Forest Zone boundary is 420m away (Restricted after 6:00 PM).' },
      { name: 'Network & Telemetry', score: 90, description: 'Dual carrier signal active with on-device satellite packet caching.' }
    ]
  };

  public getTelemetry(): SafetyTelemetrySnapshot {
    return { ...this.currentTelemetry };
  }

  public setSimulatedState(preset: 'safe' | 'risk' | 'anomaly' | 'offline'): SafetyTelemetrySnapshot {
    switch (preset) {
      case 'safe':
        this.currentTelemetry = {
          safetyScore: 92,
          safetyStatus: 'SAFE',
          locationConfidence: 'HIGH',
          connectivityState: 'ONLINE',
          areaZoneLabel: 'Low Risk',
          routeStatusLabel: 'On Schedule',
          checkInStatusLabel: 'Up-to-date',
          batteryPercent: 84,
          explanation: 'No active safety concerns in your current area. Tap for real-time confidence telemetry.',
          factors: [
            { name: 'Itinerary Adherence', score: 98, description: 'Route on nominal NH 206 corridor.' },
            { name: 'Check-In Verification', score: 95, description: 'Morning check-in confirmed.' },
            { name: 'Risk Zone Proximity', score: 88, description: '420m away from forest boundary.' },
            { name: 'Network Connectivity', score: 90, description: 'Strong 4G Airtel & fallback active.' }
          ]
        };
        break;

      case 'risk':
        this.currentTelemetry = {
          safetyScore: 64,
          safetyStatus: 'ELEVATED',
          locationConfidence: 'HIGH',
          connectivityState: 'ONLINE',
          areaZoneLabel: 'Elevated Alert',
          routeStatusLabel: 'Approaching Boundary',
          checkInStatusLabel: 'Due Soon',
          batteryPercent: 81,
          explanation: 'Approaching steep terrain zone with weak cell coverage. Stick to main marked paths.',
          factors: [
            { name: 'Risk Zone Boundary', score: 55, description: 'Within 400m of Mawryngkneng High-Sensitivity Geofence.' },
            { name: 'Daylight Window', score: 62, description: 'Sunset at 5:24 PM (Dense mountain mist expected).' },
            { name: 'Terrain Complexity', score: 70, description: 'Gorge canyon crossing with suspension footbridge.' },
            { name: 'Carrier Coverage', score: 68, description: 'Intermittent carrier dropouts expected past Entry Post B.' }
          ]
        };
        break;

      case 'anomaly':
        this.currentTelemetry = {
          safetyScore: 58,
          safetyStatus: 'MODERATE',
          locationConfidence: 'MODERATE',
          connectivityState: 'ONLINE',
          areaZoneLabel: 'Off-Course',
          routeStatusLabel: 'Deviation (+2.4km)',
          checkInStatusLabel: 'Window Elapsed (+15m)',
          batteryPercent: 78,
          explanation: 'Unusual path deviation detected 800m north of designated corridor. Tap to verify wellbeing.',
          factors: [
            { name: 'Route Divergence', score: 45, description: 'Headed east along Mawryngkneng bypass instead of planned route.' },
            { name: 'Check-in Window', score: 52, description: 'Nominal 2:00 PM check-in elapsed without itinerary refresh.' },
            { name: 'Buffer Vicinity', score: 60, description: '650m to outer perimeter of Reserved Forest.' }
          ]
        };
        break;

      case 'offline':
        this.currentTelemetry = {
          safetyScore: 88,
          safetyStatus: 'UNKNOWN',
          locationConfidence: 'STALE',
          connectivityState: 'OFFLINE',
          areaZoneLabel: 'Cached Nominal',
          routeStatusLabel: 'Offline Navigation',
          checkInStatusLabel: 'Cached',
          batteryPercent: 76,
          explanation: 'No cellular tower handshake. Full offline mesh safety packet & local map guide active.',
          factors: [
            { name: 'Offline Safety Dossier', score: 95, description: '48.2 MB vector maps and emergency registry cached.' },
            { name: 'Local Geolocation', score: 75, description: 'GPS coordinates held via hardware receiver.' },
            { name: 'SMS Satellite Fallback', score: 90, description: 'Automated 140-char encrypted SMS beacon ready.' }
          ]
        };
        break;
    }

    return this.getTelemetry();
  }

  public async fetchTelemetry(): Promise<SafetyTelemetrySnapshot> {
    const res = await apiClient.request<SafetyTelemetrySnapshot>('/safety/status', {
      mockFallback: () => this.getTelemetry()
    });
    this.currentTelemetry = res.data;
    return res.data;
  }
}

export const safetyService = new SafetyService();
