import type { Metadata } from 'next'
import StreamsClient from './StreamsClient'

export const metadata: Metadata = {
  title: 'Live Streams | KultVibe',
  description: 'Watch live gaming, music, tech, and lifestyle streams from African creators. COD Mobile, PUBG, EA FC, Afrobeats and more.',
}

export default async function StreamsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  return <StreamsClient initialCategory={(await searchParams).category} />
}
