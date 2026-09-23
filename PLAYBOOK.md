# Playbook — Replicating This Site's Blog + Quote Wizard for Other Portfolio Sites

This document is the step-by-step procedure for taking what was built on
`commercialcleaningservicessaintpaul.com` — the 25-post blog and the
CRM-integrated quote wizard — and rebuilding it correctly on any of the
other ~59 sites in the portfolio, each targeting a different domain, city,
and ZIP.

It is written to be followed literally, in order, by a human or by a future
Claude session with no other context. Every step names the exact file to
touch and what in it must change vs. stay fixed.

**This file describes a pattern, not a script.** There is no automation
that runs across all 60 sites at once — each site is its own repo/Vercel
project, hand-built to this recipe. Treat each site as a full run through
Phase 0–5 below.

---

## Phase 0 — Confirm the target site's facts before writing anything

Do not start building copy until these are pinned down, the same way
`QA.md` pinned them down for Saint Paul:

1. **Domain** — the live domain this site will deploy to (e.g.
   `commercialcleaning<city>.com`).
2. **City + service radius** — the target city and its surrounding-town
   radius (Saint Paul used 25 miles from 44.9537°N, 93.0900°W). Verify
   each surrounding town's actual distance from the city center — don't
   guess. This becomes the site's `/service-areas/` town list.
3. **ZIP code** — the target city's primary ZIP. This becomes
   `ZIP_DEFAULT` in the quote wizard's server function (see Phase 3).
4. **Phone + email** — confirm whether this site uses the **same shared
   portfolio phone/email** (`(866) 958-8773` / `ops@thequotemasters.com`
   on this site) or a **per-domain tracking number**. QA.md flagged this
   as an open decision on this site (it shipped with the shared number).
   Check with whoever owns call attribution before assuming either way.
5. **Brand name** — the customer-facing business name for this domain
   (here: "Saint Paul Commercial Cleaning Services"). Never reuse
   "Quote Masters" — that's the backend CRM/portfolio parent brand, not
   customer-facing.
6. **Facility types this site actually quotes** — the dropdown/industry
   scope for the market (here: office, medical/dental, retail, light
   industrial/warehouse, multi-tenant commercial). This determines which
   blog posts need reframing (see Phase 2, step 4).
7. **Pricing ranges** — do not invent new dollar figures. Either the
   client supplies real local market rates for this city, or the site
   ships with plain-prose pricing language only (no fabricated numbers).
   This site's numbers ($0.08–$0.18/sq ft/month etc.) are Saint Paul
   metro specific — they are not a template to copy into another city's
   pricing page without re-verification.
8. **Zero cross-portfolio links** — confirmed on this site by grep (no
   `https://` links to any other portfolio domain anywhere). Re-verify
   this on every new site before launch.

---

## Phase 1 — Base site (if not already built)

This playbook assumes the 43-page static base site (home, core pages,
services, service-areas, resources) already exists for the target domain,
built to the same "no framework, no build step, no package.json" pattern
as this repo's `CLAUDE.md` describes. If it doesn't exist yet, build that
first using this repo as the structural reference — same file layout
(`<dir>/index.html` per page), same shared header/nav/footer markup
pattern, same `styles.css` token structure (swap `--primary`/`--accent`
colors if the new site uses a different theme).

Do not proceed to Phase 2 until the base 43 pages exist and match this
site's QA.md-style verification (phone/email present sitewide, no invented
stats, no cross-portfolio links, town radius verified).

---

## Phase 2 — Blog section (25 posts)

Reference implementation: `blog/` in this repo (25 posts + `blog/index.html`
hub), built from a source content pack originally written for
`thequotemasters.com`.

### Step 2.1 — Get source content
The 25-post source pack is generic commercial-cleaning content (pricing,
contracts, hiring guides, industry-specific posts, trends) not yet tied to
any specific city. If a fresh copy of that source pack doesn't already
exist for reuse, ask for it — it's the input, not something to regenerate
per site.

### Step 2.2 — Rewrite each post for the new domain
For every post, apply the same rewrite rules used here:
- Replace all brand references with the target site's brand name / phone /
  email (see Phase 0, steps 4–5).
- Reframe generic content with the target city's specifics **only where it
  fits naturally** — don't force a city mention into every paragraph.
  Pricing/hiring/contract posts usually don't need it; a couple of
  operational posts can reference local conditions (weather, building
  stock, commercial corridors) the way this site's cost guide references
  Saint Paul neighborhoods — only if you actually have verified local
  facts for that city (Phase 0, step 2).
