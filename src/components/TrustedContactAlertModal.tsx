import React from 'react';
import { MapPin, Clock, X, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TrustedContactAlertModal: React.FC = () => {
  const { activeNotification, dismissNotification } = useAuth();

  if (!activeNotification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full px-4 animate-in slide-in-from-bottom-5 duration-300 text-slate-900">
      <div className="bg-white border-2 border-emergency-600 rounded-3xl p-5 shadow-2xl space-y-3 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emergency-50 text-emergency-600 border border-emergency-200 flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-emergency-700 bg-emergency-50 px-2 py-0.5 rounded border border-emergency-200">
                SIMULATED SMS ALERT
              </span>
              <h4 className="text-sm font-bold text-slate-950 mt-0.5">
                {activeNotification.title}
              </h4>
            </div>
          </div>

          <button
            onClick={dismissNotification}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message body */}
        <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200 font-mono">
          {activeNotification.message}
        </p>

        {/* Location & Time details */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span>{activeNotification.approxLocation || activeNotification.locationStatus}</span>
          </span>
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(activeNotification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </span>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={dismissNotification}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-colors"
          >
            Acknowledge Alert
          </button>
        </div>
      </div>
    </div>
  );
};
