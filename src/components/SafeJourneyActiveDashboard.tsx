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
  History,
  User,
  Users
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

  // Fetch checkins
  useEffect(() => {
    const fetchCheckins = async () => {
      try {
        const data = await api.getSafeJourneyCheckins(journey.id);
        setCheckins(data);
      } catch (e) {
        console.error('Error loading checkins:', e);
      }
    };
    fetchCheckins();
  }, [journey.id, journey.lastCheckinTime]);

  // Live countdown ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsUntilNextCheck((prev) => {
        if (prev <= 1) {
          return journey.isDemoMode ? 20 : journey.intervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [journey.intervalMinutes, journey.isDemoMode]);

  // Format seconds to mm:ss
  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleManualCheckin = async () => {
    setIsProcessing(true);
    try {
      await checkinJourney(undefined, 'Manual check-in from dashboard');
      setSuccessToast('✓ Check-in recorded. Safety timer refreshed.');
      setTimeout(() => setSuccessToast(null), 4000);
      setSecondsUntilNextCheck(journey.isDemoMode ? 20 : journey.intervalMinutes * 60);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSos = async () => {
    if (window.confirm('Trigger immediate emergency alert to your trusted contacts?')) {
      setIsProcessing(true);
      try {
        await triggerJourneySos(undefined, 'Manual SOS triggered from SafeJourney dashboard');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleConfirmEndJourney = async () => {
    setIsProcessing(true);
    try {
      await endJourney();
      setShowEndConfirm(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderDestinationIcon = () => {
    switch (journey.destinationType) {
      case 'Forest / Trekking Area': return <Trees className="w-5 h-5 text-safe-700" />;
      case 'Hill / Mountain Area': return <Mountain className="w-5 h-5 text-brand-600" />;
      case 'Camping Area': return <Tent className="w-5 h-5 text-amber-600" />;
      case 'Remote / Isolated Area': return <Compass className="w-5 h-5 text-emergency-600" />;
      case 'Long-Distance Travel': return <Car className="w-5 h-5 text-blue-600" />;
      default: return <MapPin className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 text-slate-900">
      
      {/* Toast */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-safe-50 border border-safe-200 text-safe-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-safe-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 1. HEADER SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-safe-600"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-safe-700 font-mono">
                MONITORING ACTIVE
              </span>
              {journey.isDemoMode && (
                <span className="px-2 py-0.2 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                  DEMO MODE (20s)
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
              ResQTag SafeJourney
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Stay connected. Check in. Get help when you need it.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowEndConfirm(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition-colors flex items-center gap-1.5"
            >
              <StopCircle className="w-4 h-4 text-slate-500" />
              <span>🛑 End Journey</span>
            </button>
          </div>
        </div>

        {/* 2. THE 6 REQUIRED DASHBOARD METRIC CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          
          {/* Card 1: Journey Type */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">JOURNEY TYPE</span>
            <div className="flex items-center gap-2 pt-0.5">
              {renderDestinationIcon()}
              <span className="text-xs font-bold text-slate-900 truncate">
                {journey.destinationType}
              </span>
            </div>
          </div>

          {/* Card 2: Travelling Alone */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">TRAVELLING ALONE</span>
            <div className="flex items-center gap-2 pt-0.5">
              {journey.isSolo ? (
                <>
                  <User className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-bold text-slate-900">Solo Traveler</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold text-slate-900">Group Trip</span>
                </>
              )}
            </div>
          </div>

          {/* Card 3: Journey Status */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">JOURNEY STATUS</span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="w-2 h-2 rounded-full bg-safe-600"></span>
              <span className="text-xs font-bold text-safe-700 uppercase">
                {journey.status === 'active' ? 'Active' : journey.status}
              </span>
            </div>
          </div>

          {/* Card 4: Last Check-in */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">LAST CHECK-IN</span>
            <div className="text-xs font-mono font-bold text-safe-700 pt-0.5">
              {journey.lastCheckinTime
                ? new Date(journey.lastCheckinTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Just Started'}
            </div>
          </div>

          {/* Card 5: Next Safety Check (Live Countdown) */}
          <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-brand-800 block">NEXT SAFETY CHECK</span>
            <div className="text-sm font-black font-mono text-brand-700 flex items-center gap-1.5 pt-0.5">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>{formatCountdown(secondsUntilNextCheck)}</span>
            </div>
          </div>

          {/* Card 6: Expected Return */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">EXPECTED RETURN</span>
            <div className="text-xs font-mono font-bold text-slate-900 pt-0.5">
              {new Date(journey.expectedEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* 3. MAIN ACTIONS (I'M SAFE vs I NEED HELP vs END JOURNEY) */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 🟢 I'M SAFE */}
            <button
              type="button"
              onClick={handleManualCheckin}
              disabled={isProcessing}
              className="py-4 px-6 rounded-2xl font-bold text-sm bg-safe-600 hover:bg-safe-700 text-white shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>🟢 I&apos;M SAFE (Check-in Now)</span>
            </button>

            {/* 🆘 I NEED HELP (Visually prominent but professional) */}
            <button
              type="button"
              onClick={handleManualSos}
              disabled={isProcessing}
              className="py-4 px-6 rounded-2xl font-bold text-sm bg-emergency-600 hover:bg-emergency-700 text-white shadow-glow-red flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>🆘 I NEED HELP (Emergency SOS)</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
            <p>Next safety check prompt will appear automatically at the scheduled time.</p>
            <button
              type="button"
              onClick={onOpenCheckinPrompt}
              className="text-brand-600 hover:underline font-semibold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test Safety Check Prompt</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. LOCATION & EMERGENCY CONTACTS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Location Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-brand-600" />
            Location Consent Status
          </span>
          <p className="text-slate-800 font-medium">
            {journey.lastLocation?.text || journey.lastLocation?.status || 'Location unavailable — permission was not granted.'}
          </p>
          <p className="text-[11px] text-slate-500">
            🔒 Location is never silently tracked. Only permitted coordinates are stored.
          </p>
        </div>

        {/* Notified Trusted Contacts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-emergency-600" />
            Notified Trusted Contacts
          </span>
          <div className="flex flex-wrap gap-1.5">
            {journey.emergencyContacts.map((c, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-mono text-[11px]">
                {c.name} ({c.relationship})
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">
            Contacts receive simulated SMS alerts if a scheduled check is missed for 10 minutes.
          </p>
        </div>
      </div>

      {/* 5. CHECK-IN LOG TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-safe-600" />
            <h3 className="text-sm font-bold text-slate-900">Active Journey Check-in Log</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenHistory}
              className="text-xs text-brand-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <History className="w-3.5 h-3.5" />
              <span>Past Journeys</span>
            </button>
            <span className="text-xs font-mono text-slate-500">
              {checkins.length} Recorded
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {checkins.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No check-ins recorded yet.</p>
          ) : (
            checkins.map((chk, i) => (
              <div
                key={chk.id || i}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-safe-600" />
                  <span className="font-mono text-slate-900 font-medium">
                    {new Date(chk.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-slate-600">{chk.notes || 'Marked Safe'}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-safe-100 text-safe-800">
                  ✓ SAFE
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* END JOURNEY CONFIRMATION MODAL */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
              <StopCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              End this SafeJourney?
            </h3>
            <p className="text-xs text-slate-600">
              Future scheduled safety checks and missed-check alerts will stop immediately.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Continue Journey
              </button>
              <button
                type="button"
                onClick={handleConfirmEndJourney}
                className="flex-1 py-2.5 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white text-xs font-bold shadow-sm"
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
