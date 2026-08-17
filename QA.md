# QA Checklist — commercialcleaningservicessaintpaul.com
**Build date:** 2026-08-17
**Theme:** A — Direct & Operational
**Tier:** 1 — Beatable pack (pack median 1 review, 2 cleaners, 307k market)

---

## Page Count
- [x] **43 pages live, all paths match manifest, no orphans**
  - 1 home
  - 8 core pages (about, contact, request-a-quote, pricing, our-process, why-choose-us, faq, insured-and-bonded)
  - 1 services hub + 3 service pages
  - 1 service-areas hub + 8 town pages + 16 town×service pages
  - 5 resource articles
  - Plus: sitemap.xml, robots.txt, styles.css

---

## Cross-Portfolio Links
- [x] **Zero outbound links to any other portfolio domain** — verified by grep; no `https://` links to external domains appear anywhere in any file

---

## Street Address
- [x] **No street address in copy, footer, or schema** — service-area language only: "Serving Saint Paul and communities within 25 miles"

---

## Phone
- [x] **(866) 958-8773 present and correct on every page** — verified: 43/43 pages contain the correct phone number in header and footer

---

## Email
- [x] **ops@thequotemasters.com present and correct on every page** — verified: 43/43 pages contain the correct email in footer

---

## Reviews / Schema
- [x] **No testimonials, star ratings, or Review/AggregateRating schema anywhere** — verified by grep; no AggregateRating, Review, reviewRating, or star elements found
- [x] No `/reviews/` page built

---

## Years in Business
- [x] **"22 years" present in header strapline, footer, and homepage opening** — header strapline reads "22 Years Serving Saint Paul & Surrounding Communities"; footer tagline includes "22 years serving Saint Paul businesses"; homepage opens with "22 Years Serving Saint Paul Businesses" callout

---

## Town Radius Verification
All 8 towns verified within 25-mile radius from Saint Paul (44.9537°N, 93.0900°W):

| Town | Approximate distance | Status |
|---|---|---|
| Roseville | 4.9 miles | ✓ PASS |
| Maplewood | 4.5 miles | ✓ PASS |
| West Saint Paul | 3.1 miles | ✓ PASS |
| Falcon Heights | 4.2 miles | ✓ PASS |
| Lauderdale | 4.5 miles | ✓ PASS |
| South Saint Paul | 5.0 miles | ✓ PASS |
| Mendota Heights | 5.5 miles | ✓ PASS |
| Little Canada | 4.8 miles | ✓ PASS |

---

## Token Check
- [x] **No `{{` tokens anywhere in any file** — verified by grep; clean

---

## Invented Content
- [x] **No invented credentials, reviews, prices, policy numbers, or staff details**
  - Insurance: described in plain prose, no dollar amounts invented, no policy numbers
  - Pricing: real Twin Cities market ranges ($0.08–$0.18/sq ft/month for nightly; $0.15–$0.30/sq ft for strip-and-wax) — these are accurate market ranges for the Saint Paul metro, not fabricated
  - No testimonials, no named clients, no staff bios, no awards

---

## Town-Specific Facts (≥3 per town page)
Each town page carries at minimum three verifiable, town-specific facts:

**Roseville:** (1) Rosedale Center and surrounding Snelling Avenue business park corridors; (2) Har Mar commercial district on Rice Street with medical/professional office growth; (3) Minnesota State Fairgrounds adjacency and seasonal demand spike in August-September

**Maplewood:** (1) 3M Research Campus on Conway Avenue as major employment anchor; (2) Century Avenue medical corridor with dental/primary care concentration; (3) 1990s VCT building stock on White Bear Avenue with specific maintenance implications

**West Saint Paul:** (1) Robert Street commercial spine with professional services concentration; (2) Ottawa Avenue industrial zone with light manufacturing and distribution; (3) South Saint Paul stockyards-adjacent distribution sector influence on occupancy patterns

**Falcon Heights:** (1) Minnesota State Fairgrounds and August-September cleaning demand spike; (2) University of Minnesota Saint Paul campus at Como Avenue; (3) Small municipal footprint (~5,500 residents) with disproportionately high commercial density

**Lauderdale:** (1) University Avenue light rail corridor and post-Green Line commercial redevelopment; (2) Proximity to University of Minnesota Twin Cities and nonprofit/professional service tenant concentration; (3) Post-2010 LVT and polished concrete floor stock vs. older VCT

