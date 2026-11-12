-- ====================================================================
-- JEY VID VISION - SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY
-- Platform: JEY VID VISION | "Your Entertainment. Your Vision."
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    banner_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBCATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category_id, slug)
);

-- 4. VIDEOS TABLE
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    content_type TEXT NOT NULL DEFAULT 'Drama / Natok' CHECK (content_type IN ('Drama / Natok', 'Music Video', 'Comedy Serial / Natok', 'Others')),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
    thumbnail_url TEXT NOT NULL,
    video_source TEXT NOT NULL DEFAULT 'youtube' CHECK (video_source IN ('youtube', 'google_drive', 'mega', 'direct_url', 'external_storage')),
    video_url TEXT NOT NULL,
    duration TEXT DEFAULT '00:00',
    featured BOOLEAN DEFAULT FALSE,
    trending BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    views_count INT DEFAULT 0,
    upload_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ADMIN PROFILES TABLE (Secure Owner Accounts)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'admin')),
    pin_hash TEXT, -- SHA-256 or bcrypt hash of security PIN
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WEBSITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website_name TEXT NOT NULL DEFAULT 'JEY VID VISION',
    tagline TEXT NOT NULL DEFAULT 'Your Entertainment. Your Vision.',
    logo_url TEXT DEFAULT '/logo.png',
    banner_url TEXT DEFAULT '/hero-banner.jpg',
    about_text TEXT DEFAULT 'JEY VID VISION is the premier cinematic entertainment streaming platform dedicated to delivering high-quality Bangla Natok, Hindi Natok, Pakistani Natok, Comedy, and Music Videos directly to your screens.',
    contact_email TEXT DEFAULT 'contact@jeyvidvision.com',
    social_links JSONB DEFAULT '{"facebook": "https://facebook.com", "youtube": "https://youtube.com", "whatsapp": "https://whatsapp.com", "instagram": "https://instagram.com"}'::jsonb,
    storage_provider JSONB DEFAULT '{"provider": "r2", "configured": false, "bucket_name": "", "endpoint": "", "public_url": ""}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ADVERTISEMENTS TABLE (Adsterra & Monetization Placements)
CREATE TABLE IF NOT EXISTS public.advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placement_name TEXT NOT NULL UNIQUE,
    placement_label TEXT NOT NULL,
    ad_type TEXT NOT NULL DEFAULT 'banner' CHECK (ad_type IN ('banner', 'native', 'popunder', 'social_bar', 'custom_html')),
    ad_code_reference TEXT,
    enabled BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, Admin write
CREATE POLICY "Public can view categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- Subcategories: Public read, Admin write
CREATE POLICY "Public can view subcategories" ON public.subcategories
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage subcategories" ON public.subcategories
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- Videos: Public can view published videos, Admin can view and manage all
CREATE POLICY "Public can view published videos" ON public.videos
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can view and manage all videos" ON public.videos
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- Website Settings: Public read, Admin write
CREATE POLICY "Public can view website settings" ON public.website_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage website settings" ON public.website_settings
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- Advertisements: Public read enabled ads, Admin can manage all
CREATE POLICY "Public can view active ads" ON public.advertisements
    FOR SELECT USING (enabled = true);

CREATE POLICY "Admins can manage advertisements" ON public.advertisements
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- Admin Profiles: Only authenticated users can read their own profile
CREATE POLICY "Users can view own admin profile" ON public.admin_profiles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own admin profile" ON public.admin_profiles
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid());

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON public.videos
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_website_settings_updated_at
    BEFORE UPDATE ON public.website_settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_advertisements_updated_at
    BEFORE UPDATE ON public.advertisements
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
