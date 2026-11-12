// JEY VID VISION - Multi-Source Video Adapter Engine
// Handles YouTube, Google Drive, MEGA, Direct MP4/WebM, and External Cloud Storage

import { VideoSourceType } from '../types';

export interface VideoSourceDetails {
  sourceType: VideoSourceType;
  isValid: boolean;
  embedUrl: string;
  directUrl?: string;
  videoId?: string;
  detectedThumbnail?: string;
  errorMessage?: string;
}

/**
 * Extracts YouTube Video ID from any standard or shortened YouTube URL
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // Standard watch?v=...
  const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // youtu.be/ID
  const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/embed/ID
  const embedMatch = cleanUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  // youtube.com/shorts/ID
  const shortsMatch = cleanUrl.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  // youtube.com/live/ID
  const liveMatch = cleanUrl.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch) return liveMatch[1];

  return null;
}

/**
 * Extracts Google Drive File ID from public/authorized share links
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // /file/d/{id}/view or /edit
  const matchFileD = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD) return matchFileD[1];

  // id={id} or open?id={id}
  const matchIdParam = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam) return matchIdParam[1];

  return null;
}

/**
 * Parses and validates MEGA cloud storage URLs
 */
export function parseMegaUrl(url: string): { isMega: boolean; embedUrl?: string; isStreamable: boolean } {
  if (!url) return { isMega: false, isStreamable: false };
  const cleanUrl = url.trim();

  if (!cleanUrl.includes('mega.nz') && !cleanUrl.includes('mega.co.nz')) {
    return { isMega: false, isStreamable: false };
  }

  // Check if it's already an embed link: https://mega.nz/embed/...
  if (cleanUrl.includes('mega.nz/embed/')) {
    return { isMega: true, embedUrl: cleanUrl, isStreamable: true };
  }

  // Convert mega.nz/file/{id}#{key} to embed format if available
  const match = cleanUrl.match(/mega\.nz\/file\/([a-zA-Z0-9_-]+)#([a-zA-Z0-9_-]+)/);
  if (match) {
    const embedUrl = `https://mega.nz/embed/${match[1]}#${match[2]}`;
    return { isMega: true, embedUrl, isStreamable: true };
  }

  // Old format: mega.nz/#!{id}!{key}
  const matchOld = cleanUrl.match(/mega\.nz\/#!([a-zA-Z0-9_-]+)!([a-zA-Z0-9_-]+)/);
  if (matchOld) {
    const embedUrl = `https://mega.nz/embed/${matchOld[1]}#${matchOld[2]}`;
    return { isMega: true, embedUrl, isStreamable: true };
  }

  return { isMega: true, embedUrl: cleanUrl, isStreamable: false };
}

/**
 * Automatically inspects any submitted video URL and returns its source details
 */
export function analyzeVideoSource(url: string, declaredSource?: VideoSourceType): VideoSourceDetails {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return {
      sourceType: declaredSource || 'youtube',
      isValid: false,
      embedUrl: '',
      errorMessage: 'Please enter a valid video link',
    };
  }

  const cleanUrl = url.trim();

  // 1. YouTube Detection
  const ytId = extractYouTubeId(cleanUrl);
  if (ytId) {
    return {
      sourceType: 'youtube',
      isValid: true,
      videoId: ytId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`,
      detectedThumbnail: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
    };
  }

  // 2. Google Drive Detection
  const gDriveId = extractGoogleDriveId(cleanUrl);
  if (gDriveId || cleanUrl.includes('drive.google.com')) {
    if (!gDriveId) {
      return {
        sourceType: 'google_drive',
        isValid: false,
        embedUrl: '',
        errorMessage: 'Invalid Google Drive link format. Use a public share link (Anyone with the link).',
      };
    }
    return {
      sourceType: 'google_drive',
      isValid: true,
      videoId: gDriveId,
      embedUrl: `https://drive.google.com/file/d/${gDriveId}/preview`,
      directUrl: `https://drive.google.com/uc?export=download&id=${gDriveId}`,
    };
  }

  // 3. MEGA Detection
  const megaInfo = parseMegaUrl(cleanUrl);
  if (megaInfo.isMega) {
    return {
      sourceType: 'mega',
      isValid: true,
      embedUrl: megaInfo.embedUrl || cleanUrl,
      directUrl: cleanUrl,
      errorMessage: megaInfo.isStreamable
        ? undefined
        : 'Note: Certain MEGA links require the file to be shared as an embed link or public video preview.',
    };
  }

  // 4. Direct HTML5 Video Detection (MP4, WebM, OGG, M4V, HLS .m3u8)
  const isDirectVideo =
    /\.(mp4|webm|ogg|m4v|m3u8)(\?.*)?$/i.test(cleanUrl) ||
    cleanUrl.includes('.r2.dev') ||
    cleanUrl.includes('b-cdn.net') ||
    cleanUrl.includes('amazonaws.com') ||
    cleanUrl.includes('storage.googleapis.com');

  if (isDirectVideo || declaredSource === 'direct_url' || declaredSource === 'external_storage') {
    return {
      sourceType: declaredSource === 'external_storage' ? 'external_storage' : 'direct_url',
      isValid: true,
      embedUrl: cleanUrl,
      directUrl: cleanUrl,
    };
  }

  // Fallback for valid HTTP(S) links
  if (/^https?:\/\//i.test(cleanUrl)) {
    return {
      sourceType: declaredSource || 'direct_url',
      isValid: true,
      embedUrl: cleanUrl,
      directUrl: cleanUrl,
    };
  }

  return {
    sourceType: declaredSource || 'youtube',
    isValid: false,
    embedUrl: '',
    errorMessage: 'Unsupported URL format. Please provide a YouTube, Google Drive, MEGA or MP4/WebM video link.',
  };
}

/**
 * Creates a URL-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `video-${Date.now()}`;
}
