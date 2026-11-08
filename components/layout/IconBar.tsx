'use client';

import Image from 'next/image'

import { brand } from '@/lib/brand'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { Wallet01Icon } from '@hugeicons/core-free-icons';
import { topNavItems } from './sidebarData';

export default function IconBar() {
  const pathname = usePathname();

  return (
    <div
      className="flex flex-col items-center"
      style={{
        width: 56,
        background: '#0D0D14',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo — same height as Topbar so they sit flush */}
      <div className="flex items-center justify-center flex-shrink-0" style={{ height: 48 }}>
        <Link href="/">
          <div
            className="flex-shrink-0 overflow-hidden"
            style={{ width: 40, height: 40 }}
          >
            <Image
              src="/logo.png"
              alt={brand.name}
              width={40}
              height={40}
              style={{ transform: 'scale(2.2)', transformOrigin: 'center', display: 'block' }} unoptimized sizes="40px" loading="lazy" />
          </div>
        </Link>
      </div>

      <div className="flex-1" />

      {/* Nav - vertically centred */}
      <nav className="flex flex-col gap-1">
        {topNavItems.map(({ icon, label, href }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <div key={label} className="relative group/tip">
              <Link href={href} tabIndex={-1}>
                <button aria-label={label}
                  className="flex items-center justify-center rounded-lg transition-all duration-150"
                  style={{
                    width: 40,
                    height: 40,
                    color: isActive ? '#F0B429' : 'rgba(255,255,255,0.4)',
                    background: isActive ? 'rgba(240,180,41,0.12)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (isActive) return;
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)';
                    (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    if (isActive) return;
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)';
                  }}
                >
                  <HugeiconsIcon icon={icon} size={20} color="currentColor" strokeWidth={1.5} />
                </button>
              </Link>
              {/* Tooltip */}
              <div
                className="pointer-events-none absolute left-[48px] top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150"
                style={{
                  background: 'rgba(20,20,32,0.95)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  zIndex: 100,
                }}
              >
                {label}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="flex-1" />

      {/* Wallet + avatar pinned at bottom */}
      <div className="flex flex-col items-center gap-3 flex-shrink-0">
        <div style={{ width: 32, borderTop: '1px solid rgba(255,255,255,0.06)' }} />
        <div className="relative group/tip">
          <button aria-label="Wallet preview"
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{ width: 40, height: 40, color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)';
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)';
            }}
          >
            <HugeiconsIcon icon={Wallet01Icon} size={20} color="currentColor" strokeWidth={1.5} />
          </button>
          <div
            className="pointer-events-none absolute left-[48px] top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150"
            style={{
              background: 'rgba(20,20,32,0.95)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              zIndex: 100,
            }}
          >
            Wallet
          </div>
        </div>
        <Image
          src="https://api.dicebear.com/7.x/adventurer/svg?seed=kultvibe-user&backgroundColor=F0B429"
          alt="Your avatar"
          className="rounded-full"
          style={{ width: 32, height: 32 }} unoptimized width={32} height={32} sizes="32px" loading="lazy" />
      </div>
    </div>
  );
}
