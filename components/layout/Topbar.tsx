'use client';

import { brand } from '@/lib/brand'

import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { BellIcon } from '@hugeicons/core-free-icons';
import { useAuthStore } from '@/store/useAuthStore';

export default function Topbar() {
  const { openModal } = useAuthStore();

  return (
    <header
      className="flex items-center px-4 flex-shrink-0"
      style={{
        height: 48,
        background: '#08080D',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Search */}
      <div className="flex-1 max-w-xs mr-4">
        <input
          type="text" aria-label="Search streams, tournaments, creators"
          placeholder="Search streams, tournaments, creators..."
          className="w-full text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 text-white placeholder:text-[rgba(255,255,255,0.3)]"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '6px 12px',
          }}
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Notification bell */}
      <button aria-label="Notifications"
        className="flex items-center justify-center rounded-lg mr-2 transition-colors"
        style={{
          width: 36,
          height: 36,
          color: 'rgba(255,255,255,0.4)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = '#fff';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)';
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        }}
      >
        <HugeiconsIcon icon={BellIcon} size={20} color="currentColor" strokeWidth={1.5} />
      </button>

      {/* CTA button */}
      <button
        onClick={() => openModal('register')}
        className="text-sm font-semibold rounded-md"
        style={{ background: '#F0B429', color: '#08080D', padding: '6px 16px' }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = '#D4A017';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = '#F0B429';
        }}
      >
        Join {brand.name}
      </button>
    </header>
  );
}
