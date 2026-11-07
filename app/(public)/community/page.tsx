import type { Metadata } from 'next'
import CommunityClient from './CommunityLoader'

export const metadata: Metadata = {
  title: 'Community | KultVibe',
  description: 'Join the KultVibe community. Chat with gamers, producers, coders, and creators across Africa in real-time rooms.',
}


export default function CommunityPage() {
  return (
    <div className="h-full overflow-hidden">
      <CommunityClient />
    </div>
  )
}
