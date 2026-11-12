// JEY VID VISION - Supabase Client & Universal Data Persistence Engine
// Provides full live Supabase connectivity with resilient local synchronization

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Video, 
  VideoStatus,
  Category, 
  Subcategory, 
  WebsiteSettings, 
  Advertisement, 
  AdminProfile, 
  DashboardStats 
} from '../types';

// Read environment variables or custom runtime storage
const getEnvSupabase = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem('jey_custom_supabase_url');
  const localKey = localStorage.getItem('jey_custom_supabase_key');

  const url = (localUrl || envUrl || '').trim();
  const key = (localKey || envKey || '').trim();

  const isConfigured = Boolean(
    url && 
    key && 
    url.startsWith('https://') && 
    !url.includes('your-project-id') && 
    !key.includes('your-anon-public-key')
  );

  return { url, key, isConfigured };
};

const envConfig = getEnvSupabase();

export let supabase: SupabaseClient | null = envConfig.isConfigured
  ? createClient(envConfig.url, envConfig.key)
  : null;

export function reinitSupabase(url: string, key: string) {
  if (url && key) {
    localStorage.setItem('jey_custom_supabase_url', url.trim());
    localStorage.setItem('jey_custom_supabase_key', key.trim());
    supabase = createClient(url.trim(), key.trim());
    return true;
  }
  return false;
}

export function isSupabaseConnected(): boolean {
  return Boolean(supabase && getEnvSupabase().isConfigured);
}

// -------------------------------------------------------------
// DEFAULT DATA ARCHITECTURE (6 MANDATORY CATEGORIES & STARTERS)
// -------------------------------------------------------------

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Bangla Natok',
    slug: 'bangla-natok',
    description: 'Trending, romantic, emotional and social drama productions from Bangladesh.',
    banner_url: '/drama-thumb.jpg',
    display_order: 1,
    subcategories: [
      { id: 'sub-1', category_id: '11111111-1111-1111-1111-111111111111', name: 'Romantic Drama', slug: 'romantic-drama' },
      { id: 'sub-2', category_id: '11111111-1111-1111-1111-111111111111', name: 'Family Emotional', slug: 'family-emotional' },
      { id: 'sub-3', category_id: '11111111-1111-1111-1111-111111111111', name: 'Eid Special', slug: 'eid-special' }
    ]
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Hindi Natok',
    slug: 'hindi-natok',
    description: 'Popular Hindi television drama series, short films and emotional serials.',
    banner_url: '/drama-thumb.jpg',
    display_order: 2,
    subcategories: [
      { id: 'sub-4', category_id: '22222222-2222-2222-2222-222222222222', name: 'Classic Serials', slug: 'classic-serials' },
      { id: 'sub-5', category_id: '22222222-2222-2222-2222-222222222222', name: 'Modern Drama', slug: 'modern-drama' }
    ]
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Pakistani Natok',
    slug: 'pakistani-natok',
    description: 'Critically acclaimed Pakistani romantic and family drama serials with gripping storylines.',
    banner_url: '/drama-thumb.jpg',
    display_order: 3,
    subcategories: [
      { id: 'sub-6', category_id: '33333333-3333-3333-3333-333333333333', name: 'Hit Serials', slug: 'hit-serials' }
    ]
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Others',
    slug: 'others',
    description: 'International web series, telefilms, documentaries, and exclusive entertainment.',
    banner_url: '/hero-banner.jpg',
    display_order: 4,
    subcategories: [
      { id: 'sub-7', category_id: '44444444-4444-4444-4444-444444444444', name: 'Telefilms', slug: 'telefilms' }
    ]
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Comedy Serial / Natok',
    slug: 'comedy-serial-natok',
    description: 'Hilarious comedy sketches, laughter serials, and feel-good humorous natoks.',
    banner_url: '/comedy-thumb.jpg',
    display_order: 5,
    subcategories: [
      { id: 'sub-8', category_id: '55555555-5555-5555-5555-555555555555', name: 'Village Comedy', slug: 'village-comedy' },
      { id: 'sub-9', category_id: '55555555-5555-5555-5555-555555555555', name: 'Standup & Sketches', slug: 'standup-sketches' }
    ]
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: 'All Music Video',
    slug: 'all-music-video',
    description: 'Original soundtracks, trending pop music videos, acoustic live sessions, and music albums.',
    banner_url: '/music-thumb.jpg',
    display_order: 6,
    subcategories: [
      { id: 'sub-10', category_id: '66666666-6666-6666-6666-666666666666', name: 'Folk & Acoustic', slug: 'folk-acoustic' },
      { id: 'sub-11', category_id: '66666666-6666-6666-6666-666666666666', name: 'Rock & Pop', slug: 'rock-pop' }
    ]
  }
];

