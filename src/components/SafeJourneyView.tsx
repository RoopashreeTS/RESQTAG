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
    <div className="space-y-12 pb-24 text-[#2B2020] relative z-10">
      
      {/* 1. ANIMATED SAFEJOURNEY HERO SECTION */}
      <section className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card-rose-solid rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-300 text-xs font-bold">
                <Compass className="w-3.5 h-3.5 text-emerald-700" />
                <span>PROACTIVE SAFETY MONITORING</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-[#2B2020] tracking-tight">
                ResQTag <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E53935] to-[#FF6B6B]">SafeJourney</span>
              </h1>

              <p className="text-base sm:text-xl text-[#2B2020] font-semibold">
                Stay connected. Check in. Get help when you need it.
              </p>

              <p className="text-xs sm:text-sm text-[#806F6F] leading-relaxed max-w-2xl">
                Proactive safety check-in schedule designed for solo hikers, remote campers, forest trekkers, and highway travellers. If a scheduled check-in is missed, your trusted emergency contacts are automatically alerted with your last recorded location.
              </p>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => setSubView('setup')}
                  className="btn-rose-safe px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5"
                >
                  <Trees className="w-4 h-4 text-white" />
                  <span>START SAFEJOURNEY</span>
                </button>

                <button
                  onClick={() => setSubView('history')}
                  className="btn-rose-outline px-6 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <History className="w-4 h-4 text-[#E53935]" />
                  <span>View Past Journeys</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE TWO CONNECTED RESQTAG SAFETY PILLARS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E53935] bg-[#FFEFEF] px-3 py-1 rounded-full border border-red-200">
            System Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#2B2020] mt-2">
            Two Connected Pillars of ResQTag Safety
          </h2>
          <p className="text-xs text-[#806F6F]">
            Comprehensive emergency coverage before, during, and after incidents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Pillar 1: Emergency QR */}
          <div className="glass-card-rose rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg hover:border-red-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFEFEF] border border-red-200 text-[#E53935] flex items-center justify-center shadow-sm">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-[#E53935] bg-[#FFEFEF] px-2.5 py-0.5 rounded-lg border border-red-200">
                  PILLAR 1: POST-ACCIDENT
                </span>
                <h3 className="text-base font-bold text-[#2B2020] mt-1">ResQTag Emergency QR</h3>
              </div>
            </div>
            <p className="text-xs text-[#806F6F] leading-relaxed">
              When an accident victim cannot speak, physical QR stickers on helmets or vehicles allow any first responder to instantly scan, retrieve vital blood group/allergies, and 1-tap call family.
            </p>
            <button
              onClick={() => onNavigate('scan')}
              className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1 transition-colors"
            >
              <span>Scan or View Emergency QR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2: SafeJourney */}
          <div className="glass-card-rose rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg hover:border-emerald-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-sm">
                <Trees className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  PILLAR 2: PROACTIVE MONITORING
                </span>
                <h3 className="text-base font-bold text-[#2B2020] mt-1">ResQTag SafeJourney</h3>
              </div>
            </div>
            <p className="text-xs text-[#806F6F] leading-relaxed">
              Proactive safety monitoring when travelling alone in remote, forest, or mountain zones. Periodic check-in prompts ensure you are safe — failing to respond triggers automated family alerts.
            </p>
            <button
              onClick={() => setSubView('setup')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 transition-colors"
            >
              <span>Start SafeJourney Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. HOW SAFEJOURNEY WORKS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card-rose-solid rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h3 className="text-lg font-bold text-[#2B2020] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>How SafeJourney Proactive Monitoring Works</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-white/80 border border-red-100 space-y-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-[#E53935] flex items-center justify-center font-black text-sm">
                1
              </div>
              <h4 className="font-bold text-[#2B2020]">1. Configure Solo Journey</h4>
              <p className="text-[#806F6F] leading-relaxed">
                Select destination (Forest, Mountain, Camping, Highway), journey duration, and check-in interval (e.g. 1 hour or rapid 20s demo).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/80 border border-emerald-100 space-y-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                2
              </div>
              <h4 className="font-bold text-[#2B2020]">2. Periodic Safety Check</h4>
              <p className="text-[#806F6F] leading-relaxed">
                At every interval, SafeJourney prompts <strong>“Are you safe?”</strong> with 1-tap <strong>“I&apos;M SAFE”</strong> or <strong>“🆘 I NEED HELP”</strong>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/80 border border-red-100 space-y-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-[#E53935] flex items-center justify-center font-black text-sm">
                3
              </div>
              <h4 className="font-bold text-[#2B2020]">3. Missed-Check Escalation</h4>
              <p className="text-[#806F6F] leading-relaxed">
                If unanswered after response window, an automated alert with last known location is sent to your registered emergency contacts.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
