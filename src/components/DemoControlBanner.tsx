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
    <aside aria-label="Hackathon quick demo controls" className="bg-[#2B2020] border-b border-red-900/40 text-rose-100 px-3 py-1.5 text-xs no-print relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30 text-[11px]">
            <Sparkles className="w-3 h-3 text-[#FF6B6B]" />
            HACKATHON DEMO
          </span>
          <span className="text-rose-200/70 hidden md:inline text-[11px]">
            Fast-track evaluator controls:
          </span>
          {profile && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-lg bg-white/10 text-rose-100 border border-white/10 font-mono text-[11px]">
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
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 transition-all hover:-translate-y-0.5 text-[11px] font-medium"
            title="Open or test SafeJourney proactive monitoring"
          >
            <Trees className="w-3 h-3 text-emerald-400" />
            <span>{activeJourney ? 'Trigger Safe Check' : 'SafeJourney Demo'}</span>
          </button>

          <button
            onClick={async () => {
              await quickDemoLogin();
              onNavigate('dashboard');
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 hover:border-red-600 transition-all hover:-translate-y-0.5 text-[11px] font-medium"
            title="Load fictional Rahul Kumar profile"
          >
            <Activity className="w-3 h-3 text-red-400" />
            <span>Load Profile</span>
          </button>

          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-all hover:-translate-y-0.5 shadow-sm text-[11px]"
            title="Simulate complete accident rescue scenario"
          >
            <AlertTriangle className="w-3 h-3 text-white" />
            <span>Simulate Accident</span>
          </button>

          <button
            onClick={() => onNavigate('scan')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-rose-100 border border-white/20 transition-all hover:-translate-y-0.5 text-[11px]"
            title="Open camera or enter backup code"
          >
            <QrCode className="w-3 h-3 text-red-300" />
            <span>Scan (RQ7K29)</span>
          </button>

          <button
            onClick={async () => {
              if (window.confirm('Reset fictional demo data to pristine state?')) {
                await resetDemo();
                onNavigate('landing');
              }
            }}
            className="p-1 text-rose-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Reset demo data"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
