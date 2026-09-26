import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Heart, 
  MapPin, 
  Car, 
  FileText, 
  ShieldCheck, 
  ShieldAlert, 
  Ambulance, 
  PhoneCall, 
  Navigation,
  BellRing,
  User
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
        const res = await api.getPublicTag(identifier);
        if (res.success && res.profile && isMounted) {
          setProfile(res.profile);
        } else if (isMounted) {
          setFetchError(res.error || `Could not find ResQTag profile for identifier "${identifier}"`);
        }
      } catch {
        if (isMounted) setFetchError('Failed to retrieve emergency profile. Check network connection.');
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
      if (navigator.geolocation) {
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
          async (err) => {
            console.warn('Geolocation denied by browser:', err);
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
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-800">Retrieving Emergency Medical Profile...</p>
        <p className="text-xs text-slate-500">Querying secure ResQTag API</p>
      </div>
    );
  }

  if (fetchError || !profile) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-emergency-50 text-emergency-600 border border-emergency-200 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-900">ResQTag Not Found</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">{fetchError}</p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onNavigate('scan')}
            className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm hover:bg-brand-700"
          >
            Scan Another Tag
          </button>
          <button
            onClick={() => onNavigate('emergency-profile', 'RQ7K29')}
            className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 hover:bg-slate-200"
          >
            Open Demo Tag (RQ7K29)
          </button>
        </div>
      </div>
    );
  }

  const primaryContact = profile.emergencyContacts.find(c => c.isPrimary) || profile.emergencyContacts[0];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 text-slate-900">
      
      {/* 1. EXPLICIT LOCATION PERMISSION BANNER */}
      {locationPromptOpen && (
        <div className="bg-white border-2 border-brand-500/80 rounded-2xl p-5 shadow-card space-y-3.5 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
              <Navigation className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Share Incident Coordinates with Family?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Allowing location transmits your approximate GPS coordinates to {profile.fullName}&apos;s emergency contacts to assist rescue teams.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              onClick={() => logScanEventWithLocation(true)}
              className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Allow Location & Notify Family</span>
            </button>
            <button
              onClick={() => logScanEventWithLocation(false)}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors"
            >
              Skip Location
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            🔒 Responders are never tracked. Location is only shared once for this emergency event.
          </p>
        </div>
      )}

      {/* 2. SCAN CONFIRMATION & ALERT STATUS */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-safe-500 animate-pulse" />
          <span className="text-slate-700 font-medium">
            {alertSentSuccess ? 'Emergency alert dispatched to contacts' : 'Secure Emergency Medical Record'}
          </span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
            locationStatus === 'shared'
              ? 'bg-safe-50 text-safe-700 border border-safe-200'
              : locationStatus === 'denied'
              ? 'bg-slate-100 text-slate-600 border border-slate-200'
              : 'bg-brand-50 text-brand-700 border border-brand-200'
          }`}
        >
          {locationStatus === 'shared'
            ? '📍 GPS Attached'
            : locationStatus === 'denied'
            ? 'GPS Omitted'
            : 'Pending GPS'}
        </span>
      </div>

      {/* 3. PRIMARY EMERGENCY ACTIONS BAR (HIGHLY VISIBLE) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Action 1: 📞 Contact Family */}
        {primaryContact && (
          <a
            href={`tel:${primaryContact.phone.replace(/\s+/g, '')}`}
            className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-card flex items-center justify-center gap-2.5 font-bold text-xs transition-all active:scale-[0.99]"
          >
            <PhoneCall className="w-4 h-4 text-safe-400" />
            <div className="text-left">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">1-Tap Dial</span>
              <span className="block text-xs font-bold text-white">Call {primaryContact.name.split(' ')[0]}</span>
            </div>
          </a>
        )}

        {/* Action 2: 🚑 Emergency Assistance */}
        <a
          href="tel:108"
          className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 shadow-card flex items-center justify-center gap-2.5 font-bold text-xs transition-all active:scale-[0.99]"
        >
          <Ambulance className="w-4 h-4 text-emergency-600" />
          <div className="text-left">
            <span className="block text-[10px] text-slate-500 uppercase font-semibold">Toll-Free SOS</span>
            <span className="block text-xs font-bold text-slate-900">Call Ambulance (108/112)</span>
          </div>
        </a>

        {/* Action 3: 🚨 Emergency Alert */}
        <button
          type="button"
          onClick={handleManualTriggerAlert}
          className="p-4 rounded-2xl bg-emergency-600 hover:bg-emergency-700 text-white shadow-glow-red flex items-center justify-center gap-2.5 font-bold text-xs transition-all active:scale-[0.99]"
        >
          <BellRing className="w-4 h-4 text-white" />
          <div className="text-left">
            <span className="block text-[10px] text-emergency-100 uppercase font-semibold">Instant Alert</span>
            <span className="block text-xs font-bold text-white">Send SOS SMS to Family</span>
          </div>
        </button>
      </div>

      {/* 4. EMERGENCY MEDICAL CARD */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        {/* Header with Photo, Details, and Blood Group */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left border-b border-slate-100 pb-6">
          <div className="relative shrink-0">
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-slate-200 shadow-md bg-white"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 border-2 border-slate-200 flex flex-col items-center justify-center text-slate-400 shadow-sm">
                <User className="w-10 h-10 text-slate-400" />
                <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">Photo</span>
              </div>
            )}
            <span className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-safe-600 text-white shadow">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 uppercase">
                EMERGENCY MEDICAL PROFILE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono text-[10px] font-bold">
                TAG: {profile.shortCode}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
              {profile.fullName}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600">
              <span>Age: <strong className="text-slate-900">{profile.age} Yrs</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Car className="w-3.5 h-3.5 text-slate-400" />
                <strong className="text-slate-900">{profile.vehicleNumber}</strong>
              </span>
            </div>
          </div>

          {/* Blood Group Badge (Reserved Red for Medical Triage) */}
          <div className="flex flex-col items-center justify-center bg-emergency-600 text-white px-6 py-4 rounded-2xl shadow-sm min-w-[110px]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emergency-100">
              BLOOD GROUP
            </span>
            <span className="text-3xl sm:text-4xl font-black font-mono">
              {profile.bloodGroup}
            </span>
          </div>
        </div>

        {/* Allergies & Medical Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Allergies Box */}
          <div className="p-4 rounded-2xl bg-emergency-50/70 border border-emergency-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emergency-700 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-emergency-600" />
              <span>Severe Allergies</span>
            </div>
            <p className="text-sm font-bold text-slate-900 leading-relaxed">
              {profile.allergies || 'None reported'}
            </p>
          </div>

          {/* Medical Notes Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-4 h-4 text-brand-600" />
              <span>Medical Conditions & Notes</span>
            </div>
            <p className="text-xs font-medium text-slate-800 leading-relaxed">
              {profile.medicalInfo || 'No conditions reported'}
            </p>
          </div>
        </div>

        {/* Address */}
        {profile.address && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Home / Emergency Address:</span>
              <p className="text-slate-600 text-xs mt-0.5">{profile.address}</p>
            </div>
          </div>
        )}
      </div>

      {/* 5. EMERGENCY CONTACTS DIRECTORY */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-emergency-600" />
            <h2 className="text-base font-bold text-slate-900">
              Trusted Emergency Contacts
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">1-Tap Direct Call</span>
        </div>

        <div className="space-y-3">
          {profile.emergencyContacts.map((contact, idx) => (
            <div
              key={contact.id || idx}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                contact.isPrimary
                  ? 'bg-slate-50 border-slate-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{contact.name}</span>
                  <span className="px-2 py-0.2 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                    {contact.relationship}
                  </span>
                  {contact.isPrimary && (
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold uppercase bg-emergency-100 text-emergency-800 border border-emergency-200">
                      PRIMARY
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-slate-600">{contact.phone}</div>
              </div>

              {/* Call Button */}
              <a
                href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 text-safe-400" />
                <span>Call {contact.name.split(' ')[0]}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 6. MEDICAL & LEGAL DISCLAIMER */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 space-y-1 text-center">
        <p className="font-semibold text-slate-800">
          ⚠️ Official Medical Assessment Disclaimer:
        </p>
        <p>
          ResQTag provides verified emergency information and communication support. It does not replace professional medical assessment, paramedic triage, or emergency clinical care.
        </p>
      </div>

    </div>
  );
};
