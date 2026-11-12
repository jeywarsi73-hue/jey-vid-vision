-- ====================================================================
-- JEY VID VISION - INITIAL SEED DATA
-- Preconfigures: 6 Primary Categories, Website Settings, Ad Slots, Initial Videos
-- ====================================================================

-- 1. SEED DEFAULT CATEGORIES
INSERT INTO public.categories (id, name, slug, description, banner_url, display_order)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Bangla Natok', 'bangla-natok', 'Watch trending, romantic, emotional and social drama productions from Bangladesh.', '/drama-thumb.jpg', 1),
    ('22222222-2222-2222-2222-222222222222', 'Hindi Natok', 'hindi-natok', 'Popular Hindi television drama series, short films and emotional serials.', '/drama-thumb.jpg', 2),
    ('33333333-3333-3333-3333-333333333333', 'Pakistani Natok', 'pakistani-natok', 'Critically acclaimed Pakistani romantic and family drama serials with gripping storylines.', '/drama-thumb.jpg', 3),
    ('44444444-4444-4444-4444-444444444444', 'Others', 'others', 'International web series, telefilms, documentaries, and exclusive entertainment.', '/hero-banner.jpg', 4),
    ('55555555-5555-5555-5555-555555555555', 'Comedy Serial / Natok', 'comedy-serial-natok', 'Hilarious comedy sketches, laughter serials, and feel-good humorous natoks.', '/comedy-thumb.jpg', 5),
    ('66666666-6666-6666-6666-666666666666', 'All Music Video', 'all-music-video', 'Original soundtracks, trending pop music videos, acoustic live sessions, and music albums.', '/music-thumb.jpg', 6)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED SUBCATEGORIES
INSERT INTO public.subcategories (category_id, name, slug)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Romantic Drama', 'romantic-drama'),
    ('11111111-1111-1111-1111-111111111111', 'Family Emotional', 'family-emotional'),
    ('11111111-1111-1111-1111-111111111111', 'Eid Special', 'eid-special'),
    ('22222222-2222-2222-2222-222222222222', 'Classic Serials', 'classic-serials'),
    ('33333333-3333-3333-3333-333333333333', 'Hit Dramas', 'hit-dramas'),
    ('55555555-5555-5555-5555-555555555555', 'Village Comedy', 'village-comedy'),
    ('66666666-6666-6666-6666-666666666666', 'Bengali Folk & Modern', 'bengali-folk-modern')
ON CONFLICT DO NOTHING;

-- 3. SEED WEBSITE SETTINGS
INSERT INTO public.website_settings (id, website_name, tagline, logo_url, banner_url, about_text, contact_email, social_links)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
     'JEY VID VISION',
     'Your Entertainment. Your Vision.',
     '/logo.png',
     '/hero-banner.jpg',
     'JEY VID VISION is an elite cinematic video streaming platform presenting the finest Bangla Natok, Hindi Drama, Pakistani Serials, Comedy Natok, and electrifying Music Videos. Crafted for cinema lovers with smooth high-definition playback.',
     'contact@jeyvidvision.com',
     '{"facebook": "https://facebook.com/jeyvidvision", "youtube": "https://youtube.com/@jeyvidvision", "whatsapp": "https://whatsapp.com", "instagram": "https://instagram.com"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED ADSTERRA ADVERTISEMENT SLOTS
INSERT INTO public.advertisements (placement_name, placement_label, ad_type, ad_code_reference, enabled, display_order)
VALUES
    ('home_top_banner', 'Homepage Top Banner (728x90 / Responsive)', 'banner', '<!-- Adsterra 728x90 Banner -->', false, 1),
    ('home_middle_banner', 'Homepage Between Video Sections', 'banner', '<!-- Adsterra Mid Content Banner -->', false, 2),
    ('home_footer_banner', 'Homepage Footer Placement', 'banner', '<!-- Adsterra Footer Unit -->', false, 3),
    ('watch_player_bottom', 'Video Watch Page (Below Player)', 'banner', '<!-- Adsterra Watch Page Banner -->', false, 4),
    ('watch_sidebar', 'Video Page Sidebar', 'native', '<!-- Adsterra Sidebar Widget -->', false, 5),
    ('category_page_top', 'Category Pages Header Banner', 'banner', '<!-- Adsterra Category Top Banner -->', false, 6)
