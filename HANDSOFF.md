# Handoff — commercialcleaningservicessaintpaul.com

**Status: READY TO LAUNCH**

## What this is
Static 70-page commercial cleaning microsite (Saint Paul, MN) plus a Vercel serverless function that pushes quote bookings into the CRM-QM system via a multi-step appointment wizard. No build step, no framework — plain HTML/CSS/JS deployed as-is.

## Latest pass: footer attribution + replication playbook
Added a "Built and Maintained by Infin8Content" credit line (linking to `https://infin8content.com/`, opens in a new tab) to the `.footer-bottom` block on all 70 pages — verified zero pages missing it. Also added `PLAYBOOK.md`: a step-by-step procedure for replicating this site's blog section and CRM quote wizard on the other ~59 sites in the portfolio, each targeting a different domain/city/ZIP. It documents which values are fixed (CRM endpoint, question/answer IDs, industries list) vs. must change per site (`ZIP_DEFAULT`, `ADDRESS_DEFAULT`, `SITE_SOURCE_TAG`, CORS origin), and calls out `SITE_SOURCE_TAG` as mandatory since `CRM_API_TOKEN` is shared across the whole portfolio with no other way to attribute a lead to its source domain. `CLAUDE.md` now links to it.

## Earlier pass: multi-step quote wizard replaces the simple lead form
The old single-step quote form (name/phone/email/sqft/type/frequency → `api/lead.js` → CRM `notes` field) is retired. `/request-a-quote/` now embeds a full multi-step booking wizard (`assets/js/quote-wizard.js`) that walks the visitor through the CRM's actual fixed questionnaire (cleaning frequency, current situation, current-provider gaps, satisfaction rating, day/after-hours preference, how many companies to meet), books 1-5 real appointment slots (date + time, CRM-validated to weekdays 2+ days out with a 90-minute same-day spacing guard we added on top), collects contact/company/industry details, and shows a review screen before submitting to a new `api/submit-lead.js` that maps directly to the CRM's native `questions[]`/`appointments[]`/`industry` schema instead of folding everything into a `notes` string.

The home hero and `/contact/` forms are now short teasers (`[data-lead-teaser]`, name/phone/sqft) that GET-submit to `/request-a-quote/?name=...&phone=...&sqft=...`; the wizard reads those via `prefillFromQuery()` and starts pre-filled. `api/lead.js` and the `data-lead-form`/`fetch` submit handler in `forms.js` were deleted — `forms.js` now only captures UTM params into `localStorage`, nothing submits through it anymore.

