import type { ReactNode } from 'react'

interface Props {
  label: string
  value: ReactNode
  note?: ReactNode
  onClick?: () => void
  active?: boolean
}

export function StatCard({ label, value, note, onClick, active }: Props) {
  const body = (
    <>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-navy">{value}</div>
      {note && <div className="mt-0.5 text-xs text-stone-500">{note}</div>}
    </>
  )
  const base = 'border bg-white px-4 py-3 text-left'
  if (!onClick) return <div className={`${base} border-line`}>{body}</div>
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`${base} transition-colors duration-150 ${active ? 'border-teal bg-teal/5 outline outline-1 outline-teal' : 'border-line hover:border-stone-400'}`}
    >
      {body}
    </button>
  )
}
