import Papa from 'papaparse'
import raw from '../data/full/colleges.csv?raw'

export const STATUSES = ['AwardSpring customer', 'Competitor', 'No platform found'] as const
export type Status = (typeof STATUSES)[number]

export interface College {
  unitid: string
  name: string
  city: string
  state: string
  website: string
  locale: string
  system: string
  vendor: string
  portal: string
  evidence: string
  status: Status
  shared_portal: string
  ein: string
}

export const COLUMNS: (keyof College)[] = [
  'unitid', 'name', 'city', 'state', 'website', 'locale', 'system',
  'vendor', 'portal', 'evidence', 'status', 'shared_portal', 'ein',
]

const parsed = Papa.parse<College>(raw, {
  header: true,
  skipEmptyLines: true,
  transformHeader: (h) => h.trim(),
  transform: (v) => v.trim(),
})

if (parsed.errors.length) {
  console.error('colleges.csv parse errors', parsed.errors)
}

export const colleges: College[] = parsed.data

export function countBy<K extends keyof College>(rows: College[], key: K): Map<College[K], number> {
  const m = new Map<College[K], number>()
  for (const r of rows) m.set(r[key], (m.get(r[key]) ?? 0) + 1)
  return m
}

/** Distinct values sorted by count desc, ties alphabetical. */
export function rankBy<K extends keyof College>(rows: College[], key: K): { value: College[K]; count: number }[] {
  return [...countBy(rows, key)]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || String(a.value).localeCompare(String(b.value)))
}

export const VENDORS: string[] = rankBy(colleges, 'vendor').map((v) => v.value).filter(Boolean)
export const COMPETITORS: string[] = rankBy(colleges.filter((c) => c.status === 'Competitor'), 'vendor').map((v) => v.value)
export const STATES: string[] = [...new Set(colleges.map((c) => c.state))].sort()

export const isShared = (c: College) => c.shared_portal === 'True'
export const isRuralOrTown = (c: College) => /^(Fringe|Distant|Remote)/.test(c.locale)

export const portalUrl = (c: College) => (c.portal ? `https://${c.portal}` : '')

export const FIELD_LABELS: Record<keyof College, string> = {
  unitid: 'IPEDS unitid',
  name: 'Name',
  city: 'City',
  state: 'State',
  website: 'Website',
  locale: 'Locale',
  system: 'System',
  vendor: 'Platform',
  portal: 'Portal',
  evidence: 'Evidence',
  status: 'Status',
  shared_portal: 'Shared district portal',
  ein: 'EIN',
}
