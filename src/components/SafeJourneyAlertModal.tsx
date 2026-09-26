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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2020]/75 backdrop-blur-sm animate-in fade-in">
      <div className="glass-card-rose-solid border-2 border-[#E53935] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden text-[#2B2020]">
        
        {/* Close Button */}
        <button
          onClick={dismissJourneyAlert}
          className="absolute top-5 right-5 text-[#806F6F] hover:text-[#2B2020] p-1.5 rounded-xl hover:bg-[#FFEFEF] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E53935] text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#C62828] font-mono">
              🚨 RESQTAG SAFETY ALERT
            </span>
            <h2 className="text-xl font-black text-[#2B2020] mt-0.5">
              {activeJourneyAlert.userName} has not responded to the scheduled safety check-in.
            </h2>
          </div>
        </div>

        {/* Structured Alert Hierarchy Details */}
        <div className="bg-[#FFEFEF]/80 border border-red-200 rounded-2xl p-5 space-y-3.5 text-xs shadow-sm">
          
          {/* Journey Destination */}
          <div className="flex items-center justify-between border-b border-red-200/80 pb-2.5">
            <span className="text-[#806F6F] font-semibold">Journey:</span>
            <span className="font-bold text-[#2B2020] flex items-center gap-1.5">
              <Trees className="w-3.5 h-3.5 text-emerald-600" />
              <span>{activeJourneyAlert.journeyType || 'Remote / Trekking'}</span>
            </span>
          </div>

          {/* Last Check-in */}
          <div className="flex items-center justify-between border-b border-red-200/80 pb-2.5">
            <span className="text-[#806F6F] font-semibold">Last Check-in:</span>
            <span className="font-mono font-bold text-[#2B2020]">
              {activeJourneyAlert.lastCheckinTime
                ? new Date(activeJourneyAlert.lastCheckinTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Not recorded'}
            </span>
          </div>

          {/* Last Available Location */}
          <div className="space-y-1 border-b border-red-200/80 pb-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[#806F6F] font-semibold">Last Available Location:</span>
              <span className="text-[#E53935] font-bold">
                {activeJourneyAlert.location?.status === 'Location shared' ? 'GPS Recorded' : 'Not Granted'}
              </span>
            </div>
            <p className="text-[#2B2020] font-medium">
              {activeJourneyAlert.location?.text || 'Available only when permission was granted'}
            </p>
            {activeJourneyAlert.location?.lat && activeJourneyAlert.location?.lng && (
              <a
                href={`https://maps.google.com/?q=${activeJourneyAlert.location.lat},${activeJourneyAlert.location.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#E53935] hover:underline font-bold pt-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open in Google Maps</span>
              </a>
            )}
          </div>

          {/* Alert Status */}
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[#806F6F] font-semibold">Alert Status:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white text-[#C62828] font-black text-[10px] border border-red-300 shadow-sm">
              ✓ Emergency contacts notified
            </span>
          </div>
        </div>

        {/* Notified Contacts List with Direct Dial */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-[#2B2020] flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-[#E53935]" />
            <span>Notified Family & Emergency Contacts</span>
          </h4>

          <div className="space-y-2">
            {(activeJourneyAlert.emergencyContacts || []).map((c, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/90 border border-red-100 flex items-center justify-between text-xs shadow-sm"
              >
                <div>
                  <span className="font-bold text-[#2B2020] block">{c.name}</span>
                  <span className="text-[10px] text-[#806F6F]">{c.relationship} • {c.phone}</span>
                </div>
                <a
                  href={`tel:${c.phone.replace(/\s+/g, '')}`}
                  className="btn-rose-primary px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
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
            className="flex-1 btn-rose-sos py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-center"
          >
            <Ambulance className="w-4 h-4" />
            <span>Call National SOS (112)</span>
          </a>
          <button
            onClick={dismissJourneyAlert}
            className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#806F6F] font-bold text-xs border border-slate-200 transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
