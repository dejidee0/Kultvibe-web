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

## Security remediation before B2

The owner asked us to choose the best response to the pre-existing audit findings. Upgraded Next.js and eslint-config-next from 14.2.35 to 15.5.29, on the supported maintenance branch, and React/React DOM to 19.3.1 with React 19 types. Updated async route params/searchParams, the async player metadata return type, the social icon ReactElement type, and moved four existing browser-only dynamic loaders into client boundaries. The lint script invokes ESLint directly because next lint is deprecated. The Next.js build also added its required ES2017 TypeScript target; that automatic config update is included.

Applied compatible transitive updates and narrowly scoped overrides for the TypeScript parser's minimatch, brace-expansion 1.x, and PostCSS. The lockfile resolves patched versions. Review these overrides when upstream dependencies adopt their patches; they must not be removed without re-running audit and compatibility checks.

- npm audit: **0 vulnerabilities**, down from 15 pre-existing findings.
- Production build: **passed, 0 errors**, the same **32 existing native-image warnings**.
- ESLint: **passed, 0 errors, 32 existing native-image warnings**. B6 will replace those images.
- Mocked local production browser check at 390 by 844: **22 routes passed**, including dynamic routes, the Music search parameter and nine dashboard routes; no horizontal main overflow, no runtime errors, and the signup modal opened. No API writes occurred.
- Test correction: the first attempt incorrectly assumed standalone login/register pages contained main; corrected the test to inspect their document width. No application workaround was used.
- Local server stopped, logs removed, port 3000 free. No production merge or deployment in this step.

Sources: [Next.js security update](https://nextjs.org/blog/nextjs-security-update-october-14-2026), [Next.js 15 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-15).

## B2: one brand and copy source

Created lib/brand.ts with the owner's exact product name, tagline, one-line description, metadata copy, three user types and descriptions, and interest labels/helper. Root and public route metadata, the auth modal, header branding and marketing CTAs use those constants. Player metadata explicitly identifies sample profiles as Preview instead of presenting invented achievements as real.

TypeScript passes. ESLint passes with zero errors and the same 32 existing image warnings. The source scan for the old marketing wording returned zero hits. A zero-hit rg command exits 1 by convention; it was an empty result, not a failed content check.

Left unchanged by instruction: logo asset bytes; all navigation/sidebar lists and their destinations; sidebarData categories; lib/constants CATEGORIES; StreamsClient CATEGORIES; CompeteClient VERTICALS; LeaderboardsClient VERTICAL_OPTIONS; creator/discover filter categories; and community category/room data. Sample fixture names remain fixture data. These lists await the owner's separate decision.

## Remaining steps

B1 through B8 remain pending. Part C remains gated on Part B.
