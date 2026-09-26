import React from 'react';
import { MapPin, Clock, X, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TrustedContactAlertModal: React.FC = () => {
  const { activeNotification, dismissNotification } = useAuth();

  if (!activeNotification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full px-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-gradient-to-br from-navy-900 to-navy-950 border-2 border-emergency-500 rounded-2xl p-5 shadow-2xl space-y-3 relative overflow-hidden">
        {/* Top pulse accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emergency-600 via-amber-400 to-emergency-600 animate-pulse" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emergency-600 text-white flex items-center justify-center shrink-0 shadow-glow-red">
              <Radio className="w-4 h-4 animate-ping" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-emergency-500 bg-emergency-500/10 px-2 py-0.5 rounded border border-emergency-500/20">
                SIMULATED FAMILY SMS ALERT
              </span>
              <h4 className="text-sm font-black text-white mt-0.5">
                {activeNotification.title}
              </h4>
            </div>
          </div>

          <button
            onClick={dismissNotification}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message body */}
        <p className="text-xs text-slate-200 leading-relaxed bg-navy-850 p-3 rounded-xl border border-navy-750 font-mono">
          {activeNotification.message}
        </p>

        {/* Location & Time details */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emergency-500" />
            <span>{activeNotification.approxLocation || activeNotification.locationStatus}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(activeNotification.timestamp).toLocaleTimeString()}</span>
          </span>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={dismissNotification}
            className="px-4 py-1.5 rounded-lg bg-emergency-600 hover:bg-emergency-500 text-white text-xs font-bold shadow-sm transition-colors"
          >
            Acknowledge Alert
          </button>
        </div>
      </div>
    </div>
  );
};
