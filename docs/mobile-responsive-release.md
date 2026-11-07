# Responsive release verification

## Step 1: secured public fixes

Build passed with zero errors and 32 existing native-image lint warnings. Diff secret findings: 0. Prohibited staged files: 0. Artifacts and all env files except .env.example remain untracked.

| Commit | Concern |
|---|---|
| `35f3732f21c3079bdf9ef211e2a9db1a689a0f9d` | fix(discover): stack sidebar widgets on mobile |
| `f5031a2a4ac9f02e59de349bb749a9be511af95d` | fix(community): phone-sized room selector and chat layout |
| `b49eebec5ac8275f73a8ba31cd4e89d8f5099bad` | fix(streams): responsive cards, watch page chat/about views, gift panel |
| `94caf5153dfe1617af0706804c952ac36b7b75f1` | fix(compete): responsive filters, grid and tournament details |
| `b9e7f1b1a401a8d3e01e06f10ee76196d5897242` | fix(leaderboards): responsive rankings and podium |
| `20d51613c1044c20329ad80f2b79bb8f99fa8ff8` | fix(creators): responsive filters and grid |
| `502fce534893dc6b26b95328ec55c0beaf6d6d34` | fix(players): responsive profile tabs and match history |

Step 1 local and remote dev: `502fce534893dc6b26b95328ec55c0beaf6d6d34`.

## Step 2: public verification gate

Source verified: `52951769a74f99318aa328ee6f5257279cb9ad91`. Baseline: `9fe4e0b4c86e45d77052c48d8592f3cf5b32ddf3`. All 48 layout checks, 24 desktop comparisons, and 112 interaction checks passed. Both local servers were stopped and ports 3000/3001 verified free; the detached baseline checkout is retained idle for the dashboard comparison.

| Route | 320×640 | 360×800 | 390×844 | 768×1024 |
|---|:---:|:---:|:---:|:---:|
| `/` | PASS | PASS | PASS | PASS |
| `/discover` | PASS | PASS | PASS | PASS |
| `/compete` | PASS | PASS | PASS | PASS |
| `/streams` | PASS | PASS | PASS | PASS |
| `/leaderboards` | PASS | PASS | PASS | PASS |
| `/creators` | PASS | PASS | PASS | PASS |
| `/community` | PASS | PASS | PASS | PASS |
| `/login` | PASS; no main element | PASS; no main element | PASS; no main element | PASS; no main element |
| `/register` | PASS; no main element | PASS; no main element | PASS; no main element | PASS; no main element |
| `/compete/codm-cup` | PASS | PASS | PASS | PASS |
| `/streams/ghostalpha` | PASS | PASS | PASS | PASS |
| `/players/GhostAlpha` | PASS | PASS | PASS | PASS |

Every measured main element has scrollWidth <= clientWidth. Every route has zero right-edge offenders under the requested ancestor overflow-x exception. Login/register are existing standalone placeholder pages without a main element.

| Desktop route | 1280×800 difference | 1440×900 difference |
|---|---:|---:|
| `/` | 0.0000% | 0.0000% |
| `/discover` | 0.0000% | 0.0000% |
| `/compete` | 0.0000% | 0.0000% |
| `/streams` | 0.0000% | 0.0000% |
| `/leaderboards` | 0.0000% | 0.0000% |
| `/creators` | 0.0000% | 0.0000% |
| `/community` | 0.0585% | 0.0462% |
| `/login` | 0.0000% | 0.0000% |
| `/register` | 0.0000% | 0.0000% |
| `/compete/codm-cup` | 0.0000% | 0.0000% |
| `/streams/ghostalpha` | 0.0000% | 0.0000% |
| `/players/GhostAlpha` | 0.0000% | 0.0000% |

Maximum desktop difference: 0.0585%. No route exceeds 0.5%. External image requests were blocked on both servers using the same transparent response. Moving videos were hidden, timers frozen and CSS animations/transitions disabled identically; layout and text were compared using pixelmatch (threshold 0.1).

The initial comparison exposed desktop filter wrapping, search-control sizing, and tab-height drift. These were corrected and rebuilt in `52951769a74f99318aa328ee6f5257279cb9ad91`; the tables above come from the complete rerun.

Interactions: 112/112 passed, covering filters, grid/list views, tournament/profile tabs, community room/member switching, composer and short viewports, stream chat/about/offline views, mute/theatre controls, gift dialog dismissal, bottom-navigation clearance and opening/closing signup dialogs. No signup was submitted, no API write traffic reached the backend, and no browser runtime errors were recorded.

Setup corrections before the final run: startup polling switched to curl; the baseline worktree was moved outside the frontend ESLint hierarchy; readiness checks now await actual UI states and heavy runs are sequential on the 4 GB machine.

