type PreviewMember = {
  video: HTMLVideoElement
  source: string
  canPlay: () => boolean
  rank: () => number
  granted?: boolean
  pending?: boolean
}

const members = new Set<PreviewMember>()

export function syncPreviewVideos() {
  const selected = new Set([...members].filter(member => member.canPlay()).sort((a, b) => b.rank() - a.rank()).slice(0, 2))
  // Pause revoked players before starting another, including pending play promises.
  for (const member of members) {
    member.granted = selected.has(member)
    if (!member.granted) member.video.pause()
  }
  for (const member of selected) {
    const video = member.video
    if (video.getAttribute('src') !== member.source) {
      video.setAttribute('src', member.source)
      video.load()
    }
    if (!video.paused || member.pending) continue
    member.pending = true
    try {
      void video.play().catch(() => {}).finally(() => {
        member.pending = false
        if (!previewVideoIsGranted(video)) video.pause()
      })
    } catch { member.pending = false }
  }
}

export function registerPreviewVideo(member: PreviewMember) {
  members.add(member)
  syncPreviewVideos()
  return () => { member.granted = false; members.delete(member); member.video.pause(); syncPreviewVideos() }
}

export function previewVideoIsGranted(video: HTMLVideoElement) {
  return [...members].some(member => member.video === video && member.granted)
}
