import { getWaitlistCount, waitlistCountCopy } from '@/lib/waitlistStats'
import { brand } from '@/lib/brand'

export default async function StatsBar() {
  const count = await getWaitlistCount()
  return (
    <section aria-label="Waitlist" className="flex min-h-36 min-w-0 flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-kv-surface px-4 py-6 text-center">
      <p className="flex min-h-14 items-center justify-center text-base font-medium text-white sm:text-lg">{waitlistCountCopy(count)}</p>
      <p className="text-sm text-kv-gold">{brand.tagline}</p>
    </section>
  )
}
