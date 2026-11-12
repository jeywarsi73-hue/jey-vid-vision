// JEY VID VISION - Dedicated Category Page
// Filter by category slug, subcategory, search query, sorting, and pagination

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { DataService } from '../lib/supabase';
import { Video, Category } from '../types';
import { VideoCard } from '../components/VideoCard';
import { AdsterraPlacement } from '../components/AdsterraPlacement';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'trending' | 'views'>('latest');
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setSelectedSubcategory('all');
    setSearchFilter('');
    setVisibleCount(12);

    Promise.all([
      DataService.getCategories(),
      DataService.getVideos({ status: 'published' })
    ]).then(([allCats, allVids]) => {
      if (isMounted) {
        const found = allCats.find(c => c.slug === slug);
        setCategory(found || null);

        if (found) {
          const catVideos = allVids.filter(v => v.category_id === found.id);
          setVideos(catVideos);
        } else {
          setVideos([]);
        }
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [slug]);

  // Filtered and sorted videos
  const processedVideos = useMemo(() => {
    let result = [...videos];

    // Subcategory filter
    if (selectedSubcategory !== 'all') {
      result = result.filter(v => v.subcategory_id === selectedSubcategory);
    }

    // Keyword filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      result = result.filter(v => 
        v.title.toLowerCase().includes(q) || 
        v.description?.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime());
    } else if (sortBy === 'trending') {
      result.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    } else if (sortBy === 'views') {
      result.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
    }

    return result;
  }, [videos, selectedSubcategory, searchFilter, sortBy]);

  const displayedVideos = processedVideos.slice(0, visibleCount);
  const hasMore = visibleCount < processedVideos.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#F00018] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
        <p className="text-sm text-neutral-400 mb-6">The entertainment category you requested does not exist.</p>
        <Link to="/" className="px-5 py-2.5 rounded-lg bg-[#F00018] text-white text-sm font-semibold">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white pb-20">
      {/* 1. Category Header & Banner */}
      <div className="relative w-full py-16 md:py-20 bg-neutral-950 border-b border-neutral-900 overflow-hidden">
        {category.banner_url && (
          <div className="absolute inset-0 z-0 opacity-25">
            <img
              src={category.banner_url}
              alt={category.name}
              className="w-full h-full object-cover filter blur-xs"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/hero-banner.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest text-[#F00018] font-bold">Category Collection</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white font-display mt-1 mb-3">
              {category.name}
            </h1>
            <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
              {category.description || `Browse and stream the highest quality ${category.name} on JEY VID VISION.`}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* 2. Top Category Adsterra Banner */}
        <AdsterraPlacement 
          placementName="category_page_top" 
          fallbackText="Adsterra Category Leaderboard Unit" 
        />

        {/* 3. Filter & Sort Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#111111] p-4 rounded-xl border border-neutral-900">
          
          {/* Subcategory Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedSubcategory === 'all'
                  ? 'bg-[#F00018] text-white'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              All {category.name}
            </button>

            {category.subcategories?.map(sub => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedSubcategory === sub.id
                    ? 'bg-[#F00018] text-white'
                    : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          {/* Search within category & Sort controls */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-56">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter videos..."
                className="w-full px-3 py-1.5 pl-8 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#F00018]"
              />
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-neutral-500" />
            </div>

            <div className="relative flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#F00018]"
              >
                <option value="latest">Latest Uploads</option>
                <option value="trending">Trending First</option>
                <option value="views">Most Viewed</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Videos Grid */}
        {displayedVideos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {displayedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => setVisibleCount(prev => prev + 8)}
                  className="px-8 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-sm font-semibold text-neutral-200 hover:text-white transition-colors"
                >
                  Load More Videos ({processedVideos.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-[#0e0e0e] rounded-2xl border border-neutral-900 p-8">
            <h3 className="text-lg font-semibold text-white mb-2">No videos found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6">
              {searchFilter
                ? `No videos matched "${searchFilter}". Try adjusting your keywords.`
                : 'There are currently no videos uploaded in this category.'}
            </p>
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="px-4 py-2 rounded-lg bg-neutral-800 text-xs font-medium text-white hover:bg-neutral-700"
              >
                Clear Filter
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
