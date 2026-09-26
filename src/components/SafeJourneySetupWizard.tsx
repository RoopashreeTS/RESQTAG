import React, { useState } from 'react';
import { 
  Trees, 
  Mountain, 
  Tent, 
  Compass, 
  Car, 
  MapPin, 
  User, 
  Users, 
  Clock, 
  ShieldCheck, 
  Navigation, 
  ArrowRight, 
  ArrowLeft, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { JourneyDestinationType, JourneyLocation } from '../types';

interface SafeJourneySetupWizardProps {
  onJourneyStarted: () => void;
  onCancel: () => void;
}

const DESTINATION_OPTIONS: { type: JourneyDestinationType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: 'Forest / Trekking Area', label: 'Forest / Trekking Area', icon: <Trees className="w-5 h-5 text-emerald-600" />, desc: 'Trails, woods, national parks & hiking' },
  { type: 'Hill / Mountain Area', label: 'Hill / Mountain Area', icon: <Mountain className="w-5 h-5 text-[#E53935]" />, desc: 'High altitude peaks, valleys & climbing' },
  { type: 'Camping Area', label: 'Camping Area', icon: <Tent className="w-5 h-5 text-amber-600" />, desc: 'Overnight wilderness camps & riverside' },
  { type: 'Remote / Isolated Area', label: 'Remote / Isolated Area', icon: <Compass className="w-5 h-5 text-[#C62828]" />, desc: 'Low signal regions & off-grid zones' },
  { type: 'Long-Distance Travel', label: 'Long-Distance Travel', icon: <Car className="w-5 h-5 text-blue-600" />, desc: 'Solo highway road trips & transit' },
  { type: 'Other', label: 'Other Location', icon: <MapPin className="w-5 h-5 text-purple-600" />, desc: 'Custom destination or daily solo transit' },
];

