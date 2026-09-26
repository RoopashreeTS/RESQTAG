import React from 'react';
import { Shield, QrCode, UserPlus, LayoutDashboard, LogOut, Flame, Trees } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenSimulator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenSimulator }) => {
  const { isAuthenticated, profile, logout, quickDemoLogin, activeJourney } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-navy-900/90 backdrop-blur-md border-b border-navy-750">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('landing')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emergency-600 to-emergency-700 shadow-glow-red text-white">
              <Shield className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emergency-glow opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emergency-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider text-white font-mono">
                  RESQ<span className="text-emergency-500">TAG</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-navy-800 text-brand-cyan border border-navy-700 rounded-full">
                  24/7 SOS
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 font-medium leading-none">
                Emergency Identity & Proactive Safety
              </p>
            </div>
          </div>

          {/* Center Navigation for Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'landing'
                  ? 'bg-navy-800 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800/50'
              }`}
            >
              Overview
            </button>

            {/* SafeJourney Link */}
            <button
              onClick={() => onNavigate('safejourney')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors relative ${
                currentView === 'safejourney'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800/50'
              }`}
            >
              <Trees className="w-4 h-4 text-emerald-400" />
              <span>SafeJourney</span>
              {activeJourney && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('scan')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentView === 'scan' || currentView === 'emergency-profile'
                  ? 'bg-emergency-600/20 text-emergency-500 border border-emergency-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800/50'
              }`}
            >
              <QrCode className="w-4 h-4 text-emergency-500" />
              Scan ResQTag
            </button>

            <button
              onClick={onOpenSimulator}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-amber-400 hover:bg-amber-400/10 transition-colors flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              Simulate Incident
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('safejourney')}
              className="sm:hidden p-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center"
              title="SafeJourney"
            >
              <Trees className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('scan')}
              className="sm:hidden p-2 rounded-lg bg-emergency-600 text-white shadow-sm flex items-center justify-center"
              title="Scan ResQTag"
            >
              <QrCode className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    currentView === 'dashboard'
                      ? 'bg-brand-blue text-white shadow-glow-blue'
                      : 'bg-navy-800 text-slate-200 hover:bg-navy-750 border border-navy-700'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-cyan" />
                  <span className="hidden sm:inline">Dashboard</span>
                  {profile && (
                    <span className="px-1.5 py-0.2 bg-navy-950 text-brand-cyan rounded text-xs font-mono font-bold">
                      {profile.shortCode}
                    </span>
                  )}
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-navy-800 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => quickDemoLogin().then(() => onNavigate('dashboard'))}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-navy-800 text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 transition-colors"
                >
                  ⚡ Try Demo
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-emergency-600 to-emergency-700 text-white shadow-md hover:shadow-glow-red hover:brightness-110 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
