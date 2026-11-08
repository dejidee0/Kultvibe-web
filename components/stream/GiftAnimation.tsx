'use client'

import PreviewBadge from '@/components/ui/PreviewBadge'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGiftStore } from '@/store/useGiftStore'
import GiftVisual from './GiftVisual'

type Gift = {
  id: string
  name: string
  emoji: string
  twemojiHex?: string
  price: number
}

type ActiveGift = {
  id: string
  gift: Gift
  sender: string
  timestamp: number
}

type GiftConfig = {
  color: string
  glow: string
  tier: number
  size: number
}

const GIFT_CONFIGS: Record<string, GiftConfig> = {
  'drum-drop':    { color: '#F97316', glow: 'rgba(249,115,22,0.7)',   tier: 1, size: 36 },
  'jollof-flame': { color: '#EF4444', glow: 'rgba(239,68,68,0.7)',    tier: 1, size: 40 },
  'naija-lion':   { color: '#F0B429', glow: 'rgba(240,180,41,0.7)',   tier: 2, size: 48 },
  'afro-crown':   { color: '#F0B429', glow: 'rgba(240,180,41,0.85)',  tier: 3, size: 52 },
  'lagos-storm':  { color: '#FBBF24', glow: 'rgba(251,191,36,0.85)', tier: 4, size: 60 },
  'diamond-fang': { color: '#60A5FA', glow: 'rgba(96,165,250,0.85)',  tier: 5, size: 68 },
  'pan-africa':   { color: '#34D399', glow: 'rgba(52,211,153,0.85)',  tier: 5, size: 68 },
}

function getConfig(giftId: string): GiftConfig {
  return GIFT_CONFIGS[giftId] ?? GIFT_CONFIGS.fire
}

