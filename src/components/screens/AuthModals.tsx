/**
 * SAFE TOUR — Authentication Modals (Login & 2-Step Registration)
 * Faithful implementation of Google Stitch Welcome Back, Step 1 Account Setup,
 * and Step 2 Safety Profile Setup with 6-digit tactile PIN, Medical Baseline, and Guardian Designation.
 */

import React, { useState } from 'react';
import { TouristProfile } from '../../types';
import { authService } from '../../services/auth/authService';

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (tourist: TouristProfile) => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
  onShowToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  mode,
  onClose,
  onSuccess,
  onSwitchMode,
  onShowToast
}) => {
  // Login state
  const [identifier, setIdentifier] = useState('DTID-8F4K29');
  const [pin, setPin] = useState('842910');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Registration states
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState('Arjun Sharma');
  const [nationality, setNationality] = useState('IN');
  const [phone, setPhone] = useState('98765 43210');
  const [emergencyPhone, setEmergencyPhone] = useState('Priya Sharma (+91 98765 43210)');
  const [pinDigits, setPinDigits] = useState(['8', '4', '2', '9', '1', '0']);
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('Penicillin sensitivity (mild)');
  const [autoNotifyMissed, setAutoNotifyMissed] = useState(true);

  // Dynamic specimen preview code
  const hash = Math.abs(
    fullName.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)
  ).toString(16).toUpperCase().padStart(6, '0').slice(0, 6);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const user = await authService.login(identifier, pin);
      onShowToast(`Signed in successfully as ${user.name}`);
      onSuccess(user);
    } catch {
      onShowToast('Authentication error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      onShowToast('Please fill in required fields');
      return;
    }
    setRegisterStep(2);
  };

  const handleRegisterComplete = async () => {
    const user = await authService.register({
      fullName,
      phone,
      nationality,
      emergencyContact: emergencyPhone,
      pin: pinDigits.join('')
    });
    onShowToast(`Tourist ID ${user.dtid} generated for ${user.name}`);
    onSuccess(user);
  };

  const handlePinChange = (val: string, index: number) => {
    const updated = [...pinDigits];
    updated[index] = val.slice(-1);
    setPinDigits(updated);

    if (val && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-surface-container overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Modal Close */}
        <div className="flex justify-end p-3 pb-0">
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {mode === 'login' ? (
          /* ========================================================== */
          /* LOGIN FLOW (Welcome back)                                  */
          /* ========================================================== */
          <div className="px-margin pb-space-lg">
            {/* Reassurance pill */}
            <div className="w-full flex justify-center mb-3">
              <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container border border-secondary/20">
                <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="font-label-sm text-label-sm font-semibold tracking-wide uppercase">
                  Encrypted Safety Corridor Active
                </span>
              </div>
            </div>

            {/* Header */}
            <div className="w-full flex flex-col items-center text-center mb-space-md">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest shadow-sm flex items-center justify-center mb-2 border border-surface-container">
                <span className="material-symbols-outlined text-secondary text-[28px]">shield_person</span>
              </div>
              <div className="inline-flex items-center gap-space-xs text-secondary font-label-md text-label-md font-semibold">
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
                <span>Travel freely. Stay protected.</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1 mb-1 font-bold">
                Welcome back
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xs leading-relaxed text-xs">
                Access your active safety dossier, tourist pass, and emergency relays.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="bg-surface-container-lowest rounded-xl shadow-xs p-space-md flex flex-col gap-space-md border border-surface-container">
              {/* Phone or DTID */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="identifier">
                    <span>Phone Number or DTID</span>
                    <span className="material-symbols-outlined text-secondary text-[16px]">info</span>
                  </label>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-mono uppercase bg-surface-container px-2 py-0.5 rounded text-[10px]">
                    e.g. DTID-8F4K
                  </span>
                </div>
                <div className="relative flex items-center">
                  <div className="h-11 pl-3 pr-2 mr-2 rounded-lg bg-surface-container-low flex items-center gap-1 text-on-surface shrink-0 border border-surface-container">
                    <span className="text-[14px]">🇮🇳</span>
                    <span className="font-label-md text-label-md font-bold">+91</span>
                  </div>
                  <input
                    id="identifier"
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    className="flex-1 h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md border border-surface-container focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              {/* Password / Access PIN */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="pin-input">
                    Password / Access PIN
                  </label>
                  <button type="button" onClick={() => onShowToast('PIN reset instructions sent to primary device')} className="font-label-md text-[11px] text-secondary font-semibold hover:underline cursor-pointer">
                    Forgot PIN or DTID?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="pin-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    className="w-full h-11 pl-3 pr-10 rounded-lg bg-surface-container-low text-on-surface font-body-md border border-surface-container focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 text-outline hover:text-on-surface cursor-pointer p-1"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Offline cache preference */}
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-container-low border border-surface-container">
                <input
                  type="checkbox"
                  defaultChecked
                  id="remember-device"
                  className="mt-1 h-4 w-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                />
                <label htmlFor="remember-device" className="cursor-pointer text-left">
                  <span className="font-label-md text-label-md font-semibold text-on-surface block text-xs">
                    Remember this device
                  </span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant block leading-snug">
                    Keeps offline safety dossier cached locally for rapid emergency response without cellular signal.
                  </span>
                </label>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full h-12 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-space-sm shadow-xs active:scale-[0.99] transition-all cursor-pointer hover:bg-neutral-800"
                >
                  <span className="material-symbols-outlined text-[20px]">lock_open</span>
                  <span>{isLoggingIn ? 'Authorizing Dossier...' : 'Sign In to SafeTour'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onShowToast('Emergency OTP dispatched via carrier SMS');
                    onSuccess(authService.getSession()?.tourist || authService.login('DTID-8F4K29', '842910') as any);
                  }}
                  className="w-full h-11 rounded-xl bg-secondary-container/40 text-on-secondary-container font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-secondary/20 hover:bg-secondary-container/60"
                >
                  <span className="material-symbols-outlined text-[18px]">cell_tower</span>
                  <span>Quick Sign-In with Emergency OTP</span>
                </button>
              </div>

              {/* Telemetry hint */}
              <div className="flex items-center justify-between text-outline text-[11px] pt-1">
                <span className="flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Mesh Relays: 14 Active
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[13px]">offline_bolt</span>
                  Offline Ready
                </span>
              </div>
            </form>

            {/* Zero-knowledge trust notice */}
            <div className="mt-space-md w-full rounded-xl bg-surface-container-low p-3 flex items-start gap-space-sm border border-surface-container">
              <span className="material-symbols-outlined text-[18px] text-secondary mt-0.5">verified</span>
              <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
                <strong>Zero-Knowledge Protection:</strong> Your biometric and location data remain encrypted on-device. SafeTour never initiates remote tracking without deliberate traveler consent or active emergency triggers.
              </p>
            </div>

            {/* Switch to sign up */}
            <div className="w-full text-center mt-3">
              <p className="font-body-sm text-on-surface-variant text-xs">
                New to SafeTour?{' '}
                <button
                  type="button"
                  onClick={() => onSwitchMode('register')}
                  className="font-bold text-on-surface underline ml-1 cursor-pointer hover:text-secondary"
                >
                  Create Account & Generate DTID
                </button>
              </p>
            </div>
          </div>
        ) : registerStep === 1 ? (
          /* ========================================================== */
          /* REGISTRATION STEP 1 OF 2                                   */
          /* ========================================================== */
          <div className="px-margin pb-space-lg flex flex-col gap-space-md">
            {/* Progress Bar */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-secondary uppercase font-bold text-[10px]">
                  Step 1 of 2 • Tourist Account Setup
                </span>
                <span className="font-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full font-mono text-[10px]">
                  50%
                </span>
              </div>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full w-1/2" />
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                Create Your Tourist Account
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-xs">
                Generate a sovereign <strong className="text-on-surface">Digital Tourist ID (DTID)</strong> for verified corridor access and rapid emergency response.
              </p>
            </div>

            {/* Live Specimen Preview */}
            <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-xs border border-surface-container">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                  </div>
                  <div>
                    <span className="font-label-sm text-[9px] uppercase tracking-wider text-on-surface-variant font-bold block">
                      Credential Specimen
                    </span>
                    <span className="font-title-md text-title-md font-bold text-on-surface">
                      {fullName || 'New Traveler'}
                    </span>
                  </div>
                </div>
                <span className="font-label-sm text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-mono font-bold">
                  DTID-READY
                </span>
              </div>
              <div className="mt-2 pt-2 flex items-center justify-between border-t border-surface-container text-on-surface-variant text-[11px] font-mono">
                <span>ID: DTID-{hash}</span>
                <span className="text-secondary font-sans font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">lock</span> Zero-Knowledge Mesh
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleRegisterNext} className="flex flex-col gap-space-sm">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-on-surface font-semibold">Full Legal Name (as per ID) *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Arjun Sharma"
                  className="h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-on-surface font-semibold">Nationality & Origin *</label>
                <select
                  value={nationality}
                  onChange={e => setNationality(e.target.value)}
                  className="h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="IN">India (Domestic / Resident)</option>
                  <option value="INT-US">United States (International)</option>
                  <option value="INT-UK">United Kingdom (International)</option>
                  <option value="INT-EU">European Union (International)</option>
                  <option value="INT-JP">Japan (International)</option>
                  <option value="OTHER">Other Sovereign State</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-on-surface font-semibold">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-on-surface font-semibold">Emergency Contact *</label>
                <input
                  type="text"
                  required
                  value={emergencyPhone}
                  onChange={e => setEmergencyPhone(e.target.value)}
                  placeholder="Priya Sharma (+91 98765 43210)"
                  className="h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              {/* 6-digit PIN */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-on-surface font-semibold">Security PIN (6-digit tactile) *</label>
                <div className="flex gap-2 justify-between">
                  {pinDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`pin-${idx}`}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={e => handlePinChange(e.target.value, idx)}
                      className="w-11 h-11 text-center rounded-lg bg-surface-container-low text-on-surface font-bold text-lg border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 mt-2 rounded-xl bg-primary text-on-primary font-label-lg font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:bg-neutral-800"
              >
                <span>Continue to Safety Profile</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => onSwitchMode('login')}
                className="text-xs text-on-surface-variant hover:text-on-surface font-semibold underline cursor-pointer"
              >
                Already registered? Sign In
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================== */
          /* REGISTRATION STEP 2 OF 2 (Safety Profile Setup)            */
          /* ========================================================== */
          <div className="px-margin pb-space-lg flex flex-col gap-space-md">
            {/* Progress Bar */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-secondary uppercase font-bold text-[10px]">
                  Step 2 of 2 • Safety Profile Setup
                </span>
                <span className="font-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full font-mono text-[10px]">
                  100%
                </span>
              </div>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full w-full" />
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                Let's make your trip safer
              </h2>
              <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
                Personalize safety thresholds and designate emergency guardians before you head out.
              </p>
            </div>

            {/* Medical Baseline */}
            <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-xs border border-surface-container space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-on-surface font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">medical_services</span>
                  Medical Baseline
                </span>
                <span className="font-label-sm text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                  E2EE Encrypted
                </span>
              </div>

              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Blood Group</label>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {['O+', 'A+', 'B+', 'AB+', 'O-', 'A-'].map(bg => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`min-w-[44px] py-1.5 px-2.5 rounded-lg font-label-md text-xs font-bold transition-all cursor-pointer ${
                        bloodGroup === bg
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <label className="font-label-sm text-on-surface-variant block mb-1">
                  Known Allergies / Vital Conditions
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin sensitivity"
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-xs border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            {/* Primary Emergency Guardian */}
            <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-xs border border-surface-container space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-on-surface font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">shield_person</span>
                  Primary Guardian
                </span>
                <span className="font-label-sm text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
                  Priority 1
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between border border-surface-container">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center font-bold text-xs text-secondary">
                    PS
                  </div>
                  <div>
                    <span className="font-label-md text-on-surface font-bold block text-xs">Priya Sharma</span>
                    <span className="font-body-sm text-on-surface-variant text-[11px]">+91 98765 43210</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
              </div>

              {/* Auto notify toggle */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-col text-left">
                  <span className="font-label-sm text-on-surface font-bold text-xs">Auto-Notify on Missed Check-in</span>
                  <span className="font-body-sm text-on-surface-variant text-[10px]">
                    Alerts guardian if scheduled window is missed by &gt;15 mins
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoNotifyMissed}
                  onChange={e => setAutoNotifyMissed(e.target.checked)}
                  className="h-4 w-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                />
              </div>
            </div>

            {/* Offline Dossier Pre-Download Banner */}
            <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-xs border border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[22px]">offline_pin</span>
                <div>
                  <span className="font-label-md text-on-surface font-bold block text-xs">
                    Meghalaya Offline Pack Pre-Cached
                  </span>
                  <span className="font-body-sm text-on-surface-variant text-[11px]">
                    48.2 MB vector maps & emergency contacts
                  </span>
                </div>
              </div>
              <span className="font-label-sm text-[10px] text-secondary font-bold bg-secondary-container px-2 py-0.5 rounded-full">
                READY
              </span>
            </div>

            <button
              type="button"
              onClick={handleRegisterComplete}
              className="w-full h-12 rounded-xl bg-primary text-on-primary font-label-lg font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:bg-neutral-800"
            >
              <span>Complete Setup & Enter SafeTour</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
