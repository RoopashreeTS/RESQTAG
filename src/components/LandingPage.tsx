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
  EyeOff,
  Sparkles,
  Compass,
  AlertOctagon
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { HeroAccidentBackground } from './HeroAccidentBackground';

interface LandingPageProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenSimulator: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenSimulator }) => {
  const { quickDemoLogin, isAuthenticated } = useAuth();
  const demoScanUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/#scan/RQ7K29`;

  return (
    <div className="space-y-16 pb-24 text-[#2B2020]">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION (Full-Width Animated Accident Background)*/}
      {/* ======================================================== */}
      <section className="relative min-h-[660px] sm:min-h-[720px] flex items-center pt-10 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden text-white">
        
        {/* Full-width Animated Hero Accident Background */}
        <HeroAccidentBackground />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline & Animated Action Buttons */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-red-500/30 text-rose-200 text-xs font-bold shadow-lg">
                <Shield className="w-3.5 h-3.5 text-[#FF6B6B]" />
                <span className="tracking-wide uppercase">Emergency Identification & Safety Platform</span>
                <span className="w-2 h-2 rounded-full bg-[#E53935] animate-ping"></span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] drop-shadow-md">
                When the victim cannot speak,{<br className="hidden sm:inline" />}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] via-[#E53935] to-[#FF8E8E] drop-shadow-sm">
                  {' '}ResQTag speaks for them.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-200 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed drop-shadow-sm">
                Smart emergency identification and proactive safety monitoring in one platform. Rapid medical triage, instant trusted contact alerts, and solo travel check-ins.
              </p>

              {/* Three Specific Animated Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                
                {/* 1. REGISTER */}
                <button
                  onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'register')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm btn-rose-primary flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>REGISTER</span>
                </button>

                {/* 2. SCAN RESQTAG */}
                <button
                  onClick={() => onNavigate('scan')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-white/90 hover:bg-white text-[#2B2020] hover:text-[#E53935] border border-white/40 shadow-lg hover:-translate-y-0.5 active:scale-[0.97] transition-all flex items-center justify-center gap-2 backdrop-blur-md"
                >
                  <QrCode className="w-4 h-4 text-[#E53935]" />
                  <span>SCAN RESQTAG</span>
                </button>

                {/* 3. START SAFEJOURNEY */}
                <button
                  onClick={() => onNavigate('safejourney')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                >
                  <Trees className="w-4 h-4 text-white" />
                  <span>START SAFEJOURNEY</span>
                </button>
              </div>

              {/* Fast-Track Evaluator Quick Actions in Dark Glass Pill */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/75 backdrop-blur-md border border-white/15 text-slate-300 shadow-md">
                  <span className="font-bold text-slate-400">Hackathon Fast-Track:</span>
                  <button
                    onClick={async () => {
                      await quickDemoLogin();
                      onNavigate('dashboard');
                    }}
                    className="text-[#FF8E8E] hover:text-white font-bold flex items-center gap-1 hover:underline transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#FF6B6B]" />
                    Live Demo Dashboard
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    onClick={onOpenSimulator}
                    className="text-[#38D9FF] hover:text-white font-bold flex items-center gap-1 hover:underline transition-colors"
                  >
                    <Activity className="w-3.5 h-3.5 text-[#38D9FF]" />
                    Simulate Accident Flow
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Smartphone Mockup on Dark Glass Display */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[360px]">
                
                {/* Soft Ambient Red/Rose Glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-red-500/30 to-cyan-500/20 rounded-[42px] blur-xl opacity-80 animate-pulse-subtle"></div>

                {/* Device Frame */}
                <div className="relative rounded-[36px] bg-slate-900/90 p-3 shadow-2xl border-2 border-white/20 backdrop-blur-xl">
                {/* Speaker & Sensor Bar */}
                <div className="w-24 h-4 bg-slate-200/80 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-8 h-1 bg-slate-400 rounded-full"></div>
                </div>

                {/* Inner Screen Display */}
                <div className="rounded-[26px] bg-[#FFF7F7] text-[#2B2020] p-4 space-y-3.5 overflow-hidden border border-red-100">
                  
                  {/* Top Emergency Status Header */}
                  <div className="flex items-center justify-between border-b border-red-100 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#E53935] animate-pulse"></div>
                      <span className="text-[11px] font-black tracking-wider text-[#2B2020] font-mono">
                        RESQTAG MEDICAL PROFILE
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-[#C62828] font-black font-mono text-[10px] border border-red-200">
                      O+ POSITIVE
                    </span>
                  </div>

                  {/* Profile Summary Card */}
                  <div className="bg-white/90 rounded-2xl p-3 border border-red-100 shadow-sm space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-rose-50 border border-red-100 flex items-center justify-center font-black text-[#E53935] text-sm">
                        RK
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#2B2020]">Rahul Kumar</h4>
                        <p className="text-[11px] text-[#806F6F]">Age 24 • Male • KA-01-AB-1234</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
                      <div className="p-1.5 rounded-xl bg-rose-50/60 border border-red-100">
                        <span className="text-[#806F6F] block font-semibold">ALLERGIES</span>
                        <span className="font-bold text-[#E53935]">Penicillin (Severe)</span>
                      </div>
                      <div className="p-1.5 rounded-xl bg-rose-50/60 border border-red-100">
                        <span className="text-[#806F6F] block font-semibold">CONDITION</span>
                        <span className="font-bold text-[#2B2020]">Asthma (Inhaler)</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary 1-Tap Emergency Action */}
                  <div className="space-y-1.5">
                    <button
                      onClick={() => onNavigate('emergency-profile', 'RQ7K29')}
                      className="w-full py-2.5 px-3 rounded-xl btn-rose-sos text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>1-Tap Call Emergency Contact</span>
                    </button>
                  </div>

                  {/* Physical QR Decal Preview */}
                  <div className="bg-white/95 rounded-2xl p-3 border border-red-100 flex items-center justify-between gap-3 shadow-sm">
                    <div className="bg-white p-1 rounded-lg border border-slate-200">
                      <QRCodeSVG value={demoScanUrl} size={54} level="M" />
                    </div>
                    <div className="text-left space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-[#806F6F] block">TAG IDENTIFIER</span>
                      <span className="text-sm font-black font-mono text-[#2B2020] tracking-wider">RQ7K29</span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">✓ Verified Identity</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

      {/* ======================================================== */}
      {/* 2. TWO CORE SOLUTIONS (Rose Glass Cards)                 */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C62828] bg-rose-100/80 px-3 py-1 rounded-full border border-red-200">
            Unified Safety Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2B2020] tracking-tight">
            Two ways ResQTag keeps people safer.
          </h2>
          <p className="text-sm sm:text-base text-[#806F6F] max-w-xl mx-auto">
            A cohesive safety ecosystem providing proactive protection before travel and rapid response post-accident.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Emergency QR */}
          <div className="glass-card-rose rounded-3xl p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#E53935] flex items-center justify-center shadow-sm">
                  <QrCode className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-[#C62828] border border-red-200">
                  Incident Identification
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-[#2B2020]">🚨 Emergency QR</h3>
                <p className="text-xs sm:text-sm text-[#806F6F] leading-relaxed">
                  “Instantly access essential emergency medical data and notify family when a victim cannot communicate.”
                </p>
              </div>

              {/* Show items list */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/70 border border-red-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E53935]"></span>
                  <span className="font-semibold text-[#2B2020]">Secure QR Code</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 border border-red-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span className="font-semibold text-[#2B2020]">Medical Profile</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 border border-red-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold text-[#2B2020]">Emergency Contacts</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 border border-red-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="font-semibold text-[#2B2020]">Emergency Dispatch</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('scan')}
              className="w-full py-3 rounded-xl btn-rose-primary font-bold text-xs flex items-center justify-center gap-2"
            >
              <span>Scan or View Emergency QR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: SafeJourney */}
          <div className="glass-card-rose rounded-3xl p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-sm">
                  <Trees className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                  Proactive Monitoring
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-[#2B2020]">🌲 SafeJourney</h3>
                <p className="text-xs sm:text-sm text-[#806F6F] leading-relaxed">
                  “Proactive safety monitoring for people travelling alone in remote or isolated areas.”
                </p>
              </div>

              {/* Show items list */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/70 border border-teal-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <span className="font-semibold text-[#2B2020]">Journey Tracker</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 border border-teal-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold text-[#2B2020]">Safety Check-ins</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 border border-teal-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                  <span className="font-semibold text-[#2B2020]">“I&apos;m Safe” Check</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 border border-teal-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E53935]"></span>
                  <span className="font-semibold text-[#2B2020]">Emergency Alert</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('safejourney')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md shadow-teal-500/20 hover:-translate-y-0.5 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
            >
              <span>Explore SafeJourney Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. HOW RESQTAG WORKS (6-STEP TIMELINE WITH GLASS CARDS)  */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C62828] bg-rose-100/80 px-3 py-1 rounded-full border border-red-200">
            Emergency Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B2020] tracking-tight">
            How ResQTag Works in 6 Clear Steps
          </h2>
          <p className="text-xs sm:text-sm text-[#806F6F] max-w-lg mx-auto">
            A frictionless flow designed for instant comprehension and rapid response.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Step 01 */}
          <div className="glass-card-rose rounded-2xl p-4 space-y-2.5 text-center">
            <span className="text-xs font-black font-mono text-[#E53935]">01</span>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#E53935] mx-auto flex items-center justify-center shadow-sm">
              <UserPlus className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-[#2B2020]">Register</h4>
            <p className="text-[11px] text-[#806F6F] leading-tight">Create medical & contact profile.</p>
          </div>

          {/* Step 02 */}
          <div className="glass-card-rose rounded-2xl p-4 space-y-2.5 text-center">
            <span className="text-xs font-black font-mono text-[#E53935]">02</span>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#E53935] mx-auto flex items-center justify-center shadow-sm">
              <KeyRound className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-[#2B2020]">Verify with OTP</h4>
            <p className="text-[11px] text-[#806F6F] leading-tight">Secure phone verification.</p>
          </div>

          {/* Step 03 */}
          <div className="glass-card-rose rounded-2xl p-4 space-y-2.5 text-center">
            <span className="text-xs font-black font-mono text-[#E53935]">03</span>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#E53935] mx-auto flex items-center justify-center shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-[#2B2020]">Generate QR</h4>
            <p className="text-[11px] text-[#806F6F] leading-tight">Secure tokenized identifier.</p>
          </div>

          {/* Step 04 */}
          <div className="glass-card-rose rounded-2xl p-4 space-y-2.5 text-center">
            <span className="text-xs font-black font-mono text-[#E53935]">04</span>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#E53935] mx-auto flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-[#2B2020]">Place on Vehicle</h4>
            <p className="text-[11px] text-[#806F6F] leading-tight">Affix to helmet or windshield.</p>
          </div>

          {/* Step 05 */}
          <div className="glass-card-rose rounded-2xl p-4 space-y-2.5 text-center">
            <span className="text-xs font-black font-mono text-[#E53935]">05</span>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#E53935] mx-auto flex items-center justify-center shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-[#2B2020]">Responder Scans</h4>
            <p className="text-[11px] text-[#806F6F] leading-tight">Zero-app scan on any phone.</p>
          </div>

          {/* Step 06 */}
          <div className="glass-card-rose rounded-2xl p-4 space-y-2.5 text-center">
            <span className="text-xs font-black font-mono text-emerald-600">06</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-sm">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-[#2B2020]">Profile Appears</h4>
            <p className="text-[11px] text-[#806F6F] leading-tight">Instant triage & family alert.</p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SAFEJOURNEY SPOTLIGHT SECTION                         */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card-rose-solid rounded-3xl p-8 sm:p-12 space-y-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-100/90 text-teal-800 text-xs font-bold border border-teal-200">
                <Compass className="w-3.5 h-3.5 text-teal-700" />
                <span>PROACTIVE MONITORING ENGINE</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2B2020] tracking-tight">
                ResQTag SafeJourney
              </h2>
              <p className="text-base text-[#806F6F] font-normal">
                “Stay connected. Check in. Get help when you need it.”
              </p>
            </div>

            <button
              onClick={() => onNavigate('safejourney')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-md shadow-teal-500/20 hover:-translate-y-0.5 active:scale-[0.97] transition-all flex items-center gap-2 shrink-0"
            >
              <span>Open SafeJourney Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Check-In Action Micro-Demo with Dedicated Button Glows */}
          <div className="pt-4 border-t border-red-100 space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider text-[#806F6F] block">
              Live Check-In Interaction Controls Preview:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              {/* 1. I'M SAFE */}
              <div className="p-4 rounded-2xl bg-white/80 border border-emerald-100 space-y-2 shadow-sm">
                <span className="text-[11px] text-emerald-800 font-semibold block">Normal Check-in</span>
                <button
                  onClick={() => onNavigate('safejourney')}
                  className="w-full py-2.5 px-4 rounded-xl btn-rose-safe font-bold text-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I&apos;M SAFE</span>
                </button>
              </div>

              {/* 2. I NEED HELP */}
              <div className="p-4 rounded-2xl bg-white/80 border border-red-100 space-y-2 shadow-sm">
                <span className="text-[11px] text-[#C62828] font-semibold block">Manual Emergency SOS</span>
                <button
                  onClick={() => onNavigate('safejourney')}
                  className="w-full py-2.5 px-4 rounded-xl btn-rose-sos font-bold text-xs flex items-center justify-center gap-2"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>I NEED HELP</span>
                </button>
              </div>

              {/* 3. END JOURNEY */}
              <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 space-y-2 shadow-sm">
                <span className="text-[11px] text-slate-600 font-semibold block">Completed Safe Travel</span>
                <button
                  onClick={() => onNavigate('safejourney')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:-translate-y-0.5 active:scale-[0.97] transition-all"
                >
                  <span>END JOURNEY</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. DATA SECURITY & PRIVACY PILLARS                       */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card-rose-solid rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C62828] bg-rose-100/90 px-3 py-1 rounded-full border border-red-200">
              Data Protection Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B2020] tracking-tight">
              Privacy and security by design.
            </h2>
            <p className="text-xs sm:text-sm text-[#806F6F] leading-relaxed">
              ResQTag does not print personal details or unencrypted databases on physical stickers. All scans resolve securely through protected backend tokens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
            {/* 1. Secure Profile */}
            <div className="glass-card-rose rounded-2xl p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-[#E53935] flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#2B2020]">🔐 Secure Profile</h4>
              <p className="text-[11px] text-[#806F6F] leading-relaxed">
                Personal identity records are encrypted and protected in hardened storage.
              </p>
            </div>

            {/* 2. OTP Verification */}
            <div className="glass-card-rose rounded-2xl p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#2B2020]">✓ OTP Verification</h4>
              <p className="text-[11px] text-[#806F6F] leading-relaxed">
                Profile edits require multi-factor phone OTP authentication.
              </p>
            </div>

            {/* 3. Protected Data */}
            <div className="glass-card-rose rounded-2xl p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-[#E53935] flex items-center justify-center">
                <EyeOff className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#2B2020]">🔒 Protected Data</h4>
              <p className="text-[11px] text-[#806F6F] leading-relaxed">
                QR encodes a pointer token (RQ7K29), never raw personal details.
              </p>
            </div>

            {/* 4. Consent-Based Location */}
            <div className="glass-card-rose rounded-2xl p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#2B2020]">📍 Consent Location</h4>
              <p className="text-[11px] text-[#806F6F] leading-relaxed">
                Responders explicitly grant geolocation permission before sharing coords.
              </p>
            </div>

            {/* 5. Controlled Access */}
            <div className="glass-card-rose rounded-2xl p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#2B2020]">🛡️ Controlled Access</h4>
              <p className="text-[11px] text-[#806F6F] leading-relaxed">
                Instant tag deactivation and contact updates without reprinting stickers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. OFFICIAL HELPLINES & DISCLAIMER                       */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="glass-card-rose-solid rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-red-100 pb-4">
            <div className="flex items-center gap-2">
              <Ambulance className="w-5 h-5 text-[#E53935]" />
              <h3 className="text-base font-bold text-[#2B2020]">National Emergency Dispatch Helplines</h3>
            </div>
            <span className="text-xs text-[#806F6F] font-semibold">Toll-free 24/7 Service</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-center">
            <a 
              href="tel:112" 
              className="p-4 rounded-2xl glass-card-rose text-[#2B2020] hover:border-[#E53935] transition-all"
            >
              <span className="text-2xl font-black font-mono text-[#E53935] block">112</span>
              <span className="text-xs font-bold text-[#2B2020] block">National SOS</span>
              <span className="text-[10px] text-[#806F6F]">All Emergencies</span>
            </a>

            <a 
              href="tel:108" 
              className="p-4 rounded-2xl glass-card-rose text-[#2B2020] hover:border-emerald-500 transition-all"
            >
              <span className="text-2xl font-black font-mono text-emerald-600 block">108</span>
              <span className="text-xs font-bold text-[#2B2020] block">Ambulance</span>
              <span className="text-[10px] text-[#806F6F]">Medical Triage</span>
            </a>

            <a 
              href="tel:100" 
              className="p-4 rounded-2xl glass-card-rose text-[#2B2020] hover:border-rose-500 transition-all"
            >
              <span className="text-2xl font-black font-mono text-[#E53935] block">100</span>
              <span className="text-xs font-bold text-[#2B2020] block">Police</span>
              <span className="text-[10px] text-[#806F6F]">Traffic & Highway</span>
            </a>

            <a 
              href="tel:101" 
              className="p-4 rounded-2xl glass-card-rose text-[#2B2020] hover:border-amber-500 transition-all"
            >
              <span className="text-2xl font-black font-mono text-amber-600 block">101</span>
              <span className="text-xs font-bold text-[#2B2020] block">Fire & Rescue</span>
              <span className="text-[10px] text-[#806F6F]">Disaster Team</span>
            </a>
          </div>
        </div>

        <div className="text-center text-xs text-[#806F6F] max-w-2xl mx-auto">
          <p>
            <strong>Medical Notice:</strong> ResQTag provides verified emergency identification and communication dispatch support. It does not replace professional medical diagnosis or clinical hospital care.
          </p>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. FINAL CALL TO ACTION (Animated Glass Banner)          */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card-rose-solid rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-card">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100 text-[#C62828] text-xs font-bold border border-red-200">
              <Sparkles className="w-3.5 h-3.5 text-[#E53935]" />
              <span>INSTANT PROTECTION IN MINUTES</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black text-[#2B2020] tracking-tight">
              Protect yourself and your loved ones today.
            </h2>
            
            <p className="text-sm sm:text-base text-[#806F6F] leading-relaxed">
              Create your emergency profile, generate your waterproof QR decal, and enable proactive SafeJourney tracking.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => onNavigate('register')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm btn-rose-primary shadow-lg flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Free Emergency Profile</span>
              </button>

              <button
                onClick={() => onNavigate('safejourney')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm btn-rose-outline flex items-center justify-center gap-2"
              >
                <Trees className="w-4 h-4 text-teal-600" />
                <span>Launch SafeJourney</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
