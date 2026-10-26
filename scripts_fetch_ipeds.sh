#!/usr/bin/env bash
# Re-download the IPEDS HD2023 directory file (nces.ed.gov is blocked; use the git-lfs mirror).
set -euo pipefail
mkdir -p data
OID=fe6247797a4813dc9ade4ddb27043f6081382f4dad88d3b3d1b3e3610fa3525e
HREF=$(curl -sS -X POST -H "Accept: application/vnd.git-lfs+json" -H "Content-Type: application/vnd.git-lfs+json" \
  "https://github.com/ftrain/ipeds2.git/info/lfs/objects/batch" \
  -d "{\"operation\":\"download\",\"transfers\":[\"basic\"],\"objects\":[{\"oid\":\"$OID\",\"size\":4530883}]}" \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['objects'][0]['actions']['download']['href'])")
curl -sSL -o data/HD2023.csv "$HREF"
echo "data/HD2023.csv $(wc -c < data/HD2023.csv) bytes"
