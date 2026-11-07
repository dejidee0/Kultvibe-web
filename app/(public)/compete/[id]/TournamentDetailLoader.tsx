'use client'

import dynamic from 'next/dynamic'

const TournamentDetailLoader = dynamic(() => import('./TournamentDetailClient'), {
  ssr: false,
  loading: () => <div className="flex-1 bg-kv-base animate-pulse" />,
})

export default TournamentDetailLoader
