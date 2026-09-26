import React from 'react';
import { MapPin, Clock, X, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TrustedContactAlertModal: React.FC = () => {
  const { activeNotification, dismissNotification } = useAuth();

  if (!activeNotification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full px-4 animate-in slide-in-from-bottom-5 duration-300 text-[#2B2020]">
      <div className="glass-card-rose-solid border-2 border-[#E53935] rounded-3xl p-5 shadow-2xl space-y-3 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#FFEFEF] text-[#E53935] border border-red-200 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-wider uppercase text-[#C62828] bg-[#FFEFEF] px-2.5 py-0.5 rounded-lg border border-red-200">
                EMERGENCY SMS NOTIFICATION
              </span>
              <h4 className="text-sm font-bold text-[#2B2020] mt-0.5">
                {activeNotification.title}
              </h4>
            </div>
          </div>

          <button
            onClick={dismissNotification}
            className="text-[#806F6F] hover:text-[#2B2020] p-1 rounded-lg hover:bg-[#FFEFEF] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message body */}
        <p className="text-xs text-[#2B2020] leading-relaxed bg-white/90 p-3.5 rounded-2xl border border-red-100 font-mono shadow-sm">
          {activeNotification.message}
        </p>

        {/* Location & Time details */}
        <div className="flex items-center justify-between text-[11px] text-[#806F6F] pt-1">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#E53935]" />
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
            className="btn-rose-primary px-4 py-2 rounded-xl text-xs font-bold"
          >
            Acknowledge Alert
          </button>
        </div>
      </div>
    </div>
  );
};
