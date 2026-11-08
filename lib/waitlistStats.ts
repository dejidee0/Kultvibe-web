import type { paths } from '@/lib/api/types'
import { brand } from '@/lib/brand'

type CountEnvelope = paths['/api/waitlist/count']['get']['responses'][200]['content']['application/json']

export async function getWaitlistCount(): Promise<number | null> {
  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')
  if (!baseUrl) return null
  try {
    const response = await fetch(`${baseUrl}/api/waitlist/count`, {
      headers: { Accept: 'application/json' }, credentials: 'omit',
      cache: 'force-cache', next: { revalidate: 60 }, signal: AbortSignal.timeout(3500),
    })
    if (!response.ok) return null
    const envelope = await response.json() as Partial<CountEnvelope>
    const count = envelope?.data?.count
    return envelope?.success === true && typeof count === 'number' && Number.isSafeInteger(count) && count >= 0 ? count : null
  } catch { return null }
}

export function waitlistCountCopy(count: number | null): string {
  if (count === null) return `Join the ${brand.name} waitlist.`
  if (count < 25) return `Be one of the first on ${brand.name}.`
  const roundedDown = Math.floor(count / 5) * 5
  return `${roundedDown.toLocaleString('en-GB')}+ people are already on the waitlist.`
}
