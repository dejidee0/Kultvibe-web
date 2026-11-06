# KultVibe frontend status

Updated: 2026-11-06

Current phase: Phase 1, waitlist.

Backend is live at https://api.kultvibe.com; see the live deployment details below.

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

- Check the HTTPS certificate renewal in late January 2027.
- Track the low-priority HEAD health-check response (405).
- Resolve the open six-verticals versus two-pillars decision with David; preserve existing enum values.
- Phase 1 implements waitlist signup; account and login behavior belong to later work.

## Live deployment

- Backend: https://api.kultvibe.com, hosted on SmarterASP. DNS is CNAME `api` -> `mykultvibe-001-site1.ktempurl.com`; DNS is managed in Vercel because the domain uses Vercel nameservers, and the domain is registered at Namecheap.
- HTTPS uses a SmarterASP free Let's Encrypt certificate, expiring 2027-02-04. Check renewal in late January 2027.
- The API serves `/.well-known` before HTTPS redirection so ACME certificate validation and renewal work.
- Hosting-level Basic authentication on the SmarterASP site is disabled; it had blocked all requests with HTTP 401. The API's admin endpoints retain their own authentication.
- Production CORS allows https://kultvibe.com, https://www.kultvibe.com, and https://kultvibe.vercel.app. The apex domain redirects to https://www.kultvibe.com.
- SmarterASP server IP 208.98.35.144 is authorised in Brevo. Live confirmation-email delivery was verified in a real inbox.
- Known low-priority issue: `HEAD /api/health` returns 405; `GET /api/health` returns 200.
- Open decision: six verticals versus two pillars (gaming and creators, with streaming as a bridge), pending discussion with David. Preserve the existing enum values while that decision is pending.

## Run locally

1. Run `npm ci` in this repository.
2. Optionally copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_BASE_URL=http://localhost:5080` for local development; the template defaults to the live HTTPS API. With no variable in development, the API URL defaults to localhost.
3. Start the configured .NET backend in Development on port 5080, then run `npm run dev` here on port 3000.
4. Use the waitlist modal. Production builds require the public API base URL explicitly; they do not fall back to localhost.

See [waitlist integration setup](waitlist-integration.md) for the API contract and CORS setup. Do not put backend email, database, or admin credentials in frontend environment files.

## Deployment targets

- Backend: SmarterASP, IIS in-process hosting, deployed from the sibling backend repository through Web Deploy.
- Frontend: Vercel; merging the web repository into main triggers the production deploy. Vercel settings and environment variables are managed separately.
