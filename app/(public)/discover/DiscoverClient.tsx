'use client'

import Image from 'next/image'

import PreviewBadge from '@/components/ui/PreviewBadge'

import { brand } from '@/lib/brand'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  LiveStreaming01Icon,
  Award01Icon,
  StarIcon,
  GiftIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { feedItems, trendingTournaments, trendingCreators, type FeedItemType } from '@/lib/discoverData'
import { useAuthStore } from '@/store/useAuthStore'

const TYPE_ICON: Record<FeedItemType, IconSvgElement> = {
  stream_live:     LiveStreaming01Icon,
  tournament_open: Award01Icon,
  winner:          StarIcon,
  rank_up:         Award01Icon,
  gift_highlight:  GiftIcon,
  new_creator:     UserGroupIcon,
}

const TYPE_BG: Record<FeedItemType, string> = {
  stream_live:     '#FF4D6D',
  tournament_open: '#F0B429',
  winner:          '#F0B429',
  rank_up:         '#60A5FA',
  gift_highlight:  '#A78BFA',
  new_creator:     '#34D399',
}

const TABS = ['All', 'Live', 'Tournaments', 'Winners'] as const
type Tab = (typeof TABS)[number]

export default function DiscoverClient() {
  const [activeTab, setActiveTab] = useState<Tab>('All')
  const [displayedFeed, setDisplayedFeed] = useState(feedItems)
  const { openModal } = useAuthStore()

  useEffect(() => {
    const timer = setInterval(() => {
      const randomItem = {
        ...feedItems[Math.floor(Math.random() * feedItems.length)],
        id: Date.now().toString(),
        timestamp: 'just now',
      }
      setDisplayedFeed(prev => [randomItem, ...prev].slice(0, 30))
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const filteredFeed = displayedFeed.filter(item => {
    if (activeTab === 'All') return true
    if (activeTab === 'Live') return item.type === 'stream_live'
    if (activeTab === 'Tournaments') return item.type === 'tournament_open'
    if (activeTab === 'Winners') return item.type === 'winner'
    return true
  })

  return (
    <div className="flex min-w-0 flex-col gap-6 p-4 sm:p-6 xl:flex-row xl:items-start min-h-full">

      {/* ---- Main feed ---- */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">

        {/* Header */}
        <div className="flex min-w-0 flex-col gap-3 mb-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/40">{brand.oneLiner}</p>
          <div
            className="flex max-w-full items-center overflow-x-auto rounded-lg p-1"
            style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="min-h-11 shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors lg:min-h-0"
                style={
                  activeTab === tab
                    ? { background: 'rgba(240,180,41,0.15)', color: '#F0B429' }
                    : { color: 'rgba(255,255,255,0.40)' }
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Feed */}
        {filteredFeed.map(item => (
          <div
            key={item.id}
            className="rounded-xl p-4 grid grid-cols-[40px_minmax(0,1fr)] gap-3 transition-colors sm:flex"
            style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
          >
            {/* Avatar + type badge */}
            <div className="flex-shrink-0 relative self-start mt-0.5">
              <Image
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${item.actorSeed}&backgroundColor=0D0D14`}
                loading="lazy"
                width={40}
                height={40}
                className="rounded-full"
                alt={item.actor} unoptimized sizes="40px" />
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: TYPE_BG[item.type], border: '2px solid #111118' }}
              >
                <HugeiconsIcon icon={TYPE_ICON[item.type]} size={10} color="white" strokeWidth={2} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-2"><PreviewBadge /></div>
              <p className="text-xs font-medium text-white leading-snug mb-0.5">{item.title}</p>
              <p className="text-xs text-white/50 mb-2 leading-relaxed break-words">{item.description}</p>
              <div className="flex flex-wrap items-center gap-2">
                {item.game && (
                  <span
                    className="text-[10px] text-white/40 px-2 py-0.5 rounded-md"
                    style={{ background: 'rgba(255,255,255,0.07)' }}
                  >
                    {item.game}
                  </span>
                )}
                {item.tags?.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] text-white/30 px-2 py-0.5 rounded-md"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Far-right: timestamp + value + action */}
            <div className="col-start-2 flex flex-wrap items-center justify-between gap-2 sm:flex-shrink-0 sm:flex-col sm:items-end sm:self-stretch">
              <span className="text-[10px] text-white/30 whitespace-nowrap">{item.timestamp}</span>
              {item.value && item.type !== 'stream_live' && (
                <span className="text-[10px] font-semibold text-[#F0B429]">{item.value}</span>
              )}
              <Link href={(item.type === 'winner' || item.type === 'rank_up') ? `/players/${item.actorSeed}` : item.actionHref}>
                <button
                  className="min-h-11 text-xs px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors lg:min-h-0"
                  style={
                    item.type === 'stream_live'
                      ? { background: 'rgba(255,77,109,0.15)', border: '1px solid rgba(255,77,109,0.30)', color: '#FF4D6D' }
                      : item.type === 'tournament_open'
                      ? { background: 'rgba(240,180,41,0.12)', border: '1px solid rgba(240,180,41,0.25)', color: '#F0B429' }
                      : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.60)' }
                  }
                >
                  {item.type === 'stream_live' ? 'Watch preview' : item.actionLabel}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Right sidebar ---- */}
      <div className="grid w-full min-w-0 gap-4 sm:grid-cols-2 xl:sticky xl:top-6 xl:flex xl:w-[272px] xl:flex-shrink-0 xl:flex-col">

        {/* Live activity counter */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <PreviewBadge />
            <span className="text-xs font-medium text-white">Sample activity</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Sample streams', value: '47', color: '#A1A1AA' },
              { label: 'In tournaments', value: '1,240', color: '#F0B429' },
              { label: 'Chatting',       value: '3.2K',  color: '#A78BFA' },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: stat.color }} />
                <p className="text-sm font-semibold text-white">{stat.value}</p>
                <p className="text-[10px] text-white/35">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tournament preview */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <HugeiconsIcon icon={Award01Icon} size={14} color="#F0B429" strokeWidth={1.5} />
            <span className="text-xs font-medium text-white">Filling fast</span>
          </div>
          <div className="flex flex-col gap-4">
            {trendingTournaments.map(t => (
              <Link href={t.href} key={t.name}>
                <div className="flex items-start justify-between gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate mb-0.5">{t.name}</p>
                    <p className="text-[10px] text-white/40 mb-1.5">{t.game}</p>
                    <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div
                        className="h-full rounded-full bg-[#F0B429]"
                        style={{ width: `${((t.totalSpots - t.spotsLeft) / t.totalSpots) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-[#F0B429]">{t.prize}</p>
                    <p className="text-[10px] text-white/35 mt-0.5">{t.spotsLeft} left</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Rising creators */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <HugeiconsIcon icon={StarIcon} size={14} color="#F0B429" strokeWidth={1.5} />
            <span className="text-xs font-medium text-white">Rising creators</span>
          </div>
          <div className="flex flex-col gap-3">
            {trendingCreators.map(c => (
              <Link href={c.href} key={c.name}>
                <div className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer">
                  <Image
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${c.seed}&backgroundColor=0D0D14`}
                    loading="lazy"
                    width={32}
                    height={32}
                    className="rounded-full flex-shrink-0"
                    alt={c.name} unoptimized sizes="32px" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{c.name}</p>
                    <p className="text-[10px] text-white/40">{c.game}</p>
                  </div>
                  <span className="text-[10px] text-[#F0B429] flex-shrink-0">{c.growth}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Join CTA */}
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: 'rgba(240,180,41,0.06)', border: '1px solid rgba(240,180,41,0.18)' }}
        >
          <p className="text-sm font-medium text-white mb-1">Join the arena</p>
          <p className="text-xs text-white/40 mb-3">{brand.tagline}</p>
          <button
            onClick={() => openModal('register')}
            className="w-full text-xs font-medium py-2.5 rounded-lg transition-colors"
            style={{ background: '#F0B429', color: '#08080D' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#D4A017')}
            onMouseLeave={e => (e.currentTarget.style.background = '#F0B429')}
          >
            Get started
          </button>
        </div>
      </div>
    </div>
  )
}