export const SafeJourneySetupWizard: React.FC<SafeJourneySetupWizardProps> = ({ onJourneyStarted, onCancel }) => {
  const { profile, startJourney } = useAuth();

  // Wizard step: 1: Destination, 2: Solo Status, 3: Schedule & Interval, 4: Summary Confirmation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [destinationType, setDestinationType] = useState<JourneyDestinationType>('Forest / Trekking Area');
  const [customDestination, setCustomDestination] = useState('');
  const [isSolo, setIsSolo] = useState<boolean>(true);
  const [startTime, setStartTime] = useState(() => {
    const d = new Date();
    return d.toTimeString().substring(0, 5);
  });
  const [expectedEndTime, setExpectedEndTime] = useState(() => {
    const d = new Date(Date.now() + 4 * 3600000);
    return d.toTimeString().substring(0, 5);
  });
  const [intervalMinutes, setIntervalMinutes] = useState<number>(60);
  const [isDemoMode] = useState<boolean>(false);
  const [demoIntervalSeconds] = useState<number>(20);
  
  // Location consent state
  const [locationConsent, setLocationConsent] = useState<boolean>(true);
  const [currentLocation, setCurrentLocation] = useState<JourneyLocation | undefined>(undefined);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Request location with explicit consent
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setCurrentLocation({
        status: 'Location unavailable — permission was not granted',
        lat: null,
        lng: null,
        text: 'Geolocation not supported by browser'
      });
      return;
    }

    setIsRequestingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCurrentLocation({
          status: 'Location shared',
          lat,
          lng,
          text: `Near Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`
        });
        setLocationConsent(true);
        setIsRequestingLocation(false);
      },
      () => {
        setCurrentLocation({
          status: 'Location unavailable — permission was not granted',
          lat: null,
          lng: null,
          text: null
        });
        setLocationConsent(false);
        setIsRequestingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  // Start Journey Submit
  const handleStartJourneySubmit = async () => {
    setIsStarting(true);
    setErrorMessage('');

    try {
      const now = new Date();
      const res = await startJourney({
        destinationType,
        customDestination: customDestination.trim() || undefined,
        isSolo,
        startTime: now.toISOString(),
        expectedEndTime: new Date(now.getTime() + 4 * 3600000).toISOString(),
        intervalMinutes: Number(intervalMinutes) || 60,
        isDemoMode,
        demoIntervalSeconds: isDemoMode ? Number(demoIntervalSeconds) : undefined,
        initialLocation: locationConsent && currentLocation ? currentLocation : {
          status: 'Location unavailable — permission was not granted',
          lat: null,
          lng: null,
          text: null
        }
      });

      if (res.success) {
        onJourneyStarted();
      } else {
        setErrorMessage(res.error || 'Failed to start SafeJourney.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred while starting the journey.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 text-[#2B2020] relative z-10">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#806F6F]">
          <span className={step >= 1 ? 'text-[#E53935] font-bold' : ''}>1. Destination</span>
          <span className={step >= 2 ? 'text-[#E53935] font-bold' : ''}>2. Solo Status</span>
          <span className={step >= 3 ? 'text-[#E53935] font-bold' : ''}>3. Schedule</span>
          <span className={step >= 4 ? 'text-emerald-700 font-bold' : ''}>4. Start</span>
        </div>
        <div className="w-full bg-[#FFE5E5] h-2.5 rounded-full overflow-hidden p-0.5 border border-red-200">
          <div
            className="bg-gradient-to-r from-[#E53935] to-[#FF6B6B] h-full rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Form Card */}
      <div className="glass-card-rose-solid rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-[#FFEFEF] border border-red-200 text-[#C62828] text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#E53935] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: DESTINATION SELECTION */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold text-[#E53935] uppercase tracking-wider block">
                Step 1 of 4
              </span>
              <h2 className="text-xl font-bold text-[#2B2020] mt-1">
                Where are you travelling?
              </h2>
              <p className="text-xs text-[#806F6F]">
                Select your journey terrain to configure appropriate safety parameters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DESTINATION_OPTIONS.map((opt) => (
                <div
                  key={opt.type}
                  onClick={() => setDestinationType(opt.type)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    destinationType === opt.type
                      ? 'bg-gradient-to-r from-[#FFF1F1] to-[#FFEFEF] border-[#E53935] shadow-md -translate-y-0.5'
                      : 'bg-white/80 border-red-100 hover:border-red-300 hover:bg-[#FFEFEF]/50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white border border-red-100 shrink-0 shadow-sm">
                    {opt.icon}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#2B2020]">{opt.label}</div>
                    <div className="text-[11px] text-[#806F6F] leading-tight">{opt.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom destination details */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-[#2B2020]">
                Specific Location / Trail Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Savandurga Trek Trail #2, Bandipur Forest Border"
                value={customDestination}
                onChange={(e) => setCustomDestination(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-white/90 border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15 transition-all"
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-red-100">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#806F6F] hover:text-[#2B2020] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-rose-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ARE YOU TRAVELLING ALONE? */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold text-[#E53935] uppercase tracking-wider block">
                Step 2 of 4
              </span>
              <h2 className="text-xl font-bold text-[#2B2020] mt-1">
                Are you travelling alone?
              </h2>
              <p className="text-xs text-[#806F6F]">
                SafeJourney is designed to provide proactive safety coverage for solo travelers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option: Solo */}
              <div
                onClick={() => setIsSolo(true)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  isSolo === true
                    ? 'bg-gradient-to-r from-[#FFF1F1] to-[#FFEFEF] border-[#E53935] shadow-md -translate-y-0.5'
                    : 'bg-white/80 border-red-100 hover:border-red-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-red-100 text-[#E53935] flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-[#2B2020]">Yes, I&apos;m travelling alone</div>
                <div className="text-xs text-[#806F6F] leading-relaxed">
                  Full proactive solo monitoring enabled. Scheduled safety check-ins and emergency contact alerts.
                </div>
              </div>

              {/* Option: With Group */}
              <div
                onClick={() => setIsSolo(false)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  isSolo === false
                    ? 'bg-gradient-to-r from-[#FFF1F1] to-[#FFEFEF] border-[#E53935] shadow-md -translate-y-0.5'
                    : 'bg-white/80 border-red-100 hover:border-red-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#806F6F] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-[#2B2020]">No, I&apos;m travelling with others</div>
                <div className="text-xs text-[#806F6F] leading-relaxed">
                  Group travel mode. Proactive monitoring will keep your external emergency contacts updated.
                </div>
              </div>
            </div>

            {/* Advisory note if group selected */}
            {!isSolo && (
              <div className="p-4 rounded-xl bg-[#FFEFEF] border border-red-200 text-[#C62828] text-xs flex items-start gap-2.5 shadow-sm">
                <Info className="w-4 h-4 text-[#E53935] shrink-0 mt-0.5" />
                <p>
                  Proactive solo monitoring is mainly intended for people travelling alone, but you may still proceed to keep your family and trusted contacts updated.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-red-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#806F6F] hover:text-[#2B2020] flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-rose-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <span>Continue to Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: JOURNEY SCHEDULE, INTERVAL & LOCATION CONSENT */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold text-[#E53935] uppercase tracking-wider block">
                Step 3 of 4
              </span>
              <h2 className="text-xl font-bold text-[#2B2020] mt-1">
                Schedule & Check-in Timing
              </h2>
              <p className="text-xs text-[#806F6F]">
                Set your expected duration and the frequency of automated safety check-ins.
              </p>
            </div>

            {/* Timings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2B2020] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#806F6F]" />
                  Journey Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-white/90 border border-red-200 rounded-xl text-[#2B2020] font-mono focus:outline-none focus:border-[#E53935]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2B2020] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#806F6F]" />
                  Expected Return / End Time
                </label>
                <input
                  type="time"
                  value={expectedEndTime}
                  onChange={(e) => setExpectedEndTime(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-white/90 border border-red-200 rounded-xl text-[#2B2020] font-mono focus:outline-none focus:border-[#E53935]"
                />
              </div>
            </div>

            {/* Check-in Interval */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#2B2020]">
                Safety Check-in Interval
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[30, 60, 120, 240].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setIntervalMinutes(mins)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      intervalMinutes === mins
                        ? 'bg-gradient-to-r from-[#E53935] to-[#C62828] text-white border-[#C62828] shadow-sm -translate-y-0.5'
                        : 'bg-white/80 text-[#2B2020] border-red-200 hover:border-[#E53935] hover:bg-[#FFEFEF]'
                    }`}
                  >
                    {mins === 60 ? 'Every 1 Hour' : mins >= 60 ? `Every ${mins / 60} Hours` : `Every ${mins} Mins`}
                  </button>
                ))}
              </div>
            </div>

            {/* CONSENT-BASED LOCATION PROMPT */}
            <div className="p-4 rounded-2xl bg-white/80 border border-red-100 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2B2020] flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-[#E53935]" />
                  Consent-Based Location
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  locationConsent ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-[#806F6F]'
                }`}>
                  {locationConsent ? 'Location Allowed' : 'Location Private'}
                </span>
              </div>
              <p className="text-[11px] text-[#806F6F] leading-relaxed">
                If enabled, your approximate GPS coordinates are saved with your check-ins and only shared with emergency contacts if an alert is triggered.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  disabled={isRequestingLocation}
                  className="btn-rose-primary px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isRequestingLocation ? 'Obtaining GPS...' : currentLocation?.status === 'Location shared' ? '✓ Location Granted' : 'Share Location'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLocationConsent(false);
                    setCurrentLocation(undefined);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white text-[#806F6F] hover:text-[#2B2020] border border-red-100 text-xs transition-colors"
                >
                  Keep Private
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-red-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#806F6F] hover:text-[#2B2020] flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="btn-rose-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <span>Review Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: JOURNEY SUMMARY & CONFIRMATION */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold text-[#E53935] uppercase tracking-wider block">
                Step 4 of 4
              </span>
              <h2 className="text-xl font-bold text-[#2B2020] mt-1">
                SafeJourney Summary
              </h2>
              <p className="text-xs text-[#806F6F]">
                Review your journey parameters before activating proactive monitoring.
              </p>
            </div>

            {/* Summary Box */}
            <div className="p-5 rounded-2xl bg-white/80 border border-red-100 space-y-3 text-xs shadow-sm">
              <div className="flex justify-between items-center border-b border-red-100 pb-2">
                <span className="text-[#806F6F]">Journey Type:</span>
                <strong className="text-[#2B2020]">{destinationType} {customDestination ? `(${customDestination})` : ''}</strong>
              </div>

              <div className="flex justify-between items-center border-b border-red-100 pb-2">
                <span className="text-[#806F6F]">Travelling:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  {isSolo ? '👤 Alone' : '👥 With Group'}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-red-100 pb-2">
                <span className="text-[#806F6F]">Journey Started:</span>
                <span className="font-mono text-[#2B2020]">Now ({startTime})</span>
              </div>

              <div className="flex justify-between items-center border-b border-red-100 pb-2">
                <span className="text-[#806F6F]">Expected Return:</span>
                <span className="font-mono text-[#2B2020]">{expectedEndTime}</span>
              </div>

              <div className="flex justify-between items-center border-b border-red-100 pb-2">
                <span className="text-[#806F6F]">Safety Check Interval:</span>
                <strong className="text-[#E53935]">
                  {intervalMinutes === 60 ? 'Every 1 Hour' : intervalMinutes >= 60 ? `Every ${intervalMinutes / 60} Hours` : `Every ${intervalMinutes} Mins`}
                </strong>
              </div>

              <div className="flex justify-between items-center border-b border-red-100 pb-2">
                <span className="text-[#806F6F]">Location Status:</span>
                <span className="text-[#2B2020]">
                  {locationConsent && currentLocation?.lat ? '📍 Coordinates Included' : 'Location not shared'}
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[#806F6F] block">Registered Emergency Contacts:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(profile?.emergencyContacts || []).map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#FFEFEF] text-[#2B2020] border border-red-200 text-[11px] font-medium">
                      {c.name} ({c.relationship})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleStartJourneySubmit}
                disabled={isStarting}
                className="w-full btn-rose-safe py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{isStarting ? 'Activating SafeJourney...' : 'START SAFEJOURNEY'}</span>
              </button>
              <p className="text-[11px] text-center text-[#806F6F]">
                “SafeJourney is active” will appear with automated scheduled checks.
              </p>
            </div>

            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#806F6F] hover:text-[#2B2020] flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Schedule</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