export const DEFAULT_SETTINGS: WebsiteSettings = {
  website_name: 'JEY VID VISION',
  tagline: 'Your Entertainment. Your Vision.',
  logo_url: '/logo.png',
  banner_url: '/hero-banner.jpg',
  about_text: 'JEY VID VISION is an elite cinematic entertainment streaming platform presenting the finest Bangla Natok, Hindi Drama, Pakistani Serials, Comedy Natok, and electrifying Music Videos. Crafted for cinema lovers with smooth high-definition playback.',
  contact_email: 'contact@jeyvidvision.com',
  social_links: {
    facebook: 'https://facebook.com/jeyvidvision',
    youtube: 'https://youtube.com/@jeyvidvision',
    whatsapp: 'https://whatsapp.com',
    instagram: 'https://instagram.com/jeyvidvision'
  },
  storage_provider: {
    provider: 'r2',
    configured: false,
    bucket_name: 'jey-vid-storage',
    endpoint: 'https://<account-id>.r2.cloudflarestorage.com',
    public_url: 'https://media.jeyvidvision.com'
  }
};

export const DEFAULT_ADVERTISEMENTS: Advertisement[] = [
  {
    id: 'ad-1',
    placement_name: 'home_top_banner',
    placement_label: 'Homepage Top Banner (728x90 / Responsive)',
    ad_type: 'banner',
    ad_code_reference: `<!-- Adsterra 728x90 Banner -->\n<div style="width:100%;min-height:90px;background:#141414;border:1px dashed #333;display:flex;align-items:center;justify-content:center;color:#666;font-size:12px;">\n  [Adsterra Leaderboard 728x90 - Safe Allowlisted Container]\n</div>`,
    enabled: true,
    display_order: 1
  },
  {
    id: 'ad-2',
    placement_name: 'home_middle_banner',
    placement_label: 'Homepage Between Video Sections',
    ad_type: 'banner',
    ad_code_reference: `<!-- Adsterra Mid Content Banner -->\n<div style="width:100%;min-height:90px;background:#141414;border:1px dashed #333;display:flex;align-items:center;justify-content:center;color:#666;font-size:12px;">\n  [Adsterra Native / Banner - Between Sections]\n</div>`,
    enabled: true,
    display_order: 2
  },
  {
    id: 'ad-3',
    placement_name: 'home_footer_banner',
    placement_label: 'Homepage Footer Placement',
    ad_type: 'banner',
    ad_code_reference: `<!-- Adsterra Footer Unit -->`,
    enabled: false,
    display_order: 3
  },
  {
    id: 'ad-4',
    placement_name: 'watch_player_bottom',
    placement_label: 'Video Watch Page (Below Player)',
    ad_type: 'banner',
    ad_code_reference: `<!-- Adsterra Watch Page Banner -->\n<div style="width:100%;min-height:90px;background:#141414;border:1px dashed #333;display:flex;align-items:center;justify-content:center;color:#666;font-size:12px;">\n  [Adsterra Sponsored Unit - Watch Page Below Player]\n</div>`,
    enabled: true,
    display_order: 4
  },
  {
    id: 'ad-5',
    placement_name: 'watch_sidebar',
    placement_label: 'Video Page Sidebar',
    ad_type: 'native',
    ad_code_reference: `<!-- Adsterra Sidebar Widget -->\n<div style="width:100%;min-height:250px;background:#141414;border:1px dashed #333;display:flex;align-items:center;justify-content:center;color:#666;font-size:12px;">\n  [Adsterra 300x250 Sidebar Display Unit]\n</div>`,
    enabled: true,
    display_order: 5
  },
  {
    id: 'ad-6',
    placement_name: 'category_page_top',
    placement_label: 'Category Pages Header Banner',
    ad_type: 'banner',
    ad_code_reference: `<!-- Adsterra Category Top Banner -->`,
    enabled: false,
    display_order: 6
  }
];

