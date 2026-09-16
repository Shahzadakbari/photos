export interface PhotoExif {
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: number;
  resolution: string;
  fileSize: string;
}

export interface PhotoLocation {
  name: string;
  country: string;
}

export interface PhotoAdjustments {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  warmth: number; // -100 to 100
  sepia: number; // 0 to 100
  grayscale: number; // 0 to 100
  blur: number; // 0 to 20
  invert: number; // 0 to 100
  vignette: number; // 0 to 100
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  filterPreset: 'original' | 'vivid' | 'mono' | 'dramatic' | 'warm' | 'film' | 'cool';
}

export interface Photo {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  aspectRatio: number; // width / height
  date: string;
  category: 'Nature' | 'Architecture' | 'Portraits' | 'Travel' | 'Street' | 'Macro';
  tags: string[];
  isFavorite: boolean;
  rating: number;
  albumIds: string[];
  location: PhotoLocation;
  exif: PhotoExif;
  adjustments?: PhotoAdjustments;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  coverPhotoId?: string;
  createdAt: string;
}

export type ViewLayout = 'masonry' | 'grid' | 'details';
export type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'rating-desc';
export type ActiveTab = 'all' | 'favorites' | 'albums' | 'places';

export type BackgroundMotionStyle = 'aurora' | 'orbs' | 'flow' | 'pulse' | 'static';
export type BackgroundMotionSpeed = 'slow' | 'normal' | 'fast';
export type BackgroundMotionIntensity = 'subtle' | 'balanced' | 'vivid';

export interface BackgroundMotionConfig {
  style: BackgroundMotionStyle;
  speed: BackgroundMotionSpeed;
  intensity: BackgroundMotionIntensity;
  enabled: boolean;
}
