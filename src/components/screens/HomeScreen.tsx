/**
 * SAFE TOUR — Tourist Home Screen
 * Faithful implementation of Google Stitch Home designs with interactive safety radar,
 * telemetry switcher, check-in workflow, and itinerary preview.
 */

import React, { useState } from 'react';
import { TouristProfile } from '../../types';
import { safetyService, SafetyTelemetrySnapshot } from '../../services/safety/safetyService';
import { checkInService } from '../../services/alerts/alertService';

interface HomeScreenProps {
  tourist: TouristProfile;
  onNavigateTab: (tab: 'home' | 'map' | 'trip' | 'alerts' | 'profile') => void;
  onOpenTouristId: () => void;
  onOpenSOS: () => void;
  onOpenAnomaly: () => void;
  onShowToast: (msg: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  tourist,
  onNavigateTab,
  onOpenTouristId,
  onOpenSOS,
  onOpenAnomaly,
  onShowToast
}) => {
  const [activeStatePreset, setActiveStatePreset] = useState<'safe' | 'risk' | 'anomaly' | 'offline'>('safe');
  const [telemetry, setTelemetry] = useState<SafetyTelemetrySnapshot>(safetyService.getTelemetry());
  const [checkInDone, setCheckInDone] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const handleStateChange = (preset: 'safe' | 'risk' | 'anomaly' | 'offline') => {
    setActiveStatePreset(preset);
    const updated = safetyService.setSimulatedState(preset);
    setTelemetry(updated);
    if (preset === 'anomaly') {
      onOpenAnomaly();
    }
    onShowToast(`Simulated telemetry switched to: ${preset.toUpperCase()}`);
  };

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    await new Promise(r => setTimeout(r, 600));
    await checkInService.completeCheckIn(telemetry.connectivityState === 'OFFLINE');
    setIsCheckingIn(false);
    setCheckInDone(true);
    onShowToast('Safety Check-In timestamp logged & synced');
    setTimeout(() => setCheckInDone(false), 4500);
  };

  // Determine stroke-dashoffset for the circular radar (perimeter = 2 * PI * 50 = 314.16)
  const maxDash = 314.16;
  const progressPercent = Math.min(100, Math.max(0, telemetry.safetyScore));
  const dashOffset = maxDash - (maxDash * progressPercent) / 100;

  const getScoreTheme = () => {
    if (telemetry.safetyStatus === 'SAFE') return { stroke: '#00696d', bg: 'bg-secondary', halo: 'bg-secondary-container/40', text: 'text-secondary', badgeDot: 'bg-secondary' };
    if (telemetry.safetyStatus === 'ELEVATED') return { stroke: '#c76c00', bg: 'bg-on-tertiary-container', halo: 'bg-tertiary-fixed/60', text: 'text-on-tertiary-container', badgeDot: 'bg-on-tertiary-container' };
    if (telemetry.safetyStatus === 'MODERATE') return { stroke: '#ba1a1a', bg: 'bg-error', halo: 'bg-error-container/60', text: 'text-error', badgeDot: 'bg-error' };
    return { stroke: '#75777d', bg: 'bg-outline', halo: 'bg-surface-container', text: 'text-outline', badgeDot: 'bg-outline' };
  };

  const scoreTheme = getScoreTheme();

  return (
    <div className="flex flex-col w-full px-margin space-y-space-md pb-28 pt-4">
      {/* Interactive State Switcher Pill Bar (For Reviewers & Academic Demo) */}
      <div className="w-full bg-surface-container-high rounded-xl p-space-xs shadow-xs overflow-x-auto no-scrollbar border border-outline-variant/30">
        <div className="flex items-center justify-between gap-1 min-w-[360px]">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase px-2 tracking-wider flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[14px]">tune</span> State:
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => handleStateChange('safe')}
              className={`px-2.5 py-1 rounded-lg text-label-sm font-label-sm transition-all duration-200 cursor-pointer ${
                activeStatePreset === 'safe'
                  ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Normal (Safe 92)
            </button>
            <button
              type="button"
              onClick={() => handleStateChange('risk')}
              className={`px-2.5 py-1 rounded-lg text-label-sm font-label-sm transition-all duration-200 cursor-pointer ${
                activeStatePreset === 'risk'
                  ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Risk Zone
            </button>
            <button
              type="button"
              onClick={() => handleStateChange('anomaly')}
              className={`px-2.5 py-1 rounded-lg text-label-sm font-label-sm transition-all duration-200 cursor-pointer ${
                activeStatePreset === 'anomaly'
                  ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Unusual Movement
            </button>
            <button
              type="button"
              onClick={() => handleStateChange('offline')}
              className={`px-2.5 py-1 rounded-lg text-label-sm font-label-sm transition-all duration-200 cursor-pointer ${
                activeStatePreset === 'offline'
                  ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Offline
            </button>
          </div>
        </div>
      </div>

      {/* Traveler Welcome & Context Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs space-y-space-sm border border-surface-container">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                Nominal Travel Mode
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
              Good morning, {tourist.name.split(' ')[0]}
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Meghalaya Adventure • Exploring Shillong Hills
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center p-1.5 shrink-0 shadow-xs border border-secondary/15">
            <span className="material-symbols-outlined text-[28px] text-secondary">explore</span>
          </div>
        </div>

        {/* Live Telemetry Status Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="inline-flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded-full border border-surface-container">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-sm text-label-sm text-on-surface font-semibold">
              Trip active (Day 3 of 7)
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded-full border border-surface-container">
            <span className="material-symbols-outlined text-secondary text-[14px]">
              {telemetry.connectivityState === 'ONLINE' ? 'satellite_alt' : 'cloud_off'}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {telemetry.connectivityState === 'ONLINE'
                ? 'Online • GPS High Precision (±4m)'
                : 'Offline Mode • On-Device Vault Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Central Core Safety Indicator Radar Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs transition-all duration-300 relative overflow-hidden border border-surface-container">
        {/* Top accent indicator bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${scoreTheme.bg}`} />

        <div className="pt-2 flex flex-col items-center text-center">
          {/* Animated Circular Safety Radar Visual */}
          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                className="text-surface-container"
                cx="60"
                cy="60"
                fill="transparent"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                style={{ stroke: scoreTheme.stroke, strokeDashoffset: dashOffset }}
                className="transition-all duration-700 ease-out"
                cx="60"
                cy="60"
                fill="transparent"
                r="50"
                strokeDasharray="314.16"
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`w-20 h-20 rounded-full ${scoreTheme.halo} flex items-center justify-center animate-pulse`}>
                <span className={`material-symbols-outlined text-[36px] ${scoreTheme.text}`}>
                  {telemetry.safetyStatus === 'SAFE'
                    ? 'verified_user'
                    : telemetry.safetyStatus === 'ELEVATED'
                    ? 'warning'
                    : telemetry.safetyStatus === 'MODERATE'
                    ? 'crisis_alert'
                    : 'wifi_off'}
                </span>
              </div>
            </div>
          </div>

          {/* State Title & Metric Value */}
          <div className="space-y-1 mt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-container-low border border-surface-container">
              <span className={`w-2 h-2 rounded-full ${scoreTheme.badgeDot}`} />
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-wide uppercase">
                YOU'RE {telemetry.safetyStatus}
              </span>
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-display-lg text-display-lg font-bold text-on-surface">
                {telemetry.safetyScore}
              </span>
              <span className="font-title-md text-title-md text-on-surface-variant font-semibold">/ 100</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[280px] mx-auto leading-relaxed">
              {telemetry.explanation}
            </p>
          </div>

          {/* Telemetry Breakdown Micro-Chips */}
          <div className="grid grid-cols-2 gap-2 w-full mt-space-md pt-space-sm bg-surface-container-low/60 p-space-sm rounded-xl border border-surface-container">
            <div className="flex items-center gap-2 p-2 bg-surface-container-lowest rounded-lg border border-surface-container/60 shadow-2xs">
              <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
              <div className="text-left min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant block truncate">Area Zone</span>
                <span className="font-label-md text-label-md font-bold text-on-surface truncate block">
                  {telemetry.areaZoneLabel}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-surface-container-lowest rounded-lg border border-surface-container/60 shadow-2xs">
              <span className="material-symbols-outlined text-secondary text-[18px]">alt_route</span>
              <div className="text-left min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant block truncate">Route</span>
                <span className="font-label-md text-label-md font-bold text-on-surface truncate block">
                  {telemetry.routeStatusLabel}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-surface-container-lowest rounded-lg border border-surface-container/60 shadow-2xs">
              <span className="material-symbols-outlined text-secondary text-[18px]">alarm_on</span>
              <div className="text-left min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant block truncate">Check-In</span>
                <span className="font-label-md text-label-md font-bold text-on-surface truncate block">
                  {telemetry.checkInStatusLabel}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-surface-container-lowest rounded-lg border border-surface-container/60 shadow-2xs">
              <span className="material-symbols-outlined text-secondary text-[18px]">battery_charging_80</span>
              <div className="text-left min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant block truncate">Battery</span>
                <span className="font-label-md text-label-md font-bold text-on-surface truncate block">
                  {telemetry.batteryPercent}% (Good)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Check-In Action Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs space-y-space-sm border border-surface-container">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-title-md text-title-md text-on-surface font-bold">Safety Check-In</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Scheduled window: every 4 hours</p>
          </div>
          <span className="inline-flex items-center gap-1 text-label-sm font-label-sm text-secondary bg-secondary-container/40 px-2.5 py-1 rounded-full font-bold">
            <span className="material-symbols-outlined text-[14px]">schedule</span> Next: 6:00 PM
          </span>
        </div>

        <button
          type="button"
          disabled={isCheckingIn}
          onClick={handleCheckIn}
          className={`w-full min-h-[52px] font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all cursor-pointer font-bold ${
            checkInDone
              ? 'bg-secondary text-on-secondary'
              : 'bg-primary text-on-primary hover:bg-neutral-800'
          }`}
        >
          {isCheckingIn ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              <span>Verifying biometric & GPS packet...</span>
            </span>
          ) : checkInDone ? (
            <>
              <span className="material-symbols-outlined text-[20px]">task_alt</span>
              <span>Check-In Recorded ✓ (Safe Corridor Cleared)</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>Check In Now (I am safe)</span>
            </>
          )}
        </button>

        {checkInDone && (
          <div className="text-center py-1 animate-in fade-in">
            <span className="font-label-sm text-label-sm text-secondary font-bold flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Check-in timestamp saved locally & synced to emergency kin (Priya Sharma).
            </span>
          </div>
        )}
      </div>

      {/* Current Safety Zone Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs space-y-space-sm border border-surface-container">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0 border border-secondary/20">
              <span className="material-symbols-outlined text-secondary text-[22px]">location_on</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">
                Current Safety Zone
              </span>
              <h3 className="font-title-md text-title-md text-on-surface font-bold">Shillong Central Highland</h3>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Ward 4 • Meghalaya District Police Division
              </span>
            </div>
          </div>
          <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold">
            Verified Safe
          </span>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
          Normal-risk zone. Well-lit roads, active mobile signal, tourist assistance booth 650m away. Police patrol frequency: high.
        </p>

        {/* Map Geofence Preview Box */}
        <div className="w-full h-36 rounded-xl overflow-hidden relative shadow-inner bg-surface-container flex items-end p-2.5 border border-surface-container-high">
          <div
            className="absolute inset-0 bg-cover bg-center filter saturate-90 brightness-95"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&w=700&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-primary-container/30 backdrop-blur-[0.5px]" />
          <div className="relative z-10 w-full flex items-center justify-between bg-surface-container-lowest/90 backdrop-blur-md rounded-lg p-2 shadow-sm border border-surface-container">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase font-bold">
                  Active Geofence
                </span>
                <span className="font-label-sm text-label-sm text-on-surface font-bold">
                  Safe Tourist Corridor #12
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('map')}
              className="px-2.5 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-[11px] font-bold shadow-xs active:scale-95 transition-transform cursor-pointer"
            >
              Expand Map
            </button>
          </div>
        </div>

        {/* Geolocation Confidence Metric */}
        <div className="pt-2 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm bg-surface-container-low/70 px-space-sm py-1.5 rounded-lg border border-surface-container">
          <span className="flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[16px] text-secondary">my_location</span>
            Location Confidence
          </span>
          <span className="font-bold text-on-surface">
            {telemetry.locationConfidence === 'HIGH'
              ? 'HIGH (4 satellites, cell tower handshake)'
              : 'OFFLINE / CACHED'}
          </span>
        </div>
      </div>

      {/* Active Itinerary Progress Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs space-y-space-sm border border-surface-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">explore</span>
            <h3 className="font-title-md text-title-md text-on-surface font-bold">Trip Itinerary</h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('trip')}
            className="font-label-sm text-label-sm text-secondary font-bold flex items-center hover:underline cursor-pointer"
          >
            Full Schedule <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* Next Stop Card with Destination Photo */}
        <div
          onClick={() => onNavigateTab('trip')}
          className="flex items-center gap-3 p-space-sm rounded-xl bg-surface-container-low border border-surface-container cursor-pointer hover:bg-surface-container transition-colors"
        >
          <img
            className="w-16 h-16 rounded-lg object-cover shrink-0 border border-surface-container-high"
            alt="Elephant Falls"
            src="https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&w=300&q=80"
          />
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm text-[10px] uppercase font-bold text-secondary bg-secondary-container/50 px-1.5 py-0.5 rounded">
                Next Stop
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                2:30 PM Today
              </span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">Elephant Falls</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
              Scenic waterfall corridor • Verified Safe Guide Route
            </p>
          </div>
        </div>

        {/* Rapid Trip Checkpoint Flow */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center font-label-sm text-label-sm">
          <div className="bg-surface-container-low p-2 rounded-lg border border-surface-container">
            <span className="text-on-surface-variant block text-[10px]">Morning</span>
            <span className="font-bold text-on-surface truncate block">Ward's Lake</span>
            <span className="text-secondary text-[10px] font-bold">✓ Visited</span>
          </div>
          <div className="bg-surface-container-lowest ring-1 ring-secondary/40 p-2 rounded-lg shadow-2xs">
            <span className="text-secondary block text-[10px] font-bold">Current</span>
            <span className="font-bold text-on-surface truncate block">Police Bazar</span>
            <span className="text-on-surface-variant text-[10px]">In Progress</span>
          </div>
          <div className="bg-surface-container-low p-2 rounded-lg opacity-80 border border-surface-container">
            <span className="text-on-surface-variant block text-[10px]">Evening</span>
            <span className="font-bold text-on-surface truncate block">Shillong Peak</span>
            <span className="text-on-surface-variant text-[10px]">6:30 PM</span>
          </div>
        </div>
      </div>

      {/* Digital Tourist ID Quick Banner */}
      <div className="bg-primary-container text-on-primary rounded-xl p-space-md shadow-xs relative overflow-hidden border border-primary-container/60">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-surface-container-lowest/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10">
              <span className="material-symbols-outlined text-secondary-fixed text-[24px]">badge</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-label-sm text-[10px] uppercase font-bold text-secondary-fixed tracking-wider">
                  Government Encrypted
                </span>
                <span className="material-symbols-outlined text-secondary-fixed text-[14px]">lock</span>
              </div>
              <h4 className="font-title-md text-title-md text-on-primary font-bold">Digital Tourist ID</h4>
              <p className="font-label-md text-label-md text-on-primary-container font-mono tracking-wider">
                {tourist.dtid} • {tourist.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenTouristId}
            className="px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-label-sm text-label-sm font-bold shadow-xs shrink-0 active:scale-95 transition-transform cursor-pointer"
          >
            Show QR
          </button>
        </div>
      </div>

      {/* Emergency Assurance Footer Note */}
      <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-xl text-on-surface-variant font-label-sm text-label-sm border border-surface-container">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-secondary">phonelink_lock</span>
          <span>On-device cached SOS & local hospital contacts active</span>
        </div>
        <span className="font-bold text-secondary">Protected</span>
      </div>
    </div>
  );
};
