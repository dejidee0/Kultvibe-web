'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { BellIcon } from '@hugeicons/core-free-icons';
import { useAuthStore } from '@/store/useAuthStore';

export default function MobileHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const openModal = useAuthStore(state => state.openModal);
  return (
    <div className="shrink-0 bg-kv-base lg:hidden">
      <header className="flex h-12 items-center gap-1 border-b border-white/[0.06] px-3">
        <Link href="/" aria-label="KultVibe home" className="flex h-11 w-11 shrink-0 items-center justify-center">
          <span className="block h-10 w-10 overflow-hidden">
            <Image src="/logo.png" alt="KultVibe" width={40} height={40} unoptimized style={{ transform: 'scale(2.2)', transformOrigin: 'center', display: 'block' }} />
          </span>
        </Link>
        <div className="min-w-0 flex-1" />
        <button type="button" aria-label="Search" aria-expanded={searchOpen} aria-controls="mobile-search" onClick={() => setSearchOpen(value => !value)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white/40 hover:bg-white/[0.07] hover:text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
        </button>
        <button type="button" aria-label="Notifications" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white/40 hover:bg-white/[0.07] hover:text-white">
          <HugeiconsIcon icon={BellIcon} size={20} color="currentColor" strokeWidth={1.5} />
        </button>
        <button type="button" onClick={() => openModal('register')} className="min-h-11 shrink-0 rounded-md bg-kv-gold px-3 text-xs font-semibold text-kv-base hover:bg-[#D4A017]">Join KultVibe</button>
      </header>
      {searchOpen && (
        <div className="px-4 py-2">
          <input id="mobile-search" autoFocus type="search" aria-label="Search streams, tournaments, creators" placeholder="Search streams, tournaments, creators..." className="min-h-11 w-full min-w-0 rounded-md border border-white/10 bg-white/[0.06] px-3 text-base text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-yellow-500" />
        </div>
      )}
    </div>
  );
}
