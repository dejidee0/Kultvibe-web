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

Pending.

## Step 4: dashboard sweep

Pending.
