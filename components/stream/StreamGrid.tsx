'use client';

import React, { useState, useEffect } from 'react';
import StreamCard from '@/components/ui/StreamCard';
import { getShuffledVideos } from '@/lib/videoPool';

const STREAM_META = [
  { id: 'zulusquad', title: 'PUBG Naija Royale',   streamer: '@ZuluSquad', city: 'Abuja',         viewers: 940, game: 'PUBG Mobile',      tags: ['SQUADS', 'AFRICA'],   gradientFrom: '#1e3a5f', gradientTo: '#0c1a2e' },
  { id: 'afrobeatz', title: 'Beat Battle Lagos',    streamer: '@AfroBeatz', city: 'Lagos',          viewers: 612, game: 'Music · Beat Battle',tags: ['MUSIC', 'AFROBEATS'], gradientFrom: '#3b1f0e', gradientTo: '#1c0a05' },
  { id: 'kelechifc', title: 'EA FC Street League',  streamer: '@KelechiFC', city: 'Port Harcourt',  viewers: 388, game: 'EA FC',             tags: ['FIFA', '1V1'],        gradientFrom: '#064e3b', gradientTo: '#022c22' },
];

export default function StreamGrid() {
  const [videoSrcs, setVideoSrcs] = useState([
    '/videos/stream-pubg.mp4',
    '/videos/stream-beatbattle.mp4',
    '/videos/stream-eafc.mp4',
  ]);

  useEffect(() => {
    setVideoSrcs(getShuffledVideos().slice(1));
  }, []);

  return (
    <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {STREAM_META.map((s, i) => (
        <StreamCard key={s.title} {...s} videoSrc={videoSrcs[i]} />
      ))}
    </div>
  );
}
