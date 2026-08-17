# CLAUDE.md — commercialcleaningservicessaintpaul.com

## What this project is
A static 43-page local-SEO microsite for a commercial cleaning company serving Saint Paul, MN and 8 surrounding towns. Plain HTML/CSS + one Vercel serverless function. No framework, no build step, no package.json.

## Structure
- Every page is `<dir>/index.html` for clean `/path/` URLs (e.g. `/service-areas/roseville/`)
- `styles.css` — single shared stylesheet (Theme A: deep navy `#0d2b45`, burnt orange `#e85c2a`)
- `forms.js` — shared client script: captures UTM params site-wide, drives the 3 lead forms
- `api/lead.js` — Vercel serverless function proxying form submissions to the CRM-QM API
- `sitemap.xml` / `robots.txt` — 43 indexed URLs; `/thank-you/` is intentionally excluded (`noindex`)
- `QA.md` — the original build's QA checklist (content facts, town verification, theme spec). Treat as source of truth for what content decisions were already made and why.
- `HANDSOFF.md` — most recent handoff notes; read this first when picking up work.

## Working conventions
- **Every page shares identical header/nav/footer markup.** If you change one, use the shared pattern (grep for the block, `sed`/multi-file edit) rather than hand-editing 43 files inconsistently.
- **No secrets in the repo, ever.** The CRM bearer token lives only in Vercel's environment variables as `CRM_API_TOKEN`, read via `process.env` in `api/lead.js`. Never hardcode it, never commit a `.env` file with a real value.
- **No testing infrastructure by design** — this is a static marketing site, deployed straight to Vercel from `origin/main`. Don't add a test framework or CI pipeline unless explicitly asked.
- **No CLI-based Vercel verification** — the repo is already linked to Vercel; pushing to `main` triggers the deploy. Don't attempt `vercel` CLI commands.
- Content facts (town distances, market pricing ranges, insurance language) were deliberately researched/verified per `QA.md` — don't invent new stats, testimonials, reviews, or dollar figures. If something looks like a placeholder, check `QA.md` first; it may be an intentional non-disclosure (e.g. no invented policy numbers).
- Phone number `(866) 958-8773` and email `ops@thequotemasters.com` are shared across the portfolio — don't change them without explicit instruction.

## CRM integration (api/lead.js)
- Endpoint: `https://thequotemasters.com/crm_api/api.php?action=push_lead`
- Auth: `Bearer` token from `process.env.CRM_API_TOKEN`
- The CRM's `PushLead` schema has fixed fields (`customer`, `industry`, `questions`, `appointments`, etc.) that don't map 1:1 to this site's form fields (sqft, facility type, frequency). Those extra fields are folded into `customer.notes` as labeled lines — see `api/lead.js` for the exact mapping.
- `industry` is hardcoded to `23` (commercial cleaning) per the CRM-QM API doc.
- Forms submit via `fetch` (not native form POST) so errors can be shown inline and a UTM-tagged `utm_source` can be attached from `localStorage`.

## UTM tracking
- `forms.js` captures `utm_source/medium/campaign/term/content` from the query string on any page load, stores them in `localStorage` under `scc_utm`.
- Only `utm_source` is currently forwarded to the CRM (that's the only UTM field the `PushLead` schema accepts).
