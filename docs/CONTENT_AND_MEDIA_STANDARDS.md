# Content and media standards

KultVibe's approved copy lives in lib/brand.ts. Product vocabulary is Gamer, Creator and Brand. The product is KultVibe. Streaming is the shared stage; Music, Tech and Lifestyle are optional votes for what to build next. Navigation and category lists are a separate owner decision and must not be silently changed.

Use the exact approved tagline Compete. Stream. Earn., the site title/description and user-type labels/descriptions from the brand module. Do not duplicate competing marketing strings in components. No six-vertical positioning, invented achievements, invented live counters, lorem ipsum, visible TODOs or generic placeholder page headings. Write plain, confident sentence case with correct punctuation. Sample people, streams, tournaments, rankings, chat, gifts and wallet content must visibly say Preview.

Every page with sample content uses PreviewNotice with the exact notice approved by the owner. Sample streams use neutral PREVIEW labels and do not show simulated viewer counts or live timers. Registration is the real waitlist flow; preview account, gift and wallet actions must explain their current availability without pretending to perform real transactions.

Use meaningful alt text. Empty alt is reserved for decorative images beside an equivalent label. Name icon-only controls and videos, preserve keyboard focus and Escape dismissal, keep readable contrast, and use 44px interactive targets and 16px form inputs. At 320px, dialogs scroll internally and content must not clip or overflow horizontally.

Images use next/image with width/height or fill plus sizes. Reserve the aspect ratio before loading. Lazy loading is the default, and only one LCP image per page receives priority. Do not upscale asset files or destructively replace originals. Avoid another lossy encode of already-optimized posters. SVG/existing externally-sized references can remain unoptimized while retaining reserved dimensions and sizes. Never introduce a new hotlink or stock download without owner authorization.

Video components must provide a poster and accessible label. Use metadata preload while in view and none off screen. Choose the mobile variant in JavaScript on narrow screens, slow connections or Save-Data. Autoplay must be muted and playsInline, and is disabled for reduced-motion and Save-Data preferences. Desktop cards play on hover; coarse-pointer cards can play when visible. Pause off screen and in hidden tabs. At most two preview videos may play simultaneously; explicit manual play remains available on featured/watch players.

Show the complete video/poster frame. Do not crop away or edit out provider marks. Generated media is permitted only in the task's Part C gate using available authorized capabilities. Preserve originals, log prompts/tool/date/attempts/marks and review every generated image and representative video frames. Keep fictional adult subjects and clear Preview labels. Document rights and uncertainties in MEDIA.md and the processing workflow in MEDIA_PIPELINE.md.

Frontend verification must use mocked API traffic. Never submit a real signup while checking layout, copy, forms or media. Build, lint, copy/count/form tests, media behavior, page weight and all-route mobile regression must pass before the authorized production merge. Artifacts, local environment values and originals stay out of git.
