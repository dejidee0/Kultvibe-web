import { brand } from '@/lib/brand'
import type { Metadata } from 'next'
import CommunityClient from './CommunityLoader'

export const metadata: Metadata = {
  title: `Community | ${brand.name}`,
  description: brand.siteDescription,
}


export default function CommunityPage() {
  return (
    <div className="h-full overflow-hidden">
      <CommunityClient />
    </div>
  )
}
