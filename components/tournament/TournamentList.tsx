import React from 'react';
import TournamentCard from '@/components/ui/TournamentCard';

const TOURNAMENTS = [
  {
    name: 'Lagos Arena — CODM Cup',
    game: 'COD Mobile',
    prize: '₦100,000',
    spotsLeft: 26,
    totalSpots: 128,
    imageSrc: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
  },
  {
    name: 'PUBG Naija Royale',
    game: 'PUBG Mobile',
    prize: '₦250,000',
    spotsLeft: 20,
    totalSpots: 100,
    imageSrc: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=200&fit=crop',
  },
  {
    name: 'Beat Battle Lagos',
    game: 'Music',
    prize: '₦75,000',
    spotsLeft: 8,
    totalSpots: 64,
    imageSrc: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=200&fit=crop',
  },
  {
    name: 'EA FC Street League',
    game: 'EA FC',
    prize: '₦50,000',
    spotsLeft: 13,
    totalSpots: 64,
    imageSrc: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop',
  },
];

export default function TournamentList() {
  return (
    <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {TOURNAMENTS.map((t) => (
        <TournamentCard key={t.name} {...t} />
      ))}
    </div>
  );
}
