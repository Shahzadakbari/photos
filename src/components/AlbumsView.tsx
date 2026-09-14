import React from 'react';
import { Folder, FolderPlus, Trash2, Calendar, Image as ImageIcon } from 'lucide-react';
import { Album, Photo } from '../types';

interface AlbumsViewProps {
  albums: Album[];
  photos: Photo[];
  onOpenAlbum: (albumId: string) => void;
  onOpenNewAlbum: () => void;
  onDeleteAlbum: (albumId: string) => void;
  onOpenLightbox: (photo: Photo) => void;
}

export const AlbumsView: React.FC<AlbumsViewProps> = ({
  albums,
  photos,
  onOpenAlbum,
  onOpenNewAlbum,
  onDeleteAlbum,
  onOpenLightbox,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-400" />
            Curated Albums
          </h2>
          <p className="text-sm text-neutral-400 mt-0.5">
            Organized collections and photo series ({albums.length} albums)
          </p>
        </div>

        <button
          onClick={onOpenNewAlbum}
          className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-sm font-medium flex items-center gap-1.5 transition-colors"
        >
          <FolderPlus className="w-4 h-4 text-blue-400" />
          <span>New Album</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {albums.map((album) => {
          const albumPhotos = photos.filter((p) => p.albumIds.includes(album.id));
          const coverPhoto =
            photos.find((p) => p.id === album.coverPhotoId) || albumPhotos[0] || photos[0];

          return (
            <div
              key={album.id}
              className="group bg-neutral-800/40 hover:bg-neutral-800/80 rounded-2xl border border-neutral-800 hover:border-neutral-700 overflow-hidden shadow-lg transition-all flex flex-col justify-between"
            >
              {/* Cover */}
              <div
                className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 cursor-pointer"
                onClick={() => onOpenAlbum(album.id)}
              >
                {coverPhoto ? (
                  <img
                    src={coverPhoto.thumbnailUrl}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="px-2 py-0.5 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-700/60 font-mono">
                    {albumPhotos.length} {albumPhotos.length === 1 ? 'photo' : 'photos'}
                  </span>
                </div>
              </div>

              {/* Album info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => onOpenAlbum(album.id)}
                    className="text-base font-semibold text-neutral-200 group-hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    {album.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {album.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-800/80 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {album.createdAt}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete album "${album.title}"? Photos will not be deleted.`)) {
                        onDeleteAlbum(album.id);
                      }
                    }}
                    className="p-1 rounded text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                    title="Delete Album"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
