import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { RegistrationFlow } from './components/RegistrationFlow';
import { ResponderScanPage } from './components/ResponderScanPage';
import { EmergencyProfileView } from './components/EmergencyProfileView';
import { OwnerDashboard } from './components/OwnerDashboard';
import { QrStickerPage } from './components/QrStickerPage';
import { SafeJourneyView } from './components/SafeJourneyView';
import { SafeJourneyCheckinModal } from './components/SafeJourneyCheckinModal';
import { SafeJourneyAlertModal } from './components/SafeJourneyAlertModal';
import { TrustedContactAlertModal } from './components/TrustedContactAlertModal';
import { GlobalRoseBackground } from './components/GlobalRoseBackground';

const AppContent: React.FC = () => {
  const { isCheckinPromptOpen, setCheckinPromptOpen } = useAuth();

  // Navigation state
  const [currentView, setCurrentView] = useState<string>('landing');
  const [currentParam, setCurrentParam] = useState<string | undefined>(undefined);

  // Sync with browser hash routing
  useEffect(() => {
    const handleHashChange = () => {
      // 1. Check path-based emergency / scan URL first (e.g. /RESQTAG/scan/RQ7K29 or /RESQTAG/emergency/RQ7K29)
      const path = window.location.pathname;
      if (path.includes('/emergency/')) {
        const parts = path.split('/emergency/');
        const id = decodeURIComponent(parts[parts.length - 1].split(/[?#]/)[0].trim());
        if (id) {
          setCurrentView('emergency-profile');
          setCurrentParam(id);
          return;
        }
      }
      if (path.includes('/scan/')) {
        const parts = path.split('/scan/');
        const id = decodeURIComponent(parts[parts.length - 1].split(/[?#]/)[0].trim());
        if (id) {
          setCurrentView('emergency-profile');
          setCurrentParam(id);
          return;
        }
      }

      // 2. Check hash routing (e.g. #scan/RQ7K29, #/scan/RQ7K29, #emergency/..., etc.)
      let rawHash = window.location.hash || '';
      try {
        rawHash = decodeURIComponent(rawHash);
      } catch {}

      const cleanHash = rawHash.replace(/^#[/!]*/, '').trim();
      const hashPath = cleanHash.split('?')[0].trim(); // strip query string

      if (hashPath.toLowerCase().startsWith('scan/')) {
        const id = hashPath.replace(/^scan\//i, '').trim();
        if (id) {
          setCurrentView('emergency-profile');
          setCurrentParam(id);
        } else {
          setCurrentView('scan');
          setCurrentParam(undefined);
        }
      } else if (hashPath.toLowerCase() === 'scan') {
        setCurrentView('scan');
        setCurrentParam(undefined);
      } else if (hashPath.toLowerCase().startsWith('emergency/') || hashPath.toLowerCase().startsWith('emergency-profile/')) {
        const id = hashPath.replace(/^(emergency|emergency-profile)\//i, '').trim();
        if (id) {
          setCurrentView('emergency-profile');
          setCurrentParam(id);
        } else {
          setCurrentView('scan');
          setCurrentParam(undefined);
        }
      } else if (hashPath.toLowerCase() === 'safejourney') {
        setCurrentView('safejourney');
        setCurrentParam(undefined);
      } else if (hashPath.toLowerCase() === 'register') {
        setCurrentView('register');
        setCurrentParam(undefined);
      } else if (hashPath.toLowerCase() === 'dashboard') {
        setCurrentView('dashboard');
        setCurrentParam(undefined);
      } else if (hashPath.toLowerCase() === 'sticker') {
        setCurrentView('sticker');
        setCurrentParam(undefined);
      } else if (hashPath.toLowerCase() === 'landing' || hashPath.toLowerCase() === 'home' || !hashPath) {
        setCurrentView('landing');
        setCurrentParam(undefined);
      } else {
        // If route is unrecognized, show the Scan portal instead of a blank screen
        setCurrentView('scan');
        setCurrentParam(undefined);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    const targetView = view === 'home' ? 'landing' : view;
    setCurrentView(targetView);
    setCurrentParam(param);

    // Update URL hash smoothly
    if (targetView === 'emergency-profile' && param) {
      window.location.hash = `scan/${param}`;
    } else if (targetView === 'scan') {
      window.location.hash = 'scan';
    } else if (targetView === 'safejourney') {
      window.location.hash = 'safejourney';
    } else if (targetView === 'register') {
      window.location.hash = 'register';
    } else if (targetView === 'dashboard') {
      window.location.hash = 'dashboard';
    } else if (targetView === 'sticker') {
      window.location.hash = 'sticker';
    } else if (targetView === 'landing') {
      window.location.hash = '';
    } else {
      window.location.hash = '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFF7F7] text-[#2B2020] flex flex-col font-sans relative overflow-x-hidden selection:bg-rose-200 selection:text-[#C62828]">
      {/* Universal Animated Light Red Background */}
      <GlobalRoseBackground />

      {/* Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main Content View */}
      <main className="flex-1 relative z-10">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'safejourney' && (
          <SafeJourneyView
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'register' && (
          <RegistrationFlow onNavigate={handleNavigate} />
        )}

        {currentView === 'scan' && (
          <ResponderScanPage
            onScanComplete={(id) => handleNavigate('emergency-profile', id)}
          />
        )}

        {currentView === 'emergency-profile' && (
          <EmergencyProfileView
            identifier={currentParam || 'RQ7K29'}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'dashboard' && (
          <OwnerDashboard
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'sticker' && (
          <QrStickerPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer with Glass Effect */}
      <footer className="relative z-10 border-t border-red-100/80 bg-white/60 backdrop-blur-md py-8 px-4 text-center text-xs text-[#806F6F] space-y-2 no-print">
        <div className="flex flex-wrap items-center justify-center gap-2 font-mono font-bold text-[#2B2020]">
          <span>RESQTAG</span>
          <span>•</span>
          <span className="text-[#E53935]">EMERGENCY QR</span>
          <span>+</span>
          <span className="text-[#16A34A]">SAFEJOURNEY PROACTIVE MONITORING</span>
        </div>
        <p className="text-[11px] text-[#806F6F]">
          “When the victim cannot speak, ResQTag speaks for them.”
        </p>
      </footer>

      {/* SafeJourney Scheduled Check-in Prompt Modal */}
      <SafeJourneyCheckinModal
        isOpen={isCheckinPromptOpen}
        onClose={() => setCheckinPromptOpen(false)}
      />

      {/* SafeJourney Emergency Contact Alert Modal */}
      <SafeJourneyAlertModal />

      {/* Live Contact Notification Popups */}
      <TrustedContactAlertModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
