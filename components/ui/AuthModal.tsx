'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { useAuthStore } from '@/store/useAuthStore';
import { joinWaitlist, waitlistVerticals, type WaitlistVertical } from '@/lib/waitlist';

export default function AuthModal() {
  const { isModalOpen, modalView, closeModal, toggleView } = useAuthStore();
  const [fullName, setFullName] = useState('')
  const [gamerTag, setGamerTag] = useState('')
  const [email, setEmail] = useState('')
  const [primaryVertical, setPrimaryVertical] = useState<WaitlistVertical | ''>('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)
    setSubmitted(false)
  }, [isModalOpen, modalView])

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (modalView !== 'register' || submitting || !primaryVertical) return
    setSubmitting(true)
    setError(null)
    try {
      await joinWaitlist({
        fullName: fullName.trim(),
        email: email.trim(),
        gamerTag: gamerTag.trim() || undefined,
        primaryVertical,
      })
      setSubmitted(true)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'We could not confirm your signup. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
          >
            <div
              role="dialog" aria-modal="true" aria-label={modalView === 'register' ? 'Join the waitlist' : 'Welcome back'}
              className="pointer-events-auto w-full max-w-[440px] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl p-5 sm:p-8 relative [&_input]:min-h-11 [&_select]:min-h-11 [&_button]:min-h-11 [&_button]:text-base lg:[&_button]:text-sm lg:[&_input]:min-h-0 lg:[&_select]:min-h-0 lg:[&_button]:min-h-0"
              style={{ background: '#0D0D14', border: '1px solid rgba(255,255,255,0.10)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={closeModal}
                aria-label="Close"
                className="absolute top-1 right-1 flex h-11 w-11 items-center justify-center transition-colors lg:top-4 lg:right-4 lg:h-5 lg:w-5"
                style={{ color: 'rgba(255,255,255,0.30)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.30)')}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={20} color="currentColor" strokeWidth={1.5} />
              </button>

              {/* Logo */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex-shrink-0 overflow-hidden" style={{ width: 32, height: 32 }}>
                  <img
                    src="/logo.png"
                    alt="KultVibe"
                    width={32}
                    height={32}
                    style={{ transform: 'scale(2.2)', transformOrigin: 'center', display: 'block' }}
                  />
                </div>
                <span className="text-base font-medium text-white">KultVibe</span>
              </div>

              {/* Heading */}
              <h2 className="text-xl font-medium text-white text-center mb-1">
                {modalView === 'register' ? 'Join the waitlist' : 'Welcome back'}
              </h2>
              <p className="text-xs text-white/40 text-center mb-6">
                {modalView === 'register'
                  ? 'Your Culture. Your Stage. Your Money.'
                  : 'Sign in to your KultVibe account'}
              </p>

              {modalView === 'login' && <>
              {/* Social buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Google',  icon: '/icons/google.svg',  bg: 'rgba(255,255,255,0.05)',  hoverBg: 'rgba(255,255,255,0.10)',  border: 'rgba(255,255,255,0.10)' },
                  { label: 'Discord', icon: '/icons/discord.svg', bg: 'rgba(88,101,242,0.10)',   hoverBg: 'rgba(88,101,242,0.20)',   border: 'rgba(88,101,242,0.30)' },
                  { label: 'TikTok',  icon: '/icons/tiktok.svg',  bg: 'rgba(255,255,255,0.05)',  hoverBg: 'rgba(255,255,255,0.10)',  border: 'rgba(255,255,255,0.10)' },
                  { label: 'X',       icon: '/icons/x.svg',       bg: 'rgba(255,255,255,0.05)',  hoverBg: 'rgba(255,255,255,0.10)',  border: 'rgba(255,255,255,0.10)' },
                ].map((p) => (
                  <button
                    key={p.label}
                    className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm transition-all"
                    style={{ background: p.bg, border: `1px solid ${p.border}`, color: 'rgba(255,255,255,0.80)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = p.hoverBg; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = p.bg; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.80)'; }}
                  >
                    <img src={p.icon} width={16} height={16} alt={p.label} loading="lazy" />
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <span className="text-xs text-white/30">or continue with email</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              </div>

              </>}
              <form onSubmit={handleRegister}>
              {/* Fields */}
              {modalView === 'register' ? (
                <div className="flex flex-col gap-3 mb-5">
                  {submitted ? (
                    <div className="rounded-lg px-4 py-5 text-center break-words" style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)' }}>
                      <p className="text-sm font-medium" style={{ color: '#10B981' }}>You&apos;re on the list 🎉</p>
                      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Your spot is confirmed. We&apos;ll email you when your access opens.</p>
                    </div>
                  ) : (
                    <>
                      <input type="text" aria-label="Full name" placeholder="Full name" required maxLength={100} autoComplete="name" value={fullName} onChange={e => setFullName(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-yellow-500/50 transition-colors" />
                      <input type="text" aria-label="Gamer tag (optional)" placeholder="Gamer tag (optional)" maxLength={50} value={gamerTag} onChange={e => setGamerTag(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-yellow-500/50 transition-colors" />
                      <input type="email" aria-label="Email address" placeholder="Email address" required maxLength={255} autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-yellow-500/50 transition-colors" />
                      <select aria-label="Primary vertical" required value={primaryVertical} onChange={e => setPrimaryVertical(e.target.value as WaitlistVertical)} className="bg-[#111118] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/60 outline-none focus:border-yellow-500/50 transition-colors">
                        <option value="" disabled>Choose your primary vertical</option>
                        {waitlistVerticals.map(vertical => <option key={vertical} value={vertical}>{vertical}</option>)}
                      </select>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3 mb-5">
                  <input type="email" placeholder="Email address" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-yellow-500/50 transition-colors" />
                  <input type="password" placeholder="Password" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-yellow-500/50 transition-colors" />
                  <div className="flex justify-end">
                    <span className="text-xs text-yellow-400 cursor-pointer hover:text-yellow-300 transition-colors">Forgot password?</span>
                  </div>
                </div>
              )}

              {error && <p role="alert" className="text-sm text-[#FF4D6D] whitespace-pre-line break-words mb-4">{error}</p>}

              {/* Submit */}
              {!submitted && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full font-medium py-3 rounded-lg text-base lg:text-sm transition-colors mb-4"
                  style={{ background: '#F0B429', color: '#08080D', opacity: submitting ? 0.7 : 1 }}
                  onMouseEnter={e => { if (!submitting) (e.currentTarget.style.background = '#D4A017') }}
                  onMouseLeave={e => (e.currentTarget.style.background = '#F0B429')}
                >
                  {submitting ? 'Joining…' : modalView === 'register' ? 'Join the waitlist' : 'Sign in'}
                </button>
              )}

              </form>

              {/* Toggle */}
              <p className="text-xs text-white/35 text-center">
                {modalView === 'register' ? 'Already have an account?' : "Don't have an account?"}
                {' '}
                <span onClick={toggleView} className="text-yellow-400 cursor-pointer hover:text-yellow-300 transition-colors">
                  {modalView === 'register' ? 'Sign in' : 'Join the waitlist'}
                </span>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
