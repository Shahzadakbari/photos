import React, { useState, useEffect, useMemo } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  Sidebar 
} from './components/Sidebar';
import { 
  PhotoCard 
} from './components/PhotoCard';
import { 
  PhotoLightbox 
} from './components/PhotoLightbox';
import { 
  PhotoEditorModal 
} from './components/PhotoEditorModal';
import { 
  PhotoUploadModal 
} from './components/PhotoUploadModal';
import { 
  NewAlbumModal 
} from './components/NewAlbumModal';
import { 
  PlacesView 
} from './components/PlacesView';
import { 
  AlbumsView 
} from './components/AlbumsView';
import { 
  BackgroundColorModal 
} from './components/BackgroundColorModal';
import { 
  MotionBackground 
} from './components/MotionBackground';
import { 
  initialPhotos, 
  initialAlbums 
} from './data/initialPhotos';
import { 
  Photo, 
  Album, 
  ViewLayout, 
  SortOption, 
  ActiveTab, 
  PhotoAdjustments,
  BackgroundMotionConfig
} from './types';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  SearchX, 
  Sparkles, 
  Folder, 
  X,
  Plus,
  Palette
} from 'lucide-react';

const CATEGORIES = ['Nature', 'Architecture', 'Portraits', 'Travel', 'Street', 'Macro'];

