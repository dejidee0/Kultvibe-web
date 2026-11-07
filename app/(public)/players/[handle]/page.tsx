import { brand } from '@/lib/brand'
import { getPlayerByHandle } from '@/lib/playersData'
import { notFound } from 'next/navigation'
import PlayerProfileClient from './PlayerProfileLoader'
import type { Metadata } from 'next'
import type { PlayerData } from '@/lib/playersData'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const player = getPlayerByHandle((await params).handle)
  if (!player) return { title: `Player not found | ${brand.name}` }
  return {
    title: `Preview: ${player.handle} | ${brand.name}`,
    description: brand.siteDescription,
  }
}


export default async function PlayerProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const player = getPlayerByHandle((await params).handle)
  if (!player) notFound()
  return <PlayerProfileClient player={player as PlayerData} />
}
