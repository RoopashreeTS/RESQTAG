import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { DemoControlBanner } from './components/DemoControlBanner';
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
import { AccidentSimulationModal } from './components/AccidentSimulationModal';

const AppContent: React.FC = () => {
  const { isCheckinPromptOpen, setCheckinPromptOpen } = useAuth();

  // Navigation state
  const [currentView, setCurrentView] = useState<string>('landing');
  const [currentParam, setCurrentParam] = useState<string | undefined>(undefined);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Sync with browser hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash.startsWith('scan/')) {
        const id = hash.replace('scan/', '');
        setCurrentView('emergency-profile');
        setCurrentParam(id || 'RQ7K29');
      } else if (hash === 'scan') {
        setCurrentView('scan');
        setCurrentParam(undefined);
      } else if (hash === 'safejourney') {
        setCurrentView('safejourney');
        setCurrentParam(undefined);
      } else if (hash === 'register') {
        setCurrentView('register');
        setCurrentParam(undefined);
      } else if (hash === 'dashboard') {
        setCurrentView('dashboard');
        setCurrentParam(undefined);
      } else if (hash === 'sticker') {
        setCurrentView('sticker');
        setCurrentParam(undefined);
      } else if (hash === 'landing' || !hash) {
        setCurrentView('landing');
        setCurrentParam(undefined);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setCurrentParam(param);

    // Update URL hash smoothly
    if (view === 'emergency-profile' && param) {
      window.location.hash = `scan/${param}`;
    } else if (view === 'scan') {
      window.location.hash = 'scan';
    } else if (view === 'safejourney') {
      window.location.hash = 'safejourney';
    } else if (view === 'register') {
      window.location.hash = 'register';
    } else if (view === 'dashboard') {
      window.location.hash = 'dashboard';
    } else if (view === 'sticker') {
      window.location.hash = 'sticker';
    } else {
      window.location.hash = '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Top Hackathon Quick Banner */}
      <DemoControlBanner
        onNavigate={handleNavigate}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />

      {/* 2. Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />

      {/* 3. Main Content View */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
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
            onOpenSimulator={() => setIsSimulatorOpen(true)}
          />
        )}

        {currentView === 'sticker' && (
          <QrStickerPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-navy-800 bg-navy-900 py-8 px-4 text-center text-xs text-slate-400 space-y-2 no-print">
        <div className="flex items-center justify-center gap-2 font-mono font-bold text-slate-200">
          <span>RESQTAG</span>
          <span>•</span>
          <span className="text-emergency-500">EMERGENCY QR</span>
          <span>+</span>
          <span className="text-emerald-400">SAFEJOURNEY PROACTIVE MONITORING</span>
        </div>
        <p className="text-[11px] text-slate-500">
          “When the victim cannot speak, ResQTag speaks for them.” • Built for Hackathon Demo
        </p>
      </footer>

      {/* 5. SafeJourney Scheduled Check-in Prompt Modal */}
      <SafeJourneyCheckinModal
        isOpen={isCheckinPromptOpen}
        onClose={() => setCheckinPromptOpen(false)}
      />

      {/* 6. SafeJourney Emergency Contact Alert Modal */}
      <SafeJourneyAlertModal />

      {/* 7. Live Simulated Contact Notification Popups */}
      <TrustedContactAlertModal />

      {/* 8. Accident Simulation Modal */}
      <AccidentSimulationModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onLaunchScan={(id) => handleNavigate('emergency-profile', id)}
      />
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
