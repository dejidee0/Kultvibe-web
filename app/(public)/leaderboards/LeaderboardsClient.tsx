'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { ChartUpIcon } from '@hugeicons/core-free-icons'
import { leaderboardData, tierColors, type LeaderboardPlayer } from '@/lib/leaderboardData'
import { useAuthStore } from '@/store/useAuthStore'

type TimePeriod = 'This Week' | 'This Month' | 'All Time'

function getEarnings(player: LeaderboardPlayer, period: TimePeriod) {
  if (period === 'This Week')  return player.earnings.week
  if (period === 'This Month') return player.earnings.month
  return player.earnings.allTime
}

const VERTICAL_OPTIONS = [
  { value: 'all',       label: 'All verticals' },
  { value: 'gaming',    label: 'Gaming'        },
  { value: 'music',     label: 'Music'         },
  { value: 'tech',      label: 'Tech & Dev'    },
  { value: 'lifestyle', label: 'Lifestyle'     },
  { value: 'streaming', label: 'Streaming'     },
]

const CITY_OPTIONS = [
  { value: 'all',           label: 'All regions'   },
  { value: 'Lagos',         label: 'Lagos'         },
  { value: 'Abuja',         label: 'Abuja'         },
  { value: 'Port Harcourt', label: 'Port Harcourt' },
  { value: 'Kano',          label: 'Kano'          },
]

const SELECT_STYLE = {
  background: '#111118',
  border: '1px solid rgba(255,255,255,0.10)',
  color: 'rgba(255,255,255,0.60)',
  outline: 'none',
  appearance: 'none' as const,
}

const PODIUM_COLORS = ['#F0B429', '#C0C0C0', '#CD7F32']

