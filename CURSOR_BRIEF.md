# Build brief: Scholarship Access Index dashboard

## What this is
An internal-style market intelligence dashboard for a scholarship-software vendor's
GTM team. Data is already final. Do not recompute, re-derive, or "improve" any number.

## Data
`data/full/colleges.csv` — 893 rows, one per US public 2-year college.
Columns: unitid, name, city, state, website, locale, system, vendor, portal,
evidence, status, shared_portal, ein.

`status` is one of exactly three values:
  "AwardSpring customer" (189)
  "Competitor" (219)
  "No platform found" (485)

`vendor` is "" for No platform found, otherwise one of:
  AwardSpring (189) / Blackbaud Award Management (140) /
  NextGen Scholarship Manager (55) / ScholarshipUniverse (24)

These totals MUST match what the UI displays. If a filter shows a different
total, the filter is wrong, not the data.

## Stack
Vite + React + TypeScript + Tailwind. Recharts for charts. No backend, no database,
no auth. Load the CSV at build time (import it, parse with papaparse) so the whole
thing is a static bundle deployable to Netlify. Target: `npm run build` produces a
`dist/` folder that works when opened from any static host.

## Pages

**1. Overview**
- Four stat cards: Total market 893 / On a platform 408 / No platform 485 / Vendors 4
- One sentence under the cards: "893 US public 2-year colleges. 485 of them run no
  identifiable scholarship platform."
- Donut: share of the 408 by vendor.
- Horizontal bar: top 15 states by count of "No platform found".
- A short "How to read this" panel with 4 bullets, text supplied below.

**2. Colleges** (the main working view)
- Table: name, city, state, status, vendor, portal (as a link), system.
- Status rendered as a colored pill. Three colors only, matching the three values.
- Filters, all combinable and all reflected in a result count:
  status (multi-select), vendor (multi-select), state (dropdown), free-text search
  across name + city.
- Sortable by name and state.
- "Export current view to CSV" button.
- Row click opens a side drawer with every field for that college plus the website
  link and the portal link.
- Virtualize or paginate; 893 rows must scroll smoothly.

**3. Opportunity**
- Default filter: status = "No platform found". This is the call list.
- Same table as page 2 but pre-filtered, plus a state grouping summary at top.
- Second tab within the page: status = "Competitor", grouped by vendor, which is
  the displacement list.

**4. Method**
- Render the markdown from `data/full/FINDINGS_FULL.md` and `REPORT_NUMBERS.md`.
- Use react-markdown. Do not paraphrase or summarise the content.

## Design
- Clean, dense, internal-tool feel. Not a marketing page. No hero, no gradients,
  no stock photography, no animation beyond hover states.
- Palette: deep navy as primary (#1B3A5C), teal accent (#2E8B8B), warm neutral
  background (#F7F6F3), near-black text. Status pills: teal = AwardSpring customer,
  amber = Competitor, slate = No platform found.
- Inter or system sans. Tabular figures for all numbers.
- Sidebar nav, fixed, four items.
- Works at 1280px and above. Mobile not required.

## Attribution and meta — build exactly this, do not change it
- Header, left: "Scholarship Access Index". Header, right: "Built by Arun Raju
  Nandyala · October 2026".
- Footer on every page: "Independent analysis built from public sources: IPEDS
  HD2023 and public college websites. Not affiliated with, endorsed by, or produced
  by any software vendor named in this analysis."
- `<meta name="robots" content="noindex, nofollow">` in index.html.
- DO NOT use any vendor's logo, wordmark, or trademark anywhere. Vendor names appear
  as plain text data values only. No vendor branding in the header, favicon, or
  anywhere else.
- Favicon: a simple generic mark you generate (a letter or geometric shape). Not a
  vendor logo.

## "How to read this" panel text — use verbatim
- Every row is a US public 2-year college from IPEDS HD2023, the federal
  institutional directory.
- A college is marked as running a platform only when its own scholarship portal was
  found on that vendor's domain, or it shares a portal with other campuses in the
  same state or system.
- "No platform found" is based on confirmed negative evidence, not just absence:
  435 direct portal probes were run, and a non-customer returns the vendor's own
  marketing page rather than a portal.
- Private nonprofit and sub-2-year technical schools are excluded. The same method
  found 1 platform across 424 such campuses, so they are not in this market. A
  further 101 public colleges that function as community colleges sit outside this
  population because IPEDS classes them as four-year; see the Method page.

## Out of scope
No login. No editing. No "request a demo". No contact form. No analytics or
tracking scripts of any kind.
