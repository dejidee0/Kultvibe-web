'use client'

import PreviewBadge from '@/components/ui/PreviewBadge'

import React, { useState } from 'react'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Calendar01Icon,
  UserGroupIcon,
  CheckmarkCircle01Icon,
  GitBranchIcon,
  Medal01Icon,
  ArrowLeft01Icon,
} from '@hugeicons/core-free-icons'
import { type TournamentData, tournamentsData } from '@/lib/tournamentsData'
import TournamentCard from '@/components/ui/TournamentCard'
import { useAuthStore } from '@/store/useAuthStore'

const NAIJA_TAGS = [
  'ZeroCool_NG','NaijaKing','DragonFire01','ShadowXLagos','BladeRunner99',
  'PhantomNG','AbujaCrusher','EliteStar','XtermNG','AcePlayer1',
  'GhostMode99','NorthernKing','PH_Beast','LagosLegend','IbadanFC',
  'ViperNG01','ColdBlood_X','StormBreaker','QuickFingers','NaijaElite',
  'SilentKiller_NG','DarkHorse01','SavagePlay','TopNotch_NG','RoyalFlush',
  'NightCrawler','IronFist_PH','EagleEye_NG','ProGamer99','UrbanLegend',
]

export default function TournamentDetailClient({ tournament }: { tournament: TournamentData }) {
  const [activeTab, setActiveTab] = useState('overview')
  const { openModal } = useAuthStore()

  const filled = tournament.totalSpots - tournament.spotsLeft
  const pct = (filled / tournament.totalSpots) * 100

  const related = (() => {
    const seen = new Set<string>([tournament.id])
    const pick = (t: TournamentData) => !seen.has(t.id) && (seen.add(t.id), true)
    const byVerticalOrGame = tournamentsData.filter(
      t => (t.vertical === tournament.vertical || t.game === tournament.game) && pick(t)
    )
    const filler = tournamentsData.filter(t => pick(t))
    return [...byVerticalOrGame, ...filler].slice(0, 4)
  })()

  const displayCount = Math.min(filled, 24)
  const extraCount   = filled > 24 ? filled - 24 : 0

  const tabs = ['Overview', 'Bracket', 'Participants', 'Prizes']

  return (
    <div className="min-w-0 p-4 sm:p-6 flex flex-col gap-0">

      {/* Banner */}
      <div className="relative h-[340px] sm:h-[300px] xl:h-[280px] rounded-xl overflow-hidden mb-6">
        <img
          src={tournament.imageSrc}
          alt={tournament.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.40) 55%, rgba(0,0,0,0.10) 100%)' }} />

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <Link
            href="/compete"
            className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors px-2.5 py-1.5 rounded-md"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={12} color="currentColor" strokeWidth={2} />
            Back
          </Link>
          <span
            className="text-xs text-white/80 px-3 py-1.5 rounded-md"
            style={{ background: 'rgba(0,0,0,0.60)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            {tournament.game}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex min-w-0 flex-col items-start gap-4 sm:bottom-6 sm:left-6 sm:right-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-medium text-white mb-2 break-words">{tournament.name} <PreviewBadge /></h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2" style={{ color: 'rgba(255,255,255,0.60)', fontSize: 13 }}>
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Calendar01Icon} size={13} color="rgba(255,255,255,0.50)" strokeWidth={1.5} />
                Starts {tournament.startDate}
              </span>
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={UserGroupIcon} size={13} color="rgba(255,255,255,0.50)" strokeWidth={1.5} />
                {tournament.spotsLeft} spots left
              </span>
            </div>
          </div>
          <div className="text-left flex-shrink-0 sm:text-right sm:ml-6">
            <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.40)' }}>Total prize pool</p>
            <p className="text-3xl font-medium" style={{ color: '#F0B429' }}>{tournament.prize}</p>
          </div>
        </div>
      </div>

      {/* Quick stats + CTA */}
      <div
        className="rounded-xl p-4 sm:p-5 mb-6 flex min-w-0 flex-col items-stretch gap-5 xl:flex-row xl:items-center xl:justify-between"
        style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-4 xl:gap-8">
          <div>
            <p className="text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Entry fee</p>
            <p className="text-sm font-medium text-white">{tournament.entryFee}</p>
          </div>
          <div>
            <p className="text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Format</p>
            <p className="text-sm font-medium text-white">{tournament.format}</p>
          </div>
          <div>
            <p className="text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Platform</p>
            <p className="text-sm font-medium text-white">{tournament.platform}</p>
          </div>
          <div>
            <p className="text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Spots filled</p>
            <p className="text-sm font-medium text-white">{filled}/{tournament.totalSpots}</p>
          </div>
        </div>
        <button
          onClick={() => openModal('register')}
          className="min-h-11 font-medium px-8 py-3 rounded-lg text-sm transition-colors flex-shrink-0 xl:ml-8"
          style={{ background: '#F0B429', color: '#08080D' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#D4A017' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F0B429' }}
        >
          Register now
        </button>
      </div>

      {/* Tabs */}
      <div className="flex max-w-full items-center gap-1 overflow-x-auto mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {tabs.map(tab => {
          const key = tab.toLowerCase()
          const isActive = activeTab === key
          return (
            <button
              key={key}
              aria-pressed={isActive} onClick={() => setActiveTab(key)}
              className="min-h-11 shrink-0 px-3 sm:px-4 py-3 text-sm font-medium transition-colors"
              style={{
                borderBottom: isActive ? '2px solid #F0B429' : '2px solid transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.40)',
                marginBottom: -1,
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)' }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.40)' }}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="min-w-0 xl:col-span-2 flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-medium text-white mb-3">About this tournament</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>{tournament.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white mb-3">Rules</h3>
              <ul className="flex flex-col gap-3">
                {tournament.rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.60)' }}>
                    <span className="flex-shrink-0 mt-0.5">
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} size={15} color="#F0B429" strokeWidth={1.5} />
                    </span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="rounded-xl p-4 h-fit"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <h4 className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.60)' }}>Registration progress</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>{tournament.spotsLeft} spots left</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>{tournament.totalSpots} total</span>
            </div>
            <div className="h-1.5 rounded-full mb-4" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: '#F0B429' }} />
            </div>
            <button
              onClick={() => openModal('register')}
              className="w-full text-sm font-medium py-2.5 rounded-lg transition-colors"
              style={{ background: '#F0B429', color: '#08080D' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#D4A017' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F0B429' }}
            >
              Register now
            </button>
          </div>
        </div>
      )}

      {/* Tab: Bracket */}
      {activeTab === 'bracket' && (
        <div
          className="rounded-xl px-4 py-10 sm:p-12 flex flex-col items-center justify-center text-center"
          style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <HugeiconsIcon icon={GitBranchIcon} size={24} color="rgba(255,255,255,0.20)" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-white mb-1">Bracket not generated yet</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>The bracket will be available once registration closes</p>
        </div>
      )}

      {/* Tab: Participants */}
      {activeTab === 'participants' && (
        <div>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.40)' }}>
            {filled} registered {filled === 1 ? 'player' : 'players'}
          </p>
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: displayCount }).map((_, i) => {
              const name = NAIJA_TAGS[i % NAIJA_TAGS.length]
              return (
                <Link key={i} href={`/players/Player${i}`}>
                  <div
                    className="rounded-lg p-3 flex flex-col items-center gap-2 transition-colors"
                    style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(240,180,41,0.30)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)')}
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${name}${i}&backgroundColor=0D0D14`}
                      loading="lazy"
                      width={40}
                      height={40}
                      className="rounded-full"
                      alt={name}
                    />
                    <span className="text-xs truncate w-full text-center" style={{ color: 'rgba(255,255,255,0.70)' }}>
                      {name}
                    </span>
                  </div>
                </Link>
              )
            })}
            {extraCount > 0 && (
              <div
                className="rounded-lg p-3 flex flex-col items-center justify-center gap-1"
                style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-sm font-medium text-white">+{extraCount}</span>
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.40)' }}>more</span>
              </div>
            )}
            {filled === 0 && (
              <div className="col-span-full py-10 text-center">
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>No registrations yet. Be the first to jump in.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Prizes */}
      {activeTab === 'prizes' && (
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
          {tournament.prizeBreakdown.map((p, i) => (
            <div
              key={i}
              className="rounded-xl p-6 text-center flex flex-col items-center"
              style={{
                background: '#111118',
                border: i === 0 ? '1px solid rgba(240,180,41,0.40)' : '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: i === 0 ? 'rgba(240,180,41,0.20)' : i === 1 ? 'rgba(255,255,255,0.10)' : 'rgba(205,127,50,0.20)',
                }}
              >
                <HugeiconsIcon
                  icon={Medal01Icon}
                  size={22}
                  color={i === 0 ? '#F0B429' : i === 1 ? '#fff' : '#CD7F32'}
                  strokeWidth={1.5}
                />
              </div>
              <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.40)' }}>{p.place}</p>
              <p className="text-2xl font-medium" style={{ color: '#F0B429' }}>{p.amount}</p>
            </div>
          ))}
        </div>
      )}

      {/* Related tournaments */}
      {related.length > 0 && (
        <div className="mt-10 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-sm font-medium text-white mb-4">More in {tournament.vertical}</h3>
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {related.map(t => (
              <Link key={t.id} href={`/compete/${t.id}`} className="block">
                <TournamentCard
                  name={t.name}
                  game={t.game}
                  prize={t.prize}
                  spotsLeft={t.spotsLeft}
                  totalSpots={t.totalSpots}
                  imageSrc={t.imageSrc}
                />
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
