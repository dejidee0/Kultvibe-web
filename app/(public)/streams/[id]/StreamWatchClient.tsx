'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  EyeIcon,
  VolumeHighIcon,
  VolumeOffIcon,
  FullScreenIcon,
  SidebarRightIcon,
  GiftIcon,
  Notification01Icon,
} from '@hugeicons/core-free-icons'
import { type StreamData, streamsData } from '@/lib/streamsData'
import LiveChat from '@/components/stream/LiveChat'
import GiftAnimation from '@/components/stream/GiftAnimation'
import GiftPicker from '@/components/stream/GiftPicker'
import StreamCard from '@/components/ui/StreamCard'
import SocialIcon from '@/components/ui/SocialIcon'
import { useGiftStore } from '@/store/useGiftStore'
import { useAuthStore } from '@/store/useAuthStore'

function fmtViewers(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)
}

function useTimer() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#F0B429" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="6" />
      <path d="M4.5 7l2 2 3-3" />
    </svg>
  )
}

export default function StreamWatchClient({ stream }: { stream: StreamData }) {
  const [isMuted, setIsMuted] = useState(true)
  const [theatreMode, setTheatreMode] = useState(false)
  const [mobilePanel, setMobilePanel] = useState<'about' | 'chat'>('chat')
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { openPicker } = useGiftStore()
  const { openModal } = useAuthStore()
  const timer = useTimer()

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  const related = streamsData.filter(s => s.id !== stream.id).slice(0, 4)

  const goalPct = Math.min(100, (stream.goal.current / stream.goal.target) * 100)

  return (
    <div className="flex min-w-0 flex-col lg:h-full lg:flex-row lg:overflow-hidden">

      {/* ---- Main column ---- */}
      <div className={`flex min-w-0 flex-col lg:flex-1 lg:overflow-hidden no-scrollbar ${!theatreMode ? 'lg:overflow-y-auto' : ''}`}>

        {/* Video area */}
        {stream.isLive ? (
          <div
            ref={containerRef}
            className={`relative aspect-video w-full flex-shrink-0 group bg-black lg:aspect-auto ${theatreMode ? 'lg:flex-1' : 'lg:h-[480px]'}`}
          >
            {stream.videoSrc ? (
              <video
                ref={videoRef}
                src={stream.videoSrc}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${stream.gradientFrom}, ${stream.gradientTo})` }}
              />
            )}

            {/* Vignette */}
            <div
              className="absolute inset-0 z-10"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }}
            />

            {/* Top-left: LIVE + timer */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
              <span className="bg-[#FF4D6D] text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
              <span
                className="text-xs text-white/80 rounded px-2 py-1"
                style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(6px)' }}
              >
                {timer}
              </span>
            </div>

            {/* Top-right: viewer count */}
            <div
              className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded px-2 py-1"
              style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(6px)' }}
            >
              <HugeiconsIcon icon={EyeIcon} size={12} color="rgba(255,255,255,0.65)" strokeWidth={1.5} />
              <span className="text-xs text-white/85">{fmtViewers(stream.viewers)} viewers</span>
            </div>

            {/* Bottom-right controls */}
            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1">
              <button
                aria-label={isMuted ? 'Unmute stream' : 'Mute stream'} onClick={() => setIsMuted(m => !m)}
                className="flex h-11 w-11 items-center justify-center rounded-lg transition-colors text-white/60 lg:h-auto lg:w-auto lg:p-2 hover:text-white hover:bg-white/10"
              >
                <HugeiconsIcon icon={isMuted ? VolumeOffIcon : VolumeHighIcon} size={16} color="currentColor" strokeWidth={1.5} />
              </button>
              <button
                aria-label="Send a gift" onClick={openPicker}
                className="flex h-11 w-11 items-center justify-center rounded-lg transition-colors text-white/60 lg:h-auto lg:w-auto lg:p-2 hover:text-white hover:bg-white/10"
              >
                <HugeiconsIcon icon={GiftIcon} size={16} color="currentColor" strokeWidth={1.5} />
              </button>
              <button
                aria-label="Fullscreen stream" onClick={toggleFullscreen}
                className="flex h-11 w-11 items-center justify-center rounded-lg transition-colors text-white/60 lg:h-auto lg:w-auto lg:p-2 hover:text-white hover:bg-white/10"
              >
                <HugeiconsIcon icon={FullScreenIcon} size={16} color="currentColor" strokeWidth={1.5} />
              </button>
              <button
                aria-label="Toggle theatre mode" onClick={() => setTheatreMode(t => !t)}
                className={`hidden p-2 rounded-lg transition-colors lg:block ${theatreMode ? 'text-yellow-400 bg-yellow-500/10' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                <HugeiconsIcon icon={SidebarRightIcon} size={16} color="currentColor" strokeWidth={1.5} />
              </button>
            </div>

            {/* Theatre mode exit overlay */}
            {theatreMode && (
              <button
                onClick={() => setTheatreMode(false)}
                className="absolute top-3 left-1/2 -translate-x-1/2 z-20 text-xs text-white/60 hover:text-white px-3 py-1 rounded-md transition-colors"
                style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
              >
                Exit theatre mode
              </button>
            )}

            {/* Gift overlays */}
            <GiftAnimation />
            <GiftPicker />
          </div>
        ) : (
          <div
            className="relative min-h-[280px] px-4 py-6 lg:h-[480px] flex flex-shrink-0 flex-col items-center justify-center gap-4"
            style={{ background: 'linear-gradient(135deg, #0D0D14, #111118)' }}
          >
            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${stream.streamer}&backgroundColor=0D0D14`}
              loading="lazy"
              width={80}
              height={80}
              className="rounded-full"
              style={{ border: '2px solid rgba(255,255,255,0.10)' }}
              alt={stream.streamer}
            />
            <div className="text-center">
              <p className="text-base font-medium text-white mb-1">{stream.streamer} is offline</p>
              <p className="text-sm text-white/40">Last seen streaming {stream.game}</p>
            </div>
            <button
              onClick={() => openModal('register')}
              className="mt-2 text-sm px-5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.60)' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(240,180,41,0.40)'
                e.currentTarget.style.color = '#F0B429'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.60)'
              }}
            >
              <HugeiconsIcon icon={Notification01Icon} size={14} color="currentColor" strokeWidth={1.5} />
              Notify me when live
            </button>
          </div>
        )}

        {(!theatreMode || !stream.isLive) && (
          <>
            {/* Streamer info bar */}
            <div
              className="flex min-w-0 flex-col items-stretch gap-3 px-4 py-3 flex-shrink-0 xl:flex-row xl:items-center xl:justify-between xl:px-5"
              style={{
                background: 'rgba(13,13,20,0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="flex min-w-0 flex-wrap items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${stream.streamer}&backgroundColor=0D0D14`}
                  loading="lazy"
                  width={40}
                  height={40}
                  className="rounded-full flex-shrink-0"
                  alt={stream.streamer}
                />
                <div>
                  <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                    <Link href={`/players/${stream.id}`} className="text-base font-semibold text-white hover:text-[#F0B429] transition-colors">{stream.streamer}</Link>
                    <CheckIcon />
                    {stream.isLive && (
                      <span className="text-[10px] bg-[#FF4D6D] text-white px-2 py-0.5 rounded font-bold">LIVE</span>
                    )}
                  </div>
                  <p className="text-xs text-white/40">{stream.followers} followers</p>
                </div>
                <span
                  className="text-xs text-yellow-400 rounded-md ml-1 px-2 py-1"
                  style={{ background: 'rgba(240,180,41,0.15)', border: '1px solid rgba(240,180,41,0.30)' }}
                >
                  {stream.game}
                </span>
              </div>
              <div className="flex min-w-0 items-center gap-2">
                <button
                  className="min-h-11 flex-1 text-xs text-white/70 rounded-md px-4 py-1.5 xl:flex-none lg:min-h-0 transition-colors hover:bg-white/5"
                  style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  Follow
                </button>
                <button
                  className="min-h-11 flex-1 text-xs font-medium px-4 py-1.5 rounded-md xl:flex-none lg:min-h-0 transition-colors"
                  style={{ background: '#F0B429', color: '#08080D' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#D4A017')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#F0B429')}
                >
                  Subscribe
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-b border-white/10 p-3 lg:hidden" role="group" aria-label="Stream panels">
              <button type="button" aria-pressed={mobilePanel === 'chat'} onClick={() => setMobilePanel('chat')} className={'min-h-11 rounded-lg text-sm ' + (mobilePanel === 'chat' ? 'bg-kv-gold/15 text-kv-gold' : 'text-white/50')}>{stream.isLive ? 'Live chat' : 'Stream activity'}</button>
              <button type="button" aria-pressed={mobilePanel === 'about'} onClick={() => setMobilePanel('about')} className={'min-h-11 rounded-lg text-sm ' + (mobilePanel === 'about' ? 'bg-kv-gold/15 text-kv-gold' : 'text-white/50')}>About</button>
            </div>

            {/* About section */}
            <div
              className={`min-w-0 px-4 sm:px-5 py-5 flex-shrink-0 ${mobilePanel === 'about' ? 'block' : 'hidden lg:block'}`}
              style={{
                background: '#111118',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-white">About {stream.streamer}</h3>
                <CheckIcon />
                <span className="text-xs text-white/35">· {stream.followers} followers</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-4">{stream.bio}</p>

              {/* Socials */}
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                {stream.socials.map(social => (
                  <a
                    key={social.platform}
                    href={social.url}
                    className="flex items-center gap-1.5 text-xs text-white/50 hover:text-yellow-400 transition-colors rounded-md px-3 py-1.5"
                    style={{ border: '1px solid rgba(255,255,255,0.09)' }}
                  >
                    <SocialIcon platform={social.platform} />
                    {social.platform}
                  </a>
                ))}
              </div>

              {/* Goal progress */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs text-white/55">{stream.goal.label}</span>
                  <span className="text-xs font-semibold text-white">
                    {stream.goal.current.toLocaleString()} / {stream.goal.target.toLocaleString()}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="h-full rounded-full bg-[#F0B429] transition-all duration-700"
                    style={{ width: `${goalPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Related streams */}
            <div
              className={`min-w-0 px-4 sm:px-5 py-5 ${mobilePanel === 'about' ? 'block' : 'hidden lg:block'}`}
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
              <h3 className="text-sm font-semibold text-white mb-3">More like this</h3>
              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {related.map(s => (
                  <StreamCard
                    key={s.id}
                    id={s.id}
                    title={s.title}
                    streamer={s.streamer}
                    city={s.city}
                    viewers={s.viewers}
                    game={s.game}
                    tags={s.tags}
                    videoSrc={s.videoSrc}
                    gradientFrom={s.gradientFrom}
                    gradientTo={s.gradientTo}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ---- Chat sidebar ---- */}
      {(!theatreMode || !stream.isLive) && (
        <aside
          className={`h-[420px] w-full min-w-0 flex-shrink-0 flex-col overflow-hidden sm:h-[480px] lg:h-auto lg:w-[320px] ${mobilePanel === 'chat' ? 'flex' : 'hidden lg:flex'}`}
          aria-label={stream.isLive ? 'Live chat' : 'Stream activity'}
          style={{ borderLeft: '1px solid rgba(255,255,255,0.07)' }}
        >
          {stream.isLive ? (
            <LiveChat />
          ) : (
            <div className="flex flex-col h-full bg-[#111118]">
              <div
                className="flex items-center justify-between px-4 py-3 flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="font-medium text-white" style={{ fontSize: 13 }}>Stream Offline</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Back soon</span>
              </div>
              <div className="p-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <button
                  className="w-full text-sm font-medium py-2.5 rounded-lg mb-2 transition-colors"
                  style={{ background: '#F0B429', color: '#08080D' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#D4A017')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#F0B429')}
                >
                  Subscribe
                </button>
                <button
                  className="w-full text-sm py-2.5 rounded-lg transition-colors text-white/50 hover:text-white/80"
                  style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                >
                  Follow
                </button>
              </div>
              <div className="p-4 flex flex-col gap-3 flex-1">
                <p className="text-xs text-white/35 uppercase tracking-wider">Recent activity</p>
                {[
                  { label: 'Last streamed', value: '2 days ago' },
                  { label: 'Playing', value: stream.game },
                  { label: 'Followers', value: stream.followers },
                  { label: 'Win rate', value: '45%' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-white/35">{item.label}</span>
                    <span className="text-xs font-medium text-white">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <button
                  onClick={() => openModal('register')}
                  className="w-full text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  style={{ border: '1px solid rgba(240,180,41,0.30)', color: '#F0B429' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(240,180,41,0.10)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <HugeiconsIcon icon={Notification01Icon} size={13} color="currentColor" strokeWidth={1.5} />
                  Notify when live
                </button>
              </div>
            </div>
          )}
        </aside>
      )}
    </div>
  )
}