export default function GiftAnimation() {
  const { activeGifts, removeGift } = useGiftStore()

  const kultQueenGifts = activeGifts.filter(g => g.gift.id === 'kult-queen')
  const floatingGifts  = activeGifts.filter(g => g.gift.id !== 'kult-queen' && getConfig(g.gift.id).tier < 4)
  const bigGifts       = activeGifts.filter(g => g.gift.id !== 'kult-queen' && getConfig(g.gift.id).tier >= 4)

  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {activeGifts.length > 0 && <div className="absolute left-3 top-12"><PreviewBadge /></div>}
        <AnimatePresence>
          {floatingGifts.map((activeGift, index) => (
            <GiftFloat
              key={activeGift.id}
              activeGift={activeGift}
              index={index}
              config={getConfig(activeGift.gift.id)}
              onComplete={() => removeGift(activeGift.id)}
            />
          ))}
          {bigGifts.slice(-1).map((activeGift) => (
            <BigGiftBanner
              key={activeGift.id}
              activeGift={activeGift}
              config={getConfig(activeGift.gift.id)}
              onComplete={() => removeGift(activeGift.id)}
            />
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {kultQueenGifts.slice(-1).map((activeGift) => (
          <KultQueenOverlay
            key={activeGift.id}
            activeGift={activeGift}
            onComplete={() => removeGift(activeGift.id)}
          />
        ))}
      </AnimatePresence>
    </>
  )
}

function GiftFloat({
  activeGift,
  index,
  config,
  onComplete,
}: {
  activeGift: ActiveGift
  index: number
  config: GiftConfig
  onComplete: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4200)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const leftPosition = 4 + (index % 4) * 20

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0, x: 0 }}
      animate={{
        opacity: [0,    1,    1,    1,   0.6,   0],
        y:       [0,  -50, -110, -185, -255, -320],
        x:       [0,    8,   -7,   10,    -4,   0],
        scale:   [0, 1.35, 1.05,   1,   0.9,  0.8],
      }}
      exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.2 } }}
      transition={{ duration: 4.2, ease: 'easeOut', times: [0, 0.08, 0.25, 0.5, 0.8, 1] }}
      style={{ position: 'absolute', bottom: 150, left: `${leftPosition}%` }}
    >
      <div className="flex flex-col items-center gap-1.5">
        {/* Gift icon with tier-coloured glow */}
        <div
          style={{
            filter: [
              `drop-shadow(0 0 ${config.tier * 5}px ${config.glow})`,
              `drop-shadow(0 0 ${config.tier * 14}px ${config.color}40)`,
            ].join(' '),
          }}
        >
          <GiftVisual
            twemojiHex={activeGift.gift.twemojiHex}
            emoji={activeGift.gift.emoji}
            size={config.size}
            showSparkle
          />
        </div>

        {/* Sender pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            background: 'rgba(0,0,0,0.80)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: `0.5px solid ${config.color}45`,
            borderRadius: '999px',
            padding: '4px 10px 4px 5px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: `0 2px 16px ${config.color}28`,
            whiteSpace: 'nowrap',
          }}
        >
          <img
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${activeGift.sender}&backgroundColor=0D0D14`}
            loading="lazy"
            alt={activeGift.sender}
            style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0 }}
          />
          <span style={{ fontSize: '11px', fontWeight: 700, color: config.color }}>
            {activeGift.sender}
          </span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.30)' }}>·</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#F0B429' }}>
            {activeGift.gift.price.toLocaleString()} VC
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

function BigGiftBanner({
  activeGift,
  config,
  onComplete,
}: {
  activeGift: ActiveGift
  config: GiftConfig
  onComplete: () => void
}) {
  const DURATION = 5500

  useEffect(() => {
    const timer = setTimeout(onComplete, DURATION)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isTopTier = config.tier === 5

  return (
    <motion.div
      initial={{ y: 90, opacity: 0, scale: 0.94 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 90, opacity: 0, scale: 0.94 }}
      transition={{ type: 'spring', damping: 22, stiffness: 320 }}
      style={{
        position: 'absolute',
        bottom: 68,
        left: 10,
        right: 10,
        background: `linear-gradient(135deg, rgba(0,0,0,0.93) 0%, ${config.color}18 100%)`,
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        border: `1px solid ${config.color}45`,
        borderRadius: '16px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: `0 0 40px ${config.color}28, 0 8px 32px rgba(0,0,0,0.65)`,
        overflow: 'hidden',
      }}
    >
      {/* Pulsing radial glow in background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.25, 0.6, 0.25] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: `radial-gradient(ellipse at 18% 50%, ${config.color}22 0%, transparent 68%)`,
          borderRadius: '16px',
        }}
      />

      {/* Gift visual */}
      <div
        className="relative flex-shrink-0"
        style={{
          filter: [
            `drop-shadow(0 0 18px ${config.glow})`,
            `drop-shadow(0 0 36px ${config.color}55)`,
          ].join(' '),
        }}
      >
        <GiftVisual
          twemojiHex={activeGift.gift.twemojiHex}
          emoji={activeGift.gift.emoji}
          size={52}
          showSparkle
        />
      </div>

      {/* Text info */}
      <div className="flex flex-col flex-1 min-w-0 relative">
        <div className="flex items-center gap-1.5 mb-0.5">
          <img
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${activeGift.sender}&backgroundColor=0D0D14`}
            loading="lazy"
            alt={activeGift.sender}
            style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0 }}
          />
          <span style={{ fontSize: '12px', fontWeight: 700, color: config.color }}>
            {activeGift.sender}
          </span>
        </div>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
          sent a <span style={{ color: '#fff', fontWeight: 600 }}>{activeGift.gift.name}</span>
        </p>
        <p style={{ fontSize: '18px', fontWeight: 800, color: '#F0B429', letterSpacing: '-0.02em', lineHeight: 1.2, marginTop: 2 }}>
          {activeGift.gift.price.toLocaleString()} VC
        </p>
      </div>

      {/* Tier badge - springs in with overshoot */}
      <motion.div
        initial={{ scale: 0, rotate: -12 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.18, type: 'spring', damping: 10, stiffness: 260 }}
        style={{
          flexShrink: 0,
          background: config.color,
          borderRadius: '9px',
          padding: '5px 10px',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            fontWeight: 800,
            color: isTopTier ? '#fff' : '#000',
            letterSpacing: '0.07em',
          }}
        >
          {isTopTier ? 'TOP GIFT' : 'BIG GIFT'}
        </span>
      </motion.div>

      {/* Depleting progress bar at the bottom edge */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px]"
        style={{ background: config.color, borderRadius: '0 0 0 16px', opacity: 0.7 }}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: DURATION / 1000, ease: 'linear' }}
      />
    </motion.div>
  )
}

function KultQueenOverlay({
  activeGift,
  onComplete,
}: {
  activeGift: ActiveGift
  onComplete: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.6 }}
        style={{ fontSize: '120px', lineHeight: 1 }}
      >
        👸🏾
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ textAlign: 'center' }}
      >
        <p style={{ fontSize: '28px', fontWeight: 600, color: '#F0B429', marginBottom: '8px' }}>
          KULT QUEEN
        </p>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.70)' }}>
          {activeGift.sender} just sent the ultimate gift
        </p>
        <p style={{ fontSize: '14px', color: '#F0B429', marginTop: '4px' }}>
          500,000 VC
        </p>
      </motion.div>
    </motion.div>
  )
}
