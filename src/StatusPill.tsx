import type { Status } from './data'

export const STATUS_COLORS: Record<Status, string> = {
  'AwardSpring customer': '#2E8B8B',
  Competitor: '#B8860B',
  'No platform found': '#64748B',
}

export function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium leading-4 text-white"
      style={{ backgroundColor: STATUS_COLORS[status] }}
    >
      {status}
    </span>
  )
}
