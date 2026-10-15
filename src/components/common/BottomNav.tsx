/**
 * SAFE TOUR — Bottom Navigation Bar
 * 5-Tab mobile navigation matching Stitch layout with active highlights and badge counters.
 */

import React from 'react';

export type TabId = 'home' | 'map' | 'trip' | 'alerts' | 'profile';

interface BottomNavProps {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
  unreadAlertsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  unreadAlertsCount = 2
}) => {
  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'shield' },
    { id: 'map', label: 'Map', icon: 'near_me' },
    { id: 'trip', label: 'Trip', icon: 'explore' },
    { id: 'alerts', label: 'Alerts', icon: 'notifications' },
    { id: 'profile', label: 'Profile', icon: 'badge' }
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)] border-t border-surface-container">
      <div className="flex justify-around items-center h-16 px-space-xs max-w-md mx-auto">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] w-14 transition-colors ${
                isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              {tab.id === 'alerts' && unreadAlertsCount > 0 && (
                <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-error ring-2 ring-surface" />
              )}
              <span className={`font-label-sm text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
