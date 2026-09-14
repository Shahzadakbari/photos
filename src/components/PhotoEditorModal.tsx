import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  RotateCw, 
  FlipHorizontal, 
  Sliders, 
  Download, 
  Save, 
  RotateCcw, 
  Eye, 
  Sun, 
  Contrast, 
  Palette, 
  Flame, 
  Sparkles,
  Check
} from 'lucide-react';
import { Photo, PhotoAdjustments } from '../types';
import { defaultAdjustments } from '../data/initialPhotos';

interface PhotoEditorModalProps {
  photo: Photo;
  onClose: () => void;
  onSaveAdjustments: (photoId: string, adjustments: PhotoAdjustments) => void;
}

const FILTER_PRESETS: { id: PhotoAdjustments['filterPreset']; name: string; values: Partial<PhotoAdjustments> }[] = [
  { id: 'original', name: 'Original', values: { brightness: 0, contrast: 0, saturation: 0, sepia: 0, grayscale: 0, warmth: 0, vignette: 0 } },
  { id: 'vivid', name: 'Vivid Pop', values: { brightness: 5, contrast: 25, saturation: 40, warmth: 10, sepia: 0, grayscale: 0, vignette: 15 } },
  { id: 'mono', name: 'B&W Noir', values: { brightness: 0, contrast: 35, saturation: -100, grayscale: 100, sepia: 0, warmth: 0, vignette: 30 } },
  { id: 'dramatic', name: 'Dramatic', values: { brightness: -10, contrast: 45, saturation: -15, warmth: -10, sepia: 0, grayscale: 0, vignette: 40 } },
  { id: 'warm', name: 'Golden Hour', values: { brightness: 10, contrast: 15, saturation: 20, warmth: 45, sepia: 25, grayscale: 0, vignette: 20 } },
  { id: 'film', name: 'Vintage Film', values: { brightness: 5, contrast: -10, saturation: -20, warmth: 20, sepia: 35, grayscale: 0, vignette: 25 } },
  { id: 'cool', name: 'Arctic Cool', values: { brightness: 5, contrast: 15, saturation: 10, warmth: -40, sepia: 0, grayscale: 0, vignette: 10 } },
];

