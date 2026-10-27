# Numbers of record

**`data/full/colleges.csv` is the single source of truth.** Earlier commit messages
and earlier drafts contain superseded figures. Git history is left intact rather
than rewritten, so those superseded numbers are still visible in old commits. This
file settles which numbers to quote.

Last corrected: 2026-10-27, after a false-positive audit.

## Quote these

| figure | value |
|---|---|
| US public 2-year college campuses (IPEDS HD2023, open, excl. territories) | **893** |
| states with qualifying campuses | **47** |
| campuses running an identifiable scholarship platform | **403** |
| campuses with no platform found | **490** |
| campuses on a competitor platform | **214** |
| AwardSpring | **189** |
| Blackbaud Award Management | **136** |
| NextGen Scholarship Manager | **55** |
| ScholarshipUniverse | **23** |
| distinct portals among the 403 | **359** |
| shared district portals | **21, covering 65 campuses** |
| campuses per portal | **1.12** |
| estimated distinct buying entities across the 893 | **~849** |
| states with at least one identified platform | **42** |

## Correction history

**2026-10-27, third pass: five false identifications removed.** Short college
abbreviations collide. A portal was being credited to whichever college shared its
slug, without checking that the portal's own page named that college. Removed:

| college | wrongly credited portal | portal actually belongs to |
|---|---|---|
| Ellsworth Community College (IA) | ecc.academicworks.com | SUNY Erie (NY) |
| Marshalltown Community College (IA) | mcc.academicworks.com | Mott (MI) |
| Kennebec Valley Community College (ME) | kvcc.academicworks.com | Kalamazoo Valley (MI) |
| Southeastern Illinois College (IL) | nic.scholarshipuniverse.com | North Idaho College (ID) |
| Merced College (CA) | iu.academicworks.com | unrelated (Indiana University) |

Otero College (CO) was briefly removed by the same sweep and then restored: its
portal `cccs.scholarships.ngwebsolutions.com` is the Colorado Community College
System portal and Otero is a CCCS college. The check now matches system acronyms.

Effect: 408 -> 403 on a platform, 485 -> 490 with none, Blackbaud 140 -> 136,
ScholarshipUniverse 24 -> 23, and states with a platform 43 -> 42 (Maine's only
identification was the false Kennebec Valley one).

**2026-10-27, second pass: `shared_portal` column was wrong.** It was computed over
unique website domains instead of campuses, so all eight City Colleges of Chicago
rows and all four Alamo rows were flagged False despite sharing a portal. Now
computed per campus: 65 campuses flagged, matching the portal data.

**2026-10-27, first pass: campus rows vs unique domains.** An earlier commit said
"395 on a platform, 498 greenfield". Those counted unique website domains, not
campuses: 12 domains are shared by 41 campuses because multi-campus institutions
publish one website. The campus count is the correct unit. Campuses per buyer was
also affected (1.05 was a domain-level figure).

## The caveat that must travel with the AwardSpring figure

We identify **189** AwardSpring campuses. AwardSpring states publicly that it serves
about 300 two-year colleges, and that figure is specific to two-year colleges rather
than all customers (their 600+ organization total covers two-year colleges plus
four-year universities and foundations). Both can be true: this method only confirms
a customer when its portal is reachable and verifiable from public pages, so it
undercounts every vendor.

189 is a detection floor, not a customer count. The 490 "no platform found" figure
is the stronger number, because it rests on confirmed negative evidence.

## Figures that cannot be recomputed from the CSV

Two numbers in METHOD.md come from the crawl and probe logs rather than the final
dataset, and are stated as process facts:

- **119 colleges rejected** during the crawl. From `data/full/rejected.json`, which
  covers the wider 1,317-campus crawl, not just the 893. Roughly half linked only a
  generic form tool, roughly half a third-party funder's portal.
- **435 probes** run, as two passes: 72 across the gap states and 363 across the
  undetected set. `data/full/probe_urls.txt` lists 1,398 planned probe URLs; only
  these 435 were executed, which is why the file and the figure differ.
