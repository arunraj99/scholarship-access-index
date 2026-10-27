"""Score the colleges with no detectable platform into a ranked call list.

Signals are public and explainable:
  size   IPEDS INSTSIZE band (bigger college, more scholarship dollars to manage)  0 to 3
  peer   at least one AwardSpring campus in the same state (peer proof)            +2
  adopt  three or more campuses in the state already run any platform              +1
Tier A score 5+, Tier B 3 to 4, Tier C below 3.
Excluded: campuses IPEDS marks as merged during 2023 (CYACTIVE not 1), and
Connecticut State Community College, whose merged Manchester campus runs Blackbaud.
Every account is assigned to a treatment or holdout group, stratified by tier,
with a fixed hash so the split is reproducible.
"""
import csv, hashlib, collections as C

hd = {}
with open('data/HD2023.csv', encoding='latin-1') as f:
    for r in csv.DictReader(f):
        r = {k.strip().upper(): (v or '').strip() for k, v in r.items()}
        hd[r['UNITID']] = r

rows = list(csv.DictReader(open('data/full/colleges.csv')))
rows = [{k.strip(): v.strip() for k, v in r.items()} for r in rows]
EXCLUDE_REASON = {}
for r in rows:
    if hd.get(r['unitid'], {}).get('CYACTIVE') != '1':
        EXCLUDE_REASON[r['unitid']] = 'Merged into another college during 2023 (IPEDS)'
EXCLUDE_REASON['129367'] = 'Likely on Blackbaud: its merged Manchester campus runs it. Verify before calling'
rows_all = rows
rows = [r for r in rows if hd.get(r['unitid'], {}).get('CYACTIVE') == '1']

SIZE_LABEL = {'1': 'Under 1,000', '2': '1,000 to 4,999', '3': '5,000 to 9,999', '4': '10,000 to 19,999', '5': '20,000 and above'}
SIZE_PTS = {'1': 0, '2': 1, '3': 2, '4': 3, '5': 3}
SIZE_ORDER = {'5': 5, '4': 4, '3': 3, '2': 2, '1': 1}

STATE_NAMES = dict(AL='Alabama',AK='Alaska',AZ='Arizona',AR='Arkansas',CA='California',CO='Colorado',CT='Connecticut',DE='Delaware',DC='DC',FL='Florida',GA='Georgia',HI='Hawaii',ID='Idaho',IL='Illinois',IN='Indiana',IA='Iowa',KS='Kansas',KY='Kentucky',LA='Louisiana',ME='Maine',MD='Maryland',MA='Massachusetts',MI='Michigan',MN='Minnesota',MS='Mississippi',MO='Missouri',MT='Montana',NE='Nebraska',NV='Nevada',NH='New Hampshire',NJ='New Jersey',NM='New Mexico',NY='New York',NC='North Carolina',ND='North Dakota',OH='Ohio',OK='Oklahoma',OR='Oregon',PA='Pennsylvania',RI='Rhode Island',SC='South Carolina',SD='South Dakota',TN='Tennessee',TX='Texas',UT='Utah',VT='Vermont',VA='Virginia',WA='Washington',WV='West Virginia',WI='Wisconsin',WY='Wyoming')
as_by_state = C.defaultdict(list)
any_by_state = C.Counter()
for r in rows:
    if r['status'] != 'No platform found':
        any_by_state[r['state']] += 1
    if r['status'] == 'AwardSpring customer':
        d = hd.get(r['unitid'], {})
        as_by_state[r['state']].append((r['name'], float(d.get('LATITUDE') or 0), float(d.get('LONGITUD') or 0), r['portal'], r['shared_portal'] == 'True'))

def h(s):
    return int(hashlib.sha256(s.encode()).hexdigest(), 16)

