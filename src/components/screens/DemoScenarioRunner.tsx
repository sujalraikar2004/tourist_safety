/**
 * SMART TOURIST SAFETY MONITORING & INCIDENT RESPONSE SYSTEM
 * Academic 24-Step Demonstration Workflow Controller
 * Allows professors, examiners, and evaluators to execute and verify every step
 * specified in Section 32 of the project brief.
 */

import React, { useState } from 'react';
import { TabId } from '../common/BottomNav';

interface DemoScenarioRunnerProps {
  onNavigateTab: (tab: TabId) => void;
  onOpenTouristId: () => void;
  onOpenSOS: (isOffline?: boolean) => void;
  onOpenAnomaly: () => void;
  onOpenAuth: () => void;
  onShowToast: (msg: string) => void;
}

export const DEMO_STEPS = [
  { step: 1, title: 'Open Application', actionDesc: 'Navigates to application launch state' },
  { step: 2, title: 'Log in with Demo Account', actionDesc: 'Opens authenticated tourist session for Arjun Sharma' },
  { step: 3, title: 'Open Tourist Home Screen', actionDesc: 'Displays Safety Score, Radar, Telemetry, and Active Corridor' },
  { step: 4, title: 'View Digital Tourist ID', actionDesc: 'Opens DTID-8F4K29 with Dynamic 30s Anti-Screenshot QR Pass' },
  { step: 5, title: 'Open Active Trip (Meghalaya Adventure)', actionDesc: 'Displays itinerary timeline, daylight window, and cached dossier' },
  { step: 6, title: 'Open Safety Map (Safe Radar)', actionDesc: 'Displays real GPS telemetry, geofence polygon, and safe corridor' },
  { step: 7, title: 'Select Mawryngkneng Forest Zone', actionDesc: 'Inspects restricted 420m buffer and high-sensitivity polygon' },
  { step: 8, title: 'Review WHY / WHAT / ACTION Framework', actionDesc: 'Examines reason, compliance rule, and safer alternate bypass route' },
  { step: 9, title: 'Review Next Scheduled Check-In', actionDesc: 'Checks upcoming 6:00 PM check-in window and battery health' },
  { step: 10, title: 'Complete Scheduled Check-In', actionDesc: 'Records verified check-in timestamp and clears notification' },
  { step: 11, title: 'Trigger Simulated Route Deviation Anomaly', actionDesc: 'Backend AI flags +2.4km divergence east toward reserved forest' },
  { step: 12, title: 'Display Route Awareness Verification Screen', actionDesc: 'Shows explainable factors and 15-minute guardian countdown' },
  { step: 13, title: 'Confirm Tourist is Safe', actionDesc: 'Logs safe detour exploration and disarms guardian alert' },
  { step: 14, title: 'Trigger Simulated Emergency SOS', actionDesc: 'Initiates high-priority distress telemetry pulse' },
  { step: 15, title: 'Display SOS Confirmation Screen', actionDesc: 'Prepares emergency token, anchored GPS, and responder channel' },
  { step: 16, title: 'Submit SOS Telemetry Request', actionDesc: 'Transmits encrypted AES-256 payload with idempotency key' },
  { step: 17, title: 'Inspect Incident Reference (#INC-9941-MEG)', actionDesc: 'Verifies authoritative ticket number and transmission log' },
  { step: 18, title: 'Backend Acknowledges Incident', actionDesc: 'Central Command responder desk logs telemetry reception' },
  { step: 19, title: 'Update Incident Status to Responders Dispatched', actionDesc: 'Shows active alert card and en-route confirmation' },
  { step: 20, title: 'Patrol Unit #14 Assigned & Updates Status', actionDesc: 'Inspector P. Sangma en route (ETA ~7m, VHF Ch 12)' },
  { step: 21, title: 'Review Active Incident Timeline', actionDesc: 'Steps 1 through 5 of transmission checklist completed' },
  { step: 22, title: 'Complete Incident Resolution via 5s Tactile Hold', actionDesc: 'Long-press disarming prevents accidental cancellation' },
  { step: 23, title: 'Return Home & Verify Telemetry Consistency', actionDesc: 'Confirms safety score, recent alerts, and safe corridor state' },
  { step: 24, title: 'Simulate Offline SOS Queueing in Zero-Data Zone', actionDesc: 'Verifies honest queued status without false delivery claims' }
];

