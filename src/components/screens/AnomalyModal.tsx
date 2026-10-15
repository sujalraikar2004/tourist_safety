/**
 * SAFE TOUR — AI Anomaly Verification Modal ("Something looks different")
 * Faithful implementation of Google Stitch Anomaly Check with Explainable Context Factors,
 * Guardian Countdown, and Non-Alarmist Verification Actions.
 */

import React, { useState, useEffect } from 'react';
import { AnomalyIncident } from '../../types';
import { anomalyService } from '../../services/anomalies/anomalyService';

interface AnomalyModalProps {
  anomaly: AnomalyIncident;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onRequestHelp: () => void;
}

export const AnomalyModal: React.FC<AnomalyModalProps> = ({
  anomaly,
  onClose,
  onShowToast,
  onRequestHelp
}) => {
  const [countdownSeconds, setCountdownSeconds] = useState(anomaly.autoEscalationSeconds || 890);
  const [isConfirmedSafe, setIsConfirmedSafe] = useState(false);

  useEffect(() => {
    if (isConfirmedSafe) return;
    const interval = setInterval(() => {
      setCountdownSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isConfirmedSafe]);

  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleConfirmSafe = async () => {
    setIsConfirmedSafe(true);
    await anomalyService.confirmSafe();
    onShowToast('Route updated: Safe exploration logged. Guardian ping cleared.');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-surface rounded-t-3xl sm:rounded-2xl p-space-md sm:p-space-lg shadow-2xl border border-surface-container flex flex-col max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Drag handle for mobile */}
        <div className="w-12 h-1 rounded-full bg-surface-container-highest mx-auto mb-2 sm:hidden" />

        {/* Friendly, Non-Alarmist Awareness Header */}
        <div className="pt-space-xs pb-space-sm flex flex-col gap-space-xs">
          <div className="inline-flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container w-fit">
            <span className="material-symbols-outlined text-[16px] text-secondary">explore</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wide font-bold">
              Route Awareness Check
            </span>
          </div>

          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1 font-bold">
            {anomaly.title}
          </h2>

          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            {anomaly.explanation}
          </p>
        </div>

        {/* Deviation Route Preview Map Card */}
        <div className="relative w-full rounded-xl overflow-hidden shadow-xs bg-surface-container mt-space-sm border border-surface-container-high">
          <div
            className="w-full h-44 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container/85 via-transparent to-transparent pointer-events-none" />

          {/* Micro-HUD Overlay */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-xs text-on-surface border border-surface-container">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-label-sm text-label-sm font-semibold">NH 206 Corridor</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-xs text-on-surface border border-surface-container">
              <span className="material-symbols-outlined text-[14px] text-on-tertiary-container">landscape</span>
              <span className="font-label-sm text-label-sm font-semibold">1,420m Alt</span>
            </div>
          </div>

          {/* Dynamic Trail Indicator Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[18px]">person_pin_circle</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md leading-tight text-white font-bold">
                  Mawryngkneng Bypass
                </span>
                <span className="font-label-sm text-label-sm text-surface-container-high opacity-90 text-[11px]">
                  Deviation: {anomaly.deviationDistance || '+2.4 km East'}
                </span>
              </div>
            </div>
            <div className="px-2 py-0.5 rounded bg-surface-container-lowest/20 backdrop-blur-sm text-[11px] font-label-sm tracking-wide text-white border border-white/20">
              GPS ±4m
            </div>
          </div>
        </div>

        {/* Explainable Context Factors */}
        <div className="mt-space-md flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-title-md text-title-md text-on-surface font-bold">Context Factors</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              Explainable telemetry
            </span>
          </div>

          {/* Factor 1: Divergence */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs flex items-start gap-space-sm border border-surface-container">
            <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0 text-secondary">
              <span className="material-symbols-outlined text-[20px]">fork_right</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-title-md text-title-md text-on-surface font-semibold truncate">
                  Route Divergence
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-bold">
                  2.4 km
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Headed east of the planned NH 206 mountain corridor along Mawryngkneng bypass.
              </p>
            </div>
          </div>

          {/* Factor 2: Protected Buffer Proximity */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs flex items-start gap-space-sm border border-surface-container">
            <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0 text-on-tertiary-container">
              <span className="material-symbols-outlined text-[20px]">forest</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-title-md text-title-md text-on-surface font-semibold truncate">
                  Protected Buffer Vicinity
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                  650m
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Approaching outer perimeter of Mawryngkneng Reserved Forest where cellular coverage drops.
              </p>
            </div>
          </div>

          {/* Factor 3: Missed check-in window */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs flex items-start gap-space-sm border border-surface-container">
            <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0 text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">timer</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-title-md text-title-md text-on-surface font-semibold truncate">
                  Scheduled Check-in Window
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-bold">
                  +15 min
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Nominal 2:00 PM milestone check-in elapsed without itinerary refresh.
              </p>
            </div>
          </div>

          {/* Assurance Note */}
          <div className="p-3 rounded-xl bg-surface-container-low flex items-center gap-space-xs text-on-surface-variant border border-surface-container">
            <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">verified_user</span>
            <p className="font-label-sm text-label-sm">
              These signals require verification to preserve safe travels. They do not confirm an emergency.
            </p>
          </div>
        </div>

        {/* Escalation Timeline & Guardian Notice */}
        <div className="mt-space-md p-space-md rounded-xl bg-surface-container-lowest shadow-xs flex flex-col gap-space-xs border border-surface-container">
          <div className="flex items-center justify-between text-on-surface">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-md text-label-md font-bold">Automated Guardian Update</span>
            </div>
            <span className="font-label-sm text-label-sm font-bold text-secondary font-mono">
              {isConfirmedSafe ? 'Cleared' : formatCountdown(countdownSeconds)}
            </span>
          </div>

          <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden my-1">
            <div
              className="bg-secondary h-full rounded-full transition-all duration-1000"
              style={{ width: `${isConfirmedSafe ? 100 : (countdownSeconds / 900) * 100}%` }}
            />
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
            If there is no response within 15 minutes, a friendly location check will ping your trusted contact,{' '}
            <strong className="text-on-surface font-semibold">{anomaly.guardianName}</strong>.
          </p>

          <div className="flex items-center gap-space-md pt-1">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-secondary">lock</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant text-[11px]">Encrypted Handshake</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-secondary">compass_calibration</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant text-[11px]">Compass Calibrated</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-space-lg flex flex-col gap-space-sm">
          {/* Big Primary: Safe / Detour */}
          <button
            type="button"
            disabled={isConfirmedSafe}
            onClick={handleConfirmSafe}
            className={`w-full min-h-[52px] h-[52px] rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-space-xs shadow-xs active:scale-[0.98] transition-all cursor-pointer ${
              isConfirmedSafe
                ? 'bg-secondary text-on-secondary'
                : 'bg-primary text-on-primary hover:bg-neutral-800'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isConfirmedSafe ? 'check' : 'check_circle'}
            </span>
            <span>{isConfirmedSafe ? 'Verified Safe' : "I'm Safe — Exploring / Detour"}</span>
          </button>

          {/* Big Secondary: Need help/directions */}
          <button
            type="button"
            onClick={onRequestHelp}
            className="w-full min-h-[52px] h-[52px] rounded-xl bg-secondary-container text-on-secondary-container font-label-lg text-label-lg font-bold flex items-center justify-center gap-space-xs shadow-xs active:scale-[0.98] transition-all cursor-pointer hover:bg-secondary-container/80"
          >
            <span className="material-symbols-outlined text-[20px] text-secondary">navigation</span>
            <span>I Need Help or Directions</span>
          </button>

          {/* Tertiary: Plan Adjustment */}
          <button
            type="button"
            onClick={() => {
              onShowToast('Itinerary detour options opened');
              onClose();
            }}
            className="w-full py-2.5 flex items-center justify-center gap-1 text-on-surface-variant font-label-md text-label-md active:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">edit_road</span>
            <span>Adjust Trip Itinerary & Route</span>
          </button>
        </div>
      </div>
    </div>
  );
};