export const DEFAULT_VIDEOS: Video[] = [
  {
    id: 'vid-1',
    title: 'Buker Ba Pshe | বুকের বা পাশে | Bangla Romantic Natok 2026',
    slug: 'buker-ba-pshe-bangla-romantic-natok-2026',
    description: 'A deeply moving story of love, misunderstandings and emotional reconciliation set in Dhaka. Starring top Bangladeshi performers with an unforgettable cinematic background score and heartfelt dialogues.',
    content_type: 'Drama / Natok',
    category_id: '11111111-1111-1111-1111-111111111111',
    category_name: 'Bangla Natok',
    subcategory_id: 'sub-1',
    subcategory_name: 'Romantic Drama',
    thumbnail_url: '/drama-thumb.jpg',
    video_source: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '42:15',
    featured: true,
    trending: true,
    status: 'published',
    views_count: 35420,
    upload_date: new Date(Date.now() - 86400000 * 2).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'vid-2',
    title: 'Prem Ekta Odrishyo Maya | প্রেম একটা অদৃশ্য মায়া | Eid Special Natok',
    slug: 'prem-ekta-odrishyo-maya-eid-special',
    description: 'Cinematic Eid Special Bangla Natok depicting deep affection, youthful sacrifices, and poetic emotions. A must watch drama for family and loved ones.',
    content_type: 'Drama / Natok',
    category_id: '11111111-1111-1111-1111-111111111111',
    category_name: 'Bangla Natok',
    subcategory_id: 'sub-3',
    subcategory_name: 'Eid Special',
    thumbnail_url: '/drama-thumb.jpg',
    video_source: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '38:40',
    featured: false,
    trending: true,
    status: 'published',
    views_count: 18940,
    upload_date: new Date(Date.now() - 86400000 * 3).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'vid-3',
    title: 'Dil Ke Rishtey | दिल के रिश्ते | Hindi Special Telefilm',
    slug: 'dil-ke-rishtey-hindi-special-telefilm',
    description: 'An emotional Hindi drama centered around family bonds, traditions, and breaking modern stereotypes. Stunning cinematography and powerful acting.',
    content_type: 'Drama / Natok',
    category_id: '22222222-2222-2222-2222-222222222222',
    category_name: 'Hindi Natok',
    subcategory_id: 'sub-4',
    subcategory_name: 'Classic Serials',
    thumbnail_url: '/drama-thumb.jpg',
    video_source: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '48:10',
    featured: true,
    trending: false,
    status: 'published',
    views_count: 24300,
    upload_date: new Date(Date.now() - 86400000 * 5).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'vid-4',
    title: 'Ishq e Junoon | عشق جنون | Pakistani Drama Episode 01',
    slug: 'ishq-e-junoon-pakistani-drama-ep01',
    description: 'High intensity Pakistani drama serial with dramatic plot twists, lavish sets, and powerhouse acting performances that will keep you glued to the screen.',
    content_type: 'Drama / Natok',
    category_id: '33333333-3333-3333-3333-333333333333',
    category_name: 'Pakistani Natok',
    subcategory_id: 'sub-6',
    subcategory_name: 'Hit Serials',
    thumbnail_url: '/drama-thumb.jpg',
    video_source: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '35:22',
    featured: true,
    trending: true,
    status: 'published',
    views_count: 48900,
    upload_date: new Date(Date.now() - 86400000 * 1).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'vid-5',
    title: 'Gramer Hashir Raja | গ্রামের হাসির রাজা | Non-Stop Comedy Natok',
    slug: 'gramer-hashir-raja-non-stop-comedy-natok',
    description: 'Unstoppable village comedy drama full of pure laughs, witty arguments, and lively regional humor. Perfect for relaxation and laughter with family.',
    content_type: 'Comedy Serial / Natok',
    category_id: '55555555-5555-5555-5555-555555555555',
    category_name: 'Comedy Serial / Natok',
    subcategory_id: 'sub-8',
    subcategory_name: 'Village Comedy',
    thumbnail_url: '/comedy-thumb.jpg',
    video_source: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '29:50',
    featured: true,
    trending: true,
    status: 'published',
    views_count: 52100,
    upload_date: new Date(Date.now() - 86400000 * 4).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'vid-6',
    title: 'Meghe Meghe Bela | মেঘে মেঘে বেলা | Official 4K Music Video',
    slug: 'meghe-meghe-bela-official-4k-music-video',
    description: 'Soulful romantic melody featuring mesmerizing 4K cinematography, acoustic guitar arrangement, and serene countryside scenery. High fidelity audio experience.',
    content_type: 'Music Video',
    category_id: '66666666-6666-6666-6666-666666666666',
    category_name: 'All Music Video',
    subcategory_id: 'sub-10',
    subcategory_name: 'Folk & Acoustic',
    thumbnail_url: '/music-thumb.jpg',
    video_source: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '04:35',
    featured: true,
    trending: true,
    status: 'published',
    views_count: 98400,
    upload_date: new Date(Date.now() - 86400000 * 6).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: 'vid-7',
    title: 'Shunyo Hridoy | শূন্য হৃদয় | Live Concert Rock Ballad',
    slug: 'shunyo-hridoy-live-concert-rock-ballad',
    description: 'Electrifying rock ballad with punchy drum beats, powerful vocals, and dramatic live concert stage visuals with atmospheric crimson lighting.',
    content_type: 'Music Video',
    category_id: '66666666-6666-6666-6666-666666666666',
    category_name: 'All Music Video',
    subcategory_id: 'sub-11',
    subcategory_name: 'Rock & Pop',
    thumbnail_url: '/music-thumb.jpg',
    video_source: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '05:12',
    featured: false,
    trending: true,
    status: 'published',
    views_count: 27800,
    upload_date: new Date(Date.now() - 86400000 * 7).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 'vid-8',
    title: 'Cinematic Horizons | Journey of Visual Art & Directing',
    slug: 'cinematic-horizons-journey-of-visual-art-and-directing',
    description: 'An international documentary celebrating visual storytelling, camera artistry, and directors vision. Streamed in full direct video format.',
    content_type: 'Others',
    category_id: '44444444-4444-4444-4444-444444444444',
    category_name: 'Others',
    subcategory_id: 'sub-7',
    subcategory_name: 'Telefilms',
    thumbnail_url: '/hero-banner.jpg',
    video_source: 'direct_url',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '09:56',
    featured: false,
    trending: false,
    status: 'published',
    views_count: 8400,
    upload_date: new Date(Date.now() - 86400000 * 8).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 8).toISOString()
  }
];

