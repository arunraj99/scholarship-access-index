import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { COLUMNS, type College } from './data'

export type SortKey = 'name' | 'state'
export interface SortState {
  key: SortKey
  dir: 'asc' | 'desc'
}

export function sortRows(rows: College[], sort: SortState): College[] {
  const sign = sort.dir === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => {
    const primary = a[sort.key].localeCompare(b[sort.key])
    if (primary !== 0) return primary * sign
    return a.name.localeCompare(b.name) || a.unitid.localeCompare(b.unitid)
  })
}

export function nextSort(sort: SortState, key: SortKey): SortState {
  if (sort.key !== key) return { key, dir: 'asc' }
  return { key, dir: sort.dir === 'asc' ? 'desc' : 'asc' }
}

export function exportCsv(rows: College[], filename = 'community-college-scholarship-access-index-export.csv') {
  const csv = Papa.unparse(rows, { columns: COLUMNS })
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

export const fmt = (n: number) => n.toLocaleString('en-US')
