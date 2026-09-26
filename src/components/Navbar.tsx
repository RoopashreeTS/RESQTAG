import React from 'react';
import { Shield, QrCode, UserPlus, LayoutDashboard, LogOut, Trees, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenSimulator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenSimulator }) => {
  const { isAuthenticated, profile, logout, quickDemoLogin, activeJourney } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => onNavigate('landing')}
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-950 font-mono">
                  RESQ<span className="text-brand-600">TAG</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.2 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 rounded">
                  EMERGENCY SYSTEM
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium leading-none">
                Emergency Identity & Proactive Safety
              </p>
            </div>
          </div>

          {/* Center Navigation for Desktop */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentView === 'landing'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Overview
            </button>

            {/* SafeJourney Link */}
            <button
              onClick={() => onNavigate('safejourney')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors relative ${
                currentView === 'safejourney'
                  ? 'bg-safe-50 text-safe-800 font-bold border border-safe-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Trees className="w-4 h-4 text-safe-600" />
              <span>SafeJourney</span>
              {activeJourney && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-safe-600"></span>
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('scan')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                currentView === 'scan' || currentView === 'emergency-profile'
                  ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <QrCode className="w-4 h-4 text-brand-600" />
              <span>Scan Tag</span>
            </button>

            <button
              onClick={onOpenSimulator}
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-emergency-700 hover:bg-emergency-50 transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4 text-emergency-600" />
              <span>Incident Simulator</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('safejourney')}
              className="sm:hidden p-2 rounded-lg bg-safe-50 text-safe-700 border border-safe-200 flex items-center justify-center"
              title="SafeJourney"
            >
              <Trees className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('scan')}
              className="sm:hidden p-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center"
              title="Scan Tag"
            >
              <QrCode className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    currentView === 'dashboard'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                  {profile && (
                    <span className="px-1.5 py-0.5 bg-slate-900 text-white rounded text-[10px] font-mono">
                      {profile.shortCode}
                    </span>
                  )}
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => quickDemoLogin().then(() => onNavigate('dashboard'))}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
                >
                  ⚡ Demo Login
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
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
