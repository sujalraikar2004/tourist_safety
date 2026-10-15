/**
 * SAFE TOUR — Digital Tourist ID Screen
 * Faithful implementation of Google Stitch Digital Tourist ID with Dynamic QR Token,
 * Cryptographic ECDSA telemetry, Selective Disclosure Mode, and Offline Verifiability.
 */

import React, { useState, useEffect } from 'react';
import { TouristProfile } from '../../types';

interface TouristIdScreenProps {
  tourist: TouristProfile;
  onClose?: () => void;
  onShowToast: (msg: string) => void;
}

export const TouristIdScreen: React.FC<TouristIdScreenProps> = ({ tourist, onClose, onShowToast }) => {
  const [countdown, setCountdown] = useState(38);
  const [selectiveDisclosure, setSelectiveDisclosure] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? 45 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDownloadPdf = () => {
    onShowToast('Encrypted Identity PDF generated and saved to offline vault');
  };

  return (
    <div className="flex flex-col w-full px-margin space-y-space-md pb-28 pt-2">
      {/* Top Utility Header */}
      <div className="flex items-center justify-between pt-space-xs">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Digital Tourist ID</span>
        </div>
        <div className="flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant shadow-2xs border border-surface-container">
          <span className="material-symbols-outlined text-[14px] text-secondary">wifi_off</span>
          <span className="font-label-sm text-label-sm font-semibold">Offline Verifiable</span>
        </div>
      </div>

      {/* Primary Credential Card */}
      <div className="w-full rounded-xl bg-surface-container-lowest shadow-xs overflow-hidden relative border border-surface-container">
        {/* Top Decorative Band */}
        <div className="w-full bg-primary-container p-space-md text-on-primary relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-surface-container-lowest/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                <span className="material-symbols-outlined text-[24px] text-secondary-container">shield</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary-container font-bold">
                  Republic of India • Tourist Authority
                </span>
                <span className="font-headline-sm text-headline-sm text-on-primary font-bold">
                  Meghalaya Safety Zone 4
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container/20 text-secondary-container backdrop-blur-md border border-secondary-container/30">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
              <span className="font-label-sm text-label-sm font-bold">ACTIVE</span>
            </div>
          </div>

          <div className="mt-space-md flex items-center justify-between">
            <div>
              <p className="font-label-sm text-label-sm text-on-primary-container font-semibold">CREDENTIAL ID</p>
              <p className="font-headline-md text-headline-md font-bold tracking-tight text-on-primary font-mono">
                {tourist.dtid}
              </p>
            </div>
            <div className="text-right">
              <p className="font-label-sm text-label-sm text-on-primary-container font-semibold">VALID PERIOD</p>
              <p className="font-label-lg text-label-lg font-semibold text-secondary-container">
                12 Oct – 28 Oct 2026
              </p>
            </div>
          </div>
        </div>

        {/* Tourist Profile Sub-Matrix */}
        <div className="p-space-md flex gap-space-md items-center bg-surface-container-lowest">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-xs flex-shrink-0 bg-surface-container border border-surface-container-high">
            <img
              className="w-full h-full object-cover"
              alt={tourist.name}
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
            />
            <div className="absolute bottom-0 inset-x-0 bg-primary/75 backdrop-blur-xs py-0.5 text-center">
              <span className="font-label-sm text-[9px] text-on-primary uppercase font-bold tracking-widest">
                KYC V2
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                {tourist.name}
              </h2>
              <span className="material-symbols-outlined text-secondary text-[20px]" title="Government Verified">
                check_circle
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              {tourist.gender} • {tourist.age} Yrs • {tourist.nationality}
            </p>
            <div className="flex items-center gap-space-xs mt-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
                Blood: {tourist.bloodGroup}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                {tourist.zonePass}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scannable Dynamic QR Matrix Card */}
      <div className="w-full rounded-xl bg-surface-container-lowest shadow-xs p-space-md flex flex-col items-center text-center relative overflow-hidden border border-surface-container">
        <div className="w-full flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            <span className="font-label-md text-label-md font-bold">Checkpoint Access Pass</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface border border-surface-container">
            <span className="material-symbols-outlined text-[14px] text-secondary animate-spin">sync</span>
            <span className="font-label-sm text-label-sm">
              Dynamic: <span className="font-bold text-secondary font-mono">{countdown}s</span>
            </span>
          </div>
        </div>

        {/* Precision QR Representation Frame */}
        <div className="relative p-space-md rounded-xl bg-surface-container-low shadow-inner flex items-center justify-center my-space-xs border border-surface-container">
          <div className="w-56 h-56 relative flex items-center justify-center p-3 bg-surface-container-lowest rounded-lg shadow-xs border border-surface-container-high">
            {/* SVG Vector QR Code */}
            <svg className="w-full h-full text-on-surface" fill="currentColor" viewBox="0 0 200 200">
              {/* Corner Marker 1 */}
              <rect x="10" y="10" width="50" height="50" rx="4" className="fill-on-surface" />
              <rect x="20" y="20" width="30" height="30" className="fill-surface-container-lowest" />
              <rect x="26" y="26" width="18" height="18" rx="2" className="fill-on-surface" />
              {/* Corner Marker 2 */}
              <rect x="140" y="10" width="50" height="50" rx="4" className="fill-on-surface" />
              <rect x="150" y="20" width="30" height="30" className="fill-surface-container-lowest" />
              <rect x="156" y="26" width="18" height="18" rx="2" className="fill-on-surface" />
              {/* Corner Marker 3 */}
              <rect x="10" y="140" width="50" height="50" rx="4" className="fill-on-surface" />
              <rect x="20" y="150" width="30" height="30" className="fill-surface-container-lowest" />
              <rect x="26" y="156" width="18" height="18" rx="2" className="fill-on-surface" />
              {/* Data Blocks */}
              <rect x="70" y="15" width="12" height="12" />
              <rect x="90" y="25" width="15" height="12" />
              <rect x="115" y="12" width="12" height="20" />
              <rect x="15" y="70" width="12" height="14" />
              <rect x="35" y="80" width="25" height="12" />
              <rect x="20" y="105" width="15" height="20" />
              <rect x="45" y="115" width="15" height="15" />
              <rect x="145" y="75" width="20" height="12" />
              <rect x="175" y="85" width="15" height="22" />
              <rect x="140" y="105" width="22" height="12" />
              <rect x="170" y="115" width="18" height="15" />
              <rect x="75" y="145" width="15" height="15" />
              <rect x="100" y="155" width="20" height="10" />
              <rect x="75" y="170" width="18" height="18" />
              <rect x="145" y="145" width="12" height="25" />
              <rect x="165" y="160" width="20" height="25" />
              <circle cx="75" cy="70" r="4" />
              <circle cx="85" cy="80" r="4" />
              <circle cx="120" cy="75" r="5" />
              <circle cx="110" cy="125" r="4" />
              <circle cx="95" cy="115" r="4" />
              <circle cx="125" cy="135" r="5" />
            </svg>

            {/* Center Security Watermark Shield with Emblem */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center p-1.5 border-2 border-surface-container">
                <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mt-space-xs">
          Present QR to Tourist Police Kiosk, Wildlife Checkpost, or Forest Range Officer
        </p>

        {/* Cryptographic Telemetry Chip */}
        <div className="w-full mt-space-md p-space-sm rounded-lg bg-surface-container-high flex flex-col gap-1 text-left border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">
              Security Signature
            </span>
            <span className="font-label-sm text-[10px] text-secondary font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> ECDSA P-256
            </span>
          </div>
          <div className="font-mono text-label-sm text-on-surface font-semibold tracking-wide truncate">
            SHA-256: 8F4K-9921-MEG-4019-E2
          </div>
        </div>
      </div>

      {/* 100% Valid Offline Banner */}
      <div className="w-full rounded-xl bg-secondary-container/40 p-space-md flex items-start gap-space-md shadow-xs border border-secondary/20">
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-on-secondary shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[20px]">cloud_off</span>
        </div>
        <div className="flex-1">
          <h3 className="font-title-md text-title-md text-on-secondary-container font-bold">100% Valid Offline</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
            Cryptographic asymmetric certificate is embedded locally on this device. Official field scanners can verify your legitimacy without internet or cellular connectivity.
          </p>
        </div>
      </div>

      {/* Verified Credentials Dossier */}
      <div className="w-full rounded-xl bg-surface-container-lowest shadow-xs p-space-md space-y-space-md border border-surface-container">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Verified Credentials</h3>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">Tier 3 Cleared</span>
        </div>

        {/* Active Trip Link */}
        <div className="flex items-start gap-space-md p-space-sm rounded-lg bg-surface-container-low border border-surface-container">
          <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface shrink-0">
            <span className="material-symbols-outlined text-[20px]">hiking</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-label-sm text-[10px] uppercase font-bold text-on-surface-variant">
              Active Monitored Trip
            </span>
            <p className="font-title-md text-title-md text-on-surface font-bold truncate">
              Meghalaya Adventure Corridor
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              East Khasi Hills • Cherrapunji Safe Corridor
            </p>
          </div>
        </div>

        {/* Kin Emergency Contact */}
        <div className="flex items-start gap-space-md p-space-sm rounded-lg bg-surface-container-low border border-surface-container">
          <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface shrink-0">
            <span className="material-symbols-outlined text-[20px]">contact_emergency</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[10px] uppercase font-bold text-on-surface-variant">
                Emergency Kin
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[9px] font-bold">
                VERIFIED
              </span>
            </div>
            <p className="font-title-md text-title-md text-on-surface font-bold">
              Priya Sharma <span className="font-normal text-on-surface-variant text-xs">(Kin / Sister)</span>
            </p>
            <p className="font-body-sm text-body-sm text-on-surface font-mono">
              {selectiveDisclosure ? '+91 98765 •••••' : '+91 98765 43210'}
            </p>
          </div>
        </div>

        {/* Medical Baseline */}
        <div className="flex items-start gap-space-md p-space-sm rounded-lg bg-surface-container-low border border-surface-container">
          <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface shrink-0">
            <span className="material-symbols-outlined text-[20px]">medical_services</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-label-sm text-[10px] uppercase font-bold text-on-surface-variant">
              Medical Baseline
            </span>
            <p className="font-title-md text-title-md text-on-surface font-bold">No Chronic Condition Recorded</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Known Allergies: None • Blood Group: O+ Positive
            </p>
          </div>
        </div>

        {/* Zero Knowledge Note */}
        <div className="p-space-sm rounded-lg bg-surface-container-high flex items-start gap-space-sm border border-surface-container">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0 mt-0.5">
            privacy_tip
          </span>
          <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
            <strong>Zero-Knowledge Privacy:</strong> National Identity number is hashed cryptographically. Only sovereign emergency personnel can decrypt the full humanitarian dossier in triage mode.
          </p>
        </div>
      </div>

      {/* Privacy & Selective Disclosure Toggle */}
      <div className="w-full rounded-xl bg-surface-container-lowest shadow-xs p-space-md space-y-space-md border border-surface-container">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-title-md text-title-md text-on-surface font-bold">Selective Disclosure Mode</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Mask kin phone number during general checkpoint scans
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectiveDisclosure(!selectiveDisclosure);
              onShowToast(
                !selectiveDisclosure
                  ? 'Selective disclosure active: Kin number masked'
                  : 'Selective disclosure disabled: Full number visible'
              );
            }}
            className={`w-12 h-7 rounded-full p-1 flex items-center transition-colors cursor-pointer ${
              selectiveDisclosure ? 'bg-secondary' : 'bg-surface-container-highest'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                selectiveDisclosure ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-space-sm pt-space-xs">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="w-full h-[52px] rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-space-sm shadow-xs active:scale-[0.99] transition-transform cursor-pointer hover:bg-neutral-800"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>Download Encrypted Identity PDF</span>
          </button>

          <div className="grid grid-cols-2 gap-space-sm">
            <button
              type="button"
              onClick={() => onShowToast('Pass added to offline wallet keychain')}
              className="h-[48px] rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 active:bg-surface-container-highest transition-colors cursor-pointer border border-surface-container"
            >
              <span className="material-symbols-outlined text-[18px]">wallet</span>
              <span>Save to Wallet</span>
            </button>
            <button
              type="button"
              onClick={() => onShowToast('Offline emergency token exported (NFC / QR)')}
              className="h-[48px] rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 active:bg-surface-container-highest transition-colors cursor-pointer border border-surface-container"
            >
              <span className="material-symbols-outlined text-[18px]">share_location</span>
              <span>Emergency Token</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center pb-4 pt-space-xs text-on-surface-variant">
        <p className="font-label-sm text-[11px] font-semibold">Authorized by Ministry of Tourism & Civil Defence</p>
        <p className="font-body-sm text-[10px] text-on-surface-variant/75 mt-0.5">
          Assistance Hotline: 1363 (24x7 Multi-lingual Tourist Support)
        </p>
      </div>
    </div>
  );
};
