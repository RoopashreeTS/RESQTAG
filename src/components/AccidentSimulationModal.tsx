import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  ArrowRight, 
  Car, 
  QrCode
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface AccidentSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchScan: (identifier: string) => void;
}

export const AccidentSimulationModal: React.FC<AccidentSimulationModalProps> = ({
  isOpen,
  onClose,
  onLaunchScan,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  if (!isOpen) return null;

  const demoScanUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/#scan/RQ7K29`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-navy-900 border-2 border-emergency-500 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emergency-600 via-amber-400 to-emergency-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emergency-600/20 text-emergency-500 text-xs font-bold border border-emergency-500/30">
            <Flame className="w-3.5 h-3.5" />
            <span>HACKATHON SIMULATION WORKFLOW</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Simulate On-Road Emergency Incident
          </h2>
          <p className="text-xs text-slate-300">
            Experience how ResQTag connects bystanders, paramedics, and family in seconds.
          </p>
        </div>

        {/* Step Progression */}
        <div className="flex items-center justify-between text-xs font-bold border-y border-navy-800 py-2.5 text-slate-400">
          <span className={activeStep === 1 ? 'text-amber-400' : ''}>1. The Incident</span>
          <span>→</span>
          <span className={activeStep === 2 ? 'text-amber-400' : ''}>2. Bystander Spots QR</span>
          <span>→</span>
          <span className={activeStep === 3 ? 'text-emergency-500' : ''}>3. Life-Saving Triage</span>
        </div>

        {/* STEP 1: THE INCIDENT */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-navy-850 border border-navy-750 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Car className="w-4 h-4" />
                <span>Simulated Incident Profile</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                <strong>Victim:</strong> Rahul Kumar (24 Yrs, Blood O+)<br />
                <strong>Vehicle:</strong> KA-01-AB-1234 (Yamaha R15)<br />
                <strong>Location:</strong> Indiranagar 100ft Road Junction, Bengaluru<br />
                <strong>Status:</strong> Unconscious rider after a sudden collision. Unable to speak or unlock smartphone.
              </p>
            </div>

            <p className="text-xs text-slate-300">
              A bystander rushes to help and notices the official high-contrast ResQTag decal on Rahul&apos;s helmet.
            </p>

            <button
              onClick={() => setActiveStep(2)}
              className="w-full py-3 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-white font-bold text-xs shadow-glow-red flex items-center justify-center gap-2 transition-all"
            >
              <span>Next: Bystander Scans Helmet QR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: BYSTANDER SPOTS QR */}
        {activeStep === 2 && (
          <div className="space-y-4 text-center">
            {/* Holographic Sticker */}
            <div className="bg-white text-slate-900 rounded-xl p-4 border-2 border-slate-900 shadow-sticker max-w-xs mx-auto space-y-2">
              <div className="bg-emergency-600 text-white py-0.5 px-2 rounded text-[10px] font-black uppercase">
                SCAN IN CASE OF EMERGENCY
              </div>
              <div className="flex justify-center">
                <QRCodeSVG value={demoScanUrl} size={110} />
              </div>
              <div className="text-base font-black font-mono tracking-widest text-slate-900 bg-slate-100 py-0.5 px-2 rounded">
                RQ7K29
              </div>
              <div className="text-[9px] text-slate-600 font-mono">
                VEHICLE: KA-01-AB-1234 • BLOOD: O+
              </div>
            </div>

            <p className="text-xs text-slate-300">
              The bystander points their phone camera at the helmet sticker (or enters code <code className="text-amber-300 font-mono font-bold">RQ7K29</code>).
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveStep(1)}
                className="py-3 px-4 rounded-xl bg-navy-800 text-slate-300 text-xs font-bold"
              >
                Back
              </button>
              <button
                onClick={() => {
                  onClose();
                  onLaunchScan('RQ7K29');
                }}
                className="flex-1 py-3 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-white font-bold text-xs shadow-glow-red flex items-center justify-center gap-2 transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>Simulate Camera Scan (RQ7K29)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