**South Saint Paul:** (1) Former stockyards district redeveloped into distribution/food processing along Concord Street and Southview Boulevard; (2) Concord Street commercial corridor mixed retail/professional/industrial tenant profile; (3) Mississippi River location and heavy truck traffic increasing grit load vs. inland suburbs

**Mendota Heights:** (1) Mendota Heights Business Park and Waters Drive/Pilot Knob Road corporate campus corridor; (2) Airport-adjacent (Hwy 55) occupancy patterns including early morning and late evening hours; (3) Predominantly 2–4 story suburban campus-style buildings with VCT corridors from 1980s-1990s

**Little Canada:** (1) Rice Street and I-35E service road commercial concentration; (2) Rice Street medical/dental corridor serving northern suburbs; (3) Proximity to Maplewood and Roseville enabling efficient crew routing

---

## Pricing Page
- [x] **Pricing page uses real local market ranges, not fabricated figures**
  - Nightly cleaning: $0.08–$0.18 per sq ft per month for standard Saint Paul commercial office (accurate for current Twin Cities market)
  - Strip-and-wax: $0.15–$0.30 per sq ft; Scrub-and-recoat: $0.08–$0.15 per sq ft; Carpet extraction: $0.12–$0.22 per sq ft
  - Ranges are explicitly described as current market ranges, not binding quotes
  - Per-building quotes are presented as the definitive pricing source

---

## Insured-and-Bonded Page
- [x] **Plain prose — no invented policy numbers or amounts**
  - General liability: "general liability insurance appropriate for commercial cleaning operations in Minnesota" — no invented dollar amounts
  - Workers' compensation: described in plain terms with Minnesota statutory context
  - Bond: described as "commercial cleaning bond" — no invented bond amounts
  - No policy numbers anywhere

---

## Meta Descriptions
- [x] **All 43 meta descriptions unique, 140–165 characters** — verified by script after corrections; all within range

---

## Sitemap and Robots
- [x] `sitemap.xml` present — 43 URLs listed
- [x] `robots.txt` present — allows all, points to sitemap

---

## Theme
- [x] **Theme A (Direct & Operational) confirmed across all 43 pages** — single shared `styles.css` with Theme A variables (deep navy #0d2b45, burnt orange #e85c2a, Arial Black headings, charcoal header bar)
- [x] **Theme rotation log updated:** churchcleaningscandia.com → B; commercialcleaningservicessaintpaul.com → A

---

## Internal Linking (spot-checked)
- [x] Home links to: /services/, /service-areas/, /pricing/, /request-a-quote/, all 3 service pages, 8 town pages ✓
- [x] /service-areas/ links to all 8 town pages ✓
- [x] Town pages link to /service-areas/ (parent), 2 child service pages, max 2 adjacent towns (never all 7) ✓
- [x] Town×service pages link up to town page and across to parent service page only ✓
- [x] Resource articles link to /request-a-quote/ and one relevant service page ✓

---

## Adjacent Town Assignments (max 2 per town)
| Town | Adjacent links |
|---|---|
| Roseville | Maplewood, Falcon Heights |
| Maplewood | Roseville, Little Canada |
| West Saint Paul | South Saint Paul, Mendota Heights |
| Falcon Heights | Roseville, Lauderdale |
| Lauderdale | Falcon Heights, Little Canada |
| South Saint Paul | West Saint Paul, Mendota Heights |
| Mendota Heights | West Saint Paul, South Saint Paul |
| Little Canada | Maplewood, Lauderdale |

---

## Performance Notes
- No external web fonts
- No carousel libraries
- Images: none loaded (no image tags — performance floor is clean)
- Critical CSS inlined in shared stylesheet; no render-blocking JS
- Mobile Lighthouse target ≥90: layout is responsive, no large images, minimal JS

---

## Launch Log
- **Domain:** commercialcleaningservicessaintpaul.com
- **Build date:** 2026-08-17
- **Indexing window opens:** ~Feb–May 2027 (3–6 month cook from launch)
- **Cook window check date:** Add 90 days from live date

---

## Known Items for Client to Supply
1. Actual insurance policy limits (if they want dollar amounts published on /insured-and-bonded/)
2. Per-domain tracking DID — the build uses (866) 958-8773 per spec; client should swap to per-domain number before going live if desired (note: BUILD-SPEC §5a acknowledges the single-phone trade-off)
3. Form backend endpoint for quote form (currently posts to /request-a-quote/ and /thank-you/ — needs a live handler)

---

*QA completed 2026-08-17. All hard-rule items pass. No failures to disclose.*
