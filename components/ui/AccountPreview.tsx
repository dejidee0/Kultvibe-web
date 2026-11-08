'use client'

import Link from 'next/link'
import { brand } from '@/lib/brand'
import { useAuthStore } from '@/store/useAuthStore'
import AuthModal from '@/components/ui/AuthModal'

export default function AccountPreview({ registration = false }: { registration?: boolean }) {
  const openModal = useAuthStore(state => state.openModal)
  return (
    <main className="flex min-h-dvh min-w-0 items-center justify-center bg-kv-base px-4 py-8 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/15 bg-kv-surface p-6 sm:p-8">
        <p className="mb-4 text-sm font-medium text-kv-gold">{brand.name} · {brand.tagline}</p>
        <h1 className="mb-3 text-2xl font-semibold">{registration ? 'Join the waitlist' : 'Accounts open at launch'}</h1>
        <p className="mb-6 text-sm leading-relaxed text-white/75">{registration ? brand.oneLiner : 'Join the waitlist for access. Account sign-in is not available yet.'}</p>
        <button type="button" onClick={() => openModal('register')} className="min-h-11 w-full rounded-lg bg-kv-gold px-4 py-3 text-base font-medium text-kv-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kv-gold">Join the waitlist</button>
        <Link href="/" className="mt-4 flex min-h-11 items-center justify-center rounded-lg text-sm text-white/80 underline decoration-white/30 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-kv-gold">Explore the {brand.name} preview</Link>
      </section>
      <AuthModal />
    </main>
  )
}
