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
  Navigation
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
      const res = await api.recordScanEvent({
        identifier,
        locationStatus: 'Location not shared',
      });
      if (res.notification) {
        triggerSimulatedScanAlert(res.notification);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emergency-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-white">Retrieving Emergency Medical Profile...</p>
        <p className="text-xs text-slate-400">Querying secure ResQTag API</p>
      </div>
    );
  }

  if (fetchError || !profile) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emergency-600/20 text-emergency-500 border border-emergency-500/40 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">ResQTag Not Found</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">{fetchError}</p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onNavigate('scan')}
            className="px-6 py-2.5 rounded-xl bg-emergency-600 text-white font-bold text-xs shadow-glow-red"
          >
            Scan Another Tag
          </button>
          <button
            onClick={() => onNavigate('emergency-profile', 'RQ7K29')}
            className="px-6 py-2.5 rounded-xl bg-navy-800 text-amber-300 font-bold text-xs border border-navy-700"
          >
            Open Demo Tag (RQ7K29)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24">
      {/* 1. EXPLICIT LOCATION PERMISSION MODAL / BANNER */}
      {locationPromptOpen && (
        <div className="bg-gradient-to-r from-navy-900 to-navy-850 border-2 border-amber-500/60 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                Share Incident Location with Family?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Allowing location sends the approximate GPS coordinates of this emergency to {profile.fullName}&apos;s trusted contacts via SMS.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              onClick={() => logScanEventWithLocation(true)}
              className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-white font-bold text-xs shadow-glow-red flex items-center justify-center gap-1.5 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Allow Location & Alert Contacts</span>
            </button>
            <button
              onClick={() => logScanEventWithLocation(false)}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-300 font-semibold text-xs border border-navy-700 transition-colors"
            >
              Skip Location (Privacy)
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            🔒 Responders are never tracked. Location is only shared once for this emergency event.
          </p>
        </div>
      )}

      {/* 2. SCAN & NOTIFICATION STATUS BAR */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-navy-900 border border-navy-750 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-slate-300 font-medium">
            Scan Recorded • Trusted Contacts Alerted
          </span>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
            locationStatus === 'shared'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : locationStatus === 'denied'
              ? 'bg-slate-800 text-slate-400 border border-slate-700'
              : 'bg-amber-500/20 text-amber-300'
          }`}
        >
          {locationStatus === 'shared'
            ? '📍 Location shared'
            : locationStatus === 'denied'
            ? 'Location not shared'
            : 'Pending location'}
        </span>
      </div>

      {/* 3. VICTIM IDENTITY HERO CARD */}
      <div className="bg-navy-900 border border-navy-750 rounded-2xl p-6 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Profile Photo */}
          <div className="relative">
            <img
              src={
                profile.photoUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
              }
              alt={profile.fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-emergency-600 shadow-glow-red"
            />
            <span className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emergency-600 text-white shadow">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          {/* Name & Primary Badges */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2 py-0.5 rounded bg-emergency-600/20 text-emergency-500 text-[10px] font-bold border border-emergency-500/30">
                VERIFIED RESQTAG
              </span>
              <span className="px-2 py-0.5 rounded bg-navy-800 text-slate-300 font-mono text-[10px]">
                CODE: {profile.shortCode}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {profile.fullName}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300">
              <span>Age: <strong className="text-white">{profile.age} Yrs</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Car className="w-3.5 h-3.5 text-slate-400" />
                <strong className="text-white">{profile.vehicleNumber}</strong>
              </span>
            </div>
          </div>

          {/* BIG BLOOD GROUP BADGE (PARAMEDIC PRIORITY) */}
          <div className="flex flex-col items-center justify-center bg-emergency-600 text-white px-5 py-3.5 rounded-2xl shadow-glow-red border-2 border-white/20 min-w-[100px]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emergency-100">
              BLOOD GROUP
            </span>
            <span className="text-3xl sm:text-4xl font-black font-mono">
              {profile.bloodGroup}
            </span>
          </div>
        </div>

        {/* 4. CRITICAL MEDICAL ALERTS (RED BOX FOR PARAMEDICS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Allergies Card */}
          <div className="p-4 rounded-xl bg-emergency-950/60 border-2 border-emergency-600/60 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emergency-500 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-emergency-500" />
              <span>Known Allergies (Severe Risk)</span>
            </div>
            <p className="text-sm font-bold text-white leading-relaxed">
              {profile.allergies || 'None reported'}
            </p>
          </div>

          {/* Important Medical Info Card */}
          <div className="p-4 rounded-xl bg-navy-850 border border-brand-cyan/40 space-y-1.5">
            <div className="flex items-center gap-1.5 text-brand-cyan text-xs font-bold uppercase tracking-wider">
              <FileText className="w-4 h-4 text-brand-cyan" />
              <span>Medical Conditions & Notes</span>
            </div>
            <p className="text-xs font-medium text-slate-200 leading-relaxed">
              {profile.medicalInfo || 'No conditions reported'}
            </p>
          </div>
        </div>

        {/* Address & Tag Reference */}
        {profile.address && (
          <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 text-xs text-slate-300 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block">Home / Emergency Address:</span>
              <p className="text-slate-300 text-xs mt-0.5">{profile.address}</p>
            </div>
          </div>
        )}
      </div>

      {/* 5. 1-TAP EMERGENCY SOS CONTACTS */}
      <div className="bg-navy-900 border border-navy-750 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-emergency-500" />
            <h2 className="text-lg font-bold text-white">
              Trusted Emergency Contacts
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">1-Tap Direct Dial</span>
        </div>

        <div className="space-y-3">
          {profile.emergencyContacts.map((contact, idx) => (
            <div
              key={contact.id || idx}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                contact.isPrimary
                  ? 'bg-emergency-600/10 border-emergency-500/40 shadow-sm'
                  : 'bg-navy-850 border-navy-750'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{contact.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-navy-800 text-brand-cyan border border-navy-700">
                    {contact.relationship}
                  </span>
                  {contact.isPrimary && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emergency-600 text-white">
                      PRIMARY SOS
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-slate-300">{contact.phone}</div>
              </div>

              {/* Call Button */}
              <a
                href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                  contact.isPrimary
                    ? 'bg-emergency-600 hover:bg-emergency-500 text-white shadow-glow-red hover:scale-105'
                    : 'bg-navy-750 hover:bg-navy-700 text-white border border-navy-600'
                }`}
              >
                <PhoneCall className="w-4 h-4 text-white" />
                <span>Call {contact.name.split(' ')[0]}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 6. OFFICIAL EMERGENCY SERVICES DISPATCH */}
      <div className="bg-navy-900 border border-navy-750 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Ambulance className="w-4 h-4 text-emerald-400" />
            <span>Official Emergency Helplines (Toll-Free)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="tel:108"
            className="p-3.5 rounded-xl bg-navy-850 hover:bg-emerald-950/40 border border-navy-700 hover:border-emerald-500 text-center space-y-1 transition-all group"
          >
            <div className="text-xl font-black text-emerald-400 font-mono">108 / 112</div>
            <div className="text-xs font-bold text-white">Call Ambulance</div>
            <div className="text-[10px] text-slate-400">Medical Emergency</div>
          </a>

          <a
            href="tel:100"
            className="p-3.5 rounded-xl bg-navy-850 hover:bg-blue-950/40 border border-navy-700 hover:border-brand-blue text-center space-y-1 transition-all group"
          >
            <div className="text-xl font-black text-brand-cyan font-mono">100 / 112</div>
            <div className="text-xs font-bold text-white">Call Police</div>
            <div className="text-[10px] text-slate-400">Traffic & Patrol</div>
          </a>

          <a
            href="tel:101"
            className="p-3.5 rounded-xl bg-navy-850 hover:bg-amber-950/40 border border-navy-700 hover:border-amber-500 text-center space-y-1 transition-all group"
          >
            <div className="text-xl font-black text-amber-400 font-mono">101</div>
            <div className="text-xs font-bold text-white">Call Fire Force</div>
            <div className="text-[10px] text-slate-400">Rescue Unit</div>
          </a>
        </div>
      </div>

      {/* 7. MEDICAL & LEGAL DISCLAIMER */}
      <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 text-[11px] text-slate-400 space-y-1 text-center">
        <p className="font-semibold text-slate-300">
          ⚠️ Official Medical Assessment Disclaimer:
        </p>
        <p>
          ResQTag provides emergency information and communication support. It does not replace professional medical assessment, paramedic triage, or emergency medical services.
        </p>
      </div>
    </div>
  );
};
