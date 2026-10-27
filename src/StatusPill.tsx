import type { Status } from './data'

export const STATUS_STYLES: Record<Status, string> = {
  'AwardSpring customer': 'bg-teal-100 text-teal-800 ring-teal-300',
  Competitor: 'bg-amber-100 text-amber-800 ring-amber-300',
  'No platform found': 'bg-slate-200 text-slate-700 ring-slate-300',
}

export function StatusPill({ status }: { status: Status }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  )
}
