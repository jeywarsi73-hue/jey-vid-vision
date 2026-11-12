// JEY VID VISION - Video Card Component
// Premium Netflix/YouTube-style discovery card with clean unboxed metadata and smooth hover interaction

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Eye } from 'lucide-react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
  priority?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, priority = false }) => {
  const [imgError, setImgError] = useState(false);

  // Format upload date to friendly relative or short date
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  // Format view count
  const formatViews = (views: number = 0) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <Link
      to={`/watch/${video.slug}`}
      className="group relative flex flex-col w-full bg-[#111111] border border-neutral-900 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-neutral-800 hover:shadow-xl hover:shadow-red-950/20"
    >
      {/* 16:9 Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
        {!imgError ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            loading={priority ? 'eager' : 'lazy'}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 to-black p-4 text-center">
            <Play className="w-8 h-8 text-[#F00018] opacity-75 mb-1" />
            <span className="text-xs text-neutral-400 font-medium line-clamp-1">{video.title}</span>
          </div>
        )}

        {/* Cinematic Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Hover Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-[#F00018] text-white flex items-center justify-center shadow-lg shadow-black/60 transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Duration Chip (Functional bottom-right video stamp) */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 text-[11px] font-mono font-medium tracking-tight bg-black/85 text-white rounded backdrop-blur-xs flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-400" />
            <span>{video.duration}</span>
          </div>
        )}

        {/* Source Badge (Discrete indicator) */}
        {video.video_source && video.video_source !== 'youtube' && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] font-medium bg-neutral-900/90 text-neutral-300 rounded border border-neutral-700/50 uppercase tracking-wider">
            {video.video_source === 'google_drive' ? 'GDrive' : video.video_source === 'mega' ? 'MEGA' : 'Direct'}
          </div>
        )}
      </div>

      {/* Video Content & Metadata */}
      <div className="p-3.5 flex flex-col flex-grow">
        {/* Unboxed Metadata Row */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1.5">
          <span className="text-[#F00018] font-medium truncate max-w-[140px]">
            {video.category_name || video.content_type}
          </span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>{formatDate(video.upload_date)}</span>
          {video.views_count > 0 && (
            <>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="flex items-center gap-0.5">
                <Eye className="w-3 h-3 inline text-neutral-500" />
                <span>{formatViews(video.views_count)}</span>
              </span>
            </>
          )}
        </div>

        {/* Video Title */}
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-[#F00018] transition-colors mb-2">
          {video.title}
        </h3>

        {/* Short description preview if available */}
        {video.description && (
          <p className="text-xs text-neutral-500 line-clamp-1 mt-auto">
            {video.description}
          </p>
        )}
      </div>
    </Link>
  );
};
