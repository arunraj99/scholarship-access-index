import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { colleges, countBy, isShared, STATES, STATUSES, VENDORS, type College, type Status } from '../data'
import { exportCsv, fmt, nextSort, sortRows, useDebounced, type SortKey, type SortState } from '../lib'
import { CollegeTable } from '../CollegeTable'
import { CollegeDrawer } from '../CollegeDrawer'
import { STATUS_COLORS } from '../StatusPill'

type Facet = 'status' | 'vendor' | 'state'

interface Filters {
  statuses: Set<Status>
  vendors: Set<string>
  states: Set<string>
  sharedOnly: boolean
  q: string
}

function matches(c: College, f: Filters, skip?: Facet): boolean {
  if (skip !== 'status' && f.statuses.size && !f.statuses.has(c.status)) return false
  if (skip !== 'vendor' && f.vendors.size && !f.vendors.has(c.vendor)) return false
  if (skip !== 'state' && f.states.size && !f.states.has(c.state)) return false
  if (f.sharedOnly && !isShared(c)) return false
  if (f.q && !c.name.toLowerCase().includes(f.q) && !c.city.toLowerCase().includes(f.q)) return false
  return true
}

function toggle<T>(set: Set<T>, v: T): Set<T> {
  const next = new Set(set)
  if (next.has(v)) next.delete(v)
  else next.add(v)
  return next
}

export function CollegesPage() {
  const [statuses, setStatuses] = useState<Set<Status>>(new Set())
  const [vendors, setVendors] = useState<Set<string>>(new Set())
  const [states, setStates] = useState<Set<string>>(new Set())
  const [sharedOnly, setSharedOnly] = useState(false)
  const [search, setSearch] = useState('')
  const q = useDebounced(search.trim().toLowerCase(), 150)
  const [sort, setSort] = useState<SortState>({ key: 'name', dir: 'asc' })
  const [selected, setSelected] = useState<College | null>(null)

  const filters = useMemo<Filters>(
    () => ({ statuses, vendors, states, sharedOnly, q }),
    [statuses, vendors, states, sharedOnly, q],
  )

  const rows = useMemo(() => sortRows(colleges.filter((c) => matches(c, filters)), sort), [filters, sort])

  const facetCounts = useMemo(() => {
    const count = (skip: Facet, key: keyof College) => countBy(colleges.filter((c) => matches(c, filters, skip)), key)
    return { status: count('status', 'status'), vendor: count('vendor', 'vendor'), state: count('state', 'state') }
  }, [filters])

  const sharedCount = useMemo(
    () => colleges.filter((c) => isShared(c) && matches(c, { ...filters, sharedOnly: false })).length,
    [filters],
  )

  const anyFilter = statuses.size || vendors.size || states.size || sharedOnly || search
  const clearAll = () => {
    setStatuses(new Set())
    setVendors(new Set())
    setStates(new Set())
    setSharedOnly(false)
    setSearch('')
  }

  const onSort = useCallback((k: SortKey) => setSort((s) => nextSort(s, k)), [])
  const close = useCallback(() => setSelected(null), [])

  return (
    <div className="flex gap-4">
      <aside className="sticky top-[76px] h-[calc(100vh-96px)] w-56 shrink-0 overflow-y-auto border border-line bg-white text-sm">
        <div className="border-b border-line p-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or city"
            className="w-full rounded border border-line bg-paper px-2 py-1.5 text-sm outline-none transition-colors duration-150 placeholder:text-stone-400 focus:border-teal"
            aria-label="Search name or city"
          />
        </div>

        <RailSection title="Status">
          {STATUSES.map((s) => (
            <CheckRow
              key={s}
              label={s}
              count={facetCounts.status.get(s) ?? 0}
              checked={statuses.has(s)}
              onChange={() => setStatuses((cur) => toggle(cur, s))}
              swatch={STATUS_COLORS[s]}
            />
          ))}
        </RailSection>

        <RailSection title="Platform">
          {VENDORS.map((v) => (
            <CheckRow
              key={v}
              label={v}
              count={facetCounts.vendor.get(v) ?? 0}
              checked={vendors.has(v)}
              onChange={() => setVendors((cur) => toggle(cur, v))}
            />
          ))}
        </RailSection>

        <RailSection
          title="State"
          action={states.size ? <button type="button" onClick={() => setStates(new Set())} className="text-xs font-normal normal-case tracking-normal text-teal hover:underline">clear</button> : null}
        >
          <div className="max-h-56 overflow-y-auto pr-1">
            {STATES.map((st) => (
              <CheckRow
                key={st}
                label={st}
                count={facetCounts.state.get(st) ?? 0}
                checked={states.has(st)}
                onChange={() => setStates((cur) => toggle(cur, st))}
              />
            ))}
          </div>
        </RailSection>

        <RailSection title="Shared district portal">
          <label className="flex cursor-pointer items-center justify-between gap-2 py-1">
            <span className="text-stone-700">Only shared portals <span className="text-stone-400">{fmt(sharedCount)}</span></span>
            <button
              type="button"
              role="switch"
              aria-checked={sharedOnly}
              onClick={() => setSharedOnly((v) => !v)}
              className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-150 ${sharedOnly ? 'bg-teal' : 'bg-stone-300'}`}
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white ${sharedOnly ? 'left-[18px]' : 'left-0.5'}`} />
            </button>
          </label>
        </RailSection>

        {anyFilter ? (
          <div className="p-3">
            <button type="button" onClick={clearAll} className="text-xs text-teal hover:underline">Clear all filters</button>
          </div>
        ) : null}
      </aside>

      <section className="min-w-0 flex-1">
        <div className="mb-3 flex h-8 items-center justify-between">
          <div className="flex items-baseline gap-3">
            <h1 className="text-base font-semibold text-navy">Colleges</h1>
            <span className="text-sm text-stone-600" data-testid="result-count">
              Showing <strong className="font-semibold text-ink">{fmt(rows.length)}</strong> of {fmt(colleges.length)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => exportCsv(rows)}
            className="rounded border border-navy px-3 py-1.5 text-sm font-medium text-navy transition-colors duration-150 hover:bg-navy hover:text-white"
          >
            Export view to CSV
          </button>
        </div>
        <CollegeTable
          rows={rows}
          sort={sort}
          onSort={onSort}
          onRowClick={setSelected}
          selectedId={selected?.unitid}
          height="calc(100vh - 140px)"
        />
      </section>

      <CollegeDrawer college={selected} onClose={close} />
    </div>
  )
}

function RailSection({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="border-b border-line p-3">
      <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-stone-500">
        {title}
        {action}
      </div>
      {children}
    </div>
  )
}

function CheckRow({ label, count, checked, onChange, swatch }: { label: string; count: number; checked: boolean; onChange: () => void; swatch?: string }) {
  return (
    <label className={`flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-[13px] leading-tight transition-colors duration-150 hover:bg-paper ${count === 0 && !checked ? 'text-stone-400' : 'text-stone-700'}`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="shrink-0 accent-teal" />
      {swatch && <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: swatch }} />}
      <span className="min-w-0 flex-1">{label}</span>
      <span className="shrink-0 text-xs text-stone-400">{fmt(count)}</span>
    </label>
  )
}
