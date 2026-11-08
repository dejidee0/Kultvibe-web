'use client'

import PreviewBadge from '@/components/ui/PreviewBadge'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useGiftStore, GIFTS } from '@/store/useGiftStore'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import GiftVisual from './GiftVisual'

const DEMO_SENDERS = [
  '@NaijaGamer',
  '@LagosVibes',
  '@AbujaBoy',
  '@ChiGaming',
  '@KanoKing',
  '@DeltaGamer',
]

export default function GiftPicker() {
  const { isPickerOpen, closePicker, sendGift } = useGiftStore()
  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isPickerOpen) return
    const previous = document.activeElement as HTMLElement | null
    panelRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    return () => previous?.focus()
  }, [isPickerOpen])

  const handleSend = (gift: (typeof GIFTS)[0]) => {
    const randomSender = DEMO_SENDERS[Math.floor(Math.random() * DEMO_SENDERS.length)]
    sendGift(gift, randomSender)
  }

  return (
    <AnimatePresence>
      {isPickerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePicker}
            className="fixed inset-0 z-40 bg-black/60"
          />

          {/* Picker Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Send a gift"
            className="fixed inset-x-3 bottom-[calc(80px+env(safe-area-inset-bottom))] z-50 mx-auto max-h-[calc(100dvh-7rem)] max-w-[360px] overflow-y-auto lg:absolute lg:inset-x-auto lg:bottom-[60px] lg:right-3 lg:mx-0 lg:w-[280px]"
            onKeyDown={event => {
              if (event.key === 'Escape') { event.preventDefault(); closePicker() }
              if (event.key === 'Tab') {
                const controls = panelRef.current?.querySelectorAll<HTMLButtonElement>('button')
                if (!controls?.length) return
                const first = controls[0], last = controls[controls.length - 1]
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
              }
            }}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              background: '#0D0D14',
              border: '0.5px solid rgba(255,255,255,0.12)',
              borderRadius: '16px',
              padding: '16px',
            }}
          >
            <div className="mb-3"><PreviewBadge /><p className="mt-1 text-xs text-white/70">Try a sample gift. No money is charged.</p></div>
            {/* VC Balance */}
            <div style={{
              background: 'rgba(240,180,41,0.10)',
              border: '0.5px solid rgba(240,180,41,0.20)',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.50)' }}>Preview VC balance</span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#F0B429' }}>15,000 VC</span>
            </div>

            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>
                Send a gift
              </span>
              <button
                aria-label="Close gift picker" onClick={closePicker}
                style={{
                  color: 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  minWidth: 44,
                  minHeight: 44,
                  justifyContent: 'center',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} color="currentColor" strokeWidth={1.5} />
              </button>
            </div>

            {/* Gift Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {GIFTS.map((gift) => (
                <button
                  key={gift.id}
                  onClick={() => handleSend(gift)}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '0.5px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '10px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(240,180,41,0.4)'
                    e.currentTarget.style.background = 'rgba(240,180,41,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  }}
                >
                  <GiftVisual twemojiHex={gift.twemojiHex} emoji={gift.emoji} size={32}  label={gift.name} />
                  <span style={{ fontSize: '11px', fontWeight: 500, color: '#fff' }}>
                    {gift.name}
                  </span>
                  <span style={{ fontSize: '10px', color: '#F0B429' }}>
                    {gift.price.toLocaleString()} VC
                  </span>
                </button>
              ))}
            </div>

            <p
              style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.25)',
                textAlign: 'center',
                marginTop: '12px',
              }}
            >
              Gifts support the streamer directly
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
