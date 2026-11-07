import { brand } from '@/lib/brand'
import type { Metadata } from 'next'
import CompeteClient from './CompeteClient'

export const metadata: Metadata = {
  title: `Compete | ${brand.name}`,
  description: brand.siteDescription,
}

export default function CompetePage() {
  return <CompeteClient />
}
