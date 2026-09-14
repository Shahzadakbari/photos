import React from 'react';
import { MapPin, Globe, Image as ImageIcon } from 'lucide-react';
import { Photo } from '../types';

interface PlacesViewProps {
  photos: Photo[];
  onOpenLightbox: (photo: Photo) => void;
  onFilterByPlace: (placeName: string) => void;
}

export const PlacesView: React.FC<PlacesViewProps> = ({
  photos,
  onOpenLightbox,
  onFilterByPlace,
}) => {
  // Group photos by country and place
  const locationsMap = photos.reduce((acc, photo) => {
    const locKey = `${photo.location.name}, ${photo.location.country}`;
    if (!acc[locKey]) {
      acc[locKey] = {
        name: photo.location.name,
        country: photo.location.country,
        photos: [],
      };
    }
    acc[locKey].photos.push(photo);
    return acc;
  }, {} as Record<string, { name: string; country: string; photos: Photo[] }>);

  const locationsList = Object.values(locationsMap);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            Places & Geographies
          </h2>
          <p className="text-sm text-neutral-400 mt-0.5">
            Photographs clustered across {locationsList.length} global shooting locations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locationsList.map((loc) => {
          const coverPhoto = loc.photos[0];
          return (
            <div
              key={`${loc.name}-${loc.country}`}
              className="bg-neutral-850 bg-neutral-800/40 rounded-2xl border border-neutral-800 hover:border-neutral-700 overflow-hidden shadow-lg transition-all group"
            >
              {/* Cover Header */}
              <div
                className="relative h-48 w-full overflow-hidden bg-neutral-900 cursor-pointer"
                onClick={() => onOpenLightbox(coverPhoto)}
              >
                <img
                  src={coverPhoto.url}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {loc.country}
                    </span>
                    <h3 className="text-lg font-bold text-white">{loc.name}</h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-900/80 backdrop-blur-md text-neutral-200 border border-neutral-700/60 font-mono">
                    {loc.photos.length} {loc.photos.length === 1 ? 'photo' : 'photos'}
                  </span>
                </div>
              </div>

              {/* Thumbnails row */}
              <div className="p-4 flex items-center justify-between gap-2 border-t border-neutral-800/80">
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {loc.photos.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onOpenLightbox(p)}
                      className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-neutral-700/60 hover:border-blue-400 transition-colors"
                      title={p.title}
                    >
                      <img
                        src={p.thumbnailUrl}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {loc.photos.length > 4 && (
                    <div className="w-12 h-12 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-medium text-neutral-400 shrink-0">
                      +{loc.photos.length - 4}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onFilterByPlace(loc.name)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-300 hover:text-white transition-colors shrink-0"
                >
                  View All
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
