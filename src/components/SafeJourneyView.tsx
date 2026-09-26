import React, { useState } from 'react';
import { 
  Trees, 
  ShieldCheck, 
  ArrowRight, 
  History, 
  QrCode,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SafeJourneySetupWizard } from './SafeJourneySetupWizard';
import { SafeJourneyActiveDashboard } from './SafeJourneyActiveDashboard';
import { SafeJourneyHistoryView } from './SafeJourneyHistoryView';
import { TechWaveBackground } from './TechWaveBackground';

interface SafeJourneyViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const SafeJourneyView: React.FC<SafeJourneyViewProps> = ({ onNavigate }) => {
  const { activeJourney, setCheckinPromptOpen } = useAuth();
  const [subView, setSubView] = useState<'main' | 'setup' | 'history'>('main');

  // If currently setting up
  if (subView === 'setup') {
    return (
      <SafeJourneySetupWizard
        onJourneyStarted={() => setSubView('main')}
        onCancel={() => setSubView('main')}
      />
    );
  }

  // If viewing history
  if (subView === 'history') {
    return (
      <SafeJourneyHistoryView
        onBack={() => setSubView('main')}
        onStartNew={() => setSubView('setup')}
      />
    );
  }

  // If an active journey is currently running
  if (activeJourney) {
    return (
      <SafeJourneyActiveDashboard
        journey={activeJourney}
        onOpenCheckinPrompt={() => setCheckinPromptOpen(true)}
        onOpenHistory={() => setSubView('history')}
      />
    );
  }

  // Otherwise, render the SafeJourney Main Landing & Start Portal
  return (
    <div className="space-y-12 pb-24 text-slate-900">
      
      {/* 1. ANIMATED SAFEJOURNEY HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden text-white">
        <TechWaveBackground variant="safejourney" showNetwork={true} />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="glass-panel-tech border border-white/20 rounded-3xl p-8 sm:p-12 shadow-glass space-y-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-400/20 text-teal-200 border border-teal-300/30 text-xs font-bold">
                <Compass className="w-3.5 h-3.5 text-teal-300" />
                <span>PROACTIVE SAFETY MONITORING</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                ResQTag <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-200">SafeJourney</span>
              </h1>

              <p className="text-base sm:text-xl text-teal-100 font-semibold">
                Stay connected. Check in. Get help when you need it.
              </p>

              <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed max-w-2xl">
                Proactive safety check-in schedule designed for solo hikers, remote campers, forest trekkers, and highway travellers. If a scheduled check-in is missed, your trusted emergency contacts are automatically alerted with your last recorded location.
              </p>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => setSubView('setup')}
                  className="px-8 py-3.5 rounded-xl font-bold text-sm btn-tech-teal flex items-center justify-center gap-2.5 shadow-lg shadow-teal-500/30 active:scale-[0.99]"
                >
                  <Trees className="w-4 h-4 text-white" />
                  <span>START SAFEJOURNEY</span>
                </button>

                <button
                  onClick={() => setSubView('history')}
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <History className="w-4 h-4 text-sky-200" />
                  <span>View Past Journeys</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE TWO CONNECTED RESQTAG SAFETY PILLARS (LIGHT SECTION) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            System Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
            Two Connected Pillars of ResQTag Safety
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive emergency coverage before, during, and after incidents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Pillar 1: Emergency QR */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-card hover:shadow-card-hover transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emergency-50 border border-emergency-200 text-emergency-600 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-emergency-700 bg-emergency-50 px-2 py-0.5 rounded border border-emergency-200">
                  PILLAR 1: POST-ACCIDENT
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">ResQTag Emergency QR</h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When an accident victim cannot speak, physical QR stickers on helmets or vehicles allow any first responder to instantly scan, retrieve vital blood group/allergies, and 1-tap call family.
            </p>
            <button
              onClick={() => onNavigate('scan')}
              className="text-xs font-bold text-slate-900 hover:text-brand-600 flex items-center gap-1 transition-colors"
            >
              <span>Scan or View Emergency QR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2: SafeJourney */}
          <div className="bg-white border border-teal-200 rounded-2xl p-6 space-y-4 shadow-card hover:shadow-card-hover transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                <Trees className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  PILLAR 2: PROACTIVE MONITORING
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">ResQTag SafeJourney</h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Proactive safety monitoring when travelling alone in remote, forest, or mountain zones. Periodic check-in prompts ensure you are safe — failing to respond triggers automated family alerts.
            </p>
            <button
              onClick={() => setSubView('setup')}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition-colors"
            >
              <span>Start SafeJourney Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. HOW SAFEJOURNEY WORKS (LIGHT SECTION) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-safe-600" />
            <span>How SafeJourney Proactive Monitoring Works</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-bold text-slate-900">1. Configure Solo Journey</h4>
              <p className="text-slate-600 leading-relaxed">
                Select destination (Forest, Mountain, Camping, Highway), journey duration, and check-in interval (e.g. 1 hour or rapid 20s demo).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-bold text-slate-900">2. Periodic Safety Check</h4>
              <p className="text-slate-600 leading-relaxed">
                At every interval, SafeJourney prompts <strong>“Are you safe?”</strong> with 1-tap <strong>“I&apos;M SAFE”</strong> or <strong>“🆘 I NEED HELP”</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emergency-100 text-emergency-700 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-bold text-slate-900">3. Missed-Check Escalation</h4>
              <p className="text-slate-600 leading-relaxed">
                If unanswered after 10 minutes, an automated alert with last known location is sent to your registered emergency contacts.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
