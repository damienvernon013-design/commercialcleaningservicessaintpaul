# CLAUDE.md — commercialcleaningservicessaintpaul.com

## What this project is
A static local-SEO microsite (68 pages: 43 original + 25 blog posts) for a commercial cleaning company serving Saint Paul, MN and 8 surrounding towns. Plain HTML/CSS + one Vercel serverless function. No framework, no build step, no package.json.

## Structure
- Every page is `<dir>/index.html` for clean `/path/` URLs (e.g. `/service-areas/roseville/`)
- `styles.css` — single shared stylesheet (Theme A: deep navy `#0d2b45`, burnt orange `#e85c2a`)
- `forms.js` — shared client script: captures UTM params site-wide into `localStorage` (`scc_utm`). No longer drives any form submit — see Quote wizard below.
- `assets/js/quote-wizard.js` — multi-step appointment-booking wizard driving `/request-a-quote/`
- `api/submit-lead.js` — Vercel serverless function proxying wizard bookings to the CRM-QM API
- `blog/` — 25 static blog posts + `/blog/index.html` hub, same template as `/resources/*` (see Blog section below)
- `sitemap.xml` / `robots.txt` — 69 indexed URLs; `/thank-you/` is intentionally excluded (`noindex`)
- `QA.md` — the original build's QA checklist (content facts, town verification, theme spec). Treat as source of truth for what content decisions were already made and why.
- `HANDSOFF.md` — most recent handoff notes; read this first when picking up work.

## Working conventions
- **Every page shares identical header/nav/footer markup.** If you change one, use the shared pattern (grep for the block, `sed`/multi-file edit) rather than hand-editing 43 files inconsistently.
- **No secrets in the repo, ever.** The CRM bearer token lives only in Vercel's environment variables as `CRM_API_TOKEN`, read via `process.env` in `api/submit-lead.js`. Never hardcode it, never commit a `.env` file with a real value.
- **No testing infrastructure by design** — this is a static marketing site, deployed straight to Vercel from `origin/main`. Don't add a test framework or CI pipeline unless explicitly asked.
- **No CLI-based Vercel verification** — the repo is already linked to Vercel; pushing to `main` triggers the deploy. Don't attempt `vercel` CLI commands.
- Content facts (town distances, market pricing ranges, insurance language) were deliberately researched/verified per `QA.md` — don't invent new stats, testimonials, reviews, or dollar figures. If something looks like a placeholder, check `QA.md` first; it may be an intentional non-disclosure (e.g. no invented policy numbers).
- Phone number `(866) 958-8773` and email `ops@thequotemasters.com` are shared across the portfolio — don't change them without explicit instruction.

