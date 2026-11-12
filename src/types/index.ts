// Type definitions for JEY VID VISION

export type ContentType = 'Drama / Natok' | 'Music Video' | 'Comedy Serial / Natok' | 'Others';

export type VideoSourceType = 'youtube' | 'google_drive' | 'mega' | 'direct_url' | 'external_storage';

export type VideoStatus = 'published' | 'draft' | 'archived';

export interface Video {
  id: string;
  title: string;
  slug: string;
  description: string;
  content_type: ContentType;
  category_id: string;
  category_name?: string;
  subcategory_id?: string | null;
  subcategory_name?: string;
  thumbnail_url: string;
  video_source: VideoSourceType;
  video_url: string;
  duration?: string;
  featured: boolean;
  trending: boolean;
  status: VideoStatus;
  views_count: number;
  upload_date: string;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  banner_url?: string;
  display_order: number;
  created_at?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface WebsiteSettings {
  id?: string;
  website_name: string;
  tagline: string;
  logo_url: string;
  banner_url: string;
  about_text: string;
  contact_email: string;
  social_links: {
    facebook?: string;
    youtube?: string;
    whatsapp?: string;
    instagram?: string;
    twitter?: string;
  };
  storage_provider?: StorageProviderConfig;
  updated_at?: string;
}

export interface StorageProviderConfig {
  provider: 'r2' | 'bunny' | 's3' | 'google_drive' | 'mega';
  configured: boolean;
  bucket_name?: string;
  endpoint?: string;
  public_url?: string;
  api_key_configured?: boolean;
}

export interface Advertisement {
  id: string;
  placement_name: string;
  placement_label: string;
  ad_type: 'banner' | 'native' | 'popunder' | 'social_bar' | 'custom_html';
  ad_code_reference: string;
  enabled: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface AdminProfile {
  id: string;
  user_id: string;
  email: string;
  role: 'owner' | 'admin';
  pin_hash?: string;
  created_at?: string;
}

export interface DashboardStats {
  totalVideos: number;
  publishedVideos: number;
  draftVideos: number;
  totalCategories: number;
  featuredVideos: number;
  trendingVideos: number;
}
