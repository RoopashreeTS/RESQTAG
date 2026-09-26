import React from 'react';
import { 
  MapPin, 
  Clock, 
  PhoneCall, 
  X, 
  User, 
  Trees, 
  Ambulance, 
  Radio,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SafeJourneyAlertModal: React.FC = () => {
  const { activeJourneyAlert, dismissJourneyAlert } = useAuth();

  if (!activeJourneyAlert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-gradient-to-b from-navy-900 to-navy-950 border-4 border-emergency-600 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top pulse accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emergency-600 via-amber-400 to-emergency-600 animate-pulse" />

        {/* Close Button */}
        <button
          onClick={dismissJourneyAlert}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emergency-600 text-white flex items-center justify-center shrink-0 shadow-glow-red">
            <Radio className="w-6 h-6 animate-ping" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emergency-500 bg-emergency-500/10 px-2.5 py-0.5 rounded border border-emergency-500/30">
              SIMULATED EMERGENCY CONTACT DASHBOARD
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              🚨 ResQTag Safety Alert
            </h2>
          </div>
        </div>

        {/* Core Alert Details Card */}
        <div className="p-5 rounded-2xl bg-navy-850 border border-navy-700 space-y-3.5 text-xs">
          <div className="flex justify-between items-center border-b border-navy-750 pb-2.5">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Person:
            </span>
            <strong className="text-base font-black text-white">{activeJourneyAlert.userName}</strong>
          </div>

          <div className="flex justify-between items-center border-b border-navy-750 pb-2.5">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Trees className="w-3.5 h-3.5 text-emerald-400" />
              Journey:
            </span>
            <span className="font-bold text-white">{activeJourneyAlert.journeyType}</span>
          </div>

          <div className="flex justify-between items-center border-b border-navy-750 pb-2.5">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Last Check-in:
            </span>
            <span className="font-mono text-amber-300 font-bold">
              {activeJourneyAlert.lastCheckinTime 
                ? new Date(activeJourneyAlert.lastCheckinTime).toLocaleTimeString() 
                : 'At start of journey'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emergency-950/60 border border-emergency-600/60 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emergency-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-emergency-500" />
              Alert Reason:
            </span>
            <p className="text-xs font-bold text-white leading-relaxed">
              {activeJourneyAlert.notes || 'No response to scheduled safety check after 10-minute response window.'}
            </p>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <MapPin className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Last Available Location:</span>
              <p className="text-xs text-slate-200 mt-0.5 font-medium">
                {activeJourneyAlert.location?.text || activeJourneyAlert.location?.status || 'Location unavailable — permission was not granted.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Call Person & Emergency Services */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href="tel:+919845011223"
              className="py-3 px-4 rounded-xl font-bold text-xs bg-navy-800 hover:bg-navy-750 text-brand-cyan border border-brand-cyan/40 hover:border-brand-cyan flex items-center justify-center gap-2 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-brand-cyan" />
              <span>📞 Contact Person</span>
            </a>

            <a
              href="tel:112"
              className="py-3 px-4 rounded-xl font-bold text-xs bg-emergency-600 hover:bg-emergency-500 text-white shadow-glow-red flex items-center justify-center gap-2 transition-all"
            >
              <Ambulance className="w-4 h-4 text-white" />
              <span>🚨 Emergency Assistance (112)</span>
            </a>
          </div>

          <button
            type="button"
            onClick={dismissJourneyAlert}
            className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Acknowledge & Close Alert View
          </button>
        </div>

        {/* Safety & Accuracy Notice */}
        <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-[10px] text-slate-400 space-y-1 text-center">
          <p className="font-semibold text-slate-300">
            ℹ️ Safety Notice:
          </p>
          <p>
            The system does not detect unconsciousness. The system only knows that a scheduled check-in was missed or help was requested.
          </p>
        </div>
      </div>
    </div>
  );
};
