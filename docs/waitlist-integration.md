# Waitlist integration

The signup modal calls the .NET API directly. The former Next.js Resend endpoint has been removed, so the backend owns persistence, validation, duplicate detection, rate limiting, and confirmation email delivery.

## Local development

1. Copy `.env.example` to `.env.local` and change `NEXT_PUBLIC_API_BASE_URL` to `http://localhost:5080` for local development; the template defaults to https://api.kultvibe.com. Copying is optional in `next dev`: with no variable, the API URL defaults to localhost.
2. Start the configured backend on port 5080 in Development, then run `npm run dev` here on port 3000.
3. The backend Development settings allow `http://localhost:3000` and `http://127.0.0.1:3000`. If intentionally running the backend in Production locally, set `CORS__AllowedOrigins` in that process to the local frontend origin; do not edit or expose credentials.

## Production configuration (before deployment)

- Set `NEXT_PUBLIC_API_BASE_URL` to the public HTTPS API base URL **before building** the frontend. It must not contain credentials or end with `/api`. A production build without this setting refuses signup instead of reporting success.
- Set the backend `CORS__AllowedOrigins` to the exact frontend origin(s), comma separated. Do not enable a wildcard to work around a mismatched origin.
- The browser sends public signup requests directly, without credentials. This preserves the backend rate limiter's client IP instead of grouping visitors behind a Next.js proxy. If the API later sits behind a reverse proxy, configure ASP.NET Core forwarded headers for that trusted proxy explicitly.
- Brevo and database credentials belong only to the backend. No Resend key is needed by this waitlist flow.

## Contract

`POST {API_BASE_URL}/api/waitlist` sends `fullName`, `email`, optional `gamerTag`, and `primaryVertical` (Gaming, Tech, Music, Lifestyle, Streaming, or Creator).

The form shows success only for HTTP 201 with `success: true` and signup data in the ApiResponse envelope. Validation errors (400), duplicate email (409), rate limiting (429), network failures, and server failures remain visible as errors. This is waitlist signup, not account creation or login.
