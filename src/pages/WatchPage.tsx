// JEY VID VISION - Video Watch Page Component
// High-grade responsive player, multi-source stream, related queue, next/prev navigation & social sharing

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Share2, 
  Eye, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Tag, 
  Sparkles, 
  Flame, 
  ThumbsUp, 
  CheckCircle2,
  Film
} from 'lucide-react';
import { DataService } from '../lib/supabase';
import { Video } from '../types';
import { VideoPlayer } from '../components/VideoPlayer';
import { VideoCard } from '../components/VideoCard';
import { ShareModal } from '../components/ShareModal';
import { AdsterraPlacement } from '../components/AdsterraPlacement';

export const WatchPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [allVideosList, setAllVideosList] = useState<Video[]>([]);
  const [liked, setLiked] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLiked(false);
    setDescExpanded(false);

    if (!slug) return;

    DataService.getVideoBySlugOrId(slug).then((video) => {
      if (!isMounted) return;
      if (video) {
        setCurrentVideo(video);
        DataService.incrementViews(video.id);

        // Fetch related videos
        DataService.getVideos({ status: 'published' }).then((all) => {
          if (!isMounted) return;
          setAllVideosList(all);
          const related = all.filter(
            v => v.id !== video.id && (v.category_id === video.category_id || v.content_type === video.content_type)
          ).slice(0, 8);
          setRelatedVideos(related.length > 0 ? related : all.filter(v => v.id !== video.id).slice(0, 8));
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#F00018] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center px-4">
        <Film className="w-16 h-16 text-neutral-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Video Not Found</h2>
        <p className="text-sm text-neutral-400 mb-6">The requested video may have been removed or unpublished.</p>
        <Link to="/" className="px-5 py-2.5 rounded-lg bg-[#F00018] text-white text-sm font-semibold">
          Return to Browse
        </Link>
      </div>
    );
  }

  // Next & Previous Video Calculation
  const currentIndex = allVideosList.findIndex(v => v.id === currentVideo.id);
  const prevVideo = currentIndex > 0 ? allVideosList[currentIndex - 1] : null;
  const nextVideo = currentIndex >= 0 && currentIndex < allVideosList.length - 1 ? allVideosList[currentIndex + 1] : null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://jeyvidvision.com/watch/${currentVideo.slug}`;

  return (
    <div className="min-h-screen bg-[#080808] text-white pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Main Layout Grid: Player on left (col-span-8), Sidebar Queue on right (col-span-4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Video Stream & Info Column */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* 1. Responsive Player */}
            <div className="w-full">
              <VideoPlayer
                url={currentVideo.video_url}
                sourceType={currentVideo.video_source}
                title={currentVideo.title}
                thumbnail={currentVideo.thumbnail_url}
                autoPlay={true}
              />
            </div>

            {/* 2. Video Title & Badges */}
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-display leading-tight mb-2">
                {currentVideo.title}
              </h1>

              {/* Unboxed Metadata & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-neutral-900 text-xs">
                
                {/* Left Metadata Row */}
                <div className="flex items-center flex-wrap gap-2 text-neutral-400">
                  <Link
                    to={`/category/${currentVideo.category_name?.toLowerCase().replace(/\s+/g, '-') || 'bangla-natok'}`}
                    className="text-[#F00018] font-semibold hover:underline"
                  >
                    {currentVideo.category_name || currentVideo.content_type}
                  </Link>
                  <span aria-hidden="true" className="text-neutral-700">·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{new Date(currentVideo.upload_date).toLocaleDateString()}</span>
                  </span>
                  {currentVideo.duration && (
                    <>
                      <span aria-hidden="true" className="text-neutral-700">·</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{currentVideo.duration}</span>
                      </span>
                    </>
                  )}
                  <span aria-hidden="true" className="text-neutral-700">·</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{(currentVideo.views_count || 1).toLocaleString()} views</span>
                  </span>
                </div>

                {/* Right Interactive Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      liked 
                        ? 'bg-[#F00018] text-white' 
                        : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                    <span>{liked ? 'Liked' : 'Like'}</span>
                  </button>

                  <button
                    onClick={() => setShareModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Next / Previous Navigation Controls */}
            <div className="flex items-center justify-between gap-4 p-3 bg-[#111111] rounded-xl border border-neutral-900 text-xs">
              {prevVideo ? (
                <button
                  onClick={() => navigate(`/watch/${prevVideo.slug}`)}
                  className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-[#F00018]" />
                  <span className="line-clamp-1 max-w-[150px] sm:max-w-[220px]">Prev: {prevVideo.title}</span>
                </button>
              ) : (
                <span className="text-neutral-600">Start of queue</span>
              )}

              {nextVideo ? (
                <button
                  onClick={() => navigate(`/watch/${nextVideo.slug}`)}
                  className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors text-right ml-auto"
                >
                  <span className="line-clamp-1 max-w-[150px] sm:max-w-[220px]">Next: {nextVideo.title}</span>
                  <ChevronRight className="w-4 h-4 text-[#F00018]" />
                </button>
              ) : (
                <span className="text-neutral-600">End of playlist</span>
              )}
            </div>

            {/* 4. Video Description */}
            <div className="bg-[#111111] border border-neutral-900 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-2">Description</h3>
              <p className={`text-xs md:text-sm text-neutral-300 leading-relaxed whitespace-pre-line ${
                descExpanded ? '' : 'line-clamp-3'
              }`}>
                {currentVideo.description || 'No detailed description provided for this video.'}
              </p>
              {currentVideo.description && currentVideo.description.length > 140 && (
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="mt-2 text-xs font-semibold text-[#F00018] hover:underline block"
                >
                  {descExpanded ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* 5. Watch Page Bottom Adsterra Banner */}
            <AdsterraPlacement 
              placementName="watch_player_bottom" 
              fallbackText="Adsterra Watch Page Bottom Banner" 
            />
          </div>

          {/* Right Sidebar: Related Videos & Adsterra Native Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sidebar Adsterra Unit */}
            <AdsterraPlacement 
              placementName="watch_sidebar" 
              fallbackText="Adsterra 300x250 Native Sidebar Unit" 
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 font-display">
                  Up Next & Related
                </h3>
                <span className="text-xs text-neutral-500">{relatedVideos.length} videos</span>
              </div>

              <div className="space-y-3">
                {relatedVideos.map((video) => (
                  <Link
                    key={video.id}
                    to={`/watch/${video.slug}`}
                    className="flex gap-3 group bg-[#111111] hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 p-2 rounded-xl transition-all"
                  >
                    <div className="relative w-32 aspect-video shrink-0 overflow-hidden rounded-lg bg-neutral-950">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/drama-thumb.jpg';
                        }}
                      />
                      {video.duration && (
                        <span className="absolute bottom-1 right-1 text-[10px] font-mono bg-black/80 px-1 rounded text-white">
                          {video.duration}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col justify-center min-w-0 pr-1">
                      <span className="text-[11px] font-medium text-[#F00018] truncate mb-0.5">
                        {video.category_name || video.content_type}
                      </span>
                      <h4 className="text-xs font-semibold text-white group-hover:text-[#F00018] transition-colors line-clamp-2 leading-snug">
                        {video.title}
                      </h4>
                      <span className="text-[10px] text-neutral-500 mt-1">
                        {(video.views_count || 0).toLocaleString()} views
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        videoTitle={currentVideo.title}
        videoUrl={currentUrl}
      />
    </div>
  );
};
