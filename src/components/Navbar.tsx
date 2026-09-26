import React from 'react';
import { Shield, QrCode, UserPlus, LayoutDashboard, LogOut, Trees } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { isAuthenticated, profile, logout, activeJourney } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-red-100 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => onNavigate('landing')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E53935] to-[#FF6B6B] text-white flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-[#2B2020] font-mono">
                  RESQ<span className="text-[#E53935]">TAG</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-[#C62828] border border-red-100 rounded">
                  EMERGENCY SYSTEM
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-[#806F6F] font-medium leading-none">
                Emergency Identity & Proactive Safety
              </p>
            </div>
          </div>

          {/* Center Navigation for Desktop */}
          <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                currentView === 'landing'
                  ? 'bg-rose-100/70 text-[#C62828] font-bold shadow-sm'
                  : 'text-[#806F6F] hover:text-[#2B2020] hover:bg-white/60 nav-link-rose'
              }`}
            >
              Overview
            </button>

            {/* SafeJourney Link */}
            <button
              onClick={() => onNavigate('safejourney')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all relative ${
                currentView === 'safejourney'
                  ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200 shadow-sm'
                  : 'text-[#806F6F] hover:text-[#2B2020] hover:bg-white/60 nav-link-rose'
              }`}
            >
              <Trees className="w-4 h-4 text-teal-600" />
              <span>SafeJourney</span>
              {activeJourney && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('scan')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                currentView === 'scan' || currentView === 'emergency-profile'
                  ? 'bg-rose-100/70 text-[#C62828] font-bold border border-red-200 shadow-sm'
                  : 'text-[#806F6F] hover:text-[#2B2020] hover:bg-white/60 nav-link-rose'
              }`}
            >
              <QrCode className="w-4 h-4 text-[#E53935]" />
              <span>Scan Tag</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('safejourney')}
              className="sm:hidden p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              title="SafeJourney"
            >
              <Trees className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('scan')}
              className="sm:hidden p-2 rounded-xl bg-rose-50 text-[#E53935] border border-red-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
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
                      ? 'btn-rose-primary text-white shadow-md'
                      : 'btn-rose-outline text-[#2B2020]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                  {profile && (
                    <span className="px-1.5 py-0.5 bg-rose-100 text-[#C62828] rounded text-[10px] font-mono font-bold">
                      {profile.shortCode}
                    </span>
                  )}
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-[#806F6F] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all hover:scale-105 active:scale-95"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('register')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold btn-rose-primary shadow-sm"
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