export const DemoScenarioRunner: React.FC<DemoScenarioRunnerProps> = ({
  onNavigateTab,
  onOpenTouristId,
  onOpenSOS,
  onOpenAnomaly,
  onOpenAuth,
  onShowToast
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const executeStep = (stepNum: number) => {
    setCurrentStep(stepNum);
    switch (stepNum) {
      case 1:
      case 3:
      case 23:
        onNavigateTab('home');
        onShowToast(`Step ${stepNum}: Showing Tourist Home Screen`);
        break;
      case 2:
        onOpenAuth();
        onShowToast('Step 2: Showing Login Modal');
        break;
      case 4:
        onOpenTouristId();
        onShowToast('Step 4: Showing Digital Tourist ID (DTID-8F4K29)');
        break;
      case 5:
      case 9:
        onNavigateTab('trip');
        onShowToast(`Step ${stepNum}: Showing Meghalaya Adventure Itinerary`);
        break;
      case 6:
      case 7:
      case 8:
        onNavigateTab('map');
        onShowToast(`Step ${stepNum}: Showing Safe Radar Map & Mawryngkneng Geofence`);
        break;
      case 10:
        onNavigateTab('home');
        onShowToast('Step 10: Check-In trigger ready on Home Screen');
        break;
      case 11:
      case 12:
      case 13:
        onOpenAnomaly();
        onShowToast(`Step ${stepNum}: Route Awareness Anomaly Verification`);
        break;
      case 14:
      case 15:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
      case 21:
      case 22:
        onOpenSOS(false);
        onShowToast(`Step ${stepNum}: Emergency SOS Dispatch Active`);
        break;
      case 24:
        onOpenSOS(true);
        onShowToast('Step 24: Offline Emergency SOS Queueing in Zero-Data Zone');
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Floating Demo Trigger Button at top right */}
      <div className="fixed top-18 right-3 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container text-on-primary font-label-sm text-[11px] font-bold shadow-md border border-secondary/40 active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px] text-secondary-container animate-pulse">
            science
          </span>
          <span>Demo Controller ({currentStep}/24)</span>
          <span className="material-symbols-outlined text-[14px]">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </div>

      {/* Slide-in Demo Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-surface-container-lowest h-full shadow-2xl p-4 flex flex-col border-l border-surface-container overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
                <div>
                  <h3 className="font-title-md font-bold text-on-surface text-sm">Academic Demo Workflow</h3>
                  <p className="font-body-sm text-[10px] text-on-surface-variant">Section 32 End-to-End Test Suite</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-on-surface-variant p-1 cursor-pointer hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Step navigation buttons */}
            <div className="flex items-center justify-between py-2 border-b border-surface-container bg-surface-container-low px-2 rounded-lg my-2">
              <button
                type="button"
                disabled={currentStep <= 1}
                onClick={() => executeStep(currentStep - 1)}
                className="text-xs font-bold text-on-surface disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span> Prev
              </button>
              <span className="font-mono text-xs font-bold text-secondary">
                Step {currentStep} of {DEMO_STEPS.length}
              </span>
              <button
                type="button"
                disabled={currentStep >= DEMO_STEPS.length}
                onClick={() => executeStep(currentStep + 1)}
                className="text-xs font-bold text-on-surface disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                Next <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            {/* List of 24 Steps */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 pr-1">
              {DEMO_STEPS.map(item => {
                const isActive = item.step === currentStep;
                return (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => executeStep(item.step)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-secondary-container/40 border-secondary text-on-secondary-container shadow-xs font-semibold'
                        : 'bg-surface-container-low/70 border-surface-container text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-secondary">
                        STEP {item.step}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      )}
                    </div>
                    <p className="font-label-md text-xs font-bold text-on-surface mt-0.5">
                      {item.title}
                    </p>
                    <p className="font-body-sm text-[10px] text-on-surface-variant leading-tight mt-0.5">
                      {item.actionDesc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-surface-container text-center">
              <button
                type="button"
                onClick={() => executeStep(1)}
                className="text-xs font-bold text-secondary hover:underline cursor-pointer"
              >
                Restart Demo from Step 1
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
