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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2020]/75 backdrop-blur-sm animate-in fade-in text-[#2B2020]">
      <div className="glass-card-rose-solid rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#806F6F] hover:text-[#2B2020] p-1.5 rounded-xl hover:bg-[#FFEFEF] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEFEF] text-[#E53935] text-xs font-bold border border-red-200">
            <Flame className="w-3.5 h-3.5 text-[#E53935]" />
            <span>HACKATHON SIMULATION WORKFLOW</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2B2020]">
            Simulate On-Road Emergency Incident
          </h2>
          <p className="text-xs text-[#806F6F]">
            Experience how ResQTag connects bystanders, paramedics, and family in seconds.
          </p>
        </div>

        {/* Step Progression */}
        <div className="flex items-center justify-between text-xs font-bold border-y border-red-100 py-2.5 text-[#806F6F]">
          <span className={activeStep === 1 ? 'text-[#2B2020] font-black' : ''}>1. The Incident</span>
          <span>→</span>
          <span className={activeStep === 2 ? 'text-[#E53935] font-black' : ''}>2. Bystander Scans Decal</span>
        </div>

        {/* STEP 1: THE INCIDENT */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/80 border border-red-100 space-y-2 text-xs shadow-sm">
              <div className="flex items-center gap-2 font-bold text-[#2B2020]">
                <Car className="w-4 h-4 text-[#E53935]" />
                <span>Simulated Incident Profile</span>
              </div>
              <p className="text-[#2B2020] leading-relaxed">
                <strong>Victim:</strong> Rahul Kumar (24 Yrs, Blood O+)<br />
                <strong>Vehicle:</strong> KA-01-AB-1234 (Yamaha R15)<br />
                <strong>Location:</strong> Indiranagar 100ft Road Junction, Bengaluru<br />
                <strong>Status:</strong> Unconscious rider after collision. Unable to communicate or unlock device.
              </p>
            </div>

            <p className="text-xs text-[#806F6F]">
              A bystander rushes to help and notices the high-contrast ResQTag decal on Rahul&apos;s helmet.
            </p>

            <button
              onClick={() => setActiveStep(2)}
              className="w-full btn-rose-primary py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
            >
              <span>Next: Bystander Scans Helmet QR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: BYSTANDER SPOTS QR */}
        {activeStep === 2 && (
          <div className="space-y-4 text-center">
            <div className="bg-white text-slate-900 rounded-3xl p-5 border-2 border-red-300 shadow-xl max-w-xs mx-auto space-y-2">
              <div className="bg-gradient-to-r from-[#E53935] to-[#C62828] text-white py-1 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">
                SCAN IN CASE OF EMERGENCY
              </div>
              <div className="flex justify-center py-1">
                <QRCodeSVG value={demoScanUrl} size={110} />
              </div>
              <div className="text-base font-black font-mono tracking-widest text-[#E53935] bg-[#FFEFEF] py-0.5 px-3 rounded-lg border border-red-200 inline-block">
                RQ7K29
              </div>
              <div className="text-[9px] text-[#806F6F] font-mono">
                VEHICLE: KA-01-AB-1234 • BLOOD: O+
              </div>
            </div>

            <p className="text-xs text-[#806F6F]">
              The bystander points their camera at the sticker (or enters short code <code className="text-[#E53935] font-mono font-bold">RQ7K29</code>).
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveStep(1)}
                className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#806F6F] text-xs font-bold border border-slate-200 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => {
                  onClose();
                  onLaunchScan('RQ7K29');
                }}
                className="flex-1 btn-rose-primary py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
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
