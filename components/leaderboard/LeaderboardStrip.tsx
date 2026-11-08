'use client';

import Image from 'next/image'

import React, { useState } from 'react';
import Link from 'next/link';
import { Money01Icon } from '@hugeicons/core-free-icons';
import SectionHeader from '@/components/ui/SectionHeader';
import { leaderboardData } from '@/lib/leaderboardData';

const PLAYERS = leaderboardData.slice(0, 8).map(p => ({
  rank:     p.rank,
  name:     p.name,
  city:     p.city,
  game:     p.game,
  earnings: `₦${p.earnings.week.toLocaleString()}`,
}));

function rankStyle(rank: number) {
  if (rank === 1) return { bg: '#F0B429', text: 'text-black' };
  if (rank === 2) return { bg: 'rgba(255,255,255,0.20)', text: 'text-white' };
  if (rank === 3) return { bg: 'rgba(205,127,50,0.30)', text: 'text-[#CD7F32]' };
  return { bg: 'rgba(255,255,255,0.07)', text: 'text-white/40' };
}

function PlayerCard({ rank, name, city, game, earnings }: typeof PLAYERS[0]) {
  const { bg, text } = rankStyle(rank);
  return (
    <div className="bg-kv-card rounded-xl p-4 flex-shrink-0 w-[200px] cursor-pointer">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${text}`}
          style={{ background: bg }}
        >
          {rank}
        </div>
        <Image
          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${name}&backgroundColor=0D0D14`}
          loading="lazy"
          width={32}
          height={32}
          className="rounded-full flex-shrink-0"
          alt={name} unoptimized sizes="32px" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-white truncate">{name}</p>
          <p className="text-[10px] text-white/40">{city}</p>
        </div>
      </div>

      <span className="text-[10px] bg-white/7 text-white/50 px-2 py-1 rounded-md mb-3 inline-block">
        {game}
      </span>

      <div>
        <p className="text-[10px] text-white/35 mb-1">Earnings this week</p>
        <p className="text-base font-medium text-[#F0B429]">{earnings}</p>
      </div>
    </div>
  );
}

export default function LeaderboardStrip() {
  const [paused, setPaused] = useState(false);

  return (
    <div>
      <div className="mb-4">
        <SectionHeader icon={Money01Icon} title="Top earners this week" cta="Full leaderboard" ctaHref="/leaderboards" />
      </div>

      {/* Marquee container */}
      <div
        data-mobile-strip className="overflow-x-auto snap-x snap-mandatory no-scrollbar lg:overflow-hidden lg:snap-none"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex gap-3 lg:animate-[leaderboard-scroll_28s_linear_infinite]"
          style={{
            animationPlayState: paused ? 'paused' : 'running',
            width: 'max-content',
          }}
        >
          {/* Render twice for seamless loop */}
          {[...PLAYERS, ...PLAYERS].map((p, i) => (
            <Link className={i >= PLAYERS.length ? 'hidden lg:block flex-shrink-0 snap-start' : 'block flex-shrink-0 snap-start'} key={i} href={`/players/${p.name.replace('@', '')}`}>
              <PlayerCard {...p} />
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes leaderboard-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
