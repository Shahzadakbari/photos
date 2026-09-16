import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { BackgroundMotionConfig } from '../types';
import { getMotionPaletteForColor } from '../utils/colorMotion';

interface MotionBackgroundProps {
  backgroundColor: string;
  config: BackgroundMotionConfig;
}

const LOCAL_LUFFY_FALLBACK = '/images/roof-piece-luffy.gif';

export const MotionBackground: React.FC<MotionBackgroundProps> = ({
  backgroundColor,
  config,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(
    config.bgMediaUrl || 'https://c.tenor.com/G0dP5NM52YwAAAAC/roof-piece-luffy.gif'
  );
  const [hasError, setHasError] = useState(false);

  // Update imgSrc if config.bgMediaUrl changes
  React.useEffect(() => {
    if (config.bgMediaUrl) {
      setImgSrc(config.bgMediaUrl);
      setHasError(false);
    }
  }, [config.bgMediaUrl]);

  const palette = useMemo(() => {
    return getMotionPaletteForColor(backgroundColor);
  }, [backgroundColor]);

  // Multiplier for duration based on speed
  const durationMultiplier = useMemo(() => {
    switch (config.speed) {
      case 'slow':
        return 1.8;
      case 'fast':
        return 0.55;
      case 'normal':
      default:
        return 1.0;
    }
  }, [config.speed]);

  // Opacity multiplier based on intensity
  const intensityOpacity = useMemo(() => {
    let base = palette.opacity;
    switch (config.intensity) {
      case 'subtle':
        return base * 0.45;
      case 'vivid':
        return Math.min(0.85, base * 1.55);
      case 'balanced':
      default:
        return base * 0.75;
    }
  }, [palette.opacity, config.intensity]);

  const isGifActive = config.bgMediaEnabled !== false && !!imgSrc && !hasError;
  const gifOpacity = config.bgMediaOpacity ?? 0.65;
  const gifBlur = config.bgMediaBlur ?? 0;

  const handleImageError = () => {
    // If the Tenor URL fails (e.g. adblocker, offline), fall back to local saved copy
    if (imgSrc !== LOCAL_LUFFY_FALLBACK) {
      setImgSrc(LOCAL_LUFFY_FALLBACK);
    } else {
      setHasError(true);
    }
  };

  return (
    <div 
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden transition-colors duration-500 select-none"
      style={{ backgroundColor }}
    >
      {/* Background Animated GIF Layer */}
      {isGifActive && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={imgSrc}
            alt="Animated background"
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className="w-full h-full object-cover object-center transition-opacity duration-500"
            style={{
              opacity: gifOpacity,
              filter: gifBlur > 0 ? `blur(${gifBlur}px)` : undefined,
              transform: gifBlur > 0 ? 'scale(1.05)' : 'none', // prevent blurry border edges
            }}
          />
          {/* Subtle gradient vignette over the GIF so text & cards stay perfectly readable */}
          <div 
            className="absolute inset-0 transition-colors duration-500"
            style={{
              background: `radial-gradient(ellipse at center, transparent 0%, ${backgroundColor} 90%)`,
              opacity: 0.6,
            }}
          />
          {/* Deep bottom and top fade for seamless navigation bar and footer blending */}
          <div 
            className="absolute inset-x-0 top-0 h-36"
            style={{
              background: `linear-gradient(to bottom, ${backgroundColor} 0%, transparent 100%)`,
              opacity: 0.85,
            }}
          />
          <div 
            className="absolute inset-x-0 bottom-0 h-44"
            style={{
              background: `linear-gradient(to top, ${backgroundColor} 0%, transparent 100%)`,
              opacity: 0.9,
            }}
          />
        </div>
      )}

      {/* Fluid Color Motion Waves / Glows */}
      {config.enabled && config.style !== 'static' && (
        <div className="absolute inset-0 w-full h-full">
          {/* Aurora Waves Motion Style */}
          {config.style === 'aurora' && (
            <div 
              className="absolute inset-0 w-full h-full filter blur-[90px] sm:blur-[120px]"
              style={{ opacity: isGifActive ? intensityOpacity * 0.65 : intensityOpacity }}
            >
              {/* Wave 1: Primary Glow Sweeper */}
              <motion.div
                className="absolute -top-[20%] -left-[15%] w-[80vw] h-[80vh] rounded-full mix-blend-screen"
                style={{
                  background: `radial-gradient(circle at 40% 40%, ${palette.glow1} 0%, transparent 70%)`,
                }}
                animate={{
                  x: ['0%', '25%', '-15%', '10%', '0%'],
                  y: ['0%', '35%', '15%', '-20%', '0%'],
                  scale: [1, 1.25, 0.9, 1.15, 1],
                  rotate: [0, 60, 180, 270, 360],
                }}
                transition={{
                  duration: 22 * durationMultiplier,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Wave 2: Secondary Glow Sweeper */}
              <motion.div
                className="absolute top-[30%] -right-[20%] w-[75vw] h-[75vh] rounded-full mix-blend-screen"
                style={{
                  background: `radial-gradient(circle at 60% 50%, ${palette.glow2} 0%, transparent 68%)`,
                }}
                animate={{
                  x: ['0%', '-30%', '10%', '-20%', '0%'],
                  y: ['0%', '-25%', '30%', '10%', '0%'],
                  scale: [1.1, 0.85, 1.3, 0.95, 1.1],
                  rotate: [360, 240, 120, 45, 0],
                }}
                transition={{
                  duration: 26 * durationMultiplier,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Wave 3: Accent Ribbon */}
              <motion.div
                className="absolute -bottom-[25%] left-[20%] w-[85vw] h-[70vh] rounded-full mix-blend-screen"
                style={{
                  background: `radial-gradient(circle at 50% 60%, ${palette.glow3} 0%, transparent 65%)`,
                }}
                animate={{
                  x: ['0%', '20%', '-25%', '15%', '0%'],
                  y: ['0%', '-35%', '-10%', '20%', '0%'],
                  scale: [0.95, 1.3, 0.8, 1.1, 0.95],
                }}
                transition={{
                  duration: 20 * durationMultiplier,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Wave 4: Highlight Ribbon */}
              <motion.div
                className="absolute top-[10%] left-[30%] w-[60vw] h-[60vh] rounded-full mix-blend-screen"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${palette.glow4} 0%, transparent 70%)`,
                }}
                animate={{
                  x: ['0%', '-20%', '25%', '-10%', '0%'],
                  y: ['0%', '25%', '-20%', '15%', '0%'],
                  opacity: [0.4, 0.9, 0.3, 0.8, 0.4],
                }}
                transition={{
                  duration: 18 * durationMultiplier,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          )}

          {/* Floating Orbs Motion Style */}
          {config.style === 'orbs' && (
            <div 
              className="absolute inset-0 w-full h-full filter blur-[80px] sm:blur-[110px]"
              style={{ opacity: isGifActive ? intensityOpacity * 0.65 : intensityOpacity }}
            >
              <motion.div
                className="absolute top-[10%] left-[10%] w-[35vw] h-[35vw] min-w-[280px] min-h-[280px] rounded-full"
                style={{ backgroundColor: palette.glow1 }}
                animate={{
                  x: [0, 160, -100, 80, 0],
                  y: [0, 180, 60, -120, 0],
                  scale: [1, 1.25, 0.85, 1.15, 1],
                }}
                transition={{
                  duration: 16 * durationMultiplier,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <motion.div
                className="absolute top-[50%] right-[10%] w-[40vw] h-[40vw] min-w-[320px] min-h-[320px] rounded-full"
                style={{ backgroundColor: palette.glow2 }}
                animate={{
                  x: [0, -180, 90, -70, 0],
                  y: [0, -140, 120, -50, 0],
                  scale: [1.1, 0.9, 1.3, 0.95, 1.1],
                }}
                transition={{
                  duration: 20 * durationMultiplier,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <motion.div
                className="absolute bottom-[5%] left-[25%] w-[32vw] h-[32vw] min-w-[260px] min-h-[260px] rounded-full"
                style={{ backgroundColor: palette.glow3 }}
                animate={{
                  x: [0, 120, -140, 90, 0],
                  y: [0, -110, -50, 100, 0],
                  scale: [0.9, 1.2, 0.8, 1.1, 0.9],
                }}
                transition={{
                  duration: 18 * durationMultiplier,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          )}

          {/* Cosmic Gradient Drift / Flow Motion Style */}
          {config.style === 'flow' && (
            <div 
              className="absolute inset-0 w-full h-full"
              style={{ opacity: isGifActive ? intensityOpacity * 0.5 : intensityOpacity }}
            >
              <motion.div
                className="absolute -inset-[50%] w-[200%] h-[200%] filter blur-[100px]"
                style={{
                  background: `conic-gradient(from 0deg at 50% 50%, ${palette.glow1} 0deg, ${palette.glow2} 90deg, ${palette.glow3} 180deg, ${palette.glow4} 270deg, ${palette.glow1} 360deg)`,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 0.95, 1],
                }}
                transition={{
                  rotate: {
                    duration: 35 * durationMultiplier,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                  scale: {
                    duration: 18 * durationMultiplier,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
              />
              <div 
                className="absolute inset-0"
                style={{ backgroundColor: backgroundColor, opacity: 0.65 }}
              />
            </div>
          )}

          {/* Rhythmic Breathing Glow Pulse Motion Style */}
          {config.style === 'pulse' && (
            <div 
              className="absolute inset-0 w-full h-full flex items-center justify-center filter blur-[100px] sm:blur-[140px]"
              style={{ opacity: isGifActive ? intensityOpacity * 0.6 : intensityOpacity }}
            >
              <motion.div
                className="w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full"
                style={{
                  background: `radial-gradient(circle, ${palette.glow1} 0%, ${palette.glow2} 45%, ${palette.glow3} 75%, transparent 100%)`,
                }}
                animate={{
                  scale: [0.85, 1.35, 0.85],
                  opacity: [0.5, 0.95, 0.5],
                }}
                transition={{
                  duration: 10 * durationMultiplier,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Subtle fine film noise texture overlay for organic depth */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${palette.isLight ? '#000' : '#fff'} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
