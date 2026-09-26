import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Search, 
  Upload, 
  ShieldAlert, 
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
    if (text.includes('#emergency/')) {
      const parts = text.split('#emergency/');
      return parts[parts.length - 1].trim();
    }
    if (text.includes('/emergency/')) {
      const parts = text.split('/emergency/');
      return parts[parts.length - 1].trim();
    }
    if (text.includes('#scan/')) {
      const parts = text.split('#scan/');
      return parts[parts.length - 1].trim();
    }
    if (text.includes('/scan/')) {
      const parts = text.split('/scan/');
      return parts[parts.length - 1].trim();
    }
    return text.trim();
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
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-[#2B2020] relative z-10">
      {/* Top Emergency Badge */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFEFEF] text-[#E53935] border border-red-200 text-xs font-bold shadow-sm">
          <ShieldAlert className="w-3.5 h-3.5 text-[#E53935]" />
          <span>PUBLIC RESPONDER PORTAL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2B2020]">
          SCAN RESQTAG
        </h1>
        <p className="text-xs text-[#806F6F]">
          Scan a ResQTag QR code or enter the backup code.
        </p>
      </div>

      {/* Tabs: Camera vs Short Code */}
      <div className="flex bg-[#FFE5E5]/60 p-1.5 rounded-2xl border border-red-200 shadow-inner">
        <button
          onClick={() => setActiveTab('camera')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'camera'
              ? 'bg-gradient-to-r from-[#E53935] to-[#FF6B6B] text-white shadow-rose-btn'
              : 'text-[#806F6F] hover:text-[#2B2020]'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Camera</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'code'
              ? 'bg-gradient-to-r from-[#E53935] to-[#FF6B6B] text-white shadow-rose-btn'
              : 'text-[#806F6F] hover:text-[#2B2020]'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Enter ResQTag Code</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'upload'
              ? 'bg-gradient-to-r from-[#E53935] to-[#FF6B6B] text-white shadow-rose-btn'
              : 'text-[#806F6F] hover:text-[#2B2020]'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* MAIN SCAN CONTAINER */}
      <div className="glass-card-rose-solid rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        {/* CAMERA VIEW TAB */}
        {activeTab === 'camera' && (
          <div className="space-y-4 text-center">
            {/* Camera Viewfinder Box */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-square max-w-sm mx-auto border-2 border-red-300 shadow-inner flex items-center justify-center">
              <div id="qr-reader-container" className="w-full h-full" />
              
              {!isScanningCamera && !cameraError && (
                <div className="p-4 text-slate-400 text-xs space-y-3">
                  <Camera className="w-10 h-10 mx-auto text-slate-500" />
                  <p>Starting video feed...</p>
                </div>
              )}

              {cameraError && (
                <div className="p-5 text-xs text-[#C62828] space-y-3 bg-white/95 m-4 rounded-2xl border border-red-200 shadow-lg">
                  <AlertCircle className="w-8 h-8 mx-auto text-[#E53935]" />
                  <p className="font-semibold">{cameraError}</p>
                  <button
                    onClick={() => setActiveTab('code')}
                    className="btn-rose-primary px-4 py-2 rounded-xl font-bold text-xs"
                  >
                    Switch to Short Code Entry
                  </button>
                </div>
              )}
            </div>

            {scanStatusMessage && (
              <p className="text-xs text-[#E53935] font-semibold">
                {scanStatusMessage}
              </p>
            )}

            {isScanningCamera && (
              <button
                onClick={stopScanner}
                className="text-xs text-[#806F6F] hover:text-[#E53935] flex items-center gap-1 mx-auto transition-colors font-medium"
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
              <label className="block text-xs font-bold text-[#2B2020] uppercase tracking-wider text-center">
                Enter ResQTag Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. RQ7K29 or RQT-8829A4"
                  value={shortCodeInput}
                  onChange={(e) => setShortCodeInput(e.target.value.toUpperCase())}
                  className="w-full text-center text-2xl font-mono uppercase tracking-widest py-3.5 px-4 bg-white/90 border-2 border-red-200 rounded-2xl text-[#2B2020] focus:outline-none focus:border-[#E53935] focus:ring-4 focus:ring-[#E53935]/15 transition-all shadow-inner"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-[#806F6F] text-center">
                Example: <strong>RQ7K29</strong> (Printed directly below the QR code on every sticker).
              </p>
            </div>

            <button
              type="submit"
              disabled={!shortCodeInput.trim()}
              className="w-full btn-rose-primary py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 uppercase tracking-wide shadow-md"
            >
              <Search className="w-4 h-4" />
              <span>FIND RESQTAG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* IMAGE UPLOAD TAB */}
        {activeTab === 'upload' && (
          <div className="space-y-4 text-center">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-red-200 hover:border-[#E53935] rounded-3xl p-8 cursor-pointer bg-white/60 hover:bg-[#FFEFEF]/40 transition-all space-y-3"
            >
              <Upload className="w-10 h-10 mx-auto text-[#E53935]" />
              <div>
                <p className="text-sm font-bold text-[#2B2020]">Upload QR Code Photo</p>
                <p className="text-xs text-[#806F6F]">Select an image from your device</p>
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
      </div>
    </div>
  );
};
