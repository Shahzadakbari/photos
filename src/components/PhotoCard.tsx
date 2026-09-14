import React, { useState } from 'react';
import { Heart, Maximize2, Sliders, MapPin, Star, Calendar, Image as ImageIcon } from 'lucide-react';
import { Photo, ViewLayout } from '../types';

interface PhotoCardProps {
  photo: Photo;
  viewLayout: ViewLayout;
  onOpenLightbox: (photo: Photo) => void;
  onOpenEditor: (photo: Photo) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onRatePhoto: (id: string, rating: number, e: React.MouseEvent) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  viewLayout,
  onOpenLightbox,
  onOpenEditor,
  onToggleFavorite,
  onRatePhoto,
}) => {
  const [imgError, setImgError] = useState(false);

  // Details list view layout
  if (viewLayout === 'details') {
    return (
      <div 
        id={`photo-row-${photo.id}`}
        onClick={() => onOpenLightbox(photo)}
        className="group flex items-center gap-4 p-3 bg-neutral-800/40 hover:bg-neutral-800/80 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer"
      >
        <div className="relative w-24 h-20 rounded-lg overflow-hidden shrink-0 bg-neutral-900">
          <img
            src={photo.thumbnailUrl}
            alt={photo.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {photo.isFavorite && (
            <div className="absolute top-1 left-1 p-1 bg-neutral-950/60 backdrop-blur-md rounded-full text-rose-500">
              <Heart className="w-3 h-3 fill-rose-500" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-neutral-200 truncate group-hover:text-blue-400 transition-colors">
              {photo.title}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-700/60 text-neutral-300">
              {photo.category}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-neutral-500" />
              {photo.location.name}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-neutral-500" />
              {new Date(photo.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-neutral-500 font-mono">
              {photo.exif.camera} • {photo.exif.resolution}
            </span>
          </div>
        </div>

        {/* Rating and Actions */}
        <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={(e) => onRatePhoto(photo.id, star, e)}
                className="p-0.5 hover:scale-125 transition-transform"
                title={`Rate ${star} stars`}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    star <= photo.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            onClick={(e) => onToggleFavorite(photo.id, e)}
            className={`p-2 rounded-lg transition-colors ${
              photo.isFavorite
                ? 'text-rose-500 hover:bg-rose-500/10'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
            }`}
            title="Toggle Favorite"
          >
            <Heart className={`w-4 h-4 ${photo.isFavorite ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={() => onOpenEditor(photo)}
            className="p-2 rounded-lg text-neutral-400 hover:text-blue-400 hover:bg-neutral-700 transition-colors"
            title="Edit Photo"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Masonry or Grid card view
  if (viewLayout === 'grid') {
    return (
      <div
        id={`photo-card-${photo.id}`}
        onClick={() => onOpenLightbox(photo)}
        className="group relative flex flex-col rounded-2xl overflow-hidden bg-neutral-800/80 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer hover:-translate-y-1"
      >
        {/* Equal Dimension Image Container */}
        <div className="relative overflow-hidden w-full aspect-square bg-neutral-900 flex items-center justify-center">
          {!imgError ? (
            <img
              src={photo.thumbnailUrl}
              alt={photo.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            /* Placeholder fallback */
            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-800/70 p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-neutral-700/60 flex items-center justify-center mb-2 text-neutral-400">
                <ImageIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-neutral-300 line-clamp-1">{photo.title}</span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">Placeholder Image</span>
            </div>
          )}

          {/* Category Tag overlay */}
          <div className="absolute top-3 left-3">
            <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-md text-neutral-200 border border-neutral-700/60 shadow-sm">
              {photo.category}
            </span>
          </div>

          {/* Favorite button overlay */}
          <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => onToggleFavorite(photo.id, e)}
              className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                photo.isFavorite
                  ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
                  : 'bg-neutral-900/70 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800/80'
              }`}
              title="Toggle favorite"
            >
              <Heart className={`w-3.5 h-3.5 ${photo.isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dedicated Visible Title and Caption Section */}
        <div className="p-3.5 flex flex-col justify-between flex-1 bg-neutral-800/60 border-t border-neutral-800">
          <div>
            <h3 className="text-sm font-semibold text-neutral-100 group-hover:text-blue-400 transition-colors line-clamp-1">
              {photo.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-neutral-400 mt-1">
              <span className="flex items-center gap-1 truncate max-w-[150px]">
                <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                <span className="truncate">{photo.location.name}</span>
              </span>
              <span className="font-mono text-[11px] text-neutral-500 shrink-0">
                {photo.exif.camera.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Card Footer: Rating & Quick Edit */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-neutral-800/60" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={(e) => onRatePhoto(photo.id, star, e)}
                  className="p-0.5 hover:scale-125 transition-transform"
                  title={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-3 h-3 ${
                      star <= photo.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={() => onOpenEditor(photo)}
              className="p-1 rounded text-neutral-400 hover:text-blue-400 hover:bg-neutral-700/60 transition-colors"
              title="Edit Photo"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Masonry layout
  return (
    <div
      id={`photo-card-${photo.id}`}
      onClick={() => onOpenLightbox(photo)}
      className="group relative rounded-xl overflow-hidden bg-neutral-800/80 border border-neutral-800/80 hover:border-neutral-600 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer"
    >
      <div className="relative overflow-hidden w-full">
        {!imgError ? (
          <img
            src={photo.thumbnailUrl}
            alt={photo.title}
            onError={() => setImgError(true)}
            style={{ aspectRatio: `${photo.aspectRatio}` }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[4/3] flex flex-col items-center justify-center bg-neutral-800/70 p-4 text-center">
            <ImageIcon className="w-6 h-6 text-neutral-500 mb-2" />
            <span className="text-xs font-medium text-neutral-300">{photo.title}</span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">Placeholder Image</span>
          </div>
        )}

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5">
          {/* Top Row: Category tag and actions */}
          <div className="flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
            <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-md text-neutral-200 border border-neutral-700/60">
              {photo.category}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => onToggleFavorite(photo.id, e)}
                className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                  photo.isFavorite
                    ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
                    : 'bg-neutral-900/70 text-neutral-300 hover:text-white hover:bg-neutral-900'
                }`}
                title="Toggle favorite"
              >
                <Heart className={`w-3.5 h-3.5 ${photo.isFavorite ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={() => onOpenEditor(photo)}
                className="p-1.5 rounded-lg bg-neutral-900/70 hover:bg-neutral-900 text-neutral-300 hover:text-blue-400 backdrop-blur-md transition-colors"
                title="Open editor"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Info */}
          <div>
            <h3 className="text-sm font-semibold text-white leading-tight drop-shadow-sm line-clamp-1">
              {photo.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-neutral-300 mt-1">
              <span className="flex items-center gap-1 truncate max-w-[160px]">
                <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                <span className="truncate">{photo.location.name}</span>
              </span>
              <span className="font-mono text-[11px] text-neutral-400 shrink-0">
                {photo.exif.camera.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Persistent favorite heart badge when card is not hovered */}
        {photo.isFavorite && (
          <div className="absolute top-2.5 right-2.5 p-1 bg-neutral-900/80 backdrop-blur-md rounded-md text-rose-500 group-hover:opacity-0 transition-opacity">
            <Heart className="w-3 h-3 fill-rose-500" />
          </div>
        )}
      </div>
    </div>
  );
};
