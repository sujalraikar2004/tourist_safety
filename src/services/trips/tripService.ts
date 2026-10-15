/**
 * SMART TOURIST SAFETY MONITORING & INCIDENT RESPONSE SYSTEM
 * Trip & Itinerary Management Service
 */

import { Trip, ItineraryStop } from '../../types';
import { MOCK_TRIP } from '../../constants/mockData';
import { apiClient } from '../api/apiClient';

class TripService {
  private activeTrip: Trip = { ...MOCK_TRIP };

  public getActiveTrip(): Trip {
    return { ...this.activeTrip };
  }

  public async fetchTrip(): Promise<Trip> {
    const res = await apiClient.request<Trip>(`/trips/${this.activeTrip.id}`, {
      mockFallback: () => this.getActiveTrip()
    });
    this.activeTrip = res.data;
    return res.data;
  }

  public addCustomCheckpoint(stop: Omit<ItineraryStop, 'id' | 'dayNumber' | 'status'>): ItineraryStop {
    const newStop: ItineraryStop = {
      ...stop,
      id: `stop_${Date.now()}`,
      dayNumber: this.activeTrip.currentDay,
      status: 'UPCOMING'
    };

    const currentDay = this.activeTrip.days.find(d => d.dayNumber === this.activeTrip.currentDay);
    if (currentDay) {
      currentDay.stops.push(newStop);
    }
    return newStop;
  }
}

export const tripService = new TripService();
