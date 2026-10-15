/**
 * SAFE TOUR — Active Emergency SOS Dispatch Screen
 * Faithful implementation of Google Stitch SOS Workflow with Real-time Transmission Checklist,
 * Geolocation Beacon, Medical Dossier, Direct Helpline, and 5-Second Tactile Cancel Hold.
 */

import React, { useState, useEffect, useRef } from 'react';
import { SOSIncident } from '../../types';
import { emergencyService } from '../../services/emergencies/emergencyService';

interface SOSDispatchScreenProps {
  onClose: () => void;
  onShowToast: (msg: string) => void;
  isOfflineMode?: boolean;
}

export const SOSDispatchScreen: React.FC<SOSDispatchScreenProps> = ({
  onClose,
  onShowToast,
  isOfflineMode = false
}) => {
  const [incident, setIncident] = useState<SOSIncident>(emergencyService.getIncident());
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef<any>(null);

  useEffect(() => {
    // Automatically trigger SOS submission on screen mount
    emergencyService.triggerSOS(isOfflineMode).then(res => setIncident(res));

    const unsubscribe = emergencyService.subscribe(updated => {
      setIncident(updated);
    });

    return () => unsubscribe();
  }, [isOfflineMode]);

  // 5-Second Hold to Cancel Handler
  const startHold = () => {
    setIsHolding(true);
    const stepMs = 50;
    const totalMs = 5000;
    const increment = (stepMs / totalMs) * 100;

    holdIntervalRef.current = setInterval(() => {
      setHoldProgress(prev => {
        if (prev + increment >= 100) {
          clearInterval(holdIntervalRef.current);
          handleCancelEmergency();
          return 100;
        }
        return prev + increment;
      });
    }, stepMs);
  };

  const endHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  const handleCancelEmergency = async () => {
    await emergencyService.cancelSOS();
    onShowToast('Emergency SOS Cancelled. Status cleared with response desk.');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const isQueuedOffline = incident.status === 'QUEUED_OFFLINE';

  return (
    <div className="flex flex-col w-full pb-16 bg-surface min-h-screen">
      {/* Top Urgent Telemetry Banner */}
      <div className={`relative overflow-hidden px-margin py-4 shadow-md ${isQueuedOffline ? 'bg-amber-700 text-white' : 'bg-error text-on-error'}`}>
        <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="flex items-center justify-between relative z-10 mb-1">
          <div className="flex items-center gap-space-xs">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
              {isQueuedOffline ? 'Queued Offline (Pending Signal)' : 'Active Emergency SOS'}
            </span>
          </div>
          <span className="font-label-sm text-label-sm bg-black/25 px-2 py-0.5 rounded-full font-mono font-bold">
            {incident.ticketNumber}
          </span>
        </div>
        <div className="flex items-baseline justify-between relative z-10">
          <h2 className="font-headline-sm text-headline-sm font-bold tracking-tight">
            {isQueuedOffline ? 'QUEUED IN SECURE ENCLAVE' : 'TRANSMITTING TELEMETRY'}
          </h2>
          <span className="font-label-sm text-label-sm opacity-90 font-mono">SEC-CH: ENCR-AES256</span>
        </div>
      </div>

      <div className="px-margin flex flex-col gap-space-lg mt-space-md">
        {/* Active Incident Live Radar Map Preview */}
        <div className="relative w-full rounded-xl overflow-hidden shadow-xs bg-surface-container-high border border-surface-container">
          <div
            className="w-full h-44 bg-cover bg-center relative"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80')`
            }}
          >
            <div className="absolute inset-0 bg-primary-container/40 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container/90 via-transparent to-transparent" />

            {/* Geolocation Beacon Pulse Marker */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute h-16 w-16 rounded-full bg-error opacity-60" />
                <span className="animate-pulse absolute h-8 w-8 rounded-full bg-error-container opacity-80" />
                <div className="w-5 h-5 rounded-full bg-error flex items-center justify-center shadow-lg text-white">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                </div>
              </div>
            </div>

            {/* Coordinates Floating Pill */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
              <div className="flex items-center gap-space-xs bg-primary-container/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                <span className="material-symbols-outlined text-secondary-fixed text-[16px]">my_location</span>
                <span className="font-label-sm text-label-sm font-mono tracking-tight text-surface-bright">
                  {incident.location.latitude}° N, {incident.location.longitude}° E
                </span>
              </div>
              <span className="font-label-sm text-label-sm bg-primary-container/85 backdrop-blur-md px-2 py-1 rounded-full font-mono text-secondary-fixed-dim border border-white/10">
                ±{incident.location.accuracyMeters}m ACC
              </span>
            </div>
          </div>
        </div>

        {/* Live Transmission & Verification Checklist */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container">
          <div className="flex items-center justify-between mb-space-sm">
            <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-space-xs font-bold">
              <span className="material-symbols-outlined text-secondary text-[20px]">sync</span>
              <span>Transmission Checklist</span>
            </h3>
            <span className="font-label-sm text-label-sm text-secondary font-mono font-bold">
              {incident.checklist.patrolAssigned ? 'STEP 5 OF 5' : incident.checklist.smsAlertQueued ? 'STEP 4 OF 5' : 'STEP 3 OF 5'}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
            Real-time status of emergency relays and authorized responder pings.
          </p>

          <div className="flex flex-col gap-space-sm font-body-sm text-body-sm">
            {/* Step 1 */}
            <div className="flex items-start gap-space-sm p-2 rounded-lg bg-surface-container-low border border-surface-container">
              <span className="material-symbols-outlined text-secondary text-[20px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-label-md text-label-md text-on-surface font-semibold">Emergency token generated locally</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant font-mono text-[10px]">ID: SEC-TK-77491-LOCAL</p>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-mono shrink-0">12:04:12</span>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-space-sm p-2 rounded-lg bg-surface-container-low border border-surface-container">
              <span className="material-symbols-outlined text-secondary text-[20px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-label-md text-label-md text-on-surface font-semibold">GPS coordinates anchored</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant font-mono text-[10px]">
                  25.5788° N, 91.8933° E • Acc ±3.2m
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-mono shrink-0">12:04:14</span>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-space-sm p-2 rounded-lg bg-surface-container-low border border-surface-container">
              <span className={`material-symbols-outlined text-[20px] shrink-0 ${incident.checklist.dispatchNotified ? 'text-secondary' : 'text-outline'}`}>
                {incident.checklist.dispatchNotified ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-label-md text-label-md text-on-surface font-semibold">Dispatch center notified</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {incident.checklist.dispatchNotified ? 'Central Command acknowledged' : 'Awaiting terminal responder handshake'}
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-mono shrink-0">
                {incident.checklist.dispatchNotified ? '12:04:18' : 'WAITING'}
              </span>
            </div>

            {/* Step 4 */}
            <div className={`flex items-start gap-space-sm p-2 rounded-lg border ${
              incident.checklist.smsAlertQueued ? 'bg-secondary-container/40 border-secondary/20' : 'bg-surface-container-low border-surface-container'
            }`}>
              <div className="relative shrink-0 flex items-center justify-center mt-0.5">
                <span className="material-symbols-outlined text-secondary text-[20px] animate-spin">progress_activity</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-label-md text-label-md text-on-secondary-container font-bold">
                  Automated SMS/Data alert queued
                </p>
                <p className="font-body-sm text-body-sm text-on-secondary-variant text-[11px]">
                  Contact: Priya Sharma (+91 98765 43210)
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-mono shrink-0">
                {isQueuedOffline ? 'QUEUED' : 'SENT'}
              </span>
            </div>

            {/* Step 5 */}
            <div className={`flex items-start gap-space-sm p-2 rounded-lg border ${
              incident.checklist.patrolAssigned ? 'bg-secondary-container/40 border-secondary/20' : 'opacity-60 border-surface-container'
            }`}>
              <span className={`material-symbols-outlined text-[20px] shrink-0 ${incident.checklist.patrolAssigned ? 'text-secondary' : 'text-outline'}`}>
                {incident.checklist.patrolAssigned ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-label-md text-label-md text-on-surface font-semibold">
                  Local emergency patrol unit assigned
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {incident.checklist.patrolAssigned
                    ? 'Patrol Unit #14 (Inspector P. Sangma, ETA ~7 mins)'
                    : 'Sector Shillong Central Command'}
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-mono shrink-0 font-bold">
                {incident.checklist.patrolAssigned ? 'DISPATCHED' : 'PENDING'}
              </span>
            </div>
          </div>
        </div>

        {/* Key Emergency Data Summary Card */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container">
          <div className="flex items-center justify-between mb-space-sm">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
              Medical & Profile Dossier
            </span>
            <span className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold">
              Offline Cached
            </span>
          </div>

          <div className="flex items-center gap-space-md pb-space-sm">
            <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center shrink-0 border border-surface-container-high">
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant">badge</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-snug">
                Arjun Sharma
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Male, 28 yrs • Blood:{' '}
                <strong className="text-error font-bold font-title-md text-title-md">O+ Positive</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-space-sm pt-space-sm">
            <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col gap-1 border border-surface-container">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Allergies / Conditions</span>
              <span className="font-label-md text-label-md text-on-surface font-bold">None recorded</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col gap-1 border border-surface-container">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Device State</span>
              <span className="font-label-md text-label-md text-secondary flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-[16px]">battery_horiz_075</span>
                78% • Strobe ON
              </span>
            </div>
          </div>
        </div>

        {/* Critical Emergency Actions */}
        <div className="flex flex-col gap-space-sm mt-space-xs">
          {/* Big Call Button */}
          <a
            className="min-h-[56px] w-full rounded-xl bg-error text-on-error flex items-center justify-center gap-space-sm shadow-md active:opacity-90 select-none cursor-pointer"
            href="tel:112"
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              phone_in_talk
            </span>
            <div className="flex flex-col text-left">
              <span className="font-title-md text-title-md font-bold leading-tight">Call Tourist Helpline</span>
              <span className="font-label-sm text-label-sm opacity-90">Toll-free priority 112 / 1363</span>
            </div>
          </a>

          {/* Secondary: Voice Note / Photo */}
          <button
            type="button"
            onClick={() => onShowToast('Voice memo recording: Speak your status now')}
            className="min-h-[48px] w-full rounded-xl bg-surface-container-lowest text-on-surface shadow-xs active:bg-surface-container flex items-center justify-center gap-space-sm border border-surface-container cursor-pointer font-bold font-label-lg"
          >
            <span className="material-symbols-outlined text-secondary text-[20px]">mic</span>
            <span>Send Voice Note / Photo Context</span>
          </button>

          {/* Cancel Emergency with 5-Second Hold */}
          <div className="mt-space-md flex flex-col items-center">
            <button
              type="button"
              onMouseDown={startHold}
              onMouseUp={endHold}
              onMouseLeave={endHold}
              onTouchStart={startHold}
              onTouchEnd={endHold}
              className="relative overflow-hidden w-full min-h-[52px] rounded-xl bg-surface-container-high text-on-surface active:bg-surface-variant flex items-center justify-center select-none cursor-pointer border border-surface-container-highest"
            >
              {/* Hold Progress Bar Fill */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-secondary-container transition-all ease-linear"
                style={{ width: `${holdProgress}%` }}
              />
              <div className="relative z-10 flex items-center gap-space-xs py-2">
                <span className="material-symbols-outlined text-[20px] text-on-surface">check_circle</span>
                <span className="font-label-lg text-label-lg font-bold">
                  {isHolding
                    ? `Hold steady... cancelling in ${(5 - (holdProgress / 100) * 5).toFixed(1)}s`
                    : 'I Am Safe Now (Hold 5s to cancel)'}
                </span>
              </div>
            </button>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 text-center">
              Long-press prevents accidental disarming in distress.
            </p>
          </div>

          {/* Offline SMS Notice */}
          <div className="mt-space-sm p-3 rounded-lg bg-surface-container-low flex items-start gap-space-sm border border-surface-container">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px] shrink-0 mt-0.5">
              satellite_alt
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-[11px]">
              If cellular mobile data disconnects, high-priority encrypted SMS packets will automatically pulse via dual-carrier fallback.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
