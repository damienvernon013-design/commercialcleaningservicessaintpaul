# Handoff — commercialcleaningservicessaintpaul.com

**Status: READY TO LAUNCH**

## What this is
Static 68-page commercial cleaning microsite (Saint Paul, MN) plus a Vercel serverless function that pushes quote/contact form submissions into the CRM-QM system. No build step, no framework — plain HTML/CSS/JS deployed as-is.

## Latest pass: blog section added, DB approach scrapped
Added a `/blog/` section: 25 static posts + a `/blog/index.html` hub, built from a source content pack originally written for a different brand and rewritten for this site (brand name/phone, CTAs to `/request-a-quote/`, pricing figures matched to the already-sanctioned QA.md ranges, no fabricated study citations, off-scope verticals like gyms/restaurants/schools reframed as general guidance since this site's quote form doesn't cover those facility types).

An earlier attempt in this same effort built a Supabase-backed dynamic blog route (`api/blog.js`, `api/_layout.js`, a `posts` table, `package.json` for `@supabase/supabase-js`). That was scrapped in favor of static HTML matching the existing `/resources/*` template, to keep the site's zero-dependency architecture intact. All of that DB-driven code, the `vercel.json` rewrites that pointed to it, and local `.env.local*` files have been deleted. **The `posts` table still exists in Supabase** (nothing in the repo references it anymore) — drop it manually via the Supabase SQL editor if you want it gone; it wasn't touched since this repo has no way to run DDL against it.

New files: `blog/index.html` + `blog/<slug>/index.html` × 25. Updated: `sitemap.xml` (+25 URLs, 69 total), `CLAUDE.md` (Blog section + page count).

## What was done in an earlier pass (CRM integration)
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

Without this, `/api/lead` returns a 500 with "Server is not configured to accept leads yet" — forms will show an error but won't crash the site.

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
