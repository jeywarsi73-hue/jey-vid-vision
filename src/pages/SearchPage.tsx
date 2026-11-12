// JEY VID VISION - Global Search & Multi-Filter Engine
// Search by title, description, category, with dynamic sorting & content-type filters

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, X, Film } from 'lucide-react';
import { DataService } from '../lib/supabase';
import { Video, Category } from '../types';
import { VideoCard } from '../components/VideoCard';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'views'>('latest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      DataService.getVideos({ status: 'published' }),
      DataService.getCategories()
    ]).then(([vids, cats]) => {
      if (isMounted) {
        setAllVideos(vids);
        setCategories(cats);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  const filteredVideos = useMemo(() => {
    let list = [...allVideos];
    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter(v => 
        v.title.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        v.category_name?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter(v => v.category_id === selectedCategory);
    }

    if (selectedType !== 'all') {
      list = list.filter(v => v.content_type === selectedType);
    }

    if (sortBy === 'latest') {
      list.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime());
    } else if (sortBy === 'views') {
      list.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
    }

    return list;
  }, [allVideos, query, selectedCategory, selectedType, sortBy]);

  return (
    <div className="min-h-screen bg-[#080808] text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Search Header */}
        <div className="max-w-3xl mb-8">
          <span className="text-xs uppercase tracking-widest text-[#F00018] font-bold">Discover Content</span>
          <h1 className="text-3xl font-extrabold text-white font-display mt-1 mb-4">
            Search JEY VID VISION
          </h1>

          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, natok name, singer, actor, or genre..."
              className="w-full px-4 py-3 pl-11 pr-24 text-sm bg-[#121212] border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#F00018] shadow-lg"
            />
            <Search className="absolute left-4 w-4 h-4 text-neutral-400" />
            <button
              type="submit"
              className="absolute right-2 px-4 py-1.5 rounded-lg bg-[#F00018] text-white text-xs font-semibold hover:bg-[#d00015] transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-8 bg-[#111111] rounded-xl border border-neutral-900 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 focus:outline-none focus:border-[#F00018]"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 focus:outline-none focus:border-[#F00018]"
              >
                <option value="all">All Formats</option>
                <option value="Drama / Natok">Drama / Natok</option>
                <option value="Music Video">Music Video</option>
                <option value="Comedy Serial / Natok">Comedy</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          {/* Sort By & Results Count */}
          <div className="flex items-center gap-4">
            <span className="text-neutral-500 font-mono">
              {filteredVideos.length} {filteredVideos.length === 1 ? 'match' : 'matches'}
            </span>

            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 focus:outline-none focus:border-[#F00018]"
              >
                <option value="latest">Latest First</option>
                <option value="views">Most Views</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#0e0e0e] rounded-2xl border border-neutral-900 p-8">
            <Film className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">No matching videos</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-5">
              We couldn't find any videos matching your search criteria. Try using different keywords or resetting filters.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedCategory('all');
                setSelectedType('all');
                setSearchParams({});
              }}
              className="px-4 py-2 rounded-lg bg-[#F00018] text-white text-xs font-semibold hover:bg-[#d00015]"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
