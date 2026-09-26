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
  onOpenCheckinPrompt?: () => void;
  onOpenHistory: () => void;
}

export const SafeJourneyActiveDashboard: React.FC<SafeJourneyActiveDashboardProps> = ({
  journey,
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
      case 'Forest / Trekking Area': return <Trees className="w-5 h-5 text-emerald-600" />;
      case 'Hill / Mountain Area': return <Mountain className="w-5 h-5 text-[#E53935]" />;
      case 'Camping Area': return <Tent className="w-5 h-5 text-amber-600" />;
      case 'Remote / Isolated Area': return <Compass className="w-5 h-5 text-[#C62828]" />;
      case 'Long-Distance Travel': return <Car className="w-5 h-5 text-blue-600" />;
      default: return <MapPin className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 text-[#2B2020] relative z-10">
      
      {/* Toast */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 1. HEADER SECTION */}
      <div className="glass-card-rose-solid rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                MONITORING ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2B2020]">
              ResQTag SafeJourney
            </h1>
            <p className="text-xs sm:text-sm text-[#806F6F]">
              Stay connected. Check in. Get help when you need it.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowEndConfirm(true)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-red-50 text-[#806F6F] hover:text-[#E53935] text-xs font-bold border border-red-200 transition-all hover:-translate-y-0.5 flex items-center gap-1.5 shadow-sm"
            >
              <StopCircle className="w-4 h-4 text-[#E53935]" />
              <span>🛑 End Journey</span>
            </button>
          </div>
        </div>

        {/* 2. THE 6 REQUIRED DASHBOARD METRIC CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          
          {/* Card 1: Journey Type */}
          <div className="p-4 rounded-2xl bg-white/80 border border-red-100 space-y-1 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-[#806F6F] block">JOURNEY TYPE</span>
            <div className="flex items-center gap-2 pt-0.5">
              {renderDestinationIcon()}
              <span className="text-xs font-bold text-[#2B2020] truncate">
                {journey.destinationType}
              </span>
            </div>
          </div>

          {/* Card 2: Travelling Alone */}
          <div className="p-4 rounded-2xl bg-white/80 border border-red-100 space-y-1 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-[#806F6F] block">TRAVELLING ALONE</span>
            <div className="flex items-center gap-2 pt-0.5">
              {journey.isSolo ? (
                <>
                  <User className="w-4 h-4 text-[#E53935]" />
                  <span className="text-xs font-bold text-[#2B2020]">Solo Traveler</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 text-[#806F6F]" />
                  <span className="text-xs font-bold text-[#2B2020]">Group Trip</span>
                </>
              )}
            </div>
          </div>

          {/* Card 3: Journey Status */}
          <div className="p-4 rounded-2xl bg-white/80 border border-red-100 space-y-1 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-[#806F6F] block">JOURNEY STATUS</span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-xs font-bold text-emerald-700 uppercase">
                {journey.status === 'active' ? 'Active' : journey.status}
              </span>
            </div>
          </div>

          {/* Card 4: Last Check-in */}
          <div className="p-4 rounded-2xl bg-white/80 border border-red-100 space-y-1 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-[#806F6F] block">LAST CHECK-IN</span>
            <div className="text-xs font-mono font-bold text-emerald-700 pt-0.5">
              {journey.lastCheckinTime
                ? new Date(journey.lastCheckinTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Just Started'}
            </div>
          </div>

          {/* Card 5: Next Safety Check (Live Countdown) */}
          <div className="p-4 rounded-2xl bg-[#FFEFEF] border border-red-200 space-y-1 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-[#C62828] block">NEXT SAFETY CHECK</span>
            <div className="text-sm font-black font-mono text-[#E53935] flex items-center gap-1.5 pt-0.5">
              <Clock className="w-4 h-4 text-[#E53935]" />
              <span>{formatCountdown(secondsUntilNextCheck)}</span>
            </div>
          </div>

          {/* Card 6: Expected Return */}
          <div className="p-4 rounded-2xl bg-white/80 border border-red-100 space-y-1 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-[#806F6F] block">EXPECTED RETURN</span>
            <div className="text-xs font-mono font-bold text-[#2B2020] pt-0.5">
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
              className="btn-rose-safe py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>🟢 I&apos;M SAFE (Check-in Now)</span>
            </button>

            {/* 🆘 I NEED HELP */}
            <button
              type="button"
              onClick={handleManualSos}
              disabled={isProcessing}
              className="btn-rose-sos py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-5 h-5 text-white" />
              <span>🆘 I NEED HELP (Emergency SOS)</span>
            </button>
          </div>

          <div className="pt-1 text-[11px] text-[#806F6F]">
            <p>Next safety check prompt will appear automatically at the scheduled time.</p>
          </div>
        </div>
      </div>

      {/* 4. LOCATION & EMERGENCY CONTACTS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Location Status */}
        <div className="glass-card-rose rounded-3xl p-5 space-y-2 shadow-md">
          <span className="text-[10px] uppercase font-bold text-[#806F6F] flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-[#E53935]" />
            Location Consent Status
          </span>
          <p className="text-[#2B2020] font-semibold">
            {journey.lastLocation?.text || journey.lastLocation?.status || 'Location unavailable — permission was not granted.'}
          </p>
          <p className="text-[11px] text-[#806F6F]">
            🔒 Location is never silently tracked. Only permitted coordinates are stored.
          </p>
        </div>

        {/* Notified Trusted Contacts */}
        <div className="glass-card-rose rounded-3xl p-5 space-y-2 shadow-md">
          <span className="text-[10px] uppercase font-bold text-[#806F6F] flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-[#E53935]" />
            Notified Trusted Contacts
          </span>
          <div className="flex flex-wrap gap-1.5">
            {journey.emergencyContacts.map((c, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-xl bg-white border border-red-200 text-[#2B2020] font-mono text-[11px] font-medium shadow-sm">
                {c.name} ({c.relationship})
              </span>
            ))}
          </div>
          <p className="text-[11px] text-[#806F6F]">
            Contacts receive simulated SMS alerts if a scheduled check is missed for 10 minutes.
          </p>
        </div>
      </div>

      {/* 5. CHECK-IN LOG TABLE */}
      <div className="glass-card-rose-solid rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-red-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#2B2020]">Active Journey Check-in Log</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenHistory}
              className="text-xs text-[#E53935] hover:underline flex items-center gap-1 font-bold"
            >
              <History className="w-3.5 h-3.5" />
              <span>Past Journeys</span>
            </button>
            <span className="text-xs font-mono text-[#806F6F]">
              {checkins.length} Recorded
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {checkins.length === 0 ? (
            <p className="text-xs text-[#806F6F] text-center py-4">No check-ins recorded yet.</p>
          ) : (
            checkins.map((chk, i) => (
              <div
                key={chk.id || i}
                className="p-3 rounded-2xl bg-white/80 border border-red-100 flex items-center justify-between text-xs shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="font-mono text-[#2B2020] font-bold">
                    {new Date(chk.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-[#806F6F]">{chk.notes || 'Marked Safe'}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ✓ SAFE
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* END JOURNEY CONFIRMATION MODAL */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2020]/75 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card-rose-solid rounded-3xl max-w-sm w-full p-6 space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#FFEFEF] text-[#E53935] flex items-center justify-center mx-auto shadow-sm">
              <StopCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#2B2020]">
              End this SafeJourney?
            </h3>
            <p className="text-xs text-[#806F6F]">
              Future scheduled safety checks and missed-check alerts will stop immediately.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#806F6F] text-xs font-semibold border border-slate-200 transition-colors"
              >
                Continue Journey
              </button>
              <button
                type="button"
                onClick={handleConfirmEndJourney}
                className="flex-1 btn-rose-primary py-2.5 rounded-xl text-xs font-bold"
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
