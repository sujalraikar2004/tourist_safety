/**
 * SMART TOURIST SAFETY MONITORING & INCIDENT RESPONSE SYSTEM
 * Emergency SOS Workflow Service & State Machine
 */

import { SOSIncident, SOSEventState } from '../../types';
import { MOCK_INITIAL_SOS } from '../../constants/mockData';
import { apiClient } from '../api/apiClient';

class EmergencyService {
  private currentIncident: SOSIncident = { ...MOCK_INITIAL_SOS };
  private listeners: ((incident: SOSIncident) => void)[] = [];

  public getIncident(): SOSIncident {
    return { ...this.currentIncident };
  }

  public subscribe(listener: (incident: SOSIncident) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.getIncident()));
  }

  public async triggerSOS(isOfflineMode: boolean = false): Promise<SOSIncident> {
    const timestamp = new Date().toISOString();
    const idempotencyKey = `sos_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;

    if (isOfflineMode) {
      // Offline emergency queueing
      this.currentIncident = {
        ...this.currentIncident,
        status: 'QUEUED_OFFLINE',
        timestamp,
        connectivityStatus: 'OFFLINE',
        checklist: {
          tokenGenerated: true,
          gpsAnchored: true,
          dispatchNotified: false,
          smsAlertQueued: true,
          patrolAssigned: false
        }
      };

      apiClient.queueOfflineOperation('/emergencies/sos', 'POST', {
        idempotencyKey,
        incident: this.currentIncident
      });

      this.notify();
      return this.getIncident();
    }

    // Step 1: Sending telemetry
    this.currentIncident = {
      ...this.currentIncident,
      status: 'SENDING',
      timestamp,
      connectivityStatus: 'ONLINE',
      checklist: {
        tokenGenerated: true,
        gpsAnchored: true,
        dispatchNotified: false,
        smsAlertQueued: true,
        patrolAssigned: false
      }
    };
    this.notify();

    // Step 2: Submitted to backend
    await new Promise(res => setTimeout(res, 900));
    this.currentIncident = {
      ...this.currentIncident,
      status: 'SUBMITTED',
      checklist: {
        ...this.currentIncident.checklist,
        dispatchNotified: true
      }
    };
    this.notify();

    // Step 3: Acknowledged by Central Command
    await new Promise(res => setTimeout(res, 1200));
    this.currentIncident = {
      ...this.currentIncident,
      status: 'ACKNOWLEDGED',
      checklist: {
        ...this.currentIncident.checklist,
        patrolAssigned: true
      }
    };
    this.notify();

    // Step 4: Patrol Unit #14 Dispatched / Responding
    await new Promise(res => setTimeout(res, 1500));
    this.currentIncident = {
      ...this.currentIncident,
      status: 'RESPONDING'
    };
    this.notify();

    return this.getIncident();
  }

  public async cancelSOS(): Promise<SOSIncident> {
    this.currentIncident = {
      ...this.currentIncident,
      status: 'RESOLVED',
      checklist: {
        tokenGenerated: false,
        gpsAnchored: false,
        dispatchNotified: false,
        smsAlertQueued: false,
        patrolAssigned: false
      }
    };
    this.notify();

    // Reset to idle after safe confirmation
    setTimeout(() => {
      this.currentIncident.status = 'IDLE';
      this.notify();
    }, 2000);

    return this.getIncident();
  }
}

export const emergencyService = new EmergencyService();
