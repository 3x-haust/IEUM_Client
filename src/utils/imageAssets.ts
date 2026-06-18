const LOCAL_PROJECT_THUMBNAIL_PATTERN = /^\/assets\/projects\/(\d+)\.png$/;

export const FALLBACK_PROJECT_THUMBNAIL = '/assets/image/growvy.webp';

export function toOptimizedImagePath(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }
  return path.replace(LOCAL_PROJECT_THUMBNAIL_PATTERN, '/assets/projects/$1.webp');
}
