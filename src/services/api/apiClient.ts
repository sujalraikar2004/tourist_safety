/**
 * SMART TOURIST SAFETY MONITORING & INCIDENT RESPONSE SYSTEM
 * Centralized API Client with Offline Queueing & Mock Mode Fallback
 */

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  source: 'NETWORK' | 'CACHE' | 'OFFLINE_QUEUE' | 'MOCK_PROVIDER';
}

export interface QueuedOperation {
  id: string;
  endpoint: string;
  method: string;
  payload: any;
  createdAt: string;
  retryCount: number;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private isMockMode: boolean = true; // Default to true for academic demo before live MERN backend
  private offlineQueue: QueuedOperation[] = [];

  constructor() {
    const envApiUrl =
      (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.EXPO_PUBLIC_API_URL) ||
      (typeof window !== 'undefined' && (window as any).__EXPO_API_URL__);
    this.baseUrl = envApiUrl || '/api';
  }

  public setToken(token: string | null) {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }

  public setMockMode(enabled: boolean) {
    this.isMockMode = enabled;
  }

  public getMockMode(): boolean {
    return this.isMockMode;
  }

  public getOfflineQueueCount(): number {
    return this.offlineQueue.length;
  }

  public queueOfflineOperation(endpoint: string, method: string, payload: any): QueuedOperation {
    const op: QueuedOperation = {
      id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      endpoint,
      method,
      payload,
      createdAt: new Date().toISOString(),
      retryCount: 0
    };
    this.offlineQueue.push(op);
    return op;
  }

  public flushOfflineQueue(): QueuedOperation[] {
    const flushed = [...this.offlineQueue];
    this.offlineQueue = [];
    return flushed;
  }

  public async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
      body?: any;
      headers?: Record<string, string>;
      mockFallback?: () => T;
    } = {}
  ): Promise<ApiResponse<T>> {
    const method = options.method || 'GET';

    // If mock mode is forced or mock fallback requested during development
    if (this.isMockMode && options.mockFallback) {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate realistic network latency
      return {
        data: options.mockFallback(),
        success: true,
        source: 'MOCK_PROVIDER'
      };
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        ...options.headers
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        data,
        success: true,
        source: 'NETWORK'
      };
    } catch (err: any) {
      // In offline or fallback situation, return mockFallback if available
      if (options.mockFallback) {
        return {
          data: options.mockFallback(),
          success: true,
          message: 'Network offline. Showing cached / mock verification data.',
          source: 'CACHE'
        };
      }
      throw err;
    }
  }
}

export const apiClient = new ApiClient();
