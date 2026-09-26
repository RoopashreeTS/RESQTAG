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

interface OwnerDashboardProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenSimulator: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onNavigate, onOpenSimulator }) => {
  const { profile, token, logout, updateProfile, resetDemo, activeJourney } = useAuth();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Top Welcome Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={
              current.photoUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
            }
            alt={current.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-950">{current.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-safe-50 text-safe-700 text-[10px] font-bold border border-safe-200">
                ACTIVE TAG
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1 font-mono">
              <span>TAG ID: <strong className="text-slate-900">{current.tagId}</strong></span>
              <span>•</span>
              <span>CODE: <strong className="text-brand-700">{current.shortCode}</strong></span>
              <span>•</span>
              <span className="text-emergency-600 font-bold">BLOOD: {current.bloodGroup}</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSimulator}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Simulate Incident</span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-4">
          <nav className="bg-white border border-slate-200 rounded-3xl p-2.5 space-y-1 shadow-card">
            
            {/* 1. Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Emergency QR</span>
            </button>

            {/* 3. SafeJourney */}
            <button
              onClick={() => onNavigate('safejourney')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-safe-700 hover:bg-safe-50 border border-safe-200 transition-all"
            >
              <Trees className="w-4 h-4 text-safe-600" />
              <div className="flex-1 text-left flex justify-between items-center">
                <span>SafeJourney</span>
                {activeJourney && (
                  <span className="w-2 h-2 rounded-full bg-safe-600 animate-pulse"></span>
                )}
              </div>
            </button>

            {/* 4. Scan History */}
            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4" />
              <div className="flex-1 text-left flex justify-between items-center">
                <span>Scan History</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
                  {scans.length}
                </span>
              </div>
            </button>

            {/* 5. Notifications / Alerts */}
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'notifications'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Bell className="w-4 h-4" />
              <div className="flex-1 text-left flex justify-between items-center">
                <span>Notifications</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
                  {alerts.length}
                </span>
              </div>
            </button>

            {/* 6. Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>

          {/* Public Preview Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 text-center space-y-3 shadow-card">
            <div className="text-xs font-bold text-slate-700">Public Responder View</div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-2xl inline-block">
              <QRCodeSVG value={scanUrl} size={110} />
            </div>
            <button
              onClick={() => onNavigate('emergency-profile', current.shortCode)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-700 border border-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
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
                <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-card">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-brand-600" />
                      <h3 className="text-sm font-bold text-slate-900">Emergency QR Status</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-safe-50 text-safe-700 text-[10px] font-bold border border-safe-200">
                      ✓ Active & Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">SHORT CODE</span>
                      <strong className="text-slate-900 font-mono text-sm">{current.shortCode}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">BLOOD GROUP</span>
                      <strong className="text-emergency-600 font-mono text-sm">{current.bloodGroup}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2">
                      <span className="text-[10px] text-slate-500 block">VEHICLE ASSIGNED</span>
                      <strong className="text-slate-800 font-mono">{current.vehicleNumber}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('qr')}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                  >
                    View QR & Decal Stickers
                  </button>
                </div>

                {/* Widget 2: SafeJourney Status */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-card">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Trees className="w-5 h-5 text-safe-600" />
                      <h3 className="text-sm font-bold text-slate-900">SafeJourney Status</h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      activeJourney ? 'bg-safe-50 text-safe-700 border border-safe-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {activeJourney ? '● Monitoring Active' : 'Idle'}
                    </span>
                  </div>

                  {activeJourney ? (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-safe-50 border border-safe-200 space-y-1">
                        <span className="text-slate-600 block text-[11px]">Current Destination:</span>
                        <strong className="text-safe-900 block">{activeJourney.destinationType}</strong>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600 pt-1">
                        <span>Check-in Interval: <strong>{activeJourney.isDemoMode ? `${activeJourney.demoIntervalSeconds}s (Demo)` : `${activeJourney.intervalMinutes}m`}</strong></span>
                        <span>Check-ins: <strong>{activeJourney.totalCheckins}</strong></span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 py-3">
                      No active SafeJourney running. Start proactive monitoring for solo trekking or remote travel.
                    </p>
                  )}

                  <button
                    onClick={() => onNavigate('safejourney')}
                    className="w-full py-2.5 rounded-xl bg-safe-600 hover:bg-safe-700 text-white font-semibold text-xs transition-colors"
                  >
                    {activeJourney ? 'Open Active SafeJourney' : 'Start SafeJourney'}
                  </button>
                </div>

                {/* Widget 3: Emergency Contacts */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-card">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-emergency-600" />
                      <h3 className="text-sm font-bold text-slate-900">Emergency Contacts</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="text-xs text-brand-600 hover:underline font-semibold"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    {current.emergencyContacts.slice(0, 3).map((c, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 block">{c.name}</span>
                          <span className="text-[10px] text-slate-500">{c.relationship} • {c.phone}</span>
                        </div>
                        {c.isPrimary && (
                          <span className="px-2 py-0.5 rounded bg-emergency-100 text-emergency-800 text-[10px] font-bold">
                            PRIMARY
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Widget 4: Recent Scans */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-card">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <History className="w-5 h-5 text-brand-600" />
                      <h3 className="text-sm font-bold text-slate-900">Recent Scans</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="text-xs text-brand-600 hover:underline font-semibold"
                    >
                      View All ({scans.length})
                    </button>
                  </div>

                  {scans.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No scan events recorded yet.</p>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {scans.slice(0, 2).map((s) => (
                        <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-bold text-slate-900">{new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="text-[10px] font-bold text-safe-700">{s.locationStatus}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{s.approxLocation || 'Direct lookup'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Widget 5: Recent Alerts (Full Width) */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-card md:col-span-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-emergency-600" />
                      <h3 className="text-sm font-bold text-slate-900">Recent Emergency Alerts & Notifications</h3>
                    </div>
                    <span className="text-xs font-mono text-slate-500">{alerts.length} Total Alerts</span>
                  </div>

                  {alerts.length === 0 ? (
                    <p className="text-xs text-slate-500 py-3">No active emergency alerts recorded. All systems normal.</p>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {alerts.slice(0, 3).map((a) => (
                        <div key={a.id} className="p-3 rounded-xl bg-emergency-50 border border-emergency-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-emergency-900 block">
                              {a.alertType === 'manual_sos' ? '🆘 Emergency SOS Alert' : '🚨 Missed Safety Check-in Alert'}
                            </span>
                            <span className="text-[11px] text-slate-600">{a.notes || `Alert triggered during journey (${a.journeyType})`}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">
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
            <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-card">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-600" />
                  Edit Emergency Profile
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Updates sync dynamically with your permanent ResQTag (<span className="font-mono text-slate-900 font-bold">{current.shortCode}</span>).
                </p>
              </div>

              {saveSuccessMessage && (
                <div className="p-3.5 rounded-xl bg-safe-50 border border-safe-200 text-safe-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-safe-600 shrink-0" />
                  <span>{saveSuccessMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-emergency-50 border border-emergency-200 text-emergency-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-emergency-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Blood Group</label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {BLOOD_GROUPS.map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setBloodGroup(bg)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          bloodGroup === bg
                            ? 'bg-emergency-600 text-white border-emergency-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Vehicle Registration Number</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono uppercase"
                    required
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Known Allergies</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Important Medical Information</label>
                  <textarea
                    rows={3}
                    value={medicalInfo}
                    onChange={(e) => setMedicalInfo(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Residential Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-emergency-600" />
                  <span>Emergency Contacts</span>
                </h3>

                {emergencyContacts.map((contact, idx) => (
                  <div key={contact.id || idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase">
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
                        className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
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
                        className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
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
                        className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save & Update Profile'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: QR & STICKERS */}
          {activeTab === 'qr' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-brand-600" />
                    My ResQTag Sticker
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your unique emergency identifier connected to this profile.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('sticker')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Weatherproof Sticker</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Physical Sticker Card Preview */}
                <div className="bg-white text-slate-900 rounded-2xl p-6 border-2 border-slate-900 shadow-sticker max-w-sm mx-auto text-center space-y-3">
                  <div className="bg-emergency-600 text-white py-1 px-3 rounded text-xs font-black uppercase tracking-wider">
                    SCAN IN CASE OF EMERGENCY
                  </div>

                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl inline-block shadow-inner">
                    <QRCodeSVG value={scanUrl} size={150} level="H" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Backup Short Code</div>
                    <div className="text-2xl font-black font-mono tracking-widest text-slate-900 bg-slate-100 py-1 px-3 rounded-lg border border-slate-300 inline-block">
                      {current.shortCode}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-700 font-mono font-bold pt-1 border-t border-slate-200">
                    <span>VEHICLE: {current.vehicleNumber}</span>
                    <span className="text-emergency-600">BLOOD: {current.bloodGroup}</span>
                  </div>
                </div>

                <div className="space-y-4 text-xs text-slate-600">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-600" />
                      Dynamic Cloud Resolution
                    </h4>
                    <p className="leading-relaxed">
                      Because the QR points to your permanent Tag ID (<code className="font-mono text-slate-900 font-bold">{current.shortCode}</code>), you can update your phone numbers or medical info at any time without needing to replace printed decals.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-safe-600" />
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
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                    <History className="w-5 h-5 text-brand-600" />
                    Scan History Log
                  </h2>
                  <p className="text-xs text-slate-500">
                    Audit log of every time your ResQTag was scanned.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-mono font-bold border border-slate-200">
                  {scans.length} Events
                </span>
              </div>

              {isLoadingScans ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading scan logs...</div>
              ) : scans.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-slate-400" />
                  <p>No scan events logged yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scans.map((scan) => (
                    <div
                      key={scan.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono">
                            {new Date(scan.timestamp).toLocaleDateString()} at {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              scan.locationStatus === 'Location shared'
                                ? 'bg-safe-50 text-safe-700 border border-safe-200'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {scan.locationStatus}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-slate-600 font-mono text-[11px]">
                          <span>Vehicle: <strong>{scan.vehicleNumber || current.vehicleNumber}</strong></span>
                          <span>•</span>
                          <span>Device: {scan.scannerDevice}</span>
                        </div>

                        <div className="text-[11px] text-slate-500">
                          Location: {scan.approxLocation || 'Location not shared'}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-safe-700 bg-safe-50 px-2.5 py-1 rounded font-semibold border border-safe-200">
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
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-card">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-emergency-600" />
                  Notifications & Incident Alerts
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time alerts sent to your emergency contacts.
                </p>
              </div>

              {alerts.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No emergency alerts recorded.
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  {alerts.map((a) => (
                    <div key={a.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {a.alertType === 'manual_sos' ? '🆘 Emergency SOS Alert' : '🚨 Missed Safety Check-in Alert'}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">{new Date(a.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-600">{a.notes || `Emergency alert triggered for ${a.userName} on journey (${a.journeyType})`}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SETTINGS & HACKATHON RESET */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-card">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-700" />
                  Account & Hackathon Demo Settings
                </h2>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900">Reset Fictional Demo Data</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Restores Rahul Kumar (KA-01-AB-1234) for fresh hackathon judging.
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      if (window.confirm('Reset demo data to initial state?')) {
                        await resetDemo();
                        alert('Demo data successfully reset!');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    Reset Demo
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
