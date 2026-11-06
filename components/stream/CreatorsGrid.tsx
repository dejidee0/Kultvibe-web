import React from 'react';
import { StarIcon, GameController02Icon, MusicNote01Icon, Sun01Icon, CodeIcon } from '@hugeicons/core-free-icons';
import CreatorCard from '@/components/ui/CreatorCard';
import SectionHeader from '@/components/ui/SectionHeader';

const CREATORS = [
  {
    name: '@GhostAlpha',
    category: 'Gaming',
    categoryIcon: GameController02Icon,
    followers: '24.5K',
    verified: true,
    bannerFrom: 'from-[#1e1b4b]',
    bannerTo: 'to-[#312e81]',
  },
  {
    name: '@AfroBeatz',
    category: 'Music',
    categoryIcon: MusicNote01Icon,
    followers: '18.2K',
    verified: true,
    bannerFrom: 'from-[#1c1917]',
    bannerTo: 'to-[#292524]',
  },
  {
    name: '@NaijaVibes',
    category: 'Lifestyle',
    categoryIcon: Sun01Icon,
    followers: '12.8K',
    verified: false,
    bannerFrom: 'from-[#064e3b]',
    bannerTo: 'to-[#065f46]',
  },
  {
    name: '@ProCoderLagos',
    category: 'Tech & Dev',
    categoryIcon: CodeIcon,
    followers: '9.4K',
    verified: true,
    bannerFrom: 'from-[#1e3a5f]',
    bannerTo: 'to-[#1e40af]',
  },
];

export default function CreatorsGrid() {
  return (
    <section>
      <div className="mb-4">
        <SectionHeader icon={StarIcon} title="Featured creators" cta="All creators" ctaHref="/creators" />
      </div>

      <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CREATORS.map((c) => (
          <CreatorCard key={c.name} {...c} />
        ))}
      </div>
    </section>
  );
}
