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
    <aside aria-label="Hackathon quick demo controls" className="bg-slate-900 border-b border-slate-800 text-slate-200 px-3 py-1.5 text-xs no-print">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 font-bold border border-amber-400/20 text-[11px]">
            <Sparkles className="w-3 h-3" />
            HACKATHON DEMO
          </span>
          <span className="text-slate-400 hidden md:inline text-[11px]">
            Fast-track evaluator controls:
          </span>
          {profile && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[11px]">
              Active Tag: <strong className="text-white">{profile.shortCode}</strong> ({profile.fullName})
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
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-safe-900/50 hover:bg-safe-900 text-safe-300 border border-safe-700/50 hover:border-safe-500 transition-colors text-[11px] font-medium"
            title="Open or test SafeJourney proactive monitoring"
          >
            <Trees className="w-3 h-3 text-safe-400" />
            <span>{activeJourney ? 'Trigger Safe Check' : 'SafeJourney Demo'}</span>
          </button>

          <button
            onClick={async () => {
              await quickDemoLogin();
              onNavigate('dashboard');
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-brand-950 hover:bg-brand-900 text-brand-300 border border-brand-800 hover:border-brand-600 transition-colors text-[11px] font-medium"
            title="Load fictional Rahul Kumar profile"
          >
            <Activity className="w-3 h-3 text-brand-400" />
            <span>Load Profile</span>
          </button>

          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-emergency-950 hover:bg-emergency-900 text-emergency-300 border border-emergency-800 hover:border-emergency-600 transition-colors text-[11px] font-medium"
            title="Simulate complete accident rescue scenario"
          >
            <AlertTriangle className="w-3 h-3 text-emergency-400" />
            <span>Simulate Accident</span>
          </button>

          <button
            onClick={() => onNavigate('scan')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors text-[11px]"
            title="Open camera or enter backup code"
          >
            <QrCode className="w-3 h-3 text-slate-400" />
            <span>Scan (RQ7K29)</span>
          </button>

          <button
            onClick={async () => {
              if (window.confirm('Reset fictional demo data to pristine state?')) {
                await resetDemo();
                onNavigate('landing');
              }
            }}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Reset demo data"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
