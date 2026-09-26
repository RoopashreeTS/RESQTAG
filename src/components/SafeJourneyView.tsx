import React, { useState } from 'react';
import { 
  Trees, 
  ShieldCheck, 
  ArrowRight, 
  History, 
  QrCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SafeJourneySetupWizard } from './SafeJourneySetupWizard';
import { SafeJourneyActiveDashboard } from './SafeJourneyActiveDashboard';
import { SafeJourneyHistoryView } from './SafeJourneyHistoryView';

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-20">
      {/* 1. HERO SECTION */}
      <div className="relative bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border-2 border-emerald-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden space-y-6">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <Trees className="w-4 h-4" />
            <span>PROACTIVE SAFETY MONITORING</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            ResQTag <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">SafeJourney</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
            Stay connected. Check in. Get help when you need it.
          </p>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Proactive safety check-in schedule designed for solo hikers, remote campers, forest trekkers, and highway travellers. If a scheduled check-in is missed, your trusted emergency contacts are automatically alerted.
          </p>

          {/* Big Start Button */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setSubView('setup')}
              className="px-8 py-4 rounded-2xl font-black text-base bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:brightness-110 text-white shadow-glow-blue hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2.5"
            >
              <Trees className="w-5 h-5" />
              <span>START SAFEJOURNEY</span>
            </button>

            <button
              onClick={() => setSubView('history')}
              className="px-6 py-4 rounded-2xl font-bold text-sm bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 hover:border-slate-500 transition-colors flex items-center justify-center gap-2"
            >
              <History className="w-4 h-4 text-emerald-400" />
              <span>View Journey History</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. THE TWO CONNECTED RESQTAG SAFETY PILLARS */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Two Connected Pillars of ResQTag Safety
          </h2>
          <p className="text-xs text-slate-400">
            Comprehensive emergency coverage before, during, and after incidents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1: Emergency QR */}
          <div className="bg-navy-900 border border-navy-750 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emergency-600 text-white flex items-center justify-center shadow-glow-red">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-emergency-500 bg-emergency-500/10 px-2 py-0.5 rounded border border-emergency-500/20">
                  PILLAR 1: POST-ACCIDENT
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">ResQTag Emergency QR</h3>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When an accident victim cannot speak, physical QR stickers on helmets or vehicles allow any first responder to instantly scan, retrieve vital blood group/allergies, and 1-tap call family.
            </p>
            <button
              onClick={() => onNavigate('scan')}
              className="text-xs font-bold text-emergency-500 hover:underline flex items-center gap-1"
            >
              <span>Scan or View Emergency QR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2: SafeJourney */}
          <div className="bg-navy-900 border-2 border-emerald-500/40 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-glow-blue">
                <Trees className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  PILLAR 2: PROACTIVE MONITORING
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">ResQTag SafeJourney</h3>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Proactive safety monitoring when travelling alone in remote, forest, or mountain zones. Periodic check-in prompts ensure you are safe — failing to respond triggers automated family alerts.
            </p>
            <button
              onClick={() => setSubView('setup')}
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Start SafeJourney Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. HOW SAFEJOURNEY WORKS */}
      <div className="bg-navy-900 border border-navy-750 rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>How SafeJourney Proactive Monitoring Works</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-bold text-white">1. Configure Solo Journey</h4>
            <p className="text-slate-300 leading-relaxed">
              Select destination (Forest, Mountain, Camping, Highway), journey duration, and check-in interval (e.g. 1 hour).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-bold text-white">2. Periodic Safety Check</h4>
            <p className="text-slate-300 leading-relaxed">
              At every interval, SafeJourney prompts <strong>“Are you safe?”</strong> with 1-tap <strong>“I&apos;M SAFE”</strong> or <strong>“🆘 I NEED HELP”</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emergency-600/20 text-emergency-500 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-bold text-white">3. Missed-Check Escalation</h4>
            <p className="text-slate-300 leading-relaxed">
              If unanswered after 10 minutes, an automated alert with last known location is sent to your registered emergency contacts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