export function App() {
  // State management with localStorage persistence
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const saved = localStorage.getItem('photos_vault_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 9) {
          return parsed.map((p: Photo) => {
            const fresh = initialPhotos.find((ip) => ip.id === p.id);
            if (fresh) {
              return {
                ...fresh,
                isFavorite: p.isFavorite ?? fresh.isFavorite,
                rating: p.rating ?? fresh.rating,
                adjustments: p.adjustments ?? fresh.adjustments,
              };
            }
            return p;
          });
        }
      } catch (e) {
        console.error('Failed to parse cached photos:', e);
      }
    }
    return initialPhotos;
  });

  const [albums, setAlbums] = useState<Album[]>(() => {
    const saved = localStorage.getItem('photos_vault_albums');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached albums:', e);
      }
    }
    return initialAlbums;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [viewLayout, setViewLayout] = useState<ViewLayout>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  // Background Color & Motion State
  const DEFAULT_BG_COLOR = '#171717';
  const DEFAULT_MOTION_CONFIG: BackgroundMotionConfig = {
    style: 'aurora',
    speed: 'normal',
    intensity: 'balanced',
    enabled: true,
  };

  const [backgroundColor, setBackgroundColor] = useState<string>(() => {
    return localStorage.getItem('photos_vault_bg_color') || DEFAULT_BG_COLOR;
  });
  const [motionConfig, setMotionConfig] = useState<BackgroundMotionConfig>(() => {
    const saved = localStorage.getItem('photos_vault_motion_config');
    if (saved) {
      try {
        return { ...DEFAULT_MOTION_CONFIG, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse cached motion config:', e);
      }
    }
    return DEFAULT_MOTION_CONFIG;
  });
  const [isBackgroundPickerOpen, setIsBackgroundPickerOpen] = useState(false);

  // Modals & Overlays
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<Photo | null>(null);
  const [activeEditorPhoto, setActiveEditorPhoto] = useState<Photo | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNewAlbumOpen, setIsNewAlbumOpen] = useState(false);

  // Synchronize state with localStorage
  useEffect(() => {
    localStorage.setItem('photos_vault_items', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('photos_vault_albums', JSON.stringify(albums));
  }, [albums]);

  useEffect(() => {
    localStorage.setItem('photos_vault_bg_color', backgroundColor);
  }, [backgroundColor]);

  useEffect(() => {
    localStorage.setItem('photos_vault_motion_config', JSON.stringify(motionConfig));
  }, [motionConfig]);

  const handleUpdateMotionConfig = (partial: Partial<BackgroundMotionConfig>) => {
    setMotionConfig((prev) => ({ ...prev, ...partial }));
  };

  const isLightBg = useMemo(() => {
    const hex = backgroundColor.replace('#', '');
    if (hex.length !== 6) return false;
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum > 0.5;
  }, [backgroundColor]);

  // Actions
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const handleRatePhoto = (id: string, rating: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, rating } : p))
    );
  };

  const handleSaveAdjustments = (photoId: string, adjustments: PhotoAdjustments) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, adjustments } : p))
    );
  };

  const handleAddPhoto = (newPhoto: Photo) => {
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  const handleCreateAlbum = (newAlbum: Album, selectedPhotoIds: string[]) => {
    setAlbums((prev) => [...prev, newAlbum]);
    if (selectedPhotoIds.length > 0) {
      setPhotos((prev) =>
        prev.map((p) =>
          selectedPhotoIds.includes(p.id)
            ? { ...p, albumIds: [...p.albumIds, newAlbum.id] }
            : p
        )
      );
    }
    setSelectedAlbumId(newAlbum.id);
    setActiveTab('all');
  };

  const handleDeleteAlbum = (albumId: string) => {
    setAlbums((prev) => prev.filter((a) => a.id !== albumId));
    setPhotos((prev) =>
      prev.map((p) => ({
        ...p,
        albumIds: p.albumIds.filter((id) => id !== albumId),
      }))
    );
    if (selectedAlbumId === albumId) {
      setSelectedAlbumId(null);
    }
  };

  // Filter and sort photos
  const filteredPhotos = useMemo(() => {
    let result = [...photos];

    // Filter by tab
    if (activeTab === 'favorites' || favoritesOnly) {
      result = result.filter((p) => p.isFavorite);
    }

    // Filter by album
    if (selectedAlbumId) {
      result = result.filter((p) => p.albumIds.includes(selectedAlbumId));
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search query matching title, tags, location, camera
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.name.toLowerCase().includes(q) ||
          p.location.country.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.exif.camera.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'rating-desc') {
        return b.rating - a.rating;
      }
      return 0;
    });

    return result;
  }, [photos, activeTab, favoritesOnly, selectedAlbumId, selectedCategory, searchQuery, sortBy]);

  const favoritesCount = useMemo(() => photos.filter((p) => p.isFavorite).length, [photos]);
  const currentAlbum = useMemo(() => albums.find((a) => a.id === selectedAlbumId), [albums, selectedAlbumId]);

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 relative ${
        isLightBg ? 'text-neutral-900' : 'text-neutral-100'
      }`}
    >
      {/* Dynamic Animated Motion Background for Current Color */}
      <MotionBackground
        backgroundColor={backgroundColor}
        config={motionConfig}
      />

      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={CATEGORIES}
        viewLayout={viewLayout}
        onViewLayoutChange={setViewLayout}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenNewAlbum={() => setIsNewAlbumOpen(true)}
        favoritesOnly={favoritesOnly}
        onToggleFavoritesOnly={() => setFavoritesOnly((prev) => !prev)}
        totalPhotosCount={photos.length}
        backgroundColor={backgroundColor}
        onOpenBackgroundPicker={() => setIsBackgroundPickerOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'favorites') setFavoritesOnly(true);
            else setFavoritesOnly(false);
          }}
          albums={albums}
          selectedAlbumId={selectedAlbumId}
          onSelectAlbum={setSelectedAlbumId}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setActiveTab('all');
          }}
          categories={CATEGORIES}
          favoritesCount={favoritesCount}
          totalPhotosCount={photos.length}
          onOpenNewAlbum={() => setIsNewAlbumOpen(true)}
          backgroundColor={backgroundColor}
          onOpenBackgroundPicker={() => setIsBackgroundPickerOpen(true)}
        />

        {/* Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Sub-header / Filter & Sort Controls */}
          {activeTab !== 'places' && activeTab !== 'albums' && (
            <div className="mb-6 space-y-4">
              {/* Active Album Banner if inside an album */}
              {currentAlbum && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/40 via-neutral-800 to-neutral-850 border border-blue-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-600 text-white">
                      <Folder className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-white">{currentAlbum.title}</h2>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                          {filteredPhotos.length} photos
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">{currentAlbum.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAlbumId(null)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                    title="Exit Album"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Category Pills & Sort Dropdown */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {/* Horizontal Category Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                      selectedCategory === 'All'
                        ? 'bg-neutral-100 text-neutral-900 shadow-sm'
                        : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-neutral-100 text-neutral-900 shadow-sm'
                          : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Sort dropdown & Edit Background action */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                    Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="text-xs bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-lg px-2.5 py-1.5 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="title-asc">Title (A-Z)</option>
                  </select>

                  <button
                    id="edit-background-inline-btn"
                    onClick={() => setIsBackgroundPickerOpen(true)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white border border-neutral-700 flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                    title="Edit Background Color"
                  >
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Edit Background</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/30 shadow-inner"
                      style={{ backgroundColor }}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View Routing */}
          {activeTab === 'places' ? (
            <PlacesView
              photos={photos}
              onOpenLightbox={(photo) => setActiveLightboxPhoto(photo)}
              onFilterByPlace={(placeName) => {
                setSearchQuery(placeName);
                setActiveTab('all');
              }}
            />
          ) : activeTab === 'albums' ? (
            <AlbumsView
              albums={albums}
              photos={photos}
              onOpenAlbum={(id) => {
                setSelectedAlbumId(id);
                setActiveTab('all');
              }}
              onOpenNewAlbum={() => setIsNewAlbumOpen(true)}
              onDeleteAlbum={handleDeleteAlbum}
              onOpenLightbox={(photo) => setActiveLightboxPhoto(photo)}
            />
          ) : (
            /* Photos Gallery Display */
            <div>
              {filteredPhotos.length === 0 ? (
                /* Empty state */
                <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-500">
                    <SearchX className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-200">No photos found</h3>
                  <p className="text-xs text-neutral-500 max-w-sm">
                    No pictures matched your active filters or search query "{searchQuery}".
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedAlbumId(null);
                      setFavoritesOnly(false);
                    }}
                    className="mt-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-blue-400 border border-neutral-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : viewLayout === 'details' ? (
                /* Details List Layout */
                <div className="space-y-2">
                  {filteredPhotos.map((photo, index) => (
                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      index={index + 1}
                      viewLayout="details"
                      onOpenLightbox={(p) => setActiveLightboxPhoto(p)}
                      onOpenEditor={(p) => setActiveEditorPhoto(p)}
                      onToggleFavorite={handleToggleFavorite}
                      onRatePhoto={handleRatePhoto}
                    />
                  ))}
                </div>
              ) : viewLayout === 'grid' ? (
                /* 3 Rows × 3 Columns Equal Dimension Photo Grid (9 Photos) */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
                  {filteredPhotos.map((photo, index) => (
                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      index={index + 1}
                      viewLayout="grid"
                      onOpenLightbox={(p) => setActiveLightboxPhoto(p)}
                      onOpenEditor={(p) => setActiveEditorPhoto(p)}
                      onToggleFavorite={handleToggleFavorite}
                      onRatePhoto={handleRatePhoto}
                    />
                  ))}
                </div>
              ) : (
                /* Responsive Columns Masonry Layout */
                <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4">
                  {filteredPhotos.map((photo, index) => (
                    <div key={photo.id} className="break-inside-avoid">
                      <PhotoCard
                        photo={photo}
                        index={index + 1}
                        viewLayout="masonry"
                        onOpenLightbox={(p) => setActiveLightboxPhoto(p)}
                        onOpenEditor={(p) => setActiveEditorPhoto(p)}
                        onToggleFavorite={handleToggleFavorite}
                        onRatePhoto={handleRatePhoto}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxPhoto && (
        <PhotoLightbox
          photo={activeLightboxPhoto}
          photos={filteredPhotos.length > 0 ? filteredPhotos : photos}
          albums={albums}
          onClose={() => setActiveLightboxPhoto(null)}
          onNavigate={(p) => setActiveLightboxPhoto(p)}
          onToggleFavorite={handleToggleFavorite}
          onOpenEditor={(p) => {
            setActiveEditorPhoto(p);
          }}
          onRatePhoto={handleRatePhoto}
        />
      )}

      {/* Canvas Photo Editor Modal */}
      {activeEditorPhoto && (
        <PhotoEditorModal
          photo={activeEditorPhoto}
          onClose={() => setActiveEditorPhoto(null)}
          onSaveAdjustments={handleSaveAdjustments}
        />
      )}

      {/* Upload Photo Modal */}
      {isUploadOpen && (
        <PhotoUploadModal
          albums={albums}
          onClose={() => setIsUploadOpen(false)}
          onAddPhoto={handleAddPhoto}
        />
      )}

      {/* New Album Modal */}
      {isNewAlbumOpen && (
        <NewAlbumModal
          photos={photos}
          onClose={() => setIsNewAlbumOpen(false)}
          onCreateAlbum={handleCreateAlbum}
        />
      )}

      {/* Background Color & Motion Picker Modal */}
      <BackgroundColorModal
        isOpen={isBackgroundPickerOpen}
        onClose={() => setIsBackgroundPickerOpen(false)}
        currentColor={backgroundColor}
        onSelectColor={setBackgroundColor}
        onResetColor={() => setBackgroundColor(DEFAULT_BG_COLOR)}
        defaultColor={DEFAULT_BG_COLOR}
        motionConfig={motionConfig}
        onUpdateMotionConfig={handleUpdateMotionConfig}
      />
    </div>
  );
}
export default App;
