// JEY VID VISION - Footer Component
// Features official branding, social media links, copyright notice and legal information

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataService } from '../lib/supabase';
import { WebsiteSettings } from '../types';
import { ShieldAlert, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    DataService.getSettings().then(setSettings);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#070707] border-t border-neutral-900 mt-20 text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Vision Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/logo.png" 
                alt="JEY VID VISION" 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/aistudio/Jey_Vid_Vision_Cinematic_Logo_c6a37e17.png';
                }}
              />
            </Link>
            <p className="text-xs uppercase tracking-wider text-[#F00018] font-bold">
              {settings?.tagline || 'Your Entertainment. Your Vision.'}
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              {settings?.about_text || 'JEY VID VISION is an elite cinematic video streaming platform presenting the finest Bangla Natok, Hindi Drama, Pakistani Serials, Comedy Natok, and electrifying Music Videos.'}
            </p>
            <div className="pt-2 text-xs text-neutral-500">
              <span>Official Inquiries: </span>
              <a href={`mailto:${settings?.contact_email || 'contact@jeyvidvision.com'}`} className="text-neutral-300 hover:text-white underline">
                {settings?.contact_email || 'contact@jeyvidvision.com'}
              </a>
            </div>
          </div>

          {/* Quick Categories Column */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/category/bangla-natok" className="hover:text-white transition-colors">Bangla Natok</Link>
              </li>
              <li>
                <Link to="/category/hindi-natok" className="hover:text-white transition-colors">Hindi Natok</Link>
              </li>
              <li>
                <Link to="/category/pakistani-natok" className="hover:text-white transition-colors">Pakistani Natok</Link>
              </li>
              <li>
                <Link to="/category/comedy-serial-natok" className="hover:text-white transition-colors">Comedy Serial / Natok</Link>
              </li>
              <li>
                <Link to="/category/all-music-video" className="hover:text-white transition-colors">All Music Videos</Link>
              </li>
              <li>
                <Link to="/category/others" className="hover:text-white transition-colors">Others & Specials</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policy Column */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Legal & Policies
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/legal?tab=terms" className="hover:text-white transition-colors">Terms of Use</Link>
              </li>
              <li>
                <Link to="/legal?tab=privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/legal?tab=copyright" className="hover:text-white transition-colors">Copyright Policy</Link>
              </li>
              <li>
                <Link to="/legal?tab=removal" className="hover:text-[#F00018] flex items-center gap-1 transition-colors">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#F00018]" />
                  <span>Content Removal Request</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-neutral-500 hover:text-neutral-300 text-[11px] block pt-2">
                  Owner Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Channels Column */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Connect With Us
            </h4>
            <div className="space-y-2.5 text-xs">
              {settings?.social_links?.youtube && (
                <a 
                  href={settings.social_links.youtube} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  YouTube Channel
                </a>
              )}
              {settings?.social_links?.facebook && (
                <a 
                  href={settings.social_links.facebook} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Facebook Page
                </a>
              )}
              {settings?.social_links?.whatsapp && (
                <a 
                  href={settings.social_links.whatsapp} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  WhatsApp Community
                </a>
              )}
              {settings?.social_links?.instagram && (
                <a 
                  href={settings.social_links.instagram} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {currentYear} <span className="text-white font-medium">JEY VID VISION</span>. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            <span>Powered by Supabase & Netlify Architecture</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
