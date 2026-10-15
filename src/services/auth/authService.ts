/**
 * SMART TOURIST SAFETY MONITORING & INCIDENT RESPONSE SYSTEM
 * Authentication & Tourist Identity Service
 */

import { TouristProfile } from '../../types';
import { MOCK_TOURIST } from '../../constants/mockData';
import { apiClient } from '../api/apiClient';

export interface AuthSession {
  token: string;
  tourist: TouristProfile;
  authenticatedAt: string;
}

class AuthService {
  private currentSession: AuthSession | null = {
    token: 'jwt_mock_token_arjun_8f4k29',
    tourist: MOCK_TOURIST,
    authenticatedAt: new Date().toISOString()
  };

  public getSession(): AuthSession | null {
    return this.currentSession;
  }

  public isAuthenticated(): boolean {
    return !!this.currentSession;
  }

  public async login(identifier: string, pin: string): Promise<TouristProfile> {
    const res = await apiClient.request<TouristProfile>('/auth/login', {
      method: 'POST',
      body: { identifier, pin },
      mockFallback: () => {
        return {
          ...MOCK_TOURIST,
          phone: identifier.includes('+') ? identifier : MOCK_TOURIST.phone,
          dtid: identifier.startsWith('DTID') ? identifier : MOCK_TOURIST.dtid
        };
      }
    });

    this.currentSession = {
      token: 'jwt_mock_token_8f4k29',
      tourist: res.data,
      authenticatedAt: new Date().toISOString()
    };
    apiClient.setToken(this.currentSession.token);
    return res.data;
  }

  public async register(params: {
    fullName: string;
    phone: string;
    nationality: string;
    emergencyContact: string;
    pin: string;
  }): Promise<TouristProfile> {
    const hash = Math.abs(params.fullName.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0))
      .toString(16).toUpperCase().padStart(6, '0').slice(0, 6);

    const generatedDtid = `DTID-${hash}`;

    const newTourist: TouristProfile = {
      id: `tourist_${Date.now()}`,
      name: params.fullName,
      age: 28,
      gender: 'Unspecified',
      nationality: params.nationality || 'Indian',
      phone: params.phone,
      bloodGroup: 'O+',
      allergies: 'None recorded',
      dtid: generatedDtid,
      tier: 'Tier 3 Cleared',
      zonePass: 'Zone Pass #4',
      kycVersion: 'KYC V2'
    };

    const res = await apiClient.request<TouristProfile>('/auth/register', {
      method: 'POST',
      body: { ...params, dtid: generatedDtid },
      mockFallback: () => newTourist
    });

    this.currentSession = {
      token: `jwt_token_${generatedDtid}`,
      tourist: res.data,
      authenticatedAt: new Date().toISOString()
    };
    apiClient.setToken(this.currentSession.token);
    return res.data;
  }

  public async logout(): Promise<void> {
    this.currentSession = null;
    apiClient.setToken(null);
  }
}

export const authService = new AuthService();
