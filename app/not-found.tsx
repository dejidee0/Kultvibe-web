import { brand } from '@/lib/brand'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Page not found | ${brand.name}`,
}

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: '#08080D' }}
    >
      <div
        className="text-[120px] font-black leading-none mb-4 select-none"
        style={{ color: 'rgba(240,180,41,0.15)' }}
      >
        404
      </div>

      <h1 className="text-2xl font-semibold text-white mb-2">Page not found</h1>
      <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.40)', maxWidth: 320 }}>
        This page doesn&apos;t exist or was moved. Head back to the arena.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{ background: '#F0B429', color: '#08080D' }}
          onMouseEnter={undefined}
        >
          Go home
        </Link>
        <Link
          href="/compete"
          className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.70)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          Compete
        </Link>
      </div>
    </div>
  )
}