export default function LeaderboardsClient() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('This Week')
  const [vertical,   setVertical]   = useState('all')
  const [city,       setCity]       = useState('all')
  const { openModal } = useAuthStore()

  const filteredPlayers = useMemo(() =>
    leaderboardData.filter(p =>
      (vertical === 'all' || p.vertical === vertical) &&
      (city     === 'all' || p.city     === city)
    ),
    [vertical, city]
  )

  const top3       = filteredPlayers.slice(0, 3)
  const tableRows  = filteredPlayers.slice(3)
  const risingStars = leaderboardData.filter(p => p.trend === 'up')

  return (
    <div className="p-4 sm:p-6 min-w-0 flex flex-col gap-8">

      {/* Filters */}
      <div className="flex min-w-0 flex-col items-stretch gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div
            className="flex max-w-full items-center rounded-lg p-1"
            style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {(['This Week', 'This Month', 'All Time'] as TimePeriod[]).map(period => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className="min-h-11 min-w-0 flex-1 xl:flex-none xl:whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-medium transition-colors lg:min-h-0"
                style={{
                  background: timePeriod === period ? 'rgba(240,180,41,0.15)' : 'transparent',
                  color:      timePeriod === period ? '#F0B429' : 'rgba(255,255,255,0.40)',
                }}
                onMouseEnter={e => { if (timePeriod !== period) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)' }}
                onMouseLeave={e => { if (timePeriod !== period) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.40)' }}
              >
                {period}
              </button>
            ))}
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <select
              aria-label="Leaderboard vertical" value={vertical}
              onChange={e => setVertical(e.target.value)}
              className="min-h-11 min-w-0 flex-1 rounded-lg px-3 py-2 text-xs cursor-pointer sm:flex-none lg:min-h-0"
              style={SELECT_STYLE}
            >
              {VERTICAL_OPTIONS.map(o => (
                <option key={o.value} value={o.value} style={{ background: '#0D0D14' }}>{o.label}</option>
              ))}
            </select>
            <select
              aria-label="Leaderboard region" value={city}
              onChange={e => setCity(e.target.value)}
              className="min-h-11 min-w-0 flex-1 rounded-lg px-3 py-2 text-xs cursor-pointer sm:flex-none lg:min-h-0"
              style={SELECT_STYLE}
            >
              {CITY_OPTIONS.map(o => (
                <option key={o.value} value={o.value} style={{ background: '#0D0D14' }}>{o.label}</option>
              ))}
            </select>
          </div>
      </div>

      {/* Podium */}
      {top3.length >= 3 && (
        <div className="flex min-w-0 items-end justify-center gap-2 sm:gap-4">
          {[1, 0, 2].map(index => {
            const player  = top3[index]
            const isFirst = index === 0
            const color   = PODIUM_COLORS[index]
            return (
              <div
                key={player.rank}
                className="flex min-w-0 max-w-[160px] flex-1 flex-col items-center"
                style={{ order: isFirst ? 2 : index === 1 ? 1 : 3 }}
              >
                <div className={`relative mb-3 ${isFirst ? 'mt-0' : 'mt-8'}`}>
                  <img
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.name}&backgroundColor=0D0D14`}
                    loading="lazy"
                    width={isFirst ? 72 : 56}
                    height={isFirst ? 72 : 56}
                    className="rounded-full"
                    style={{ border: `2px solid ${color}` }}
                    alt={player.name}
                  />
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ background: color, color: '#08080D' }}
                  >
                    {player.rank}
                  </div>
                </div>

                <div
                  className="w-full min-h-[148px] rounded-t-xl flex flex-col items-center pt-3 pb-3 px-1 sm:pt-6 sm:pb-4 sm:px-4 xl:min-h-0"
                  style={{
                    height:      isFirst ? 160 : index === 1 ? 120 : 100,
                    background:  isFirst ? 'rgba(240,180,41,0.08)' : 'rgba(255,255,255,0.04)',
                    borderTop:   `1px solid ${isFirst ? 'rgba(240,180,41,0.20)' : 'rgba(255,255,255,0.08)'}`,
                    borderLeft:  `1px solid ${isFirst ? 'rgba(240,180,41,0.20)' : 'rgba(255,255,255,0.08)'}`,
                    borderRight: `1px solid ${isFirst ? 'rgba(240,180,41,0.20)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  <Link href={`/players/${player.name.replace('@', '')}`} className="max-w-full">
                    <p className="text-xs sm:text-sm font-medium text-white mb-0.5 truncate w-full text-center hover:text-[#F0B429] transition-colors">{player.name}</p>
                  </Link>
                  <p className="text-[10px] mb-2" style={{ color: 'rgba(255,255,255,0.40)' }}>{player.city}</p>
                  <span className="text-xs font-medium" style={{ color: tierColors[player.tier].text }}>
                    {player.tier}
                  </span>
                  <p className="text-sm sm:text-base font-medium mt-auto" style={{ color: '#F0B429' }}>
                    ₦{getEarnings(player, timePeriod).toLocaleString()}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Rankings table */}
      {tableRows.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="hidden gap-4 px-5 py-3 xl:grid"
            style={{
              gridTemplateColumns: '40px 1fr 120px 100px 80px 100px 80px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {['#', 'Player', 'Game', 'Earnings', 'Tournaments', 'Win Rate', 'Tier'].map(h => (
              <span key={h} className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.30)' }}>
                {h}
              </span>
            ))}
          </div>

          {tableRows.map((player, i) => (
            <div
              key={player.rank}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 px-4 py-4 items-center transition-colors cursor-default xl:grid-cols-[40px_minmax(0,1fr)_120px_100px_80px_100px_80px] xl:gap-4 xl:px-5 xl:py-3"
              style={{
                borderBottom: i < tableRows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
            >
              <div className="flex items-center gap-1">
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.50)' }}>{player.rank}</span>
                {player.trend === 'up'   && <span className="text-[10px] text-yellow-400">▲{player.trendAmount}</span>}
                {player.trend === 'down' && <span className="text-[10px] text-red-400">▼{player.trendAmount}</span>}
              </div>

              <Link href={`/players/${player.name.replace('@', '')}`} className="flex items-center gap-2 min-w-0 group">
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.name}&backgroundColor=0D0D14`}
                  loading="lazy"
                  width={28}
                  height={28}
                  className="rounded-full flex-shrink-0"
                  alt={player.name}
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate group-hover:text-[#F0B429] transition-colors">{player.name}</p>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.40)' }}>{player.city}</p>
                </div>
              </Link>

              <span className="col-start-2 text-xs xl:col-auto" style={{ color: 'rgba(255,255,255,0.50)' }}><span className="xl:hidden">Game: </span>{player.game}</span>

              <span className="col-start-2 text-sm font-medium xl:col-auto" style={{ color: '#F0B429' }}>
                <span className="xl:hidden">Earnings: </span>
                ₦{getEarnings(player, timePeriod).toLocaleString()}
              </span>

              <span className="col-start-2 text-xs xl:col-auto" style={{ color: 'rgba(255,255,255,0.50)' }}><span className="xl:hidden">Tournaments: </span>{player.tournaments}</span>

              <span className="col-start-2 text-xs xl:col-auto" style={{ color: 'rgba(255,255,255,0.50)' }}><span className="xl:hidden">Win rate: </span>{player.winRate}</span>

              <span
                className="col-start-2 justify-self-start text-[10px] font-medium px-2 py-1 rounded-md inline-block xl:col-auto xl:justify-self-stretch"
                style={{
                  background: tierColors[player.tier].bg,
                  color:      tierColors[player.tier].text,
                  border:     `0.5px solid ${tierColors[player.tier].border}`,
                }}
              >
                {player.tier}
              </span>
            </div>
          ))}
        </div>
      )}

      {filteredPlayers.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-white mb-1">No players match your filters</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>Try adjusting the vertical or region</p>
        </div>
      )}

      {/* Rising stars */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <HugeiconsIcon icon={ChartUpIcon} size={18} color="#F0B429" strokeWidth={1.5} />
          <span className="text-sm font-medium text-white">Rising this week</span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>biggest movers</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {risingStars.map(player => (
            <div
              key={player.rank}
              className="rounded-xl p-4 flex-shrink-0 flex items-center gap-3 transition-colors cursor-pointer"
              style={{
                background: '#111118',
                border: '1px solid rgba(255,255,255,0.07)',
                width: 200,
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(240,180,41,0.30)')}
              onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)')}
            >
              <img
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.name}&backgroundColor=0D0D14`}
                loading="lazy"
                width={36}
                height={36}
                className="rounded-full flex-shrink-0"
                alt={player.name}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{player.name}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.40)' }}>{player.city}</p>
                <p className="text-xs font-medium text-yellow-400 mt-1">▲ {player.trendAmount} spot{player.trendAmount !== 1 ? 's' : ''}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div
        className="-mx-4 -mb-4 px-4 py-4 flex min-w-0 flex-col items-stretch gap-4 sm:-mx-6 sm:-mb-6 sm:px-6 lg:sticky lg:bottom-0 xl:flex-row xl:items-center xl:justify-between"
        style={{ background: '#08080D', borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div>
          <p className="text-sm font-medium text-white">You&apos;re not ranked yet</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>Enter a tournament to start climbing the leaderboard</p>
        </div>
        <button
          onClick={() => openModal('register')}
          className="min-h-11 lg:min-h-0 shrink-0 text-[#08080D] text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          style={{ background: '#F0B429' }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#D4A017')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = '#F0B429')}
        >
          Start competing
        </button>
      </div>

    </div>
  )
}
