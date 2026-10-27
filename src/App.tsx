import { useEffect, useState } from 'react'
import { CollegesPage } from './pages/Colleges'
import { OpportunityPage } from './pages/Opportunity'

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
    const onHash = () => {
      setPage(currentPage())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed inset-x-0 top-0 z-30 flex h-12 items-center justify-between bg-navy px-5 text-white">
        <span className="text-sm font-semibold tracking-tight">Scholarship Access Index</span>
        <span className="text-xs text-white/80">Built by Arun Raju Nandyala · October 2026</span>
      </header>

      <nav className="fixed bottom-0 left-0 top-12 z-20 w-44 border-r border-line bg-white py-3">
        {PAGES.map((p) => (
          <a
            key={p.id}
            href={`#/${p.id}`}
            className={`block border-l-2 px-4 py-2 text-sm transition-colors duration-150 ${
              page === p.id
                ? 'border-teal bg-paper font-medium text-navy'
                : 'border-transparent text-stone-600 hover:bg-paper hover:text-navy'
            }`}
          >
            {p.label}
          </a>
        ))}
      </nav>

      <div className="ml-44 flex min-w-0 flex-1 flex-col pt-12">
        <main className="flex-1 p-5">
          {page === 'colleges' && <CollegesPage />}
          {page === 'opportunity' && <OpportunityPage />}
          {(page === 'overview' || page === 'method') && <p className="text-sm text-stone-500">Coming next.</p>}
        </main>
        <footer className="border-t border-line px-5 py-3 text-xs text-stone-500">
          Independent analysis built from public sources: IPEDS HD2023 and public college websites. Not affiliated with, endorsed by, or produced by any software vendor named in this analysis.
        </footer>
      </div>
    </div>
  )
}
