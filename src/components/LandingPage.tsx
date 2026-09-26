import React from 'react';
import { 
  Shield, 
  QrCode, 
  UserPlus, 
  Lock, 
  Smartphone, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Zap, 
  MapPin, 
  Ambulance, 
  Radio 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenSimulator: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenSimulator }) => {
  const { quickDemoLogin } = useAuth();
  const demoScanUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/#scan/RQ7K29`;

  return (
    <div className="space-y-16 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emergency-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800/90 border border-navy-700 shadow-sm text-xs font-semibold text-slate-300">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Next-Gen QR Emergency Response Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              When the victim cannot speak,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emergency-500 via-rose-400 to-amber-400">
                ResQTag speaks for them.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Quick access to vital medical information and instant trusted contact alerts when every single second matters.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('register')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-emergency-600 via-emergency-500 to-emergency-700 text-white shadow-glow-red hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
              >
                <UserPlus className="w-5 h-5" />
                <span>Register Now (Free)</span>
              </button>

              <button
                onClick={() => onNavigate('scan')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-navy-800 hover:bg-navy-750 text-white border border-navy-600 hover:border-emergency-500/50 shadow-card hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
              >
                <QrCode className="w-5 h-5 text-emergency-500" />
                <span>Scan ResQTag</span>
              </button>
            </div>

            {/* Quick Demo Fast-Track for Evaluators */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-3 text-xs text-slate-400">
              <span>Judge Fast-Track:</span>
              <button
                onClick={async () => {
                  await quickDemoLogin();
                  onNavigate('dashboard');
                }}
                className="text-brand-cyan hover:underline font-semibold flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5" />
                Explore Demo Profile
              </button>
              <span>•</span>
              <button
                onClick={onOpenSimulator}
                className="text-amber-400 hover:underline font-semibold flex items-center gap-1"
              >
                <Flame className="w-3.5 h-3.5" />
                Live Incident Walkthrough
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Holographic Sticker & Mobile Scan Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Outer Glow frame */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-emergency-600 to-brand-blue rounded-3xl blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>

              {/* Card Container */}
              <div className="relative rounded-2xl bg-navy-900 border border-navy-700 shadow-2xl p-6 space-y-5">
                {/* Header with Beacon */}
                <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emergency-600 flex items-center justify-center text-white">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black tracking-wider text-white font-mono">RESQTAG STICKER</div>
                      <div className="text-[10px] text-slate-400">Vehicle & Helmet Identity</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emergency-500/20 text-emergency-500 text-[10px] font-bold border border-emergency-500/30">
                    SCAN IN EMERGENCY
                  </span>
                </div>

                {/* Simulated QR Sticker Graphic */}
                <div className="bg-slate-50 text-slate-900 p-4 rounded-xl shadow-inner text-center space-y-3 border-2 border-slate-200">
                  <div className="bg-emergency-600 text-white font-black text-[11px] py-1 px-3 rounded uppercase tracking-wider">
                    SCAN IN CASE OF EMERGENCY
                  </div>

                  <div className="flex justify-center py-1">
                    <div className="p-2 bg-white rounded-lg border border-slate-300 shadow-sm">
                      <QRCodeSVG
                        value={demoScanUrl}
                        size={140}
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-slate-500">BACKUP SHORT CODE</div>
                    <div className="text-xl font-black font-mono tracking-widest text-slate-900 bg-slate-200 py-1 px-3 rounded">
                      RQ7K29
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-600 font-mono pt-1 border-t border-slate-200">
                    <span>VEHICLE: <strong>KA-01-AB-1234</strong></span>
                    <span className="text-emergency-600 font-bold">BLOOD: O+</span>
                  </div>
                </div>

                {/* Live Responder Action Simulator */}
                <div className="space-y-2">
                  <button
                    onClick={() => onNavigate('emergency-profile', 'RQ7K29')}
                    className="w-full py-2.5 px-4 rounded-xl bg-emergency-600/20 hover:bg-emergency-600 text-emergency-500 hover:text-white border border-emergency-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <span>Simulate Bystander Scanning Tag</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    🔒 Zero private data inside QR • Instant secure lookup
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="py-12 bg-navy-900/60 border-y border-navy-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emergency-500 bg-emergency-500/10 px-3 py-1 rounded-full border border-emergency-500/20">
              Step-by-Step Flow
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              How ResQTag Saves Lives in 4 Critical Steps
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Engineered for extreme reliability during road accidents, medical distress, and unconscious emergencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-navy-850 rounded-2xl p-6 border border-navy-750 hover:border-emergency-500/40 transition-all space-y-4 relative group">
              <div className="w-12 h-12 rounded-xl bg-navy-800 text-brand-cyan flex items-center justify-center font-bold text-lg border border-navy-700 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Register & Affix QR</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Create your verified emergency profile (blood group, allergies, contacts) and print the weatherproof ResQTag sticker for your helmet or vehicle.
              </p>
              <div className="text-[11px] text-brand-cyan font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Takes less than 60 seconds</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-navy-850 rounded-2xl p-6 border border-navy-750 hover:border-emergency-500/40 transition-all space-y-4 relative group">
              <div className="w-12 h-12 rounded-xl bg-navy-800 text-amber-400 flex items-center justify-center font-bold text-lg border border-navy-700 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Incident Occurs</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                If an accident happens and the victim is unconscious or unable to communicate, bystanders spot the high-contrast emergency QR sticker.
              </p>
              <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>High-contrast visual marker</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-navy-850 rounded-2xl p-6 border border-navy-750 hover:border-emergency-500/40 transition-all space-y-4 relative group">
              <div className="w-12 h-12 rounded-xl bg-navy-800 text-emergency-500 flex items-center justify-center font-bold text-lg border border-navy-700 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Instant Zero-App Scan</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Responders scan the QR with any regular phone camera or enter the 6-character backup code. No app install or login required.
              </p>
              <div className="text-[11px] text-emergency-500 font-semibold flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Works on 100% of smartphones</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-navy-850 rounded-2xl p-6 border border-navy-750 hover:border-emergency-500/40 transition-all space-y-4 relative group">
              <div className="w-12 h-12 rounded-xl bg-navy-800 text-emerald-400 flex items-center justify-center font-bold text-lg border border-navy-700 group-hover:scale-110 transition-transform">
                04
              </div>
              <h3 className="text-lg font-bold text-white">SOS Contact & Triage</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Responders immediately see blood group and 1-tap call family. Family receives an automatic SMS alert with optional GPS location.
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" />
                <span>Live trusted contact alert</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUE PROPOSITION & SECURITY ADVANTAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Built for Extreme Medical Situations & Absolute Privacy
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Unlike crude QR stickers that dump unencrypted plaintext, ResQTag utilizes an API-backed secure identifier architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/20 text-brand-cyan flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">No Private Data on QR</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The printed sticker contains only a secure identifier string (e.g. RQ7K29). Your personal data stays safely protected in the backend cloud database.
            </p>
          </div>

          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emergency-600/20 text-emergency-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Stable QR Guarantee</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Need to change your emergency phone number, medications, or vehicle address? Update it in your dashboard — your physical QR sticker continues working forever!
            </p>
          </div>

          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Explicit Location Consent</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Responders are strictly asked for explicit permission before sharing approximate incident location. Zero silent responder tracking.
            </p>
          </div>
        </div>
      </section>

      {/* 4. OFFICIAL EMERGENCY CONTACTS DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 rounded-2xl border border-navy-750 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emergency-500 text-xs font-bold uppercase tracking-wider">
                <Ambulance className="w-4 h-4" />
                <span>National Emergency Dispatch Integration</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Official Emergency Helplines
              </h3>
            </div>
            <span className="text-xs text-slate-400">Toll-free 24/7 Service</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <a
              href="tel:112"
              className="bg-navy-800 hover:bg-navy-750 border border-navy-700 p-4 rounded-xl text-center space-y-1 group transition-all"
            >
              <div className="text-2xl font-black text-emergency-500 font-mono group-hover:scale-105 transition-transform">
                112
              </div>
              <div className="text-xs font-bold text-white">All Emergency SOS</div>
              <div className="text-[10px] text-slate-400">National Helplines</div>
            </a>

            <a
              href="tel:108"
              className="bg-navy-800 hover:bg-navy-750 border border-navy-700 p-4 rounded-xl text-center space-y-1 group transition-all"
            >
              <div className="text-2xl font-black text-emerald-400 font-mono group-hover:scale-105 transition-transform">
                108
              </div>
              <div className="text-xs font-bold text-white">Ambulance Triage</div>
              <div className="text-[10px] text-slate-400">Emergency Medical</div>
            </a>

            <a
              href="tel:100"
              className="bg-navy-800 hover:bg-navy-750 border border-navy-700 p-4 rounded-xl text-center space-y-1 group transition-all"
            >
              <div className="text-2xl font-black text-brand-cyan font-mono group-hover:scale-105 transition-transform">
                100
              </div>
              <div className="text-xs font-bold text-white">Police Control</div>
              <div className="text-[10px] text-slate-400">Traffic & Highway</div>
            </a>

            <a
              href="tel:101"
              className="bg-navy-800 hover:bg-navy-750 border border-navy-700 p-4 rounded-xl text-center space-y-1 group transition-all"
            >
              <div className="text-2xl font-black text-amber-400 font-mono group-hover:scale-105 transition-transform">
                101
              </div>
              <div className="text-xs font-bold text-white">Fire & Rescue</div>
              <div className="text-[10px] text-slate-400">Disaster Team</div>
            </a>
          </div>
        </div>
      </section>

      {/* 5. MEDICAL & SAFETY DISCLAIMER */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-4 rounded-xl bg-navy-900/80 border border-navy-800 text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">
            ⚠️ ResQTag Medical & Safety Notice:
          </p>
          <p>
            ResQTag provides emergency identity information and communication support. It does not replace professional medical diagnosis, emergency services triage, or clinical hospital care.
          </p>
        </div>
      </section>
    </div>
  );
};
