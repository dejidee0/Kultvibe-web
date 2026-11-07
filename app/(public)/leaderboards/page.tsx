import { brand } from '@/lib/brand'
import type { Metadata } from 'next'
import LeaderboardsClient from './LeaderboardsClient'

export const metadata: Metadata = {
  title: `Leaderboards | ${brand.name}`,
  description: brand.siteDescription,
}

export default function LeaderboardsPage() {
  return <LeaderboardsClient />
}