- Reuse only pricing figures the client has verified for that city (Phase
  0, step 7). Never carry Saint Paul's numbers into another city's copy.
- End every post with the site's real CTA: `<a href="/request-a-quote/"
  class="btn">Request a Written Quote</a>` plus a sidebar "Get Your Quote"
  card — see any file in `blog/*/index.html` here for the exact markup.
- Internal-link each post to one relevant `/services/*/` page and 1-2
  related `/resources/*/` or `/blog/*/` posts.

### Step 2.3 — Reframe off-scope industry posts
Three posts in the source pack are vertical-specific (restaurants, gyms,
schools/daycares). On this site, none of those facility types are in the
quote form's scope (Phase 0, step 6), so they were rewritten as *general*
facility-hygiene guidance rather than "we clean your restaurant/gym/school"
service claims — see `blog/high-traffic-facility-cleaning-considerations/`,
`blog/cleaning-considerations-for-shared-equipment-facilities/`, and
`blog/cleaning-considerations-for-shared-community-spaces/` for the exact
reframing pattern. **Check the target site's own facility-type scope before
deciding** — if a different city's site does quote restaurants/gyms/schools,
these posts can stay written as direct service claims for that site instead.

### Step 2.4 — Soften unverifiable citations
The source pack cites specific named studies/institutions (a Princeton
study, American Cleaning Institute "88%", FitRated "362x bacteria",
specific OSHA CFR section numbers, a National Restaurant Association
dollar figure). These were softened to general, unattributed claims on
this site (e.g. "research links workplace cleanliness to productivity")
since they can't be verified from inside a build session and this
portfolio's QA process has a strict no-fabrication policy. Apply the same
softening on every other site — don't ship a named-study citation unless
someone has actually verified it against the source.

### Step 2.5 — Build the static pages
**Template contract (must match exactly on every site):**
- Fully static HTML, one `blog/<slug>/index.html` per post — no database,
  no serverless rendering route. This matches the rest of the static site.
- Identical header/nav/footer markup to every other page on that site.
- JSON-LD: `LocalBusiness` only. **Do not add `Article`/`BlogPosting`
  schema, author bylines, or publish dates** — this site's other content
  pages (`/resources/*`) carry none of that, and mixing schema richness
  across page types looks inconsistent to search engines and to any human
  auditing the site later.
- Structure: `breadcrumb` → `page-hero` (h1 + one-line subhead) →
  `content-wrap` with `article-body` (h2-delimited sections, `.data-table`
  for pricing tables) + `aside` (sidebar "Get Your Quote" CTA card +
  sidebar "Related Reading" card).
- Plus a `blog/index.html` hub page listing all 25 posts, same
  `services-grid` card pattern used elsewhere on the site for section hubs.

For the actual page generation, a Python script pattern was used here
(not committed to the repo — it's scaffolding, not shipped code):
`gen_layout.py` defines the shared header/nav/footer/JSON-LD as string
templates, `posts_data.py` holds the 25 rewritten posts as structured data
(slug, title, meta description, body HTML, related links, service link),
and `generate.py` renders both the 25 post files and the hub page from
those two inputs. Rebuilding this generator per site (with that site's
layout template and rewritten post data swapped in) is faster and far less
error-prone than hand-writing 26 HTML files — strongly recommended over
manual authoring, since it guarantees byte-identical header/nav/footer/
JSON-LD across every post the way manual copy-paste won't.

### Step 2.6 — Wire it into the site
- Add a `Blog` link to the shared nav across **every** page on the site
  (on this site: 44 pages, inserted between `FAQ` and `Get a Quote`).
- Add all 25 post URLs + the `/blog/` hub URL to `sitemap.xml`
  (`changefreq weekly` for posts, matching this site's convention).

### Step 2.7 — Verify before calling it done
- `grep -rn "old-brand-name\|old-domain.com"` across `blog/` — must be
  zero matches (except any intentionally shared portfolio email address).
- Confirm every internal link (`/services/*/`, `/resources/*/`,
  `/blog/*/`) in every post resolves to a real file on that site.
- Confirm every dollar figure used traces back to a client-verified source
  for that city, not copied from another site's pricing page.
- Validate `sitemap.xml` is well-formed XML and the URL count matches the
  number of files actually created.

---

## Phase 3 — CRM-integrated quote wizard

Reference implementation: `assets/js/quote-wizard.js` +
`api/submit-lead.js` in this repo.

### Step 3.1 — Understand what's fixed vs. per-site
The wizard's question set, answer IDs, appointment time slots, and the
40+ item `INDUSTRIES` list all come from the **CRM's own fixed
questionnaire schema** (`get_lead_faq`), not from this site. They do not
change per domain — copy `quote-wizard.js` byte-for-byte except for the
values below.

**Per-site values that MUST change** in `api/submit-lead.js`:

| Constant | This site's value | What to set on a new site |
|---|---|---|
| `ZIP_DEFAULT` | `'55101'` | The target city's ZIP (Phase 0, step 3) |
| `ADDRESS_DEFAULT` | `'Saint Paul, MN'` | `'<City>, <State abbr>'` |
| `SITE_SOURCE_TAG` | `'Site: commercialcleaningservicessaintpaul.com'` | `'Site: <new-domain>'` — see Step 3.3, this is not optional |
| CORS origin (`res.setHeader('Access-Control-Allow-Origin', ...)`) | `'https://commercialcleaningservicessaintpaul.com'` | `'https://<new-domain>'` |

Everything else in `api/submit-lead.js` — validation logic, appointment
date/weekday rules, the CRM payload shape, error handling — is identical
across every site and should be copied unchanged.

### Step 3.2 — CRM endpoint and auth
- Endpoint (`CRM_ENDPOINT` in `api/submit-lead.js`) is the same
  `https://thequotemasters.com/crm_api/api.php?action=push_lead` for every
  site in the portfolio — do not change it.
