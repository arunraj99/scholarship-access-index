import { useEffect, useState } from 'react'
import { FileText, LayoutDashboard, Table2, Target } from 'lucide-react'
import { CollegesPage } from './pages/Colleges'
import { OpportunityPage } from './pages/Opportunity'
import { OverviewPage } from './pages/Overview'
import { MethodPage } from './pages/Method'

const PAGES = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'colleges', label: 'Colleges', Icon: Table2 },
  { id: 'opportunity', label: 'Opportunity', Icon: Target },
  { id: 'method', label: 'Method', Icon: FileText },
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
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between bg-navy px-5 text-white">
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">Community College Scholarship Access Index</div>
          <div className="text-xs text-white/70">What 893 US public two-year colleges use to run their scholarship programs.</div>
        </div>
        <span className="text-xs text-white/80">Built by Arun Raju Nandyala · October 2026</span>
      </header>

      <nav className="fixed bottom-0 left-0 top-14 z-20 w-44 border-r border-line bg-white py-3">
        {PAGES.map((p) => (
          <a
            key={p.id}
            href={`#/${p.id}`}
            className={`flex items-center gap-2.5 border-l-2 px-4 py-2 text-sm transition-colors duration-150 ${
              page === p.id
                ? 'border-teal bg-paper font-medium text-navy'
                : 'border-transparent text-stone-600 hover:bg-paper hover:text-navy'
            }`}
          >
            <p.Icon size={18} aria-hidden="true" className="shrink-0" />
            {p.label}
          </a>
        ))}
      </nav>

      <div className="ml-44 flex min-w-0 flex-1 flex-col pt-14">
        <main className="flex-1 p-5">
          {page === 'colleges' && <CollegesPage />}
          {page === 'opportunity' && <OpportunityPage />}
          {page === 'overview' && <OverviewPage />}
          {page === 'method' && <MethodPage />}
        </main>
        <footer className="border-t border-line px-5 py-3 text-xs text-stone-500">
          Independent analysis built from public sources: IPEDS HD2023 and public college websites. Not affiliated with, endorsed by, or produced by any software vendor named in this analysis.
        </footer>
      </div>
    </div>
  )
}
