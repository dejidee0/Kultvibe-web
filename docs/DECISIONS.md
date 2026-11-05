# KultVibe decisions

- 2026-11-05: Use SmarterASP instead of Railway for backend hosting. The frontend deployment target remains Vercel.
- 2026-11-05: Use a single hosted environment on the free tier; do not provision a separate hosted staging environment.
- 2026-11-05: Limit public waitlist signup per client IP to 10 requests per hour, with no queue and a JSON ApiResponse for HTTP 429.
- 2026-11-05: The Brevo sender domain is authenticated. Prior delivery was confirmed by the recipient. ConfirmationEmailSent records successful provider acceptance, rather than a delivery receipt.
- 2026-11-05: Enable production Swagger through Swagger:Enabled. The tracked default is false; the ignored production configuration enables it.
- 2026-11-05: Admin endpoints use Basic auth in Phase 1, replaced by JWT in Phase 2. Credentials stay outside tracked files and reports.
- 2026-11-05: OPEN item: "Verticals: 6 vs 2 pillars (gaming + creators, streaming as bridge) - pending decision with David. Do not remove existing Vertical enum values once real signups exist."
- 2026-11-05: Backend deployment status is pending. No backend deployment has been completed at this checkpoint. Backend Web Deploy is authorized only after hygiene, publication, and readiness gates pass; frontend deployment is not authorized in this run.
