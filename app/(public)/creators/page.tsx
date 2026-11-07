import { brand } from '@/lib/brand'
import type { Metadata } from 'next'
import CreatorsClient from './CreatorsClient'

export const metadata: Metadata = {
  title: `Creators | ${brand.name}`,
  description: brand.siteDescription,
}

export default function CreatorsPage() {
  return <CreatorsClient />
}
