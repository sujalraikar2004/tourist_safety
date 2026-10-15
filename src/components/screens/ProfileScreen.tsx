/**
 * SAFE TOUR — Profile, Privacy & Consent Screen
 * Faithful implementation of Google Stitch Profile with Consent Switches,
 * Emergency Contacts Manager, Offline Cache, and SOS Button Sizing.
 */

import React, { useState } from 'react';
import { TouristProfile, EmergencyContact, PrivacyPreferences } from '../../types';
import { MOCK_EMERGENCY_CONTACTS, MOCK_PRIVACY_PREFS } from '../../constants/mockData';

interface ProfileScreenProps {
  tourist: TouristProfile;
  onOpenTouristId: () => void;
  onLogout: () => void;
  onShowToast: (msg: string) => void;
  currentSosSize: 'standard' | 'high-affordance';
  onChangeSosSize: (size: 'standard' | 'high-affordance') => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  tourist,
  onOpenTouristId,
  onLogout,
  onShowToast,
  currentSosSize,
  onChangeSosSize
}) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>(MOCK_EMERGENCY_CONTACTS);
  const [prefs, setPrefs] = useState<PrivacyPreferences>(MOCK_PRIVACY_PREFS);
  const [isUpdatingCache, setIsUpdatingCache] = useState(false);
  const [addContactModal, setAddContactModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRel, setNewContactRel] = useState('Traveling Companion');

  const handleToggle = (key: keyof PrivacyPreferences, label: string) => {
    setPrefs(prev => {
      const nextVal = !prev[key];
      const updated = { ...prev, [key]: nextVal };
      onShowToast(
        nextVal
          ? `${label}: Enabled & Encrypted locally`
          : `${label}: Disabled immediately`
      );
      return updated;
    });
  };

  const handleUpdateCache = () => {
    setIsUpdatingCache(true);
    setTimeout(() => {
      setIsUpdatingCache(false);
      onShowToast('Offline map & emergency telephone pack renewed (48.2 MB)');
    }, 1200);
  };

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    const newContact: EmergencyContact = {
      id: `contact_${Date.now()}`,
      name: newContactName,
      phone: newContactPhone,
      relationship: newContactRel,
      isPrimary: false,
      autoNotifyMissedCheckin: false,
      status: 'VERIFIED'
    };

    setContacts(prev => [...prev, newContact]);
    setAddContactModal(false);
    setNewContactName('');
    setNewContactPhone('');
    onShowToast(`Emergency contact ${newContactName} added`);
  };

  const handleEndTrip = () => {
    const confirm = window.confirm(
      'Conclude Meghalaya Adventure? All active geofences and trip telemetry will be permanently wiped from this device.'
    );
    if (confirm) {
      onShowToast('Trip archived safely. Sovereign tokens revoked.');
    }
  };

  return (
    <div className="flex flex-col w-full px-margin space-y-space-md pb-28 pt-2">
      {/* Hero Profile Header & Live Credential Card */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-xs border border-surface-container">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="relative w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-xs">
              <span className="font-headline-sm text-headline-sm font-bold tracking-tight">AS</span>
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-secondary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-on-secondary text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-title-md text-title-md text-on-surface truncate font-bold">
                  {tourist.name}
                </h1>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">
                  {tourist.age}{tourist.gender[0]}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] font-semibold">
                  {tourist.dtid}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span className="font-label-sm text-label-sm text-secondary font-semibold">
                  Verified Tourist
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenTouristId}
            aria-label="Show Digital Pass QR"
            className="min-h-[44px] min-w-[44px] rounded-xl bg-surface-container-low flex flex-col items-center justify-center p-2 text-on-surface active:scale-95 transition-transform cursor-pointer border border-surface-container"
          >
            <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
            <span className="font-label-sm text-[9px] uppercase tracking-wider text-on-surface-variant mt-0.5 font-bold">
              Pass
            </span>
          </button>
        </div>

        {/* Active Trip Context Bar */}
        <div className="mt-space-md p-space-sm rounded-xl bg-surface-container flex items-center justify-between border border-surface-container-high">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-secondary text-[20px]">terrain</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Active Travel Dossier
              </span>
              <span className="font-label-lg text-label-lg text-on-surface font-bold truncate">
                Meghalaya Adventure
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold whitespace-nowrap">
            Day 3 of 7
          </span>
        </div>

        {/* DTID Quick Proof Strip */}
        <div className="mt-space-sm pt-2 flex items-center justify-between text-on-surface-variant text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">phonelink_lock</span>
            <span className="font-body-sm text-body-sm">Stored securely in device enclave</span>
          </div>
          <span className="font-label-sm text-[11px] text-on-surface-variant">Auth 2h ago</span>
        </div>
      </div>

      {/* Safety Mission Statement Banner */}
      <div className="p-space-md rounded-xl bg-primary-container text-on-primary relative overflow-hidden shadow-xs border border-primary-container/80">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-secondary/20 pointer-events-none blur-xl" />
        <div className="flex items-start gap-space-sm">
          <span className="material-symbols-outlined text-secondary-container text-[24px] mt-0.5">
            verified_user
          </span>
          <div className="flex flex-col space-y-1">
            <h2 className="font-title-md text-title-md font-bold text-on-primary">
              Safety, Not Surveillance
            </h2>
            <p className="font-body-sm text-body-sm text-on-primary-container leading-relaxed">
              Your travel footprint belongs entirely to you. Telemetry is computed strictly on-device and shared with local responders only when you trigger assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Contacts Module */}
      <div className="flex flex-col space-y-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">contact_emergency</span>
            <h2 className="font-title-md text-title-md text-on-surface font-bold">Emergency Contacts</h2>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-[11px] font-semibold">
            {contacts.length} Active
          </span>
        </div>

        {contacts.map(c => (
          <div
            key={c.id}
            className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs flex items-center justify-between border border-surface-container"
          >
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  {c.isPrimary ? 'family_restroom' : 'local_police'}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-lg text-label-lg text-on-surface font-bold truncate">
                    {c.name}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-[10px]">
                    {c.relationship.split(' ')[0]}
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate font-mono text-[11px]">
                  {c.phone}
                </span>
                {c.isPrimary && (
                  <span className="font-label-sm text-[10px] text-secondary font-bold mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Primary Responder
                  </span>
                )}
              </div>
            </div>

            <a
              aria-label={`Call ${c.name}`}
              className="min-h-[44px] min-w-[44px] rounded-full bg-surface-container flex items-center justify-center text-on-surface active:scale-95 transition-transform"
              href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
            </a>
          </div>
        ))}

        {/* Add Contact Button */}
        <button
          type="button"
          onClick={() => setAddContactModal(true)}
          className="w-full min-h-[48px] rounded-xl bg-surface-container-low text-on-surface font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 active:bg-surface-container transition-colors cursor-pointer border border-surface-container"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>+ Add Emergency Contact</span>
        </button>
      </div>

      {/* Transparent Privacy & Consent Controls */}
      <div className="flex flex-col space-y-space-sm pt-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">admin_panel_settings</span>
            <h2 className="font-title-md text-title-md text-on-surface font-bold">Data & Privacy Consent</h2>
          </div>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">User Managed</span>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs space-y-space-md border border-surface-container">
          {/* Toggle 1: Geofence */}
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-label-lg text-label-lg text-on-surface font-bold">Safety-Only Geofence</span>
                <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-label-sm text-[9px] uppercase tracking-wider font-semibold">
                  Zero Ads
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
                Continuous boundary checking strictly during active itinerary trips. Coordinates are never sold or pooled commercially.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('safetyGeofenceOnly', 'Safety Geofence')}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-1 items-center transition-colors ${
                prefs.safetyGeofenceOnly ? 'bg-secondary' : 'bg-surface-container-high'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  prefs.safetyGeofenceOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-surface-container-high w-full" />

          {/* Toggle 2: Family Breadcrumbs */}
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-label-lg text-label-lg text-on-surface font-bold">Kin Breadcrumb Relay</span>
                <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-label-sm text-[9px] uppercase tracking-wider font-semibold">
                  Trip-Only
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
                Transmit ping updates every 30 minutes directly to Priya Sharma's trusted portal.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('kinBreadcrumbRelay', 'Kin Breadcrumb')}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-1 items-center transition-colors ${
                prefs.kinBreadcrumbRelay ? 'bg-secondary' : 'bg-surface-container-high'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  prefs.kinBreadcrumbRelay ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-surface-container-high w-full" />

          {/* Toggle 3: Anomaly Detection */}
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-label-lg text-label-lg text-on-surface font-bold">Edge Anomaly Detection</span>
                <span className="px-1.5 py-0.2 rounded bg-secondary-container text-on-secondary-container font-label-sm text-[9px] uppercase tracking-wider font-bold">
                  100% On-Device
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
                Processes sudden elevation drops, uncharacteristic stops, and route divergence locally without raw sensor upload.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('edgeAnomalyDetection', 'Edge Anomaly Detection')}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-1 items-center transition-colors ${
                prefs.edgeAnomalyDetection ? 'bg-secondary' : 'bg-surface-container-high'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  prefs.edgeAnomalyDetection ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-surface-container-high w-full" />

          {/* Toggle 4: Encrypted SMS Fallback */}
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                  Offline Encrypted SMS Fallback
                </span>
                <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-label-sm text-[9px] uppercase tracking-wider font-semibold">
                  Zero Data
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
                When LTE disconnects, encode emergency telemetry into tiny 140-character encrypted SMS packets to nearest cell towers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('offlineEncryptedSmsFallback', 'Offline Encrypted SMS')}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-1 items-center transition-colors ${
                prefs.offlineEncryptedSmsFallback ? 'bg-secondary' : 'bg-surface-container-high'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  prefs.offlineEncryptedSmsFallback ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Offline Dossier & Map Storage */}
      <div className="flex flex-col space-y-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">offline_pin</span>
            <h2 className="font-title-md text-title-md text-on-surface font-bold">Offline Safety Cache</h2>
          </div>
          <span className="font-label-sm text-label-sm text-secondary font-bold">48.2 MB Stored</span>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs flex flex-col space-y-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[22px]">map</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                  Meghalaya Topo & Satellites
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Verified valid for 18 more days
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-secondary text-[20px]">cloud_done</span>
          </div>

          <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
            <div className="bg-secondary h-2 rounded-full" style={{ width: '38%' }} />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="font-label-sm text-[11px] text-on-surface-variant">Last synced: Today, 08:30 AM</span>
            <button
              type="button"
              disabled={isUpdatingCache}
              onClick={handleUpdateCache}
              className="min-h-[44px] px-3 rounded-lg bg-surface-container-low text-secondary font-label-md text-label-md font-bold flex items-center gap-1 active:bg-surface-container cursor-pointer border border-surface-container hover:bg-surface-container"
            >
              <span className={`material-symbols-outlined text-[16px] ${isUpdatingCache ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isUpdatingCache ? 'Renewing...' : 'Update Pack'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Accessibility & Regional */}
      <div className="flex flex-col space-y-space-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
          <h2 className="font-title-md text-title-md text-on-surface font-bold">Accessibility & Regional</h2>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs space-y-space-md border border-surface-container">
          {/* Language Picker */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-lg text-label-lg text-on-surface font-bold">Display Language</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Local police advisories will adapt</span>
            </div>
            <div className="relative">
              <select
                aria-label="Display Language"
                value={prefs.displayLanguage}
                onChange={e => {
                  setPrefs({ ...prefs, displayLanguage: e.target.value });
                  onShowToast('Advisory display language updated');
                }}
                className="min-h-[44px] px-3 pr-8 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md font-semibold appearance-none focus:outline-none border border-surface-container cursor-pointer"
              >
                <option value="en">English (US)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="as">অসমীয়া (Assamese)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-3 text-[18px] text-on-surface-variant">
                arrow_drop_down
              </span>
            </div>
          </div>

          {/* SOS Trigger Ergonomics */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                  Physical SOS Button Sizing
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  For high-vibration or gloved hands
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onChangeSosSize('standard');
                  onShowToast('Emergency button footprint set to Standard (48px)');
                }}
                className={`min-h-[44px] rounded-xl font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all cursor-pointer font-bold ${
                  currentSosSize === 'standard'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface border border-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">touch_app</span>
                <span>Standard (48px)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onChangeSosSize('high-affordance');
                  onShowToast('Emergency button footprint set to Enlarged (64px)');
                }}
                className={`min-h-[44px] rounded-xl font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all cursor-pointer font-bold ${
                  currentSosSize === 'high-affordance'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface border border-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">pan_tool</span>
                <span>Enlarged (64px)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conclude Trip & Session Management */}
      <div className="pt-space-sm space-y-space-sm">
        <button
          type="button"
          onClick={handleEndTrip}
          className="w-full min-h-[52px] rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 active:bg-surface-container-high transition-colors cursor-pointer border border-surface-container-high hover:bg-surface-container-highest"
        >
          <span className="material-symbols-outlined text-[20px]">flag</span>
          <span>Conclude Trip & Revoke Temporary Telemetry</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="w-full min-h-[44px] rounded-xl bg-transparent text-error font-label-md text-label-md font-bold flex items-center justify-center gap-2 active:opacity-75 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Sign Out of SafeTour</span>
        </button>

        <div className="flex items-center justify-center gap-2 pt-1 text-on-surface-variant">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          <span className="font-label-sm text-[11px]">SafeTour Sovereign DTID • Protocol v4.19</span>
        </div>
      </div>

      {/* Add Emergency Contact Modal */}
      {addContactModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddContactSubmit}
            className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 shadow-xl border border-surface-container space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-title-md text-title-md font-bold text-on-surface">Add Emergency Contact</h3>
              <button
                type="button"
                onClick={() => setAddContactModal(false)}
                className="text-on-surface-variant p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-on-surface font-semibold">Contact Full Name</label>
              <input
                type="text"
                required
                value={newContactName}
                onChange={e => setNewContactName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-on-surface font-semibold">Mobile Phone Number</label>
              <input
                type="tel"
                required
                value={newContactPhone}
                onChange={e => setNewContactPhone(e.target.value)}
                placeholder="+91 98111 22334"
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-on-surface font-semibold">Relationship</label>
              <select
                value={newContactRel}
                onChange={e => setNewContactRel(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="Spouse / Kin">Spouse / Kin</option>
                <option value="Traveling Companion">Traveling Companion</option>
                <option value="Tour Guide / Escort">Tour Guide / Escort</option>
                <option value="Hotel Liaison">Hotel Liaison</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAddContactModal(false)}
                className="flex-1 h-11 rounded-lg bg-surface-container text-on-surface font-label-md font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-11 rounded-lg bg-primary text-on-primary font-label-md font-bold cursor-pointer"
              >
                Save Contact
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
