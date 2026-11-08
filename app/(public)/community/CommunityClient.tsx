'use client'

import Image from 'next/image'

import PreviewBadge from '@/components/ui/PreviewBadge'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { EyeIcon, Sent02Icon, UserGroupIcon } from '@hugeicons/core-free-icons'
import { communityData, type CommunityMessage } from '@/lib/communityData'

const DICEBEAR = (seed: string) =>
  `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=0D0D14`

const NEW_MSG_POOL = [
  { user: '@GhostAlpha',    userSeed: 'GhostAlpha',    text: 'this platform is built different fr' },
  { user: '@ZuluSquad',     userSeed: 'ZuluSquad',     text: 'Season 1 is going to be crazy' },
  { user: '@AfroBeatz',     userSeed: 'AfroBeatz',     text: "who's entering the next tournament?" },
  { user: '@QueenPlays',    userSeed: 'QueenPlays',    text: 'Lagos gamers rise up 🔥' },
  { user: '@ProCoderLagos', userSeed: 'ProCoderLagos', text: 'building something big, watch this space' },
  { user: '@KanoKing',      userSeed: 'KanoKing',      text: 'North Nigeria in the building 🙌' },
]

export default function CommunityClient() {
  const [activeVertical, setActiveVertical] = useState('gaming')
  const [activeRoom, setActiveRoom]         = useState('gaming-general')
  const [inputValue, setInputValue]         = useState('')
  const [displayedMessages, setDisplayedMessages] = useState<CommunityMessage[]>([])
  const messagesRef = useRef<HTMLDivElement>(null)

  const currentVertical = communityData.find(v => v.id === activeVertical)!
  const currentRoom     = currentVertical.rooms.find(r => r.id === activeRoom)!

  const onlineMembers = useMemo(() => {
    const seen = new Set<string>()
    const members: { name: string; seed: string }[] = []
    currentRoom.messages.forEach(m => {
      if (!seen.has(m.userSeed)) {
        seen.add(m.userSeed)
        members.push({ name: m.user, seed: m.userSeed })
      }
    })
    const extras = [
      { name: '@NaijaNinja',  seed: 'NaijaNinja'  },
      { name: '@LagosVibes',  seed: 'LagosVibes'  },
      { name: '@AbujaCoder',  seed: 'AbujaCoder'  },
      { name: '@DrumKingKano', seed: 'DrumKingKano' },
    ]
    extras.forEach(e => {
      if (!seen.has(e.seed)) {
        seen.add(e.seed)
        members.push(e)
      }
    })
    return members.slice(0, currentRoom.online)
  }, [currentRoom])

  useEffect(() => {
    setDisplayedMessages(currentRoom.messages)
    setInputValue('')
  }, [currentRoom])

  useEffect(() => {
    const messages = messagesRef.current
    messages?.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' })
  }, [displayedMessages])

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentRoom.readOnly) return
      const pool = NEW_MSG_POOL
      const randomMsg = pool[Math.floor(Math.random() * pool.length)]
      const newMessage: CommunityMessage = {
        id: Date.now().toString(),
        ...randomMsg,
        timestamp: 'just now',
      }
      setDisplayedMessages(prev => [...prev, newMessage].slice(-50))
    }, 6000)
    return () => clearInterval(timer)
  }, [activeRoom, currentRoom.readOnly])

  function handleSend() {
    if (!inputValue.trim()) return
    const newMsg: CommunityMessage = {
      id: Date.now().toString(),
      user: 'You',
      userSeed: 'currentuser',
      text: inputValue,
      timestamp: 'just now',
    }
    setDisplayedMessages(prev => [...prev, newMsg])
    setInputValue('')
  }

  const bgWhite6 = { background: 'rgba(255,255,255,0.06)' }
  const bgWhite3 = { background: 'rgba(255,255,255,0.03)' }

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden lg:flex-row">
      <div className="shrink-0 border-b border-white/[0.07] bg-kv-surface p-3 lg:hidden">
        <div className="grid grid-cols-2 gap-2">
          <label className="min-w-0 text-[10px] uppercase tracking-wider text-white/40">
            Vertical
            <select aria-label="Community vertical" value={activeVertical} onChange={event => {
              const vertical = communityData.find(item => item.id === event.target.value)!
              setActiveVertical(vertical.id)
              setActiveRoom(vertical.rooms[0].id)
            }} className="mt-1 min-h-11 w-full min-w-0 rounded-lg border border-white/10 bg-kv-base px-2 text-white">
              {communityData.map(vertical => <option key={vertical.id} value={vertical.id}>{vertical.label}</option>)}
            </select>
          </label>
          <label className="min-w-0 text-[10px] uppercase tracking-wider text-white/40">
            Room
            <select aria-label="Community room" value={activeRoom} onChange={event => setActiveRoom(event.target.value)} className="mt-1 min-h-11 w-full min-w-0 rounded-lg border border-white/10 bg-kv-base px-2 text-white">
              {currentVertical.rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
            </select>
          </label>
        </div>
        <details className="mt-1 text-xs text-white/60">
          <summary className="min-h-11 cursor-pointer py-3">Online members ({currentRoom.online})</summary>
          <div className="flex max-h-[25dvh] flex-wrap gap-2 overflow-y-auto pb-2">
            {onlineMembers.map(member => <span key={member.seed} className="rounded-md bg-white/5 px-2 py-2">{member.name}</span>)}
          </div>
        </details>
      </div>

      {/* Rooms sidebar */}
      <div
        className="hidden w-[220px] flex-shrink-0 flex-col bg-kv-surface lg:flex"
        style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Vertical tabs */}
        <div className="pt-2 pb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[10px] text-white/25 uppercase tracking-wider px-4 pb-1.5">Verticals</p>
          {communityData.map((vertical) => {
            const isActive = activeVertical === vertical.id
            return (
              <button
                key={vertical.id}
                onClick={() => { setActiveVertical(vertical.id); setActiveRoom(vertical.rooms[0].id) }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-left transition-colors"
                style={{ background: isActive ? 'rgba(240,180,41,0.07)' : 'transparent' }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <span
                  className="text-[12px] font-medium"
                  style={{ color: isActive ? '#F0B429' : 'rgba(255,255,255,0.45)' }}
                >
                  {vertical.label}
                </span>
                <span className="ml-auto text-[10px]" style={{ color: 'rgba(255,255,255,0.20)' }}>
                  {vertical.rooms.length}
                </span>
              </button>
            )
          })}
        </div>

        {/* Rooms list */}
        <div className="flex-1 overflow-y-auto p-2" style={{ scrollbarWidth: 'none' }}>
          <p className="text-[10px] text-white/25 uppercase tracking-wider px-2 py-2">Rooms</p>
          {currentVertical.rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors mb-0.5"
              style={{ background: activeRoom === room.id ? 'rgba(240,180,41,0.10)' : 'transparent' }}
              onMouseEnter={e => {
                if (activeRoom !== room.id) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={e => {
                if (activeRoom !== room.id) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                }
              }}
            >
              <HugeiconsIcon icon={room.icon} size={15} color={activeRoom === room.id ? '#F0B429' : 'rgba(255,255,255,0.40)'} strokeWidth={1.5} className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: activeRoom === room.id ? '#F0B429' : 'rgba(255,255,255,0.70)' }}
                >
                  {room.name}
                </p>
                <p className="text-[10px] text-white/30">{room.online} online</p>
              </div>
              {room.readOnly && (
                <HugeiconsIcon icon={EyeIcon} size={10} color="rgba(255,255,255,0.20)" strokeWidth={1.5} />
              )}
            </button>
          ))}
        </div>

        {/* User bar */}
        <div
          className="p-3 flex items-center gap-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Image
            src={DICEBEAR('currentuser')}
            width={28} height={28}
            className="rounded-full flex-shrink-0"
            loading="lazy"
            alt="Your sample avatar" unoptimized sizes="28px" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">You</p>
            <p className="text-[10px]" style={{ color: '#10B981' }}>● Online</p>
          </div>
        </div>
      </div>

      {/* Main chat */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0 lg:h-full">

        {/* Room header */}
        <div
          className="px-4 lg:px-5 py-3 flex flex-col gap-2 items-start justify-between flex-shrink-0 xl:flex-row xl:items-center"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex min-w-0 items-center gap-2">
            <HugeiconsIcon icon={currentRoom.icon} size={18} color="rgba(255,255,255,0.60)" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium text-white">{currentRoom.name} <PreviewBadge /></p>
              <p className="text-[10px] text-white/35">{currentRoom.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/35">
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={UserGroupIcon} size={12} color="currentColor" strokeWidth={1.5} />
              {currentRoom.members.toLocaleString()} members
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981' }} />
              {currentRoom.online} online
            </span>
          </div>
        </div>

        {/* Messages */}
        <div ref={messagesRef} className="flex-1 min-h-0 overflow-y-auto p-4 lg:p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-[10px] text-white/25">Today</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {displayedMessages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.isSystem ? 'opacity-80' : ''}`}>
              <Image
                src={DICEBEAR(msg.userSeed)}
                width={32} height={32}
                loading="lazy"
                className="rounded-full flex-shrink-0"
                alt={msg.user}
                style={msg.isSystem ? { border: '1px solid rgba(240,180,41,0.30)' } : {}} unoptimized sizes="32px" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className="text-xs font-medium"
                    style={{ color: msg.isSystem ? '#F0B429' : '#fff' }}
                  >
                    {msg.user}
                  </span>
                  {msg.isSystem && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(240,180,41,0.20)', color: '#F0B429' }}
                    >
                      Official
                    </span>
                  )}
                  <span className="text-[10px] text-white/25">{msg.timestamp}</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed break-words">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input / read-only */}
        {currentRoom.readOnly ? (
          <div
            className="shrink-0 px-3 lg:px-5 py-3 lg:py-4 flex items-center gap-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)', ...bgWhite3 }}
          >
            <HugeiconsIcon icon={EyeIcon} size={14} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
            <p className="text-xs text-white/30">This is a read-only announcements channel</p>
          </div>
        ) : (
          <div
            className="shrink-0 px-3 lg:px-5 py-3 lg:py-4 flex items-center gap-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Image
              src={DICEBEAR('currentuser')}
              width={28} height={28}
              loading="lazy"
              className="rounded-full flex-shrink-0"
              alt="Your sample avatar" unoptimized sizes="28px" />
            <div className="min-w-0 flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                aria-label={`Message ${currentRoom.name}`} placeholder={`Message ${currentRoom.name}...`}
                className="min-h-11 lg:min-h-0 min-w-0 w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none transition-colors pr-10"
                style={{
                  ...bgWhite6,
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: '#fff',
                  caretColor: '#F0B429',
                }}
                onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(240,180,41,0.40)' }}
                onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.10)' }}
              />
              <button
                onClick={handleSend}
                aria-label="Send message" className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center transition-colors"
                style={{ color: 'rgba(255,255,255,0.30)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.70)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.30)' }}
              >
                <HugeiconsIcon icon={Sent02Icon} size={16} color="currentColor" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Members panel */}
      <div
        className="hidden w-[200px] flex-shrink-0 flex-col bg-kv-surface h-full overflow-hidden lg:flex"
        style={{ borderLeft: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-xs font-medium text-white">Members</p>
          <p className="text-[10px] text-white/35 mt-0.5">{currentRoom.online} online</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: 'none' }}>
          <p className="text-[10px] text-white/25 uppercase tracking-wider px-1 mb-2">
            Online — {currentRoom.online}
          </p>
          {onlineMembers.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <div className="relative flex-shrink-0">
                <Image
                  src={DICEBEAR(member.seed)}
                  width={28} height={28}
                  loading="lazy"
                  className="rounded-full"
                  alt={member.name} unoptimized sizes="28px" />
                <div
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
                  style={{ background: '#10B981', border: '2px solid #0D0D14' }}
                />
              </div>
              <span className="text-xs text-white/60 truncate">{member.name}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