out = []
for r in rows:
    if r['status'] != 'No platform found' or r['unitid'] in EXCLUDE_REASON:
        continue
    d = hd.get(r['unitid'], {})
    size = d.get('INSTSIZE', '')
    pts_size = SIZE_PTS.get(size, 0)
    lat, lon = float(d.get('LATITUDE') or 0), float(d.get('LONGITUD') or 0)
    # nearest AwardSpring peers first, so the opening line names colleges the buyer actually knows
    ranked = sorted(as_by_state[r['state']], key=lambda p: (p[1] - lat) ** 2 + ((p[2] - lon) * 0.8) ** 2)
    peers = [p[0] for p in ranked]  # every AwardSpring campus in the state, for the count
    # names for the line: one per portal, own-portal colleges preferred over campuses on a shared portal
    named, seen_portals = [], set()
    for n, a, b, portal, shared in ranked:
        if portal in seen_portals or shared:
            continue
        seen_portals.add(portal); named.append(n)
    named = named or peers
    pts_peer = 2 if peers else 0
    pts_adopt = 1 if any_by_state[r['state']] >= 3 else 0
    score = pts_size + pts_peer + pts_adopt
    tier = 'A' if score >= 5 else 'B' if score >= 3 else 'C'
    faid = d.get('FAIDURL', '')
    if faid and not faid.startswith('http'):
        faid = 'https://' + faid
    st = STATE_NAMES.get(r['state'], r['state'])
    n_any = any_by_state[r['state']]
    if len(peers) == 1:
        line = f"{named[0]} already runs its scholarships on AwardSpring in {st}."
    elif peers:
        line = f"{len(peers)} {st} community colleges already run their scholarships on AwardSpring, including {named[0]} and {named[1] if len(named) > 1 else peers[1]}."
    elif n_any:
        line = f"{n_any} {st} community college{'s' if n_any > 1 else ''} already run{'' if n_any > 1 else 's'} scholarships on a platform. None on AwardSpring yet."
    else:
        line = f"No {st} community college runs a scholarship platform yet. You would be first."
    out.append({
        'unitid': r['unitid'], 'name': r['name'], 'city': r['city'], 'state': r['state'],
        'size': SIZE_LABEL.get(size, 'Unknown'), 'locale': r['locale'],
        'awardspring_peers_in_state': len(peers), 'platform_campuses_in_state': any_by_state[r['state']],
        'score': score, 'size_order': SIZE_ORDER.get(size, 0), 'tier': tier, 'first_touch': line,
        'call_role': 'Financial aid or foundation director', 'financial_aid_page': faid, 'website': r['website'],
    })

out.sort(key=lambda x: (-x['score'], -x['size_order'], -x['awardspring_peers_in_state'], x['name']))
# stratified, reproducible treatment / holdout split
for t in 'ABC':
    grp = sorted([x for x in out if x['tier'] == t], key=lambda x: h('exp1-' + x['unitid']))
    for i, x in enumerate(grp):
        x['group'] = 'Treatment' if i % 2 == 0 else 'Holdout'
# Call first: top 50 by rank, at most 8 per state so the first week spans territories
seen = C.Counter(); first = set()
for x in out:
    if len(first) < 50 and seen[x['state']] < 8:
        first.add(x['unitid']); seen[x['state']] += 1
for i, x in enumerate(out, 1):
    x['rank'] = i
    x['call_first'] = 'Yes' if x['unitid'] in first else ''

cols = ['rank', 'call_first', 'tier', 'score', 'group', 'name', 'city', 'state', 'size', 'locale',
        'awardspring_peers_in_state', 'platform_campuses_in_state', 'first_touch',
        'call_role', 'financial_aid_page', 'website', 'unitid']
with open('data/full/call_list.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=cols)
    w.writeheader()
    for x in out:
        w.writerow({k: x[k] for k in cols})

with open('data/full/call_list_excluded.csv', 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['name', 'state', 'unitid', 'reason'])
    for r in rows_all:
        if r['unitid'] in EXCLUDE_REASON and r['status'] == 'No platform found':
            w.writerow([r['name'], r['state'], r['unitid'], EXCLUDE_REASON[r['unitid']]])
print('rows', len(out))
print('tiers', C.Counter(x['tier'] for x in out))
print('groups by tier', C.Counter((x['tier'], x['group']) for x in out))
print('faid coverage', sum(1 for x in out if x['financial_aid_page']))
print('sizes', C.Counter(x['size'] for x in out))
cf=[x for x in out if x['call_first']]
print('call first', len(cf), C.Counter(x['group'] for x in cf), C.Counter(x['tier'] for x in cf), C.Counter(x['state'] for x in cf))
for x in cf[:6]+cf[-3:]:
    print(x['rank'], x['tier'], x['score'], x['name'], x['state'], x['size'], '|', x['first_touch'])
