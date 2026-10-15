/**
 * SMART TOURIST SAFETY MONITORING & INCIDENT RESPONSE SYSTEM
 * AI Anomaly Verification & Guardian Escalation Service
 */

import { AnomalyIncident } from '../../types';
import { MOCK_ANOMALY } from '../../constants/mockData';
import { apiClient } from '../api/apiClient';

class AnomalyService {
  private currentAnomaly: AnomalyIncident | null = { ...MOCK_ANOMALY };

  public getActiveAnomaly(): AnomalyIncident | null {
    return this.currentAnomaly ? { ...this.currentAnomaly } : null;
  }

  public triggerSimulatedAnomaly(): AnomalyIncident {
    this.currentAnomaly = {
      ...MOCK_ANOMALY,
      id: `anom_${Date.now()}`,
      status: 'PENDING',
      detectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      autoEscalationSeconds: 900
    };
    return this.currentAnomaly;
  }

  public async confirmSafe(): Promise<void> {
    if (this.currentAnomaly) {
      this.currentAnomaly.status = 'CONFIRMED_SAFE';
    }
    await apiClient.request(`/anomalies/${this.currentAnomaly?.id}/verify`, {
      method: 'POST',
      body: { status: 'CONFIRMED_SAFE' },
      mockFallback: () => ({ verified: true })
    });
  }

  public async requestAssistance(): Promise<void> {
    if (this.currentAnomaly) {
      this.currentAnomaly.status = 'HELP_REQUESTED';
    }
  }

  public clearAnomaly(): void {
    this.currentAnomaly = null;
  }
}

export const anomalyService = new AnomalyService();