// Helper to hash PIN with SHA-256
export async function hashSecurityPin(pin: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(pin.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// -------------------------------------------------------------
// UNIFIED DATA ACCESS SERVICES (WITH REAL SUPABASE + LOCAL SYNC)
// -------------------------------------------------------------

export const DataService = {
  // --- VIDEOS ---
  async getVideos(params?: {
    categorySlug?: string;
    categoryId?: string;
    contentType?: string;
    search?: string;
    featured?: boolean;
    trending?: boolean;
    status?: VideoStatus;
    limit?: number;
  }): Promise<Video[]> {
    if (isSupabaseConnected() && supabase) {
      try {
        let query = supabase.from('videos').select('*, categories(name, slug)');
        if (params?.status) query = query.eq('status', params.status);
        else query = query.eq('status', 'published');

        if (params?.categoryId) query = query.eq('category_id', params.categoryId);
        if (params?.contentType) query = query.eq('content_type', params.contentType);
        if (params?.featured !== undefined) query = query.eq('featured', params.featured);
        if (params?.trending !== undefined) query = query.eq('trending', params.trending);
        if (params?.search) query = query.ilike('title', `%${params.search}%`);
        if (params?.limit) query = query.limit(params.limit);

        query = query.order('upload_date', { ascending: false });

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((v: any) => ({
            ...v,
            category_name: v.categories?.name || 'Entertainment',
          }));
        }
      } catch (err) {
        console.warn('Supabase query fallback to local cache:', err);
      }
    }

    // Local Persistence Fallback
    const stored = localStorage.getItem('jey_videos');
    let list: Video[] = stored ? JSON.parse(stored) : DEFAULT_VIDEOS;

    if (params?.status) {
      list = list.filter(v => v.status === params.status);
    } else {
      list = list.filter(v => v.status === 'published');
    }

    if (params?.categorySlug) {
      const cats = await this.getCategories();
      const targetCat = cats.find(c => c.slug === params.categorySlug);
      if (targetCat) {
        list = list.filter(v => v.category_id === targetCat.id);
      }
    }

    if (params?.categoryId) {
      list = list.filter(v => v.category_id === params.categoryId);
    }

    if (params?.contentType) {
      list = list.filter(v => v.content_type === params.contentType);
    }

    if (params?.featured !== undefined) {
      list = list.filter(v => v.featured === params.featured);
    }

    if (params?.trending !== undefined) {
      list = list.filter(v => v.trending === params.trending);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(v => 
        v.title.toLowerCase().includes(q) || 
        v.description?.toLowerCase().includes(q) ||
        v.category_name?.toLowerCase().includes(q)
      );
    }

    if (params?.limit) {
      list = list.slice(0, params.limit);
    }

    return list;
  },

  async getAllVideosAdmin(): Promise<Video[]> {
    if (isSupabaseConnected() && supabase) {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*, categories(name, slug)')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((v: any) => ({
            ...v,
            category_name: v.categories?.name,
          }));
        }
      } catch (err) {
        console.warn('Supabase admin videos error:', err);
      }
    }

    const stored = localStorage.getItem('jey_videos');
    return stored ? JSON.parse(stored) : DEFAULT_VIDEOS;
  },

  async getVideoBySlugOrId(identifier: string): Promise<Video | null> {
    if (isSupabaseConnected() && supabase) {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*, categories(name, slug)')
          .or(`slug.eq.${identifier},id.eq.${identifier}`)
          .maybeSingle();

        if (!error && data) {
          return {
            ...data,
            category_name: data.categories?.name || 'Entertainment',
          };
        }
      } catch (err) {
        console.warn('Supabase getVideo error:', err);
      }
    }

    const all = await this.getAllVideosAdmin();
    return all.find(v => v.slug === identifier || v.id === identifier) || null;
  },

  async saveVideo(videoData: Partial<Video>): Promise<Video> {
    const isNew = !videoData.id;
    const cats = await this.getCategories();
    const cat = cats.find(c => c.id === videoData.category_id);

    const video: Video = {
      id: videoData.id || `vid-${Date.now()}`,
      title: videoData.title || 'Untitled Video',
      slug: videoData.slug || `video-${Date.now()}`,
      description: videoData.description || '',
      content_type: videoData.content_type || 'Drama / Natok',
      category_id: videoData.category_id || cats[0]?.id || '11111111-1111-1111-1111-111111111111',
      category_name: cat?.name || 'Entertainment',
      subcategory_id: videoData.subcategory_id || null,
      thumbnail_url: videoData.thumbnail_url || '/drama-thumb.jpg',
      video_source: videoData.video_source || 'youtube',
      video_url: videoData.video_url || '',
      duration: videoData.duration || '00:00',
      featured: Boolean(videoData.featured),
      trending: Boolean(videoData.trending),
      status: videoData.status || 'published',
      views_count: videoData.views_count || 0,
      upload_date: videoData.upload_date || new Date().toISOString(),
      created_at: videoData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConnected() && supabase) {
      try {
        const dbPayload = {
          title: video.title,
          slug: video.slug,
          description: video.description,
          content_type: video.content_type,
          category_id: video.category_id,
          subcategory_id: video.subcategory_id,
          thumbnail_url: video.thumbnail_url,
          video_source: video.video_source,
          video_url: video.video_url,
          duration: video.duration,
          featured: video.featured,
          trending: video.trending,
          status: video.status,
          views_count: video.views_count,
        };

        if (isNew) {
          const { data, error } = await supabase.from('videos').insert(dbPayload).select().single();
          if (!error && data) return { ...video, id: data.id };
        } else {
          await supabase.from('videos').update(dbPayload).eq('id', video.id);
        }
      } catch (err) {
        console.warn('Supabase save error, persisting locally:', err);
      }
    }

    // Local sync
    const stored = localStorage.getItem('jey_videos');
    let list: Video[] = stored ? JSON.parse(stored) : DEFAULT_VIDEOS;
    if (isNew) {
      list = [video, ...list];
    } else {
      list = list.map(v => v.id === video.id ? video : v);
    }
    localStorage.setItem('jey_videos', JSON.stringify(list));
    return video;
  },

  async deleteVideo(id: string): Promise<boolean> {
    if (isSupabaseConnected() && supabase) {
      try {
        await supabase.from('videos').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    const stored = localStorage.getItem('jey_videos');
    let list: Video[] = stored ? JSON.parse(stored) : DEFAULT_VIDEOS;
    list = list.filter(v => v.id !== id);
    localStorage.setItem('jey_videos', JSON.stringify(list));
    return true;
  },

  async incrementViews(id: string): Promise<void> {
    const stored = localStorage.getItem('jey_videos');
    if (stored) {
      const list: Video[] = JSON.parse(stored);
      const target = list.find(v => v.id === id);
      if (target) {
        target.views_count = (target.views_count || 0) + 1;
        localStorage.setItem('jey_videos', JSON.stringify(list));
      }
    }
    if (isSupabaseConnected() && supabase) {
      try {
        await supabase.rpc('increment_video_views', { video_id: id });
      } catch {
        // RPC optional
      }
    }
  },

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConnected() && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*, subcategories(*)')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase categories error:', err);
      }
    }

    const stored = localStorage.getItem('jey_categories');
    return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
  },

  async saveCategory(category: Partial<Category>): Promise<Category> {
    const cats = await this.getCategories();
    const isNew = !category.id;
    const cat: Category = {
      id: category.id || `cat-${Date.now()}`,
      name: category.name || 'New Category',
      slug: category.slug || `category-${Date.now()}`,
      description: category.description || '',
      banner_url: category.banner_url || '/drama-thumb.jpg',
      display_order: category.display_order ?? cats.length + 1,
      subcategories: category.subcategories || []
    };

    if (isSupabaseConnected() && supabase) {
      try {
        if (isNew) {
          await supabase.from('categories').insert({
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            banner_url: cat.banner_url,
            display_order: cat.display_order
          });
        } else {
          await supabase.from('categories').update({
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            banner_url: cat.banner_url,
            display_order: cat.display_order
          }).eq('id', cat.id);
        }
      } catch (err) {
        console.warn('Supabase saveCategory error:', err);
      }
    }

    let updatedList: Category[];
    if (isNew) {
      updatedList = [...cats, cat];
    } else {
      updatedList = cats.map(c => c.id === cat.id ? cat : c);
    }
    localStorage.setItem('jey_categories', JSON.stringify(updatedList));
    return cat;
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (isSupabaseConnected() && supabase) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete category error:', err);
      }
    }

    const cats = await this.getCategories();
    const updated = cats.filter(c => c.id !== id);
    localStorage.setItem('jey_categories', JSON.stringify(updated));
    return true;
  },

  // --- WEBSITE SETTINGS ---
  async getSettings(): Promise<WebsiteSettings> {
    if (isSupabaseConnected() && supabase) {
      try {
        const { data, error } = await supabase
          .from('website_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          return {
            ...DEFAULT_SETTINGS,
            ...data,
            storage_provider: data.storage_provider || DEFAULT_SETTINGS.storage_provider
          };
        }
      } catch (err) {
        console.warn('Supabase settings error:', err);
      }
    }

    const stored = localStorage.getItem('jey_website_settings');
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  },

  async updateSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    const current = await this.getSettings();
    const updated: WebsiteSettings = {
      ...current,
      ...settings,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConnected() && supabase) {
      try {
        await supabase
          .from('website_settings')
          .upsert({
            website_name: updated.website_name,
            tagline: updated.tagline,
            logo_url: updated.logo_url,
            banner_url: updated.banner_url,
            about_text: updated.about_text,
            contact_email: updated.contact_email,
            social_links: updated.social_links,
            storage_provider: updated.storage_provider
          });
      } catch (err) {
        console.warn('Supabase updateSettings error:', err);
      }
    }

    localStorage.setItem('jey_website_settings', JSON.stringify(updated));
    return updated;
  },

  // --- ADVERTISEMENTS ---
  async getAdvertisements(): Promise<Advertisement[]> {
    if (isSupabaseConnected() && supabase) {
      try {
        const { data, error } = await supabase
          .from('advertisements')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase ads error:', err);
      }
    }

    const stored = localStorage.getItem('jey_advertisements');
    return stored ? JSON.parse(stored) : DEFAULT_ADVERTISEMENTS;
  },

  async updateAdvertisement(ad: Partial<Advertisement> & { id: string }): Promise<Advertisement[]> {
    const ads = await this.getAdvertisements();
    const updated = ads.map(item => item.id === ad.id ? { ...item, ...ad, updated_at: new Date().toISOString() } : item);

    if (isSupabaseConnected() && supabase) {
      try {
        await supabase
          .from('advertisements')
          .update({
            enabled: ad.enabled,
            ad_code_reference: ad.ad_code_reference,
            ad_type: ad.ad_type
          })
          .eq('id', ad.id);
      } catch (err) {
        console.warn('Supabase updateAd error:', err);
      }
    }

    localStorage.setItem('jey_advertisements', JSON.stringify(updated));
    return updated;
  },

  // --- DASHBOARD STATS ---
  async getDashboardStats(): Promise<DashboardStats> {
    const videos = await this.getAllVideosAdmin();
    const categories = await this.getCategories();

    return {
      totalVideos: videos.length,
      publishedVideos: videos.filter(v => v.status === 'published').length,
      draftVideos: videos.filter(v => v.status === 'draft').length,
      totalCategories: categories.length,
      featuredVideos: videos.filter(v => v.featured).length,
      trendingVideos: videos.filter(v => v.trending).length
    };
  }
};
