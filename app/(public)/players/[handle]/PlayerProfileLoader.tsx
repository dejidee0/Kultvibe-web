'use client'

import dynamic from 'next/dynamic'

const PlayerProfileLoader = dynamic(() => import('./PlayerProfileClient'), {
  ssr: false,
  loading: () => <div className="flex-1 bg-kv-base animate-pulse" />,
})

export default PlayerProfileLoader
