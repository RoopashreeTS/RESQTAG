import React, { useState, useRef } from 'react';
import { 
  Printer, 
  Shield, 
  Copy, 
  Check, 
  Bike, 
  Car, 
  HardHat, 
  CreditCard, 
  Lock
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_DEMO_DATA } from '../services/api';

interface QrStickerPageProps {
  onNavigate?: (view: string, param?: string) => void;
}

type StickerType = 'helmet' | 'bike' | 'car' | 'card';

export const QrStickerPage: React.FC<QrStickerPageProps> = () => {
  const { profile } = useAuth();
  const currentProfile = profile || INITIAL_DEMO_DATA;

  const [activePreset, setActivePreset] = useState<StickerType>('helmet');
  const [copiedLink, setCopiedLink] = useState(false);
  const stickerRef = useRef<HTMLDivElement>(null);

  const scanUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/#scan/${currentProfile.shortCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(scanUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-[#2B2020] relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-100 pb-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-[#E53935] text-xs font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Official Identity Stickers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B2020] mt-1">
            Printable ResQTag Emergency Stickers
          </h1>
          <p className="text-xs text-[#806F6F]">
            Weatherproof printable templates for helmets, motorcycles, scooters, and cars.
          </p>
        </div>

        {/* Print & Download Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="btn-rose-outline px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Scan URL'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-rose-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Sticker Sheet</span>
          </button>
        </div>
      </div>

      {/* Preset Selector Buttons (No Print) */}
      <div className="flex flex-wrap gap-2 no-print">
        <button
          onClick={() => setActivePreset('helmet')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
            activePreset === 'helmet'
              ? 'bg-gradient-to-r from-[#E53935] to-[#FF6B6B] text-white border-[#E53935] shadow-rose-btn -translate-y-0.5'
              : 'bg-white/80 text-[#2B2020] border-red-200 hover:border-[#E53935] hover:bg-[#FFEFEF]'
          }`}
        >
          <HardHat className="w-4 h-4" />
          <span>Helmet Sticker (Compact)</span>
        </button>

        <button
          onClick={() => setActivePreset('bike')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
            activePreset === 'bike'
              ? 'bg-gradient-to-r from-[#E53935] to-[#FF6B6B] text-white border-[#E53935] shadow-rose-btn -translate-y-0.5'
              : 'bg-white/80 text-[#2B2020] border-red-200 hover:border-[#E53935] hover:bg-[#FFEFEF]'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Bike / Scooter Tank Decal</span>
        </button>

        <button
          onClick={() => setActivePreset('car')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
            activePreset === 'car'
              ? 'bg-gradient-to-r from-[#E53935] to-[#FF6B6B] text-white border-[#E53935] shadow-rose-btn -translate-y-0.5'
              : 'bg-white/80 text-[#2B2020] border-red-200 hover:border-[#E53935] hover:bg-[#FFEFEF]'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Car Windshield Tag</span>
        </button>

        <button
          onClick={() => setActivePreset('card')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
            activePreset === 'card'
              ? 'bg-gradient-to-r from-[#E53935] to-[#FF6B6B] text-white border-[#E53935] shadow-rose-btn -translate-y-0.5'
              : 'bg-white/80 text-[#2B2020] border-red-200 hover:border-[#E53935] hover:bg-[#FFEFEF]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Wallet Emergency Card</span>
        </button>
      </div>

      {/* STICKER PREVIEW & PRINT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Center: The High-Contrast Printable Sticker */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            ref={stickerRef}
            className={`printable-sticker-container bg-white text-slate-900 rounded-3xl shadow-2xl border-2 border-red-300 p-6 transition-all duration-300 w-full ${
              activePreset === 'helmet'
                ? 'max-w-xs'
                : activePreset === 'bike'
                ? 'max-w-sm'
                : activePreset === 'car'
                ? 'max-w-sm'
                : 'max-w-sm'
            }`}
          >
            {/* Sticker Top Header Badge */}
            <div className="bg-gradient-to-r from-[#E53935] to-[#C62828] text-white py-1.5 px-3 rounded-xl text-center shadow-sm">
              <span className="text-[11px] font-black uppercase tracking-wider block">
                EMERGENCY IDENTITY TAG
              </span>
              <span className="text-[9px] font-bold text-red-100 uppercase tracking-widest block">
                SCAN IN CASE OF ACCIDENT
              </span>
            </div>

            {/* Main QR Code Frame */}
            <div className="flex justify-center py-4">
              <div className="p-3 bg-white border-2 border-slate-900 rounded-2xl shadow-inner inline-block">
                <QRCodeSVG
                  value={scanUrl}
                  size={activePreset === 'helmet' ? 140 : 160}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>

            {/* Short Code Backup */}
            <div className="text-center space-y-1 pb-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                MANUAL RESCUE CODE
              </span>
              <div className="text-2xl font-black font-mono tracking-widest text-[#E53935] bg-red-50 py-1.5 px-4 rounded-xl border border-red-200 inline-block shadow-sm">
                {currentProfile.shortCode}
              </div>
            </div>

            {/* Vehicle & Blood Group Footer */}
            <div className="border-t-2 border-dashed border-slate-200 pt-3 mt-2 flex items-center justify-between text-xs font-mono font-bold">
              <div>
                <span className="text-[9px] text-slate-400 block font-sans">VEHICLE</span>
                <span className="text-slate-900">{currentProfile.vehicleNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block font-sans">BLOOD</span>
                <span className="text-[#E53935] text-sm font-black">{currentProfile.bloodGroup}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Printing instructions */}
        <div className="lg:col-span-5 space-y-4 no-print text-xs text-[#806F6F]">
          <div className="glass-card-rose-solid rounded-3xl p-6 space-y-3 shadow-lg">
            <h3 className="text-sm font-bold text-[#2B2020] flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-[#E53935]" />
              <span>Recommended Materials</span>
            </h3>
            <ul className="space-y-2 list-disc list-inside text-[11px] leading-relaxed">
              <li><strong>Waterproof Vinyl Paper:</strong> For helmet and motorcycle exterior decals.</li>
              <li><strong>Transparent Laminate Sheet:</strong> Protects against UV sun fading and rain.</li>
              <li><strong>Direct Camera Compatible:</strong> Responders do not need to download an application.</li>
            </ul>
          </div>

          <div className="glass-card-rose rounded-3xl p-5 space-y-2 shadow-md">
            <h4 className="font-bold text-[#2B2020] flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#E53935]" />
              <span>Privacy Guaranteed</span>
            </h4>
            <p className="text-[11px] leading-relaxed">
              The QR code does not contain unencrypted medical data. It only holds a secure short-identifier token resolved in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
