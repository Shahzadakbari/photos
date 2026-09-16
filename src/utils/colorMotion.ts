// Color math and motion palette generator for dynamic backgrounds

export interface MotionPalette {
  base: string;
  isLight: boolean;
  glow1: string; // Primary floating orb / wave
  glow2: string; // Secondary complementary wave
  glow3: string; // Accent spark / orb
  glow4: string; // Subtle highlight wash
  opacity: number;
}

// Helper to convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) {
    return { r: 23, g: 23, b: 23 };
  }
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

// Helper to convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Helper to convert HSL to Hex
export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Handcrafted signature palettes for curated background colors
const SIGNATURE_PALETTES: Record<string, { glow1: string; glow2: string; glow3: string; glow4: string }> = {
  // Dark & Studio
  '#171717': { glow1: '#3b82f6', glow2: '#f59e0b', glow3: '#8b5cf6', glow4: '#06b6d4' }, // Studio warm-cool auroras
  '#09090b': { glow1: '#6366f1', glow2: '#a855f7', glow3: '#38bdf8', glow4: '#ec4899' }, // Deep OLED cosmic nebula
  '#0f172a': { glow1: '#0ea5e9', glow2: '#6366f1', glow3: '#38bdf8', glow4: '#14b8a6' }, // Midnight slate cyan flow
  '#0a192f': { glow1: '#0284c7', glow2: '#2563eb', glow3: '#06b6d4', glow4: '#7c3aed' }, // Deep Navy
  '#18181b': { glow1: '#f97316', glow2: '#3b82f6', glow3: '#a855f7', glow4: '#10b981' }, // Obsidian zinc
  '#1c1614': { glow1: '#ea580c', glow2: '#d97706', glow3: '#e11d48', glow4: '#fbbf24' }, // Warm espresso firefly glow

  // Rich & Atmospheric
  '#052e16': { glow1: '#10b981', glow2: '#059669', glow3: '#eab308', glow4: '#34d399' }, // Emerald forest bioluminescence
  '#1e1b4b': { glow1: '#8b5cf6', glow2: '#ec4899', glow3: '#3b82f6', glow4: '#c084fc' }, // Royal indigo celestial
  '#2e1065': { glow1: '#c084fc', glow2: '#f43f5e', glow3: '#06b6d4', glow4: '#a855f7' }, // Midnight plum amethyst
  '#2b0d12': { glow1: '#f43f5e', glow2: '#f59e0b', glow3: '#be123c', glow4: '#fda4af' }, // Merlot crimson embers
  '#042f2e': { glow1: '#14b8a6', glow2: '#06b6d4', glow3: '#0ea5e9', glow4: '#2dd4bf' }, // Oceanic teal sea spray
  '#292524': { glow1: '#f59e0b', glow2: '#ea580c', glow3: '#78716c', glow4: '#fed7aa' }, // Dark bronze amber

  // Vibrant
  '#1d4ed8': { glow1: '#60a5fa', glow2: '#38bdf8', glow3: '#c084fc', glow4: '#93c5fd' }, // Sapphire blue electric
  '#0f766e': { glow1: '#2dd4bf', glow2: '#38bdf8', glow3: '#10b981', glow4: '#99f6e4' }, // Emerald teal crystal
  '#6b21a8': { glow1: '#e879f9', glow2: '#818cf8', glow3: '#f43f5e', glow4: '#f0abfc' }, // Royal velvet neon
  '#881337': { glow1: '#fb7185', glow2: '#fb923c', glow3: '#f43f5e', glow4: '#fecdd3' }, // Crimson flame ruby
  '#7c2d12': { glow1: '#fb923c', glow2: '#facc15', glow3: '#ea580c', glow4: '#fed7aa' }, // Warm clay sunset
  '#15803d': { glow1: '#4ade80', glow2: '#a3e635', glow3: '#22c55e', glow4: '#bbf7d0' }, // Forest moss vibrant

  // Light Themes (subtle pearlescent & pastel watercolors)
  '#f8fafc': { glow1: '#93c5fd', glow2: '#c4b5fd', glow3: '#fed7aa', glow4: '#a7f3d0' }, // Studio light prism
  '#f1f5f9': { glow1: '#67e8f9', glow2: '#818cf8', glow3: '#fbcfe8', glow4: '#93c5fd' }, // Cool slate watercolor
  '#fafaf9': { glow1: '#fed7aa', glow2: '#fecdd3', glow3: '#ddd6fe', glow4: '#fef08a' }, // Warm linen daylight
  '#f5f5f4': { glow1: '#fde047', glow2: '#f472b6', glow3: '#60a5fa', glow4: '#fed7aa' }, // Sandstone soft tint
  '#e2e8f0': { glow1: '#38bdf8', glow2: '#a855f7', glow3: '#f43f5e', glow4: '#6ee7b7' }, // Muted cloud
  '#fffbeb': { glow1: '#fde047', glow2: '#fb923c', glow3: '#f472b6', glow4: '#fef08a' }, // Soft ivory morning
};

export function getMotionPaletteForColor(hexColor: string): MotionPalette {
  const normHex = hexColor.toLowerCase().trim();
  const rgb = hexToRgb(normHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const isLight = hsl.l > 55;

  // Check exact signature match
  if (SIGNATURE_PALETTES[normHex]) {
    const s = SIGNATURE_PALETTES[normHex];
    return {
      base: normHex,
      isLight,
      glow1: s.glow1,
      glow2: s.glow2,
      glow3: s.glow3,
      glow4: s.glow4,
      opacity: isLight ? 0.35 : 0.45,
    };
  }

  // Algorithmic derivation for any custom color
  let glow1: string;
  let glow2: string;
  let glow3: string;
  let glow4: string;

  if (isLight) {
    // For light backgrounds, use soft luminous pastel tones
    glow1 = hslToHex(hsl.h + 20, Math.min(80, hsl.s + 35), 75);
    glow2 = hslToHex(hsl.h - 35, Math.min(85, hsl.s + 40), 78);
    glow3 = hslToHex(hsl.h + 120, Math.min(75, hsl.s + 30), 80);
    glow4 = hslToHex(hsl.h - 120, Math.min(70, hsl.s + 25), 82);
  } else if (hsl.s < 15) {
    // For near-neutral darks (grays/blacks), introduce subtle celestial dual tones (blue-purple and amber)
    glow1 = '#3b82f6';
    glow2 = '#8b5cf6';
    glow3 = '#f59e0b';
    glow4 = '#06b6d4';
  } else {
    // For rich/vibrant darks, calculate analogous and triadic glows with high vibrance
    glow1 = hslToHex(hsl.h + 30, Math.min(95, Math.max(70, hsl.s)), Math.min(65, Math.max(45, hsl.l + 25)));
    glow2 = hslToHex(hsl.h - 40, Math.min(95, Math.max(65, hsl.s)), Math.min(65, Math.max(40, hsl.l + 20)));
    glow3 = hslToHex(hsl.h + 180, Math.min(90, Math.max(60, hsl.s)), Math.min(65, Math.max(45, hsl.l + 30)));
    glow4 = hslToHex(hsl.h + 75, Math.min(90, Math.max(70, hsl.s)), Math.min(70, Math.max(50, hsl.l + 35)));
  }

  return {
    base: normHex,
    isLight,
    glow1,
    glow2,
    glow3,
    glow4,
    opacity: isLight ? 0.3 : 0.42,
  };
}
