'use client';

import Image from 'next/image'

import PreviewBadge from '@/components/ui/PreviewBadge'



import React from 'react';

type TournamentCardProps = {
  name: string;
  game: string;
  prize: string;
  spotsLeft: number;
  totalSpots: number;
  imageSrc: string;
};

export default function TournamentCard({
  name,
  game,
  prize,
  spotsLeft,
  totalSpots,
  imageSrc,
}: TournamentCardProps) {
  const pct = ((totalSpots - spotsLeft) / totalSpots) * 100;

  return (
    <div className="min-w-0 bg-kv-card rounded-xl overflow-hidden cursor-pointer transition-colors group">

      {/* Banner */}
      <div className="relative h-[160px] overflow-hidden">
        <Image
          src={imageSrc}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" unoptimized fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Game tag */}
        <span className="absolute top-3 left-3 text-[10px] bg-black/60 text-white/80 px-2 py-1 rounded-md border border-white/10">
          {game}
        </span>

        {/* Prize */}
        <span className="absolute top-3 right-3 text-sm font-medium text-[#F0B429]">
          {prize}
        </span>

        {/* Tournament name */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-sm font-medium text-white leading-tight max-lg:break-words">{name}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        <div className="mb-2"><PreviewBadge /></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-white/40">{spotsLeft} spots left</span>
          <span className="text-[11px] text-white/40">{totalSpots} total</span>
        </div>
        <div className="h-1 bg-white/8 rounded-full mb-3">
          <div
            className="h-full rounded-full bg-[#F0B429] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <button
          className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-colors"
          style={{ background: 'rgba(240,180,41,0.15)', color: '#F0B429' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(240,180,41,0.25)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(240,180,41,0.15)')}
        >
          Jump in
        </button>
      </div>
    </div>
  );
}
