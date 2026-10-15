/**
 * SMART TOURIST SAFETY MONITORING & INCIDENT RESPONSE SYSTEM
 * Alerts, Notifications & Check-In Service
 */

import { AlertNotification, SafetyCheckIn } from '../../types';
import { MOCK_INITIAL_ALERTS, MOCK_CHECKIN } from '../../constants/mockData';
import { apiClient } from '../api/apiClient';

class AlertService {
  private alerts: AlertNotification[] = [...MOCK_INITIAL_ALERTS];

  public getAlerts(): AlertNotification[] {
    return [...this.alerts];
  }

  public getUnreadCount(): number {
    return this.alerts.filter(a => a.isNew).length;
  }

  public markAllAsRead(): void {
    this.alerts = this.alerts.map(a => ({ ...a, isNew: false }));
  }

  public markAsRead(id: string): void {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.isNew = false;
    }
  }

  public addAlert(alert: Omit<AlertNotification, 'id' | 'timestamp' | 'isNew'>): AlertNotification {
    const newAlert: AlertNotification = {
      ...alert,
      id: `alert_${Date.now()}`,
      timestamp: 'Just now',
      isNew: true
    };
    this.alerts.unshift(newAlert);
    return newAlert;
  }
}

class CheckInService {
  private currentCheckIn: SafetyCheckIn = { ...MOCK_CHECKIN };

  public getCurrentCheckIn(): SafetyCheckIn {
    return { ...this.currentCheckIn };
  }

  public async completeCheckIn(isOffline: boolean = false): Promise<SafetyCheckIn> {
    const completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.currentCheckIn = {
      ...this.currentCheckIn,
      status: 'COMPLETED',
      completedAt,
      batteryPercent: 84
    };

    if (isOffline) {
      apiClient.queueOfflineOperation('/check-ins/complete', 'POST', {
        checkInId: this.currentCheckIn.id,
        completedAt
      });
    } else {
      await apiClient.request(`/check-ins/${this.currentCheckIn.id}/complete`, {
        method: 'POST',
        body: { completedAt },
        mockFallback: () => this.currentCheckIn
      });
    }

    return this.currentCheckIn;
  }
}

export const alertService = new AlertService();
export const checkInService = new CheckInService();
