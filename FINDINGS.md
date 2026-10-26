# Scholarship Access Index — findings log

## 2026-10-26 · Step 1: buyer unit resolution

**Source:** IPEDS HD2023 (directory), 6,163 institutions, 73 fields.
Retrieved via the git-lfs mirror `ftrain/ipeds2`, because nces.ed.gov is blocked by egress policy
on every shell available to this project.

**Verified fields:** F1SYSTYP, F1SYSNAM, F1SYSCOD (system membership); EIN present on
1,325 / 1,325 target campuses (100%). EIN is the join key to IRS Form 990 data.

**Campus counts (open institutions, 50 states + DC):**

| segment | campuses |
|---|---|
| 2-year public | 893 |
| 2-year private nonprofit | 134 |
| <2-year public (technical / trade) | 232 |
| <2-year private nonprofit | 58 |
| **broad target cut** | **1,317** |

AwardSpring publicly cites "about 300 of the 1,300 two-year colleges." Our broad cut returns
1,317 campuses. Their 1,300 is almost certainly a CAMPUS count, not a count of buyers.

**Naive system collapse:** 759 buying entities, 1.74 campuses per buyer.

**Why 759 is wrong as stated.** F1SYSNAM conflates two different things:
- TRUE purchasing entities: Maricopa Community College District (12 campuses),
  Colorado Community College System (13). Both verified by hand to run a single shared
  scholarship portal.
- GOVERNANCE affiliations only: California Community College System (96),
  North Carolina Community College System (55). These campuses almost certainly purchase
  independently.

**Conclusion.** The true buyer count is bounded between 759 and 1,317. Do not assert a single
number yet. The portal-detection pass resolves this empirically: campuses sharing one vendor
subdomain are one buyer, distinct subdomains are separate buyers. Detection determines the
buyer unit rather than assuming it from IPEDS.

## Verified vendor fingerprints (hand-checked, 2026-10-26)

| vendor | pattern | confirmed examples |
|---|---|---|
| AwardSpring | `{slug}.awardspring.com` | CCSNH, Atlantic Cape, SUNY Schenectady, Copiah-Lincoln, Texas Southmost, Motlow State, Mt. San Jacinto, Kingsborough, Alpena |
| Blackbaud Award Management | `{slug}.academicworks.com` | St. Louis CC, Community College of Philadelphia, College of DuPage |
| NextGen Scholarship Manager | `{slug}.scholarships.ngwebsolutions.com` | Maricopa, Colorado CCS |
| greenfield (PDF / homegrown) | own domain, no vendor host | Columbia Gorge CC, Patrick & Henry CC |

## Network constraints

- Cloud container: GitHub + package registries only.
- Mac Cowork shell: GitHub + PyPI only. Same policy.
- Apify: full open internet. Browser-based, so good for HTML pages, returns nothing for raw JSON.
- Control Chrome: can list and open tabs, but all content-reading calls fail. Page access not granted.

Crawler for the detection pass should therefore be Apify.
