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
  Lock, 
  ExternalLink 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_DEMO_DATA } from '../services/api';

interface QrStickerPageProps {
  onNavigate: (view: string, param?: string) => void;
}

type StickerType = 'helmet' | 'bike' | 'car' | 'card';

export const QrStickerPage: React.FC<QrStickerPageProps> = ({ onNavigate }) => {
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Official Identity Stickers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
            Printable ResQTag Emergency Stickers
          </h1>
          <p className="text-xs text-slate-500">
            Weatherproof printable templates for helmets, motorcycles, scooters, and cars.
          </p>
        </div>

        {/* Print & Download Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copiedLink ? <Check className="w-4 h-4 text-safe-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Scan URL'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm text-xs font-bold flex items-center gap-2 transition-all"
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
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            activePreset === 'helmet'
              ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
          }`}
        >
          <HardHat className="w-4 h-4" />
          <span>Helmet Sticker (Compact)</span>
        </button>

        <button
          onClick={() => setActivePreset('bike')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            activePreset === 'bike'
              ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Bike / Scooter Tank Decal</span>
        </button>

        <button
          onClick={() => setActivePreset('car')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            activePreset === 'car'
              ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Car Windshield Tag</span>
        </button>

        <button
          onClick={() => setActivePreset('card')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            activePreset === 'card'
              ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
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
            className={`printable-sticker-container bg-white text-slate-900 rounded-3xl shadow-sticker border-2 border-slate-900 p-6 transition-all duration-300 w-full ${
              activePreset === 'helmet'
                ? 'max-w-xs'
                : activePreset === 'bike'
                ? 'max-w-sm'
                : activePreset === 'car'
                ? 'max-w-md'
                : 'max-w-sm aspect-[1.58/1]'
            }`}
          >
            {/* Top Red Alert Header */}
            <div className="bg-emergency-600 text-white py-2 px-3 rounded-lg text-center font-black tracking-wider uppercase text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm">
              <Shield className="w-4 h-4 fill-white text-white shrink-0" />
              <span>SCAN IN CASE OF EMERGENCY</span>
            </div>

            {/* Main Sticker Body */}
            <div className="py-4 flex flex-col items-center space-y-3">
              {/* QR Code Container */}
              <div className="p-3 bg-white border-2 border-slate-900 rounded-xl shadow-inner inline-block">
                <QRCodeSVG
                  value={scanUrl}
                  size={activePreset === 'helmet' ? 140 : 160}
                  level="H"
                  includeMargin={false}
                />
              </div>

              {/* Monospace Backup Code */}
              <div className="w-full text-center space-y-0.5">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  BACKUP SHORT CODE
                </div>
                <div className="text-2xl font-black font-mono tracking-widest text-slate-950 bg-slate-100 py-1 px-4 rounded-lg border border-slate-300 inline-block">
                  {currentProfile.shortCode}
                </div>
              </div>

              {/* Tag Details Bar */}
              <div className="w-full pt-2 border-t-2 border-slate-200 grid grid-cols-2 gap-2 text-[11px] font-mono font-bold text-slate-800">
                <div className="bg-slate-100 p-1.5 rounded border border-slate-200 text-center">
                  <span className="text-[9px] text-slate-500 block">VEHICLE</span>
                  <span>{currentProfile.vehicleNumber}</span>
                </div>
                <div className="bg-emergency-50 p-1.5 rounded border border-emergency-200 text-center text-emergency-700">
                  <span className="text-[9px] text-emergency-500 block">BLOOD GROUP</span>
                  <span>{currentProfile.bloodGroup}</span>
                </div>
              </div>

              {/* Brand Footer */}
              <div className="w-full flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider pt-1">
                <span>RESQTAG.APP</span>
                <span>ID: {currentProfile.tagId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticker Guide & Security Explanation */}
        <div className="lg:col-span-5 space-y-4 no-print">
          {/* Security Guarantee Box */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-brand-700 text-sm font-bold">
              <Lock className="w-4 h-4" />
              <span>Architectural Security Design</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Zero Private Data inside QR:</strong> The sticker contains only the secure identifier string (<code className="font-mono text-slate-900 font-bold">{currentProfile.shortCode}</code>).
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              When scanned, our backend resolves the current emergency profile in real-time. If you ever update your contacts or blood group, the <strong>same printed sticker continues working forever without reprinting</strong>.
            </p>
          </div>

          {/* Sticker Placement Tips */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recommended Placement
            </div>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-brand-600 font-bold">•</span>
                <span><strong>Motorcycle Helmet:</strong> Affix on the rear or left side of helmet shell.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-600 font-bold">•</span>
                <span><strong>Two-Wheeler:</strong> Affix on the fuel tank or front apron near headlight.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-600 font-bold">•</span>
                <span><strong>Four-Wheeler:</strong> Inside lower left corner of front windshield.</span>
              </li>
            </ul>
          </div>

          {/* Test Live Scan Button */}
          <button
            onClick={() => onNavigate('emergency-profile', currentProfile.shortCode)}
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <span>Preview Responder Screen for this Tag</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
