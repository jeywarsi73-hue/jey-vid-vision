// JEY VID VISION - Professional Multi-Source Video Player Component
// Adapts dynamically to YouTube, Google Drive, MEGA, Direct MP4/WebM, and External Storage

import React, { useState, useMemo } from 'react';
import { analyzeVideoSource } from '../lib/videoSourceAdapter';
import { VideoSourceType } from '../types';
import { AlertCircle, ExternalLink, RefreshCw, Maximize2, Play } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  sourceType?: VideoSourceType;
  title: string;
  thumbnail?: string;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  sourceType,
  title,
  thumbnail,
  autoPlay = false
}) => {
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // Analyze the source URL
  const analysis = useMemo(() => {
    return analyzeVideoSource(url, sourceType);
  }, [url, sourceType, retryKey]);

  const handleRetry = () => {
    setHasError(false);
    setRetryKey(prev => prev + 1);
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
      {/* 1. YouTube Source */}
      {analysis.sourceType === 'youtube' && analysis.videoId && !hasError && (
        <iframe
          key={`yt-${analysis.videoId}-${retryKey}`}
          src={`https://www.youtube-nocookie.com/embed/${analysis.videoId}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
          onError={() => setHasError(true)}
        />
      )}

      {/* 2. Google Drive Source */}
      {analysis.sourceType === 'google_drive' && analysis.embedUrl && !hasError && (
        <div className="w-full h-full relative">
          <iframe
            key={`gdrive-${retryKey}`}
            src={analysis.embedUrl}
            title={title}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full border-0"
            onError={() => setHasError(true)}
          />
          {/* Permission notice helper if needed */}
          <div className="absolute bottom-2 left-2 pointer-events-none">
            <span className="text-[10px] bg-black/80 text-neutral-400 px-2 py-0.5 rounded backdrop-blur-xs">
              Google Drive Stream
            </span>
          </div>
        </div>
      )}

      {/* 3. MEGA Cloud Storage Source */}
      {analysis.sourceType === 'mega' && analysis.embedUrl && !hasError && (
        <div className="w-full h-full relative">
          <iframe
            key={`mega-${retryKey}`}
            src={analysis.embedUrl}
            title={title}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full border-0"
            onError={() => setHasError(true)}
          />
        </div>
      )}

      {/* 4. Direct MP4 / WebM / External Storage Source */}
      {(analysis.sourceType === 'direct_url' || analysis.sourceType === 'external_storage') && !hasError && (
        <video
          key={`video-${url}-${retryKey}`}
          controls
          autoPlay={autoPlay}
          playsInline
          poster={thumbnail}
          className="w-full h-full object-contain bg-black"
          onError={() => setHasError(true)}
        >
          <source src={url} type="video/mp4" />
          <source src={url} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* 5. Error & Fallback State */}
      {(hasError || !analysis.isValid) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#0d0d0d] text-white">
          <AlertCircle className="w-12 h-12 text-[#F00018] mb-3" />
          <h3 className="text-base font-semibold mb-1">Playback Unavailable</h3>
          <p className="text-xs text-neutral-400 max-w-md mb-4 leading-relaxed">
            {analysis.errorMessage ||
              'This video link could not be loaded directly. If using Google Drive or MEGA, ensure link permissions are set to "Anyone with the link".'}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Playback</span>
            </button>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F00018] hover:bg-[#d00015] text-xs font-semibold text-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Video Source</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
