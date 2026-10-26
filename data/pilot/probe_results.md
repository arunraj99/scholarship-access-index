# Direct portal probe — 2026-10-26 (run 5I2QtZuBxnmyDZucO)

66 probes against 4 vendors for 33 unclassified colleges. 23 resolved, 43 dead.

## The discriminator

AcademicWorks / Blackbaud is the cleanest signal in the whole project:
- NOT a customer -> redirects to blackbaud.com/products/award-scholarship-management,
  title "Blackbaud Award Management(TM)...", body length 17059 EVERY time.
- IS a customer -> stays on the subdomain with the institution's own name in the title.

That gives POSITIVE and NEGATIVE evidence from one request. Negative evidence is what
converts "unclassified" into a defensible "not on this vendor".

## Confirmed new classifications (institution name verified in page title)

| college | vendor | portal | evidence |
|---|---|---|---|
| ccp.edu | academicworks | ccp.academicworks.com | "Our Opportunities - Community College of Philadelphia" |
| manchestercc.edu | academicworks | manchestercc.academicworks.com | "MCC Foundation Scholarships Supporting CT State Community College Manchester Campus" |
| orangecoastcollege.edu | academicworks | orangecoastcollege.academicworks.com | "Sign In - Orange Coast College Scholarships" |
| witcc.edu | ngweb_scholarships | witcc.scholarships.ngwebsolutions.com | "Scholarship Manager" |

## Two failure modes the probe exposed

**1. AwardSpring wildcard — probe is NOT reliable for this vendor.**
ccp.awardspring.com and orangecoastcollege.awardspring.com both return a generic
"Home Page" (1610 and 1591 bytes), but both institutions are confirmed AcademicWorks
customers. AwardSpring serves a placeholder for any subdomain, so a 200 proves nothing.
cgcc.awardspring.com returns the same placeholder and must NOT be counted as a customer
without corroboration.

**2. Slug collision — rbc.academicworks.com is "Red Bank Catholic", not Richard Bland
College.** The slug is derived from the college's domain, so unrelated institutions
sharing a slug produce false positives. Every probe hit must be confirmed by matching
the institution name in the page title. This guard caught it; without it we would have
mislabelled Richard Bland.

## Useful negative evidence

Confirmed NOT on AcademicWorks: Maricopa, Mesa, Phoenix College, Scottsdale, Helena,
Oklahoma Tech, CT State, Little Priest, Saginaw Chippewa, Martin CC, Columbia Gorge,
Tunxis, Western Iowa Tech.

## Ground truth correction #2

I had labelled Manchester Community College as AwardSpring on the New Hampshire system
portal. Wrong college: the pilot row is Manchester CC in CONNECTICUT, which runs
AcademicWorks. Second hand-label error the machine has caught.
