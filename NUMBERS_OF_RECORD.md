# Numbers of record

**`data/full/colleges.csv` is the single source of truth.** Anything in an earlier
commit message or an earlier draft that disagrees with this file is superseded.
Git history is left intact rather than rewritten, so superseded figures are still
visible in old commit messages. This file settles which numbers to quote.

## Quote these

| figure | value |
|---|---|
| US public 2-year college campuses (IPEDS HD2023, open, 50 states + DC) | **893** |
| campuses running an identifiable scholarship platform | **408** |
| campuses with no platform found | **485** |
| AwardSpring | **189** |
| Blackbaud Award Management | **140** |
| NextGen Scholarship Manager | **55** |
| ScholarshipUniverse | **24** |
| estimated distinct buying entities across the 893 | **~845** |
| campuses per buying entity (among the 408) | **1.13** |

## Two corrections made 2026-10-27, both found during the dashboard build

**1. Campus rows vs unique domains.** Commit `eb2c3a3` says "395 on a platform, 498
greenfield". Those were counts of unique WEBSITE DOMAINS, not campuses. 12 domains
are shared by 41 campuses, because multi-campus institutions list one website:
City Colleges of Chicago has 8 campuses on `ccc.edu`, Illinois Eastern has 5 on
`iecc.edu`, Alamo has 4 on `alamo.edu`. Counted as campuses, the figures are 408
and 485. The campus count is the correct unit because IPEDS campuses are the rows
anyone will work from.

**2. Campuses per buyer was understated.** The earlier 1.05 figure was also computed
on domains. Recomputed at campus level it is **1.13** (408 campuses across 360
distinct portal hosts, 25 of them shared across 73 campuses). The conclusion is
unchanged and in fact slightly stronger: community colleges overwhelmingly buy per
campus, and the IPEDS system-field collapse to 759 buyers remains wrong because it
conflates governance with purchasing.

## One caveat that must travel with the AwardSpring figure

We identify **189** AwardSpring campuses. AwardSpring states publicly that it serves
about 300 two-year colleges. Both can be true: this method only confirms a customer
when its portal is reachable and verifiable from public pages, so it undercounts
every vendor. 189 is our detection floor for AwardSpring, not their customer count.

This does not weaken the headline. The 485 "no platform found" figure rests on
confirmed negative evidence (435 direct probes; a non-customer returns the vendor's
own marketing page), which is a different and stronger class of evidence than the
positive identifications.
