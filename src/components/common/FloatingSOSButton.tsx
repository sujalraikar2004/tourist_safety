/**
 * SAFE TOUR — Floating SOS Button
 * Prominent emergency trigger placed above bottom navigation.
 */

import React from 'react';

interface FloatingSOSButtonProps {
  onPress: () => void;
  size?: 'standard' | 'high-affordance';
}

export const FloatingSOSButton: React.FC<FloatingSOSButtonProps> = ({
  onPress,
  size = 'standard'
}) => {
  const isEnlarged = size === 'high-affordance';

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button
        type="button"
        onClick={onPress}
        aria-label="Emergency SOS Assistance"
        className={`group relative rounded-full bg-error text-on-error flex items-center justify-center gap-1.5 shadow-[0_8px_24px_rgba(186,26,26,0.42)] active:scale-90 transition-transform cursor-pointer overflow-hidden ${
          isEnlarged ? 'h-16 px-6 min-w-[64px]' : 'h-14 px-5 min-w-[48px]'
        }`}
      >
        {/* Animated Beacon Halo */}
        <span className="absolute -inset-1 rounded-full bg-error opacity-40 animate-ping pointer-events-none" />
        <span className="material-symbols-outlined text-[24px] relative z-10 font-bold">sos</span>
        <span className="font-label-lg text-label-lg font-extrabold tracking-wider relative z-10">SOS</span>
      </button>
    </div>
  );
};
