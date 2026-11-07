'use client'

import dynamic from 'next/dynamic'

const StreamWatchLoader = dynamic(() => import('./StreamWatchClient'), {
  ssr: false,
  loading: () => <div className="flex-1 bg-kv-base animate-pulse" />,
})

export default StreamWatchLoader
