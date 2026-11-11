# Media pipeline

Keep source files in `media-src/` (ignored by Git). Originals must remain unchanged. Use lowercase kebab-case names that describe the scene; do not put personal information in filenames.

## Add a clip

```sh
npm run media:optimize -- media-src/arena-night.mp4 --name arena-night --poster-at 1
```

This produces `public/videos/arena-night.mp4` by losslessly remuxing the original with faststart; `public/videos/arena-night-480.mp4` at 854×480, H.264 main, CRF 26, preset slow, yuv420p, faststart, and AAC 96 kb/s when the input has audio; and `public/posters/arena-night.webp` at 1280×720, quality 82. Only the mobile derivative is re-encoded. Poster timestamps must be inside the clip. Existing outputs are refused unless `--force` is supplied.

Non-16:9 inputs produce a warning. The complete frame is preserved with padding; smaller inputs are never upscaled. Provider marks must remain visible, including in page styling.

Set the matching stream entry's `videoSrc`, `mobileSrc`, and `posterSrc` to these three public paths. Titles and sample channel names must match the scene. Keep Preview labels and follow `CONTENT_AND_MEDIA_STANDARDS.md` for playback and loading rules.

## Add an image

```sh
npm run media:image -- media-src/arena-hero.png --name arena-hero --width 1600
```

This produces `public/images/arena-hero.webp` at quality 82, preserving the source aspect ratio. Inputs narrower than the requested width keep their original width. EXIF orientation is applied. Existing outputs are refused unless `--force` is supplied. Use Next Image with reserved dimensions or an aspect-ratio container, accurate `sizes`, meaningful alt text, and lazy loading except for the page's single LCP image.

## Budgets and review

- Desktop clip: under 3.5 MB per 10 seconds; preserve the original codec and quality.
- Mobile clip: under 1 MB per 10 seconds.
- Poster: under 80 KB.

Inspect every asset and its reported file size. A failed quality or budget check blocks wiring and release. Do not crop provider marks or overwrite originals to meet a budget. Record source, purpose, dimensions, rights, and any provider marks in `MEDIA.md`.

Generation briefs and provider review belong to Part C. These scripts do not generate content or fetch remote media.
