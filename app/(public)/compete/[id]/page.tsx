import { getTournamentById } from '@/lib/tournamentsData'
import { notFound } from 'next/navigation'
import TournamentDetailClient from './TournamentDetailLoader'
import type { TournamentData } from '@/lib/tournamentsData'


export default async function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const tournament = getTournamentById((await params).id)
  if (!tournament) notFound()
  return <TournamentDetailClient tournament={tournament as TournamentData} />
}
