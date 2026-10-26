# Full detection run — findings (2026-10-26)

Apify run `TDhzNu3bQV6Xasllm`, dataset `zwz620TRcwZOwCVV2`.
3,596 seed URLs across all 1,317 in-scope campuses. Aborted at 8.1 compute units
after ~61 min once hit density in the tail collapsed to ~5% (mostly failed retries).
17,368 raw rows -> 606 unique (campus, vendor, portal) triples -> 508 campuses with
at least one vendor string found.

## Precision filter (this is the important part)

A raw regex match is NOT evidence that a college runs that vendor. Colleges list
OUTBOUND scholarships their students can apply for, hosted on other institutions'
and funders' portals. Counting those would have inflated every number badly.

Three classes, applied with the IPEDS directory as the arbiter:

1. **slug-match (354)** — portal slug matches the college's own domain
   (`colin.edu` -> `colin.awardspring.com`). The college's own system.
2. **district-portal (51)** — portal shared by >1 campus AND all member campuses
   sit in one state or one IPEDS system (`arcc-atc.awardspring.com` = Anoka Ramsey
   + Anoka Tech; `losrios.academicworks.com` = 6 Los Rios campuses). Legitimate,
   and this is what answers the buyer-unit question.
3. **rejected (119)** — generic hosts with no per-college signal
   (`grantinterface.com`, `smarterselect.com/program`, `apply.mykaleidoscope.com`,
   `bbox.blackbaudhosting.com`), or portals belonging to unrelated third-party
   funders that a college merely links to (`stlouisgraduates.academicworks.com`,
   `dar.academicworks.com`, `cbcfinc.academicworks.com`, `doughertyfoundation.academicworks.com`).

Result: **388 in-scope campuses with defensible own-system evidence.**

## Vendor share among those 388

| vendor | campuses | share |
|---|---|---|
| AwardSpring | 195 | 50% |
| Blackbaud Award Management (AcademicWorks) | 124 | 32% |
| NextGen Scholarship Manager | 60 | 15% |
| ScholarshipUniverse | 26 | 7% |

Caveat: the seed set deliberately included known AwardSpring customers from the
pilot, so AwardSpring's 50% here is biased upward and must NOT be published as a
market share. The defensible claim is ordinal: AwardSpring and Blackbaud are the
two largest, NextGen is a real third player, and NextGen is absent from every
public comparison of this category we found.

## Buyer unit: the IPEDS system collapse was wrong

Earlier estimate from IPEDS `F1SYSNAM`: 759 buying entities (1.74 campuses/buyer).
Empirically, from shared portals:

- 388 detected campuses
- 369 distinct portal hosts
- only 21 shared district portals, covering 57 campuses
- **collapse ratio 1.05 campuses per buyer**

Community colleges overwhelmingly buy scholarship software PER CAMPUS, not per
system. The IPEDS system field over-collapsed by conflating governance with
purchasing (California Community College System's 96 campuses are one row in
IPEDS and ~96 separate buyers in reality).

Applying the observed 1.05 ratio to the full 1,317-campus universe gives roughly
**1,250 buying entities**, not 759. AwardSpring's addressable buyer count is
materially LARGER than a systems-based analysis implies.

## Coverage: 41 of 50 states, with 3 real gaps

Zero detections in AK(2), DC(1), DE(3), ME(8), VT(1), WY(3) — too few campuses
for this to be meaningful.

Three genuine gaps needing the probe pass:
- **FL: 56 campuses seeded, 0 detected.** The crawl did find Florida schools, but
  on `smarterselect.com` and `grantinterface.com` — generic form tools, not
  scholarship management platforms. Most FL entries in this cut are district-run
  technical centers. Likely a real structural finding, not a crawler failure.
- **WV: 29 campuses, 0 detected.** Unexplained. Probe required.
- **CT: 15 campuses, 0 detected.** CT consolidated its community colleges into
  CT State in 2023; the pilot found `manchestercc.academicworks.com` by probe,
  which the crawl missed. Probe required.

## Still to do

1. Probe pass over the ~929 undetected campuses (AcademicWorks + NextGen +
   ScholarshipUniverse only; the AwardSpring probe is unusable because it serves a
   placeholder page on any subdomain). Every probe hit must match the institution
   name in the page title — `rbc.academicworks.com` is Red Bank Catholic, not
   Richard Bland College.
2. Only then is a greenfield count publishable.
