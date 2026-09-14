import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Sliders, 
  Info, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  MapPin, 
  Calendar, 
  Camera, 
  Aperture, 
  Clock, 
  Gauge, 
  FileText,
  Star,
  Folder
} from 'lucide-react';
import { Photo, Album } from '../types';

interface PhotoLightboxProps {
  photo: Photo;
  photos: Photo[];
  albums: Album[];
  onClose: () => void;
  onNavigate: (photo: Photo) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenEditor: (photo: Photo) => void;
  onRatePhoto: (id: string, rating: number, e: React.MouseEvent) => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photo,
  photos,
  albums,
  onClose,
  onNavigate,
  onToggleFavorite,
  onOpenEditor,
  onRatePhoto,
}) => {
  const [showInfo, setShowInfo] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const currentIndex = photos.findIndex((p) => p.id === photo.id);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setZoomLevel(1);
      onNavigate(photos[currentIndex - 1]);
    }
  }, [currentIndex, photos, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      setZoomLevel(1);
      onNavigate(photos[currentIndex + 1]);
    }
  }, [currentIndex, photos, onNavigate]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'i' || e.key === 'I') {
        setShowInfo((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handlePrev, handleNext]);

  const handleDownload = async () => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${photo.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback direct open
      window.open(photo.url, '_blank');
    }
  };

  const photoAlbums = albums.filter((alb) => photo.albumIds.includes(alb.id));

  return (
    <div className="fixed inset-0 z-50 flex bg-neutral-950/95 backdrop-blur-xl text-neutral-100 select-none">
      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-950/60 border-b border-neutral-900 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-white truncate max-w-md">
              {photo.title}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
              {currentIndex + 1} / {photos.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-neutral-900 rounded-lg p-0.5 border border-neutral-800">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs px-2 font-mono text-neutral-400">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Favorite toggle */}
            <button
              onClick={(e) => onToggleFavorite(photo.id, e)}
              className={`p-2 rounded-lg border transition-colors ${
                photo.isFavorite
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Toggle Favorite"
            >
              <Heart className={`w-4 h-4 ${photo.isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Edit Photo */}
            <button
              onClick={() => onOpenEditor(photo)}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 text-sm"
              title="Edit & Adjust"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden md:inline">Edit</span>
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
              title="Download Photo"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Info toggle */}
            <button
              onClick={() => setShowInfo((prev) => !prev)}
              className={`p-2 rounded-lg border transition-colors ${
                showInfo
                  ? 'bg-blue-600/20 border-blue-500/30 text-blue-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Photo Info & EXIF"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              id="close-lightbox-btn"
              onClick={onClose}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors ml-2"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Stage & Image */}
        <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
          {/* Previous Arrow */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-white shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95"
              title="Previous (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Arrow */}
          {currentIndex < photos.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-white shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95"
              title="Next (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* The Image */}
          <div className="max-w-full max-h-full flex items-center justify-center overflow-auto transition-transform duration-200">
            <img
              src={photo.url}
              alt={photo.title}
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="max-h-[75vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>

        {/* Filmstrip Bottom Thumbnails */}
        <div className="h-20 bg-neutral-950/80 border-t border-neutral-900 px-6 py-2 flex items-center gap-3 overflow-x-auto">
          {photos.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                setZoomLevel(1);
                onNavigate(p);
              }}
              className={`relative h-14 w-20 rounded-md overflow-hidden shrink-0 transition-all ${
                p.id === photo.id
                  ? 'ring-2 ring-blue-500 scale-105 opacity-100'
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              <img src={p.thumbnailUrl} alt={p.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Side Info & EXIF Drawer */}
      {showInfo && (
        <div className="w-80 sm:w-96 bg-neutral-900/90 border-l border-neutral-800 p-6 flex flex-col justify-between overflow-y-auto shrink-0 z-20 animate-in slide-in-from-right duration-200">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
                  Metadata & EXIF
                </span>
                <button
                  onClick={() => setShowInfo(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{photo.title}</h3>
              <p className="text-sm text-neutral-400 mt-1 leading-relaxed">
                {photo.description}
              </p>
            </div>

            {/* Rating selector */}
            <div className="p-3 bg-neutral-800/60 rounded-xl border border-neutral-700/50">
              <span className="text-xs text-neutral-400 block mb-1.5 font-medium">Rating</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={(e) => onRatePhoto(photo.id, star, e)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= photo.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Camera Details */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Camera Gear
              </span>
              <div className="bg-neutral-800/40 rounded-xl p-3.5 border border-neutral-800 space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-neutral-200">
                  <Camera className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-medium truncate">{photo.exif.camera}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                  <FileText className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">{photo.exif.lens}</span>
                </div>
              </div>
            </div>

            {/* Exposure parameters */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Exposure Parameters
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-neutral-800/40 rounded-lg border border-neutral-800 flex items-center gap-2">
                  <Aperture className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase">Aperture</span>
                    <span className="text-xs font-mono font-medium text-neutral-200">{photo.exif.aperture}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-neutral-800/40 rounded-lg border border-neutral-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase">Shutter</span>
                    <span className="text-xs font-mono font-medium text-neutral-200">{photo.exif.shutterSpeed}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-neutral-800/40 rounded-lg border border-neutral-800 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase">ISO</span>
                    <span className="text-xs font-mono font-medium text-neutral-200">{photo.exif.iso}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-neutral-800/40 rounded-lg border border-neutral-800 flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase">Focal</span>
                    <span className="text-xs font-mono font-medium text-neutral-200">{photo.exif.focalLength}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Date */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Location & Time
              </span>
              <div className="bg-neutral-800/40 rounded-xl p-3 border border-neutral-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-300">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{photo.location.name}, {photo.location.country}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Calendar className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span>{new Date(photo.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </div>
            </div>

            {/* File info */}
            <div className="space-y-1 text-xs text-neutral-400">
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-500">Resolution</span>
                <span className="font-mono">{photo.exif.resolution}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-500">File Size</span>
                <span className="font-mono">{photo.exif.fileSize}</span>
              </div>
            </div>

            {/* Albums */}
            {photoAlbums.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  In Albums
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {photoAlbums.map((alb) => (
                    <span
                      key={alb.id}
                      className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 text-xs flex items-center gap-1 border border-neutral-700"
                    >
                      <Folder className="w-3 h-3 text-blue-400" />
                      {alb.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {photo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-neutral-800/80 text-neutral-400 text-xs border border-neutral-700/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
