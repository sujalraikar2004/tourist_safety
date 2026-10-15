/**
 * SAFE TOUR — Safety Alerts Screen
 * Faithful implementation of Google Stitch Alerts Feed with Category Filters,
 * Priority Incident Banners, Responder Metadata, and SMS Fallback Protocols.
 */

import React, { useState } from 'react';
import { AlertNotification } from '../../types';
import { alertService } from '../../services/alerts/alertService';

interface AlertsScreenProps {
  onNavigateTab: (tab: 'home' | 'map' | 'trip' | 'alerts' | 'profile') => void;
  onShowToast: (msg: string) => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({ onNavigateTab, onShowToast }) => {
  const [alerts, setAlerts] = useState<AlertNotification[]>(alertService.getAlerts());
  const [activeFilter, setActiveFilter] = useState<'all' | 'geofence' | 'trip' | 'dispatch'>('all');

  const filteredAlerts = alerts.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'geofence') return item.category === 'GEOFENCE' || item.category === 'HAZARD';
    if (activeFilter === 'trip') return item.category === 'CHECKIN' || item.category === 'OFFLINE_CACHE';
    if (activeFilter === 'dispatch') return item.category === 'DISPATCH';
    return true;
  });

  const handleMarkAllRead = () => {
    alertService.markAllAsRead();
    setAlerts(alertService.getAlerts());
    onShowToast('All alerts marked as read');
  };

  const handleAcknowledge = (id: string) => {
    alertService.markAsRead(id);
    setAlerts(alertService.getAlerts());
    onShowToast('Alert acknowledged');
  };

  return (
    <div className="flex flex-col w-full pb-28 px-margin space-y-space-md pt-2">
      {/* Telemetry Header Strip */}
      <div className="flex items-center justify-between pt-space-xs">
        <div className="flex items-center gap-space-sm">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant border border-surface-container">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span className="font-label-sm text-label-sm tracking-wide font-bold">RADAR SYNCED</span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-mono text-[11px]">
            GPS: 25.5788° N, 91.8933° E
          </span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
          <span className="font-label-sm text-label-sm font-semibold">Mesh Encrypted</span>
        </div>
      </div>

      {/* Page Title & Micro Counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Safety Alerts
          </h1>
          {alertService.getUnreadCount() > 0 && (
            <span className="flex items-center px-2 py-0.5 rounded-full bg-error text-on-error font-label-sm text-label-sm animate-pulse font-bold">
              {alertService.getUnreadCount()} New
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleMarkAllRead}
          aria-label="Mark all alerts as read"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">done_all</span>
        </button>
      </div>

      {/* Filter Horizontal Scroll Bar */}
      <div className="flex items-center gap-space-sm overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`shrink-0 min-h-[40px] px-3.5 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-primary text-on-primary font-bold'
              : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span>All</span>
          <span className="w-5 h-5 rounded-full bg-surface-container-lowest/20 flex items-center justify-center font-label-sm text-label-sm">
            {alerts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('geofence')}
          className={`shrink-0 min-h-[40px] px-3.5 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeFilter === 'geofence'
              ? 'bg-primary text-on-primary font-bold'
              : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span>Safety & Geofence</span>
          <span className="w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center font-label-sm text-label-sm text-on-surface">
            2
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('trip')}
          className={`shrink-0 min-h-[40px] px-3.5 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeFilter === 'trip'
              ? 'bg-primary text-on-primary font-bold'
              : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span>Trip & Check-ins</span>
          <span className="w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center font-label-sm text-label-sm text-on-surface">
            2
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('dispatch')}
          className={`shrink-0 min-h-[40px] px-3.5 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeFilter === 'dispatch'
              ? 'bg-primary text-on-primary font-bold'
              : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span>Emergency Dispatches</span>
          <span className="w-5 h-5 rounded-full bg-error-container text-on-error-container flex items-center justify-center font-label-sm text-label-sm font-bold">
            1
          </span>
        </button>
      </div>

      {/* Priority Active Incident Banner */}
      <div className="rounded-xl bg-tertiary-fixed text-on-tertiary-fixed p-space-md shadow-xs relative overflow-hidden border border-tertiary-fixed-dim/50">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-on-tertiary-container" />
        <div className="flex items-start gap-space-sm pl-1">
          <div className="w-9 h-9 rounded-full bg-on-tertiary-container/10 flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-on-tertiary-container text-[22px]">warning</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-space-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-title-md text-title-md font-bold text-on-tertiary-fixed">
                  High-Sensitivity Zone
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-on-tertiary-container text-surface-container-lowest font-label-sm text-[10px] uppercase font-bold tracking-wider">
                  400m Away
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant whitespace-nowrap">
                Now
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-tertiary-fixed-variant mt-1 leading-snug">
              Mawryngkneng Forest perimeter entered. Sunset occurs in <strong className="font-semibold text-on-tertiary-fixed">4h 09m</strong>. Mandatory certified guide required past Entry Post B.
            </p>

            <div className="flex items-center gap-space-sm mt-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigateTab('map')}
                className="min-h-[44px] flex-1 px-space-sm py-2 rounded-lg bg-on-tertiary-fixed text-tertiary-fixed font-label-md text-label-md font-bold flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">turn_sharp_right</span>
                <span>View Safe Route</span>
              </button>
              <button
                type="button"
                onClick={() => onShowToast('Perimeter advisory acknowledged')}
                className="min-h-[44px] px-space-md py-2 rounded-lg bg-surface-container-lowest/70 text-on-tertiary-fixed hover:bg-surface-container-lowest font-label-md text-label-md font-semibold active:scale-95 transition-all cursor-pointer border border-tertiary-fixed-dim/40"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Incident & Alerts Feed */}
      <div className="space-y-space-md">
        {filteredAlerts.map(alert => {
          const isCritical = alert.severity === 'CRITICAL';
          const isWarning = alert.severity === 'WARNING';
          const isSuccess = alert.severity === 'SUCCESS';

          return (
            <article
              key={alert.id}
              className="rounded-xl bg-surface-container-lowest p-space-md shadow-xs relative overflow-hidden transition-all border border-surface-container"
            >
              <div
                className={`absolute top-0 left-0 w-1.5 h-full ${
                  isCritical ? 'bg-error' : isWarning ? 'bg-on-tertiary-container' : isSuccess ? 'bg-secondary' : 'bg-outline-variant'
                }`}
              />

              <div className="flex items-start gap-space-sm pl-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isCritical
                      ? 'bg-error-container text-on-error-container'
                      : isWarning
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                      : isSuccess
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {isCritical
                      ? 'crisis_alert'
                      : isWarning
                      ? 'foggy'
                      : isSuccess
                      ? 'check_circle'
                      : 'offline_pin'}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">
                      {alert.title}
                    </h3>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      {alert.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 mb-1.5">
                    {alert.ticketId ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-[10px] font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" /> Active Resolution
                      </span>
                    ) : alert.subtitle ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-[10px] font-bold uppercase tracking-wider">
                        {alert.subtitle}
                      </span>
                    ) : null}

                    {alert.ticketId && (
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Ticket {alert.ticketId}
                      </span>
                    )}
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {alert.description}
                  </p>

                  {/* Responder Mini Meta Box if present */}
                  {alert.unitMeta && (
                    <div className="mt-3 p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-surface-container">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary">
                          <span className="material-symbols-outlined text-[16px]">local_police</span>
                        </div>
                        <div className="min-w-0">
                          <span className="block font-label-sm text-label-sm text-on-surface font-bold truncate">
                            {alert.unitMeta.officer}
                          </span>
                          <span className="block font-label-sm text-[10px] text-on-surface-variant">
                            ETA: {alert.unitMeta.eta} • {alert.unitMeta.channel}
                          </span>
                        </div>
                      </div>

                      <a
                        href="tel:112"
                        className="min-h-[44px] px-space-sm py-1.5 rounded-lg bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold flex items-center gap-1 active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[16px] text-secondary">call</span>
                        <span>Direct Link</span>
                      </a>
                    </div>
                  )}

                  {/* Detour or info banner */}
                  {alert.actionLabel && !alert.unitMeta && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="flex-1 px-3 py-2 rounded-lg bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5 border border-surface-container">
                        <span className="material-symbols-outlined text-[16px] text-secondary">alt_route</span>
                        <span className="truncate">{alert.actionLabel}</span>
                      </div>
                    </div>
                  )}

                  {alert.isNew && (
                    <div className="mt-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleAcknowledge(alert.id)}
                        className="text-secondary font-label-sm text-[11px] font-bold hover:underline cursor-pointer"
                      >
                        Mark as read
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Regional Context Card */}
      <div className="rounded-xl bg-surface-container-low p-space-md space-y-space-sm border border-surface-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">radar</span>
            <span className="font-title-md text-title-md text-on-surface font-bold">Zone Safety Index</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
            East Khasi Hills
          </span>
        </div>

        <div
          className="w-full h-32 bg-cover bg-center rounded-lg relative overflow-hidden shadow-inner border border-surface-container-high"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&w=600&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-[0.5px]" />
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-surface-container-lowest/90 text-on-surface font-label-sm text-label-sm font-semibold shadow-xs flex items-center gap-1 border border-surface-container">
            <span className="w-2 h-2 rounded-full bg-secondary" /> 3 Safe Shelters Active
          </div>
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-primary-container text-on-primary font-label-sm text-[11px] font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">cell_tower</span> Next Base Station 1.2km
          </div>
        </div>
      </div>

      {/* Settings & SMS Fallback Footer */}
      <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-xs space-y-space-md border border-surface-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[18px]">volume_up</span>
            </div>
            <div>
              <span className="block font-title-md text-title-md text-on-surface font-bold">
                Quiet Hours & Alerts Sound
              </span>
              <span className="block font-body-sm text-body-sm text-on-surface-variant">
                Bypass active for critical dispatches
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onShowToast('Alert sounds: Critical alarms override silent mode')}
            aria-label="Toggle sound settings"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-secondary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">tune</span>
          </button>
        </div>

        <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low border border-surface-container">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Emergency SMS Fallback Protocol
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Auto-transmits GPS via satellite when 4G drops
              </span>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-label-sm text-[11px] font-bold uppercase tracking-wider">
            Active
          </span>
        </div>
      </div>
    </div>
  );
};
