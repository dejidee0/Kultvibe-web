export const streamMedia = {
  '/videos/featured-stream.mp4': { mobileSrc: '/videos/featured-stream-480.mp4', posterSrc: '/posters/featured-stream.webp' },
  '/videos/stream-pubg.mp4': { mobileSrc: '/videos/stream-pubg-480.mp4', posterSrc: '/posters/stream-pubg.webp' },
  '/videos/stream-beatbattle.mp4': { mobileSrc: '/videos/stream-beatbattle-480.mp4', posterSrc: '/posters/stream-beatbattle.webp' },
  '/videos/stream-eafc.mp4': { mobileSrc: '/videos/stream-eafc-480.mp4', posterSrc: '/posters/stream-eafc.webp' },
} as const

export function mediaForVideo(videoSrc?: string) {
  return videoSrc ? streamMedia[videoSrc as keyof typeof streamMedia] : undefined
}
