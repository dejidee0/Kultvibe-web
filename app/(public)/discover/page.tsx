import { brand } from '@/lib/brand'
import type { Metadata } from 'next'
import DiscoverClient from './DiscoverClient'

export const metadata: Metadata = {
  title: `Discover | ${brand.name}`,
  description: brand.siteDescription,
}

export default function DiscoverPage() {
  return <DiscoverClient />
}
