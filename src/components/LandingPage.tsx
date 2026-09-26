import React from 'react';
import { 
  Shield, 
  QrCode, 
  UserPlus, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  MapPin, 
  PhoneCall, 
  Trees, 
  KeyRound, 
  HeartHandshake,
  Activity,
  Ambulance,
  ShieldCheck,
  Smartphone,
  EyeOff
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenSimulator: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenSimulator }) => {
  const { quickDemoLogin, isAuthenticated } = useAuth();
  const demoScanUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/#scan/RQ7K29`;

  return (
    <div className="space-y-20 pb-24 overflow-hidden bg-slate-50 text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-slate-100 text-xs font-semibold shadow-sm">
              <Shield className="w-3.5 h-3.5 text-brand-400" />
              <span>RESQTAG EMERGENCY PLATFORM</span>
              <span className="w-1.5 h-1.5 rounded-full bg-safe-500"></span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.12]">
              When the victim cannot speak,{<br className="hidden sm:inline" />}
              <span className="text-brand-600"> ResQTag speaks for them.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Smart emergency identification and proactive safety monitoring in one platform.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'register')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Get Started</span>
              </button>

              <button
                onClick={() => onNavigate('safejourney')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Trees className="w-4 h-4 text-safe-600" />
                <span>Explore SafeJourney</span>
              </button>

              <button
                onClick={() => onNavigate('scan')}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 transition-colors flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4 text-slate-600" />
                <span>Scan Tag</span>
              </button>
            </div>

            {/* Fast-Track Evaluator Quick Actions */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Hackathon Fast-Track:</span>
              <button
                onClick={async () => {
                  await quickDemoLogin();
                  onNavigate('dashboard');
                }}
                className="text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1 hover:underline"
              >
                <Zap className="w-3.5 h-3.5 text-brand-600" />
                Live Demo Dashboard
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={onOpenSimulator}
                className="text-emergency-700 hover:text-emergency-800 font-semibold flex items-center gap-1 hover:underline"
              >
                <Activity className="w-3.5 h-3.5 text-emergency-600" />
                Simulate Accident Flow
              </button>
            </div>
          </div>

          {/* Right Column: Premium Smartphone Mockup Displaying ResQTag Card & QR */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[360px]">
              {/* Device Frame */}
              <div className="relative rounded-[36px] bg-slate-900 p-3 shadow-2xl border-4 border-slate-800">
                {/* Speaker & Sensor Bar */}
                <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-8 h-1 bg-slate-800 rounded-full"></div>
                </div>

                {/* Inner Screen Display */}
                <div className="rounded-[26px] bg-slate-50 text-slate-900 p-4 space-y-3.5 overflow-hidden border border-slate-200">
                  
                  {/* Top Emergency Status Header */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emergency-600 animate-pulse"></div>
                      <span className="text-[11px] font-black tracking-wider text-slate-900 font-mono">
                        RESQTAG MEDICAL PROFILE
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emergency-100 text-emergency-800 font-black font-mono text-[10px] border border-emergency-200">
                      O+ POSITIVE
                    </span>
                  </div>

                  {/* Profile Summary Card */}
                  <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                        RK
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Rahul Kumar</h4>
                        <p className="text-[11px] text-slate-500">Age 28 • Male • KA-01-AB-1234</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
                      <div className="p-1.5 rounded bg-slate-50 border border-slate-200/80">
                        <span className="text-slate-500 block">ALLERGIES</span>
                        <span className="font-bold text-emergency-700">Penicillin (Severe)</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-50 border border-slate-200/80">
                        <span className="text-slate-500 block">CONDITION</span>
                        <span className="font-bold text-slate-800">Asthma (Inhaler)</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary 1-Tap Emergency Action */}
                  <div className="space-y-1.5">
                    <button
                      onClick={() => onNavigate('emergency-profile', 'RQ7K29')}
                      className="w-full py-2.5 px-3 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>1-Tap Call Emergency Contact</span>
                    </button>
                  </div>

                  {/* Physical QR Decal Preview */}
                  <div className="bg-slate-100 rounded-xl p-3 border border-slate-200 flex items-center justify-between gap-3">
                    <div className="bg-white p-1 rounded-lg border border-slate-200">
                      <QRCodeSVG value={demoScanUrl} size={56} level="M" />
                    </div>
                    <div className="text-left space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">TAG IDENTIFIER</span>
                      <span className="text-sm font-black font-mono text-slate-900 tracking-wider">RQ7K29</span>
                      <span className="text-[10px] text-safe-700 font-semibold block">✓ Verified Identity</span>
                    </div>
                  </div>

                </div>

                {/* Home Indicator */}
                <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-2.5"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. TWO CORE SOLUTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Unified Safety Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Two ways ResQTag keeps people safer.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            A cohesive safety ecosystem providing proactive protection before travel and rapid response post-accident.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Emergency QR */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emergency-50 border border-emergency-100 text-emergency-600 flex items-center justify-center">
                  <QrCode className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emergency-50 text-emergency-700 border border-emergency-200">
                  Incident Identification
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-slate-900">🚨 Emergency QR</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  “Instantly access essential emergency information when a person cannot communicate.”
                </p>
              </div>

              {/* Show items list */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emergency-500"></span>
                  <span className="font-semibold text-slate-800">Secure QR Code</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                  <span className="font-semibold text-slate-800">Emergency Profile</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-safe-500"></span>
                  <span className="font-semibold text-slate-800">Emergency Contacts</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="font-semibold text-slate-800">Emergency Response</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('scan')}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Scan or View Emergency QR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: SafeJourney */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-safe-50 border border-safe-100 text-safe-700 flex items-center justify-center">
                  <Trees className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-safe-50 text-safe-800 border border-safe-200">
                  Proactive Monitoring
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-slate-900">🌲 SafeJourney</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  “Proactive safety monitoring for people travelling alone in remote or isolated areas.”
                </p>
              </div>

              {/* Show items list */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-safe-500"></span>
                  <span className="font-semibold text-slate-800">Journey Tracker</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                  <span className="font-semibold text-slate-800">Safety Check-ins</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-safe-600"></span>
                  <span className="font-semibold text-slate-800">“I&apos;m Safe” Check</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emergency-500"></span>
                  <span className="font-semibold text-slate-800">Emergency Alert</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('safejourney')}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore SafeJourney Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. EMERGENCY QR SECTION & PROCESS TIMELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Emergency Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How ResQTag Works in 6 Clear Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            A frictionless flow designed for instant comprehension and rapid deployment.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Step 01 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2.5 text-center">
            <span className="text-xs font-black font-mono text-brand-600">01</span>
            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 mx-auto flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-slate-900">Register</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Create medical & contact profile.</p>
          </div>

          {/* Step 02 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2.5 text-center">
            <span className="text-xs font-black font-mono text-brand-600">02</span>
            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 mx-auto flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-slate-900">Verify with OTP</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Secure phone verification.</p>
          </div>

          {/* Step 03 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2.5 text-center">
            <span className="text-xs font-black font-mono text-brand-600">03</span>
            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 mx-auto flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-slate-900">Generate QR</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Secure tokenized identifier.</p>
          </div>

          {/* Step 04 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2.5 text-center">
            <span className="text-xs font-black font-mono text-brand-600">04</span>
            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-slate-900">Place on Vehicle</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Affix to helmet or windshield.</p>
          </div>

          {/* Step 05 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2.5 text-center">
            <span className="text-xs font-black font-mono text-emergency-600">05</span>
            <div className="w-9 h-9 rounded-lg bg-emergency-50 text-emergency-600 mx-auto flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-slate-900">Responder Scans</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Zero-app scan on any phone.</p>
          </div>

          {/* Step 06 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2.5 text-center">
            <span className="text-xs font-black font-mono text-safe-600">06</span>
            <div className="w-9 h-9 rounded-lg bg-safe-50 text-safe-600 mx-auto flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-slate-900">Profile Appears</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Instant triage & family alert.</p>
          </div>
        </div>
      </section>

      {/* 4. SECURITY & PRIVACY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-950 px-3 py-1 rounded-full border border-brand-800">
              Data Protection Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Privacy and security by design.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ResQTag does not print personal details or unencrypted databases on physical stickers. All scans resolve securely through protected backend tokens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
            {/* 1. Secure Profile */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-700 text-brand-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">🔐 Secure Profile</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Personal identity records are encrypted and protected in hardened storage.
              </p>
            </div>

            {/* 2. OTP Verification */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-700 text-safe-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">✓ OTP Verification</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Profile edits require multi-factor phone OTP authentication.
              </p>
            </div>

            {/* 3. Protected Data */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-700 text-brand-400 flex items-center justify-center">
                <EyeOff className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">🔒 Protected Data</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                QR encodes a pointer token (RQ7K29), never raw personal details.
              </p>
            </div>

            {/* 4. Consent-Based Location */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-700 text-amber-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">📍 Consent Location</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Responders explicitly grant geolocation permission before sharing coords.
              </p>
            </div>

            {/* 5. Controlled Access */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-700 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">🛡️ Controlled Access</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Instant tag deactivation and contact updates without reprinting stickers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OFFICIAL HELPLINES & DISCLAIMER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Ambulance className="w-5 h-5 text-emergency-600" />
              <h3 className="text-base font-bold text-slate-900">National Emergency Dispatch Helplines</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Toll-free 24/7 Service</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <a href="tel:112" className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors">
              <span className="text-xl font-black font-mono text-emergency-600 block">112</span>
              <span className="text-xs font-bold text-slate-800 block">National SOS</span>
              <span className="text-[10px] text-slate-500">All Emergencies</span>
            </a>

            <a href="tel:108" className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors">
              <span className="text-xl font-black font-mono text-safe-600 block">108</span>
              <span className="text-xs font-bold text-slate-800 block">Ambulance</span>
              <span className="text-[10px] text-slate-500">Medical Triage</span>
            </a>

            <a href="tel:100" className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors">
              <span className="text-xl font-black font-mono text-brand-600 block">100</span>
              <span className="text-xs font-bold text-slate-800 block">Police</span>
              <span className="text-[10px] text-slate-500">Traffic & Highway</span>
            </a>

            <a href="tel:101" className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors">
              <span className="text-xl font-black font-mono text-amber-600 block">101</span>
              <span className="text-xs font-bold text-slate-800 block">Fire & Rescue</span>
              <span className="text-[10px] text-slate-500">Disaster Team</span>
            </a>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 max-w-2xl mx-auto">
          <p>
            <strong>Medical Notice:</strong> ResQTag provides verified emergency identification and communication dispatch support. It does not replace professional medical diagnosis or clinical hospital care.
          </p>
        </div>
      </section>
    </div>
  );
};
