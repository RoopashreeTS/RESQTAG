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
import { ProfilePhotoUploader } from './ProfilePhotoUploader';

interface RegistrationFlowProps {
  onNavigate: (view: string, param?: string) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-[#2B2020] relative z-10">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-[#806F6F] mb-2.5">
          <span className={step >= 1 ? 'text-[#E53935] font-bold flex items-center gap-1' : ''}>
            <span className="w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] bg-red-100 text-[#E53935] font-black">1</span>
            Identity & Medical
          </span>
          <span className={step >= 2 ? 'text-[#E53935] font-bold flex items-center gap-1' : ''}>
            <span className="w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] bg-red-100 text-[#E53935] font-black">2</span>
            SOS Contacts
          </span>
          <span className={step >= 3 ? 'text-[#E53935] font-bold flex items-center gap-1' : ''}>
            <span className="w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] bg-red-100 text-[#E53935] font-black">3</span>
            OTP Verification
          </span>
          <span className={step >= 4 ? 'text-emerald-700 font-bold flex items-center gap-1' : ''}>
            <span className="w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] bg-emerald-100 text-emerald-700 font-black">4</span>
            Tag Ready
          </span>
        </div>
        <div className="w-full bg-[#FFE5E5] h-2.5 rounded-full overflow-hidden p-0.5 border border-red-200">
          <div
            className="bg-gradient-to-r from-[#E53935] to-[#FF6B6B] h-full rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Container Card */}
      <div className="glass-card-rose-solid rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-[#FFEFEF] border border-red-200 text-[#C62828] text-xs flex items-center gap-2 animate-in fade-in shadow-sm">
            <AlertTriangle className="w-4 h-4 text-[#E53935] shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: PERSONAL & MEDICAL INFORMATION */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#2B2020] flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FFEFEF] flex items-center justify-center text-[#E53935]">
                    <User className="w-4 h-4" />
                  </div>
                  Personal & Emergency Medical Details
                </h2>
                <p className="text-xs text-[#806F6F] mt-0.5">
                  This vital information will be accessible to emergency responders upon scanning.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePrefillSample}
                className="btn-rose-outline text-xs px-3.5 py-1.5 rounded-xl font-semibold self-start sm:self-auto"
              >
                ⚡ Autofill Sample Data
              </button>
            </div>

            {/* Profile Photo Upload */}
            <ProfilePhotoUploader
              photoUrl={photoUrl}
              onPhotoChange={setPhotoUrl}
            />

            {/* Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2B2020] flex items-center gap-1">
                  Full Name <span className="text-[#E53935]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#806F6F] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Rahul Kumar"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-white/90 border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15 transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2B2020] flex items-center gap-1">
                  Owner Phone Number <span className="text-[#E53935]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#806F6F] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="+91 98450 11223"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-white/90 border border-red-200 rounded-xl text-[#2B2020] font-mono focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15 transition-all"
                  />
                </div>
              </div>

              {/* Age */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2B2020]">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="24"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white/90 border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15 transition-all"
                />
              </div>

