import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Search, 
  Upload, 
  ShieldAlert, 
  Sparkles, 
  AlertCircle, 
  ArrowRight,
  StopCircle
} from 'lucide-react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

interface ResponderScanPageProps {
  onScanComplete: (identifier: string) => void;
}

export const ResponderScanPage: React.FC<ResponderScanPageProps> = ({ onScanComplete }) => {
  const [shortCodeInput, setShortCodeInput] = useState('');
  const [isScanningCamera, setIsScanningCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanStatusMessage, setScanStatusMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'camera' | 'code' | 'upload'>('camera');

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to extract tag code from raw scanned string or URL
  const extractCode = (scannedText: string): string => {
    const text = scannedText.trim();
    if (text.includes('#scan/')) {
      const parts = text.split('#scan/');
      return parts[parts.length - 1].trim().toUpperCase();
    }
    if (text.includes('/scan/')) {
      const parts = text.split('/scan/');
      return parts[parts.length - 1].trim().toUpperCase();
    }
    return text.toUpperCase();
  };

  // Start Camera Scanner
  const startScanner = async () => {
    setCameraError(null);
    setScanStatusMessage('Initializing camera...');
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-reader-container');
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          const code = extractCode(decodedText);
          stopScanner();
          onScanComplete(code);
        },
        () => {
          // ignore frame miss
        }
      );
      setIsScanningCamera(true);
      setScanStatusMessage('Point camera at the ResQTag QR code sticker');
    } catch (err: any) {
      console.warn('Camera start error:', err);
      setCameraError('Camera access unavailable or permission denied. Please use the Manual Short Code option below.');
      setIsScanningCamera(false);
      setScanStatusMessage(null);
    }
  };

  // Stop Camera Scanner
  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
      try {
        await scannerRef.current.stop();
      } catch (e) {
        console.warn('Error stopping scanner:', e);
      }
    }
    setIsScanningCamera(false);
    setScanStatusMessage(null);
  };

  useEffect(() => {
    if (activeTab === 'camera') {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [activeTab]);

  // Handle Manual Short Code submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortCodeInput.trim()) return;
    const clean = shortCodeInput.trim().toUpperCase();
    onScanComplete(clean);
  };

  // Handle File Upload Scan
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setScanStatusMessage('Processing uploaded QR image...');
      const html5QrCode = new Html5Qrcode('qr-reader-hidden');
      const decodedText = await html5QrCode.scanFile(file, true);
      const code = extractCode(decodedText);
      onScanComplete(code);
    } catch {
      setCameraError('Could not detect a valid ResQTag QR code in this image. Try manual code entry.');
      setScanStatusMessage(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Emergency Badge */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emergency-600/20 text-emergency-500 border border-emergency-500/30 text-xs font-bold">
          <ShieldAlert className="w-3.5 h-3.5 text-emergency-500" />
          <span>PUBLIC EMERGENCY RESPONDER PORTAL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Scan ResQTag Identifier
        </h1>
        <p className="text-xs text-slate-300">
          Zero login or app install needed. Retrieve critical medical data in milliseconds.
        </p>
      </div>

      {/* Tabs: Camera vs Short Code */}
      <div className="flex bg-navy-900 p-1.5 rounded-xl border border-navy-750">
        <button
          onClick={() => setActiveTab('camera')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'camera'
              ? 'bg-emergency-600 text-white shadow-glow-red'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Live Camera</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'code'
              ? 'bg-emergency-600 text-white shadow-glow-red'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Enter Short Code</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'upload'
              ? 'bg-emergency-600 text-white shadow-glow-red'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* MAIN SCAN CONTAINER */}
      <div className="bg-navy-900 border border-navy-750 rounded-2xl p-6 shadow-card space-y-5">
        {/* CAMERA VIEW TAB */}
        {activeTab === 'camera' && (
          <div className="space-y-4 text-center">
            {/* Camera Viewfinder Box */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-square max-w-sm mx-auto border-2 border-emergency-500 shadow-inner flex items-center justify-center">
              <div id="qr-reader-container" className="w-full h-full" />
              
              {!isScanningCamera && !cameraError && (
                <div className="p-4 text-slate-400 text-xs space-y-3">
                  <Camera className="w-10 h-10 mx-auto text-slate-600" />
                  <p>Starting video feed...</p>
                </div>
              )}

              {cameraError && (
                <div className="p-5 text-xs text-rose-300 space-y-3 bg-navy-950/90 m-4 rounded-xl border border-rose-500/40">
                  <AlertCircle className="w-8 h-8 mx-auto text-rose-400" />
                  <p>{cameraError}</p>
                  <button
                    onClick={() => setActiveTab('code')}
                    className="px-4 py-2 rounded-lg bg-emergency-600 text-white font-bold text-xs"
                  >
                    Switch to Short Code Entry
                  </button>
                </div>
              )}
            </div>

            {scanStatusMessage && (
              <p className="text-xs text-amber-400 font-semibold animate-pulse">
                {scanStatusMessage}
              </p>
            )}

            {isScanningCamera && (
              <button
                onClick={stopScanner}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 mx-auto"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Pause Scanner</span>
              </button>
            )}
          </div>
        )}

        {/* SHORT CODE ENTRY TAB */}
        {activeTab === 'code' && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                6-Character Backup Short Code or Tag ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. RQ7K29 or RQT-8829A4"
                  value={shortCodeInput}
                  onChange={(e) => setShortCodeInput(e.target.value.toUpperCase())}
                  className="w-full text-center text-xl font-mono uppercase tracking-widest py-3 px-4 bg-navy-800 border-2 border-navy-700 rounded-xl text-white focus:outline-none focus:border-emergency-500 transition-colors"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Printed directly below the QR code on every physical sticker.
              </p>
            </div>

            <button
              type="submit"
              disabled={!shortCodeInput.trim()}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emergency-600 to-emergency-700 text-white shadow-glow-red hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Retrieve Emergency Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* IMAGE UPLOAD TAB */}
        {activeTab === 'upload' && (
          <div className="space-y-4 text-center">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-navy-700 hover:border-emergency-500 rounded-2xl p-8 cursor-pointer bg-navy-850 hover:bg-navy-800 transition-colors space-y-3"
            >
              <Upload className="w-10 h-10 mx-auto text-slate-400" />
              <div>
                <p className="text-sm font-bold text-white">Upload QR Code Photo</p>
                <p className="text-xs text-slate-400">Select an image from your phone photo gallery</p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <div id="qr-reader-hidden" className="hidden" />
          </div>
        )}

        {/* HACKATHON QUICK-TEST BUTTONS */}
        <div className="pt-4 border-t border-navy-800 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold flex items-center gap-1 text-amber-400">
              <Sparkles className="w-3 h-3" />
              Hackathon Fast-Test Short Codes:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onScanComplete('RQ7K29')}
              className="p-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 hover:border-emergency-500/50 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <div className="text-left">
                <span className="font-mono font-bold text-amber-300 block">RQ7K29</span>
                <span className="text-[10px] text-slate-400">Rahul Kumar (KA-01-AB-1234)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-emergency-500" />
            </button>

            <button
              type="button"
              onClick={() => onScanComplete('RQT-8829A4')}
              className="p-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 hover:border-brand-blue/50 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <div className="text-left">
                <span className="font-mono font-bold text-brand-cyan block">RQT-8829A4</span>
                <span className="text-[10px] text-slate-400">Direct Secure Tag ID Lookup</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-brand-cyan" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
