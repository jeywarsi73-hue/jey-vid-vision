// JEY VID VISION - Homepage Component
// Dynamic OTT content rows, high-impact hero banner, and seamless category discovery

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Flame, Sparkles, Film, Clock, Music, Smile, Tv } from 'lucide-react';
import { DataService } from '../lib/supabase';
import { Video, Category, WebsiteSettings } from '../types';
import { HeroBanner } from '../components/HeroBanner';
import { VideoCard } from '../components/VideoCard';
import { AdsterraPlacement } from '../components/AdsterraPlacement';

export const HomePage: React.FC = () => {
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      DataService.getVideos({ status: 'published' }),
      DataService.getCategories(),
      DataService.getSettings()
    ]).then(([vids, cats, sett]) => {
      if (isMounted) {
        setAllVideos(vids);
        setCategories(cats);
        setSettings(sett);
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, []);

  // Filter content slices
  const featuredVideo = allVideos.find(v => v.featured) || allVideos[0];
  const latestVideos = allVideos.slice(0, 8);
  const trendingVideos = allVideos.filter(v => v.trending);
  const featuredVideos = allVideos.filter(v => v.featured);

  // Group by primary category
  const getVideosForCategory = (slug: string, limit = 4) => {
    const cat = categories.find(c => c.slug === slug);
    if (!cat) return [];
    return allVideos.filter(v => v.category_id === cat.id).slice(0, limit);
  };

  const banglaNatoks = getVideosForCategory('bangla-natok');
  const hindiNatoks = getVideosForCategory('hindi-natok');
  const pakistaniNatoks = getVideosForCategory('pakistani-natok');
  const comedyNatoks = getVideosForCategory('comedy-serial-natok');
  const musicVideos = getVideosForCategory('all-music-video');

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* 1. Cinematic Hero Banner */}
      <HeroBanner featuredVideo={featuredVideo} settings={settings} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* 2. Top Adsterra Banner Placement */}
        <AdsterraPlacement 
          placementName="home_top_banner" 
          fallbackText="Sponsored Banner Placement (Adsterra Leaderboard)" 
        />

        {/* 3. Latest Uploads Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#F00018]" />
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">
                Latest Uploads
              </h2>
            </div>
            <Link
              to="/category/bangla-natok"
              className="text-xs font-semibold text-neutral-400 hover:text-[#F00018] flex items-center gap-1 transition-colors"
            >
              <span>See More</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {latestVideos.map((video, idx) => (
              <VideoCard key={video.id} video={video} priority={idx < 4} />
            ))}
          </div>
        </section>

        {/* 4. Trending Now Section */}
        {trendingVideos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">
                  Trending Now
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {trendingVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* 5. Popular Bangla Natok Row */}
        {banglaNatoks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-[#F00018]" />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">
                    Popular Bangla Natok
                  </h2>
                  <p className="text-xs text-neutral-400 hidden sm:block">Heartwarming romantic, family and social dramas</p>
                </div>
              </div>
              <Link
                to="/category/bangla-natok"
                className="text-xs font-semibold text-neutral-400 hover:text-[#F00018] flex items-center gap-1 transition-colors"
              >
                <span>View All Bangla Natok</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {banglaNatoks.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* 6. Between Sections Adsterra Banner */}
        <AdsterraPlacement 
          placementName="home_middle_banner" 
          fallbackText="Adsterra Native Mid-Section Placement" 
        />

        {/* 7. Pakistani Natok Row */}
        {pakistaniNatoks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-emerald-500" />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">
                    Pakistani Natok & Serials
                  </h2>
                  <p className="text-xs text-neutral-400 hidden sm:block">Gripping episodic serials and acclaimed storytelling</p>
                </div>
              </div>
              <Link
                to="/category/pakistani-natok"
                className="text-xs font-semibold text-neutral-400 hover:text-[#F00018] flex items-center gap-1 transition-colors"
              >
                <span>View All Pakistani</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {pakistaniNatoks.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* 8. Comedy Serial / Natok Row */}
        {comedyNatoks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Smile className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">
                    Comedy Serial / Natok
                  </h2>
                  <p className="text-xs text-neutral-400 hidden sm:block">Pure laughter, village comedy, and lighthearted entertainment</p>
                </div>
              </div>
              <Link
                to="/category/comedy-serial-natok"
                className="text-xs font-semibold text-neutral-400 hover:text-[#F00018] flex items-center gap-1 transition-colors"
              >
                <span>View All Comedy</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {comedyNatoks.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* 9. All Music Videos Row */}
        {musicVideos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-cyan-400" />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">
                    All Music Videos
                  </h2>
                  <p className="text-xs text-neutral-400 hidden sm:block">Original sound tracks, folk melodies, and live concert releases</p>
                </div>
              </div>
              <Link
                to="/category/all-music-video"
                className="text-xs font-semibold text-neutral-400 hover:text-[#F00018] flex items-center gap-1 transition-colors"
              >
                <span>View All Music</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {musicVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* 10. Hindi Natok Row */}
        {hindiNatoks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-red-500" />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">
                    Hindi Natok & Special Telefilms
                  </h2>
                </div>
              </div>
              <Link
                to="/category/hindi-natok"
                className="text-xs font-semibold text-neutral-400 hover:text-[#F00018] flex items-center gap-1 transition-colors"
              >
                <span>View All Hindi</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {hindiNatoks.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* 11. Footer Adsterra Banner */}
        <AdsterraPlacement 
          placementName="home_footer_banner" 
          fallbackText="Adsterra Responsive Footer Banner" 
        />
      </main>
    </div>
  );
};
