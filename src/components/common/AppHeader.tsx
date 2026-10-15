/**
 * SAFE TOUR — Application Header
 * Preserves the Google Stitch brand emblem, DTID badge, and connectivity telemetry.
 */

import React from 'react';

interface AppHeaderProps {
  title?: string;
  dtid?: string;
  isOnline?: boolean;
  onProfilePress?: () => void;
  onBackPress?: () => void;
  showBack?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'Tourist Home',
  dtid = 'DTID-8F4K29',
  isOnline = true,
  onProfilePress,
  onBackPress,
  showBack = false
}) => {
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
      <div className="h-16 px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          {showBack && (
            <button
              type="button"
              onClick={onBackPress}
              aria-label="Back"
              className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center text-on-surface active:opacity-60 transition-opacity"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          )}

          {/* SafeTour Shield & Compass Emblem */}
          <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center p-1 border border-secondary/20 shadow-xs">
            <svg viewBox="0 0 100 100" className="w-full h-full text-secondary" fill="currentColor">
              <path d="M50 8 C68 8 84 18 84 38 C84 62 50 92 50 92 C50 92 16 62 16 38 C16 18 32 8 50 8 Z" fill="none" stroke="currentColor" strokeWidth="8" />
              <circle cx="50" cy="42" r="22" fill="#94f2f7" />
              <polygon points="50,26 62,54 50,47 38,54" fill="#00696d" />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-title-md text-title-md text-on-surface font-bold tracking-tight">SafeTour</span>
              <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] tracking-wide uppercase font-semibold">
                {dtid}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            type="button"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={isOnline ? 'Online via GPS & Cellular' : 'Offline Vault Active'}
          >
            <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-outline-variant/30">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-secondary animate-pulse' : 'bg-outline'}`} />
              <span className={`font-label-sm text-label-sm font-bold ${isOnline ? 'text-secondary' : 'text-on-surface-variant'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={onProfilePress}
            aria-label="Open Profile"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