- `CRM_API_TOKEN` is read from `process.env.CRM_API_TOKEN` — **never
  hardcoded**. Set it in that site's own Vercel project environment
  variables (Settings → Environment Variables), Production (and Preview
  if testing on preview deploys is wanted).

### Step 3.3 — Why `SITE_SOURCE_TAG` is mandatory, not optional
**`CRM_API_TOKEN` is the same token shared across all ~60 sites in this
portfolio** (confirmed directly by the client). The CRM's `PushLead`
schema has no dedicated site-id/domain field. Without an explicit tag,
every lead from every one of the 60 sites is indistinguishable in the CRM
— there is no way to trace a lead back to the domain it came from.

`api/submit-lead.js` solves this by prepending `SITE_SOURCE_TAG` into
`customer.notes` on every submission (`"Site: <domain>" | <visitor's own
notes>`). **On every new site, this constant must be updated to that
site's actual domain before launch.** Copying `api/submit-lead.js` to a
new site without changing `SITE_SOURCE_TAG` will silently misattribute
that site's leads as belonging to whichever site the constant still
names — a leftover Saint Paul tag on a different city's site would be a
real, hard-to-notice bug once dozens of these sites are live.

### Step 3.4 — Wire the wizard into the site's pages
- `/request-a-quote/` gets the full wizard: replace the page's existing
  simple form with a `<form data-quote-wizard novalidate>` containing the
  exact scaffold elements the script queries for —
  `[data-wizard-progress]`, `[data-wizard-steps]`, `[data-wizard-status]`,
  `[data-wizard-nav]` with `[data-wizard-back]` and `[data-wizard-next]`
  buttons inside it. Copy the markup block from this site's
  `request-a-quote/index.html` verbatim; only the surrounding page copy
  (hero text, "what to expect" steps) is site-specific.
- Load the script only on that page:
  `<script src="/assets/js/quote-wizard.js" defer></script>`.
- **Home hero and `/contact/` do NOT get the full wizard** — the
  multi-step UI doesn't fit their narrow sidebar-card layout. Instead they
  keep short teaser forms (`[data-lead-teaser]`, name + phone + sqft
  fields only) that GET-submit natively to `/request-a-quote/`
  (`action="/request-a-quote/" method="get"`, no JS needed). The wizard's
  own `prefillFromQuery()` function already reads `?name=&phone=&sqft=`
  from the URL and prefills step 1 automatically — this handoff pattern
  is intentional, don't rebuild it differently per site.

### Step 3.5 — Retire the old lead-capture flow
If the target site currently has the older single-step
`data-lead-form`/`api/lead.js` pattern (name/phone/email → `fetch` →
`notes`-folded CRM payload), retire it the same way this site did:
- Delete the old `api/lead.js`-equivalent function.
- Trim that site's `forms.js`-equivalent down to **only** UTM capture
  (`captureUtm()` into `localStorage`) — remove the `data-lead-form` submit
  handler entirely, since nothing will have that attribute anymore.
- Grep the whole site for `data-lead-form` and the old API path after the
  swap — both should return zero matches.

