import { getStreamById } from '@/lib/streamsData'
import { notFound } from 'next/navigation'
import StreamWatchClient from './StreamWatchLoader'
import type { StreamData } from '@/lib/streamsData'


export default async function StreamWatchPage({ params }: { params: Promise<{ id: string }> }) {
  const stream = getStreamById((await params).id)
  if (!stream) notFound()
  return <StreamWatchClient stream={stream as StreamData} />
}
