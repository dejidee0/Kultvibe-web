import { getPlayerByHandle } from '@/lib/playersData'
import { notFound } from 'next/navigation'
import PlayerProfileClient from './PlayerProfileLoader'
import type { Metadata } from 'next'
import type { PlayerData } from '@/lib/playersData'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const player = getPlayerByHandle((await params).handle)
  if (!player) return { title: 'Player Not Found | KultVibe' }
  return {
    title: `${player.handle} — ${player.primaryGame} | KultVibe`,
    description: `${player.handle} is ranked ${player.rank} on KultVibe. ${player.wins} wins, ${player.totalEarnings} earned. ${player.bio}`,
  }
}


export default async function PlayerProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const player = getPlayerByHandle((await params).handle)
  if (!player) notFound()
  return <PlayerProfileClient player={player as PlayerData} />
}
