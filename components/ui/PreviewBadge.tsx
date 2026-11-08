export default function PreviewBadge({ uppercase = false }: { uppercase?: boolean }) {
  return <span data-preview-badge className="inline-flex shrink-0 items-center rounded border border-white/20 bg-[#25252F] px-2 py-0.5 align-middle text-[10px] font-medium leading-4 tracking-wide text-white/85">{uppercase ? 'PREVIEW' : 'Preview'}</span>
}
