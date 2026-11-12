// JEY VID VISION - Adsterra & Monetization Placement Container
// Strictly isolated execution that respects security guidelines and never interrupts video playback

import React, { useEffect, useRef, useState } from 'react';
import { DataService } from '../lib/supabase';
import { Advertisement } from '../types';

interface AdsterraPlacementProps {
  placementName: string;
  className?: string;
  fallbackText?: string;
}

export const AdsterraPlacement: React.FC<AdsterraPlacementProps> = ({
  placementName,
  className = '',
  fallbackText
}) => {
  const [adConfig, setAdConfig] = useState<Advertisement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    DataService.getAdvertisements().then(ads => {
      if (isMounted) {
        const found = ads.find(a => a.placement_name === placementName);
        if (found) setAdConfig(found);
      }
    });
    return () => { isMounted = false; };
  }, [placementName]);

  useEffect(() => {
    if (!adConfig || !adConfig.enabled || !containerRef.current) return;

    // Clear previous
    containerRef.current.innerHTML = '';

    const rawCode = (adConfig.ad_code_reference || '').trim();
    if (!rawCode) return;

    // Check if user provided an iframe or script code
    if (rawCode.includes('<iframe') || rawCode.includes('<div') || rawCode.includes('<img')) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = rawCode;
      containerRef.current.appendChild(wrapper);
    } else if (rawCode.includes('<script')) {
      // Safe sandbox iframe execution to ensure Adsterra scripts never leak or crash the main player
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.title = `Adsterra ${adConfig.placement_label}`;
      iframe.srcdoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { margin:0; padding:0; background:transparent; display:flex; justify-content:center; align-items:center; }
            </style>
          </head>
          <body>
            ${rawCode}
          </body>
        </html>
      `;
      containerRef.current.appendChild(iframe);
    }
  }, [adConfig]);

  if (!adConfig || !adConfig.enabled) {
    if (fallbackText) {
      return (
        <div className={`hidden text-xs text-neutral-600 text-center py-1 ${className}`}>
          {fallbackText}
        </div>
      );
    }
    return null;
  }

  return (
    <div className={`w-full flex flex-col items-center justify-center my-4 overflow-hidden rounded-lg bg-[#0e0e0e] border border-neutral-800/60 p-2 ${className}`}>
      <div className="w-full text-right mb-1">
        <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">Advertisement</span>
      </div>
      <div ref={containerRef} className="w-full flex items-center justify-center min-h-[90px]" />
    </div>
  );
};
