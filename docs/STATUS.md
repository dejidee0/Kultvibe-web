# KultVibe frontend status

Updated: 2026-11-05

Current phase: Phase 1, waitlist.

Backend deployed: see DECISIONS.md

## Done

- Next.js frontend with the existing KultVibe dark, gold, emerald, and pink visual palette.
- Waitlist form sends fullName, email, optional gamerTag, and one of the six supported primaryVertical values to the .NET API.
- Browser calls the API directly, preserving the backend's per-client-IP limiter behavior; the old Resend handler is removed.
- Signup succeeds only after HTTP 201 with valid ApiResponse signup data. Validation, duplicate, rate-limit, network, and server errors remain errors.
- The waitlist form does not request an account password or claim to create an account.
- Local production build and TypeScript checking passed; existing image and React Hook lint warnings remain.
- Local mocked client checks passed for success, validation, duplicates, rate limiting, server/network failures, malformed success, and production API URL configuration.
- Private .env files and .next are ignored; .env.example is a sanitized public-configuration template.

## Pending

- Verify dev publication and the backend's production readiness, deployment, live smoke test, and exact public API URL.
- Set NEXT_PUBLIC_API_BASE_URL before a future production build and allow the exact frontend origin in backend CORS configuration.
- Frontend deployment and Vercel settings are outside the current authorized backend deployment run.
- Phase 1 implements waitlist signup; account/login behavior belongs to later work.
- Resolve the verticals decision with David; do not remove existing backend enum values once real signups exist.

## Run locally

1. Run `npm ci` in this repository.
2. Optionally copy `.env.example` to `.env.local`. In development, the API URL defaults to `http://localhost:5080`.
3. Start the configured .NET backend in Development on port 5080, then run `npm run dev` here on port 3000.
4. Use the waitlist modal. Production builds require the public API base URL explicitly; they do not fall back to localhost.

See [waitlist integration setup](waitlist-integration.md) for the API contract and CORS setup. Do not put backend email, database, or admin credentials in frontend environment files.

## Deployment targets

- Backend: SmarterASP, IIS in-process hosting, deployed from the sibling backend repository through Web Deploy.
- Frontend: Vercel. Do not deploy the frontend or change Vercel settings during this backend deployment run.