## Step 3: production release

Production merge commit, main and dev immediately after Step 3: `0011e21b3bd8a8c4de859c09f53931c87afdb166`. No force push, history rewrite, Vercel setting change, or environment-variable change was used.

- Production build before: `i-9UQf9mfAibb5imZendy`.
- Production build after: `0X5prlJduG1_Gku5DyHDi`.
- New build observed 42.2 seconds into polling, 49.8 seconds after the main push.
- Build ID came from the App Router payload because this page exposes no build-ID manifest path.
- API health GET: HTTP 200.

| Live route | 360×800 | 390×844 |
|---|:---:|:---:|
| `/` | PASS (200) | PASS (200) |
| `/discover` | PASS (200) | PASS (200) |
| `/compete` | PASS (200) | PASS (200) |
| `/streams` | PASS (200) | PASS (200) |
| `/leaderboards` | PASS (200) | PASS (200) |
| `/creators` | PASS (200) | PASS (200) |
| `/community` | PASS (200) | PASS (200) |
| `/login` | PASS (200) | PASS (200) |
| `/register` | PASS (200) | PASS (200) |
| `/compete/codm-cup` | PASS (200) | PASS (200) |
| `/streams/ghostalpha` | PASS (200) | PASS (200) |
| `/players/GhostAlpha` | PASS (200) | PASS (200) |

All 24 live checks have zero main overflow and zero requested right-edge offenders. Real production images/video were retained; navigation and read-only checks only. Screenshots are saved under `.artifacts/mobile/live/<route-slug>-<width>.png`.

The verification-report push had one transient GitHub DNS failure; the identical non-force push succeeded on its bounded retry before main was merged.

## Step 4: dashboard sweep

Dashboard layout commit (dev only): `13c673b4341a919543fa4ecbd46cc9028ae11e1f`. Production main remains `0011e21b3bd8a8c4de859c09f53931c87afdb166`. The only dashboard source change adjusts match-heading wrapping and mobile type size; copy and data are unchanged. Dev and the production comparison worktree both built with zero errors and the existing 32 image warnings.

| Dashboard route | 320×640 | 360×800 | 390×844 | 768×1024 |
|---|:---:|:---:|:---:|:---:|
| `/dashboard` | PASS | PASS | PASS | PASS |
| `/dashboard/creator` | PASS | PASS | PASS | PASS |
| `/dashboard/matches/mobile-layout-check` | PASS | PASS | PASS | PASS |
| `/dashboard/notifications` | PASS | PASS | PASS | PASS |
| `/dashboard/rank` | PASS | PASS | PASS | PASS |
| `/dashboard/settings` | PASS | PASS | PASS | PASS |
| `/dashboard/stream` | PASS | PASS | PASS | PASS |
| `/dashboard/tournaments` | PASS | PASS | PASS | PASS |
| `/dashboard/wallet` | PASS | PASS | PASS | PASS |

| Desktop dashboard route | 1280×800 difference | 1440×900 difference |
|---|---:|---:|
| `/dashboard` | 0.0000% | 0.0000% |
| `/dashboard/creator` | 0.0000% | 0.0000% |
| `/dashboard/matches/mobile-layout-check` | 0.0000% | 0.0000% |
| `/dashboard/notifications` | 0.0000% | 0.0000% |
| `/dashboard/rank` | 0.0000% | 0.0000% |
| `/dashboard/settings` | 0.0000% | 0.0000% |
| `/dashboard/stream` | 0.0000% | 0.0000% |
| `/dashboard/tournaments` | 0.0000% | 0.0000% |
| `/dashboard/wallet` | 0.0000% | 0.0000% |

Dashboard interactions: 36/36 route/viewport scenarios passed. Two initial search clicks were retried after adding an explicit client-hydration wait; initial timing results were retained in ignored artifacts. Main-content text meets the 14px minimum, measured header/navigation tap targets meet 44px, content clears the mobile tab bar, search expands, More navigation opens/closes, and signup dialogs open/close without submission. All nine dashboard routes currently contain placeholder headings and have no page-specific tabs or controls; no business features or mock content were added.

## Final status

- No failing mobile layout or interaction checks remain in the requested routes/states tested in Chromium.
- Existing dashboard and standalone auth placeholder content remains unchanged.
- No signup was submitted and no API write request was sent. The backend repo was not accessed or modified.
- Both local servers are stopped; ports 3000 and 3001 are free. The temporary production comparison worktree was removed.
- Remaining warnings: 32 pre-existing native-image lint warnings.
- Dashboard changes remain on dev and have not been merged into production.
