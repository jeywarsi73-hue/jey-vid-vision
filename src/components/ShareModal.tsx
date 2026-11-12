// JEY VID VISION - Social Sharing Modal Component
// Supports WhatsApp, Facebook, Native Web Share API, and Copy Link

import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  videoUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  videoTitle,
  videoUrl
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(videoUrl);
  const encodedTitle = encodeURIComponent(`${videoTitle} - Watch on JEY VID VISION`);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: videoTitle,
          text: `Watch "${videoTitle}" on JEY VID VISION`,
          url: videoUrl,
        });
      } catch {
        // User dismissed
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-md bg-[#121212] border border-neutral-800 rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#F00018]" />
            <h3 className="text-base font-bold text-white">Share Video</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Title preview */}
        <p className="text-xs text-neutral-300 font-medium line-clamp-1 my-3 bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800">
          {videoTitle}
        </p>

        {/* Social Share Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/40 text-emerald-300 text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp</span>
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-blue-950/40 border border-blue-800/50 hover:bg-blue-900/40 text-blue-300 text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            <svg className="w-4 h-4 fill-current text-blue-400" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </a>
        </div>

        {/* Native Web Share Button (if supported) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 mb-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>More Sharing Options (Device Native)</span>
          </button>
        )}

        {/* Copy Link Row */}
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl p-1.5 pl-3">
          <input
            type="text"
            readOnly
            value={videoUrl}
            className="bg-transparent text-xs text-neutral-300 w-full focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-[#F00018] text-white hover:bg-[#d00015]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
