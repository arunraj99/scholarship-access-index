import { memo, useEffect, useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { portalUrl, type College } from './data'
import type { SortKey, SortState } from './lib'
import { StatusPill } from './StatusPill'

const GRID = 'minmax(200px,2.2fr) 56px 168px minmax(120px,1.3fr) minmax(150px,1.6fr) minmax(110px,1.3fr)'
const MIN_W = 804
const HEADER_H = 36
const ROW_H = 44
const GROUP_H = 32
const EM_SPACE = '\u2003'

type Item = { kind: 'group'; label: string; count: number } | { kind: 'row'; college: College }

interface Props {
  rows: College[]
  sort: SortState
  onSort: (key: SortKey) => void
  onRowClick: (c: College) => void
  selectedId?: string
  groupByVendor?: string[]
  height?: string
}

export function CollegeTable({ rows, sort, onSort, onRowClick, selectedId, groupByVendor, height = 'calc(100vh - 9rem)' }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const items = useMemo<Item[]>(() => {
    if (!groupByVendor) return rows.map((college) => ({ kind: 'row', college }))
    const out: Item[] = []
    for (const vendor of groupByVendor) {
      const group = rows.filter((r) => r.vendor === vendor)
      if (!group.length) continue
      out.push({ kind: 'group', label: vendor, count: group.length })
      for (const college of group) out.push({ kind: 'row', college })
    }
    return out
  }, [rows, groupByVendor])

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (i) => (items[i].kind === 'group' ? GROUP_H : ROW_H),
    getItemKey: (i) => {
      const it = items[i]
      return it.kind === 'group' ? `g:${it.label}` : it.college.unitid
    },
    overscan: 12,
    scrollMargin: HEADER_H,
  })

  useEffect(() => {
    virtualizer.measure()
    scrollRef.current?.scrollTo({ top: 0 })
  }, [items, virtualizer])

  return (
    <div ref={scrollRef} className="overflow-auto border border-line bg-white" style={{ height }}>
      <div
        className="sticky top-0 z-10 grid items-center border-b border-line bg-paper text-[11px] font-semibold uppercase tracking-wide text-stone-500"
        style={{ gridTemplateColumns: GRID, height: HEADER_H, minWidth: MIN_W }}
      >
        <SortHeader label="College" k="name" sort={sort} onSort={onSort} />
        <SortHeader label="State" k="state" sort={sort} onSort={onSort} />
        <div className="px-3">Status</div>
        <div className="px-3">Platform</div>
        <div className="px-3">Portal</div>
        <div className="px-3">System</div>
      </div>

      {items.length === 0 ? (
        <div className="px-3 py-10 text-center text-sm text-stone-500">No colleges match these filters.</div>
      ) : (
        <div className="relative" style={{ height: virtualizer.getTotalSize(), minWidth: MIN_W }}>
          {virtualizer.getVirtualItems().map((v) => {
            const it = items[v.index]
            const top = v.start - HEADER_H
            if (it.kind === 'group') {
              return (
                <div
                  key={v.key}
                  className="absolute inset-x-0 flex items-center gap-2 border-b border-line bg-[#EFEDE8] px-3 text-xs font-semibold text-navy"
                  style={{ height: GROUP_H, transform: `translateY(${top}px)` }}
                >
                  {it.label}
                  <span className="font-normal text-stone-500">{it.count}</span>
                </div>
              )
            }
            return (
              <Row
                key={v.key}
                c={it.college}
                top={top}
                selected={it.college.unitid === selectedId}
                onClick={onRowClick}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function SortHeader({ label, k, sort, onSort }: { label: string; k: SortKey; sort: SortState; onSort: (k: SortKey) => void }) {
  const active = sort.key === k
  return (
    <button
      type="button"
      onClick={() => onSort(k)}
      className={`flex h-full items-center gap-1 px-3 text-left uppercase tracking-wide transition-colors duration-150 hover:text-navy ${active ? 'text-navy' : ''}`}
      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      {label}
      <span className={active ? 'text-teal' : 'text-stone-300'}>{active && sort.dir === 'desc' ? '▼' : '▲'}</span>
    </button>
  )
}

const Row = memo(function Row({ c, top, selected, onClick }: { c: College; top: number; selected: boolean; onClick: (c: College) => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(c)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick(c)
      }}
      className={`absolute inset-x-0 grid cursor-pointer items-center border-b border-line text-[13px] transition-colors duration-150 hover:bg-paper ${selected ? 'bg-teal/10' : ''}`}
      style={{ gridTemplateColumns: GRID, height: ROW_H, transform: `translateY(${top}px)` }}
    >
      <div className="min-w-0 px-3 leading-tight">
        <div className="truncate font-medium" title={c.name}>{c.name}</div>
        <div className="truncate text-xs text-stone-500">{c.city}, {c.state}</div>
      </div>
      <div className="px-3">{c.state}</div>
      <div className="px-3"><StatusPill status={c.status} /></div>
      <div className="truncate px-3" title={c.vendor || undefined}>{c.vendor || EM_SPACE}</div>
      <div className="min-w-0 truncate px-3">
        {c.portal ? (
          <a
            href={portalUrl(c)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-teal transition-colors duration-150 hover:text-navy hover:underline"
            title={c.portal}
          >
            {c.portal}
          </a>
        ) : null}
      </div>
      <div className="truncate px-3 text-stone-500" title={c.system || undefined}>{c.system}</div>
    </div>
  )
})
