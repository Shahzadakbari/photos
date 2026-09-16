import React, { useState } from 'react';
import { 
  Palette, 
  X, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Pipette, 
  Sun, 
  Moon, 
  Sliders,
  Waves,
  CircleDot,
  Compass,
  HeartPulse,
  Activity,
  Zap,
  Gauge,
  Film,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { 
  BackgroundMotionConfig, 
  BackgroundMotionStyle, 
  BackgroundMotionSpeed, 
  BackgroundMotionIntensity 
} from '../types';
import { getMotionPaletteForColor } from '../utils/colorMotion';

interface BackgroundColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: string;
  onSelectColor: (color: string) => void;
  onResetColor: () => void;
  defaultColor: string;
  motionConfig: BackgroundMotionConfig;
  onUpdateMotionConfig: (config: Partial<BackgroundMotionConfig>) => void;
}

interface ColorPreset {
  name: string;
  hex: string;
  category: 'dark' | 'rich' | 'vibrant' | 'light';
  description?: string;
}

const COLOR_PRESETS: ColorPreset[] = [
  // Dark & Studio Essentials
  { name: 'Dark Charcoal', hex: '#171717', category: 'dark', description: 'Default studio neutral' },
  { name: 'OLED Pitch Black', hex: '#09090b', category: 'dark', description: 'Absolute deep black' },
  { name: 'Midnight Slate', hex: '#0f172a', category: 'dark', description: 'Cool slate navy tone' },
  { name: 'Deep Navy', hex: '#0a192f', category: 'dark', description: 'Subtle oceanic indigo' },
  { name: 'Obsidian Zinc', hex: '#18181b', category: 'dark', description: 'Modern dark gray' },
  { name: 'Warm Espresso', hex: '#1c1614', category: 'dark', description: 'Rich roasted coffee tone' },

  // Rich & Atmospheric
  { name: 'Emerald Forest', hex: '#052e16', category: 'rich', description: 'Lush dark evergreen' },
  { name: 'Royal Indigo', hex: '#1e1b4b', category: 'rich', description: 'Refined deep royal hue' },
  { name: 'Midnight Plum', hex: '#2e1065', category: 'rich', description: 'Sophisticated deep violet' },
  { name: 'Merlot Crimson', hex: '#2b0d12', category: 'rich', description: 'Subtle dark burgundy' },
  { name: 'Oceanic Teal', hex: '#042f2e', category: 'rich', description: 'Deep maritime dark teal' },
  { name: 'Dark Bronze', hex: '#292524', category: 'rich', description: 'Warm organic stone tone' },

  // Vibrant & Energetic
  { name: 'Sapphire Blue', hex: '#1d4ed8', category: 'vibrant', description: 'Bold vivid sapphire' },
  { name: 'Emerald Teal', hex: '#0f766e', category: 'vibrant', description: 'Vibrant sea teal' },
  { name: 'Royal Velvet', hex: '#6b21a8', category: 'vibrant', description: 'Luminous deep purple' },
  { name: 'Crimson Flame', hex: '#881337', category: 'vibrant', description: 'Rich rose ruby' },
  { name: 'Warm Clay', hex: '#7c2d12', category: 'vibrant', description: 'Earthy terracotta' },
  { name: 'Forest Moss', hex: '#15803d', category: 'vibrant', description: 'Vivid botanic green' },

  // Light & Gallery Themes
  { name: 'Studio Off-White', hex: '#f8fafc', category: 'light', description: 'Pristine gallery light' },
  { name: 'Cool Slate Light', hex: '#f1f5f9', category: 'light', description: 'Clean technical slate' },
  { name: 'Warm Linen', hex: '#fafaf9', category: 'light', description: 'Natural soft paper hue' },
  { name: 'Soft Sandstone', hex: '#f5f5f4', category: 'light', description: 'Warm subtle parchment' },
  { name: 'Muted Cloud', hex: '#e2e8f0', category: 'light', description: 'Gentle neutral gray' },
  { name: 'Soft Ivory', hex: '#fffbeb', category: 'light', description: 'Warm delicate daylight' },
];

