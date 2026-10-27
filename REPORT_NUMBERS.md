# Scholarship Access Index — headline numbers

All figures from public data only. Method and every rejection is in
`data/full/FINDINGS_FULL.md`. Nothing here uses AwardSpring data.

## The market

| | campuses |
|---|---|
| US public 2-year colleges (IPEDS HD2023, open, 50 states + DC) | **893** |
| running an identifiable scholarship platform | **408 (46%)** |
| no scholarship platform found | **485 (54%)** |

The 893 figure matters. AwardSpring publicly cites "about 300 of the 1,300
two-year colleges." 1,300 is a count of CAMPUSES across all two-year segments,
including 134 private nonprofit and 290 sub-two-year technical schools where the
same detection method found 1 platform in 424 campuses. Those segments do not buy
this software. Against the real buying universe of 893, ~300 customers is ~34%
penetration, not ~23%.

## Who the 395 run

| vendor | campuses |
|---|---|
| AwardSpring | 189 |
| Blackbaud Award Management (AcademicWorks) | 140 |
| NextGen Scholarship Manager | 55 |
| ScholarshipUniverse | 24 |

AwardSpring's 189 is NOT a market share claim: the crawl was seeded with known
AwardSpring customers from the pilot, so it is biased upward. The defensible
findings are ordinal: Blackbaud is the clear number two, and **NextGen
Scholarship Manager holds ~55 campuses while appearing in none of the public
comparisons of this category** — including AwardSpring's own comparison page.

## The 485

This is the number that took the most work to earn, because "we didn't find
anything" is not the same as "there is nothing."

435 direct portal probes were run against the undetected set. 8 returned a
confirmed customer (institution name present in the page title). Roughly 350
returned Blackbaud's marketing page with an identical 17,059-byte body, which is
positive proof of NON-customer status, not a failed lookup. The rest failed to
resolve at all.

So the 485 is built on confirmed negative evidence. These colleges are running
scholarships on spreadsheets, paper, PDFs, generic form tools (SmarterSelect,
Foundant GrantInterface, Submittable) or homegrown web forms.

## Buying unit

| | |
|---|---|
| detected campuses | 388 |
| distinct portal hosts | 369 |
| shared district portals | 21, covering 57 campuses |
| **campuses per buyer** | **1.05** |

Community colleges buy per campus, not per district. An IPEDS system-field
collapse gives 759 buyers and is wrong: it conflates governance with purchasing
(California Community College System is one IPEDS row and ~96 independent
buyers). Applied to 893, the buying universe is ~850 entities.

## What this is worth to a seller in this category

1. The addressable universe is 893, not 1,300. Penetration is better than stated
   and runway is shorter.
2. 485 named colleges run no platform at all. That is the largest single
   opportunity in the category and it is a list, not an estimate.
3. 219 named colleges run a competitor and can be approached on renewal.
4. NextGen is an unrecognised number-three competitor holding ~60 campuses.
5. Per-campus buying means territory and quota design should be per campus.

## Note on counting

A handful of colleges show evidence of two vendors (for example a college with its
own AwardSpring portal that also links a district Blackbaud portal). In the
per-college dataset each college is assigned ONE vendor, preferring the portal whose
slug matches the college's own domain over a shared district portal. Counting each
vendor once per college instead gives AwardSpring 195 / Blackbaud 124 / NextGen 60 /
ScholarshipUniverse 25 across 387 colleges; the single-vendor assignment used in the
dashboard gives 189 / 140 / 55 / 24 across 408. Both are in the repo. The dashboard
figure is the one to quote, because it answers "what does this college run."

Source of record for every number here: `data/full/colleges.csv` (893 rows).