ON CONFLICT (placement_name) DO NOTHING;

-- 5. SEED INITIAL FEATURED & TRENDING VIDEOS
INSERT INTO public.videos (title, slug, description, content_type, category_id, thumbnail_url, video_source, video_url, duration, featured, trending, status, views_count)
VALUES
    ('Buker Ba Pshe | বুকের বা পাশে | Bangla Romantic Natok 2026', 'buker-ba-pshe-bangla-romantic-natok', 'A heartwarming tale of love, misunderstandings and reconciliation in modern Dhaka. Starring top popular cast with an unforgettable soundtrack.', 'Drama / Natok', '11111111-1111-1111-1111-111111111111', '/drama-thumb.jpg', 'youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '42:15', true, true, 'published', 15420),
    ('Prem Ekta Odrishyo Maya | প্রেম একটা অদৃশ্য মায়া', 'prem-ekta-odrishyo-maya', 'Cinematic Eid Special Bangla Natok depicting deep affection, youthful sacrifices, and poetic emotions.', 'Drama / Natok', '11111111-1111-1111-1111-111111111111', '/drama-thumb.jpg', 'youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '38:40', false, true, 'published', 9340),
    ('Dil Ke Rishtey | दिल के रिश्ते | Hindi Special Telefilm', 'dil-ke-rishtey-hindi-special-telefilm', 'An emotional story centered around family bonds, traditions, and breaking modern stereotypes.', 'Drama / Natok', '22222222-2222-2222-2222-222222222222', '/drama-thumb.jpg', 'youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '48:10', true, false, 'published', 21300),
    ('Ishq e Junoon | عشق جنون | Pakistani Drama Episode 01', 'ishq-e-junoon-pakistani-drama', 'High intensity Pakistani serial with dramatic plot twists, lavish sets, and powerhouse acting performances.', 'Drama / Natok', '33333333-3333-3333-3333-333333333333', '/drama-thumb.jpg', 'youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '35:22', true, true, 'published', 45100),
    ('Gramer Hashir Raja | গ্রামের হাসির রাজা | Non-Stop Comedy Natok', 'gramer-hashir-raja-comedy-natok', 'Unstoppable village comedy drama full of pure laughs, witty arguments, and lively regional humor.', 'Comedy Serial / Natok', '55555555-5555-5555-5555-555555555555', '/comedy-thumb.jpg', 'youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '29:50', true, true, 'published', 32050),
    ('Meghe Meghe Bela | মেঘে মেঘে বেলা | Official 4K Music Video', 'meghe-meghe-bela-official-4k-music-video', 'Soulful romantic melody featuring mesmerizing cinematography, acoustic guitars, and serene countryside scenery.', 'Music Video', '66666666-6666-6666-6666-666666666666', '/music-thumb.jpg', 'youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '04:35', true, true, 'published', 88400),
    ('Shunyo Hridoy | শূন্য হৃদয় | Rock Ballad Video Song', 'shunyo-hridoy-rock-ballad-song', 'Electrifying rock ballad with punchy drum beats, powerful vocals, and dramatic live concert visuals.', 'Music Video', '66666666-6666-6666-6666-666666666666', '/music-thumb.jpg', 'youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '05:12', false, true, 'published', 19800),
    ('Cinematic Horizons | Journey of Visual Art', 'cinematic-horizons-journey-of-visual-art', 'An international documentary celebrating visual storytelling, cinematography, and directors vision.', 'Others', '44444444-4444-4444-4444-444444444444', '/hero-banner.jpg', 'direct_url', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '09:56', false, false, 'published', 6200)
ON CONFLICT (slug) DO NOTHING;
