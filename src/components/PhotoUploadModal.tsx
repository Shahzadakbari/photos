import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, MapPin, Tag, Camera, Check } from 'lucide-react';
import { Photo, Album } from '../types';
import { defaultAdjustments } from '../data/initialPhotos';

interface PhotoUploadModalProps {
  albums: Album[];
  onClose: () => void;
  onAddPhoto: (photo: Photo) => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  albums,
  onClose,
  onAddPhoto,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Photo['category']>('Nature');
  const [locationName, setLocationName] = useState('');
  const [locationCountry, setLocationCountry] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [cameraModel, setCameraModel] = useState('Sony α7 IV');
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([]);
  const [aspectRatio, setAspectRatio] = useState(1.5);
  const [fileSizeStr, setFileSizeStr] = useState('4.2 MB');
  const [resolutionStr, setResolutionStr] = useState('4000 × 2667 (10.7 MP)');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    // Set file size representation
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    setFileSizeStr(`${mb} MB`);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);

      // Auto-populate title from filename if not yet filled
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }

      // Calculate natural image dimensions
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const ratio = Number((img.naturalWidth / img.naturalHeight).toFixed(2));
        setAspectRatio(ratio || 1.5);
        const mp = ((img.naturalWidth * img.naturalHeight) / 1000000).toFixed(1);
        setResolutionStr(`${img.naturalWidth} × ${img.naturalHeight} (${mp} MP)`);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const newPhoto: Photo = {
      id: `photo-user-${Date.now()}`,
      title: title.trim() || 'Untitled Photograph',
      description: description.trim() || 'Uploaded to personal photos collection.',
      url: imagePreview,
      thumbnailUrl: imagePreview,
      aspectRatio,
      date: new Date().toISOString(),
      category,
      tags: tags.length > 0 ? tags : ['custom', category.toLowerCase()],
      isFavorite: false,
      rating: 5,
      albumIds: selectedAlbumIds,
      location: {
        name: locationName.trim() || 'Studio / Local',
        country: locationCountry.trim() || 'Unknown',
      },
      exif: {
        camera: cameraModel.trim() || 'Digital Camera',
        lens: 'Standard Zoom Lens',
        focalLength: '35mm',
        aperture: 'f/2.8',
        shutterSpeed: '1/250s',
        iso: 100,
        resolution: resolutionStr,
        fileSize: fileSizeStr,
      },
      adjustments: { ...defaultAdjustments },
    };

    onAddPhoto(newPhoto);
    onClose();
  };

  const toggleAlbum = (id: string) => {
    setSelectedAlbumIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/10 text-blue-400">
              <Upload className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-white">Add Photo to Vault</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Dropzone */}
          {!imagePreview ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-700 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-neutral-200">
                Drag & drop your photograph here, or{' '}
                <span className="text-blue-400 underline">browse files</span>
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Supports JPG, PNG, WEBP, AVIF with high-resolution canvas processing
              </p>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 max-h-56 flex items-center justify-center">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="max-h-56 w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-neutral-900/80 text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
                title="Change Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Metadata fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Photo Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Coastal Sunrise"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-800 text-neutral-200 rounded-lg border border-neutral-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Photo['category'])}
                className="w-full px-3 py-2 text-sm bg-neutral-800 text-neutral-200 rounded-lg border border-neutral-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="Nature">Nature</option>
                <option value="Architecture">Architecture</option>
                <option value="Portraits">Portraits</option>
                <option value="Travel">Travel</option>
                <option value="Street">Street</option>
                <option value="Macro">Macro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Description / Story
            </label>
            <textarea
              rows={2}
              placeholder="Add personal notes or shooting conditions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-800 text-neutral-200 rounded-lg border border-neutral-700 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-500" />
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Banff National Park"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-800 text-neutral-200 rounded-lg border border-neutral-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Country
              </label>
              <input
                type="text"
                placeholder="e.g. Canada"
                value={locationCountry}
                onChange={(e) => setLocationCountry(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-800 text-neutral-200 rounded-lg border border-neutral-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-neutral-500" />
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="mountains, lake, dawn"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-800 text-neutral-200 rounded-lg border border-neutral-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1 flex items-center gap-1">
                <Camera className="w-3 h-3 text-neutral-500" />
                Camera Equipment
              </label>
              <input
                type="text"
                placeholder="Sony α7 IV, iPhone 15 Pro, etc."
                value={cameraModel}
                onChange={(e) => setCameraModel(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-800 text-neutral-200 rounded-lg border border-neutral-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Add to Albums */}
          {albums.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2">
                Add to Albums
              </label>
              <div className="flex flex-wrap gap-2">
                {albums.map((alb) => {
                  const selected = selectedAlbumIds.includes(alb.id);
                  return (
                    <button
                      type="button"
                      key={alb.id}
                      onClick={() => toggleAlbum(alb.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                        selected
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                          : 'bg-neutral-800/80 border-neutral-700/80 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3" />}
                      <span>{alb.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit */}
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
              disabled={!imagePreview}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium shadow-lg shadow-blue-600/20 transition-all"
            >
              Add to Photos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
