import { useEffect, useState } from 'react'
import { COLUMNS, FIELD_LABELS, portalUrl, type College } from './data'
import { StatusPill } from './StatusPill'

export function CollegeDrawer({ college, onClose }: { college: College | null; onClose: () => void }) {
  const [shown, setShown] = useState<College | null>(college)
  const open = college !== null

  useEffect(() => {
    if (college) setShown(college)
  }, [college])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-ink/30 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        data-testid="drawer-backdrop"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={shown?.name}
        className={`absolute bottom-0 right-0 top-0 flex w-[480px] flex-col border-l border-line bg-white transition-transform duration-200 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {shown && (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
              <div className="min-w-0">
                <h2 className="text-base font-semibold leading-snug text-navy">{shown.name}</h2>
                <p className="mt-0.5 text-sm text-stone-500">{shown.city}, {shown.state}</p>
                <div className="mt-2"><StatusPill status={shown.status} /></div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded px-2 py-1 text-lg leading-none text-stone-400 transition-colors duration-150 hover:bg-paper hover:text-ink"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <dl className="flex-1 overflow-y-auto px-5 py-2 text-sm">
              {COLUMNS.map((k) => (
                <div key={k} className="grid grid-cols-[150px_1fr] gap-3 border-b border-line py-2 last:border-b-0">
                  <dt className="text-stone-500">{FIELD_LABELS[k]}</dt>
                  <dd className="min-w-0 break-words">{shown[k] || <span className="text-stone-300">—</span>}</dd>
                </div>
              ))}
            </dl>

            <div className="flex gap-2 border-t border-line px-5 py-4">
              {shown.website ? (
                <a
                  href={shown.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded bg-navy px-3 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-navy/90"
                >
                  Visit college website
                </a>
              ) : (
                <span className="cursor-not-allowed rounded bg-stone-200 px-3 py-2 text-sm font-medium text-stone-500" title="No website listed in IPEDS">
                  Visit college website
                </span>
              )}
              {shown.portal && (
                <a
                  href={portalUrl(shown)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-teal px-3 py-2 text-sm font-medium text-teal transition-colors duration-150 hover:bg-teal hover:text-white"
                >
                  Open scholarship portal
                </a>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
