# Product and media refresh verification

Updated: 2026-11-09.

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

## B3: user-type waitlist form

The register modal starts with accessible native radio options for Gamer, Creator and Brand, defaulting to Gamer and using the approved descriptions. Gamer has an optional main game; Brand requires a company name; Creator has no extra field. Music, Tech and Lifestyle are optional checkbox chips capped at three. Requests use the generated schema and omit primaryVertical and inactive conditional fields.

The modal uses 16px inputs, 44px targets, inner scrolling, focus containment/restoration and Escape dismissal. It shows API field errors, duplicate/rate/network messages, and the API success message. Existing account actions explicitly explain that accounts open at launch and do not make authentication requests. Removed the obsolete frontend vertical-selector exports; the generated legacy API field remains for compatibility.

TypeScript and lint pass with zero errors and 32 existing image warnings. The full mocked form/error/viewport matrix is still required by B7 before any frontend production merge.

## B4: real waitlist count

Replaced the four invented counters with a server-rendered waitlist message. lib/waitlistStats.ts uses the existing NEXT_PUBLIC_API_BASE_URL, the generated count response type, a 60-second data-cache revalidation and a 3.5-second timeout. Only successful non-negative safe-integer counts are displayed.

Below 25: Be one of the first on KultVibe. At 25 and above: floor to the nearest five, format with English thousands separators, and show the required waitlist message. Errors and malformed responses show Join the KultVibe waitlist. with no number. The section and copy reserve enough vertical space for wrapped text, with no counter animation.

TypeScript and lint pass with zero errors and the same 32 image warnings. No API request was made by these static checks. The server-rendered mocked cases 0, 12, 30, 1250 and error remain required in B7.

## B5: honest preview content

Added the exact shared PreviewNotice on public sample pages and dashboard pages, plus neutral Preview tags on stream cards, section headers, creator cards, discovery cards, community rooms, profiles, tournaments and leaderboards. Red LIVE pills became PREVIEW. Hidden simulated viewer counts and stream timers, including the channel tooltip/row, chat header and discovery watching counter. Existing sample data remains intact; stream tags labelled LIVE render as PREVIEW.

Gift UI explains that it is a sample and no money is charged. Wallet and other dashboard placeholders now have clear preview/empty states rather than generic Page headings. Standalone login/register pages explain the current waitlist stage and open the same accessible registration modal; they do not implement account authentication.

TypeScript and lint pass: zero errors and the same 32 existing image warnings. Removed a duplicate use-client directive exposed by the new import, eliminating the temporary extra warning. Verified 13 protected navigation/category checks against original main: unchanged sidebar/navigation data, mobile/dashboard navigation, category data, creator/discover fixtures, and the inline stream/tournament/leaderboard/discover lists. Full rendered regression remains gated on B7.

## B6: poster-first responsive media

Extended the four video entries with mobileSrc and posterSrc and verified the rest of the stream source is unchanged. Added a shared player and page-wide two-video coordinator, wired through StreamCard, StreamsClient, FeaturedStream and StreamWatchClient. JavaScript selects the 480 variant for narrow/slow connections and Save-Data. Posters render before playback; off-screen cards do not mount a video or attach its source until visible. Players pause off screen and in hidden tabs, and reduced-motion/Save-Data disable autoplay. Featured/watch players expose manual play, and desktop cards use hover while coarse-pointer cards can play in view.

Removed random title-to-clip mismatches. Whole-frame contain fitting preserves provider marks. The featured profile bar sits below the video rather than covering its lower edge, and watch controls sit above the frame's lower-right corner. Added accessible video and icon-control labels.

Converted all **32** raw image usages (the prompt estimated 18) to next/image, with sizes and reserved dimensions/fill, lazy loading and alt text. Existing SVG/external references and already-optimized posters avoid a second encode/proxy fetch. No new image host was introduced; the existing Dicebear remotePattern remains. Only the homepage featured poster has priority.

MEDIA.md inventories 20 local assets with dimensions and byte sizes and 56 existing artwork references, preserves the exact stream-pack rights notice, and explicitly identifies unverified external rights and OG embedded tagline. CONTENT_AND_MEDIA_STANDARDS.md records approved vocabulary, accessibility, preview and media rules.

TypeScript and lint pass: **0 errors, 0 warnings**. Verified original asset files are unchanged. Corrected two verification/edit-script assumptions: self-closing video tags, and AST printer formatting in an unchanged-data comparison. The final comparison strips only the ten allowed new media-field lines and otherwise matches the original source. The full production-build playback, count/form, weight and layout checks remain mandatory in B7.

## Remaining steps

B1 through B8 remain pending. Part C remains gated on Part B.
