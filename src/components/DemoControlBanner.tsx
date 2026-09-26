import React from 'react';
import { Sparkles, Activity, QrCode, RefreshCw, AlertTriangle, Trees } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DemoControlBannerProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenSimulator: () => void;
}

export const DemoControlBanner: React.FC<DemoControlBannerProps> = ({ onNavigate, onOpenSimulator }) => {
  const { quickDemoLogin, resetDemo, profile, activeJourney, setCheckinPromptOpen } = useAuth();

  return (
    <aside aria-label="Hackathon quick demo controls" className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border-b border-navy-750/80 px-3 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            HACKATHON DEMO
          </span>
          <span className="text-slate-300 hidden md:inline">
            Fast-track evaluator controls:
          </span>
          {profile && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-navy-800 text-slate-300 border border-navy-700">
              Active Tag: <strong className="text-white font-mono">{profile.shortCode}</strong> ({profile.fullName})
            </span>
          )}
        </div>

        <div className="flex items-center flex-wrap gap-1.5">
          {/* Quick SafeJourney Trigger */}
          <button
            onClick={() => {
              if (activeJourney) {
                setCheckinPromptOpen(true);
              } else {
                onNavigate('safejourney');
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 transition-all font-semibold"
            title="Open or test SafeJourney proactive monitoring"
          >
            <Trees className="w-3 h-3 text-emerald-400" />
            <span>{activeJourney ? 'Trigger Check-in (SafeJourney)' : 'SafeJourney Demo'}</span>
          </button>

          <button
            onClick={async () => {
              await quickDemoLogin();
              onNavigate('dashboard');
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-navy-800 hover:bg-navy-750 text-brand-cyan border border-brand-cyan/30 hover:border-brand-cyan transition-all"
            title="Load fictional Rahul Kumar profile"
          >
            <Activity className="w-3 h-3" />
            <span>Load Profile (Rahul)</span>
          </button>

          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-emergency-600/20 hover:bg-emergency-600/30 text-emergency-500 border border-emergency-500/40 hover:border-emergency-500 transition-all font-semibold"
            title="Simulate complete accident rescue scenario"
          >
            <AlertTriangle className="w-3 h-3 text-emergency-500" />
            <span>Simulate Accident</span>
          </button>

          <button
            onClick={() => onNavigate('scan')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 hover:border-slate-500 transition-all"
            title="Open camera or enter backup code"
          >
            <QrCode className="w-3 h-3 text-slate-300" />
            <span>Scan Tag (RQ7K29)</span>
          </button>

          <button
            onClick={async () => {
              if (window.confirm('Reset fictional demo data to pristine state?')) {
                await resetDemo();
                onNavigate('landing');
              }
            }}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-navy-800 rounded transition-colors"
            title="Reset demo data"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
