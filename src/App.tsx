import { useEffect, useState } from 'react'
import { colleges, countBy, STATUSES } from './data'
import { StatusPill } from './StatusPill'

const PAGES = [
  { id: 'overview', label: 'Overview' },
  { id: 'colleges', label: 'Colleges' },
  { id: 'opportunity', label: 'Opportunity' },
  { id: 'method', label: 'Method' },
] as const
type PageId = (typeof PAGES)[number]['id']

function currentPage(): PageId {
  const h = window.location.hash.replace(/^#\/?/, '')
  return PAGES.some((p) => p.id === h) ? (h as PageId) : 'overview'
}

export default function App() {
  const [page, setPage] = useState<PageId>(currentPage)

  useEffect(() => {
    const onHash = () => setPage(currentPage())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed inset-x-0 top-0 z-20 flex h-12 items-center justify-between bg-navy px-5 text-white">
        <span className="text-sm font-semibold tracking-tight">Scholarship Access Index</span>
        <span className="text-xs text-white/80">Built by Arun Raju Nandyala · October 2026</span>
      </header>

      <nav className="fixed bottom-0 left-0 top-12 z-10 w-48 border-r border-stone-200 bg-white py-4">
        {PAGES.map((p) => (
          <a
            key={p.id}
            href={`#/${p.id}`}
            className={`block border-l-2 px-4 py-2 text-sm ${
              page === p.id
                ? 'border-teal bg-paper font-medium text-navy'
                : 'border-transparent text-stone-600 hover:bg-paper hover:text-navy'
            }`}
          >
            {p.label}
          </a>
        ))}
      </nav>

      <div className="ml-48 flex flex-1 flex-col pt-12">
        <main className="flex-1 p-6">
          <DataCheck />
        </main>
        <footer className="border-t border-stone-200 px-6 py-3 text-xs text-stone-500">
          Independent analysis built from public sources: IPEDS HD2023 and public college websites. Not affiliated with, endorsed by, or produced by any software vendor named in this analysis.
        </footer>
      </div>
    </div>
  )
}

function DataCheck() {
  const byStatus = countBy(colleges, 'status')
  return (
    <div className="max-w-xl">
      <h1 className="mb-4 text-lg font-semibold text-navy">Data check</h1>
      <table className="w-full border border-stone-200 bg-white text-sm">
        <tbody>
          {STATUSES.map((s) => (
            <tr key={s} className="border-b border-stone-200">
              <td className="px-3 py-2"><StatusPill status={s} /></td>
              <td className="px-3 py-2 text-right font-medium">{byStatus.get(s) ?? 0}</td>
            </tr>
          ))}
          <tr>
            <td className="px-3 py-2 font-semibold">Total</td>
            <td className="px-3 py-2 text-right font-semibold">{colleges.length}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