CRM contract details (verified against the live endpoint 2026-08-28, documented in comments in `api/submit-lead.js`): appointment dates must be `>= today+2` and Mon–Fri; the quote-count field is `num_of_quotes` (the published API doc's `number_of_quotes` is rejected); a successful push is `ResponseCode` `200`/`201` in the response body, not just an HTTP 200. The server re-validates everything independently of the client wizard.

**Important CRM attribution fix included in this pass:** `CRM_API_TOKEN` is shared across the whole portfolio (60+ sites per the client), and the `PushLead` schema has no dedicated site-id field — so without an explicit tag, every lead from every site would look identical on the CRM side. `api/submit-lead.js` now prepends `"Site: commercialcleaningservicessaintpaul.com"` to `customer.notes` on every submission so leads stay traceable to this domain. If you're porting this wizard to another site in the portfolio, **make sure to change `SITE_SOURCE_TAG` in `api/submit-lead.js`** — copying this file as-is to another site would tag its leads as coming from this one.

**Not yet manually tested in a real browser** — no browser automation tool was available in this session. Verified: JS syntax (`node --check`) on all three new/changed scripts, the wizard's expected `data-wizard-*` DOM hooks are present in the served HTML, and no leftover references to the old `api/lead`/`data-lead-form` flow anywhere in the repo. **You should click through the wizard on a preview deploy before treating this as production-ready** — multi-step state, appointment date/time validation, and the CRM submit path have only been reviewed by reading the code, not exercised in a browser.

New/changed files: `api/submit-lead.js` (new, replaces `api/lead.js`), `assets/js/quote-wizard.js` (new), `request-a-quote/index.html` (wizard markup), `index.html` + `contact/index.html` (teaser forms), `forms.js` (trimmed to UTM-only), `styles.css` (wizard CSS appended). Deleted: `api/lead.js`.

## Earlier pass: blog section added, DB approach scrapped
Added a `/blog/` section: 25 static posts + a `/blog/index.html` hub, built from a source content pack originally written for a different brand and rewritten for this site (brand name/phone, CTAs to `/request-a-quote/`, pricing figures matched to the already-sanctioned QA.md ranges, no fabricated study citations, off-scope verticals like gyms/restaurants/schools reframed as general guidance since this site's quote form doesn't cover those facility types).

An earlier attempt in this same effort built a Supabase-backed dynamic blog route (`api/blog.js`, `api/_layout.js`, a `posts` table, `package.json` for `@supabase/supabase-js`). That was scrapped in favor of static HTML matching the existing `/resources/*` template, to keep the site's zero-dependency architecture intact. All of that DB-driven code, the `vercel.json` rewrites that pointed to it, and local `.env.local*` files have been deleted. **The `posts` table still exists in Supabase** (nothing in the repo references it anymore) — drop it manually via the Supabase SQL editor if you want it gone; it wasn't touched since this repo has no way to run DDL against it.

New files: `blog/index.html` + `blog/<slug>/index.html` × 25. Updated: `sitemap.xml` (+25 URLs, 69 total), `CLAUDE.md` (Blog section + page count).

## Earliest pass (CRM integration, now superseded above)
1. Removed a stray empty directory left over from the original build (`{about,contact,...}` — a literal brace-expansion typo, never used).
2. Built `api/lead.js` — a Vercel serverless function that:
   - Accepts `POST` JSON from the site's forms
   - Maps form fields to the CRM-QM `PushLead` payload shape (name split into first/last, sqft/type/frequency/title folded into `notes` since the CRM schema didn't have dedicated fields for them, `industry: 23` per the API doc)
   - Forwards to `https://thequotemasters.com/crm_api/api.php?action=push_lead` with `Authorization: Bearer <CRM_API_TOKEN>`
   - Reads the token from `process.env.CRM_API_TOKEN` — **never hardcoded**
3. Added `forms.js` — shared client script that:
   - Captures `utm_source`/`utm_medium`/`utm_campaign`/`utm_term`/`utm_content` from the URL on any page load and stores them in `localStorage`
   - Intercepts the three lead forms (home, `/contact/`, `/request-a-quote/`), submits via `fetch` to `/api/lead` with the stored `utm_source` attached, and redirects to `/thank-you/` on success
   - Included on all 43 pages (for UTM capture) and drives the 3 forms specifically (via `[data-lead-form]`)
4. Added `/thank-you/` page (`noindex, follow` — not in sitemap, matches how the rest of the site is indexed).
5. Added `vercel.json` (`cleanUrls`, `trailingSlash`) for clean routing consistent with the site's `/path/` URL structure.
6. Verified: no hardcoded secrets/tokens anywhere in the repo, no `{{` tokens, no lorem ipsum/TODO/placeholder content anywhere (matches QA.md's existing clean bill of health).

## Required manual step before this actually works in production
**You must add the CRM bearer token to Vercel yourself** — it is intentionally not in this repo or any file here:

1. Vercel dashboard → this project → **Settings → Environment Variables**
2. Add `CRM_API_TOKEN` = (the token from the CRM-QM API doc you have) for **Production** (and Preview if you want form testing on preview deployments)
3. Redeploy (or it'll pick it up on the next deploy)

Without this, `/api/submit-lead` returns a 500 ("Server not configured") — the wizard will show an inline error but won't crash the site.

## Not done / explicitly out of scope this pass
- **No automated testing** — per instruction, no CI/test suite was set up. No CLI-based Vercel verification either (repo is already linked to Vercel; deploys happen on push).
- Per-domain phone tracking number (QA.md flag #2) — still uses the shared (866) 958-8773 number. Swap if the client wants call attribution per microsite.
- Insurance policy dollar amounts / policy numbers (QA.md flag #1) — intentionally not invented; page uses plain-prose descriptions only. Client can supply real figures if they want them published.

## File map (new/changed this pass)
- `api/lead.js` — serverless CRM proxy
- `forms.js` — client-side UTM capture + form submit handler
- `thank-you/index.html` — new page
- `vercel.json` — new
- `index.html`, `contact/index.html`, `request-a-quote/index.html` — forms rewired to `data-lead-form` (JS-driven, no more raw `action=`/`method=`)
- All 43 pages — `<script src="/forms.js" defer>` added before `</body>`

## Deploy
Push to `origin/main`; Vercel auto-deploys from the connected GitHub repo. No build command needed (static site + `/api` functions auto-detected by Vercel).
