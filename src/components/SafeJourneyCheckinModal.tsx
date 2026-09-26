import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SafeJourneyCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafeJourneyCheckinModal: React.FC<SafeJourneyCheckinModalProps> = ({ isOpen, onClose }) => {
  const { 
    activeJourney, 
    checkinJourney, 
    triggerJourneySos, 
    triggerJourneyMissed 
  } = useAuth();

  const isDemo = activeJourney?.isDemoMode ?? true;
  const initialSeconds = isDemo ? 20 : 600;

  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [markedSafeSuccess, setMarkedSafeSuccess] = useState(false);

  // Reset timer on open
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(initialSeconds);
      setMarkedSafeSuccess(false);
    }
  }, [isOpen, initialSeconds]);

  // Window countdown timer
  useEffect(() => {
    if (!isOpen || markedSafeSuccess) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerJourneyMissed();
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, markedSafeSuccess, triggerJourneyMissed, onClose]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleImSafe = async () => {
    setMarkedSafeSuccess(true);
    await checkinJourney(undefined, 'Confirmed safe via scheduled check-in');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleNeedHelp = async () => {
    await triggerJourneySos(undefined, 'SOS requested during scheduled check-in');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2020]/75 backdrop-blur-sm animate-in fade-in">
      <div className="glass-card-rose-solid rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden text-[#2B2020]">
        
        {/* Top subtle response window indicator */}
        <div className="bg-[#FFF7F7] border border-red-100 rounded-2xl p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#806F6F] font-medium">
            <Clock className="w-4 h-4 text-[#E53935]" />
            <span>Response Window</span>
          </div>
          <span className="font-mono font-bold text-[#E53935] bg-white px-2.5 py-0.5 rounded-lg border border-red-200">
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Content */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FFEFEF] text-[#E53935] border border-red-200 flex items-center justify-center mx-auto shadow-sm animate-pulse">
            <Bell className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E53935] font-mono">
              🔔 RESQTAG SAFETY CHECK
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2B2020]">
              Are you safe?
            </h2>
            <p className="text-xs sm:text-sm text-[#806F6F] max-w-xs mx-auto">
              Please confirm your safety. If unanswered before the timer expires, an automated alert will notify your emergency contacts.
            </p>
          </div>
        </div>

        {/* Success Confirmation State */}
        {markedSafeSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in zoom-in-95 shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-800">Check-in Confirmed</h4>
            <p className="text-xs text-emerald-700">Safety timer refreshed. Continue your journey safely.</p>
          </div>
        ) : (
          /* Two Large Focused Action Buttons */
          <div className="space-y-3">
            {/* Button 1: I'M SAFE */}
            <button
              type="button"
              onClick={handleImSafe}
              className="w-full btn-rose-safe py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5"
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>I&apos;M SAFE</span>
            </button>

            {/* Button 2: I NEED HELP */}
            <button
              type="button"
              onClick={handleNeedHelp}
              className="w-full btn-rose-sos py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5"
            >
              <ShieldAlert className="w-5 h-5 text-white" />
              <span>I NEED HELP</span>
            </button>
          </div>
        )}

        <div className="text-center text-[11px] text-[#806F6F]">
          🔒 Zero tracking • Alerts sent only upon missed check-in or SOS
        </div>
      </div>
    </div>
  );
};
