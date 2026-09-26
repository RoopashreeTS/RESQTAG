import React, { useState, useEffect } from 'react';
import { 
  Trees, 
  Mountain, 
  Tent, 
  Compass, 
  Car, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  StopCircle, 
  Sparkles, 
  Heart,
  Navigation,
  History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { SafeJourney, JourneyCheckin } from '../types';
import { api } from '../services/api';

interface SafeJourneyActiveDashboardProps {
  journey: SafeJourney;
  onOpenCheckinPrompt: () => void;
  onOpenHistory: () => void;
}

export const SafeJourneyActiveDashboard: React.FC<SafeJourneyActiveDashboardProps> = ({
  journey,
  onOpenCheckinPrompt,
  onOpenHistory,
}) => {
  const { 
    checkinJourney, 
    triggerJourneySos, 
    endJourney 
  } = useAuth();

  const [checkins, setCheckins] = useState<JourneyCheckin[]>([]);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Countdown timer for next safety check
  const [secondsUntilNextCheck, setSecondsUntilNextCheck] = useState<number>(() => {
    const nextTime = new Date(journey.nextCheckinTime).getTime();
    const diff = Math.max(0, Math.floor((nextTime - Date.now()) / 1000));
    return diff || (journey.isDemoMode ? 20 : 3600);
  });

  // Fetch checkin history
  useEffect(() => {
    let isMounted = true;
    const loadCheckins = async () => {
      const res = await api.getActiveSafeJourney();
      if (res.success && res.checkins && isMounted) {
        setCheckins(res.checkins);
      }
    };
    loadCheckins();
    return () => { isMounted = false; };
  }, [journey.totalCheckins, journey.lastCheckinTime]);

  // Live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const nextTime = new Date(journey.nextCheckinTime).getTime();
      const diff = Math.floor((nextTime - Date.now()) / 1000);

      if (diff <= 0) {
        setSecondsUntilNextCheck(0);
        // Automatically pop up check-in modal when scheduled time arrives!
        onOpenCheckinPrompt();
      } else {
        setSecondsUntilNextCheck(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [journey.nextCheckinTime, onOpenCheckinPrompt]);

  const handleManualCheckin = async () => {
    setIsProcessing(true);
    const success = await checkinJourney();
    if (success) {
      setSuccessToast("✓ You're marked safe.");
      setTimeout(() => setSuccessToast(null), 3000);
    }
    setIsProcessing(false);
  };

  const handleManualSos = async () => {
    if (window.confirm('Send immediate emergency assistance alert to registered emergency contacts?')) {
      setIsProcessing(true);
      await triggerJourneySos(undefined, 'User pressed 🆘 I NEED HELP from SafeJourney Active Dashboard');
      setIsProcessing(false);
    }
  };

  const handleConfirmEndJourney = async () => {
    setIsProcessing(true);
    await endJourney();
    setIsProcessing(false);
    setShowEndConfirm(false);
  };

  // Format remaining countdown
  const mins = Math.floor(secondsUntilNextCheck / 60);
  const secs = secondsUntilNextCheck % 60;
  const countdownFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const renderDestinationIcon = () => {
    switch (journey.destinationType) {
      case 'Forest / Trekking Area': return <Trees className="w-5 h-5 text-emerald-400" />;
      case 'Hill / Mountain Area': return <Mountain className="w-5 h-5 text-brand-cyan" />;
      case 'Camping Area': return <Tent className="w-5 h-5 text-amber-400" />;
      case 'Remote / Isolated Area': return <Compass className="w-5 h-5 text-emergency-500" />;
      case 'Long-Distance Travel': return <Car className="w-5 h-5 text-blue-400" />;
      default: return <MapPin className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Toast banner */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* TOP ACTIVE STATUS HEADER */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-750 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              {renderDestinationIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                  🟢 Journey Status: Active
                </span>
                {journey.isDemoMode && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    ⚡ DEMO MODE
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                {journey.destinationType}
              </h1>
              {journey.customDestination && (
                <p className="text-xs text-slate-300">{journey.customDestination}</p>
              )}
            </div>
          </div>

          {/* End Journey Button */}
          <button
            onClick={() => setShowEndConfirm(true)}
            className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-rose-950/40 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <StopCircle className="w-4 h-4" />
            <span>🛑 END JOURNEY</span>
          </button>
        </div>

        {/* 8-STAT METRICS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* 1. Journey Type */}
          <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">🌲 Destination</span>
            <div className="text-xs font-bold text-white truncate">{journey.destinationType}</div>
          </div>

          {/* 2. Travelling Alone */}
          <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">👤 Travelling</span>
            <div className="text-xs font-bold text-emerald-400">
              {journey.isSolo ? 'Alone (Solo)' : 'With Group'}
            </div>
          </div>

          {/* 3. Journey Started */}
          <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">🕐 Started</span>
            <div className="text-xs font-mono text-white">
              {new Date(journey.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* 4. Expected Return */}
          <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">🏁 Expected Return</span>
            <div className="text-xs font-mono text-white">
              {new Date(journey.expectedEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* 5. Check-in Interval */}
          <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">⏱️ Interval</span>
            <div className="text-xs font-bold text-amber-300">
              {journey.isDemoMode
                ? `${journey.demoIntervalSeconds || 20}s (Demo)`
                : `Every ${journey.intervalMinutes}m`}
            </div>
          </div>

          {/* 6. Last Check-in */}
          <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">✅ Last Check-in</span>
            <div className="text-xs font-mono text-emerald-400">
              {journey.lastCheckinTime
                ? new Date(journey.lastCheckinTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Just Started'}
            </div>
          </div>

          {/* 7. Next Safety Check (Live Countdown) */}
          <div className="p-3.5 rounded-xl bg-navy-850 border border-amber-500/50 space-y-1 sm:col-span-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-amber-400">🔔 Next Safety Check</span>
              <span className="text-[10px] text-slate-400">Automated</span>
            </div>
            <div className="text-xl font-black font-mono text-amber-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" />
              <span>{countdownFormatted}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Button 1: I'M SAFE */}
          <button
            type="button"
            onClick={handleManualCheckin}
            disabled={isProcessing}
            className="py-4 px-6 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:brightness-110 text-white shadow-glow-blue flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>🟢 I&apos;M SAFE (Check-in Now)</span>
          </button>

          {/* Button 2: I NEED HELP */}
          <button
            type="button"
            onClick={handleManualSos}
            disabled={isProcessing}
            className="py-4 px-6 rounded-2xl font-black text-sm bg-gradient-to-r from-emergency-600 to-emergency-700 hover:bg-emergency-500 text-white shadow-glow-red flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>🆘 I NEED HELP (Emergency SOS)</span>
          </button>
        </div>

        {/* Explanatory subtitle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
          <p>🔔 Your next safety check will appear at the scheduled time.</p>
          {/* Hackathon Judge Accelerator Trigger */}
          <button
            type="button"
            onClick={onOpenCheckinPrompt}
            className="text-amber-400 hover:underline font-bold flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ Test Safety Check Prompt Now</span>
          </button>
        </div>
      </div>

      {/* LOCATION & EMERGENCY CONTACTS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Consent-based Location Status */}
        <div className="bg-navy-900 border border-navy-750 rounded-2xl p-5 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-brand-cyan" />
            Location Consent Status
          </span>
          <p className="text-slate-200 font-medium">
            {journey.lastLocation?.text || journey.lastLocation?.status || 'Location unavailable — permission was not granted.'}
          </p>
          <p className="text-[10px] text-slate-400">
            🔒 Location is never silently tracked. Only the latest successfully permitted coordinate is stored.
          </p>
        </div>

        {/* Emergency Contacts on file */}
        <div className="bg-navy-900 border border-navy-750 rounded-2xl p-5 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-emergency-500" />
            Notified Trusted Contacts
          </span>
          <div className="flex flex-wrap gap-1.5">
            {journey.emergencyContacts.map((c, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-navy-800 text-slate-200 border border-navy-700 font-mono text-[11px]">
                {c.name} ({c.relationship})
              </span>
            ))}
          </div>
          <p className="text-[10px] text-slate-400">
            Contacts receive simulated SMS alerts if a scheduled check is missed for 10 minutes.
          </p>
        </div>
      </div>

      {/* CHECK-IN LOG TABLE */}
      <div className="bg-navy-900 border border-navy-750 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Active Journey Check-in Log</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenHistory}
              className="text-xs text-brand-cyan hover:underline flex items-center gap-1 font-semibold"
            >
              <History className="w-3.5 h-3.5" />
              <span>Past Journeys</span>
            </button>
            <span className="text-xs font-mono text-slate-400">
              {checkins.length} Recorded Check-ins
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          {checkins.map((chk, i) => (
            <div
              key={chk.id || i}
              className="p-3 rounded-xl bg-navy-850 border border-navy-750 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-white">
                  {new Date(chk.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-slate-300">{chk.notes || 'Marked Safe'}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                ✓ SAFE
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CONFIRMATION MODAL FOR END JOURNEY */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-navy-900 border-2 border-slate-700 rounded-3xl max-w-sm w-full p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-navy-800 text-rose-400 border border-navy-700 flex items-center justify-center mx-auto">
              <StopCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              End this SafeJourney?
            </h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to end this SafeJourney? Future safety checks and missed-check alerts will stop immediately.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-navy-800 text-slate-300 text-xs font-semibold"
              >
                Continue Journey
              </button>
              <button
                type="button"
                onClick={handleConfirmEndJourney}
                className="flex-1 py-2.5 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-white text-xs font-bold shadow-glow-red"
              >
                End Journey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
