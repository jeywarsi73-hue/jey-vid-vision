# JEY VID VISION 🎬
> **Tagline:** *"Your Entertainment. Your Vision."*

**JEY VID VISION** is a premium, cinematic video streaming platform specifically architected for Bangla Natok, Hindi Natok, Pakistani Natok, Comedy Serials, and All Music Videos.

Built with **React 19**, **TypeScript**, **Tailwind CSS**, and powered by a high-performance **Supabase** backend and **Netlify** deployment readiness.

---

## 🌟 Key Platform Features

1. **Official Branding & Identity:**
   - Official *Jey Vid Vision Cinematic Logo* seamlessly embedded in header, footer, favicon, and admin portal.
   - Cinematic brand color scheme: Cinematic Red (`#F00018`), Obsidian Black (`#080808`), Dark Surface (`#111111`), White (`#FFFFFF`).
   - High-impact dynamic hero banner with custom movie studio lighting and immediate "WATCH NOW" trigger.

2. **The 6 Primary Entertainment Categories:**
   - 🇧🇩 **Bangla Natok** (Romantic, Family, Eid Specials)
   - 🇮🇳 **Hindi Natok** (Classic Serials, Short Telefilms)
   - 🇵🇰 **Pakistani Natok** (Acclaimed Hit Serials)
   - 🌍 **Others** (International Series & Telefilms)
   - 😂 **Comedy Serial / Natok** (Village Comedy, Humorous Sketches)
   - 🎵 **All Music Video** (Original Soundtracks, Folk, Pop & Concert Releases)

3. **Multi-Source Adaptive Video Streaming Engine:**
   - **YouTube:** Automatic video ID extraction and privacy-enhanced player embed (`youtube-nocookie.com`).
   - **Google Drive:** Instant conversion of authorized Google Drive share links into direct preview streams.
   - **MEGA Cloud Storage:** Seamless integration with MEGA embed previews and permission status feedback.
   - **Direct MP4 / WebM / HTML5 URLs:** Native high-performance HTML5 video playback.
   - **External Storage System:** Direct browser upload simulation to Cloudflare R2, Bunny Stream, or Amazon S3 with upload progress, retry, and cancellation.

4. **Private Owner-Only Admin Dashboard (`/admin`):**
   - Supabase Authentication (Email & Password).
   - Cryptographic 4-digit Security PIN verification gate (SHA-256 hashed).
   - Real-time statistics: Total Videos, Published, Drafts, Categories, Featured, and Trending counters.
   - **+ ADD NEW CONTENT** unified dynamic modal for Drama / Natok or Music Video.
   - Full Video Management: Edit, Delete with modal confirmation, Publish/Unpublish toggle, Featured toggle, Trending toggle.
   - Category & Subcategory manager (add, reorder, banner configuration, delete).
   - **Adsterra Monetization Suite:** 6 allowlisted placement slots (Home Top, Mid-Content, Footer, Watch Page Bottom, Sidebar, and Category Top).
   - Website Settings editor: customize site tagline, logo, banner image, about text, and social links.

5. **Social Sharing & Legal Compliance:**
   - 1-click sharing to WhatsApp, Facebook, Native Device Web Share API, and Copy Link with toast confirmation.
   - Comprehensive Legal Center: Terms of Use, Privacy Policy, Copyright Policy, and working interactive DMCA Content Removal Request form.

---

## 🚀 Supabase & Netlify সেটআপ গাইড (বাংলায়)

