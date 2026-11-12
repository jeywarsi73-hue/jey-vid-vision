// JEY VID VISION - Cinematic Hero Banner Component
// Features dynamic backdrop, featured showcase, "WATCH NOW" trigger, and responsive cinematic composition

import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Sparkles } from 'lucide-react';
import { Video, WebsiteSettings } from '../types';

interface HeroBannerProps {
  featuredVideo?: Video;
  settings?: WebsiteSettings | null;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ featuredVideo, settings }) => {
  const bannerImage = settings?.banner_url || '/hero-banner.jpg';
  const watchLink = featuredVideo ? `/watch/${featuredVideo.slug}` : '/category/bangla-natok';

  return (
    <div className="relative w-full min-h-[500px] md:min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden bg-black">
      {/* Background Cinematic Artwork */}
      <div className="absolute inset-0 z-0">
        <img
          src={bannerImage}
          alt="JEY VID VISION Cinematic Spotlight"
          className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.1]"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/hero-banner.jpg';
          }}
        />

        {/* Ambient Red & Black Gradient Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent w-full lg:w-3/4" />
        
        {/* Subtle Brand Crimson Beam */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#F00018]/15 blur-[120px] pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        <div className="max-w-2xl space-y-4">
          
          {/* Brand Tagline Badge / Kicker */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#F00018]">
            <Sparkles className="w-4 h-4 text-[#F00018]" />
            <span>{settings?.tagline || 'Your Entertainment. Your Vision.'}</span>
          </div>

          {/* Main Cinematic Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] text-balance">
            {featuredVideo?.title || 'Unlimited Bangla Natok, Drama Serials & Music'}
          </h1>

          {/* Unboxed Metadata if Featured Video is present */}
          {featuredVideo && (
            <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium pt-1">
              <span className="text-[#F00018]">{featuredVideo.category_name || featuredVideo.content_type}</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>HD 1080p Stream</span>
              {featuredVideo.duration && (
                <>
                  <span aria-hidden="true" className="text-neutral-500">·</span>
                  <span className="font-mono">{featuredVideo.duration}</span>
                </>
              )}
            </div>
          )}

          {/* Description */}
          <p className="text-sm md:text-base text-neutral-300 line-clamp-3 leading-relaxed max-w-xl">
            {featuredVideo?.description ||
              'Experience the pinnacle of South Asian storytelling. Stream the latest Bangla Natok, trending Pakistani Serials, classic Hindi dramas, side-splitting comedy, and chart-topping music videos.'}
          </p>

          {/* Prominent Action Buttons */}
          <div className="flex items-center gap-3 pt-4 sm:pt-6">
            <Link
              to={watchLink}
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-lg bg-[#F00018] text-white font-bold text-sm tracking-wide shadow-lg shadow-red-950/50 hover:bg-[#d00015] hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>WATCH NOW</span>
            </Link>

            <Link
              to="/category/bangla-natok"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-semibold text-sm transition-colors duration-150 backdrop-blur-xs"
            >
              <Info className="w-4 h-4 text-neutral-400" />
              <span>Explore All</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
