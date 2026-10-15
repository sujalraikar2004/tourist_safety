/**
 * SMART TOURIST SAFETY MONITORING & INCIDENT RESPONSE SYSTEM
 * Tourist Mobile Application — Root Application & Interactive Simulator
 */

import React, { useState } from 'react';
import { TouristProfile } from './types';
import { MOCK_TOURIST, MOCK_TRIP, MOCK_RISK_ZONE, MOCK_ANOMALY } from './constants/mockData';
import { AppHeader } from './components/common/AppHeader';
import { BottomNav, TabId } from './components/common/BottomNav';
import { FloatingSOSButton } from './components/common/FloatingSOSButton';
import { HomeScreen } from './components/screens/HomeScreen';
import { MapScreen } from './components/screens/MapScreen';
import { TripScreen } from './components/screens/TripScreen';
import { AlertsScreen } from './components/screens/AlertsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { TouristIdScreen } from './components/screens/TouristIdScreen';
import { SOSDispatchScreen } from './components/screens/SOSDispatchScreen';
import { AnomalyModal } from './components/screens/AnomalyModal';
import { AuthModal } from './components/screens/AuthModals';
import { DemoScenarioRunner } from './components/screens/DemoScenarioRunner';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('home');
  const [tourist, setTourist] = useState<TouristProfile>(MOCK_TOURIST);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimeout, setToastTimeout] = useState<any>(null);

  // Modals & Overlay States
  const [showTouristIdModal, setShowTouristIdModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [isSOSOffline, setIsSOSOffline] = useState(false);
  const [showAnomalyModal, setShowAnomalyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [sosButtonSize, setSosButtonSize] = useState<'standard' | 'high-affordance'>('standard');

  const showToast = (msg: string) => {
    if (toastTimeout) clearTimeout(toastTimeout);
    setToastMessage(msg);
    const t = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
    setToastTimeout(t);
  };

  const handleOpenSOS = (isOffline: boolean = false) => {
    setIsSOSOffline(isOffline);
    setShowSOSModal(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-surface-dim sm:py-6 flex flex-col items-center justify-center font-body selection:bg-secondary-container">
      {/* Mobile Device Enclosure Wrapper for Desktop / Tablet Viewport */}
      <div className="w-full max-w-md bg-surface min-h-screen sm:min-h-[884px] sm:max-h-[92vh] sm:rounded-[36px] sm:shadow-[0_20px_60px_rgba(11,25,44,0.18)] sm:border-[8px] sm:border-[#0e1c2f] flex flex-col relative overflow-hidden">
        {/* Device Notch / Camera Island on Desktop Shell */}
        <div className="hidden sm:flex absolute top-0 inset-x-0 h-6 bg-[#0e1c2f] rounded-b-2xl z-50 justify-center items-center">
          <div className="w-16 h-3 bg-black/60 rounded-full flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800" />
          </div>
        </div>

        {/* Global Toast Banner */}
        {toastMessage && (
          <div className="fixed sm:absolute top-18 left-4 right-4 z-50 transform transition-all duration-300 flex items-center justify-between p-3.5 rounded-xl bg-primary-container text-on-primary shadow-xl border border-secondary/30 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-secondary-container">verified</span>
              <span className="font-label-md text-label-md">{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-white/70 hover:text-white p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Top Header */}
        <AppHeader
          title={
            currentTab === 'home'
              ? 'Tourist Home'
              : currentTab === 'map'
              ? 'Safe Radar Map'
              : currentTab === 'trip'
              ? 'Meghalaya Adventure'
              : currentTab === 'alerts'
              ? 'Safety Advisories'
              : 'Digital ID Profile'
          }
          dtid={tourist.dtid}
          isOnline={true}
          onProfilePress={() => setCurrentTab('profile')}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full pt-16 overflow-y-auto no-scrollbar relative">
          {currentTab === 'home' && (
            <HomeScreen
              tourist={tourist}
              onNavigateTab={setCurrentTab}
              onOpenTouristId={() => setShowTouristIdModal(true)}
              onOpenSOS={() => handleOpenSOS(false)}
              onOpenAnomaly={() => setShowAnomalyModal(true)}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'map' && (
            <MapScreen
              riskZone={MOCK_RISK_ZONE}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'trip' && (
            <TripScreen
              trip={MOCK_TRIP}
              onNavigateTab={setCurrentTab}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'alerts' && (
            <AlertsScreen
              onNavigateTab={setCurrentTab}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileScreen
              tourist={tourist}
              onOpenTouristId={() => setShowTouristIdModal(true)}
              onLogout={() => handleOpenAuth('login')}
              onShowToast={showToast}
              currentSosSize={sosButtonSize}
              onChangeSosSize={setSosButtonSize}
            />
          )}
        </main>

        {/* Floating SOS Trigger Button */}
        <FloatingSOSButton
          size={sosButtonSize}
          onPress={() => handleOpenSOS(false)}
        />

        {/* Bottom Tab Navigation */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          unreadAlertsCount={2}
        />

        {/* Digital Tourist ID Passcard Overlay Modal */}
        {showTouristIdModal && (
          <div className="fixed sm:absolute inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 overflow-y-auto">
            <div className="w-full max-w-md bg-surface rounded-t-3xl sm:rounded-2xl shadow-2xl border border-surface-container overflow-hidden max-h-[92vh] overflow-y-auto">
              <div className="flex justify-between items-center p-3 pb-0">
                <span className="font-label-sm uppercase font-bold text-secondary text-xs pl-2">
                  Checkpoint Specimen
                </span>
                <button
                  type="button"
                  onClick={() => setShowTouristIdModal(false)}
                  className="text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[22px]">close</span>
                </button>
              </div>
              <TouristIdScreen
                tourist={tourist}
                onClose={() => setShowTouristIdModal(false)}
                onShowToast={showToast}
              />
            </div>
          </div>
        )}

        {/* Active Emergency SOS Dispatch Modal */}
        {showSOSModal && (
          <div className="fixed sm:absolute inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 overflow-y-auto">
            <div className="w-full max-w-md bg-surface rounded-t-3xl sm:rounded-2xl shadow-2xl border border-surface-container overflow-hidden max-h-[95vh] overflow-y-auto">
              <div className="flex justify-between items-center p-3 pb-0 bg-surface">
                <button
                  type="button"
                  onClick={() => setShowSOSModal(false)}
                  className="flex items-center gap-1 text-on-surface font-label-md font-bold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  <span>Exit SOS View</span>
                </button>
              </div>
              <SOSDispatchScreen
                isOfflineMode={isSOSOffline}
                onClose={() => setShowSOSModal(false)}
                onShowToast={showToast}
              />
            </div>
          </div>
        )}

        {/* AI Anomaly Verification Modal */}
        {showAnomalyModal && (
          <AnomalyModal
            anomaly={MOCK_ANOMALY}
            onClose={() => setShowAnomalyModal(false)}
            onShowToast={showToast}
            onRequestHelp={() => {
              setShowAnomalyModal(false);
              handleOpenSOS(false);
            }}
          />
        )}

        {/* Authentication Modal */}
        {showAuthModal && (
          <AuthModal
            mode={authMode}
            onClose={() => setShowAuthModal(false)}
            onSuccess={user => {
              setTourist(user);
              setShowAuthModal(false);
            }}
            onSwitchMode={setAuthMode}
            onShowToast={showToast}
          />
        )}

        {/* Academic 24-Step Demonstration Workflow Controller */}
        <DemoScenarioRunner
          onNavigateTab={setCurrentTab}
          onOpenTouristId={() => setShowTouristIdModal(true)}
          onOpenSOS={handleOpenSOS}
          onOpenAnomaly={() => setShowAnomalyModal(true)}
          onOpenAuth={() => handleOpenAuth('login')}
          onShowToast={showToast}
        />
      </div>
    </div>
  );
}
