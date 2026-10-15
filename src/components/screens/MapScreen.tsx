/**
 * SAFE TOUR — Safe Radar Map Screen
 * Faithful implementation of Google Stitch Interactive Map with SVG Geofence Polygon,
 * Dynamic Route Bypass Switcher, POI Inspection, and Intelligence Dossier.
 */

import React, { useState } from 'react';
import { RiskZone } from '../../types';
import { geofenceService } from '../../services/geofencing/geofenceService';

interface MapScreenProps {
  riskZone: RiskZone;
  onShowToast: (msg: string) => void;
}

interface SelectedPOI {
  name: string;
  distance: string;
  type: 'police' | 'medical' | 'ranger';
  phone?: string;
}

export const MapScreen: React.FC<MapScreenProps> = ({ riskZone, onShowToast }) => {
  const [isBypassActive, setIsBypassActive] = useState(geofenceService.isBypassRouteEngaged());
  const [selectedPOI, setSelectedPOI] = useState<SelectedPOI | null>(null);
  const [layerMenuOpen, setLayerMenuOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'normal' | 'safeHavens' | 'riskHeatmap' | 'satellite'>('normal');
  const [isRecentering, setIsRecentering] = useState(false);

  const toggleBypass = () => {
    const next = !isBypassActive;
    setIsBypassActive(next);
    geofenceService.setBypassActive(next);
    onShowToast(
      next
        ? 'Safer Alternate Route Engaged (+12 min, Bypasses Forest)'
        : 'Reverted to Standard Highway NH 206 Corridor'
    );
  };

  const handleRecenter = () => {
    setIsRecentering(true);
    setTimeout(() => {
      setIsRecentering(false);
      onShowToast('Map centered on current GPS: 25.5788° N, 91.8933° E (±3.2m)');
    }, 400);
  };

  const handleSelectLayer = (layer: 'normal' | 'safeHavens' | 'riskHeatmap' | 'satellite') => {
    setActiveLayer(layer);
    setLayerMenuOpen(false);
    onShowToast(`Map layer activated: ${layer.toUpperCase()}`);
  };

  return (
    <div className="flex flex-col w-full relative pb-28 pt-2">
      {/* Top Offline Status & Telemetry Pill Bar */}
      <div className="px-margin pt-space-xs pb-space-sm flex items-center justify-between gap-space-xs z-20">
        <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-surface-container-lowest shadow-xs border border-surface-container">
          <span className="material-symbols-outlined text-[15px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
            offline_pin
          </span>
          <span className="font-label-sm text-label-sm text-on-surface">
            Offline Map: <span className="font-normal text-on-surface-variant">Cached (48 MB)</span>
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-surface-container-lowest shadow-xs border border-surface-container">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
            25.5788° N, 91.8933° E
          </span>
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative w-full h-[380px] overflow-hidden bg-surface-container-low select-none border-y border-surface-container">
        {/* Topographic Background Simulation */}
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-300 ${
            activeLayer === 'satellite'
              ? 'filter contrast-125 brightness-90 saturate-125'
              : 'opacity-70 filter saturate-75 contrast-105'
          }`}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80')`
          }}
        />

        {/* Heatmap overlay if active */}
        {activeLayer === 'riskHeatmap' && (
          <div className="absolute inset-0 bg-error/15 mix-blend-multiply pointer-events-none" />
        )}

        {/* Stylized Vector Overlay Layers (Topographic contours, route line, danger zone, & points) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" preserveAspectRatio="none" viewBox="0 0 400 380">
          <defs>
            {/* Hatch Pattern for Sensitive Geofence */}
            <pattern height="12" id="riskHatch" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse" width="12">
              <line stroke="#ba1a1a" strokeOpacity="0.45" strokeWidth="2" x1="0" x2="0" y1="0" y2="12" />
            </pattern>
            {/* Safe Corridor Glow Filter */}
            <filter height="140%" id="routeGlow" width="140%" x="-20%" y="-20%">
              <feDropShadow dx="0" dy="0" floodColor="#00696d" floodOpacity="0.5" stdDeviation="4" />
            </filter>
          </defs>

          {/* Topographic Elevation Isolines */}
          <path d="M-20 70 Q 120 40, 240 90 T 420 50" stroke="#c5c6cd" strokeDasharray="3 3" strokeOpacity="0.4" strokeWidth="1" />
          <path d="M-10 130 Q 150 110, 260 160 T 430 110" stroke="#c5c6cd" strokeDasharray="4 4" strokeOpacity="0.4" strokeWidth="1" />
          <path d="M-10 220 Q 130 190, 270 230 T 430 190" stroke="#c5c6cd" strokeDasharray="3 3" strokeOpacity="0.3" strokeWidth="1" />

          {/* Sensitive Geofence Polygon (Mawryngkneng Forest Zone) */}
          <polygon
            fill="url(#riskHatch)"
            points="180,50 340,30 385,150 310,210 195,160 160,110"
            stroke="#ba1a1a"
            strokeDasharray="6 3"
            strokeOpacity="0.9"
            strokeWidth="2"
          />
          <polygon
            fill="#ba1a1a"
            fillOpacity="0.12"
            points="180,50 340,30 385,150 310,210 195,160 160,110"
          />

          {/* Primary Route Path (NH 206 Corridor) */}
          <path
            d="M 40,340 C 70,290 85,245 105,210 C 130,170 148,155 170,125 C 190,98 220,70 270,40"
            filter="url(#routeGlow)"
            stroke={isBypassActive ? '#75777d' : '#00696d'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isBypassActive ? 3 : 5}
          />
          <path
            d="M 40,340 C 70,290 85,245 105,210 C 130,170 148,155 170,125 C 190,98 220,70 270,40"
            stroke="#ffffff"
            strokeDasharray={isBypassActive ? 'none' : '4 6'}
            strokeLinecap="round"
            strokeWidth="1.8"
          />

          {/* Alternate Bypass Route Path */}
          <path
            className="transition-all duration-300"
            d="M 105,210 C 100,160 115,100 150,60 C 180,30 220,20 270,40"
            stroke={isBypassActive ? '#00696d' : '#c76c00'}
            strokeDasharray={isBypassActive ? 'none' : '6 4'}
            strokeLinecap="round"
            strokeWidth={isBypassActive ? 5 : 3}
            opacity={isBypassActive ? 1 : 0.8}
          />

          {/* Waypoint Breadcrumbs */}
          <circle cx="70" cy="285" fill="#00696d" r="3.5" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="138" cy="162" fill="#00696d" r="3.5" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="215" cy="76" fill="#00696d" r="3.5" stroke="#ffffff" strokeWidth="1.5" />
        </svg>

        {/* Floating Zone Label inside Map */}
        <div className="absolute top-12 right-4 pointer-events-none flex flex-col items-end">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-error/95 text-on-error shadow-sm backdrop-blur-md">
            <span className="material-symbols-outlined text-[13px]">warning</span>
            <span className="font-label-sm text-[10px] tracking-wide uppercase font-bold">
              {riskZone.name}
            </span>
          </div>
          <span className="font-label-sm text-[10px] text-error font-semibold mt-0.5 bg-surface-container-lowest/90 px-1.5 py-0.5 rounded shadow-xs border border-error/20">
            High-Sensitivity Zone
          </span>
        </div>

        {/* POI Pin 1: Police Tourist Helpdesk (1.2 km) */}
        <button
          aria-label="Police Helpdesk"
          className="absolute top-[188px] left-[78px] -translate-x-1/2 -translate-y-full flex flex-col items-center group active:scale-95 transition-transform z-10 cursor-pointer"
          onClick={() =>
            setSelectedPOI({
              name: 'Tourist Police Kiosk #4',
              distance: '1.2 km ahead on NH 106',
              type: 'police',
              phone: '+91 3637 235222'
            })
          }
          type="button"
        >
          <div className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface shadow-xs font-label-sm text-[10px] whitespace-nowrap mb-1 flex items-center gap-1 border border-surface-container">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> 1.2km
          </div>
          <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary shadow-md flex items-center justify-center">
            <span className="material-symbols-outlined text-[16px]">local_police</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-0.5" />
        </button>

        {/* POI Pin 2: Civil Hospital Care (2.8 km) */}
        <button
          aria-label="Civil Hospital"
          className="absolute top-[138px] left-[158px] -translate-x-1/2 -translate-y-full flex flex-col items-center group active:scale-95 transition-transform z-10 cursor-pointer"
          onClick={() =>
            setSelectedPOI({
              name: 'Civil Hospital Care Hub',
              distance: '2.8 km (Bypasses forest entrance)',
              type: 'medical',
              phone: '108'
            })
          }
          type="button"
        >
          <div className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface shadow-xs font-label-sm text-[10px] whitespace-nowrap mb-1 flex items-center gap-1 border border-surface-container">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> 2.8km
          </div>
          <div className="w-7 h-7 rounded-full bg-surface-container-lowest text-error shadow-md flex items-center justify-center border border-error/30">
            <span className="material-symbols-outlined text-[16px]">medical_services</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest mt-0.5" />
        </button>

        {/* POI Pin 3: Forest Ranger Outpost (4.5 km) */}
        <button
          aria-label="Forest Ranger Outpost"
          className="absolute top-[72px] right-[100px] -translate-x-1/2 -translate-y-full flex flex-col items-center group active:scale-95 transition-transform z-10 cursor-pointer"
          onClick={() =>
            setSelectedPOI({
              name: 'Mawryngkneng Ranger Outpost',
              distance: '4.5 km inside forest zone gate',
              type: 'ranger',
              phone: '+91 364 2223400'
            })
          }
          type="button"
        >
          <div className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface shadow-xs font-label-sm text-[10px] whitespace-nowrap mb-1 flex items-center gap-1 border border-surface-container">
            <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container" /> 4.5km
          </div>
          <div className="w-7 h-7 rounded-full bg-surface-container-lowest text-on-surface shadow-md flex items-center justify-center border border-surface-container">
            <span className="material-symbols-outlined text-[16px]">nature_people</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest mt-0.5" />
        </button>

        {/* Current User Marker (Arjun Sharma) */}
        <div className="absolute top-[210px] left-[105px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10">
          {/* Radar Visual Cone Angle */}
          <div
            className="absolute w-24 h-24 -rotate-45 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 12px 50%, rgba(0, 105, 109, 0.45) 0%, rgba(148, 242, 247, 0.12) 65%, transparent 70%)',
              borderRadius: '0 100% 100% 0'
            }}
          />
          {/* Pulse Rings */}
          <span className="absolute w-12 h-12 rounded-full bg-secondary/20 animate-ping" />
          <span className="absolute w-7 h-7 rounded-full bg-secondary/30" />
          {/* GPS Center Pin */}
          <div className="relative w-5 h-5 rounded-full bg-secondary shadow-[0_0_10px_rgba(0,105,109,0.7)] flex items-center justify-center text-on-secondary">
            <div className="w-2 h-2 rounded-full bg-surface-container-lowest" />
          </div>
          {/* User Identification Tag */}
          <div className="absolute top-6 px-2 py-0.5 rounded-md bg-on-surface/90 backdrop-blur-sm text-surface-container-lowest font-label-sm text-[9px] whitespace-nowrap shadow-xs">
            Arjun (You) • Active SafeTour
          </div>
        </div>

        {/* Floating Top-Left Layer Switcher */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          <button
            aria-label="Map Layers"
            className="w-10 h-10 rounded-xl bg-surface-container-lowest/95 backdrop-blur-sm text-on-surface flex items-center justify-center shadow-md active:scale-95 transition-transform border border-surface-container cursor-pointer"
            onClick={() => setLayerMenuOpen(!layerMenuOpen)}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">layers</span>
          </button>

          {layerMenuOpen && (
            <div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-lg p-1.5 gap-1 min-w-[130px] border border-surface-container animate-in fade-in">
              <button
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-surface-container-low transition-colors cursor-pointer"
                onClick={() => handleSelectLayer('safeHavens')}
                type="button"
              >
                <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
                <span className="font-label-sm text-label-sm text-on-surface">Safe Havens</span>
              </button>
              <button
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-surface-container-low transition-colors cursor-pointer"
                onClick={() => handleSelectLayer('riskHeatmap')}
                type="button"
              >
                <span className="material-symbols-outlined text-error text-[16px]">local_fire_department</span>
                <span className="font-label-sm text-label-sm text-on-surface">Risk Heatmap</span>
              </button>
              <button
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-surface-container-low transition-colors cursor-pointer"
                onClick={() => handleSelectLayer('satellite')}
                type="button"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[16px]">satellite_alt</span>
                <span className="font-label-sm text-label-sm text-on-surface">Satellite</span>
              </button>
            </div>
          )}
        </div>

        {/* Floating Recenter & Compass */}
        <div className="absolute bottom-4 right-3 flex flex-col gap-2 z-20">
          <button
            aria-label="Recenter Map"
            className={`w-11 h-11 rounded-xl bg-surface-container-lowest/95 backdrop-blur-sm text-secondary flex items-center justify-center shadow-md active:scale-90 transition-transform border border-surface-container cursor-pointer ${
              isRecentering ? 'scale-110 bg-secondary-container' : ''
            }`}
            onClick={handleRecenter}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">my_location</span>
          </button>
          <div className="w-11 h-11 rounded-xl bg-surface-container-lowest/95 backdrop-blur-sm text-on-surface-variant flex flex-col items-center justify-center shadow-md border border-surface-container">
            <span className="font-label-sm text-[10px] font-bold text-error">N</span>
            <span className="material-symbols-outlined text-[16px] -mt-1 text-on-surface-variant">navigation</span>
          </div>
        </div>

        {/* Live Corridor Status Banner */}
        <div className="absolute bottom-4 left-3 right-16 z-20">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-lowest/95 backdrop-blur-sm shadow-md border border-surface-container">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label-sm text-label-sm text-on-surface truncate font-bold">
                NH 106 Tourist Corridor
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate text-[11px]">
                Speed limit 40 km/h • High Alert Patrols
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Intelligence Dossier Card (WHY / WHAT / ACTION Framework) */}
      <div className="px-margin -mt-2 relative z-30 flex flex-col gap-space-md pt-2">
        {/* Primary Risk Intelligence Module */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs p-space-md flex flex-col gap-space-sm relative overflow-hidden border border-surface-container">
          {/* 4px Indicator Lateral Bar for Hazard */}
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-error" />

          {/* Card Header */}
          <div className="flex items-start justify-between gap-space-xs pl-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                fmd_bad
              </span>
              <div className="flex flex-col">
                <h2 className="font-title-md text-title-md text-on-surface font-bold leading-tight">
                  High-Sensitivity Area Ahead
                </h2>
                <span className="font-label-sm text-label-sm text-error font-semibold">
                  Boundary {riskZone.distanceMeters}m away • {riskZone.name}
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-[10px] uppercase font-bold tracking-wider">
              Restricted
            </span>
          </div>

          {/* Structured Details: WHY / WHAT */}
          <div className="mt-1 pl-2 flex flex-col gap-2.5">
            {/* The WHY */}
            <div className="flex items-start gap-2.5 bg-surface-container-low p-2.5 rounded-lg border border-surface-container">
              <div className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">psychology_alt</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                  WHY THIS ALERT EXISTS
                </span>
                <p className="font-body-sm text-body-sm text-on-surface mt-0.5 leading-snug">
                  {riskZone.whyExists}
                </p>
              </div>
            </div>

            {/* The WHAT */}
            <div className="flex items-start gap-2.5 bg-surface-container-low p-2.5 rounded-lg border border-surface-container">
              <div className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">gavel</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                  WHAT TO COMPLY WITH
                </span>
                <p className="font-body-sm text-body-sm text-on-surface mt-0.5 leading-snug">
                  {riskZone.whatToComply}
                </p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS Framework */}
          <div className="mt-2 pl-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={toggleBypass}
              className={`w-full min-h-[50px] rounded-lg font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all cursor-pointer ${
                isBypassActive ? 'bg-secondary text-on-secondary' : 'bg-primary text-on-primary hover:bg-neutral-800'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isBypassActive ? 'check_circle' : 'alt_route'}
              </span>
              <span>
                {isBypassActive
                  ? 'Bypass Route Engaged (+12 min, Safe)'
                  : 'View Safer Alternate Route (Bypasses Forest)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setSelectedPOI({
                  name: 'Tourist Police Kiosk #4',
                  distance: '1.2 km ahead on NH 106',
                  type: 'police',
                  phone: '+91 3637 235222'
                })
              }
              className="w-full h-11 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 active:scale-[0.99] transition-transform cursor-pointer border border-surface-container hover:bg-surface-container-highest"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">domain_verification</span>
              <span>Check Nearby Safe Havens (3 Verified)</span>
            </button>
          </div>
        </div>

        {/* Selected POI Details Popover */}
        {selectedPOI && (
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-md border border-secondary/30 flex flex-col gap-2 relative animate-in fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">
                    {selectedPOI.type === 'police'
                      ? 'local_police'
                      : selectedPOI.type === 'medical'
                      ? 'medical_services'
                      : 'nature_people'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-title-md text-title-md text-on-surface font-bold">
                    {selectedPOI.name}
                  </h3>
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                    {selectedPOI.distance}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="text-on-surface-variant p-1 cursor-pointer hover:text-on-surface"
                onClick={() => setSelectedPOI(null)}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2">
              {selectedPOI.phone && (
                <a
                  href={`tel:${selectedPOI.phone}`}
                  className="flex-1 h-10 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>Call Station</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => onShowToast(`Navigating direct route to ${selectedPOI.name}`)}
                className="flex-1 h-10 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-[16px]">directions</span>
                <span>Direct Route</span>
              </button>
            </div>
          </div>
        )}

        {/* Tactical Bento Grid */}
        <div className="grid grid-cols-2 gap-space-sm">
          {/* Card 1: Live Escort / Convoy status */}
          <div className="p-3 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col justify-between border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-secondary text-[20px]">shield_with_heart</span>
              <span className="font-label-sm text-[10px] text-secondary font-bold uppercase bg-secondary-container/60 px-1.5 py-0.5 rounded">
                Active
              </span>
            </div>
            <div className="mt-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant block">Patrol Unit #14</span>
              <span className="font-title-md text-title-md text-on-surface font-bold">In Vicinity</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant block mt-0.5">
                Meghalaya Tourist Police
              </span>
            </div>
          </div>

          {/* Card 2: ETA & Daylight window */}
          <div className="p-3 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col justify-between border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">wb_twilight</span>
              <span className="font-label-sm text-[10px] text-on-tertiary-container font-bold uppercase bg-tertiary-fixed/60 px-1.5 py-0.5 rounded">
                1h 14m left
              </span>
            </div>
            <div className="mt-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant block">Daylight Window</span>
              <span className="font-title-md text-title-md text-on-surface font-bold">5:24 PM Fog</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant block mt-0.5">
                Cherrapunji Arrival: 4:45 PM
              </span>
            </div>
          </div>
        </div>

        {/* Live Telemetry Card: Connectivity & Offline Mesh */}
        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-xs flex items-center justify-between border border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[20px]">satellite</span>
            </div>
            <div className="flex flex-col">
              <span className="font-title-md text-title-md text-on-surface font-bold">Local Mesh SOS Ready</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                Bluetooth & LoRa offline beacon active
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-secondary font-label-sm text-label-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span>Secured</span>
          </div>
        </div>
      </div>
    </div>
  );
};
