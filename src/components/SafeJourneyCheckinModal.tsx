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
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(initialSeconds);
      setMarkedSafeSuccess(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // 10-minute timeout expired without response -> Trigger missed check-in alert!
          triggerJourneyMissed();
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, initialSeconds, triggerJourneyMissed, onClose]);

  if (!isOpen || !activeJourney) return null;

  const handleMarkSafe = async () => {
    setIsProcessing(true);
    const success = await checkinJourney();
    if (success) {
      setMarkedSafeSuccess(true);
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 1500);
    } else {
      setIsProcessing(false);
    }
  };

  const handleNeedHelp = async () => {
    setIsProcessing(true);
    await triggerJourneySos(undefined, 'User pressed 🆘 I NEED HELP on Safety Check Modal');
    setIsProcessing(false);
    onClose();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedCountdown = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-gradient-to-b from-navy-900 to-navy-950 border-4 border-amber-500 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-center">
        {/* Glowing emergency ring */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center mx-auto shadow-glow-blue">
          <Bell className="w-8 h-8 animate-bounce" />
        </div>

        {markedSafeSuccess ? (
          <div className="py-6 space-y-3 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-white">✓ You&apos;re marked safe.</h3>
            <p className="text-xs text-slate-300">Next safety check scheduled automatically.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                🔔 RESQTAG SAFETY CHECK
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white pt-1">
                Are you safe?
              </h2>
              <p className="text-xs text-slate-300">
                Scheduled check-in for <strong className="text-white">{activeJourney.destinationType}</strong>
              </p>
            </div>

            {/* Response Window Countdown */}
            <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 space-y-1">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Safety check sent. Waiting for response…</span>
              </div>
              <div className="text-2xl font-black font-mono text-amber-300">
                {formattedCountdown}
              </div>
              <p className="text-[10px] text-slate-400">
                {isDemo
                  ? '⚡ Demo Response Window (20s accelerated countdown)'
                  : 'Response Window: 10 Minutes before emergency alert is triggered'}
              </p>
            </div>

            {/* The Two Main Action Buttons */}
            <div className="space-y-3 pt-2">
              {/* Button 1: I'M SAFE */}
              <button
                type="button"
                onClick={handleMarkSafe}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl font-black text-base bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:brightness-110 text-white shadow-glow-blue active:scale-95 transition-all flex items-center justify-center gap-2.5"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>🟢 I&apos;M SAFE</span>
              </button>

              {/* Button 2: I NEED HELP */}
              <button
                type="button"
                onClick={handleNeedHelp}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-emergency-600 to-emergency-700 hover:bg-emergency-500 text-white shadow-glow-red active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>🆘 I NEED HELP</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              * If you do not respond before the timer expires, an automated alert will notify your registered emergency contacts.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
