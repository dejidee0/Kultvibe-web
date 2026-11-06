# KultVibe decisions

- 2026-11-05: Use SmarterASP instead of Railway for backend hosting. The frontend deployment target remains Vercel.
- 2026-11-05: Use a single hosted environment on the free tier; do not provision a separate hosted staging environment.
- 2026-11-05: Limit public waitlist signup per client IP to 10 requests per hour, with no queue and a JSON ApiResponse for HTTP 429.
- 2026-11-05: The Brevo sender domain is authenticated. Prior delivery was confirmed by the recipient. ConfirmationEmailSent records successful provider acceptance, rather than a delivery receipt.
- 2026-11-05: Enable production Swagger through Swagger:Enabled. The tracked default is false; the ignored production configuration enables it.
- 2026-11-05: Admin endpoints use Basic auth in Phase 1, replaced by JWT in Phase 2. Credentials stay outside tracked files and reports.
- 2026-11-05: OPEN item: "Verticals: 6 vs 2 pillars (gaming + creators, streaming as bridge) - pending decision with David. Do not remove existing Vertical enum values once real signups exist."
- 2026-11-05: Backend deployment status is pending. No backend deployment has been completed at this checkpoint. Backend Web Deploy is authorized only after hygiene, publication, and readiness gates pass; frontend deployment is not authorized in this run.

- 2026-11-06: Backend is live at https://api.kultvibe.com. DNS is CNAME api -> mykultvibe-001-site1.ktempurl.com, managed in Vercel DNS because the domain uses Vercel nameservers; the domain is registered at Namecheap.
- 2026-11-06: Use SmarterASP's free Let's Encrypt HTTPS certificate, expiring 2027-02-04. Check renewal in late January 2027. The API serves /.well-known before HTTPS redirection for ACME validation and renewal.
- 2026-11-06: Disable hosting-level Basic authentication on the SmarterASP site; it had blocked all requests with HTTP 401. API admin authentication remains enabled.
- 2026-11-06: Canonical frontend URL is https://www.kultvibe.com; kultvibe.com redirects to www. Production CORS allows https://kultvibe.com, https://www.kultvibe.com, and https://kultvibe.vercel.app.
- 2026-11-06: SmarterASP server IP 208.98.35.144 is authorised in Brevo. Live confirmation-email delivery was verified in a real inbox; the stored confirmation flag still records provider acceptance rather than a delivery receipt.
- 2026-11-06: Record HEAD /api/health returning 405 as a known low-priority issue; GET /api/health returns 200.
- 2026-11-06: OPEN decision remains six verticals versus two pillars (gaming and creators, with streaming as a bridge), pending discussion with David. Preserve existing enum values while pending.
