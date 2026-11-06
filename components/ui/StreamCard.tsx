'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { EyeIcon, PlayCircleIcon } from '@hugeicons/core-free-icons';

type StreamCardProps = {
  id?: string;
  title: string;
  streamer: string;
  city: string;
  viewers: number;
  game: string;
  tags: string[];
  videoSrc?: string;
  gradientFrom?: string;
  gradientTo?: string;
};

export default function StreamCard({
  id,
  title,
  streamer,
  city,
  viewers,
  tags,
  videoSrc,
  gradientFrom,
  gradientTo,
}: StreamCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(240,180,41,0.40)';
    videoRef.current?.play();
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const card = (
    <div
      className="group min-w-0 flex flex-col rounded-lg overflow-hidden cursor-pointer"
      style={{
        background: '#111118',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video lg:aspect-auto lg:h-[110px] overflow-hidden flex-shrink-0">
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
            }}
          />
        )}

        {/* Scrim */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Bottom-left: LIVE + viewers */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-10">
          <span
            className="font-bold text-white rounded px-1.5 py-0.5"
            style={{ fontSize: 9, background: '#FF4D6D', letterSpacing: '0.06em' }}
          >
            LIVE
          </span>
          <div className="flex items-center gap-0.5 bg-black/60 rounded px-1.5 py-0.5" style={{ color: 'rgba(255,255,255,0.80)' }}>
            <HugeiconsIcon icon={EyeIcon} size={10} color="currentColor" strokeWidth={1.5} />
            <span style={{ fontSize: 10 }}>
              {viewers >= 1000 ? `${(viewers / 1000).toFixed(1)}K` : viewers}
            </span>
          </div>
        </div>

        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/10 transition-colors duration-200 flex items-center justify-center z-10">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
            <HugeiconsIcon icon={PlayCircleIcon} size={20} color="#0D0D14" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex min-w-0 flex-col gap-1 p-2.5">
        <p className="font-medium truncate" style={{ fontSize: 12, color: '#fff' }}>{title}</p>
        <p className="max-lg:truncate" style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>
          {streamer} <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span> {city}
        </p>
        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded"
              style={{
                fontSize: 9,
                padding: '2px 6px',
                background: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.50)',
                letterSpacing: '0.04em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return id ? (
    <Link href={`/streams/${id}`} className="block min-w-0">
      {card}
    </Link>
  ) : card;
}
