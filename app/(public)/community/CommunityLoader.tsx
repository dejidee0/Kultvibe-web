'use client'

import dynamic from 'next/dynamic'

const CommunityLoader = dynamic(() => import('./CommunityClient'), {
  ssr: false,
  loading: () => <div className="flex-1 bg-kv-base animate-pulse" />,
})

export default CommunityLoader
