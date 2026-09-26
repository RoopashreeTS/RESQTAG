import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MapPin, 
  Car, 
  ShieldCheck, 
  ShieldAlert, 
  Ambulance, 
  PhoneCall, 
  Navigation,
  BellRing,
  User,
  AlertTriangle,
  FileText
} from 'lucide-react';
import type { PublicEmergencyProfile } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface EmergencyProfileViewProps {
  identifier: string;
  onNavigate: (view: string, param?: string) => void;
}

export const EmergencyProfileView: React.FC<EmergencyProfileViewProps> = ({ identifier, onNavigate }) => {
  const { triggerSimulatedScanAlert } = useAuth();

  const [profile, setProfile] = useState<PublicEmergencyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Location Permission State
  const [locationPromptOpen, setLocationPromptOpen] = useState(true);
  const [locationStatus, setLocationStatus] = useState<'pending' | 'shared' | 'denied'>('pending');
  const [hasLoggedScan, setHasLoggedScan] = useState(false);
  const [alertSentSuccess, setAlertSentSuccess] = useState(false);

  // Load Profile from API
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const cleanCode = (identifier || 'RQ7K29').trim();
        const res = await api.getPublicTag(cleanCode);
        if (res.success && res.profile && isMounted) {
          setProfile(res.profile);
        } else if (isMounted) {
          setFetchError(res.error || 'Please check the QR code or enter the short code manually.');
        }
      } catch {
        if (isMounted) setFetchError('Please check the QR code or enter the short code manually.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [identifier]);

  // Log scan event once profile is loaded
  const logScanEventWithLocation = async (shareLocation: boolean) => {
    setLocationPromptOpen(false);
    if (hasLoggedScan) return;
    setHasLoggedScan(true);

    if (shareLocation) {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const locText = `Near Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)} (Bengaluru)`;
            setLocationStatus('shared');
            setAlertSentSuccess(true);

            const res = await api.recordScanEvent({
              identifier,
              locationStatus: 'Location shared',
              latitude: lat,
              longitude: lng,
              approxLocation: locText,
            });

            if (res.notification) {
              triggerSimulatedScanAlert(res.notification);
            }
          },
          async () => {
            setLocationStatus('denied');
            setAlertSentSuccess(true);
            const res = await api.recordScanEvent({
              identifier,
              locationStatus: 'Location not shared',
            });
            if (res.notification) {
              triggerSimulatedScanAlert(res.notification);
            }
          },
          { timeout: 8000 }
        );
      } else {
        setLocationStatus('denied');
        setAlertSentSuccess(true);
        const res = await api.recordScanEvent({
          identifier,
          locationStatus: 'Location not shared',
        });
        if (res.notification) {
          triggerSimulatedScanAlert(res.notification);
        }
      }
    } else {
      setLocationStatus('denied');
      setAlertSentSuccess(true);
      const res = await api.recordScanEvent({
        identifier,
        locationStatus: 'Location not shared',
      });
      if (res.notification) {
        triggerSimulatedScanAlert(res.notification);
      }
    }
  };

  const handleManualTriggerAlert = async () => {
    setAlertSentSuccess(true);
    const res = await api.recordScanEvent({
      identifier,
      locationStatus: locationStatus === 'shared' ? 'Location shared' : 'Location not shared',
    });
    if (res.notification) {
      triggerSimulatedScanAlert(res.notification);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-base font-black text-[#2B2020]">Loading ResQTag…</h2>
        <p className="text-xs text-[#806F6F]">Querying secure emergency database</p>
      </div>
    );
  }

  if (fetchError || !profile) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-[#E53935] border border-red-200 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-9 h-9" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-black text-[#2B2020]">ResQTag not found</h2>
          <p className="text-xs text-[#806F6F] max-w-md mx-auto">
            Please check the QR code or enter the short code manually.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => onNavigate('scan')}
            className="px-6 py-3 rounded-xl btn-rose-primary text-white font-bold text-xs uppercase tracking-wider shadow-md"
          >
            BACK TO SCAN
          </button>
          <button
            onClick={() => onNavigate('landing')}
            className="px-6 py-3 rounded-xl btn-rose-outline text-[#2B2020] font-bold text-xs"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const contacts = profile.emergencyContacts || [];
  const primaryContact = contacts.find(c => c && c.isPrimary) || contacts[0];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 text-[#2B2020]">
      
      {/* 1. EXPLICIT LOCATION PERMISSION BANNER */}
      {locationPromptOpen && (
        <div className="glass-card-rose-solid rounded-3xl p-5 border-2 border-red-200 space-y-3.5 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-[#E53935] flex items-center justify-center shrink-0 border border-red-200">
              <Navigation className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#2B2020] flex items-center gap-2">
                Share Incident Coordinates with Family?
              </h3>
              <p className="text-xs text-[#806F6F] leading-relaxed">
                Allowing location transmits your approximate GPS coordinates to {profile.fullName}&apos;s emergency contacts to assist rescue teams.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              onClick={() => logScanEventWithLocation(true)}
              className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl btn-rose-primary text-white font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-4 h-4" />
              <span>Allow Location & Notify Family</span>
            </button>
            <button
              onClick={() => logScanEventWithLocation(false)}
              className="w-full sm:w-auto py-3 px-4 rounded-xl btn-rose-outline text-[#2B2020] font-semibold text-xs"
            >
              Skip Location
            </button>
          </div>

          <p className="text-[11px] text-[#806F6F]">
            🔒 Responders are never tracked. Location is shared only once for this emergency event.
          </p>
        </div>
      )}

      {/* 2. SCAN CONFIRMATION & ALERT STATUS */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl glass-card-rose text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[#2B2020] font-medium">
            {alertSentSuccess ? 'Emergency alert dispatched to contacts' : 'Secure Emergency Medical Record'}
          </span>
        </div>
        <span
          className={`px-3 py-1 rounded-full font-bold text-[10px] ${
            locationStatus === 'shared'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : locationStatus === 'denied'
              ? 'bg-rose-50 text-[#806F6F] border border-red-100'
              : 'bg-rose-100 text-[#C62828] border border-red-200'
          }`}
        >
          {locationStatus === 'shared'
            ? '📍 GPS Attached'
            : locationStatus === 'denied'
            ? 'GPS Omitted'
            : 'Pending GPS'}
        </span>
      </div>

      {/* 3. PRIMARY EMERGENCY ACTIONS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Action 1: 📞 Contact */}
        {primaryContact && (
          <a
            href={`tel:${(primaryContact.phone || '').replace(/\s+/g, '')}`}
            className="p-4 rounded-2xl glass-card-dark-rose text-white flex items-center justify-center gap-2.5 font-bold text-xs hover:-translate-y-0.5 active:scale-[0.97] transition-all"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <span className="block text-[10px] text-slate-300 uppercase font-semibold">📞 Contact</span>
              <span className="block text-xs font-bold text-white">Call {(primaryContact.name || 'Family').split(' ')[0]}</span>
            </div>
          </a>
        )}

        {/* Action 2: 🚨 Emergency Assistance */}
        <a
          href="tel:108"
          className="p-4 rounded-2xl glass-card-rose text-[#2B2020] flex items-center justify-center gap-2.5 font-bold text-xs hover:border-[#E53935]"
        >
          <Ambulance className="w-4 h-4 text-[#E53935]" />
          <div className="text-left">
            <span className="block text-[10px] text-[#806F6F] uppercase font-semibold">🚨 Emergency Assistance</span>
            <span className="block text-xs font-bold text-[#2B2020]">Ambulance (108 / 112)</span>
          </div>
        </a>

        {/* Action 3: 🚨 Emergency Alert */}
        <button
          type="button"
          onClick={handleManualTriggerAlert}
          className="p-4 rounded-2xl btn-rose-sos text-white flex items-center justify-center gap-2.5 font-bold text-xs"
        >
          <BellRing className="w-4 h-4 text-white" />
          <div className="text-left">
            <span className="block text-[10px] text-rose-100 uppercase font-semibold">Instant Alert</span>
            <span className="block text-xs font-bold text-white">Send SOS SMS to Family</span>
          </div>
        </button>
      </div>

      {/* 4. EMERGENCY MEDICAL CARD */}
      <div className="glass-card-rose-solid rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Header with Photo, Details, and Blood Group */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left border-b border-red-100 pb-6">
          <div className="relative shrink-0">
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.fullName || 'Profile Photo'}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-red-200 shadow-md bg-white"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-rose-50 border-2 border-red-200 flex flex-col items-center justify-center text-[#806F6F] shadow-sm">
                <User className="w-10 h-10 text-[#E53935]" />
                <span className="text-[10px] uppercase font-bold text-[#806F6F] mt-1">Photo</span>
              </div>
            )}
            <span className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-600 text-white shadow-md">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-[#C62828] text-[10px] font-bold border border-red-200 uppercase">
                RESQTAG EMERGENCY PROFILE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/80 text-[#2B2020] font-mono text-[10px] font-bold border border-red-100">
                TAG: {profile.shortCode || identifier}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#2B2020]">
              {profile.fullName}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#806F6F]">
              <span>Age: <strong className="text-[#2B2020]">{profile.age} Yrs</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Car className="w-3.5 h-3.5 text-[#E53935]" />
                <strong className="text-[#2B2020]">{profile.vehicleNumber || 'Not specified'}</strong>
              </span>
            </div>
          </div>

          {/* Blood Group Badge */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#C62828] to-[#E53935] text-white px-6 py-4 rounded-2xl shadow-md shadow-red-500/25 min-w-[110px]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-100">
              BLOOD GROUP
            </span>
            <span className="text-3xl sm:text-4xl font-black font-mono">
              {profile.bloodGroup || 'O+'}
            </span>
          </div>
        </div>

        {/* Allergies & Medical Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-red-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#C62828] text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-[#E53935]" />
              <span>Allergies</span>
            </div>
            <p className="text-xs font-semibold text-[#2B2020] leading-relaxed">
              {profile.allergies || 'No known allergies reported'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-red-100 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#2B2020] text-xs font-bold uppercase tracking-wider">
              <FileText className="w-4 h-4 text-[#E53935]" />
              <span>Important Medical Information</span>
            </div>
            <p className="text-xs font-medium text-[#2B2020] leading-relaxed">
              {profile.medicalInfo || 'No chronic conditions reported'}
            </p>
          </div>
        </div>

        {/* Address */}
        {profile.address && (
          <div className="p-3.5 rounded-2xl bg-white/80 border border-red-100 text-xs text-[#2B2020] flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#E53935] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#2B2020] block">Home / Emergency Address:</span>
              <p className="text-[#806F6F] text-xs mt-0.5">{profile.address}</p>
            </div>
          </div>
        )}
      </div>

      {/* 5. EMERGENCY CONTACTS DIRECTORY */}
      <div className="glass-card-rose-solid rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-red-100 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#E53935]" />
            <h2 className="text-base font-bold text-[#2B2020]">
              Trusted Emergency Contacts
            </h2>
          </div>
          <span className="text-xs text-[#806F6F] font-semibold">1-Tap Direct Call</span>
        </div>

        <div className="space-y-3">
          {profile.emergencyContacts.map((contact, idx) => (
            <div
              key={contact.id || idx}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                contact.isPrimary
                  ? 'bg-rose-50/70 border-red-200'
                  : 'bg-white/80 border-red-100'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#2B2020]">{contact.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white text-[#806F6F] border border-red-100">
                    {contact.relationship}
                  </span>
                  {contact.isPrimary && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-[#C62828] border border-red-200">
                      PRIMARY
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-[#806F6F]">{contact.phone}</div>
              </div>

              {/* Call Button */}
              <a
                href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                className="px-4 py-2.5 rounded-xl font-bold text-xs btn-rose-primary text-white flex items-center justify-center gap-1.5 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 text-white" />
                <span>Call {contact.name.split(' ')[0]}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 6. MEDICAL & LEGAL DISCLAIMER */}
      <div className="p-4 rounded-2xl glass-card-rose text-[11px] text-[#806F6F] space-y-1 text-center">
        <p className="font-bold text-[#2B2020]">
          ⚠️ Official Medical Assessment Disclaimer:
        </p>
        <p>
          ResQTag provides verified emergency information and communication support. It does not replace professional medical assessment, paramedic triage, or emergency clinical care.
        </p>
      </div>

    </div>
  );
};