export const PhotoEditorModal: React.FC<PhotoEditorModalProps> = ({
  photo,
  onClose,
  onSaveAdjustments,
}) => {
  const [adjustments, setAdjustments] = useState<PhotoAdjustments>(
    photo.adjustments ? { ...photo.adjustments } : { ...defaultAdjustments }
  );
  const [comparing, setComparing] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute CSS filter string
  const getFilterStyle = (adj: PhotoAdjustments) => {
    if (comparing) return 'none';
    const b = 100 + adj.brightness;
    const c = 100 + adj.contrast;
    const s = 100 + adj.saturation;
    const sep = adj.sepia;
    const gray = adj.grayscale;
    const blur = adj.blur;
    const inv = adj.invert;
    
    // Warmth simulation via hue-rotate and sepia
    return `brightness(${b}%) contrast(${c}%) saturate(${s}%) sepia(${sep}%) grayscale(${gray}%) blur(${blur}px) invert(${inv}%)`;
  };

  const getTransformStyle = (adj: PhotoAdjustments) => {
    if (comparing) return 'none';
    return `rotate(${adj.rotation}deg) scaleX(${adj.flipH ? -1 : 1})`;
  };

  const handlePresetSelect = (preset: typeof FILTER_PRESETS[0]) => {
    setAdjustments((prev) => ({
      ...prev,
      ...preset.values,
      filterPreset: preset.id,
    }));
  };

  const handleReset = () => {
    setAdjustments({ ...defaultAdjustments });
  };

  const handleRotate = () => {
    setAdjustments((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  };

  const handleFlipH = () => {
    setAdjustments((prev) => ({
      ...prev,
      flipH: !prev.flipH,
    }));
  };

  const handleSave = () => {
    onSaveAdjustments(photo.id, adjustments);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  // Export processed image via HTML5 Canvas
  const handleExportDownload = async () => {
    setIsExporting(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = photo.url;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isSideways = adjustments.rotation === 90 || adjustments.rotation === 270;
      canvas.width = isSideways ? img.naturalHeight : img.naturalWidth;
      canvas.height = isSideways ? img.naturalWidth : img.naturalHeight;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((adjustments.rotation * Math.PI) / 180);
      if (adjustments.flipH) {
        ctx.scale(-1, 1);
      }
      ctx.filter = `brightness(${100 + adjustments.brightness}%) contrast(${100 + adjustments.contrast}%) saturate(${100 + adjustments.saturation}%) sepia(${adjustments.sepia}%) grayscale(${adjustments.grayscale}%) blur(${adjustments.blur}px)`;
      
      const drawW = img.naturalWidth;
      const drawH = img.naturalHeight;
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Vignette effect if specified
      if (adjustments.vignette > 0) {
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.3,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.7
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, `rgba(0,0,0,${adjustments.vignette / 100 * 0.8})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Download triggered
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `edited-${photo.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsExporting(false);
      }, 'image/jpeg', 0.92);
    } catch (err) {
      console.error('Export failed:', err);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/90 backdrop-blur-md p-4">
      <div className="w-full max-w-6xl h-[92vh] bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Edit & Adjust: {photo.title}
              </h2>
              <span className="text-xs text-neutral-400">
                Non-destructive adjustments • Canvas export engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Hold to compare */}
            <button
              onMouseDown={() => setComparing(true)}
              onMouseUp={() => setComparing(false)}
              onTouchStart={() => setComparing(true)}
              onTouchEnd={() => setComparing(false)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                comparing 
                  ? 'bg-blue-600 text-white border-blue-500' 
                  : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
              }`}
              title="Press and hold to compare with original"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{comparing ? 'Showing Original' : 'Hold to Compare'}</span>
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Reset all adjustments"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* Export download */}
            <button
              onClick={handleExportDownload}
              disabled={isExporting}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>

            {/* Save to library */}
            <button
              id="save-adjustments-btn"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
            >
              {savedNotice ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedNotice ? 'Saved!' : 'Save Changes'}</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area: Left Stage, Right Controls */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Canvas Preview */}
          <div className="flex-1 bg-neutral-950/70 p-6 flex items-center justify-center relative overflow-hidden">
            <div className="relative max-h-full max-w-full flex items-center justify-center">
              <img
                src={photo.url}
                alt={photo.title}
                style={{
                  filter: getFilterStyle(adjustments),
                  transform: getTransformStyle(adjustments),
                  transition: 'filter 0.1s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-2xl"
              />

              {/* Vignette overlay */}
              {!comparing && adjustments.vignette > 0 && (
                <div
                  className="absolute inset-0 pointer-events-none rounded-lg"
                  style={{
                    background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${adjustments.vignette / 100 * 0.85}) 100%)`,
                  }}
                />
              )}
            </div>

            {/* Orientation quick controls bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-800 shadow-lg">
              <button
                onClick={handleRotate}
                className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-full transition-colors flex items-center gap-1 text-xs"
                title="Rotate 90 degrees"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate</span>
              </button>
              <div className="w-px h-4 bg-neutral-700" />
              <button
                onClick={handleFlipH}
                className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-full transition-colors flex items-center gap-1 text-xs"
                title="Flip horizontal"
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span>Flip</span>
              </button>
            </div>
          </div>

          {/* Right Adjustments Panel */}
          <div className="w-full md:w-80 bg-neutral-900 border-t md:border-t-0 md:border-l border-neutral-800 p-5 overflow-y-auto space-y-6 shrink-0">
            {/* Filter Presets */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Preset Styles
              </span>
              <div className="grid grid-cols-2 gap-2">
                {FILTER_PRESETS.map((preset) => {
                  const isActive = adjustments.filterPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium text-left border transition-all ${
                        isActive
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm'
                          : 'bg-neutral-800/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sliders: Tone & Light */}
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-yellow-400" />
                Light & Contrast
              </span>

              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Brightness</span>
                  <span className="font-mono text-neutral-300">{adjustments.brightness}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={adjustments.brightness}
                  onChange={(e) =>
                    setAdjustments((p) => ({ ...p, brightness: Number(e.target.value) }))
                  }
                  className="w-full accent-blue-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Contrast</span>
                  <span className="font-mono text-neutral-300">{adjustments.contrast}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={adjustments.contrast}
                  onChange={(e) =>
                    setAdjustments((p) => ({ ...p, contrast: Number(e.target.value) }))
                  }
                  className="w-full accent-blue-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Sliders: Color & Atmosphere */}
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-400" />
                Color & Tone
              </span>

              {/* Saturation */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Saturation</span>
                  <span className="font-mono text-neutral-300">{adjustments.saturation}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={adjustments.saturation}
                  onChange={(e) =>
                    setAdjustments((p) => ({ ...p, saturation: Number(e.target.value) }))
                  }
                  className="w-full accent-blue-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Warmth */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Warmth</span>
                  <span className="font-mono text-neutral-300">{adjustments.warmth}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={adjustments.warmth}
                  onChange={(e) =>
                    setAdjustments((p) => ({ ...p, warmth: Number(e.target.value) }))
                  }
                  className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Sepia */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Sepia / Vintage</span>
                  <span className="font-mono text-neutral-300">{adjustments.sepia}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={adjustments.sepia}
                  onChange={(e) =>
                    setAdjustments((p) => ({ ...p, sepia: Number(e.target.value) }))
                  }
                  className="w-full accent-yellow-600 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Grayscale */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Black & White</span>
                  <span className="font-mono text-neutral-300">{adjustments.grayscale}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={adjustments.grayscale}
                  onChange={(e) =>
                    setAdjustments((p) => ({ ...p, grayscale: Number(e.target.value) }))
                  }
                  className="w-full accent-neutral-400 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Vignette */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Vignette</span>
                  <span className="font-mono text-neutral-300">{adjustments.vignette}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={adjustments.vignette}
                  onChange={(e) =>
                    setAdjustments((p) => ({ ...p, vignette: Number(e.target.value) }))
                  }
                  className="w-full accent-purple-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
