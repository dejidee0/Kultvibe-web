'use client';

import Image from 'next/image'

import { useState } from 'react';
import Lottie from 'lottie-react';
import sparkleAnimation from '@/lib/lottie/sparkle.json';

type Props = {
  twemojiHex?: string;
  label?: string;
  emoji: string;
  size?: number;
  showSparkle?: boolean;
};

export default function GiftVisual({ twemojiHex, label, emoji, size = 32, showSparkle = false }: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  const useImage = !!twemojiHex && !imgFailed;

  const icon = useImage ? (
    <Image
      src={`https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${twemojiHex}.svg`}
      alt={label ? `${label} preview gift` : 'Preview gift icon'}
      width={size}
      height={size}
      onError={() => setImgFailed(true)}
      style={{ display: 'block' }}
      draggable={false} unoptimized sizes={`${size}px`} loading="lazy" />
  ) : (
    <span style={{ fontSize: size, lineHeight: 1 }}>{emoji}</span>
  );

  if (!showSparkle) return icon;

  const sparkleSize = size * 3;
  const overflow = (sparkleSize - size) / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Lottie bursts outward - extends beyond the icon box */}
      <Lottie
        aria-hidden="true"
        animationData={sparkleAnimation}
        loop={false}
        style={{
          position: 'absolute',
          width: sparkleSize,
          height: sparkleSize,
          top: -overflow,
          left: -overflow,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div className="relative" style={{ zIndex: 1, width: size, height: size }}>
        {icon}
      </div>
    </div>
  );
}
