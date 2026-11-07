import { brand } from '@/lib/brand'
import type { Metadata } from 'next'
import StreamsClient from './StreamsClient'

export const metadata: Metadata = {
  title: `Streams | ${brand.name}`,
  description: brand.siteDescription,
}

export default async function StreamsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  return <StreamsClient initialCategory={(await searchParams).category} />
}
