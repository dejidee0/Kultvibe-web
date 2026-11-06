'use client';

import React, { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserGroupIcon, Money01Icon, LiveStreaming01Icon, Award01Icon } from '@hugeicons/core-free-icons';

function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export default function StatsBar() {
  const players     = useCountUp(12480);
  const payouts     = useCountUp(14200000);
  const liveMinutes = useCountUp(3100000);
  const tournaments = useCountUp(847);

  const stats = [
    {
      icon: UserGroupIcon,
      iconColor: '#F0B429',
      value: players.toLocaleString(),
      label: 'Players registered',
    },
    {
      icon: Money01Icon,
      iconColor: '#F0B429',
      value: `₦${(payouts / 1000000).toFixed(1)}M`,
      label: 'Total payouts',
    },
    {
      icon: LiveStreaming01Icon,
      iconColor: '#F0B429',
      value: `${(liveMinutes / 1000000).toFixed(1)}M+`,
      label: 'Live minutes streamed',
    },
    {
      icon: Award01Icon,
      iconColor: '#F0B429',
      value: tournaments.toLocaleString(),
      label: 'Tournaments run',
    },
  ];

  return (
    <div className="bg-kv-surface rounded-xl px-4 py-6 lg:px-8">
      <div className="grid min-w-0 grid-cols-2 gap-y-6 lg:grid-cols-4 lg:gap-y-0">
        {stats.map(({ icon, iconColor, value, label }) => (
          <div key={label} className="flex flex-col items-center justify-center gap-1 min-w-0 px-2 lg:px-6">
            <HugeiconsIcon icon={icon} size={20} color={iconColor} strokeWidth={1.5} />
            <p className="text-2xl font-medium text-white">{value}</p>
            <p className="text-xs text-white/40 text-center">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
