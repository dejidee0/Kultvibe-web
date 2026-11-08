import Link from 'next/link'
import PreviewBadge from '@/components/ui/PreviewBadge'

export default function DashboardPreview({ title, description }: { title: string; description: string }) {
  return <section className="min-w-0">
    <h1 className="mb-3 flex flex-wrap items-center gap-3 break-words text-xl font-semibold text-white sm:text-2xl">{title}<PreviewBadge /></h1>
    <p className="max-w-xl text-sm leading-relaxed text-white/75">{description}</p>
    <Link href="/streams" className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-white/20 px-4 text-sm text-white/85 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-kv-gold">Explore preview streams</Link>
  </section>
}
