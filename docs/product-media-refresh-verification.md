# Product and media refresh verification

Updated: 2026-11-07.

## B0: media inventory and production baseline

All twelve owner-supplied files exist: four desktop clips, their four mobile variants and four WebP posters. These are intentionally supplied preview assets; no generation, download, cropping or re-encoding was performed in this step.

Frontend dev and main before implementation: `792b7a006473a23d0d1cd60bbf150ead8f8bf7ec`. Both the working checkout and the isolated current-main production build passed, with the existing 32 native-image warnings. The isolated build reused the same installed dependencies through a temporary junction; that junction and checkout were removed after measurement, leaving the primary dependencies intact.

At 390 by 844, with cold browser cache and a fixed 10-second observation window after DOMContentLoaded and fonts ready:

| Metric | Before |
|---|---:|
| Response bytes transferred | 3087366 |
| Request count | 48 |
| MP4 response bytes | 2638896 |

CDP encoded transfer lengths include completed responses and observed chunks for ongoing responses. API traffic was mocked, and API writes were blocked. Both measurement runs use this same method. Port 3001 is free after cleanup.

## Remaining steps

B1 through B8 remain pending. Part C remains gated on Part B.
