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
  const [activeStep, setActiveStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const demoScanUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/#scan/RQ7K29`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in text-slate-900">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emergency-50 text-emergency-700 text-xs font-bold border border-emergency-200">
            <Flame className="w-3.5 h-3.5 text-emergency-600" />
            <span>HACKATHON SIMULATION WORKFLOW</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950">
            Simulate On-Road Emergency Incident
          </h2>
          <p className="text-xs text-slate-500">
            Experience how ResQTag connects bystanders, paramedics, and family in seconds.
          </p>
        </div>

        {/* Step Progression */}
        <div className="flex items-center justify-between text-xs font-bold border-y border-slate-100 py-2.5 text-slate-500">
          <span className={activeStep === 1 ? 'text-slate-900 font-bold' : ''}>1. The Incident</span>
          <span>→</span>
          <span className={activeStep === 2 ? 'text-emergency-600 font-bold' : ''}>2. Bystander Scans Decal</span>
        </div>

        {/* STEP 1: THE INCIDENT */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Car className="w-4 h-4 text-brand-600" />
                <span>Simulated Incident Profile</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                <strong>Victim:</strong> Rahul Kumar (24 Yrs, Blood O+)<br />
                <strong>Vehicle:</strong> KA-01-AB-1234 (Yamaha R15)<br />
                <strong>Location:</strong> Indiranagar 100ft Road Junction, Bengaluru<br />
                <strong>Status:</strong> Unconscious rider after collision. Unable to communicate or unlock device.
              </p>
            </div>

            <p className="text-xs text-slate-600">
              A bystander rushes to help and notices the high-contrast ResQTag decal on Rahul&apos;s helmet.
            </p>

            <button
              onClick={() => setActiveStep(2)}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>Next: Bystander Scans Helmet QR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: BYSTANDER SPOTS QR */}
        {activeStep === 2 && (
          <div className="space-y-4 text-center">
            <div className="bg-white text-slate-900 rounded-2xl p-5 border-2 border-slate-900 shadow-sticker max-w-xs mx-auto space-y-2">
              <div className="bg-emergency-600 text-white py-1 px-2 rounded text-[10px] font-black uppercase tracking-wider">
                SCAN IN CASE OF EMERGENCY
              </div>
              <div className="flex justify-center py-1">
                <QRCodeSVG value={demoScanUrl} size={110} />
              </div>
              <div className="text-base font-black font-mono tracking-widest text-slate-900 bg-slate-100 py-0.5 px-2 rounded-lg border border-slate-300">
                RQ7K29
              </div>
              <div className="text-[9px] text-slate-600 font-mono">
                VEHICLE: KA-01-AB-1234 • BLOOD: O+
              </div>
            </div>

            <p className="text-xs text-slate-600">
              The bystander points their camera at the sticker (or enters short code <code className="text-slate-900 font-mono font-bold">RQ7K29</code>).
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveStep(1)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => {
                  onClose();
                  onLaunchScan('RQ7K29');
                }}
                className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
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
