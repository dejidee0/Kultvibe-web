'use client'

import StreamCard from '@/components/ui/StreamCard'
import { streamsData } from '@/lib/streamsData'

const STREAM_META = [
  { id: 'zulusquad', title: 'PUBG Naija Royale',   streamer: '@ZuluSquad', city: 'Abuja',         viewers: 940, game: 'PUBG Mobile',      tags: ['SQUADS', 'AFRICA'],   gradientFrom: '#1e3a5f', gradientTo: '#0c1a2e' },
  { id: 'afrobeatz', title: 'Beat Battle Lagos',    streamer: '@AfroBeatz', city: 'Lagos',          viewers: 612, game: 'Music · Beat Battle',tags: ['MUSIC', 'AFROBEATS'], gradientFrom: '#3b1f0e', gradientTo: '#1c0a05' },
  { id: 'kelechifc', title: 'EA FC Street League',  streamer: '@KelechiFC', city: 'Port Harcourt',  viewers: 388, game: 'EA FC',             tags: ['FIFA', '1V1'],        gradientFrom: '#064e3b', gradientTo: '#022c22' },
];

export default function StreamGrid() {
  return <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {STREAM_META.map(stream => {
      const media = streamsData.find(entry => entry.id === stream.id)
      return <StreamCard key={stream.id} {...stream} videoSrc={media?.videoSrc} mobileSrc={media?.mobileSrc} posterSrc={media?.posterSrc} />
    })}
  </div>
}
