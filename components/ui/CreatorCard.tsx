'use client';

import Image from 'next/image'

import PreviewBadge from '@/components/ui/PreviewBadge'

import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import type { IconSvgElement } from '@hugeicons/react';
import { CheckmarkCircle01Icon, UserAdd01Icon } from '@hugeicons/core-free-icons';

type CreatorCardProps = {
  name: string;
  category: string;
  categoryIcon: IconSvgElement;
  followers: string;
  verified: boolean;
  bannerFrom: string;
  bannerTo: string;
};

export default function CreatorCard({
  name,
  category,
  categoryIcon,
  followers,
  verified,
  bannerFrom,
  bannerTo,
}: CreatorCardProps) {
  return (
    <div className="min-w-0 bg-kv-card rounded-xl cursor-pointer group">
      {/* Banner + avatar overlap wrapper */}
      <div className="relative">
        <div className="h-[70px] overflow-hidden rounded-t-xl">
          <div className={`absolute inset-0 h-[70px] bg-gradient-to-br ${bannerFrom} ${bannerTo}`} />
          <div className="absolute inset-0 h-[70px] bg-black/20" />
        </div>
        <div className="absolute right-2 top-2"><PreviewBadge /></div>
        {/* Avatar pinned at the bottom of the banner */}
        <div className="absolute left-4" style={{ bottom: -22 }}>
          <Image
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${name}&backgroundColor=0D0D14`}
            loading="lazy"
            width={44}
            height={44}
            className="rounded-full border-2 border-kv-card"
            alt={name} unoptimized sizes="44px" />
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-4" style={{ paddingTop: 30 }}>

        {/* Name + verified */}
        <div className="flex min-w-0 items-center gap-1.5 mb-1">
          <span className="text-sm font-medium text-white max-lg:truncate">{name}</span>
          {verified && (
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} color="#F0B429" strokeWidth={1.5} />
          )}
        </div>

        {/* Category pill with icon */}
        <div className="flex items-center gap-1.5 bg-white/7 text-white/50 px-2 py-1 rounded-md inline-flex mb-3 w-fit">
          <HugeiconsIcon icon={categoryIcon} size={11} color="currentColor" strokeWidth={1.5} />
          <span className="text-[10px]">{category}</span>
        </div>

        {/* Stats + follow */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white">{followers}</p>
            <p className="text-[10px] text-white/35">followers</p>
          </div>
          <button
            className="flex items-center gap-1 text-[10px] font-semibold px-3 py-1.5 rounded-md transition-colors"
            style={{ background: 'rgba(240,180,41,0.15)', color: '#F0B429' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(240,180,41,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(240,180,41,0.15)')}
          >
            <HugeiconsIcon icon={UserAdd01Icon} size={11} color="currentColor" strokeWidth={1.5} />
            Follow
          </button>
        </div>
      </div>
    </div>
  );
}
