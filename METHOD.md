# How this was built

This analysis maps what every US community college uses to run its scholarship
program. It was assembled over two days from public sources only. It uses no
vendor's internal data, no API access, and nothing behind a login.

Built by Arun Raju Nandyala, October 2026.

---

## What counts as a community college here

The population is every **US public two-year college** listed in IPEDS HD2023, the
federal directory of postsecondary institutions, restricted to open institutions and
excluding US territories. That is **893 campuses across 47 states**. Four
jurisdictions have no qualifying campus at all: Alaska, Delaware, Nevada and the
District of Columbia, none of which operate public two-year colleges in this
category.

Two adjacent groups were deliberately excluded after testing them:

- **134 private nonprofit two-year colleges**
- **290 sub-two-year public and nonprofit technical and trade schools**

The same detection method was run across all three groups. It identified a
scholarship platform at 45% of public two-year colleges and at **one campus out of
those other 424**. A method that works in one segment and returns nothing in
another is describing the market, not failing. Barber academies, seminaries and
district career centers do not run scholarship foundations, so they are not buyers
and they are not counted.

This matters for any market-size figure. The commonly cited "1,300 two-year
colleges" counts all three groups together. The number of institutions that
actually buy this software is **893**.

---

## How each college's platform was identified

Every major scholarship management platform hosts the student-facing application
portal on the vendor's own domain, not the college's. A college using Blackbaud
Award Management sends students to `collegename.academicworks.com`. AwardSpring
customers go to `collegename.awardspring.com`. So the portal address is the
evidence.

Three passes were used.

**1. Crawl.** Starting from each college's homepage and financial aid page, follow
links whose address or anchor text suggests scholarships, foundation or financial
aid, up to two levels deep, and record any vendor portal address found in the page
source. 1,317 campuses were crawled this way across roughly 17,000 page fetches.

**2. Direct probe.** For colleges where the crawl found nothing, request the portal
address the college would have if it were a customer. This produces evidence in both
directions, which is the single most useful property of the method. A college that is
not a Blackbaud customer gets redirected to Blackbaud's own marketing page, with an
identical page size every time. So one request returns either a confirmed customer
or a **confirmed non-customer**. 435 such probes were run.

**3. Verification.** Every probe hit must carry the institution's own name in the
resulting page title. This caught a real error: the address `rbc.academicworks.com`
resolves to a live portal, but it belongs to Red Bank Catholic, a high school, not to
Richard Bland College. Without the name check that would have been a false
identification.

---

## What was thrown away, and why

Colleges publish lists of outside scholarships their students can apply for.
Those scholarships are often hosted on another institution's or a community
foundation's portal. A naive text match counts those as the college's own software
and inflates every figure.

**119 colleges were rejected** on exactly this basis. Examples of addresses that
appear on college pages but are not that college's system:

- `stlouisgraduates.academicworks.com` — a St. Louis community foundation's scholarship
- `dar.academicworks.com` — Daughters of the American Revolution
- `cbcfinc.academicworks.com` — Congressional Black Caucus Foundation

Shared portals were kept only where they are genuinely one buyer serving several
campuses. `arcc-atc.awardspring.com` serves Anoka Ramsey and Anoka Technical, which
are one district. `ccc.academicworks.com` serves all eight City Colleges of Chicago
campuses. These were confirmed by checking that every campus sharing a portal sits in
the same state or the same IPEDS system.

Generic hosts were also excluded, because they carry no per-college signal: form and
grant tools such as SmarterSelect, Foundant GrantInterface, Submittable and the
general Kaleidoscope applicant portal. A college using one of those is counted as
having **no scholarship management platform**, which is the honest reading: a generic
form is not a scholarship management system.

---

## Reading the three statuses

**On a platform (408 campuses).** The college's own scholarship portal was found on a
vendor's domain, or it shares a portal with other campuses in its own district or
system.

**No platform found (485 campuses).** Nothing was found by crawl, and for a large
share of these a direct probe returned positive confirmation that the college is not
a customer. These colleges run their scholarship programs on spreadsheets, paper,
PDF forms, generic form tools, or software built in-house.

**Competitor (219 campuses).** A subset of "on a platform": the college runs a
platform other than AwardSpring.

---

## Platform counts, and one important limit

| platform | campuses |
|---|---|
| AwardSpring | 189 |
| Blackbaud Award Management | 140 |
| NextGen Scholarship Manager | 55 |
| ScholarshipUniverse | 24 |

**These are detection floors, not customer counts.** The method only confirms a
customer when the portal is reachable and verifiable from public pages, so it
undercounts every vendor. AwardSpring states publicly that it serves about 300
two-year colleges; this analysis identifies 189 of them. Both can be true.

The "no platform found" figure of 485 is the more reliable number, because it rests
on confirmed negative evidence rather than on absence of evidence.

A small number of colleges show evidence of two platforms, usually a college with its
own portal that also links a district portal. Each college is assigned one platform,
preferring the portal whose address matches the college's own domain.

---

## How colleges buy

Among the 408 campuses on a platform there are 360 distinct portals. Only 25 portals
are shared, covering 73 campuses. That is **1.13 campuses per portal**.

Community colleges buy scholarship software per campus, not per district. This is
worth stating because the obvious shortcut gives the wrong answer: collapsing
campuses using the IPEDS system field suggests 759 buying entities, but that field
records governance rather than purchasing. The California Community College System is
a single row in IPEDS and roughly 96 independent buyers in practice.

Across all 893 campuses the estimated number of distinct buying entities is **about
845**.

---

## Known limits

- A platform was identified in **43 of the 47 states** that have qualifying
  campuses. The four states where no campus was found on any platform are Florida
  (24 campuses), West Virginia (13), Wyoming (3) and Vermont (1). Florida and West
  Virginia were probed directly and the absence was confirmed; Wyoming and Vermont
  have too few campuses for the result to carry weight either way.
- Florida, West Virginia and Connecticut initially showed zero detections. All three
  were probed directly. Only one customer was found across 72 probes, confirming the
  absence is real: Florida's entries in this population are district-run technical
  centers, Connecticut consolidated its colleges into CT State in 2023, and West
  Virginia's colleges are on none of the four platforms.
- The crawl was stopped once newly discovered colleges fell to roughly 5% of pages
  fetched. Additional crawling would add a small number of identifications.
- A college that changed platforms recently may still show its previous portal if the
  old link is still published.
- Snapshot date: 26 to 27 October 2026.

---

## Sources

- IPEDS HD2023 institutional directory, National Center for Education Statistics
- Public college and college foundation websites
- Public vendor portal addresses

Not affiliated with, endorsed by, or produced by any software vendor named here.