## Quote wizard (assets/js/quote-wizard.js + api/submit-lead.js)
- **This is the only lead-capture flow on the site.** `/request-a-quote/` embeds the full multi-step wizard (`[data-quote-wizard]` form). The home hero and `/contact/` keep short teaser forms (`[data-lead-teaser]`, name/phone/sqft) that GET-submit to `/request-a-quote/?name=...&phone=...&sqft=...`, which the wizard reads via `prefillFromQuery()` to prefill step 1. There is no other submission path — don't reintroduce a `data-lead-form`/`fetch`-based simple form; that pattern (`api/lead.js`) was retired in favor of this wizard.
- The wizard asks the CRM's fixed questionnaire (frequency, current situation, current-provider gaps, satisfaction rating, day/after-hours preference, how many companies to meet), then books 1-5 appointment slots (date + time), then collects contact/company details, then shows a review screen before submit.
- `INDUSTRIES` in `quote-wizard.js` is the CRM's full fixed list (40+ generic industries, including several that don't apply to this business, e.g. car dealerships, funeral homes) — kept as-is intentionally since the CRM's numeric industry IDs are fixed and the list isn't filtered per-site. Don't trim it without checking the CRM schema still accepts the removed IDs elsewhere.
- Question/answer IDs in `QUESTIONS`/`QUOTES_QUESTION`/`SCHEDULES` are a **snapshot** of the CRM's `get_lead_faq` questionnaire, not a live source — if the CRM's questionnaire changes, this file needs to be updated by hand.
- Endpoint: `https://thequotemasters.com/crm_api/api.php?action=push_lead`, `Authorization: Bearer` from `process.env.CRM_API_TOKEN`.
- CRM contract specifics verified against the live endpoint 2026-08-28 (see comments in `api/submit-lead.js`): `questions[]` and `appointments[]` must both be non-empty; appointment dates must be `>= today+2` and fall Mon–Fri; the quote-count field is `num_of_quotes` (not `number_of_quotes`); a successful push returns `ResponseCode` `200`/`201`, not HTTP 200 alone — check the response body, not just the HTTP status.
- `api/submit-lead.js` re-validates everything server-side (dates, phone/email format, appointment spacing) rather than trusting the client — treat the client-side wizard validation as UX only.
- **`CRM_API_TOKEN` is shared across the entire portfolio (60+ sites), and the `PushLead` schema has no dedicated site-id field.** `api/submit-lead.js` prepends a `SITE_SOURCE_TAG` constant (`"Site: commercialcleaningservicessaintpaul.com"`) into `customer.notes` on every submission so leads can be traced back to this domain — without it, leads from this wizard would be indistinguishable from any other portfolio site's leads on the CRM side. If this site is ever renamed or the domain changes, update `SITE_SOURCE_TAG` to match.

## UTM tracking
- `forms.js` captures `utm_source/medium/campaign/term/content` from the query string on any page load, stores them in `localStorage` under `scc_utm` (kept for other site-wide UTM uses).
- `quote-wizard.js` has its own separate UTM capture (`sessionStorage`, key `qm_utm_params`) feeding `utmSource` into the CRM payload — these two UTM mechanisms are intentionally independent, don't try to unify them.

## Blog (`blog/`)
- **Fully static, matches `/resources/*` exactly** — same header/nav/footer, `LocalBusiness`-only JSON-LD (no `Article`/`BlogPosting` schema, no byline/date), `breadcrumb` → `page-hero` → `content-wrap` (`article-body` + sidebar CTA cards) structure. Do not introduce a different template for new posts — copy an existing `blog/<slug>/index.html` as the starting point.
- 25 posts rewritten from a source pack originally written for a different brand ("Quote Masters"/thequotemasters.com) — all brand refs converted to this site's name/phone, all CTAs point to `/request-a-quote/`.
- Each post links to one relevant `/services/*/` page and 1-2 related `/resources/*/` or `/blog/*/` posts (sidebar "Related Reading" + "Related Service" cards).
- Pricing figures reused verbatim from `/resources/commercial-cleaning-cost/` (the QA.md-sanctioned $0.08–$0.18/sq ft range) — don't introduce new dollar figures without checking QA.md first.
- Three posts (shared-equipment, shared-community-space, high-traffic-facility considerations) were deliberately reframed from vertical-specific source content (gyms, schools/daycares, restaurants) into general guidance, since this site's quote form only covers office, medical/dental, retail, light industrial/warehouse, and multi-tenant commercial — don't claim those verticals as serviced facility types.
- No named third-party study citations (e.g. "a Princeton study found...", specific institution stats) — softened to general claims during the rewrite per QA.md's no-fabrication policy. Keep this convention for any new posts.
- **Superseded approach, since removed:** an earlier pass built a Supabase-backed `/api/blog.js` dynamic route (DB-driven rendering). That was scrapped in favor of the static approach above to stay consistent with the rest of the site — `api/blog.js`, `api/_layout.js`, `supabase/`, and `package.json` (the only reason for the `@supabase/supabase-js` dependency) were all deleted. If you see any of these referenced in old context, they no longer exist.