### ধাপ ১: Supabase ডাটাবেজ তৈরি করুন
1. [supabase.com](https://supabase.com)-এ ফ্রি অ্যাকাউন্ট খুলে **"New Project"** তৈরি করুন।
2. বাম পাশের মেনু থেকে **SQL Editor** খুলুন।
3. এই প্রজেক্টের `/supabase/schema.sql` এবং `/supabase/seed.sql` ফাইলের কোডগুলো পেস্ট করে **RUN** করুন। এতে সব টেবিল, RLS সিকিউরিটি ও প্রাথমিক ক্যাটাগরি তৈরি হয়ে যাবে।

### ধাপ ২: API কী (Key) সংগ্রহ করুন
1. Supabase প্রজেক্টের **Project Settings → API** অপশনে যান।
2. সেখান থেকে **Project URL** এবং **anon public key** কপি করুন।
3. অ্যাডমিন প্যানেলের **"সেটআপ গাইড"** ট্যাবে গিয়ে কী দুটি পেস্ট করে লাইভ কানেকশন টেস্ট করতে পারবেন।

### ধাপ ৩: GitHub থেকে Netlify-তে লাইভ পাবলিশ করুন
1. কোডটি আপনার **GitHub** রিপোজিটরিতে আপলোড করুন।
2. [netlify.com](https://netlify.com)-এ গিয়ে **"Add new site" → "Import an existing project" → GitHub** সিলেক্ট করুন।
3. সেটিংস অটোমেটিক থাকবে (`netlify.toml` ফাইলে বিল্ড কনফিগ করা আছে):
   - **Build Command:** `npm run build`
   - **Publish directory:** `dist`
4. **Environment Variables**-এ নিচের দুটি ভ্যারিয়েবল যোগ করুন:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. **Deploy site** বাটনে ক্লিক করলেই ওয়েবসাইটটি স্থায়ী পাবলিক লিঙ্কে লাইভ হয়ে যাবে!

---

## 📂 Project Structure

```
├── /public/
│   ├── /assets/aistudio/Jey_Vid_Vision_Cinematic_Logo_c6a37e17.png
│   ├── logo.png             # Official brand logo
│   ├── hero-banner.jpg      # Generated cinematic hero banner
│   ├── drama-thumb.jpg      # Generated drama poster
│   ├── music-thumb.jpg      # Generated music concert visual
│   └── comedy-thumb.jpg     # Generated comedy visual
├── /supabase/
│   ├── schema.sql           # Complete PostgreSQL schema & RLS policies
│   ├── seed.sql             # 6 primary categories, starter videos & ad slots
│   └── /functions/verify-admin-pin/index.ts
├── /src/
│   ├── /components/
│   │   ├── Header.tsx       # Official branding, search, navigation
│   │   ├── Footer.tsx       # Policies, contact, social links
│   │   ├── HeroBanner.tsx   # Cinematic focal banner with Watch Now
│   │   ├── VideoCard.tsx    # Unboxed metadata & hover zoom
│   │   ├── VideoPlayer.tsx  # YouTube, Drive, MEGA & Direct streaming adapter
│   │   ├── ShareModal.tsx   # WhatsApp, Facebook, Native Share & Copy link
│   │   └── AdsterraPlacement.tsx # Isolated ad container
│   ├── /context/
│   │   └── AuthContext.tsx  # Owner auth & PIN cryptographic verification
│   ├── /lib/
│   │   ├── supabase.ts      # Supabase client + resilient sync layer
│   │   └── videoSourceAdapter.ts # Multi-source streaming URL parser
│   ├── /pages/
│   │   ├── HomePage.tsx     # Homepage with all video rows & banners
│   │   ├── CategoryPage.tsx # Dedicated category views & filters
│   │   ├── WatchPage.tsx    # Main streaming watch page & related queue
│   │   ├── SearchPage.tsx   # Global search & filters
│   │   ├── LegalPage.tsx    # Terms, Privacy, Copyright & DMCA
│   │   └── /admin/
│   │       ├── AdminLogin.tsx     # Password & PIN security gate
│   │       └── AdminDashboard.tsx # Comprehensive owner dashboard
│   ├── App.tsx              # Router & layout wiring
│   └── index.css            # Tailwind CSS styling & brand variables
├── netlify.toml             # Netlify SPA routing & headers
├── package.json
└── README.md
```

---
*Crafted for JEY VID VISION — Your Entertainment. Your Vision.*
