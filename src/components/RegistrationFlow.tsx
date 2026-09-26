import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Heart, 
  MapPin, 
  Car, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import type { BloodGroup, EmergencyContact, UserProfile } from '../types';

interface RegistrationFlowProps {
  onNavigate: (view: string, param?: string) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
];

export const RegistrationFlow: React.FC<RegistrationFlowProps> = ({ onNavigate }) => {
  // Wizard Steps: 1: Profile Info, 2: Emergency Contacts, 3: OTP Verification, 4: Created Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | string>(26);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | string>('O+');
  const [phone, setPhone] = useState('+91 98450 ');
  const [address, setAddress] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalInfo, setMedicalInfo] = useState('');
  const [photoUrl, setPhotoUrl] = useState(AVATAR_PRESETS[0]);

  // Emergency Contacts
  const [contact1, setContact1] = useState<EmergencyContact>({
    id: 'c1',
    name: '',
    relationship: 'Father',
    phone: '+91 98765 ',
    isPrimary: true,
  });

  const [contact2, setContact2] = useState<EmergencyContact>({
    id: 'c2',
    name: '',
    relationship: 'Spouse',
    phone: '',
    isPrimary: false,
  });

  const [contact3, setContact3] = useState<EmergencyContact>({
    id: 'c3',
    name: '',
    relationship: 'Friend',
    phone: '',
    isPrimary: false,
  });

  // OTP State
  const [otp, setOtp] = useState('');
  const [demoOtpCode, setDemoOtpCode] = useState('123456');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Generated Profile on completion
  const [createdProfile, setCreatedProfile] = useState<UserProfile | null>(null);

  // Quick fill sample data for testing
  const handlePrefillSample = () => {
    setFullName('Karthik Rao');
    setAge(28);
    setBloodGroup('B+');
    setPhone('+91 98860 12345');
    setVehicleNumber('KA-05-MK-9021');
    setAddress('Flat 301, Green Meadows, HSR Layout Sector 2, Bengaluru - 560102');
    setAllergies('Aspirin, Shellfish');
    setMedicalInfo('Hypertension (On daily Telmisartan 40mg), Mild Sinusitis');
    setContact1({ id: 'c1', name: 'Suresh Rao', relationship: 'Father', phone: '+91 98440 98765', isPrimary: true });
    setContact2({ id: 'c2', name: 'Ananya Rao', relationship: 'Sister', phone: '+91 98440 54321', isPrimary: false });
    setContact3({ id: 'c3', name: 'Vikram Mehta', relationship: 'Colleague', phone: '+91 99000 11223', isPrimary: false });
  };

  // Step 1 Validation
  const validateStep1 = () => {
    setErrorMessage('');
    if (!fullName.trim()) {
      setErrorMessage('Full Name is required.');
      return false;
    }
    if (!phone.trim() || phone.length < 8) {
      setErrorMessage('Please enter a valid phone number.');
      return false;
    }
    if (!vehicleNumber.trim()) {
      setErrorMessage('Vehicle Number is required for emergency tag association.');
      return false;
    }
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    setErrorMessage('');
    if (!contact1.name.trim() || !contact1.phone.trim() || contact1.phone.length < 8) {
      setErrorMessage('Primary Emergency Contact (Contact 1) with name and phone number is required.');
      return false;
    }
    return true;
  };

  // Send OTP
  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    setErrorMessage('');
    try {
      const res = await api.sendOtp(phone);
      if (res.success) {
        setDemoOtpCode(res.demoOtp || '123456');
        setStep(3);
      } else {
        setErrorMessage('Failed to send OTP. Please try again.');
      }
    } catch {
      setErrorMessage('Network error while requesting OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP and Create Profile
  const handleVerifyAndCreate = async () => {
    if (!otp.trim()) {
      setErrorMessage('Please enter the 6-digit OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMessage('');

    try {
      const contacts: EmergencyContact[] = [contact1];
      if (contact2.name.trim() && contact2.phone.trim()) contacts.push(contact2);
      if (contact3.name.trim() && contact3.phone.trim()) contacts.push(contact3);

      const res = await api.createProfile({
        fullName,
        phone,
        age: Number(age) || 25,
        bloodGroup,
        address,
        vehicleNumber: vehicleNumber.toUpperCase().trim(),
        allergies: allergies || 'None reported',
        medicalInfo: medicalInfo || 'No major medical conditions reported',
        emergencyContacts: contacts,
        photoUrl,
      });

      if (res.success && res.profile) {
        setCreatedProfile(res.profile);
        setStep(4);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore confetti error if blocked
        }
      } else {
        setErrorMessage(res.error || 'Failed to complete registration.');
      }
    } catch {
      setErrorMessage('Error verifying OTP and creating profile.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-slate-900">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span className={step >= 1 ? 'text-brand-700 font-bold' : ''}>1. Identity & Medical</span>
          <span className={step >= 2 ? 'text-brand-700 font-bold' : ''}>2. SOS Contacts</span>
          <span className={step >= 3 ? 'text-brand-700 font-bold' : ''}>3. OTP Verification</span>
          <span className={step >= 4 ? 'text-safe-700 font-bold' : ''}>4. Tag Generated</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-brand-600 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-emergency-50 border border-emergency-200 text-emergency-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-emergency-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: PERSONAL & MEDICAL INFORMATION */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-600" />
                  Personal & Emergency Medical Details
                </h2>
                <p className="text-xs text-slate-500">
                  This vital information will be accessible to emergency responders upon scanning.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePrefillSample}
                className="text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-xl transition-colors self-start sm:self-auto"
              >
                ⚡ Autofill Sample Data
              </button>
            </div>

            {/* Profile Avatar Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Profile Photo (Helps Responders Visually Identify Victim)
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={photoUrl}
                  alt="Profile Preview"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                />
                <div className="space-y-1">
                  <div className="flex gap-2">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <img
                        key={idx}
                        src={preset}
                        alt={`Preset ${idx + 1}`}
                        onClick={() => setPhotoUrl(preset)}
                        className={`w-9 h-9 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                          photoUrl === preset ? 'border-brand-600 scale-105 shadow-sm' : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500">Select avatar or enter custom photo URL below</span>
                </div>
              </div>
              <input
                type="text"
                placeholder="Or paste direct image URL (https://...)"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-brand-600"
              />
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  Full Name <span className="text-emergency-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Rahul Kumar"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-brand-600"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  Owner Phone Number <span className="text-emergency-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="+91 98450 11223"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-brand-600"
                  />
                </div>
              </div>

              {/* Age */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="24"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-brand-600"
                />
              </div>

              {/* Blood Group */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  Blood Group <span className="text-emergency-600">* (Critical for Triage)</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {BLOOD_GROUPS.map(bg => (
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

              {/* Vehicle Number */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  Vehicle Registration Number <span className="text-emergency-600">*</span>
                </label>
                <div className="relative">
                  <Car className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. KA-01-AB-1234 / MH-12-CD-5678"
                    value={vehicleNumber}
                    onChange={e => setVehicleNumber(e.target.value.toUpperCase())}
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono uppercase focus:outline-none focus:border-brand-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Affixing the ResQTag on your helmet or vehicle connects this identifier.
                </p>
              </div>

              {/* Allergies */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Known Allergies (Medications / Food / Environmental)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Peanuts, Sulfa drugs (or 'None')"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-brand-600"
                />
              </div>

              {/* Medical Information */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-brand-600" />
                  Important Medical Info & Emergency Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Asthmatic (carries blue inhaler in bag), Diabetic Type 2"
                  value={medicalInfo}
                  onChange={e => setMedicalInfo(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-brand-600"
                />
              </div>

              {/* Address */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Residential Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. #402, Sunshine Residency, Indiranagar, Bengaluru"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-brand-600"
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onNavigate('landing')}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all flex items-center gap-2"
              >
                <span>Continue to SOS Contacts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: EMERGENCY CONTACTS */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                <Heart className="w-5 h-5 text-emergency-600" />
                Trusted Emergency Contacts
              </h2>
              <p className="text-xs text-slate-500">
                Responders can 1-tap call these numbers directly from the scanned emergency screen.
              </p>
            </div>

            {/* Contact 1 (Primary) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-safe-600" />
                  Primary Emergency Contact 1 (Required)
                </span>
                <span className="px-2 py-0.5 rounded bg-emergency-100 text-emergency-800 text-[10px] font-bold border border-emergency-200">
                  PRIMARY SOS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Ramesh Kumar)"
                  value={contact1.name}
                  onChange={e => setContact1({ ...contact1, name: e.target.value })}
                  className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-brand-600"
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g. Father, Spouse)"
                  value={contact1.relationship}
                  onChange={e => setContact1({ ...contact1, relationship: e.target.value })}
                  className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-brand-600"
                />
                <input
                  type="text"
                  placeholder="Phone (e.g. +91 98765 43210)"
                  value={contact1.phone}
                  onChange={e => setContact1({ ...contact1, phone: e.target.value })}
                  className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-brand-600"
                />
              </div>
            </div>

            {/* Contact 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Emergency Contact 2 (Secondary)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Priya Sharma)"
                  value={contact2.name}
                  onChange={e => setContact2({ ...contact2, name: e.target.value })}
                  className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-brand-600"
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g. Spouse / Brother)"
                  value={contact2.relationship}
                  onChange={e => setContact2({ ...contact2, relationship: e.target.value })}
                  className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-brand-600"
                />
                <input
                  type="text"
                  placeholder="Phone (+91 ...)"
                  value={contact2.phone}
                  onChange={e => setContact2({ ...contact2, phone: e.target.value })}
                  className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-brand-600"
                />
              </div>
            </div>

            {/* Contact 3 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Emergency Contact 3 (Doctor / Neighbor)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Dr. Arvind Swamy)"
                  value={contact3.name}
                  onChange={e => setContact3({ ...contact3, name: e.target.value })}
                  className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-brand-600"
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g. Doctor / Friend)"
                  value={contact3.relationship}
                  onChange={e => setContact3({ ...contact3, relationship: e.target.value })}
                  className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-brand-600"
                />
                <input
                  type="text"
                  placeholder="Phone (+91 ...)"
                  value={contact3.phone}
                  onChange={e => setContact3({ ...contact3, phone: e.target.value })}
                  className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-brand-600"
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Details
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateStep2()) handleSendOtp();
                }}
                disabled={isSendingOtp}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all flex items-center gap-2"
              >
                {isSendingOtp ? (
                  <span>Sending OTP...</span>
                ) : (
                  <>
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PHONE & OTP VERIFICATION */}
        {step === 3 && (
          <div className="space-y-6 max-w-md mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-950">Verify Phone Number</h2>
              <p className="text-xs text-slate-500">
                We sent a 6-digit authentication code to <strong className="text-slate-900 font-mono">{phone}</strong>
              </p>
            </div>

            {/* Safe Demo OTP Helper Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  HACKATHON DEMO OTP:
                </span>
                <span className="font-mono font-bold text-sm bg-amber-200/60 px-2 py-0.5 rounded text-amber-900">
                  {demoOtpCode}
                </span>
              </div>
              <p className="text-[11px] text-amber-800">
                For hackathon evaluation, click below to autofill this code immediately.
              </p>
              <button
                type="button"
                onClick={() => setOtp(demoOtpCode)}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-amber-100 font-bold text-xs text-amber-900 border border-amber-300 shadow-sm transition-colors"
              >
                ⚡ 1-Click Autofill Code ({demoOtpCode})
              </button>
            </div>

            {/* OTP Input */}
            <div className="space-y-2">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full text-2xl tracking-[0.5em] text-center font-mono py-3.5 bg-slate-50 border-2 border-slate-300 rounded-2xl text-slate-950 focus:outline-none focus:border-brand-600 focus:bg-white"
              />
            </div>

            {/* Verification Button */}
            <button
              type="button"
              onClick={handleVerifyAndCreate}
              disabled={isVerifyingOtp}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {isVerifyingOtp ? (
                <span>Generating ResQTag...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Verify & Generate ResQTag</span>
                </>
              )}
            </button>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="hover:text-slate-900"
              >
                Change Phone / Contacts
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-brand-600 hover:underline font-semibold"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS & RESQTAG GENERATED */}
        {step === 4 && createdProfile && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-safe-50 text-safe-600 border border-safe-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-slate-950">
                ResQTag Successfully Generated!
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your life-saving emergency profile is now active and connected to your unique ResQTag identifier.
              </p>
            </div>

            {/* Card Showing Generated Tag ID and Short Code */}
            <div className="max-w-md mx-auto p-6 rounded-3xl bg-slate-50 border border-slate-200 text-left space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">ResQTag Secure ID</span>
                  <div className="text-sm font-mono font-bold text-slate-900">{createdProfile.tagId}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Backup Short Code</span>
                  <div className="text-lg font-mono font-black text-brand-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {createdProfile.shortCode}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-500 block">NAME</span>
                  <strong>{createdProfile.fullName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">BLOOD GROUP</span>
                  <strong className="text-emergency-600 font-bold">{createdProfile.bloodGroup}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">VEHICLE</span>
                  <strong>{createdProfile.vehicleNumber}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">EMERGENCY CONTACT</span>
                  <strong>{createdProfile.emergencyContacts[0]?.name}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-600 shrink-0" />
                <span>
                  <strong>Strict Privacy:</strong> The QR contains only the secure ID token, never unencrypted personal info.
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Go to Owner Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('sticker')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print QR Stickers</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
