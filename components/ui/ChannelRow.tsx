'use client';

import PreviewBadge from '@/components/ui/PreviewBadge'

import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';

type ChannelRowProps = {
  name: string;
  game: string;
  viewers: number;
  avatarColor: string;
  initials: string;
  isLive: boolean;
  streamTitle?: string;
};

function TooltipCard({
  name,
  game,
  isLive,
  streamTitle,
  top,
}: ChannelRowProps & { top: number }) {
  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top,
        left: 280,
        zIndex: 9999,
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
      }}
    >
      {/* Arrow pointing left */}
      <div
        style={{
          position: 'absolute',
          left: -6,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 0,
          height: 0,
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderRight: '6px solid #1a1a24',
        }}
      />

      {/* Card */}
      <div
        style={{
          width: 224,
          background: '#1a1a24',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 10,
          padding: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
        }}
      >
        {/* Avatar + name row */}
        <div className="flex items-center gap-2 mb-2.5">
          <img
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}&backgroundColor=0D0D14`}
            loading="lazy"
            alt={name}
            className="rounded-full flex-shrink-0"
            style={{ width: 32, height: 32, opacity: isLive ? 1 : 0.5 }}
          />
          <div className="flex flex-col min-w-0">
            <span
              className="font-semibold truncate"
              style={{ fontSize: 12, color: '#fff' }}
            >
              {name}
            </span>
            {isLive && (
              <span
                style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}
              >
                Preview
              </span>
            )}
          </div>
        </div>

        {/* Stream title */}
        {streamTitle && (
          <p
            className="font-bold mb-2 leading-snug"
            style={{
              fontSize: 13,
              color: '#fff',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {streamTitle}
          </p>
        )}

        {/* Viewer count */}
        {isLive && (
          <div className="flex items-center gap-1.5 mb-2.5">
            <span
              className="rounded-full animate-pulse"
              style={{ width: 7, height: 7, background: '#71717A', display: 'inline-block' }}
            />
            <PreviewBadge />
          </div>
        )}

        {/* Game/category pill */}
        <span
          className="inline-block rounded-md font-medium"
          style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.7)',
            background: 'rgba(255,255,255,0.08)',
            padding: '3px 8px',
          }}
        >
          {game}
        </span>
      </div>
    </div>,
    document.body
  );
}

export default function ChannelRow({
  name,
  game,
  viewers,
  avatarColor,
  initials,
  isLive,
  streamTitle,
}: ChannelRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [tooltipTop, setTooltipTop] = useState<number | null>(null);

  function handleMouseEnter() {
    if (rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      setTooltipTop(rect.top + rect.height / 2);
    }
  }

  function handleMouseLeave() {
    setTooltipTop(null);
  }

  return (
    <>
      <div
        ref={rowRef}
        className="flex items-center gap-2 rounded-md cursor-pointer transition-colors hover:bg-white/5"
        style={{ padding: '6px 8px' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Live pulse dot */}
        {isLive && (
          <span
            className="rounded-full flex-shrink-0"
            style={{ width: 6, height: 6, background: '#71717A' }}
          />
        )}

        {/* Avatar */}
        <img
          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}&backgroundColor=0D0D14`}
          loading="lazy"
          alt={name}
          className="rounded-full flex-shrink-0"
          style={{ width: 28, height: 28, opacity: isLive ? 1 : 0.5 }}
        />

        {/* Text */}
        <div className="flex flex-col min-w-0 flex-1">
          <span
            className="font-medium truncate"
            style={{
              fontSize: 12,
              color: isLive ? '#fff' : 'rgba(255,255,255,0.4)',
            }}
          >
            {name}
          </span>
          <span
            className="truncate"
            style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}
          >
            {game}
          </span>
        </div>

        {/* Viewer count */}
        {isLive && (
          <PreviewBadge />
        )}
      </div>

      {/* Tooltip portal */}
      {tooltipTop !== null && (
        <TooltipCard
          name={name}
          game={game}
          viewers={viewers}
          avatarColor={avatarColor}
          initials={initials}
          isLive={isLive}
          streamTitle={streamTitle}
          top={tooltipTop}
        />
      )}
    </>
  );
}
