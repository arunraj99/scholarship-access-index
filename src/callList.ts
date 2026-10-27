import Papa from 'papaparse'
import raw from '../data/full/call_list.csv?raw'
import rawExcluded from '../data/full/call_list_excluded.csv?raw'

export interface Account {
  rank: string
  call_first: string
  tier: 'A' | 'B' | 'C'
  score: string
  group: 'Treatment' | 'Holdout'
  name: string
  city: string
  state: string
  size: string
  locale: string
  awardspring_peers_in_state: string
  platform_campuses_in_state: string
  first_touch: string
  call_role: string
  financial_aid_page: string
  website: string
  unitid: string
}

export interface Excluded {
  name: string
  state: string
  unitid: string
  reason: string
}

const opts = { header: true, skipEmptyLines: true, transformHeader: (h: string) => h.trim(), transform: (v: string) => v.trim() }

export const accounts: Account[] = Papa.parse<Account>(raw, opts).data
export const excluded: Excluded[] = Papa.parse<Excluded>(rawExcluded, opts).data
export const callFirst = accounts.filter((a) => a.call_first === 'Yes')
export const tierCount = (t: Account['tier']) => accounts.filter((a) => a.tier === t).length
export const groupCount = (g: Account['group']) => accounts.filter((a) => a.group === g).length
