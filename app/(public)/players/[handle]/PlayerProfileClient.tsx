'use client'

import PreviewBadge from '@/components/ui/PreviewBadge'

import { brand } from '@/lib/brand'

import React, { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CheckmarkCircle01Icon,
  Compass01Icon,
  GameController02Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { PlayerData, tierColors } from '@/lib/playersData'
import { useAuthStore } from '@/store/useAuthStore'

const TABS = ['Overview', 'Match History', 'Achievements', 'Teams'] as const
type Tab = (typeof TABS)[number]

const RARITY_COLORS = {
  legendary: { bg: 'rgba(240,180,41,0.15)',  text: '#F0B429', border: 'rgba(240,180,41,0.30)'  },
  epic:      { bg: 'rgba(167,139,250,0.15)', text: '#A78BFA', border: 'rgba(167,139,250,0.30)' },
  rare:      { bg: 'rgba(96,165,250,0.15)',  text: '#60A5FA', border: 'rgba(96,165,250,0.30)'  },
  common:    { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.40)', border: 'rgba(255,255,255,0.10)' },
}

export default function PlayerProfileClient({ player }: { player: PlayerData }) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const { openModal } = useAuthStore()
  const tc = tierColors[player.tier]

  return (
    <div className="flex flex-col">
      <div className="w-full min-w-0 p-4 sm:p-6 flex flex-col gap-0">

        {/* Banner */}
        <div className="relative">
          <div
            className="h-[180px] rounded-xl overflow-hidden relative"
            style={{
              background: `linear-gradient(135deg, ${tc.glow}, rgba(13,13,20,0.8))`,
              border: `0.5px solid ${tc.border}`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                opacity: 0.05,
              }}
            />
            <div
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-[44px] sm:text-[80px] font-medium select-none"
              style={{ color: tc.text, opacity: 0.10 }}
            >
              {player.tier}
            </div>
            <div
              className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg px-3 py-1.5"
              style={{ background: 'rgba(0,0,0,0.40)', border: '1px solid rgba(255,255,255,0.10)' }}
            >
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} color="#F0B429" strokeWidth={1.5} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.70)' }}>
                Ranked <span className="text-white font-medium">#{player.leaderboardRank}</span> on {brand.name}
              </span>
            </div>
          </div>

          {/* Avatar overlapping banner */}
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <img
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.handle}&backgroundColor=0D0D14`}
                loading="lazy"
                width={88}
                height={88}
                className="rounded-full"
                style={{ border: `3px solid ${tc.text}` }}
                alt={player.displayName}
              />
              <div
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full"
                style={{ background: '#FF4D6D', border: '2px solid #08080D' }}
              />
            </div>
          </div>
        </div>

        {/* Player info row */}
        <div
          className="pt-16 pb-5 flex min-w-0 flex-col items-start gap-4 xl:flex-row xl:items-end xl:justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-medium text-white break-words">{player.displayName} <PreviewBadge /></h1>
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} color="#F0B429" strokeWidth={1.5} />
              <span
                className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={{ background: tc.bg, color: tc.text, border: `0.5px solid ${tc.border}` }}
              >
                {player.rank}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: 'rgba(255,255,255,0.40)' }}>
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Compass01Icon} size={12} color="currentColor" strokeWidth={1.5} />
                {player.city}, {player.region}
              </span>
              <span>·</span>
              <span>{player.primaryGame}</span>
              <span>·</span>
              <span>Joined {player.joinedDate}</span>
              {player.team && (
                <>
                  <span>·</span>
                  <span style={{ color: '#F0B429' }}>{player.team}</span>
                </>
              )}
            </div>
            <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.50)' }}>{player.bio}</p>
          </div>
          <div className="flex w-full items-center gap-2 xl:w-auto xl:flex-shrink-0 xl:ml-6">
            <button
              className="min-h-11 flex-1 text-xs px-4 py-2 rounded-lg transition-colors xl:flex-none lg:min-h-0"
              style={{ border: '1px solid rgba(255,255,255,0.20)', color: 'rgba(255,255,255,0.70)', background: 'transparent' }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
            >
              Follow
            </button>
            <button
              className="min-h-11 flex-1 text-xs font-medium px-4 py-2 rounded-lg xl:flex-none lg:min-h-0"
              style={{ background: '#F0B429', color: '#08080D' }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#D4A017')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = '#F0B429')}
              onClick={() => openModal('register')}
            >
              Challenge
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div
          className="grid min-w-0 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          {[
            { label: 'Total earnings',  value: player.totalEarnings,             gold: true  },
            { label: 'Tournaments',     value: String(player.tournamentsPlayed),  gold: false },
            { label: 'Win rate',        value: player.winRate,                   gold: false },
            { label: 'Wins',            value: String(player.wins),              gold: false },
            { label: 'Losses',          value: String(player.losses),            gold: false },
            { label: 'Current streak',  value: `${player.currentStreak}W`,       gold: player.streakType === 'win' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-4 px-3"
              style={{ borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
            >
              <p className="text-lg font-medium" style={{ color: stat.gold ? '#F0B429' : '#fff' }}>{stat.value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div
          className="flex max-w-full items-center gap-1 overflow-x-auto pt-1"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          {TABS.map(tab => (
            <button
              key={tab}
              aria-pressed={activeTab === tab} onClick={() => setActiveTab(tab)}
              className="min-h-11 lg:min-h-0 shrink-0 px-3 sm:px-4 py-2.5 text-xs font-medium transition-colors relative"
              style={{ color: activeTab === tab ? '#F0B429' : 'rgba(255,255,255,0.40)' }}
            >
              {tab}
              {activeTab === tab && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                  style={{ background: '#F0B429' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'Overview'      && <OverviewTab      player={player} setActiveTab={setActiveTab} />}
        {activeTab === 'Match History' && <MatchHistoryTab  player={player} />}
        {activeTab === 'Achievements'  && <AchievementsTab  player={player} />}
        {activeTab === 'Teams'         && <TeamsTab         player={player} openModal={openModal} />}

      </div>
    </div>
  )
}

/* ---------- Overview ---------- */
function OverviewTab({ player, setActiveTab }: { player: PlayerData; setActiveTab: (tab: Tab) => void }) {
  const tc = tierColors[player.tier]
  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 pt-6 xl:grid-cols-3">
      {/* Left col */}
      <div className="min-w-0 xl:col-span-2 flex flex-col gap-4">

        {/* Rank progress */}
        <div
          className="rounded-xl p-5"
          style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Rank progress</h3>
            <span className="text-xs" style={{ color: tc.text }}>{player.rank}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${player.tierProgress}%`, background: tc.text }}
            />
          </div>
          <div className="flex justify-between text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <span>{player.tier}</span>
            <span>{player.tierProgress}% to next tier</span>
          </div>
        </div>

        {/* Recent matches */}
        <div
          className="rounded-xl p-5"
          style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Recent matches</h3>
            <button
              className="text-xs transition-colors"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.60)')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)')}
              onClick={() => setActiveTab('Match History')}
            >
              View all →
            </button>
          </div>
          <div className="flex flex-col">
            {player.matchHistory.slice(0, 3).map((match, i) => (
              <div
                key={match.id}
                className="flex min-w-0 items-center justify-between gap-3 py-2.5"
                style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 rounded-full flex-shrink-0"
                    style={{ height: 32, background: match.result === 'win' ? '#10B981' : '#FF4D6D' }}
                  />
                  <div>
                    <p className="text-xs font-medium text-white">{match.tournament}</p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.40)' }}>
                      vs {match.opponent} · {match.round}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="col-start-2 text-xs font-medium xl:col-auto" style={{ color: match.result === 'win' ? '#10B981' : '#FF4D6D' }}>
                    {match.result === 'win' ? 'WIN' : 'LOSS'}
                  </p>
                  {match.prize !== '—' && (
                    <p className="text-[10px]" style={{ color: '#F0B429' }}>{match.prize}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right col */}
      <div className="flex flex-col gap-4">

        {/* W/L chart */}
        <div
          className="rounded-xl p-5"
          style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h3 className="text-sm font-medium text-white mb-4">Win / Loss</h3>
          <div className="flex items-end gap-2 mb-2" style={{ height: 80 }}>
            <div
              className="flex-1 rounded-t-md"
              style={{
                height: `${(player.wins / player.tournamentsPlayed) * 80}px`,
                background: '#10B981',
              }}
            />
            <div
              className="flex-1 rounded-t-md"
              style={{
                height: `${(player.losses / player.tournamentsPlayed) * 80}px`,
                background: '#FF4D6D',
              }}
            />
          </div>
          <div className="flex justify-between text-[10px]">
            <span style={{ color: '#10B981' }}>{player.wins} Wins</span>
            <span style={{ color: '#FF4D6D' }}>{player.losses} Losses</span>
          </div>
        </div>

        {/* Vertical */}
        <div
          className="rounded-xl p-5"
          style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Competing in</h3>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(240,180,41,0.15)' }}
            >
              <HugeiconsIcon icon={GameController02Icon} size={16} color="#F0B429" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-medium text-white">{player.vertical}</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.40)' }}>{player.primaryGame}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Match History ---------- */
function MatchHistoryTab({ player }: { player: PlayerData }) {
  return (
    <div className="pt-6">
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="hidden gap-4 px-5 py-3 xl:grid"
          style={{
            gridTemplateColumns: '20px 1fr 120px 120px 100px 80px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {['', 'Tournament', 'Game', 'Round', 'Prize', 'Result'].map(h => (
            <span key={h} className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.30)' }}>
              {h}
            </span>
          ))}
        </div>
        {player.matchHistory.map((match, i) => (
          <div
            key={match.id}
            className="grid grid-cols-[8px_minmax(0,1fr)] gap-x-3 gap-y-2 px-4 py-4 items-center transition-colors xl:grid-cols-[20px_minmax(0,1fr)_120px_120px_100px_80px] xl:gap-4 xl:px-5 xl:py-3"
            style={{
              borderBottom: i < player.matchHistory.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)')}
            onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: match.result === 'win' ? '#10B981' : '#FF4D6D' }}
            />
            <div>
              <p className="text-xs font-medium text-white">{match.tournament}</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.40)' }}>
                vs {match.opponent} · {match.date}
              </p>
            </div>
            <span className="col-start-2 text-xs xl:col-auto" style={{ color: 'rgba(255,255,255,0.50)' }}><span className="xl:hidden">Game: </span>{match.game}</span>
            <span className="col-start-2 text-xs xl:col-auto" style={{ color: 'rgba(255,255,255,0.50)' }}><span className="xl:hidden">Round: </span>{match.round}</span>
            <span className="col-start-2 text-xs xl:col-auto" style={{ color: '#F0B429' }}><span className="xl:hidden">Prize: </span>{match.prize}</span>
            <span className="col-start-2 text-xs font-medium xl:col-auto" style={{ color: match.result === 'win' ? '#10B981' : '#FF4D6D' }}>
              {match.result === 'win' ? 'WIN' : 'LOSS'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Achievements ---------- */
function AchievementsTab({ player }: { player: PlayerData }) {
  return (
    <div className="pt-6 grid min-w-0 grid-cols-1 gap-3 min-[400px]:grid-cols-2 xl:grid-cols-4">
      {player.achievements.map(achievement => {
        const rarity = RARITY_COLORS[achievement.rarity]
        return (
          <div
            key={achievement.id}
            className="rounded-xl p-4 flex flex-col items-center text-center gap-2"
            style={{
              background: achievement.earned ? (achievement.rarity === 'common' ? '#111118' : rarity.bg) : '#111118',
              border: `1px solid ${achievement.earned ? rarity.border : 'rgba(255,255,255,0.05)'}`,
              opacity: achievement.earned ? 1 : 0.4,
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: achievement.earned ? rarity.bg : 'rgba(255,255,255,0.05)' }}
            >
              <HugeiconsIcon
                icon={achievement.icon}
                size={20}
                color={achievement.earned ? rarity.text : 'rgba(255,255,255,0.30)'}
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-white">{achievement.name}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>{achievement.description}</p>
            </div>
            {achievement.earned ? (
              <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.30)' }}>{achievement.earnedDate}</span>
            ) : (
              <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.20)' }}>Locked</span>
            )}
            <span
              className="text-[9px] px-2 py-0.5 rounded-full"
              style={{ background: rarity.bg, color: rarity.text }}
            >
              {achievement.rarity}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ---------- Teams ---------- */
function TeamsTab({ player, openModal }: { player: PlayerData; openModal: (view: 'register' | 'login') => void }) {
  return (
    <div className="pt-6">
      {player.team ? (
        <div
          className="rounded-xl p-5 flex items-center gap-4"
          style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(240,180,41,0.15)', border: '1px solid rgba(240,180,41,0.30)' }}
          >
            <HugeiconsIcon icon={UserGroupIcon} size={24} color="#F0B429" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-medium text-white mb-0.5">{player.team}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>Active team · Gaming vertical</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <HugeiconsIcon icon={UserGroupIcon} size={24} color="rgba(255,255,255,0.20)" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-white mb-1">Not on a team yet</p>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Join or create a team to compete in team tournaments
          </p>
          <button
            className="text-xs font-medium px-5 py-2 rounded-lg"
            style={{ background: '#F0B429', color: '#08080D' }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#D4A017')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = '#F0B429')}
            onClick={() => openModal('register')}
          >
            Join a team
          </button>
        </div>
      )}
    </div>
  )
}
