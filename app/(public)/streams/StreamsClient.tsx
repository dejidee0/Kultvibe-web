'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { EyeIcon, LiveStreaming01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import StreamCard from '@/components/ui/StreamCard';
import StreamCardSkeleton from '@/components/ui/StreamCardSkeleton';

function fmtViewers(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

type HeroStream = {
  title: string;
  streamer: string;
  viewers: number;
  videoSrc: string;
};

type GridStream = {
  id: string;
  title: string;
  streamer: string;
  city: string;
  viewers: number;
  game: string;
  category: string;
  tags: string[];
  videoSrc?: string;
  gradientFrom?: string;
  gradientTo?: string;
};

type SortKey = 'Most viewers' | 'Recently started' | 'Alphabetical';

const HERO_STREAMS: HeroStream[] = [
  { title: 'CODM Lagos Qualifiers — Season 1 Alpha', streamer: '@GhostAlpha', viewers: 1280, videoSrc: '/videos/featured-stream.mp4' },
  { title: 'PUBG Naija Royale — Squad Push to Top 10', streamer: '@ZuluSquad', viewers: 940, videoSrc: '/videos/stream-pubg.mp4' },
  { title: 'Beat Battle Lagos — Round 2 Finals', streamer: '@AfroBeatz', viewers: 612, videoSrc: '/videos/stream-beatbattle.mp4' },
  { title: 'EA FC Street League — 1v1 Ranked Grind', streamer: '@KelechiFC', viewers: 388, videoSrc: '/videos/stream-eafc.mp4' },
];

const CATEGORIES = [
  { label: 'All', count: 47 },
  { label: 'Gaming', count: 24 },
  { label: 'Tech & Dev', count: 6 },
  { label: 'Music', count: 8 },
  { label: 'Lifestyle', count: 3 },
  { label: 'Streaming', count: 4 },
  { label: 'Creator Economy', count: 2 },
];

const ALL_STREAMS: GridStream[] = [
  { id: 'ghostalpha',    title: 'CODM — Lagos Qualifiers',        streamer: '@GhostAlpha',    city: 'Lagos',         viewers: 1280, game: 'COD Mobile',      category: 'Gaming',    tags: ['RANKED', 'NIGERIA'],   videoSrc: '/videos/featured-stream.mp4' },
  { id: 'zulusquad',    title: 'PUBG Naija Royale',               streamer: '@ZuluSquad',     city: 'Abuja',         viewers: 940,  game: 'PUBG Mobile',     category: 'Gaming',    tags: ['SQUADS', 'AFRICA'],    videoSrc: '/videos/stream-pubg.mp4' },
  { id: 'afrobeatz',    title: 'Beat Battle Lagos',               streamer: '@AfroBeatz',     city: 'Lagos',         viewers: 612,  game: 'Music',            category: 'Music',     tags: ['MUSIC', 'AFROBEATS'],  videoSrc: '/videos/stream-beatbattle.mp4' },
  { id: 'kelechifc',    title: 'EA FC Street League',             streamer: '@KelechiFC',     city: 'Port Harcourt', viewers: 388,  game: 'EA FC',            category: 'Gaming',    tags: ['FIFA', '1V1'],         videoSrc: '/videos/stream-eafc.mp4' },
  { id: 'queenplays',   title: 'Valorant Ranked Grind',           streamer: '@QueenPlays',    city: 'Lagos',         viewers: 892,  game: 'Valorant',         category: 'Gaming',    tags: ['RANKED'],              gradientFrom: '#4a044e', gradientTo: '#1e1b4b' },
  { id: 'lagosloot',    title: 'Fortnite Solos — Chapter 6',      streamer: '@LagosLoot',     city: 'Lagos',         viewers: 543,  game: 'Fortnite',         category: 'Gaming',    tags: ['SOLOS'],               gradientFrom: '#164e63', gradientTo: '#172554' },
  { id: 'aceshooterph', title: 'Free Fire Diamond Push',          streamer: '@AceShooterPH',  city: 'Port Harcourt', viewers: 415,  game: 'Free Fire',        category: 'Gaming',    tags: ['RANKED'],              gradientFrom: '#7c2d12', gradientTo: '#450a0a' },
  { id: 'procoderlagos',title: 'Building a Trading Bot Live',     streamer: '@ProCoderLagos', city: 'Lagos',         viewers: 312,  game: 'Tech & Dev',       category: 'Tech & Dev',tags: ['CODING', 'LIVE'],      gradientFrom: '#1e293b', gradientTo: '#020617' },
  { id: 'drumkingkano', title: 'Afrobeats Production Session',    streamer: '@DrumKingKano',  city: 'Kano',          viewers: 309,  game: 'Music Production', category: 'Music',     tags: ['AFROBEATS'],           gradientFrom: '#78350f', gradientTo: '#431407' },
  { id: 'naijaninja',   title: 'Mortal Kombat Tournament Prep',   streamer: '@NaijaNinja',    city: 'Lagos',         viewers: 187,  game: 'Mortal Kombat 1',  category: 'Gaming',    tags: ['1V1'],                 gradientFrom: '#7f1d1d', gradientTo: '#4c0519' },
  { id: 'lenslagos',    title: 'Lagos Street Photography Walk',   streamer: '@LensLagos',     city: 'Lagos',         viewers: 156,  game: 'Lifestyle',        category: 'Lifestyle', tags: ['VLOG'],                gradientFrom: '#064e3b', gradientTo: '#042f2e' },
  { id: 'vibeswithchi', title: 'Just Chatting with the Squad',    streamer: '@VibesWithChi',  city: 'Abuja',         viewers: 203,  game: 'Just Chatting',    category: 'Streaming', tags: ['CHAT'],                gradientFrom: '#831843', gradientTo: '#4a044e' },
];

function HeroStreamCard({ stream }: { stream: HeroStream }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      className="relative aspect-video w-[min(320px,calc(100vw-2rem))] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group"
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <video
        ref={videoRef}
        src={stream.videoSrc}
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.28) 52%, rgba(0,0,0,0.08) 100%)',
        }}
      />

      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <span
          className="flex items-center gap-1 text-white font-bold rounded-md"
          style={{ fontSize: 9, background: '#FF4D6D', padding: '3px 7px', letterSpacing: '0.05em' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          LIVE
        </span>
        <div
          className="flex items-center gap-1 rounded-md"
          style={{ background: 'rgba(0,0,0,0.62)', backdropFilter: 'blur(8px)', padding: '3px 8px' }}
        >
          <HugeiconsIcon icon={EyeIcon} size={10} color="rgba(255,255,255,0.65)" strokeWidth={1.5} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.92)' }}>{fmtViewers(stream.viewers)}</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p
          className="font-semibold text-white leading-snug mb-2"
          style={{
            fontSize: 13,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {stream.title}
        </p>
        <div className="flex items-center gap-2">
          <img
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${stream.streamer}&backgroundColor=0D0D14`}
            loading="lazy"
            alt={stream.streamer}
            className="rounded-full flex-shrink-0"
            style={{ width: 20, height: 20 }}
          />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.58)' }}>{stream.streamer}</span>
        </div>
      </div>

      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1.5px rgba(240,180,41,0.50)' }}
      />
    </div>
  );
}

function listThumb(stream: GridStream): string {
  if (stream.gradientFrom) return `linear-gradient(135deg, ${stream.gradientFrom}, ${stream.gradientTo})`;
  const cat: Record<string, string> = {
    Gaming: 'linear-gradient(135deg, #0f2027, #1e3a5f)',
    Music: 'linear-gradient(135deg, #3b1f0e, #1c0a05)',
    'Tech & Dev': 'linear-gradient(135deg, #1e293b, #020617)',
    Lifestyle: 'linear-gradient(135deg, #064e3b, #042f2e)',
    Streaming: 'linear-gradient(135deg, #831843, #4a044e)',
  };
  return cat[stream.category] ?? 'linear-gradient(135deg, #111118, #0D0D14)';
}

function StreamListRow({ stream }: { stream: GridStream }) {
  return (
    <div
      className="grid min-w-0 grid-cols-[96px_minmax(0,1fr)] items-center gap-3 rounded-xl cursor-pointer transition-colors sm:flex sm:gap-4"
      style={{ padding: '10px 12px' }}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)')}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
    >
      <div className="relative row-span-2 h-[54px] w-24 flex-shrink-0 overflow-hidden rounded-xl sm:h-[72px] sm:w-32">
        <div className="absolute inset-0" style={{ background: listThumb(stream) }} />
        <span
          className="absolute bottom-1.5 left-1.5 text-white font-bold rounded"
          style={{ fontSize: 8, background: '#FF4D6D', padding: '2px 5px', letterSpacing: '0.05em' }}
        >
          LIVE
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate mb-0.5" style={{ fontSize: 13 }}>{stream.title}</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
          {stream.streamer}
          <span style={{ color: 'rgba(255,255,255,0.18)' }}> · </span>
          {stream.game}
          <span style={{ color: 'rgba(255,255,255,0.18)' }}> · </span>
          {stream.city}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {stream.tags.map(tag => (
            <span
              key={tag}
              className="rounded-md"
              style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', letterSpacing: '0.04em' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="col-start-2 flex items-center gap-1.5 flex-shrink-0">
        <HugeiconsIcon icon={EyeIcon} size={12} color="rgba(255,255,255,0.28)" strokeWidth={1.5} />
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>{fmtViewers(stream.viewers)}</span>
      </div>
    </div>
  );
}

export default function StreamsClient({ initialCategory }: { initialCategory?: string }) {
  const [activeCategory, setActiveCategory] = useState(() => {
    if (!initialCategory) return 'All'
    const match = CATEGORIES.find(c => c.label.toLowerCase() === initialCategory.toLowerCase())
    return match ? match.label : 'All'
  });
  const [sort, setSort] = useState<SortKey>('Most viewers');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [tagSearch, setTagSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let base = activeCategory === 'All'
      ? ALL_STREAMS
      : ALL_STREAMS.filter(s => s.category === activeCategory);

    if (tagSearch.trim()) {
      base = base.filter(s => s.tags.some(tag => tag.includes(tagSearch)));
    }

    return [...base].sort((a, b) => {
      if (sort === 'Most viewers')     return b.viewers - a.viewers;
      if (sort === 'Recently started') return ALL_STREAMS.indexOf(b) - ALL_STREAMS.indexOf(a);
      return a.title.localeCompare(b.title);
    });
  }, [activeCategory, tagSearch, sort]);

  // Reset pagination whenever filters or sort change
  useEffect(() => {
    setVisibleCount(8);
    setIsLoadingMore(false);
  }, [activeCategory, tagSearch, sort]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && visibleCount < filtered.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + 4, filtered.length));
            setIsLoadingMore(false);
          }, 800);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filtered.length, isLoadingMore]);

  const visibleStreams = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="flex min-w-0 flex-col gap-6 p-4 sm:p-6" style={{ background: '#08080D', minHeight: '100%' }}>

      {/* ---- Section 1: Trending hero strip with right-edge fade ---- */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-white font-bold rounded"
            style={{ fontSize: 10, background: '#FF4D6D', padding: '4px 8px', letterSpacing: '0.05em' }}
          >
            LIVE
          </span>
          <span className="text-sm font-semibold text-white">Trending right now</span>
        </div>
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {HERO_STREAMS.map(s => (
              <HeroStreamCard key={s.streamer} stream={s} />
            ))}
          </div>
          {/* Right-edge scroll affordance */}
          <div className="absolute top-0 right-0 bottom-2 w-16 pointer-events-none bg-gradient-to-l from-kv-base to-transparent" />
        </div>
      </div>

      {/* ---- Section 2: Category rail ---- */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className="flex min-h-11 shrink-0 items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap lg:min-h-0 transition-all duration-200"
              style={{
                color: isActive ? '#F0B429' : 'rgba(255,255,255,0.48)',
                background: isActive ? 'rgba(240,180,41,0.10)' : 'transparent',
                border: isActive ? '1px solid rgba(240,180,41,0.40)' : '1px solid rgba(255,255,255,0.09)',
                boxShadow: isActive ? '0 0 18px rgba(240,180,41,0.11)' : 'none',
              }}
              onMouseEnter={e => {
                if (isActive) return;
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.20)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.72)';
              }}
              onMouseLeave={e => {
                if (isActive) return;
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.09)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.48)';
              }}
            >
              {cat.label}
              <span
                className="text-[10px] rounded-full px-1.5 py-0.5 leading-none"
                style={{
                  background: isActive ? 'rgba(240,180,41,0.18)' : 'rgba(255,255,255,0.07)',
                  color: isActive ? '#F0B429' : 'rgba(255,255,255,0.38)',
                }}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ---- Section 3: Controls row - 3 equal columns so search is truly centred ---- */}
      <div className="flex min-w-0 flex-wrap items-center gap-3 xl:gap-0">
        {/* Left: stream count */}
        <div className="min-w-0 flex-1">
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>
            {filtered.length} stream{filtered.length !== 1 ? 's' : ''} live
          </span>
        </div>

        {/* Centre: tag search */}
        <div className="order-3 flex w-full min-w-0 justify-center xl:order-none xl:w-auto xl:flex-1">
          <div className="relative w-full min-w-0 xl:max-w-96">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <HugeiconsIcon icon={Search01Icon} size={13} color="rgba(255,255,255,0.28)" strokeWidth={1.5} />
            </div>
            <input
              type="text"
              aria-label="Filter streams by tag" placeholder="Filter by tag: RANKED, SQUADS..."
              value={tagSearch}
              onChange={e => setTagSearch(e.target.value.toUpperCase())}
              className="min-h-11 w-full min-w-0 rounded-lg pl-9 py-2 text-xs text-white placeholder:text-white/30 outline-none transition-colors"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                paddingRight: tagSearch ? 28 : 12,
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(240,180,41,0.45)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
            />
            {tagSearch && (
              <button
                onClick={() => setTagSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors text-xs leading-none"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: sort + view toggle */}
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-2 xl:flex-1 xl:gap-3">
          <div className="relative flex items-center">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              aria-label="Sort streams" className="min-h-11 max-w-full rounded-lg text-xs outline-none cursor-pointer appearance-none lg:min-h-0"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: 'rgba(255,255,255,0.58)',
                padding: '7px 30px 7px 12px',
              }}
            >
              <option style={{ background: '#0D0D14' }}>Most viewers</option>
              <option style={{ background: '#0D0D14' }}>Recently started</option>
              <option style={{ background: '#0D0D14' }}>Alphabetical</option>
            </select>
            <svg
              className="absolute pointer-events-none"
              style={{ right: 9, top: '50%', transform: 'translateY(-50%)' }}
              width="10" height="10" viewBox="0 0 10 10"
              fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" strokeLinecap="round"
            >
              <path d="M1.5 3.5 5 7 8.5 3.5" />
            </svg>
          </div>

          <div
            className="flex items-center gap-0.5 rounded-lg p-1"
            style={{ border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.02)' }}
          >
            <button
              onClick={() => setView('grid')}
              className="flex h-11 w-11 items-center justify-center rounded-md transition-all duration-150 lg:h-auto lg:w-auto lg:p-1.5"
              style={{
                color: view === 'grid' ? '#F0B429' : 'rgba(255,255,255,0.28)',
                background: view === 'grid' ? 'rgba(240,180,41,0.14)' : 'transparent',
              }}
              aria-pressed={view === 'grid'} title="Grid view"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="0" y="0" width="5.5" height="5.5" rx="1.2" />
                <rect x="8.5" y="0" width="5.5" height="5.5" rx="1.2" />
                <rect x="0" y="8.5" width="5.5" height="5.5" rx="1.2" />
                <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" />
              </svg>
            </button>
            <button
              onClick={() => setView('list')}
              className="flex h-11 w-11 items-center justify-center rounded-md transition-all duration-150 lg:h-auto lg:w-auto lg:p-1.5"
              style={{
                color: view === 'list' ? '#F0B429' : 'rgba(255,255,255,0.28)',
                background: view === 'list' ? 'rgba(240,180,41,0.14)' : 'transparent',
              }}
              aria-pressed={view === 'list'} title="List view"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="0" y="0.5" width="14" height="2.5" rx="1.25" />
                <rect x="0" y="5.75" width="14" height="2.5" rx="1.25" />
                <rect x="0" y="11" width="14" height="2.5" rx="1.25" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ---- Section 4 + 5: Grid / List / Empty ---- */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <HugeiconsIcon icon={LiveStreaming01Icon} size={28} color="rgba(255,255,255,0.18)" strokeWidth={1} />
          </div>
          <p className="text-sm font-semibold text-white mb-1">
            {tagSearch
              ? `No streams tagged "${tagSearch}"`
              : `No one’s live in ${activeCategory} right now`}
          </p>
          <p className="text-xs text-white/40 mb-5">
            {tagSearch ? 'Try a different tag or clear the filter' : 'Check back later or browse other categories'}
          </p>
          <button
            onClick={() => { setActiveCategory('All'); setTagSearch(''); }}
            className="text-xs font-medium text-yellow-400 px-4 py-2 rounded-md transition-colors"
            style={{ background: 'rgba(240,180,41,0.14)', border: '1px solid rgba(240,180,41,0.28)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(240,180,41,0.24)')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(240,180,41,0.14)')}
          >
            {tagSearch ? 'Clear filter' : 'Get notified when live'}
          </button>
        </div>
      ) : view === 'grid' ? (
        <>
          <div
            key={`${activeCategory}-${sort}-${tagSearch}-grid`}
            className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
            style={{ animation: 'kv-fade-up 0.22s ease both' }}
          >
            {visibleStreams.map(s => <StreamCard key={s.title} {...s} />)}
            {isLoadingMore && Array.from({ length: 4 }).map((_, i) => (
              <StreamCardSkeleton key={`skel-${i}`} />
            ))}
          </div>
          {hasMore && <div ref={sentinelRef} className="h-1" />}
        </>
      ) : (
        <div
          key={`${activeCategory}-${sort}-${tagSearch}-list`}
          className="flex flex-col rounded-xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            animation: 'kv-fade-up 0.22s ease both',
          }}
        >
          {visibleStreams.map((s, i) => (
            <React.Fragment key={s.title}>
              <StreamListRow stream={s} />
              {i < visibleStreams.length - 1 && (
                <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '0 12px' }} />
              )}
            </React.Fragment>
          ))}
          {isLoadingMore && (
            <div className="flex items-center justify-center py-4">
              <div
                className="w-4 h-4 rounded-full border-2 border-white/10 border-t-yellow-500 animate-spin"
              />
            </div>
          )}
          {hasMore && <div ref={sentinelRef} className="h-1" />}
        </div>
      )}

      <style>{`
        @keyframes kv-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
