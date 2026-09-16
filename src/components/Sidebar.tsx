import React from 'react';
import { 
  Images, 
  Heart, 
  Folder, 
  MapPin, 
  Sparkles, 
  FolderPlus, 
  Compass, 
  Tag, 
  SlidersHorizontal,
  Palette
} from 'lucide-react';
import { Album, ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  albums: Album[];
  selectedAlbumId: string | null;
  onSelectAlbum: (albumId: string | null) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  favoritesCount: number;
  totalPhotosCount: number;
  onOpenNewAlbum: () => void;
  backgroundColor: string;
  onOpenBackgroundPicker: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  albums,
  selectedAlbumId,
  onSelectAlbum,
  selectedCategory,
  onSelectCategory,
  categories,
  favoritesCount,
  totalPhotosCount,
  onOpenNewAlbum,
  backgroundColor,
  onOpenBackgroundPicker,
}) => {
  return (
    <aside className="w-64 shrink-0 bg-neutral-900/50 border-r border-neutral-800 p-4 flex flex-col justify-between hidden lg:flex">
      <div className="space-y-6">
        {/* Main Navigation */}
        <div className="space-y-1">
          <button
            id="nav-tab-all"
            onClick={() => {
              onSelectTab('all');
              onSelectAlbum(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'all' && selectedAlbumId === null
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Images className="w-4 h-4 text-blue-400" />
              <span>Library</span>
            </div>
            <span className="text-xs text-neutral-500 font-mono">{totalPhotosCount}</span>
          </button>

          <button
            id="nav-tab-favorites"
            onClick={() => {
              onSelectTab('favorites');
              onSelectAlbum(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Favorites</span>
            </div>
            <span className="text-xs text-neutral-500 font-mono">{favoritesCount}</span>
          </button>

          <button
            id="nav-tab-places"
            onClick={() => {
              onSelectTab('places');
              onSelectAlbum(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'places'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Locations</span>
            </div>
          </button>
        </div>

        {/* Categories Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Categories</span>
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => onSelectCategory('All')}
              className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                selectedCategory === 'All'
                  ? 'text-blue-400 font-medium bg-blue-500/10'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                  selectedCategory === cat
                    ? 'text-blue-400 font-medium bg-blue-500/10'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Albums Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Albums</span>
            <button
              onClick={onOpenNewAlbum}
              className="text-neutral-400 hover:text-blue-400 transition-colors p-1"
              title="Add New Album"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1">
            {albums.map((album) => {
              const isSelected = selectedAlbumId === album.id;
              return (
                <button
                  key={album.id}
                  onClick={() => {
                    onSelectAlbum(isSelected ? null : album.id);
                    onSelectTab('albums');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-medium'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Folder className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-400' : 'text-neutral-500'}`} />
                    <span className="truncate">{album.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Background Color Quick Selector in Sidebar */}
      <div className="pt-4 border-t border-neutral-800/80">
        <button
          id="edit-background-sidebar-btn"
          onClick={onOpenBackgroundPicker}
          className="w-full p-2.5 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 flex items-center justify-between text-xs text-neutral-300 hover:text-white transition-all group shadow-sm active:scale-98"
          title="Change Background Color"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="font-medium">Edit Background</span>
          </div>
          <div
            className="w-4 h-4 rounded-full border border-white/30 shadow-inner group-hover:scale-110 transition-transform"
            style={{ backgroundColor }}
          />
        </button>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-neutral-800/40 rounded-xl border border-neutral-800 text-xs text-neutral-400 space-y-1">
        <div className="flex items-center justify-between font-medium text-neutral-300">
          <span>Photos Vault</span>
          <span className="text-emerald-400 font-mono">Ready</span>
        </div>
        <p className="text-[11px] text-neutral-500 leading-relaxed">
          Client-side in-memory canvas engine with live EXIF & filters.
        </p>
      </div>
    </aside>
  );
};
