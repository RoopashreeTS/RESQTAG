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
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-slate-900">
      {/* Top Emergency Badge */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emergency-50 text-emergency-700 border border-emergency-200 text-xs font-bold">
          <ShieldAlert className="w-3.5 h-3.5 text-emergency-600" />
          <span>PUBLIC RESPONDER PORTAL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
          Scan ResQTag Identifier
        </h1>
        <p className="text-xs text-slate-500">
          Zero login or app install needed. Retrieve critical medical data in milliseconds.
        </p>
      </div>

      {/* Tabs: Camera vs Short Code */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('camera')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'camera'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Camera</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'code'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Enter Short Code</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'upload'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* MAIN SCAN CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-5">
        {/* CAMERA VIEW TAB */}
        {activeTab === 'camera' && (
          <div className="space-y-4 text-center">
            {/* Camera Viewfinder Box */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-square max-w-sm mx-auto border-2 border-slate-300 shadow-inner flex items-center justify-center">
              <div id="qr-reader-container" className="w-full h-full" />
              
              {!isScanningCamera && !cameraError && (
                <div className="p-4 text-slate-400 text-xs space-y-3">
                  <Camera className="w-10 h-10 mx-auto text-slate-500" />
                  <p>Starting video feed...</p>
                </div>
              )}

              {cameraError && (
                <div className="p-5 text-xs text-rose-800 space-y-3 bg-white/95 m-4 rounded-xl border border-rose-300">
                  <AlertCircle className="w-8 h-8 mx-auto text-emergency-600" />
                  <p>{cameraError}</p>
                  <button
                    onClick={() => setActiveTab('code')}
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs shadow-sm"
                  >
                    Switch to Short Code Entry
                  </button>
                </div>
              )}
            </div>

            {scanStatusMessage && (
              <p className="text-xs text-brand-600 font-semibold">
                {scanStatusMessage}
              </p>
            )}

            {isScanningCamera && (
              <button
                onClick={stopScanner}
                className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 mx-auto"
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
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                6-Character Backup Short Code or Tag ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. RQ7K29 or RQT-8829A4"
                  value={shortCodeInput}
                  onChange={(e) => setShortCodeInput(e.target.value.toUpperCase())}
                  className="w-full text-center text-xl font-mono uppercase tracking-widest py-3.5 px-4 bg-slate-50 border-2 border-slate-300 rounded-2xl text-slate-950 focus:outline-none focus:border-brand-600 focus:bg-white transition-colors"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                Printed directly below the QR code on every physical sticker.
              </p>
            </div>

            <button
              type="submit"
              disabled={!shortCodeInput.trim()}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
              className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-8 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors space-y-3"
            >
              <Upload className="w-10 h-10 mx-auto text-slate-400" />
              <div>
                <p className="text-sm font-bold text-slate-900">Upload QR Code Photo</p>
                <p className="text-xs text-slate-500">Select an image from your device</p>
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
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold flex items-center gap-1 text-slate-700">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Hackathon Quick Test:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onScanComplete('RQ7K29')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center justify-between transition-colors text-left"
            >
              <div>
                <span className="font-mono font-bold text-brand-700 block">RQ7K29</span>
                <span className="text-[10px] text-slate-500">Rahul Kumar (KA-01-AB-1234)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => onScanComplete('RQT-8829A4')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center justify-between transition-colors text-left"
            >
              <div>
                <span className="font-mono font-bold text-slate-900 block">RQT-8829A4</span>
                <span className="text-[10px] text-slate-500">Direct Tag ID Lookup</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
