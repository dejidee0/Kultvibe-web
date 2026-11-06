'use client';

import React, { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar01Icon, Clock01Icon, BellRingIcon } from '@hugeicons/core-free-icons';
import SectionHeader from '@/components/ui/SectionHeader';

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

const UPCOMING = [
  {
    name: 'Naija CTF Challenge',
    game: 'Tech',
    prize: '₦150,000',
    spots: 64,
    date: daysFromNow(3),
    imageSrc: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=200&fit=crop',
  },
  {
    name: 'Afrobeats Producer Cup',
    game: 'Music',
    prize: '₦80,000',
    spots: 32,
    date: daysFromNow(5),
    imageSrc: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=200&fit=crop',
  },
  {
    name: 'Free Fire Lagos Open',
    game: 'Gaming',
    prize: '₦120,000',
    spots: 128,
    date: daysFromNow(7),
    imageSrc: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
  },
  {
    name: 'Vlog Challenge Nigeria',
    game: 'Lifestyle',
    prize: '₦60,000',
    spots: 50,
    date: daysFromNow(10),
    imageSrc: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=200&fit=crop',
  },
  {
    name: 'KultVibe Creator Cup',
    game: 'Creator',
    prize: '₦200,000',
    spots: 100,
    date: daysFromNow(14),
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=200&fit=crop',
  },
];

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft('Starting soon');
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      else setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function UpcomingCard({
  name, game, prize, spots, date, imageSrc,
}: typeof UPCOMING[0]) {
  const countdown = useCountdown(date);

  return (
    <div className="bg-kv-card rounded-xl overflow-hidden flex-shrink-0 w-[220px] snap-start cursor-pointer">
      {/* Banner */}
      <div className="relative h-[100px] overflow-hidden">
        <img src={imageSrc} alt={name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <span className="absolute top-2 left-2 text-[9px] bg-black/60 text-white/70 px-2 py-1 rounded-md">
          {game}
        </span>
        <span className="absolute top-2 right-2 text-[9px] bg-[#F0B429]/20 border border-[#F0B429]/30 text-[#F0B429] px-2 py-1 rounded-md">
          {prize}
        </span>
      </div>

      {/* Body */}
      <div className="p-3">
        <p className="text-xs font-medium text-white mb-1 truncate">{name}</p>

        {/* Countdown */}
        <div className="flex items-center gap-1 mb-3">
          <HugeiconsIcon icon={Clock01Icon} size={11} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
          <span className="text-[10px] text-white/40">Starts in</span>
          <span className="text-[10px] font-medium text-white/70">{countdown}</span>
        </div>

        {/* Spots + notify */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/35">{spots} spots</span>
          <button
            className="flex items-center gap-1 text-[10px] font-semibold text-white px-3 py-1 rounded-md transition-colors"
            style={{ background: 'rgba(240,180,41,0.15)', color: '#F0B429' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(240,180,41,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(240,180,41,0.15)')}
          >
            <HugeiconsIcon icon={BellRingIcon} size={11} color="currentColor" strokeWidth={1.5} />
            Notify me
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UpcomingStrip() {
  return (
    <div>
      <div className="mb-4">
        <SectionHeader icon={Calendar01Icon} title="Upcoming tournaments" cta="View all" ctaHref="/compete" />
      </div>

      {/* Scroll row */}
      <div data-mobile-strip className="flex min-w-0 gap-3 overflow-x-auto pb-2 snap-x snap-mandatory lg:snap-none no-scrollbar" style={{ scrollbarWidth: 'none' }}>
        {UPCOMING.map((t) => (
          <UpcomingCard key={t.name} {...t} />
        ))}
      </div>
    </div>
  );
}
