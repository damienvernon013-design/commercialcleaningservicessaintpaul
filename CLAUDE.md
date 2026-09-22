# CLAUDE.md — commercialcleaningservicessaintpaul.com

## What this project is
A static local-SEO microsite (68 pages: 43 original + 25 blog posts) for a commercial cleaning company serving Saint Paul, MN and 8 surrounding towns. Plain HTML/CSS + one Vercel serverless function. No framework, no build step, no package.json.

## Structure
- Every page is `<dir>/index.html` for clean `/path/` URLs (e.g. `/service-areas/roseville/`)
- `styles.css` — single shared stylesheet (Theme A: deep navy `#0d2b45`, burnt orange `#e85c2a`)
- `forms.js` — shared client script: captures UTM params site-wide, drives the 3 lead forms
- `api/lead.js` — Vercel serverless function proxying form submissions to the CRM-QM API
- `blog/` — 25 static blog posts + `/blog/index.html` hub, same template as `/resources/*` (see Blog section below)
- `sitemap.xml` / `robots.txt` — 69 indexed URLs; `/thank-you/` is intentionally excluded (`noindex`)
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

## Blog (`blog/`)
- **Fully static, matches `/resources/*` exactly** — same header/nav/footer, `LocalBusiness`-only JSON-LD (no `Article`/`BlogPosting` schema, no byline/date), `breadcrumb` → `page-hero` → `content-wrap` (`article-body` + sidebar CTA cards) structure. Do not introduce a different template for new posts — copy an existing `blog/<slug>/index.html` as the starting point.
- 25 posts rewritten from a source pack originally written for a different brand ("Quote Masters"/thequotemasters.com) — all brand refs converted to this site's name/phone, all CTAs point to `/request-a-quote/`.
- Each post links to one relevant `/services/*/` page and 1-2 related `/resources/*/` or `/blog/*/` posts (sidebar "Related Reading" + "Related Service" cards).
- Pricing figures reused verbatim from `/resources/commercial-cleaning-cost/` (the QA.md-sanctioned $0.08–$0.18/sq ft range) — don't introduce new dollar figures without checking QA.md first.
- Three posts (shared-equipment, shared-community-space, high-traffic-facility considerations) were deliberately reframed from vertical-specific source content (gyms, schools/daycares, restaurants) into general guidance, since this site's quote form only covers office, medical/dental, retail, light industrial/warehouse, and multi-tenant commercial — don't claim those verticals as serviced facility types.
- No named third-party study citations (e.g. "a Princeton study found...", specific institution stats) — softened to general claims during the rewrite per QA.md's no-fabrication policy. Keep this convention for any new posts.
- **Superseded approach, since removed:** an earlier pass built a Supabase-backed `/api/blog.js` dynamic route (DB-driven rendering). That was scrapped in favor of the static approach above to stay consistent with the rest of the site — `api/blog.js`, `api/_layout.js`, `supabase/`, and `package.json` (the only reason for the `@supabase/supabase-js` dependency) were all deleted. If you see any of these referenced in old context, they no longer exist.
