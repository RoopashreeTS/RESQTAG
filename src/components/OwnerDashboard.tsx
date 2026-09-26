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
  ShieldCheck, 
  Heart, 
  Printer, 
  Clock, 
  Smartphone, 
  Sparkles, 
  ExternalLink,
  Trees
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { api, INITIAL_DEMO_DATA } from '../services/api';
import type { ScanEvent, BloodGroup, EmergencyContact } from '../types';

interface OwnerDashboardProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenSimulator: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onNavigate, onOpenSimulator }) => {
  const { profile, token, logout, updateProfile, resetDemo } = useAuth();
  const current = profile || INITIAL_DEMO_DATA;

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'qr' | 'history' | 'settings'>('overview');

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

  // Scan History
  const [scans, setScans] = useState<ScanEvent[]>([]);
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

  // Load scan history
  useEffect(() => {
    const fetchScans = async () => {
      setIsLoadingScans(true);
      try {
        const data = await api.getScanHistory(token || undefined, current.tagId);
        setScans(data);
      } catch (err) {
        console.error('Failed to load scan history:', err);
      } finally {
        setIsLoadingScans(false);
      }
    };

    fetchScans();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / User Welcome */}
      <div className="bg-navy-900 border border-navy-750 rounded-2xl p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={
              current.photoUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
            }
            alt={current.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emergency-500 shadow-glow-red"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{current.fullName}</h1>
              <span className="px-2 py-0.5 rounded-full bg-emergency-600/20 text-emergency-500 text-[10px] font-bold border border-emergency-500/30">
                ACTIVE TAG
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 font-mono">
              <span>TAG ID: <strong className="text-white">{current.tagId}</strong></span>
              <span>•</span>
              <span>CODE: <strong className="text-amber-300">{current.shortCode}</strong></span>
              <span>•</span>
              <span className="text-emergency-500 font-bold">BLOOD: {current.bloodGroup}</span>
            </div>
          </div>
        </div>

        {/* Quick Simulator Link */}
        <button
          onClick={onOpenSimulator}
          className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simulate Emergency Scan</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-2">
          <nav className="bg-navy-900 border border-navy-750 rounded-2xl p-2 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-emergency-600 text-white shadow-glow-red'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-emergency-600 text-white shadow-glow-red'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Profile & Medical Info</span>
            </button>

            <button
              onClick={() => setActiveTab('qr')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'qr'
                  ? 'bg-emergency-600 text-white shadow-glow-red'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>My QR & Stickers</span>
            </button>

            <button
              onClick={() => onNavigate('safejourney')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-emerald-400 hover:bg-emerald-950/40 border border-emerald-500/20 hover:border-emerald-500/50 transition-all"
            >
              <Trees className="w-4 h-4 text-emerald-400" />
              <span>🌲 SafeJourney (Proactive)</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-emergency-600 text-white shadow-glow-red'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800'
              }`}
            >
              <History className="w-4 h-4" />
              <div className="flex-1 text-left flex justify-between items-center">
                <span>Scan History</span>
                <span className="px-1.5 py-0.5 rounded bg-navy-950 text-brand-cyan text-[10px] font-mono">
                  {scans.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-emergency-600 text-white shadow-glow-red'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings & Security</span>
            </button>

            <div className="pt-2 border-t border-navy-800">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>

          {/* Quick Public Preview Card */}
          <div className="bg-navy-900 border border-navy-750 rounded-2xl p-4 text-center space-y-3">
            <div className="text-xs font-bold text-slate-300">Public Responder View</div>
            <div className="p-2 bg-white rounded-xl inline-block shadow-inner">
              <QRCodeSVG value={scanUrl} size={110} />
            </div>
            <button
              onClick={() => onNavigate('emergency-profile', current.shortCode)}
              className="w-full py-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-brand-cyan border border-navy-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Test Public View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-navy-900 border border-navy-750 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Tag Scans
                  </div>
                  <div className="text-3xl font-black text-white font-mono">{scans.length}</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Emergency logging active</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-navy-900 border border-navy-750 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Last Scan Recorded
                  </div>
                  <div className="text-sm font-bold text-white">
                    {scans.length > 0 ? new Date(scans[0].timestamp).toLocaleDateString() : 'No scans yet'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {scans.length > 0 ? new Date(scans[0].timestamp).toLocaleTimeString() : 'Ready for emergency'}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-navy-900 border border-navy-750 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Profile Status
                  </div>
                  <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>100% Complete</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Vehicle: {current.vehicleNumber}
                  </div>
                </div>
              </div>

              {/* Emergency Profile Summary Card */}
              <div className="bg-navy-900 border border-navy-750 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emergency-500" />
                    Emergency Identity Summary
                  </h3>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="text-xs font-bold text-brand-cyan hover:underline"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Blood Group</span>
                    <div className="text-xl font-black font-mono text-emergency-500">{current.bloodGroup}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Vehicle Registered</span>
                    <div className="text-base font-bold font-mono text-white">{current.vehicleNumber}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 space-y-1 sm:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-amber-400">Critical Allergies</span>
                    <div className="text-xs font-medium text-white">{current.allergies || 'None reported'}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 space-y-1 sm:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-brand-cyan">Medical Conditions</span>
                    <div className="text-xs font-medium text-slate-200">{current.medicalInfo || 'No major conditions'}</div>
                  </div>
                </div>
              </div>

              {/* Recent Scan History Feed */}
              <div className="bg-navy-900 border border-navy-750 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-cyan" />
                    Recent Scan Events
                  </h3>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="text-xs font-bold text-brand-cyan hover:underline"
                  >
                    View All ({scans.length})
                  </button>
                </div>

                {scans.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No scan events recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {scans.slice(0, 3).map((scan) => (
                      <div
                        key={scan.id}
                        className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">
                              {new Date(scan.timestamp).toLocaleDateString()} at {new Date(scan.timestamp).toLocaleTimeString()}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                scan.locationStatus === 'Location shared'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {scan.locationStatus}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {scan.approxLocation || 'Location not shared'}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                          {scan.scannerDevice}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY PROFILE & EDIT */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="bg-navy-900 border border-navy-750 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-navy-800 pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-emergency-500" />
                    Edit Emergency Profile
                  </h2>
                  <span className="px-2.5 py-1 rounded bg-brand-cyan/20 text-brand-cyan text-[11px] font-bold border border-brand-cyan/30">
                    QR Stays Active Forever
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Updates sync instantly with your existing ResQTag (<span className="font-mono text-amber-300">{current.shortCode}</span>). No need to reprint stickers!
                </p>
              </div>

              {/* Feedback messages */}
              {saveSuccessMessage && (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{saveSuccessMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-xl bg-emergency-600/20 border border-emergency-500/50 text-emergency-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-emergency-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 bg-navy-800 border border-navy-700 rounded-xl text-white focus:outline-none focus:border-emergency-500"
                    required
                  />
                </div>

                {/* Age */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 bg-navy-800 border border-navy-700 rounded-xl text-white focus:outline-none focus:border-emergency-500"
                  />
                </div>

                {/* Blood Group */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Blood Group</label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {BLOOD_GROUPS.map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setBloodGroup(bg)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          bloodGroup === bg
                            ? 'bg-emergency-600 text-white border-emergency-500 shadow-glow-red'
                            : 'bg-navy-800 text-slate-300 border-navy-700 hover:border-slate-500'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vehicle Number */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Vehicle Registration Number</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    className="w-full text-sm px-3 py-2.5 bg-navy-800 border border-navy-700 rounded-xl text-white font-mono uppercase focus:outline-none focus:border-emergency-500"
                    required
                  />
                </div>

                {/* Allergies */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Known Allergies (Medication / Food)</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 bg-navy-800 border border-navy-700 rounded-xl text-white focus:outline-none focus:border-emergency-500"
                  />
                </div>

                {/* Medical Information */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Important Medical Conditions & Notes</label>
                  <textarea
                    rows={3}
                    value={medicalInfo}
                    onChange={(e) => setMedicalInfo(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 bg-navy-800 border border-navy-700 rounded-xl text-white focus:outline-none focus:border-emergency-500"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Residential Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 bg-navy-800 border border-navy-700 rounded-xl text-white focus:outline-none focus:border-emergency-500"
                  />
                </div>
              </div>

              {/* Emergency Contacts Section */}
              <div className="space-y-4 pt-4 border-t border-navy-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emergency-500" />
                  Emergency Contacts
                </h3>

                {emergencyContacts.map((contact, idx) => (
                  <div key={contact.id || idx} className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 uppercase">
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
                        className="text-xs px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white"
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
                        className="text-xs px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white"
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
                        className="text-xs px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-navy-800">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-emergency-600 to-emergency-700 text-white font-bold text-sm shadow-glow-red hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save & Update Profile'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: MY QR & STICKERS */}
          {activeTab === 'qr' && (
            <div className="bg-navy-900 border border-navy-750 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emergency-500" />
                    My ResQTag Sticker & Digital Pass
                  </h2>
                  <p className="text-xs text-slate-400">
                    Your unique emergency identifier connected to this profile.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('sticker')}
                  className="px-4 py-2 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-white text-xs font-bold shadow-glow-red flex items-center gap-1.5 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Open Printable Sheet</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Physical Sticker Card Preview */}
                <div className="bg-white text-slate-900 rounded-2xl p-6 border-4 border-slate-900 shadow-sticker max-w-sm mx-auto text-center space-y-3">
                  <div className="bg-emergency-600 text-white py-1 px-3 rounded text-xs font-black uppercase tracking-wider">
                    SCAN IN CASE OF EMERGENCY
                  </div>

                  <div className="p-2 bg-white border border-slate-300 rounded-xl inline-block shadow-inner">
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

                {/* Info & Details */}
                <div className="space-y-4 text-xs text-slate-300">
                  <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Dynamic Cloud Resolution
                    </h4>
                    <p className="leading-relaxed">
                      Because the QR points to your permanent Tag ID (<code className="font-mono text-amber-300">{current.shortCode}</code>), you can update your phone numbers or medical info at any time without needing to replace printed physical decals.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-brand-cyan" />
                      Zero App Required
                    </h4>
                    <p className="leading-relaxed">
                      Responders, good samaritans, and paramedics can scan this with any iPhone or Android camera app directly in the default browser.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SCAN HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-navy-900 border border-navy-750 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-navy-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-emergency-500" />
                    Scan History Log
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real-time audit log of every time your ResQTag was scanned.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-navy-800 text-slate-300 text-xs font-mono font-bold border border-navy-700">
                  {scans.length} Events
                </span>
              </div>

              {isLoadingScans ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading scan logs...</div>
              ) : scans.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-slate-600" />
                  <p>No scan events logged yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scans.map((scan) => (
                    <div
                      key={scan.id}
                      className="p-4 rounded-xl bg-navy-850 border border-navy-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">
                            {new Date(scan.timestamp).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="text-slate-400 font-mono">
                            {new Date(scan.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              scan.locationStatus === 'Location shared'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {scan.locationStatus}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-slate-300 font-mono text-[11px]">
                          <span>Vehicle: <strong>{scan.vehicleNumber || current.vehicleNumber}</strong></span>
                          <span>•</span>
                          <span>Device: {scan.scannerDevice}</span>
                        </div>

                        <div className="text-[11px] text-slate-400">
                          Location: {scan.approxLocation || 'Location not shared'}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded font-semibold border border-emerald-500/20">
                          ✓ Contacts Notified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SETTINGS & SECURITY */}
          {activeTab === 'settings' && (
            <div className="bg-navy-900 border border-navy-750 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-navy-800 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emergency-500" />
                  Account & Hackathon Demo Settings
                </h2>
              </div>

              <div className="space-y-4 text-xs">
                {/* Reset demo data */}
                <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white">Reset Fictional Demo Data</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Restores Rahul Kumar (KA-01-AB-1234) and initial scan events for fresh hackathon judging.
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      if (window.confirm('Reset demo data to initial state?')) {
                        await resetDemo();
                        alert('Demo data successfully reset!');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-rose-950/40 text-rose-300 border border-rose-500/40 font-bold transition-colors"
                  >
                    Reset Demo State
                  </button>
                </div>

                {/* Privacy & Security guarantee */}
                <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
                  <h4 className="font-bold text-white">Privacy & Security Policies</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    ResQTag adheres to zero-knowledge QR encoding. No sensitive credentials or plaintext database contents are stored inside physical QR codes. Location is only captured when explicitly permitted by the scanner.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
