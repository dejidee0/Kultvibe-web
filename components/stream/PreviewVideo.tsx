'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { previewVideoIsGranted, registerPreviewVideo, syncPreviewVideos } from '@/lib/previewVideoCoordinator'

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string; downlink?: number }
type Environment = { mobile: boolean; coarse: boolean; reduced: boolean; saveData: boolean }
type Props = {
  videoSrc: string
  mobileSrc?: string
  posterSrc: string
  title: string
  sizes: string
  mode?: 'featured' | 'card'
  hovered?: boolean
  muted?: boolean
  priority?: boolean
}

export default function PreviewVideo({ videoSrc, mobileSrc, posterSrc, title, sizes, mode = 'card', hovered = false, muted = true, priority = false }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const manual = useRef(false)
  const pausedByUser = useRef(false)
  const previousMuted = useRef(muted)
  const [environment, setEnvironment] = useState<Environment | null>(null)
  const [visible, setVisible] = useState(false)
  const [entered, setEntered] = useState(false)
  const [playing, setPlaying] = useState(false)
  const flags = useRef({ environment, visible, hovered, muted, mode })
  flags.current = { environment, visible, hovered, muted, mode }

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = matchMedia('(hover: none), (pointer: coarse)')
    const connection = (navigator as Navigator & { connection?: Connection }).connection
    let previousRestricted = false
    function update() {
      const next = {
        mobile: !!connection?.saveData || innerWidth <= 640 || /(^|-)2g$|^3g$/.test(connection?.effectiveType || '') || (!!connection?.downlink && connection.downlink < 1.5),
        coarse: pointer.matches, reduced: motion.matches, saveData: !!connection?.saveData,
      }
      if ((next.reduced || next.saveData) && !previousRestricted) manual.current = false
      previousRestricted = next.reduced || next.saveData
      flags.current.environment = next
      setEnvironment(next)
      syncPreviewVideos()
    }
    function visibility() {
      if (document.hidden) manual.current = false
      syncPreviewVideos()
    }
    update()
    window.addEventListener('resize', update)
    motion.addEventListener('change', update)
    pointer.addEventListener('change', update)
    connection?.addEventListener('change', update)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      window.removeEventListener('resize', update)
      motion.removeEventListener('change', update)
      pointer.removeEventListener('change', update)
      connection?.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(([entry]) => {
      const next = entry.isIntersecting && entry.intersectionRatio >= 0.75
      flags.current.visible = next
      if (!next) manual.current = false
      if (next) setEntered(true)
      setVisible(next)
      syncPreviewVideos()
    }, { threshold: [0, 0.75, 1] })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  const ready = !!environment
  const source = environment?.mobile && mobileSrc ? mobileSrc : videoSrc
  useEffect(() => {
    const video = videoRef.current
    if (!video || !ready) return
    return registerPreviewVideo({
      video, source,
      canPlay: () => {
        const state = flags.current, preferences = state.environment
        const autoplay = preferences && !preferences.reduced && !preferences.saveData && state.muted && (state.mode === 'featured' || preferences.coarse || state.hovered)
        return !!preferences && state.visible && !document.hidden && !pausedByUser.current && (manual.current || !!autoplay)
      },
      rank: () => manual.current ? 1000 : flags.current.mode === 'featured' ? 100 : flags.current.hovered ? 50 : 0,
    })
  }, [entered, source, ready])

  useEffect(() => {
    if (previousMuted.current && !muted && videoRef.current && !videoRef.current.paused) manual.current = true
    previousMuted.current = muted
    syncPreviewVideos()
  }, [muted, hovered, visible])

  function togglePlayback() {
    if (videoRef.current && !videoRef.current.paused) {
      pausedByUser.current = true
      manual.current = false
    } else {
      pausedByUser.current = false
      manual.current = true
    }
    syncPreviewVideos()
  }

  return (
    <div ref={rootRef} data-preview-video data-video-mode={mode} className="group/video absolute inset-0 bg-black">
      <Image src={posterSrc} alt={`Preview frame from ${title}`} fill sizes={sizes} unoptimized priority={priority} className="object-contain" />
      {entered && environment && <video ref={videoRef} poster={posterSrc} loop muted={muted} playsInline preload={visible ? 'metadata' : 'none'} aria-label={`${title} — preview video`}
        data-mobile-variant={environment.mobile ? 'true' : 'false'} className="absolute inset-0 h-full w-full object-contain"
        onCanPlay={syncPreviewVideos} onPlay={event => { if (!previewVideoIsGranted(event.currentTarget)) event.currentTarget.pause(); else setPlaying(true) }} onPause={() => setPlaying(false)} />}
      {mode === 'featured' && <button type="button" aria-label={`${playing ? 'Pause' : 'Play'} preview: ${title}`} onClick={togglePlayback}
        className={`absolute left-1/2 top-1/2 z-30 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kv-gold ${playing ? 'opacity-0 hover:opacity-100 focus-visible:opacity-100 group-hover/video:opacity-100' : 'opacity-100'}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{playing ? <path d="M6 4h4v16H6zm8 0h4v16h-4z" /> : <path d="m7 3 15 9-15 9z" />}</svg>
      </button>}
    </div>
  )
}