              {/* Blood Group */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2B2020] flex items-center gap-1">
                  Blood Group <span className="text-[#E53935] font-bold">* (Critical for Triage)</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {BLOOD_GROUPS.map(bg => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        bloodGroup === bg
                          ? 'bg-gradient-to-r from-[#E53935] to-[#C62828] text-white border-[#C62828] shadow-md -translate-y-0.5'
                          : 'bg-white/80 text-[#2B2020] border-red-200 hover:border-[#E53935]/60 hover:bg-[#FFEFEF]'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Number */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-[#2B2020] flex items-center gap-1">
                  Vehicle Registration Number <span className="text-[#E53935]">*</span>
                </label>
                <div className="relative">
                  <Car className="w-4 h-4 text-[#806F6F] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. KA-01-AB-1234 / MH-12-CD-5678"
                    value={vehicleNumber}
                    onChange={e => setVehicleNumber(e.target.value.toUpperCase())}
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-white/90 border border-red-200 rounded-xl text-[#2B2020] font-mono uppercase focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15 transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#806F6F]">
                  Affixing the ResQTag on your helmet or vehicle connects this identifier.
                </p>
              </div>

              {/* Allergies */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-[#2B2020] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Known Allergies (Medications / Food / Environmental)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Peanuts, Sulfa drugs (or 'None')"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white/90 border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15 transition-all"
                />
              </div>

              {/* Medical Information */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-[#2B2020] flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#E53935]" />
                  Important Medical Info & Emergency Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Asthmatic (carries blue inhaler in bag), Diabetic Type 2"
                  value={medicalInfo}
                  onChange={e => setMedicalInfo(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white/90 border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15 transition-all"
                />
              </div>

              {/* Address */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-[#2B2020] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#806F6F]" />
                  Residential Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. #402, Sunshine Residency, Indiranagar, Bengaluru"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white/90 border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15 transition-all"
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-red-100">
              <button
                type="button"
                onClick={() => onNavigate('landing')}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#806F6F] hover:text-[#2B2020] hover:bg-[#FFEFEF] transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="btn-rose-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
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
            <div className="border-b border-red-100 pb-4">
              <h2 className="text-xl font-bold text-[#2B2020] flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFEFEF] flex items-center justify-center text-[#E53935]">
                  <Heart className="w-4 h-4" />
                </div>
                Trusted Emergency Contacts
              </h2>
              <p className="text-xs text-[#806F6F] mt-0.5">
                Responders can 1-tap call these numbers directly from the scanned emergency screen.
              </p>
            </div>

            {/* Contact 1 (Primary) */}
            <div className="p-4 rounded-2xl bg-white/80 border-2 border-red-200/90 space-y-3 relative shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2B2020] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Primary Emergency Contact 1 (Required)
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-[#FFEFEF] text-[#E53935] text-[10px] font-black border border-red-200">
                  PRIMARY SOS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Ramesh Kumar)"
                  value={contact1.name}
                  onChange={e => setContact1({ ...contact1, name: e.target.value })}
                  className="text-xs px-3 py-2.5 bg-white border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15"
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g. Father, Spouse)"
                  value={contact1.relationship}
                  onChange={e => setContact1({ ...contact1, relationship: e.target.value })}
                  className="text-xs px-3 py-2.5 bg-white border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15"
                />
                <input
                  type="text"
                  placeholder="Phone (e.g. +91 98765 43210)"
                  value={contact1.phone}
                  onChange={e => setContact1({ ...contact1, phone: e.target.value })}
                  className="text-xs px-3 py-2.5 bg-white border border-red-200 rounded-xl text-[#2B2020] font-mono focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15"
                />
              </div>
            </div>

            {/* Contact 2 */}
            <div className="p-4 rounded-2xl bg-white/60 border border-red-100 space-y-3">
              <span className="text-xs font-bold text-[#806F6F] uppercase tracking-wider">
                Emergency Contact 2 (Secondary)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Priya Sharma)"
                  value={contact2.name}
                  onChange={e => setContact2({ ...contact2, name: e.target.value })}
                  className="text-xs px-3 py-2.5 bg-white border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15"
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g. Spouse / Brother)"
                  value={contact2.relationship}
                  onChange={e => setContact2({ ...contact2, relationship: e.target.value })}
                  className="text-xs px-3 py-2.5 bg-white border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15"
                />
                <input
                  type="text"
                  placeholder="Phone (+91 ...)"
                  value={contact2.phone}
                  onChange={e => setContact2({ ...contact2, phone: e.target.value })}
                  className="text-xs px-3 py-2.5 bg-white border border-red-200 rounded-xl text-[#2B2020] font-mono focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15"
                />
              </div>
            </div>

            {/* Contact 3 */}
            <div className="p-4 rounded-2xl bg-white/60 border border-red-100 space-y-3">
              <span className="text-xs font-bold text-[#806F6F] uppercase tracking-wider">
                Emergency Contact 3 (Doctor / Neighbor)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Dr. Arvind Swamy)"
                  value={contact3.name}
                  onChange={e => setContact3({ ...contact3, name: e.target.value })}
                  className="text-xs px-3 py-2.5 bg-white border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15"
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g. Doctor / Friend)"
                  value={contact3.relationship}
                  onChange={e => setContact3({ ...contact3, relationship: e.target.value })}
                  className="text-xs px-3 py-2.5 bg-white border border-red-200 rounded-xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15"
                />
                <input
                  type="text"
                  placeholder="Phone (+91 ...)"
                  value={contact3.phone}
                  onChange={e => setContact3({ ...contact3, phone: e.target.value })}
                  className="text-xs px-3 py-2.5 bg-white border border-red-200 rounded-xl text-[#2B2020] font-mono focus:outline-none focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15"
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-red-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#806F6F] hover:text-[#2B2020] hover:bg-[#FFEFEF] transition-colors flex items-center gap-1.5"
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
                className="btn-rose-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
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
            <div className="w-14 h-14 rounded-2xl bg-[#FFEFEF] text-[#E53935] border border-red-200 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#2B2020]">Verify Phone Number</h2>
              <p className="text-xs text-[#806F6F]">
                We sent a 6-digit authentication code to <strong className="text-[#2B2020] font-mono">{phone}</strong>
              </p>
            </div>

            {/* Safe Demo OTP Helper Banner */}
            <div className="p-4 rounded-2xl bg-[#FFEFEF] border border-red-200 text-[#2B2020] text-xs space-y-2.5 text-left shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-[#C62828]">
                  <Sparkles className="w-4 h-4 text-[#E53935]" />
                  HACKATHON DEMO OTP:
                </span>
                <span className="font-mono font-black text-sm bg-white px-2.5 py-0.5 rounded-lg border border-red-200 text-[#E53935]">
                  {demoOtpCode}
                </span>
              </div>
              <p className="text-[11px] text-[#806F6F]">
                For hackathon evaluation, click below to autofill this code immediately.
              </p>
              <button
                type="button"
                onClick={() => setOtp(demoOtpCode)}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-red-50 font-bold text-xs text-[#E53935] border border-red-200 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95"
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
                className="w-full text-2xl tracking-[0.5em] text-center font-mono py-3.5 bg-white border-2 border-red-200 rounded-2xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-4 focus:ring-[#E53935]/15 transition-all shadow-inner"
              />
            </div>

            {/* Verification Button */}
            <button
              type="button"
              onClick={handleVerifyAndCreate}
              disabled={isVerifyingOtp}
              className="w-full btn-rose-primary py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
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

            <div className="flex justify-between items-center text-xs text-[#806F6F] pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="hover:text-[#2B2020] transition-colors"
              >
                Change Phone / Contacts
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-[#E53935] hover:underline font-semibold"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS & RESQTAG GENERATED */}
        {step === 4 && createdProfile && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-[#2B2020]">
                ResQTag Successfully Generated!
              </h2>
              <p className="text-xs text-[#806F6F] max-w-md mx-auto">
                Your life-saving emergency profile is now active and connected to your unique ResQTag identifier.
              </p>
            </div>

            {/* Card Showing Generated Tag ID and Short Code */}
            <div className="max-w-md mx-auto p-6 rounded-3xl bg-white/90 border border-red-200 text-left space-y-4 shadow-lg">
              <div className="flex justify-between items-center border-b border-red-100 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#806F6F]">ResQTag Secure ID</span>
                  <div className="text-sm font-mono font-bold text-[#2B2020]">{createdProfile.tagId}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#806F6F]">Backup Short Code</span>
                  <div className="text-lg font-mono font-black text-[#E53935] bg-[#FFEFEF] px-2.5 py-0.5 rounded-lg border border-red-200">
                    {createdProfile.shortCode}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#2B2020]">
                <div>
                  <span className="text-[10px] text-[#806F6F] block font-semibold">NAME</span>
                  <strong>{createdProfile.fullName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#806F6F] block font-semibold">BLOOD GROUP</span>
                  <strong className="text-[#E53935] font-bold">{createdProfile.bloodGroup}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#806F6F] block font-semibold">VEHICLE</span>
                  <strong>{createdProfile.vehicleNumber}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#806F6F] block font-semibold">EMERGENCY CONTACT</span>
                  <strong>{createdProfile.emergencyContacts[0]?.name}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FFF7F7] border border-red-100 text-[11px] text-[#806F6F] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#E53935] shrink-0" />
                <span>
                  <strong className="text-[#2B2020]">Strict Privacy:</strong> The QR contains only the secure ID token, never unencrypted personal info.
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto btn-rose-outline px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>Go to Owner Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('sticker')}
                className="w-full sm:w-auto btn-rose-primary px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
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
