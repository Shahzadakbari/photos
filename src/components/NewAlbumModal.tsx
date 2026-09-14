import React, { useState } from 'react';
import { X, FolderPlus, Check } from 'lucide-react';
import { Album, Photo } from '../types';

interface NewAlbumModalProps {
  photos: Photo[];
  onClose: () => void;
  onCreateAlbum: (album: Album, selectedPhotoIds: string[]) => void;
}

export const NewAlbumModal: React.FC<NewAlbumModalProps> = ({
  photos,
  onClose,
  onCreateAlbum,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);

  const toggleSelectPhoto = (id: string) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAlbum: Album = {
      id: `album-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      coverPhotoId: selectedPhotoIds[0] || (photos[0]?.id ?? undefined),
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateAlbum(newAlbum, selectedPhotoIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden max-h-[85vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/10 text-blue-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-white">Create New Album</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Album Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Summer in Tokyo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-800 text-neutral-200 rounded-lg border border-neutral-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Memories, events, or specific theme..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-800 text-neutral-200 rounded-lg border border-neutral-700 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2">
              Select Photos to Include ({selectedPhotoIds.length} selected)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 bg-neutral-950/50 rounded-xl border border-neutral-800">
              {photos.map((photo) => {
                const isSelected = selectedPhotoIds.includes(photo.id);
                return (
                  <div
                    key={photo.id}
                    onClick={() => toggleSelectPhoto(photo.id)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/30'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo.thumbnailUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center text-white">
                        <Check className="w-5 h-5 bg-blue-600 rounded-full p-0.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium shadow-lg shadow-blue-600/20 transition-all"
            >
              Create Album
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
