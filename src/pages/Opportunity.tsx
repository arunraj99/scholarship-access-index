import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { colleges, COMPETITORS, isRuralOrTown, rankBy, type College } from '../data'
import { exportCsv, fmt, nextSort, sortRows, type SortKey, type SortState } from '../lib'
import { CollegeTable } from '../CollegeTable'
import { CollegeDrawer } from '../CollegeDrawer'
import { StatCard } from '../StatCard'

const noPlatform = colleges.filter((c) => c.status === 'No platform found')
const competitor = colleges.filter((c) => c.status === 'Competitor')

type Tab = 'none' | 'competitor'

export function OpportunityPage() {
  const [tab, setTab] = useState<Tab>('none')

  return (
    <div>
      <div className="mb-4 flex items-end justify-between border-b border-line">
        <div className="flex gap-1" role="tablist">
          <TabButton active={tab === 'none'} onClick={() => setTab('none')}>No platform ({fmt(noPlatform.length)})</TabButton>
          <TabButton active={tab === 'competitor'} onClick={() => setTab('competitor')}>On a competitor ({fmt(competitor.length)})</TabButton>
        </div>
      </div>
      {tab === 'none' ? <NoPlatformTab /> : <CompetitorTab />}
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`-mb-px border-b-2 px-3 py-2 text-sm transition-colors duration-150 ${active ? 'border-teal font-medium text-navy' : 'border-transparent text-stone-500 hover:text-navy'}`}
    >
      {children}
    </button>
  )
}

function useTableState() {
  const [sort, setSort] = useState<SortState>({ key: 'name', dir: 'asc' })
  const [selected, setSelected] = useState<College | null>(null)
  const onSort = useCallback((k: SortKey) => setSort((s) => nextSort(s, k)), [])
  const close = useCallback(() => setSelected(null), [])
  return { sort, onSort, selected, setSelected, close }
}

function NoPlatformTab() {
  const [state, setState] = useState<string | null>(null)
  const t = useTableState()

  const byState = useMemo(() => rankBy(noPlatform, 'state'), [])
  const max = byState[0]?.count ?? 1
  const rural = useMemo(() => noPlatform.filter(isRuralOrTown).length, [])
  const rows = useMemo(
    () => sortRows(state ? noPlatform.filter((c) => c.state === state) : noPlatform, t.sort),
    [state, t.sort],
  )

  return (
    <>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <StatCard label="Colleges with no platform" value={fmt(noPlatform.length)} />
        <StatCard label="States" value={fmt(byState.length)} note="with at least one no-platform college" />
        <StatCard label="Rural or town locale" value={fmt(rural)} note="IPEDS locale Fringe, Distant or Remote" />
      </div>

      <div className="mb-4 border border-line bg-white">
        <div className="flex h-9 items-center justify-between border-b border-line px-3 text-[11px] font-semibold uppercase tracking-wide text-stone-500">
          <span>By state · click a row to filter the list below</span>
          {state && (
            <button type="button" onClick={() => setState(null)} className="text-xs font-normal normal-case tracking-normal text-teal hover:underline">
              clear
            </button>
          )}
        </div>
        <div
          className="grid grid-flow-col grid-cols-3 gap-x-6 px-3 py-1"
          style={{ gridTemplateRows: `repeat(${Math.ceil(byState.length / 3)}, 28px)` }}
        >
          {byState.map(({ value, count }) => (
            <button
              key={value}
              type="button"
              onClick={() => setState((s) => (s === value ? null : value))}
              aria-pressed={state === value}
              className={`grid h-7 grid-cols-[36px_36px_1fr] items-center gap-2 rounded px-1 text-left text-[13px] transition-colors duration-150 ${state === value ? 'bg-teal/10 font-semibold text-navy' : 'hover:bg-paper'}`}
            >
              <span>{value}</span>
              <span className="text-right">{count}</span>
              <span className="h-2.5 bg-[#E2E0DA]">
                <span className="block h-full bg-slate" style={{ width: `${(count / max) * 100}%` }} />
              </span>
            </button>
          ))}
        </div>
      </div>

      <TableToolbar shown={rows.length} total={noPlatform.length} filterLabel={state} onClear={() => setState(null)} rows={rows} />
      <CollegeTable rows={rows} sort={t.sort} onSort={t.onSort} onRowClick={t.setSelected} selectedId={t.selected?.unitid} height="calc(100vh - 140px)" />
      <CollegeDrawer college={t.selected} onClose={t.close} />
    </>
  )
}

function CompetitorTab() {
  const [vendor, setVendor] = useState<string | null>(null)
  const t = useTableState()

  const counts = useMemo(() => new Map(rankBy(competitor, 'vendor').map((v) => [v.value, v.count])), [])
  const rows = useMemo(() => {
    const sorted = sortRows(vendor ? competitor.filter((c) => c.vendor === vendor) : competitor, t.sort)
    return COMPETITORS.flatMap((v) => sorted.filter((c) => c.vendor === v))
  }, [vendor, t.sort])

  return (
    <>
      <div className="mb-4 grid grid-cols-3 gap-3">
        {COMPETITORS.map((v) => (
          <StatCard
            key={v}
            label={v}
            value={fmt(counts.get(v) ?? 0)}
            note={vendor === v ? 'Filtering the list · click to clear' : 'campuses · click to filter'}
            onClick={() => setVendor((cur) => (cur === v ? null : v))}
            active={vendor === v}
          />
        ))}
      </div>

      <TableToolbar shown={rows.length} total={competitor.length} filterLabel={vendor} onClear={() => setVendor(null)} rows={rows} />
      <CollegeTable
        rows={rows}
        sort={t.sort}
        onSort={t.onSort}
        onRowClick={t.setSelected}
        selectedId={t.selected?.unitid}
        groupByVendor={COMPETITORS}
        height="calc(100vh - 140px)"
      />
      <CollegeDrawer college={t.selected} onClose={t.close} />
    </>
  )
}

function TableToolbar({ shown, total, filterLabel, onClear, rows }: { shown: number; total: number; filterLabel: string | null; onClear: () => void; rows: College[] }) {
  return (
    <div className="mb-3 flex h-8 items-center justify-between">
      <div className="flex items-center gap-3 text-sm text-stone-600">
        <span data-testid="result-count">
          Showing <strong className="font-semibold text-ink">{fmt(shown)}</strong> of {fmt(total)}
        </span>
        {filterLabel && (
          <span className="inline-flex items-center gap-1 rounded-full border border-teal bg-teal/5 px-2 py-0.5 text-xs text-navy">
            {filterLabel}
            <button type="button" onClick={onClear} className="text-stone-500 hover:text-ink" aria-label={`Clear ${filterLabel} filter`}>×</button>
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => exportCsv(rows)}
        className="rounded border border-navy px-3 py-1.5 text-sm font-medium text-navy transition-colors duration-150 hover:bg-navy hover:text-white"
      >
        Export view to CSV
      </button>
    </div>
  )
}