### Step 3.6 — CSS
Append the wizard-specific CSS block from this site's `styles.css` (the
`/* Quote wizard */` section at the end of the file) to the target site's
stylesheet, adjusting only `--primary`/`--accent` color token references
if that site uses a different palette. The class names
(`.wiz-progress`, `.wiz-fieldset`, `.wiz-option`, `.wiz-slot`,
`.wiz-review-*`, `.wiz-nav`, `.wiz-done`) are structural, not
site-specific — copy the block as-is otherwise.

### Step 3.7 — Verify before calling it done
- `node --check` on both the copied `quote-wizard.js` and
  `submit-lead.js` — catches syntax errors before deploy.
- Serve the site locally (`python3 -m http.server`) and confirm
  `/request-a-quote/` returns the wizard markup with all six
  `data-wizard-*` hooks present (`curl` + `grep` is enough for a sanity
  check without a browser).
- Grep for the **old** domain — confirm `SITE_SOURCE_TAG` and the CORS
  origin both say the **new** site's domain, not a leftover from whichever
  site's files were copied as the starting point.
- **Click through the wizard in a real browser on a preview deploy before
  it goes live.** This step was skipped in the original build here for
  lack of a browser tool in that session — don't skip it on a new site
  without at least one real person testing the full flow end to end,
  including a real appointment date/time and a real CRM submission.

---

## Phase 4 — Secrets and environment

- `CRM_API_TOKEN` goes in that site's own Vercel project's environment
  variables. Never hardcode it, never commit it, never put a real value in
  a file that isn't gitignored.
- Every new site's repo needs its own `.gitignore` with at minimum
  `.env`, `.env.local`, `.env*.local` — verify this exists before the
  first commit; it did not exist on this site until this build pass added
  it.
- If a `.env.local.example` (or similar) file is used to hand off a real
  token value during setup, move the real value into a gitignored
  `.env.local` immediately and reset the `.example` file back to a blank
  placeholder before anything gets staged — a real secret sitting in a
  committable filename is a mistake that happened once in this build and
  should not repeat.

---

## Phase 5 — Push and deploy

- Each site is its own Vercel project auto-deploying from its own GitHub
  repo's `main` branch — pushing to `main` is the deploy trigger, same as
  this site. No `vercel` CLI verification needed or expected.
- Confirm the git remote and authenticated GitHub account actually have
  write access to that specific site's repo before pushing — this
  portfolio uses per-site (or per-owner) GitHub accounts, and a push can
  fail with a 403 if the wrong account is active locally (`gh auth
  status`, `gh auth switch --user <owner>`, `gh auth setup-git`).
- Update that site's own `CLAUDE.md` and `HANDOFF`/`HANDSOFF.md`
  equivalents to reflect what was actually built, the same way this
  site's were updated after the blog and wizard passes — future sessions
  (or people) picking up that site need the same context this playbook
  assumes for Saint Paul.

---

## Quick per-site checklist

Copy this into a fresh checklist per new site:

- [ ] Phase 0 facts confirmed (domain, city, radius, ZIP, phone/email,
      brand name, facility-type scope, pricing source, cross-portfolio
      link check)
- [ ] Base 43-ish page static site exists and matches QA-style
      verification
- [ ] 25 blog posts rewritten for this domain's brand/facts
- [ ] Off-scope industry posts reframed per this site's actual facility
      scope
- [ ] Unverifiable study citations softened
- [ ] `blog/<slug>/index.html` × 25 + `blog/index.html` hub built, matching
      the static template exactly (`LocalBusiness`-only JSON-LD, no
      byline/date)
- [ ] Nav "Blog" link added sitewide; `sitemap.xml` updated
- [ ] `api/submit-lead.js` copied with `ZIP_DEFAULT`, `ADDRESS_DEFAULT`,
      `SITE_SOURCE_TAG`, and CORS origin all updated to this site
- [ ] `assets/js/quote-wizard.js` copied unchanged
- [ ] `/request-a-quote/` wired with the wizard markup scaffold
- [ ] Home + `/contact/` converted to teaser forms linking to
      `/request-a-quote/`
- [ ] Old `api/lead.js`-equivalent and `data-lead-form` handler removed
- [ ] Wizard CSS appended to this site's stylesheet
- [ ] `CRM_API_TOKEN` set in this site's Vercel env vars (not committed)
- [ ] `.gitignore` covers env files
- [ ] `node --check` passes on both new JS files
- [ ] Wizard clicked through in a real browser on a preview deploy,
      including one real test submission reaching the CRM
- [ ] That site's own `CLAUDE.md`/`HANDSOFF.md` updated
- [ ] Pushed from an account with actual write access to that site's repo
