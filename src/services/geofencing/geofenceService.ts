/**
 * SMART TOURIST SAFETY MONITORING & INCIDENT RESPONSE SYSTEM
 * Geofencing & Risk-Zone Alert Management Service
 */

import { RiskZone } from '../../types';
import { MOCK_RISK_ZONE } from '../../constants/mockData';
import { apiClient } from '../api/apiClient';

class GeofenceService {
  private activeZones: RiskZone[] = [MOCK_RISK_ZONE];
  private isBypassActive: boolean = false;

  public getNearbyRiskZones(): RiskZone[] {
    return [...this.activeZones];
  }

  public getPrimaryRiskZone(): RiskZone {
    return this.activeZones[0];
  }

  public setBypassActive(active: boolean) {
    this.isBypassActive = active;
  }

  public isBypassRouteEngaged(): boolean {
    return this.isBypassActive;
  }

  public async fetchRiskZones(): Promise<RiskZone[]> {
    const res = await apiClient.request<RiskZone[]>('/risk-zones/nearby', {
      mockFallback: () => this.getNearbyRiskZones()
    });
    this.activeZones = res.data;
    return res.data;
  }
}

export const geofenceService = new GeofenceService();
