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

  // 10-minute response window (Accelerated for hackathon demo: 20 seconds in demo mode, or 600s in production)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden text-slate-900">
        
        {/* Top subtle response window indicator */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Clock className="w-4 h-4 text-brand-600" />
            <span>Response Window</span>
          </div>
          <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Content */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center mx-auto shadow-sm">
            <Bell className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              🔔 RESQTAG SAFETY CHECK
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              Are you safe?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto">
              Please confirm your safety. If unanswered before the timer expires, an automated alert will notify your emergency contacts.
            </p>
          </div>
        </div>

        {/* Success Confirmation State */}
        {markedSafeSuccess ? (
          <div className="p-4 rounded-2xl bg-safe-50 border border-safe-200 text-center space-y-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-8 h-8 text-safe-600 mx-auto" />
            <h4 className="text-sm font-bold text-safe-800">Check-in Confirmed</h4>
            <p className="text-xs text-safe-700">Safety timer refreshed. Continue your journey safely.</p>
          </div>
        ) : (
          /* Two Large Focused Action Buttons */
          <div className="space-y-3">
            {/* Button 1: I'M SAFE */}
            <button
              type="button"
              onClick={handleImSafe}
              className="w-full py-4 px-6 rounded-2xl font-bold text-base bg-safe-600 hover:bg-safe-500 text-white shadow-glow-green flex items-center justify-center gap-2.5 transition-all duration-250 hover:-translate-y-0.5 active:scale-[0.97]"
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>I&apos;M SAFE</span>
            </button>

            {/* Button 2: I NEED HELP */}
            <button
              type="button"
              onClick={handleNeedHelp}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-emergency-600 hover:bg-emergency-500 text-white shadow-glow-red animate-pulse-emergency flex items-center justify-center gap-2.5 transition-all duration-250 hover:-translate-y-0.5 active:scale-[0.97]"
            >
              <ShieldAlert className="w-5 h-5 text-white" />
              <span>I NEED HELP</span>
            </button>
          </div>
        )}

        <div className="text-center text-[11px] text-slate-500">
          🔒 Zero tracking • Alerts sent only upon missed check-in or SOS
        </div>
      </div>
    </div>
  );
};
