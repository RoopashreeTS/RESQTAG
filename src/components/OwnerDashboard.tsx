import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  User, 
  QrCode, 
  History, 
  Settings, 
  LogOut, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Heart, 
  Printer, 
  Clock, 
  Smartphone, 
  Sparkles, 
  ExternalLink,
  Trees,
  Bell
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { api, INITIAL_DEMO_DATA } from '../services/api';
import type { ScanEvent, BloodGroup, EmergencyContact, JourneyAlert } from '../types';
import { ProfilePhotoUploader } from './ProfilePhotoUploader';

interface OwnerDashboardProps {
  onNavigate: (view: string, param?: string) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onNavigate }) => {
  const { profile, token, logout, updateProfile, activeJourney } = useAuth();
  const current = profile || INITIAL_DEMO_DATA;

  // Active Tab: dashboard, qr, safejourney, history, notifications, profile, settings
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'qr' | 'history' | 'notifications' | 'settings'>('dashboard');

  // Profile Edit State
  const [fullName, setFullName] = useState(current.fullName);
  const [age, setAge] = useState(current.age);
  const [bloodGroup, setBloodGroup] = useState(current.bloodGroup);
  const [address, setAddress] = useState(current.address);
  const [vehicleNumber, setVehicleNumber] = useState(current.vehicleNumber);
  const [allergies, setAllergies] = useState(current.allergies);
  const [medicalInfo, setMedicalInfo] = useState(current.medicalInfo);
  const [photoUrl, setPhotoUrl] = useState(current.photoUrl || '');
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(
    current.emergencyContacts && current.emergencyContacts.length > 0
      ? current.emergencyContacts
      : [
          { id: 'c1', name: '', relationship: 'Father', phone: '', isPrimary: true },
          { id: 'c2', name: '', relationship: 'Spouse', phone: '', isPrimary: false },
          { id: 'c3', name: '', relationship: 'Doctor', phone: '', isPrimary: false },
        ]
  );

  // Status & Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Scan History & Alerts
  const [scans, setScans] = useState<ScanEvent[]>([]);
  const [alerts, setAlerts] = useState<JourneyAlert[]>([]);
  const [isLoadingScans, setIsLoadingScans] = useState(false);

  // Sync state if profile changes
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setAge(profile.age);
      setBloodGroup(profile.bloodGroup);
      setAddress(profile.address);
      setVehicleNumber(profile.vehicleNumber);
      setAllergies(profile.allergies);
      setMedicalInfo(profile.medicalInfo);
      setPhotoUrl(profile.photoUrl || '');
      setEmergencyContacts(
        profile.emergencyContacts.length > 0
          ? profile.emergencyContacts
          : [
              { id: 'c1', name: '', relationship: 'Father', phone: '', isPrimary: true },
              { id: 'c2', name: '', relationship: 'Spouse', phone: '', isPrimary: false },
              { id: 'c3', name: '', relationship: 'Doctor', phone: '', isPrimary: false },
            ]
      );
    }
  }, [profile]);

  // Load scan history and alerts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingScans(true);
      try {
        const [scanData, alertData] = await Promise.all([
          api.getScanHistory(token || undefined, current.tagId),
          api.getSafeJourneyAlerts()
        ]);
        setScans(scanData);
        setAlerts(alertData);
      } catch (err) {
        console.error('Failed to load dashboard logs:', err);
      } finally {
        setIsLoadingScans(false);
      }
    };

    fetchData();
  }, [token, current.tagId, activeTab]);

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccessMessage(null);
    setErrorMessage(null);

    try {
      const validContacts = emergencyContacts.filter(c => c.name.trim() && c.phone.trim());
      if (validContacts.length === 0) {
        setErrorMessage('At least one emergency contact is required.');
        setIsSaving(false);
        return;
      }

      const success = await updateProfile({
        fullName,
        age: Number(age) || 25,
        bloodGroup,
        address,
        vehicleNumber: vehicleNumber.toUpperCase().trim(),
        allergies,
        medicalInfo,
        photoUrl,
        emergencyContacts: validContacts,
      });

      if (success) {
        setSaveSuccessMessage(
          'Profile updated successfully! Notice: Your physical QR sticker and short code continue working identically.'
        );
        setTimeout(() => setSaveSuccessMessage(null), 5000);
      } else {
        setErrorMessage('Failed to save profile changes. Please try again.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const scanUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/#scan/${current.shortCode}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#2B2020] relative z-10">
      
      {/* Top Welcome Header */}
      <div className="glass-card-rose-solid rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          {current.photoUrl ? (
            <img
              src={current.photoUrl}
              alt={current.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E53935] shadow-md bg-white shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-[#FFEFEF] border-2 border-red-200 flex items-center justify-center text-[#E53935] shrink-0">
              <User className="w-8 h-8" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#2B2020]">{current.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                ACTIVE TAG
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#806F6F] mt-1 font-mono">
              <span>TAG ID: <strong className="text-[#2B2020]">{current.tagId}</strong></span>
              <span>•</span>
              <span>CODE: <strong className="text-[#E53935] font-black">{current.shortCode}</strong></span>
              <span>•</span>
              <span className="text-[#E53935] font-bold">BLOOD: {current.bloodGroup}</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('sticker')}
            className="btn-rose-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print QR Tag</span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-4">
          <nav className="glass-card-rose-solid rounded-3xl p-3 space-y-1.5 shadow-lg">
            
            {/* 1. Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-[#E53935] to-[#FF6B6B] text-white shadow-rose-btn -translate-y-0.5'
                  : 'text-[#806F6F] hover:text-[#2B2020] hover:bg-[#FFEFEF]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {/* 2. Emergency QR */}
            <button
              onClick={() => setActiveTab('qr')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'qr'
                  ? 'bg-gradient-to-r from-[#E53935] to-[#FF6B6B] text-white shadow-rose-btn -translate-y-0.5'
                  : 'text-[#806F6F] hover:text-[#2B2020] hover:bg-[#FFEFEF]'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Emergency QR</span>
            </button>

            {/* 3. SafeJourney */}
            <button
              onClick={() => onNavigate('safejourney')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-emerald-800 hover:bg-emerald-50 border border-emerald-200 transition-all hover:-translate-y-0.5 active:scale-95 bg-emerald-50/60"
            >
              <Trees className="w-4 h-4 text-emerald-600" />
              <div className="flex-1 text-left flex justify-between items-center">
                <span>SafeJourney</span>
                {activeJourney && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
                )}
              </div>
            </button>

            {/* 4. Scan History */}
            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-[#E53935] to-[#FF6B6B] text-white shadow-rose-btn -translate-y-0.5'
                  : 'text-[#806F6F] hover:text-[#2B2020] hover:bg-[#FFEFEF]'
              }`}
            >
              <History className="w-4 h-4" />
              <div className="flex-1 text-left flex justify-between items-center">
                <span>Scan History</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  activeTab === 'history' ? 'bg-white/30 text-white' : 'bg-red-100 text-[#E53935]'
                }`}>
                  {scans.length}
                </span>
              </div>
            </button>

            {/* 5. Notifications / Alerts */}
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'notifications'
                  ? 'bg-gradient-to-r from-[#E53935] to-[#FF6B6B] text-white shadow-rose-btn -translate-y-0.5'
                  : 'text-[#806F6F] hover:text-[#2B2020] hover:bg-[#FFEFEF]'
              }`}
            >
              <Bell className="w-4 h-4" />
              <div className="flex-1 text-left flex justify-between items-center">
                <span>Notifications</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  activeTab === 'notifications' ? 'bg-white/30 text-white' : 'bg-red-100 text-[#E53935]'
                }`}>
                  {alerts.length}
                </span>
              </div>
            </button>

            {/* 6. Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-[#E53935] to-[#FF6B6B] text-white shadow-rose-btn -translate-y-0.5'
                  : 'text-[#806F6F] hover:text-[#2B2020] hover:bg-[#FFEFEF]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>

            {/* 7. Settings */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-[#E53935] to-[#FF6B6B] text-white shadow-rose-btn -translate-y-0.5'
                  : 'text-[#806F6F] hover:text-[#2B2020] hover:bg-[#FFEFEF]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <div className="pt-2 border-t border-red-100">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-[#E53935] hover:bg-[#FFEFEF] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>

          {/* Public Preview Box */}
          <div className="glass-card-rose rounded-3xl p-5 text-center space-y-3 shadow-md">
            <div className="text-xs font-bold text-[#2B2020]">Public Responder View</div>
            <div className="p-2 bg-white border border-red-200 rounded-2xl inline-block shadow-sm">
              <QRCodeSVG value={scanUrl} size={110} />
            </div>
            <button
              onClick={() => onNavigate('emergency-profile', current.shortCode)}
              className="w-full btn-rose-outline py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <span>Test Public View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Content Area: Widgets & Tabs */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: MAIN DASHBOARD OVERVIEW WITH ALL 5 REQUIRED WIDGETS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* 5 Widgets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Widget 1: Emergency QR Status */}
                <div className="glass-card-rose-solid rounded-3xl p-6 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-red-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#FFEFEF] flex items-center justify-center text-[#E53935]">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-[#2B2020]">Emergency QR Status</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      ✓ Active & Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-2xl bg-white/80 border border-red-100">
                      <span className="text-[10px] text-[#806F6F] block font-semibold">SHORT CODE</span>
                      <strong className="text-[#E53935] font-mono text-sm">{current.shortCode}</strong>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/80 border border-red-100">
                      <span className="text-[10px] text-[#806F6F] block font-semibold">BLOOD GROUP</span>
                      <strong className="text-[#E53935] font-mono text-sm">{current.bloodGroup}</strong>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/80 border border-red-100 col-span-2">
                      <span className="text-[10px] text-[#806F6F] block font-semibold">VEHICLE ASSIGNED</span>
                      <strong className="text-[#2B2020] font-mono">{current.vehicleNumber}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('qr')}
                    className="w-full btn-rose-outline py-2.5 rounded-xl text-xs font-semibold"
                  >
                    View QR & Decal Stickers
                  </button>
                </div>

                {/* Widget 2: SafeJourney Status */}
                <div className="glass-card-rose-solid rounded-3xl p-6 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-red-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Trees className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-[#2B2020]">SafeJourney Status</h3>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      activeJourney ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-[#806F6F]'
                    }`}>
                      {activeJourney ? '● Monitoring Active' : 'Idle'}
                    </span>
                  </div>

                  {activeJourney ? (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                        <span className="text-emerald-800 block text-[11px] font-semibold">Current Destination:</span>
                        <strong className="text-emerald-950 block">{activeJourney.destinationType}</strong>
                      </div>
                      <div className="flex justify-between text-xs text-[#806F6F] pt-1">
                        <span>Interval: <strong>{activeJourney.isDemoMode ? `${activeJourney.demoIntervalSeconds}s (Demo)` : `${activeJourney.intervalMinutes}m`}</strong></span>
                        <span>Check-ins: <strong>{activeJourney.totalCheckins}</strong></span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#806F6F] py-3">
                      No active SafeJourney running. Start proactive monitoring for solo trekking or remote travel.
                    </p>
                  )}

                  <button
                    onClick={() => onNavigate('safejourney')}
                    className="w-full btn-rose-safe py-2.5 rounded-xl text-xs font-bold"
                  >
                    {activeJourney ? 'Open Active SafeJourney' : 'Start SafeJourney'}
                  </button>
                </div>

                {/* Widget 3: Emergency Contacts */}
                <div className="glass-card-rose-solid rounded-3xl p-6 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-red-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#FFEFEF] flex items-center justify-center text-[#E53935]">
                        <Heart className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-[#2B2020]">Emergency Contacts</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="text-xs text-[#E53935] hover:underline font-bold"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    {current.emergencyContacts.slice(0, 3).map((c, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white/80 border border-red-100 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#2B2020] block">{c.name}</span>
                          <span className="text-[10px] text-[#806F6F]">{c.relationship} • {c.phone}</span>
                        </div>
                        {c.isPrimary && (
                          <span className="px-2 py-0.5 rounded bg-[#FFEFEF] text-[#E53935] text-[10px] font-black border border-red-200">
                            PRIMARY
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Widget 4: Recent Scans */}
                <div className="glass-card-rose-solid rounded-3xl p-6 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-red-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#FFEFEF] flex items-center justify-center text-[#E53935]">
                        <History className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-[#2B2020]">Recent Scans</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="text-xs text-[#E53935] hover:underline font-bold"
                    >
                      View All ({scans.length})
                    </button>
                  </div>

                  {scans.length === 0 ? (
                    <p className="text-xs text-[#806F6F] py-4 text-center">No scan events recorded yet.</p>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {scans.slice(0, 2).map((s) => (
                        <div key={s.id} className="p-2.5 rounded-xl bg-white/80 border border-red-100 space-y-0.5">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-bold text-[#2B2020]">{new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="text-[10px] font-bold text-emerald-700">{s.locationStatus}</span>
                          </div>
                          <p className="text-[11px] text-[#806F6F] truncate">{s.approxLocation || 'Direct lookup'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Widget 5: Recent Alerts (Full Width) */}
                <div className="glass-card-rose-solid rounded-3xl p-6 space-y-4 shadow-lg md:col-span-2">
                  <div className="flex items-center justify-between border-b border-red-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#FFEFEF] flex items-center justify-center text-[#E53935]">
                        <Bell className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-[#2B2020]">Recent Emergency Alerts & Notifications</h3>
                    </div>
                    <span className="text-xs font-mono text-[#806F6F]">{alerts.length} Total Alerts</span>
                  </div>

                  {alerts.length === 0 ? (
                    <p className="text-xs text-[#806F6F] py-3">No active emergency alerts recorded. All systems normal.</p>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {alerts.slice(0, 3).map((a) => (
                        <div key={a.id} className="p-3 rounded-2xl bg-[#FFEFEF] border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
                          <div>
                            <span className="font-bold text-[#C62828] block">
                              {a.alertType === 'manual_sos' ? '🆘 Emergency SOS Alert' : '🚨 Missed Safety Check-in Alert'}
                            </span>
                            <span className="text-[11px] text-[#806F6F]">{a.notes || `Alert triggered during journey (${a.journeyType})`}</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#806F6F] shrink-0">
                            {new Date(a.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PROFILE EDIT */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="glass-card-rose-solid rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="border-b border-red-100 pb-4">
                <h2 className="text-xl font-bold text-[#2B2020] flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FFEFEF] flex items-center justify-center text-[#E53935]">
                    <User className="w-4 h-4" />
                  </div>
                  Edit Emergency Profile
                </h2>
                <p className="text-xs text-[#806F6F] mt-1">
                  Updates sync dynamically with your permanent ResQTag (<span className="font-mono text-[#E53935] font-bold">{current.shortCode}</span>).
                </p>
              </div>

              {saveSuccessMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-[#FFEFEF] border border-red-200 text-[#C62828] text-xs flex items-center gap-2 shadow-sm">
                  <AlertCircle className="w-4 h-4 text-[#E53935] shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Profile Photo Uploader */}
              <div className="border-b border-red-100 pb-6">
                <ProfilePhotoUploader
                  photoUrl={photoUrl || undefined}
                  onPhotoChange={(newUrl) => setPhotoUrl(newUrl || '')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2B2020]">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white/90 border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2B2020]">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white/90 border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15 transition-all"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#2B2020]">Blood Group</label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {BLOOD_GROUPS.map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setBloodGroup(bg)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          bloodGroup === bg
                            ? 'bg-gradient-to-r from-[#E53935] to-[#C62828] text-white border-[#C62828] shadow-md -translate-y-0.5'
                            : 'bg-white/80 text-[#2B2020] border-red-200 hover:border-[#E53935] hover:bg-[#FFEFEF]'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#2B2020]">Vehicle Registration Number</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    className="w-full text-xs px-3.5 py-2.5 bg-white/90 border border-red-200 rounded-xl text-[#2B2020] font-mono uppercase focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15"
                    required
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#2B2020]">Residential Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white/90 border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div className="space-y-3 pt-4 border-t border-red-100">
                <h3 className="text-xs font-bold text-[#2B2020] flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#E53935]" />
                  <span>Emergency Contacts</span>
                </h3>

                {emergencyContacts.map((contact, idx) => (
                  <div key={contact.id || idx} className="p-3.5 rounded-2xl bg-white/80 border border-red-200 space-y-2 shadow-sm">
                    <span className="text-[11px] font-bold text-[#2B2020] uppercase">
                      Contact {idx + 1} {contact.isPrimary && '(Primary SOS)'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={contact.name}
                        onChange={(e) => {
                          const copy = [...emergencyContacts];
                          copy[idx].name = e.target.value;
                          setEmergencyContacts(copy);
                        }}
                        className="text-xs px-3 py-2 bg-white border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935]"
                      />
                      <input
                        type="text"
                        placeholder="Relationship"
                        value={contact.relationship}
                        onChange={(e) => {
                          const copy = [...emergencyContacts];
                          copy[idx].relationship = e.target.value;
                          setEmergencyContacts(copy);
                        }}
                        className="text-xs px-3 py-2 bg-white border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935]"
                      />
                      <input
                        type="text"
                        placeholder="Phone"
                        value={contact.phone}
                        onChange={(e) => {
                          const copy = [...emergencyContacts];
                          copy[idx].phone = e.target.value;
                          setEmergencyContacts(copy);
                        }}
                        className="text-xs px-3 py-2 bg-white border border-red-200 rounded-xl text-[#2B2020] font-mono focus:outline-none focus:border-[#E53935]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-red-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-rose-primary px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save & Update Profile'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: QR & STICKERS */}
          {activeTab === 'qr' && (
            <div className="glass-card-rose-solid rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#2B2020] flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#FFEFEF] flex items-center justify-center text-[#E53935]">
                      <QrCode className="w-4 h-4" />
                    </div>
                    My ResQTag Sticker
                  </h2>
                  <p className="text-xs text-[#806F6F] mt-1">
                    Your unique emergency identifier connected to this profile.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('sticker')}
                  className="btn-rose-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Weatherproof Sticker</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Physical Sticker Card Preview */}
                <div className="bg-white text-slate-900 rounded-3xl p-6 border-2 border-red-300 shadow-xl max-w-sm mx-auto text-center space-y-3.5">
                  <div className="bg-gradient-to-r from-[#E53935] to-[#C62828] text-white py-1.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm">
                    SCAN IN CASE OF EMERGENCY
                  </div>

                  <div className="p-3 bg-red-50/50 border border-red-100 rounded-2xl inline-block shadow-inner">
                    <QRCodeSVG value={scanUrl} size={150} level="H" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] text-[#806F6F] font-bold uppercase">Backup Short Code</div>
                    <div className="text-2xl font-black font-mono tracking-widest text-[#E53935] bg-[#FFEFEF] py-1.5 px-4 rounded-xl border border-red-200 inline-block shadow-sm">
                      {current.shortCode}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-700 font-mono font-bold pt-2 border-t border-red-100">
                    <span>VEHICLE: {current.vehicleNumber}</span>
                    <span className="text-[#E53935] font-black">BLOOD: {current.bloodGroup}</span>
                  </div>
                </div>

                <div className="space-y-4 text-xs text-[#806F6F]">
                  <div className="p-4 rounded-2xl bg-white/80 border border-red-100 space-y-2 shadow-sm">
                    <h4 className="font-bold text-[#2B2020] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#E53935]" />
                      Dynamic Cloud Resolution
                    </h4>
                    <p className="leading-relaxed">
                      Because the QR points to your permanent Tag ID (<code className="font-mono text-[#E53935] font-bold">{current.shortCode}</code>), you can update your phone numbers or medical info at any time without needing to replace printed decals.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/80 border border-red-100 space-y-2 shadow-sm">
                    <h4 className="font-bold text-[#2B2020] flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      Zero App Required
                    </h4>
                    <p className="leading-relaxed">
                      Responders, good samaritans, and paramedics can scan this with any iPhone or Android camera app directly in their default browser.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SCAN HISTORY */}
          {activeTab === 'history' && (
            <div className="glass-card-rose-solid rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-red-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#2B2020] flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#FFEFEF] flex items-center justify-center text-[#E53935]">
                      <History className="w-4 h-4" />
                    </div>
                    Scan History Log
                  </h2>
                  <p className="text-xs text-[#806F6F] mt-1">
                    Audit log of every time your ResQTag was scanned.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-[#FFEFEF] text-[#E53935] text-xs font-mono font-black border border-red-200">
                  {scans.length} Events
                </span>
              </div>

              {isLoadingScans ? (
                <div className="py-12 text-center text-xs text-[#806F6F]">Loading scan logs...</div>
              ) : scans.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#806F6F] space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-[#806F6F]" />
                  <p>No scan events logged yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scans.map((scan) => (
                    <div
                      key={scan.id}
                      className="p-4 rounded-2xl bg-white/80 border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm hover:border-red-300 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#2B2020] font-mono">
                            {new Date(scan.timestamp).toLocaleDateString()} at {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              scan.locationStatus === 'Location shared'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-[#806F6F]'
                            }`}
                          >
                            {scan.locationStatus}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[#806F6F] font-mono text-[11px]">
                          <span>Vehicle: <strong className="text-[#2B2020]">{scan.vehicleNumber || current.vehicleNumber}</strong></span>
                          <span>•</span>
                          <span>Device: {scan.scannerDevice}</span>
                        </div>

                        <div className="text-[11px] text-[#806F6F]">
                          Location: {scan.approxLocation || 'Location not shared'}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl font-bold border border-emerald-200">
                          ✓ Contacts Notified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS & ALERTS */}
          {activeTab === 'notifications' && (
            <div className="glass-card-rose-solid rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="border-b border-red-100 pb-4">
                <h2 className="text-xl font-bold text-[#2B2020] flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FFEFEF] flex items-center justify-center text-[#E53935]">
                    <Bell className="w-4 h-4" />
                  </div>
                  Notifications & Incident Alerts
                </h2>
                <p className="text-xs text-[#806F6F] mt-1">
                  Real-time alerts sent to your emergency contacts.
                </p>
              </div>

              {alerts.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#806F6F]">
                  No emergency alerts recorded.
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  {alerts.map((a) => (
                    <div key={a.id} className="p-4 rounded-2xl bg-[#FFEFEF] border border-red-200 space-y-2 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#C62828]">
                          {a.alertType === 'manual_sos' ? '🆘 Emergency SOS Alert' : '🚨 Missed Safety Check-in Alert'}
                        </span>
                        <span className="font-mono text-[10px] text-[#806F6F]">{new Date(a.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[#806F6F]">{a.notes || `Emergency alert triggered for ${a.userName} on journey (${a.journeyType})`}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: ACCOUNT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="glass-card-rose-solid rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="border-b border-red-100 pb-4">
                <h2 className="text-xl font-bold text-[#2B2020] flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FFEFEF] flex items-center justify-center text-[#E53935]">
                    <Settings className="w-4 h-4" />
                  </div>
                  Account & Security Settings
                </h2>
                <p className="text-xs text-[#806F6F] mt-1">
                  Manage your ResQTag account preferences and security credentials.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/80 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                  <div>
                    <h4 className="font-bold text-[#2B2020]">Registered Mobile Number</h4>
                    <p className="text-[#806F6F] text-[11px] mt-0.5 font-mono">
                      {current.phone || '+91 98765 43210'} (Verified via OTP)
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300 inline-flex items-center gap-1 w-fit">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                  <div>
                    <h4 className="font-bold text-[#2B2020]">Emergency Profile Privacy</h4>
                    <p className="text-[#806F6F] text-[11px] mt-0.5">
                      Your medical info and emergency contacts are securely served to responders upon QR scan.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200 inline-flex items-center gap-1 w-fit">
                    Active & Protected
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
