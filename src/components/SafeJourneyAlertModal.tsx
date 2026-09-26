import React from 'react';
import { 
  PhoneCall, 
  X, 
  Trees, 
  Ambulance, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SafeJourneyAlertModal: React.FC = () => {
  const { activeJourneyAlert, dismissJourneyAlert } = useAuth();

  if (!activeJourneyAlert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border-2 border-emergency-600 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={dismissJourneyAlert}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emergency-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emergency-700 font-mono">
              🚨 RESQTAG SAFETY ALERT
            </span>
            <h2 className="text-xl font-black text-slate-950 mt-0.5">
              {activeJourneyAlert.userName} has not responded to the scheduled safety check-in.
            </h2>
          </div>
        </div>

        {/* Structured Alert Hierarchy Details */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5 text-xs">
          
          {/* Journey Destination */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-slate-500 font-semibold">Journey:</span>
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Trees className="w-3.5 h-3.5 text-safe-700" />
              <span>{activeJourneyAlert.journeyType || 'Remote / Trekking'}</span>
            </span>
          </div>

          {/* Last Check-in */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-slate-500 font-semibold">Last Check-in:</span>
            <span className="font-mono font-bold text-slate-900">
              {activeJourneyAlert.lastCheckinTime
                ? new Date(activeJourneyAlert.lastCheckinTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Not recorded'}
            </span>
          </div>

          {/* Last Available Location */}
          <div className="space-y-1 border-b border-slate-200 pb-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Last Available Location:</span>
              <span className="text-brand-700 font-medium">
                {activeJourneyAlert.location?.status === 'Location shared' ? 'GPS Recorded' : 'Not Granted'}
              </span>
            </div>
            <p className="text-slate-700 font-medium">
              {activeJourneyAlert.location?.text || 'Available only when permission was granted'}
            </p>
            {activeJourneyAlert.location?.lat && activeJourneyAlert.location?.lng && (
              <a
                href={`https://maps.google.com/?q=${activeJourneyAlert.location.lat},${activeJourneyAlert.location.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-brand-600 hover:underline font-bold pt-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open in Google Maps</span>
              </a>
            )}
          </div>

          {/* Alert Status */}
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-slate-500 font-semibold">Alert Status:</span>
            <span className="px-2 py-0.5 rounded bg-emergency-100 text-emergency-800 font-bold text-[10px] border border-emergency-200">
              ✓ Emergency contacts notified
            </span>
          </div>
        </div>

        {/* Notified Contacts List with Direct Dial */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-emergency-600" />
            <span>Notified Family & Emergency Contacts</span>
          </h4>

          <div className="space-y-2">
            {(activeJourneyAlert.emergencyContacts || []).map((c, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{c.name}</span>
                  <span className="text-[10px] text-slate-500">{c.relationship} • {c.phone}</span>
                </div>
                <a
                  href={`tel:${c.phone.replace(/\s+/g, '')}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                >
                  <PhoneCall className="w-3 h-3 text-safe-400" />
                  <span>Call</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Dispatch Helpline */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <a
            href="tel:112"
            className="flex-1 py-3 px-4 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
          >
            <Ambulance className="w-4 h-4" />
            <span>Call National SOS (112)</span>
          </a>
          <button
            onClick={dismissJourneyAlert}
            className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
