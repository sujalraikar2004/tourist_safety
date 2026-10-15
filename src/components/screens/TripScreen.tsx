/**
 * SAFE TOUR — Trip & Itinerary Monitor Screen
 * Faithful implementation of Google Stitch Itinerary with Day Selector,
 * Safe Timeline Backbone, Daylight Window, Offline Dossier, and Live Corridor Sharing.
 */

import React, { useState } from 'react';
import { Trip, ItineraryStop } from '../../types';
import { tripService } from '../../services/trips/tripService';

interface TripScreenProps {
  trip: Trip;
  onNavigateTab: (tab: 'home' | 'map' | 'trip' | 'alerts' | 'profile') => void;
  onShowToast: (msg: string) => void;
}

export const TripScreen: React.FC<TripScreenProps> = ({ trip, onNavigateTab, onShowToast }) => {
  const [selectedDay, setSelectedDay] = useState(trip.currentDay);
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [customCheckpointModal, setCustomCheckpointModal] = useState(false);
  const [checkpointTitle, setCheckpointTitle] = useState('');
  const [checkpointTime, setCheckpointTime] = useState('03:30 PM');

  const currentDayData = trip.days.find(d => d.dayNumber === selectedDay) || trip.days[2];

  const handleCopy = () => {
    setCopiedLink(true);
    navigator.clipboard?.writeText('https://safetour.gov/track/DTID-8F4K29-D3');
    onShowToast('Corridor link copied to clipboard');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddCheckpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkpointTitle.trim()) return;

    tripService.addCustomCheckpoint({
      title: checkpointTitle,
      timeLabel: checkpointTime,
      description: 'Custom traveler waypoint registered locally in active trip dossier.',
      locationLabel: 'East Khasi Hills Safe Track',
      latitude: 25.35,
      longitude: 91.73
    });

    setCustomCheckpointModal(false);
    setCheckpointTitle('');
    onShowToast(`Waypoint added to Day ${trip.currentDay} itinerary`);
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      {/* Trip Overview Header Card */}
      <section className="px-margin pt-space-md">
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col gap-space-md border border-surface-container">
          {/* Title & Active Status Row */}
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] tracking-wide uppercase font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
                  Active Trip
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  Day {trip.currentDay} of {trip.totalDays}
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight truncate font-bold">
                {trip.title}
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {trip.startDate} – {trip.endDate} • {trip.region}
              </p>
            </div>

            {/* Share Live Consent Trigger */}
            <button
              type="button"
              onClick={() => setShareDrawerOpen(true)}
              aria-label="Share live itinerary with contacts"
              className="shrink-0 p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors active:scale-95 flex items-center justify-center text-on-surface cursor-pointer border border-surface-container-high shadow-2xs"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary">share_location</span>
            </button>
          </div>

          {/* Quick Telemetry Bento Grid */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {/* Safety Score Metric */}
            <div className="flex flex-col p-2.5 rounded-lg bg-surface-container-low border border-surface-container">
              <div className="flex items-center gap-1 text-secondary mb-1">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
                <span className="font-label-sm text-[10px] uppercase font-bold tracking-wider">Safety</span>
              </div>
              <span className="font-title-md text-title-md font-bold text-on-surface">94%</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant">Low Risk Track</span>
            </div>

            {/* Progress Distance Metric */}
            <div className="flex flex-col p-2.5 rounded-lg bg-surface-container-low border border-surface-container">
              <div className="flex items-center gap-1 text-primary-container mb-1">
                <span className="material-symbols-outlined text-[16px]">route</span>
                <span className="font-label-sm text-[10px] uppercase font-bold tracking-wider">Distance</span>
              </div>
              <span className="font-title-md text-title-md font-bold text-on-surface">
                {trip.distanceCoveredKm}
                <span className="text-xs text-on-surface-variant font-normal">/{trip.totalDistanceKm}km</span>
              </span>
              <span className="font-body-sm text-[11px] text-on-surface-variant">41% Covered</span>
            </div>

            {/* Offline Dossier Status */}
            <div className="flex flex-col p-2.5 rounded-lg bg-surface-container-low border border-surface-container">
              <div className="flex items-center gap-1 text-secondary mb-1">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  cloud_done
                </span>
                <span className="font-label-sm text-[10px] uppercase font-bold tracking-wider">Storage</span>
              </div>
              <span className="font-title-md text-title-md font-bold text-on-surface">Cached</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant truncate">Full Dossier</span>
            </div>
          </div>

          {/* Ambient Quick Action Buttons */}
          <div className="flex items-center gap-space-sm pt-1">
            <button
              type="button"
              onClick={() => setCustomCheckpointModal(true)}
              className="flex-1 min-h-[44px] px-space-sm rounded-lg bg-primary text-on-primary flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform cursor-pointer font-bold font-label-md text-label-md shadow-xs hover:bg-neutral-800"
            >
              <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
              <span>Add Stop</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('offline-dossier-sec');
                el?.scrollIntoView({ behavior: 'smooth' });
                onShowToast('Navigated to Encrypted Offline Dossier');
              }}
              className="flex-1 min-h-[44px] px-space-sm rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform cursor-pointer font-bold font-label-md text-label-md border border-surface-container hover:bg-surface-container-highest"
            >
              <span className="material-symbols-outlined text-[18px]">lock_clock</span>
              <span>Safety Dossier</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Day Selector Strip */}
      <section className="pt-space-lg">
        <div className="flex items-center justify-between px-margin mb-2">
          <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
            Trip Itinerary
          </span>
          <span className="font-label-sm text-[11px] text-secondary font-semibold">7 Days Protected</span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto px-margin pb-2 no-scrollbar">
          {trip.days.map(d => {
            const isToday = d.isToday;
            const isSelected = selectedDay === d.dayNumber;

            return (
              <button
                key={d.dayNumber}
                type="button"
                onClick={() => setSelectedDay(d.dayNumber)}
                className={`shrink-0 flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all cursor-pointer min-w-[76px] ${
                  isSelected
                    ? 'bg-primary-container text-on-primary shadow-md ring-2 ring-secondary/50'
                    : d.isCompleted
                    ? 'bg-surface-container-lowest text-on-surface shadow-2xs border border-surface-container'
                    : 'bg-surface-container-low text-on-surface-variant border border-surface-container'
                }`}
              >
                <span className={`font-label-sm text-[10px] ${isSelected ? 'text-on-primary-container font-bold' : 'text-on-surface-variant font-semibold'}`}>
                  {isToday ? 'TODAY' : d.dateLabel}
                </span>
                <span className={`font-title-md text-title-md font-bold ${isSelected ? 'text-on-primary' : 'text-on-surface'}`}>
                  D{d.dayNumber}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold mt-0.5">
                  {d.isCompleted ? (
                    <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
                  ) : isToday ? (
                    <span className="inline-flex items-center gap-1 text-secondary-container">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" /> Live
                    </span>
                  ) : (
                    <span className="text-[10px] text-on-surface-variant font-normal">
                      {d.dayNumber === 4 ? 'Trek' : d.dayNumber === 5 ? 'Dawki' : 'Clean Vlg'}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Live Daylight & Environment Banner */}
      <section className="px-margin pt-space-sm">
        <div className="rounded-xl p-3 bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-between shadow-2xs border border-tertiary-fixed-dim/40">
          <div className="flex items-center gap-2.5">
            <span
              className="material-symbols-outlined text-[24px] text-on-tertiary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              wb_twilight
            </span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-bold text-on-tertiary-container">
                Daylight Safety Window: 04h 09m left
              </span>
              <span className="font-body-sm text-[11px] text-on-tertiary-fixed-variant">
                Sunset in Sohra at 5:24 PM • Dense mist expected
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-title-md text-title-md font-bold text-on-tertiary-container">18°C</span>
            <span className="block font-body-sm text-[10px] text-on-tertiary-fixed-variant">Partly Misty</span>
          </div>
        </div>
      </section>

      {/* Route Segment Title */}
      <div className="px-margin pt-space-lg flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-title-md text-title-md text-on-surface font-bold">
            {currentDayData.title}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {currentDayData.subtitle}
          </span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px] border border-surface-container-high">
          <span className="material-symbols-outlined text-[14px] text-secondary">schedule</span>
          <span>1:15 PM</span>
        </div>
      </div>

      {/* Safe Timeline Container with Vertical Backbone Line */}
      <section className="px-margin pt-space-sm flex flex-col relative">
        <div className="absolute left-[31px] top-6 bottom-8 w-[2px] bg-outline-variant/60 -z-0" />

        {/* Day Stops */}
        {currentDayData.stops.map(stop => {
          const isCompleted = stop.status === 'COMPLETED';
          const isActive = stop.status === 'ACTIVE';

          return (
            <div key={stop.id} className="flex items-start gap-3 relative z-10 pb-space-lg">
              {/* Node Indicator */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                  isCompleted
                    ? 'bg-secondary text-on-secondary'
                    : isActive
                    ? 'bg-primary-container text-on-primary ring-4 ring-secondary/20 shadow-md'
                    : stop.isSafeHaven
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isCompleted
                    ? 'done'
                    : isActive
                    ? 'navigation'
                    : stop.isSafeHaven
                    ? 'night_shelter'
                    : 'schedule'}
                </span>
              </div>

              {/* Card Content */}
              <div
                className={`flex-1 bg-surface-container-lowest rounded-xl p-space-md shadow-xs border ${
                  isActive ? 'border-secondary/40 shadow-sm ring-1 ring-secondary/20' : 'border-surface-container'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <div className="flex flex-col">
                    <span
                      className={`font-label-sm text-[10px] font-bold uppercase tracking-wider ${
                        isCompleted ? 'text-secondary' : isActive ? 'text-secondary' : 'text-on-surface-variant'
                      }`}
                    >
                      {stop.timeLabel} • {stop.status === 'ACTIVE' ? 'Next Stop • In 1h 15m' : stop.status}
                    </span>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface mt-0.5">
                      {stop.title}
                    </h3>
                  </div>

                  {isCompleted ? (
                    <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                  ) : isActive ? (
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-[11px] font-bold">
                      {stop.locationLabel}
                    </span>
                  ) : stop.advisoryType === 'warning' ? (
                    <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[10px] font-bold">
                      Caution
                    </span>
                  ) : stop.isSafeHaven ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[12px]">verified</span> Vetted
                    </span>
                  ) : null}
                </div>

                <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">
                  {stop.description}
                </p>

                {/* Optional Attached Photo */}
                {stop.imageUrl && (
                  <div className="relative w-full h-28 rounded-lg overflow-hidden my-2 bg-surface-container border border-surface-container-high">
                    <img className="w-full h-full object-cover" alt={stop.title} src={stop.imageUrl} />
                    <div className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface font-label-sm text-[10px] font-semibold">
                      {stop.locationLabel}
                    </div>
                  </div>
                )}

                {/* Advisory highlight box */}
                {stop.advisory && (
                  <div
                    className={`rounded-lg p-2.5 flex items-start gap-2 mb-2.5 border ${
                      stop.advisoryType === 'warning'
                        ? 'bg-error-container/40 border-error/20 text-on-error-container'
                        : 'bg-surface-container-low border-surface-container text-on-surface'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
                        stop.advisoryType === 'warning' ? 'text-error' : 'text-secondary'
                      }`}
                    >
                      {stop.advisoryType === 'warning' ? 'warning' : 'info'}
                    </span>
                    <p className="font-body-sm text-[11px] leading-snug">{stop.advisory}</p>
                  </div>
                )}

                {/* Active telemetry tags for Next Stop */}
                {isActive && (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-3 pt-0.5">
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-surface-container-low border border-surface-container">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          signal_cellular_4_bar
                        </span>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-[10px] text-on-surface-variant">Cellular</span>
                          <span className="font-label-sm text-[11px] font-bold text-on-surface">
                            {stop.cellularSignal}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-surface-container-low border border-surface-container">
                        <span className="material-symbols-outlined text-[16px] text-secondary">local_police</span>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-[10px] text-on-surface-variant">Assistance</span>
                          <span className="font-label-sm text-[11px] font-bold text-on-surface">
                            {stop.assignedPatrol}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigateTab('map')}
                        className="flex-1 min-h-[44px] px-3 rounded-lg bg-primary text-on-primary flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer font-bold font-label-md text-label-md"
                      >
                        <span className="material-symbols-outlined text-[18px]">turn_sharp_right</span>
                        <span>Safe Route</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onShowToast('Waypoint Check-In logged for Mawkdok Dympep')}
                        className="min-h-[44px] px-3.5 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer font-bold font-label-md text-label-md"
                      >
                        <span className="material-symbols-outlined text-[18px]">pin_drop</span>
                        <span>Check In</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Safety Dossier & Offline Tools Panel */}
      <section id="offline-dossier-sec" className="px-margin pt-space-lg">
        <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">offline_pin</span>
              <span className="font-title-md text-title-md font-bold text-on-surface">Encrypted Offline Dossier</span>
            </div>
            <span className="font-label-sm text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-mono">
              ON-DEVICE
            </span>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Local telemetry, mountain rescue beacons, and embassy contact vectors are locally cached for zero-connectivity scenarios.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="tel:112"
              className="p-2.5 rounded-lg bg-surface-container-lowest flex items-center gap-2 border border-surface-container hover:bg-surface-container-high transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">local_police</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-[11px] font-bold text-on-surface truncate">Sohra Police</span>
                <span className="font-body-sm text-[10px] text-on-surface-variant">+91 3637 235222</span>
              </div>
            </a>

            <a
              href="tel:+919876543210"
              className="p-2.5 rounded-lg bg-surface-container-lowest flex items-center gap-2 border border-surface-container hover:bg-surface-container-high transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">favorite</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-[11px] font-bold text-on-surface truncate">Priya Sharma</span>
                <span className="font-body-sm text-[10px] text-on-surface-variant">Primary Kin</span>
              </div>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setCustomCheckpointModal(true)}
            className="w-full mt-2 min-h-[46px] rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-xs border border-surface-container active:scale-[0.99] transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Add Custom Checkpoint / Note</span>
          </button>
        </div>
      </section>

      {/* Share Live Consent Drawer Modal */}
      {shareDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-end justify-center p-0 animate-in fade-in">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-2xl p-space-lg flex flex-col gap-space-md shadow-2xl border-t border-surface-container">
            <div className="w-12 h-1 rounded-full bg-surface-container-highest mx-auto mb-1" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">lock</span>
              </div>
              <div className="flex flex-col">
                <h2 className="font-title-md text-title-md font-bold text-on-surface">Share Live Tourist Corridor</h2>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                  End-to-end encrypted telemetry link
                </span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Your temporary safety corridor link (expires in 24h) allows verified family and tourist marshals to monitor your proximity without exposing unencrypted GPS trails.
            </p>
            <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between font-mono text-xs text-on-surface border border-surface-container">
              <span className="truncate">safetour.gov/track/DTID-8F4K29-D3</span>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 ml-2 text-secondary font-bold font-label-sm text-[11px] cursor-pointer hover:underline"
              >
                {copiedLink ? 'COPIED!' : 'COPY'}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShareDrawerOpen(false)}
              className="w-full min-h-[48px] rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold cursor-pointer"
            >
              Done Sharing
            </button>
          </div>
        </div>
      )}

      {/* Custom Checkpoint Modal */}
      {customCheckpointModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddCheckpoint}
            className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 shadow-xl border border-surface-container space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-title-md text-title-md font-bold text-on-surface">Add Waypoint / Note</h3>
              <button
                type="button"
                onClick={() => setCustomCheckpointModal(false)}
                className="text-on-surface-variant p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-on-surface font-semibold">Checkpoint Name</label>
              <input
                type="text"
                required
                value={checkpointTitle}
                onChange={e => setCheckpointTitle(e.target.value)}
                placeholder="e.g. Wahkaba Falls Scenic Overlook"
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-on-surface font-semibold">Planned Time</label>
              <input
                type="text"
                value={checkpointTime}
                onChange={e => setCheckpointTime(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCustomCheckpointModal(false)}
                className="flex-1 h-11 rounded-lg bg-surface-container text-on-surface font-label-md font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-11 rounded-lg bg-primary text-on-primary font-label-md font-bold cursor-pointer"
              >
                Save Stop
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
