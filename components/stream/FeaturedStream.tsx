'use client';

import Image from 'next/image'

import PreviewVideo from '@/components/stream/PreviewVideo'

import PreviewBadge from '@/components/ui/PreviewBadge'

import React, { useState, useRef, useCallback } from 'react';
import { streamsData } from '@/lib/streamsData';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  VolumeHighIcon,
  VolumeOffIcon,
  FullScreenIcon,
  SidebarRightIcon,
  GiftIcon,
} from '@hugeicons/core-free-icons';
import LiveChat from '@/components/stream/LiveChat';
import GiftAnimation from '@/components/stream/GiftAnimation';
import GiftPicker from '@/components/stream/GiftPicker';

function StreamerHoverCard({ visible }: { visible: boolean }) {
  return (
    <div
      className="absolute bottom-[calc(100%+10px)] left-0 w-72 rounded-2xl p-4 flex flex-col gap-3"
      style={{
        background: 'rgba(16, 16, 26, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        zIndex: 50,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}
    >
      <div className="flex items-center gap-3">
        <Image
          src="https://api.dicebear.com/7.x/bottts/svg?seed=GhostAlpha&backgroundColor=0D0D14"
          width={40}
          height={40}
          className="rounded-full border-2 border-yellow-500/40 flex-shrink-0"
          alt="GhostAlpha" unoptimized sizes="40px" loading="lazy" />
        <div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-white">GhostAlpha</span>
            <span className="text-yellow-400 text-xs">✓</span>
          </div>
          <span className="text-xs text-white/40">@GhostAlpha · 24.5K followers</span>
        </div>
      </div>

      <p className="text-xs text-white/50 leading-relaxed -mt-1">
        Pro COD Mobile player 🎮 | Top 50 Africa | Content creator &amp; grinder. Streaming daily from Lagos.
      </p>

      <div className="flex gap-2">
        <button className="flex-1 text-xs border border-white/20 text-white/80 font-semibold py-1.5 rounded-lg hover:bg-white/10 transition-colors">
          Follow
        </button>
        <button
          className="flex-1 text-xs font-semibold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          style={{ background: '#F0B429', color: '#08080D' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#D4A017')}
          onMouseLeave={e => (e.currentTarget.style.background = '#F0B429')}
        >
          <HugeiconsIcon icon={GiftIcon} size={13} color="currentColor" strokeWidth={1.5} />
          Subscribe
        </button>
      </div>
    </div>
  );
}

export default function FeaturedStream() {
  const [isMuted, setIsMuted] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showCard, setShowCard] = useState(false);
  const featured = streamsData[0];
  const containerRef = useRef<HTMLDivElement>(null);


  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid min-w-0 grid-cols-1 lg:[grid-template-columns:var(--featured-columns)] lg:h-[400px] overflow-hidden rounded-xl"
      style={{
        '--featured-columns': showChat ? 'minmax(0, 1fr) 280px' : 'minmax(0, 1fr)',
        background: '#111118',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'grid-template-columns 0.3s ease',
      } as React.CSSProperties}
    >
      {/* Video and info column */}
      <div className="min-w-0 flex flex-col lg:h-full overflow-hidden" style={{ position: 'relative' }}>
        {/* Video Area */}
        <div className="group relative aspect-video w-full flex flex-col justify-end overflow-hidden lg:min-h-0 lg:flex-1 lg:aspect-auto">
          {featured.videoSrc && featured.posterSrc && <PreviewVideo videoSrc={featured.videoSrc} mobileSrc={featured.mobileSrc} posterSrc={featured.posterSrc} title={featured.title} mode="featured" muted={isMuted} priority sizes="(min-width: 1024px) 70vw, 100vw" />}

          {/* Vignette overlay */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 60%)',
            }}
          />

          {/* LIVE badge and timer */}
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }} className="flex items-center gap-2">
            <PreviewBadge uppercase />

          </div>

          {/* Viewer count */}


          {/* Gift overlays */}
          <GiftAnimation />
          <GiftPicker />
        </div>

        {/* Streamer Info Bar */}
        <div
          className="flex items-center justify-between px-4 py-3 border-t border-white/[0.07]"
          style={{
            position: 'relative',
            flexShrink: 0,
            background: 'rgba(255, 255, 255, 0.01)',
            backdropFilter: 'blur(40px) saturate(220%) brightness(1.05)',
            WebkitBackdropFilter: 'blur(40px) saturate(220%) brightness(1.05)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
            zIndex: 20,
          }}
        >
          {/* Hoverable streamer profile */}
          <div
            className="relative min-w-0 flex items-center gap-3 cursor-pointer"
            onMouseEnter={() => setShowCard(true)}
            onMouseLeave={() => setShowCard(false)}
          >
            <StreamerHoverCard visible={showCard} />
            <Image
              src="https://api.dicebear.com/7.x/bottts/svg?seed=GhostAlpha&backgroundColor=0D0D14"
              width={32}
              height={32}
              className="rounded-full flex-shrink-0"
              alt="GhostAlpha" unoptimized sizes="32px" loading="lazy" />
            <div>
              <p className="text-sm font-medium text-white">@GhostAlpha</p>
              <p className="text-xs text-white/40">24.5K followers</p>
            </div>
          </div>

          {/* Video controls */}
          <div className="flex items-center gap-1">
            <button
              aria-label={isMuted ? 'Unmute preview' : 'Mute preview'} onClick={() => setIsMuted(!isMuted)}
              className="flex h-11 w-11 items-center justify-center p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <HugeiconsIcon icon={isMuted ? VolumeOffIcon : VolumeHighIcon} size={16} color="currentColor" strokeWidth={1.5} />
            </button>
            <button
              aria-label="Fullscreen preview" onClick={toggleFullscreen}
              className="flex h-11 w-11 items-center justify-center p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <HugeiconsIcon icon={FullScreenIcon} size={16} color="currentColor" strokeWidth={1.5} />
            </button>
            <button
              aria-label="Toggle preview chat" aria-pressed={showChat} onClick={() => setShowChat((v) => !v)}
              className={`flex h-11 w-11 items-center justify-center p-2 rounded-lg transition-colors ${showChat ? 'text-yellow-400 bg-yellow-500/10' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            >
              <HugeiconsIcon icon={SidebarRightIcon} size={16} color="currentColor" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Live chat */}
      {showChat && <div className="min-w-0 h-[280px] lg:h-full"><LiveChat /></div>}
    </div>
  );
}
