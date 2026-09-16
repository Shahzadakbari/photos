import React from 'react';
import { 
  Camera, 
  Search, 
  LayoutGrid, 
  Columns3, 
  List, 
  Upload, 
  Heart, 
  FolderPlus,
  X,
  Palette
} from 'lucide-react';
import { ViewLayout, SortOption } from '../types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  viewLayout: ViewLayout;
  onViewLayoutChange: (layout: ViewLayout) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onOpenUpload: () => void;
  onOpenNewAlbum: () => void;
  favoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  totalPhotosCount: number;
  backgroundColor: string;
  onOpenBackgroundPicker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  viewLayout,
  onViewLayoutChange,
  sortBy,
  onSortChange,
  onOpenUpload,
  onOpenNewAlbum,
  favoritesOnly,
  onToggleFavoritesOnly,
  totalPhotosCount,
  backgroundColor,
  onOpenBackgroundPicker,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
                Photos
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
                  {totalPhotosCount}
                </span>
              </h1>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="photo-search-input"
              type="text"
              placeholder="Search photos, tags, locations, cameras..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-neutral-800/80 hover:bg-neutral-800 focus:bg-neutral-800 text-neutral-200 placeholder-neutral-500 rounded-lg border border-neutral-700/80 focus:border-blue-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Actions & controls */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Favorites filter toggle */}
            <button
              id="toggle-favorites-btn"
              onClick={onToggleFavoritesOnly}
              className={`p-2 rounded-lg border text-sm flex items-center gap-1.5 transition-colors ${
                favoritesOnly
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-neutral-800/80 border-neutral-700/70 text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
              title="Show Favorites Only"
            >
              <Heart className={`w-4 h-4 ${favoritesOnly ? 'fill-rose-500' : ''}`} />
              <span className="hidden md:inline">Favorites</span>
            </button>

            {/* Layout switchers */}
            <div className="hidden sm:flex items-center bg-neutral-800 rounded-lg p-0.5 border border-neutral-700/70">
              <button
                onClick={() => onViewLayoutChange('masonry')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewLayout === 'masonry' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Masonry View"
              >
                <Columns3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewLayoutChange('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewLayout === 'grid' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Square Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewLayoutChange('details')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewLayout === 'details' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="List Details View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Edit Background button */}
            <button
              id="edit-background-nav-btn"
              onClick={onOpenBackgroundPicker}
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/70 text-neutral-200 hover:text-white transition-all text-sm flex items-center gap-1.5 shadow-sm active:scale-95 group"
              title="Edit Background Color"
            >
              <Palette className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline font-medium">Edit Background</span>
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0 ml-0.5 shadow-inner"
                style={{ backgroundColor }}
              />
            </button>

            {/* New Album button */}
            <button
              id="new-album-nav-btn"
              onClick={onOpenNewAlbum}
              className="p-2 rounded-lg bg-neutral-800/80 border border-neutral-700/70 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors hidden md:flex items-center gap-1.5 text-sm"
              title="Create Album"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Album</span>
            </button>

            {/* Upload button */}
            <button
              id="upload-photo-btn"
              onClick={onOpenUpload}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-600/30 active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Add Photo</span>
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="mt-2 sm:hidden relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search photos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm bg-neutral-800 text-neutral-200 placeholder-neutral-500 rounded-lg border border-neutral-700 focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
};