export const BackgroundColorModal: React.FC<BackgroundColorModalProps> = ({
  isOpen,
  onClose,
  currentColor,
  onSelectColor,
  onResetColor,
  defaultColor,
  motionConfig,
  onUpdateMotionConfig,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'dark' | 'rich' | 'vibrant' | 'light'>('all');
  const [customInput, setCustomInput] = useState(currentColor);

  if (!isOpen) return null;

  const motionPalette = getMotionPaletteForColor(currentColor);

  const handleCustomChange = (val: string) => {
    setCustomInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      onSelectColor(val);
    }
  };

  const handleRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setCustomInput(randomHex);
    onSelectColor(randomHex);
  };

  const filteredPresets = activeCategory === 'all' 
    ? COLOR_PRESETS 
    : COLOR_PRESETS.filter((p) => p.category === activeCategory);

  const motionStyles: { id: BackgroundMotionStyle; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'aurora', label: 'Aurora Waves', icon: <Waves className="w-3.5 h-3.5" />, desc: 'Silky flowing light waves' },
    { id: 'orbs', label: 'Floating Orbs', icon: <CircleDot className="w-3.5 h-3.5" />, desc: 'Drifting glowing ambient spheres' },
    { id: 'flow', label: 'Cosmic Drift', icon: <Compass className="w-3.5 h-3.5" />, desc: 'Rotating deep gradient flow' },
    { id: 'pulse', label: 'Breathing Pulse', icon: <HeartPulse className="w-3.5 h-3.5" />, desc: 'Gentle rhythmic glow pulse' },
    { id: 'static', label: 'Solid Still', icon: <Activity className="w-3.5 h-3.5" />, desc: 'Solid static background' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-neutral-900 border border-neutral-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-neutral-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 text-white shadow-md shadow-rose-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Edit Background & Motion
                <span 
                  className="inline-block w-4 h-4 rounded-full border border-white/30 shadow-inner"
                  style={{ backgroundColor: currentColor }}
                  title={`Current: ${currentColor}`}
                />
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Each color features harmonious ambient motion effects tailored to its hue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Motion & Color Hero Banner */}
        <div 
          className="relative rounded-2xl p-4 overflow-hidden border border-neutral-700/70 shadow-lg"
          style={{ backgroundColor: currentColor }}
        >
          {/* Background GIF in preview */}
          {motionConfig.bgMediaEnabled !== false && (
            <img
              src={motionConfig.bgMediaUrl || 'https://c.tenor.com/G0dP5NM52YwAAAAC/roof-piece-luffy.gif'}
              alt="Luffy GIF Background"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              style={{
                opacity: motionConfig.bgMediaOpacity ?? 0.65,
                filter: (motionConfig.bgMediaBlur ?? 0) > 0 ? `blur(${motionConfig.bgMediaBlur}px)` : undefined,
              }}
            />
          )}

          {/* Subtle animated orbs in miniature preview */}
          {motionConfig.enabled && motionConfig.style !== 'static' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60 filter blur-xl">
              <div 
                className="absolute -top-10 -left-10 w-44 h-44 rounded-full animate-pulse"
                style={{ backgroundColor: motionPalette.glow1 }}
              />
              <div 
                className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full animate-bounce"
                style={{ backgroundColor: motionPalette.glow2, animationDuration: '6s' }}
              />
              <div 
                className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full"
                style={{ backgroundColor: motionPalette.glow3 }}
              />
            </div>
          )}

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-neutral-950/75 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl border-2 border-white/40 shadow-inner flex items-center justify-center shrink-0 overflow-hidden relative"
                style={{ backgroundColor: currentColor }}
              >
                {motionConfig.bgMediaEnabled !== false ? (
                  <img 
                    src={motionConfig.bgMediaUrl || 'https://c.tenor.com/G0dP5NM52YwAAAAC/roof-piece-luffy.gif'} 
                    alt="Luffy" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <Sparkles className="w-4 h-4 text-white drop-shadow" />
                )}
              </div>
              <div>
                <div className="text-xs font-semibold text-white flex items-center gap-2">
                  <span>Active Base Color:</span>
                  <span className="font-mono text-amber-300 uppercase font-bold">{currentColor}</span>
                </div>
                <div className="text-[11px] text-neutral-300 flex items-center gap-2 mt-0.5">
                  <span>
                    GIF: <strong className="text-amber-400">{motionConfig.bgMediaEnabled !== false ? 'Roof Piece Luffy' : 'Disabled'}</strong>
                  </span>
                  <span>•</span>
                  <span className="capitalize">
                    Motion: <strong className="text-amber-400">{motionConfig.enabled ? motionConfig.style : 'Disabled'}</strong>
                  </span>
                  <span>•</span>
                  <span className="capitalize">{motionConfig.speed} speed</span>
                </div>
              </div>
            </div>

            {/* Quick Toggle for Motion */}
            <button
              onClick={() => onUpdateMotionConfig({ enabled: !motionConfig.enabled })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                motionConfig.enabled
                  ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{motionConfig.enabled ? 'Motion ON' : 'Motion OFF'}</span>
            </button>
          </div>
        </div>

        {/* Roof Piece Luffy Animated Background GIF Controls */}
        <div className="p-4 rounded-xl bg-neutral-850/90 border border-neutral-800 space-y-3.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-rose-400" />
              Animated Background GIF (Roof Piece Luffy)
            </label>
            <span className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
              Anime Motion Active
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-neutral-900/80 rounded-xl border border-neutral-800">
            {/* Luffy Thumbnail */}
            <div className="w-24 h-14 rounded-lg overflow-hidden border border-neutral-700 shrink-0 relative group shadow-inner">
              <img
                src={motionConfig.bgMediaUrl || 'https://c.tenor.com/G0dP5NM52YwAAAAC/roof-piece-luffy.gif'}
                alt="Roof Piece Luffy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs">
                  GIF
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-semibold text-white truncate">
                  One Piece: Roof Piece Luffy
                </h4>
                {/* Toggle GIF Button */}
                <button
                  onClick={() =>
                    onUpdateMotionConfig({
                      bgMediaEnabled: motionConfig.bgMediaEnabled === false ? true : false,
                    })
                  }
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    motionConfig.bgMediaEnabled !== false
                      ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-sm'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{motionConfig.bgMediaEnabled !== false ? 'Luffy GIF: ON' : 'Luffy GIF: OFF'}</span>
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                Luffy walking with cloak on the Onigashima rooftop. Loops seamlessly behind your gallery.
              </p>
            </div>
          </div>

          {/* Opacity & Blur Controls for the GIF */}
          {motionConfig.bgMediaEnabled !== false && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-neutral-800/80">
              {/* Opacity Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3 text-neutral-400" />
                    GIF Visibility / Opacity
                  </span>
                  <span className="text-amber-400 font-mono font-medium">
                    {Math.round((motionConfig.bgMediaOpacity ?? 0.65) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={motionConfig.bgMediaOpacity ?? 0.65}
                  onChange={(e) =>
                    onUpdateMotionConfig({ bgMediaOpacity: parseFloat(e.target.value) })
                  }
                  className="w-full accent-amber-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Blur Level */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-neutral-400" />
                    Backdrop Softness / Blur
                  </span>
                  <span className="text-neutral-300 font-medium">
                    {(motionConfig.bgMediaBlur ?? 0) === 0
                      ? 'Sharp (0px)'
                      : (motionConfig.bgMediaBlur ?? 0) === 2
                      ? 'Soft (2px)'
                      : 'Dreamy (5px)'}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                  {[
                    { label: 'Sharp', val: 0 },
                    { label: 'Soft', val: 2 },
                    { label: 'Dreamy', val: 5 },
                  ].map((b) => (
                    <button
                      key={b.val}
                      onClick={() => onUpdateMotionConfig({ bgMediaBlur: b.val })}
                      className={`flex-1 py-1 rounded-md text-xs font-medium transition-colors ${
                        (motionConfig.bgMediaBlur ?? 0) === b.val
                          ? 'bg-neutral-750 text-amber-400 shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Motion Style Selection */}
        <div className="p-4 rounded-xl bg-neutral-850/90 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-amber-400" />
              Background Motion Style for this Color
            </label>
            <span className="text-[11px] text-amber-400 font-medium">
              Fluid GPU-accelerated motion
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {motionStyles.map((style) => {
              const isSelected = motionConfig.style === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => {
                    onUpdateMotionConfig({ 
                      style: style.id, 
                      enabled: style.id !== 'static' 
                    });
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all group flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 bg-neutral-800 text-white shadow-md ring-1 ring-amber-400/40'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
                      <span className={isSelected ? 'text-amber-400' : 'text-neutral-400 group-hover:text-amber-300'}>
                        {style.icon}
                      </span>
                      <span>{style.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-neutral-400 line-clamp-1">
                    {style.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Speed & Intensity Controls */}
          {motionConfig.enabled && motionConfig.style !== 'static' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800/80">
              {/* Motion Speed */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-neutral-400" />
                    Motion Speed
                  </span>
                  <span className="capitalize text-neutral-300 font-medium">{motionConfig.speed}</span>
                </div>
                <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                  {(['slow', 'normal', 'fast'] as BackgroundMotionSpeed[]).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => onUpdateMotionConfig({ speed: spd })}
                      className={`flex-1 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                        motionConfig.speed === spd
                          ? 'bg-neutral-750 text-amber-400 shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {spd}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motion Intensity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-neutral-400" />
                    Motion Glow
                  </span>
                  <span className="capitalize text-neutral-300 font-medium">{motionConfig.intensity}</span>
                </div>
                <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                  {(['subtle', 'balanced', 'vivid'] as BackgroundMotionIntensity[]).map((intn) => (
                    <button
                      key={intn}
                      onClick={() => onUpdateMotionConfig({ intensity: intn })}
                      className={`flex-1 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                        motionConfig.intensity === intn
                          ? 'bg-neutral-750 text-amber-400 shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {intn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Custom Color Selector & Hex Input */}
        <div className="p-4 rounded-xl bg-neutral-850/80 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Pipette className="w-3.5 h-3.5 text-amber-400" />
              Custom Color Picker (With Auto-Generated Motion Palette)
            </label>
            <button
              onClick={handleRandomColor}
              className="text-xs text-neutral-400 hover:text-amber-300 flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-neutral-800"
              title="Surprise me with a random color"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              Randomize
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Native Color Picker button */}
            <div className="relative shrink-0">
              <input
                id="native-color-picker-input"
                type="color"
                value={currentColor.startsWith('#') ? currentColor : '#171717'}
                onChange={(e) => {
                  setCustomInput(e.target.value);
                  onSelectColor(e.target.value);
                }}
                className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0 opacity-0 absolute inset-0 z-10"
              />
              <div 
                className="w-12 h-12 rounded-xl border-2 border-neutral-600 shadow-inner flex items-center justify-center transition-transform hover:scale-105"
                style={{ backgroundColor: currentColor }}
              >
                <Pipette className="w-4 h-4 text-white drop-shadow" />
              </div>
            </div>

            {/* Hex Input */}
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-sm">
                HEX:
              </span>
              <input
                type="text"
                placeholder="#171717"
                value={customInput}
                onChange={(e) => handleCustomChange(e.target.value)}
                maxLength={7}
                className="w-full pl-14 pr-4 py-2.5 bg-neutral-800 text-sm font-mono text-neutral-100 rounded-xl border border-neutral-700 focus:border-amber-500 focus:outline-none uppercase"
              />
            </div>

            {/* Reset button */}
            <button
              onClick={() => {
                onResetColor();
                setCustomInput(defaultColor);
              }}
              className="px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
              title="Restore default studio background"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Curated Color Palettes (Each with Unique Motion Accents)
            </span>
            <span className="text-xs text-neutral-500">
              {filteredPresets.length} presets
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-neutral-100 text-neutral-900 shadow-sm'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-750'
              }`}
            >
              All Colors
            </button>
            <button
              onClick={() => setActiveCategory('dark')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
                activeCategory === 'dark'
                  ? 'bg-neutral-100 text-neutral-900 shadow-sm'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-750'
              }`}
            >
              <Moon className="w-3 h-3" />
              Dark Studio
            </button>
            <button
              onClick={() => setActiveCategory('rich')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
                activeCategory === 'rich'
                  ? 'bg-neutral-100 text-neutral-900 shadow-sm'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-750'
              }`}
            >
              <Sliders className="w-3 h-3" />
              Atmospheric
            </button>
            <button
              onClick={() => setActiveCategory('vibrant')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
                activeCategory === 'vibrant'
                  ? 'bg-neutral-100 text-neutral-900 shadow-sm'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-750'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Vibrant
            </button>
            <button
              onClick={() => setActiveCategory('light')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
                activeCategory === 'light'
                  ? 'bg-neutral-100 text-neutral-900 shadow-sm'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-750'
              }`}
            >
              <Sun className="w-3 h-3" />
              Light Gallery
            </button>
          </div>

          {/* Color Preset Swatches Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            {filteredPresets.map((preset) => {
              const isSelected = currentColor.toLowerCase() === preset.hex.toLowerCase();
              const presetPalette = getMotionPaletteForColor(preset.hex);
              return (
                <button
                  key={preset.hex}
                  onClick={() => {
                    onSelectColor(preset.hex);
                    setCustomInput(preset.hex);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center gap-3 transition-all text-left group relative overflow-hidden ${
                    isSelected
                      ? 'border-amber-400 bg-neutral-800 shadow-md ring-2 ring-amber-400/20'
                      : 'border-neutral-800 bg-neutral-850 hover:border-neutral-700 hover:bg-neutral-800'
                  }`}
                >
                  <div 
                    className="w-9 h-9 rounded-lg shrink-0 border border-white/20 shadow-inner flex items-center justify-center transition-transform group-hover:scale-105 relative overflow-hidden"
                    style={{ backgroundColor: preset.hex }}
                  >
                    {/* Tiny motion accent dot */}
                    <span 
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full opacity-60 filter blur-[2px]"
                      style={{ backgroundColor: presetPalette.glow1 }}
                    />
                    {isSelected && (
                      <Check className={`w-4 h-4 relative z-10 ${preset.category === 'light' ? 'text-neutral-900' : 'text-white'}`} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-neutral-200 group-hover:text-white truncate">
                      {preset.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">
                        {preset.hex}
                      </span>
                      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: presetPalette.glow1 }} title="Primary motion color" />
                      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: presetPalette.glow2 }} title="Secondary motion color" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
          <div className="text-xs text-neutral-400 flex items-center gap-2">
            <span>Active:</span>
            <span className="font-mono font-bold text-amber-300 uppercase">
              {currentColor}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-300 capitalize">{motionConfig.style} motion</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-sm font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};

