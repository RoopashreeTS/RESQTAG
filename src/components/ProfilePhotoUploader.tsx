import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Check, 
  X, 
  ZoomIn, 
  RotateCw, 
  AlertCircle 
} from 'lucide-react';

interface ProfilePhotoUploaderProps {
  photoUrl?: string;
  onPhotoChange: (newPhotoUrl: string | undefined) => void;
  className?: string;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  photoUrl,
  onPhotoChange,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Crop state
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cropImageRef = useRef<HTMLImageElement | null>(null);

  // Trigger file dialog
  const handleSelectFileClick = () => {
    setErrorMessage(null);
    fileInputRef.current?.click();
  };

  // Validate and read selected file
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so re-selecting same file triggers change
    e.target.value = '';

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setErrorMessage('Please upload a JPG, PNG, or WEBP image under 5 MB.');
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 5 MB.`);
      return;
    }

    setErrorMessage(null);

    // Read image to data URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setRawImageSrc(reader.result);
        setZoom(1);
        setRotation(0);
        setPan({ x: 0, y: 0 });
        setIsCropModalOpen(true);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file. Please try another photo.');
    };
    reader.readAsDataURL(file);
  };

  // Pan / Drag handlers in crop modal
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Render and export the cropped image via Canvas
  const handleApplyCrop = useCallback(() => {
    const image = cropImageRef.current;
    if (!image) return;

    const outputSize = 400; // 400x400 output
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, outputSize, outputSize);

    // Save and transform
    ctx.save();
    ctx.translate(outputSize / 2, outputSize / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Draw image centered with user's pan offset
    const scaleFactor = outputSize / 260; // ratio of export size to preview box (260px)
    const drawWidth = image.naturalWidth * (outputSize / Math.min(image.naturalWidth, image.naturalHeight));
    const drawHeight = image.naturalHeight * (outputSize / Math.min(image.naturalWidth, image.naturalHeight));

    ctx.drawImage(
      image,
      -drawWidth / 2 + (pan.x * scaleFactor),
      -drawHeight / 2 + (pan.y * scaleFactor),
      drawWidth,
      drawHeight
    );
    ctx.restore();

    // Export as high quality, optimized JPEG data URL
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
    onPhotoChange(croppedDataUrl);
    setIsCropModalOpen(false);
    setRawImageSrc(null);
  }, [zoom, rotation, pan, onPhotoChange]);

  const handleRemovePhoto = () => {
    onPhotoChange(undefined);
    setErrorMessage(null);
  };

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCropModalOpen) {
        setIsCropModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCropModalOpen]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Main Header */}
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Profile Photo
        </label>
        <p className="text-xs text-slate-500">
          Upload a clear photo so responders can visually identify you in an emergency.
        </p>
      </div>

      {/* Error Alert Message */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-[#FFEFEF] border border-red-200 text-[#C62828] text-xs flex items-center gap-2 animate-in fade-in shadow-sm">
          <AlertCircle className="w-4 h-4 text-[#E53935] shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Photo Preview & Controls Area */}
      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-white/75 backdrop-blur-sm border border-red-100 shadow-sm">
        
        {/* Large Rounded Photo Preview */}
        <div className="relative group shrink-0">
          {photoUrl ? (
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#E53935] shadow-md bg-white">
              <img
                src={photoUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#2B2020]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleSelectFileClick}
                  className="p-2 rounded-full bg-white/95 text-[#2B2020] hover:text-[#E53935] shadow-sm transform transition hover:scale-110"
                  title="Change photo"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-red-200 bg-[#FFF7F7] flex flex-col items-center justify-center text-[#806F6F] gap-1.5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#FFEFEF] flex items-center justify-center text-[#E53935]">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#806F6F]">
                Upload Photo
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons & Guidance */}
        <div className="flex-1 space-y-2.5 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-[#2B2020]">
              {photoUrl ? 'Verified Identification Photo' : 'Upload Your Photo'}
            </h4>
            <p className="text-[11px] text-[#806F6F]">
              Accepted: JPG, JPEG, PNG, WEBP (Max 5 MB).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {!photoUrl ? (
              <button
                type="button"
                onClick={handleSelectFileClick}
                className="btn-rose-primary px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>UPLOAD PHOTO</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSelectFileClick}
                  className="btn-rose-outline px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#E53935]" />
                  <span>Change Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 text-[#E53935] border border-red-200 hover:border-red-300 font-semibold text-xs transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* CROP & ADJUST MODAL DIALOG                               */}
      {/* ======================================================== */}
      {isCropModalOpen && rawImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2020]/75 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card-rose-solid max-w-md w-full p-6 space-y-5 shadow-2xl relative text-[#2B2020]">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-red-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFEFEF] flex items-center justify-center text-[#E53935]">
                  <Camera className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#2B2020]">Crop Profile Photo</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCropModalOpen(false)}
                className="p-1 rounded-lg text-[#806F6F] hover:text-[#2B2020] hover:bg-[#FFEFEF] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#806F6F]">
              Drag to reposition, use the zoom slider, or rotate to fit your face clearly in the frame.
            </p>

            {/* Crop Viewport */}
            <div className="flex justify-center">
              <div
                className="relative w-[260px] h-[260px] rounded-2xl bg-slate-900 overflow-hidden cursor-grab active:cursor-grabbing select-none border-2 border-[#E53935] shadow-inner"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Image to be transformed */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 100ms ease-out',
                  }}
                >
                  <img
                    ref={cropImageRef}
                    src={rawImageSrc}
                    alt="Crop Source"
                    className="max-w-none pointer-events-none"
                    style={{
                      width: '260px',
                      height: 'auto',
                    }}
                    draggable={false}
                  />
                </div>

                {/* Circular Viewport Overlay Mask */}
                <div className="absolute inset-0 pointer-events-none border-[30px] border-slate-950/60 rounded-full" />
                
                {/* Center Grid Helper Lines */}
                <div className="absolute inset-0 pointer-events-none border border-white/40 rounded-full" />
              </div>
            </div>

            {/* Controls: Zoom & Rotate */}
            <div className="space-y-3 bg-[#FFF7F7] p-3.5 rounded-2xl border border-red-100 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[#2B2020] font-semibold flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5 text-[#E53935]" />
                  Zoom
                </span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-[#E53935] cursor-pointer"
                />
                <span className="font-mono font-bold text-[#2B2020] w-9 text-right">
                  {zoom.toFixed(1)}x
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-red-100">
                <span className="text-[#806F6F] font-semibold">Reposition & Rotation</span>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-red-200 hover:bg-[#FFEFEF] text-[#2B2020] font-semibold flex items-center gap-1 text-[11px] transition-all hover:-translate-y-0.5"
                >
                  <RotateCw className="w-3 h-3 text-[#E53935]" />
                  <span>Rotate 90°</span>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsCropModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#806F6F] font-semibold text-xs border border-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                className="flex-1 btn-rose-primary py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Apply & Save Photo</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
