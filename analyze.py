import csv, collections
rows=list(csv.DictReader(open('data/HD2023.csv',encoding='latin-1')))
TERR={'PR','GU','VI','AS','MP','FM','MH','PW'}
def openinst(r): return r['OPENPUBL']=='1' and r.get('CYACTIVE','1')!='2'
two=[r for r in rows if r['ICLEVEL']=='2' and openinst(r)]
lt2=[r for r in rows if r['ICLEVEL']=='3' and openinst(r)]
def cut(rs,controls,inc_terr=False):
    return [r for r in rs if r['CONTROL'] in controls and (inc_terr or r['STABBR'] not in TERR)]
def buyers(rs):
    sysmap=collections.defaultdict(list); solo=[]
    for r in rs:
        if r['F1SYSTYP']=='1' and r['F1SYSNAM'].strip() and r['F1SYSNAM'].strip()!='-2':
            sysmap[r['F1SYSNAM'].strip().upper()].append(r)
        else: solo.append(r)
    return sysmap, solo
print("=== CAMPUS COUNTS (open, 50 states + DC) ===")
for lbl,rs,ct in [("2yr public",two,{'1'}),("2yr private nonprofit",two,{'2'}),
                  ("2yr for-profit",two,{'3'}),("<2yr public (technical/trade)",lt2,{'1'}),
                  ("<2yr private nonprofit",lt2,{'2'})]:
    print(f"  {lbl:34s} {len(cut(rs,ct)):5d}")
print()
for lbl, rs in [("A) 2yr PUBLIC only", cut(two,{'1'})),
                ("B) 2yr public + private nonprofit", cut(two,{'1','2'})),
                ("C) B + <2yr public & nonprofit", cut(two,{'1','2'})+cut(lt2,{'1','2'}))]:
    sysmap, solo = buyers(rs)
    multi={k:v for k,v in sysmap.items() if len(v)>1}
    single_in_sys=sum(1 for v in sysmap.values() if len(v)==1)
    entities=len(sysmap)+len(solo)
    print(f"{lbl}")
    print(f"   campuses          : {len(rs)}")
    print(f"   buying entities   : {entities}")
    print(f"   multi-campus systems: {len(multi)} (covering {sum(len(v) for v in multi.values())} campuses)")
    print(f"   standalone        : {len(solo)+single_in_sys}")
    print(f"   collapse ratio    : {len(rs)/entities:.2f} campuses per buyer")
    if lbl.startswith("C"):
        print("   largest systems:")
        for k,v in sorted(multi.items(), key=lambda x:-len(x[1]))[:8]:
            print(f"      {len(v):3d}  {k[:58]}")
    print()
