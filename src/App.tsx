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

// Helper to parse route synchronously on first load
function parseCurrentRoute(): { view: string; param?: string } {
  if (typeof window === 'undefined') return { view: 'landing' };

  // 1. Check path-based emergency / scan URL first
  const path = window.location.pathname;
  if (path.includes('/emergency/')) {
    const parts = path.split('/emergency/');
    const id = decodeURIComponent(parts[parts.length - 1].split(/[?#]/)[0].trim());
    if (id) return { view: 'emergency-profile', param: id };
  }
  if (path.includes('/scan/')) {
    const parts = path.split('/scan/');
    const id = decodeURIComponent(parts[parts.length - 1].split(/[?#]/)[0].trim());
    if (id) return { view: 'emergency-profile', param: id };
  }

  // 2. Check hash routing
  let rawHash = window.location.hash || '';
  try {
    rawHash = decodeURIComponent(rawHash);
  } catch {}

  const cleanHash = rawHash.replace(/^#[/!]*/, '').trim();
  const hashPath = cleanHash.split('?')[0].trim();

  if (hashPath.toLowerCase().startsWith('scan/')) {
    const id = hashPath.replace(/^scan\//i, '').trim();
    if (id) {
      return { view: 'emergency-profile', param: id };
    } else {
      return { view: 'scan', param: undefined };
    }
  } else if (hashPath.toLowerCase() === 'scan') {
    return { view: 'scan', param: undefined };
  } else if (hashPath.toLowerCase().startsWith('emergency/') || hashPath.toLowerCase().startsWith('emergency-profile/')) {
    const id = hashPath.replace(/^(emergency|emergency-profile)\//i, '').trim();
    if (id) {
      return { view: 'emergency-profile', param: id };
    } else {
      return { view: 'scan', param: undefined };
    }
  } else if (hashPath.toLowerCase() === 'safejourney') {
    return { view: 'safejourney', param: undefined };
  } else if (hashPath.toLowerCase() === 'register') {
    return { view: 'register', param: undefined };
  } else if (hashPath.toLowerCase() === 'dashboard') {
    return { view: 'dashboard', param: undefined };
  } else if (hashPath.toLowerCase() === 'sticker') {
    return { view: 'sticker', param: undefined };
  } else if (hashPath.toLowerCase() === 'landing' || hashPath.toLowerCase() === 'home' || !hashPath) {
    return { view: 'landing', param: undefined };
  } else {
    return { view: 'scan', param: undefined };
  }
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ResQTag ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF7F7] flex items-center justify-center p-6 text-center">
          <div className="glass-card-rose-solid rounded-3xl p-8 max-w-md space-y-4 border border-red-200">
            <h2 className="text-xl font-black text-[#2B2020]">Emergency Portal</h2>
            <p className="text-xs text-[#806F6F]">
              An unexpected render issue occurred. Click below to reload the emergency profile.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-xl btn-rose-primary text-white font-bold text-xs"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { isCheckinPromptOpen, setCheckinPromptOpen } = useAuth();

  // Navigation state initialized synchronously
  const [routeState, setRouteState] = useState(() => parseCurrentRoute());
  const currentView = routeState.view;
  const currentParam = routeState.param;

  // Sync with browser hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = parseCurrentRoute();
      setRouteState(nextRoute);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    const targetView = view === 'home' ? 'landing' : view;
    setRouteState({ view: targetView, param });

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
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
