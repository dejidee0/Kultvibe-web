'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { useAuthStore } from '@/store/useAuthStore'
import { brand, type Interest, type UserType } from '@/lib/brand'
import { joinWaitlist, WaitlistApiError, type WaitlistSignup } from '@/lib/waitlist'

const userTypes = Object.keys(brand.userTypes) as UserType[]
type FieldErrors = Partial<Record<keyof WaitlistSignup, string>>

function WaitlistField({ name, label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {
  name: keyof WaitlistSignup
  label: string
  error?: string
}) {
  const id = `waitlist-${name}`
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm text-white/80">{label}</label>
      <input {...props} id={id} name={name} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
        className={`min-h-11 w-full min-w-0 rounded-lg border bg-white/5 px-3 py-2.5 text-base text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-kv-gold ${error ? 'border-rose-400' : 'border-white/15'}`} />
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-rose-300 break-words">{error}</p>}
    </div>
  )
}

export default function AuthModal() {
  const { isModalOpen, modalView, closeModal, toggleView } = useAuthStore()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [userType, setUserType] = useState<UserType>('Gamer')
  const [fullName, setFullName] = useState('')
  const [gamerTag, setGamerTag] = useState('')
  const [email, setEmail] = useState('')
  const [primaryGame, setPrimaryGame] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [interests, setInterests] = useState<Interest[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  useEffect(() => {
    setError(null)
    setFieldErrors({})
    setSuccessMessage(null)
  }, [isModalOpen, modalView])

  useEffect(() => {
    if (!isModalOpen) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const frame = requestAnimationFrame(() => dialogRef.current?.focus())
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); closeModal(); return }
      if (event.key !== 'Tab') return
      const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]') || [])
        .filter(element => element.getClientRects().length)
      const first = controls[0], last = controls.at(-1)
      if (!first || !last) { event.preventDefault(); return }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [isModalOpen, closeModal])

  function clearField(field: keyof WaitlistSignup) {
    setFieldErrors(previous => { const next = { ...previous }; delete next[field]; return next })
    setError(null)
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    if (modalView !== 'register') { setError('Accounts open at launch. Join the waitlist for access.'); return }
    const validation: FieldErrors = {}
    if (!fullName.trim()) validation.fullName = 'Full name is required'
    if (userType === 'Brand' && !companyName.trim()) validation.companyName = 'Company name is required for brands'
    if (Object.keys(validation).length) { setFieldErrors(validation); setError('Please check the highlighted details.'); return }
    setSubmitting(true)
    setError(null)
    setFieldErrors({})
    try {
      const result = await joinWaitlist({
        fullName: fullName.trim(), email: email.trim(), gamerTag: gamerTag.trim() || undefined,
        userType, primaryGame: userType === 'Gamer' ? primaryGame.trim() || undefined : undefined,
        companyName: userType === 'Brand' ? companyName.trim() : undefined, interests,
      })
      setSuccessMessage(result.message || '')
    } catch (failure) {
      if (failure instanceof WaitlistApiError) {
        setFieldErrors(failure.fieldErrors)
        setError(Object.keys(failure.fieldErrors).length ? 'Please check the highlighted details.' : failure.message)
      } else setError(failure instanceof Error ? failure.message : 'We could not confirm your signup. Please try again.')
    } finally { setSubmitting(false) }
  }

  return (
    <AnimatePresence>
      {isModalOpen && <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.97, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{ duration: 0.2 }} className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="auth-heading" aria-describedby="auth-description" tabIndex={-1}
            className="pointer-events-auto relative max-h-[calc(100dvh-2rem)] w-full max-w-[560px] overflow-y-auto overscroll-contain rounded-2xl border border-white/15 bg-[#0D0D14] p-5 text-white outline-none sm:p-8 [&_button]:min-h-11 [&_button]:focus-visible:outline [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-kv-gold">
            <button type="button" onClick={closeModal} aria-label="Close" className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white">
              <HugeiconsIcon icon={Cancel01Icon} size={20} color="currentColor" strokeWidth={1.5} />
            </button>
            <div className="mb-5 flex items-center justify-center gap-2">
              <div className="h-8 w-8 shrink-0 overflow-hidden"><img src="/logo.png" alt={brand.name} width={32} height={32} style={{ transform: 'scale(2.2)', transformOrigin: 'center', display: 'block' }} /></div>
              <span className="text-base font-medium">{brand.name}</span>
            </div>
            <h2 id="auth-heading" className="text-center text-xl font-medium">{modalView === 'register' ? 'Join the waitlist' : 'Welcome back'}</h2>
            <p id="auth-description" className="mb-6 mt-1 text-center text-sm text-white/65">{modalView === 'register' ? brand.tagline : `Sign in to your ${brand.name} account`}</p>
            {modalView === 'login' && <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {['Google', 'Discord', 'TikTok', 'X'].map(provider => <button type="button" key={provider}
                onClick={() => setError('Accounts open at launch. Join the waitlist for access.')}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 text-base hover:bg-white/10">
                <img src={`/icons/${provider.toLowerCase()}.svg`} width={16} height={16} alt="" loading="lazy" />{provider}
              </button>)}
            </div>}
            <form onSubmit={handleRegister} className="min-w-0">
              {successMessage !== null ? <div role="status" className="mb-5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-5 text-center text-sm text-emerald-200 break-words">{successMessage}</div> : <div className="mb-5 flex min-w-0 flex-col gap-4">
                {modalView === 'register' ? <>
                  <fieldset disabled={submitting}>
                    <legend className="mb-2 text-sm font-medium">How will you use {brand.name}?</legend>
                    <div className="grid gap-2">
                      {userTypes.map(type => <label key={type} className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 focus-within:ring-2 focus-within:ring-kv-gold ${userType === type ? 'border-kv-gold bg-kv-gold/10' : 'border-white/15 hover:border-white/40'}`}>
                        <input type="radio" name="userType" value={type} checked={userType === type} onChange={() => { setUserType(type); setFieldErrors({}); setError(null) }} className="mt-1 h-4 w-4 shrink-0 accent-[#F0B429]" />
                        <span className="min-w-0"><span className="block text-sm font-medium">{brand.userTypes[type].label}</span><span className="mt-1 block text-xs leading-relaxed text-white/70">{brand.userTypes[type].description}</span></span>
                      </label>)}
                    </div>
                    {fieldErrors.userType && <p className="mt-1 text-sm text-rose-300">{fieldErrors.userType}</p>}
                  </fieldset>
                  <WaitlistField name="fullName" label="Full name" required maxLength={100} autoComplete="name" value={fullName} error={fieldErrors.fullName} onChange={e => { setFullName(e.target.value); clearField('fullName') }} />
                  <WaitlistField name="email" label="Email address" type="email" required maxLength={255} autoComplete="email" value={email} error={fieldErrors.email} onChange={e => { setEmail(e.target.value); clearField('email') }} />
                  <WaitlistField name="gamerTag" label="Gamer tag (optional)" maxLength={50} autoComplete="nickname" value={gamerTag} error={fieldErrors.gamerTag} onChange={e => { setGamerTag(e.target.value); clearField('gamerTag') }} />
                  {userType === 'Gamer' && <WaitlistField name="primaryGame" label="Main game (optional)" placeholder="e.g. COD Mobile, Free Fire, EA FC" maxLength={100} value={primaryGame} error={fieldErrors.primaryGame} onChange={e => { setPrimaryGame(e.target.value); clearField('primaryGame') }} />}
                  {userType === 'Brand' && <WaitlistField name="companyName" label="Company name" required maxLength={150} autoComplete="organization" value={companyName} error={fieldErrors.companyName}
                    onInvalid={() => setFieldErrors(previous => ({ ...previous, companyName: 'Company name is required for brands' }))}
                    onChange={e => { setCompanyName(e.target.value); clearField('companyName') }} />}
                  <fieldset disabled={submitting}>
                    <legend className="text-sm font-medium">{brand.interestsLabel}</legend>
                    <p id="interests-helper" className="mb-2 mt-1 text-xs text-white/70">{brand.interestsHelper}</p>
                    <div className="flex flex-wrap gap-2" aria-describedby="interests-helper">
                      {brand.interests.map(interest => <label key={interest} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-kv-gold ${interests.includes(interest) ? 'border-kv-gold bg-kv-gold/10' : 'border-white/20'}`}>
                        <input type="checkbox" name="interests" value={interest} checked={interests.includes(interest)} className="h-4 w-4 accent-[#F0B429]" onChange={() => { setInterests(previous => previous.includes(interest) ? previous.filter(value => value !== interest) : previous.length < 3 ? [...previous, interest] : previous); clearField('interests') }} />{interest}
                      </label>)}
                    </div>
                    {fieldErrors.interests && <p className="mt-1 text-sm text-rose-300">{fieldErrors.interests}</p>}
                  </fieldset>
                </> : <>
                  <WaitlistField name="email" label="Email address" type="email" autoComplete="email" />
                  <div><label htmlFor="login-password" className="mb-1.5 block text-sm text-white/80">Password</label><input id="login-password" type="password" autoComplete="current-password" className="min-h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-kv-gold" /></div>
                </>}
              </div>}
              {error && <p role="alert" className="mb-4 whitespace-pre-line break-words text-sm text-rose-300">{error}</p>}
              {successMessage === null && <button type="submit" disabled={submitting} className="mb-4 w-full rounded-lg bg-kv-gold px-4 py-3 text-base font-medium text-kv-base hover:bg-[#D4A017] disabled:opacity-60">{submitting ? 'Joining…' : modalView === 'register' ? 'Join the waitlist' : 'Sign in'}</button>}
            </form>
            <p className="text-center text-xs text-white/65">{modalView === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}<button type="button" onClick={toggleView} className="rounded px-1 text-kv-gold hover:text-yellow-200">{modalView === 'register' ? 'Sign in' : 'Join the waitlist'}</button></p>
          </div>
        </motion.div>
      </>}
    </AnimatePresence>
  )
}
