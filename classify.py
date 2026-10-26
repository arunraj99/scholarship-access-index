import csv, json, re
from collections import defaultdict, Counter
from urllib.parse import urlparse

TERR={'PR','GU','VI','AS','MP','FM','MH','PW'}
inst=[r for r in csv.DictReader(open('data/HD2023.csv',encoding='latin-1'))
      if r['OPENPUBL']=='1' and r['ICLEVEL'] in ('2','3') and r['CONTROL'] in ('1','2')
      and r['STABBR'] not in TERR]

def dom(u):
    u=(u or '').strip().strip('"')
    if not u: return None
    u=re.sub(r'^https?://','',u,flags=re.I)
    u=re.sub(r'^www\d?\.','',u.split('/')[0]).lower()
    return u or None

by_dom={}
for r in inst:
    d=dom(r['WEBADDR'])
    if d: by_dom.setdefault(d,r)

pairs=[l.strip().split('|') for l in open('data/full/all_pairs.txt') if l.strip()]

GENERIC={'grantinterface.com','smarterselect.com/program','apply.mykaleidoscope.com',
 'bbox.blackbaudhosting.com','accounts.submittable.com','static.academicworks.com',
 'mail.awardspring.com','www.awardspring.com'}
SCHOL={'awardspring','academicworks','ngweb_scholarships','scholarshipuniverse'}

# which colleges does each portal host serve?
portal_cols=defaultdict(set)
for h,v,s in pairs:
    if v in SCHOL and s not in GENERIC: portal_cols[s].add(h)

def sysname(h):
    r=by_dom.get(h)
    if not r: return None
    return r['F1SYSNAM'].strip().upper() if r['F1SYSTYP']=='1' else None
def state(h):
    r=by_dom.get(h); return r['STABBR'] if r else None

strong={}; rejected={}
for h,v,s in pairs:
    if v not in SCHOL or s in GENERIC:
        rejected.setdefault(h,[]).append((v,s,'generic-or-nonschol')); continue
    slug=s.split('.')[0].lstrip('2f'); col=h.split('.')[0]
    a,b=slug.replace('-',''),col.replace('-','')
    name_match = a==b or (len(b)>=5 and b[:5] in a) or (len(a)>=5 and a[:5] in b)
    cols=portal_cols[s]
    if name_match:
        strong.setdefault(h,set()).add((v,s,'slug-match')); continue
    if len(cols)>1:
        sts={state(c) for c in cols if state(c)}
        sys={sysname(c) for c in cols if sysname(c)}
        if len(sts)==1 or (len(sys)==1 and None not in sys):
            strong.setdefault(h,set()).add((v,s,'district-portal')); continue
        rejected.setdefault(h,[]).append((v,s,f'shared-across-{len(sts)}-states')); continue
    rejected.setdefault(h,[]).append((v,s,'slug-mismatch-single'))

in_scope={h for h in strong if h in by_dom}
print(f"detected colleges (any)        : {len({p[0] for p in pairs})}")
print(f"with own-system evidence       : {len(strong)}")
print(f"  of those, in our IPEDS scope : {len(in_scope)}")
print(f"rejected as outbound/ambiguous : {len([h for h in rejected if h not in strong])}")
print()
vt=Counter(); ev=Counter()
for h in in_scope:
    for v,s,why in strong[h]: vt[v]+=1; ev[why]+=1
print("vendor share among in-scope detected colleges:")
for v,n in vt.most_common(): print(f"   {v:22s} {n:4d}  ({100*n/len(in_scope):.0f}%)")
print("\nevidence type:", dict(ev))
json.dump({h:sorted(list(v)) for h,v in strong.items()},open('data/full/detection.json','w'),indent=1)
json.dump({h:v for h,v in rejected.items() if h not in strong},open('data/full/rejected.json','w'),indent=1)
# state coverage
sc=Counter(state(h) for h in in_scope if state(h))
allst=Counter(r['STABBR'] for r in inst)
missing=[s for s in allst if s not in sc]
print(f"\nstates represented: {len(sc)} of {len(allst)}")
print("states with zero detections:", sorted(missing) if missing else "none")
