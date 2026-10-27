import { useEffect, useState } from 'react'
import { CalendarRange, Cpu, FileText, FlaskConical, LayoutDashboard, Phone, Sparkles, Table2, Target } from 'lucide-react'
import { CollegesPage } from './pages/Colleges'
import { OpportunityPage } from './pages/Opportunity'
import { OverviewPage } from './pages/Overview'
import { MethodPage } from './pages/Method'
import { StartPage } from './pages/Start'
import { PlanPage } from './pages/Plan'
import { CallsPage } from './pages/Calls'
import { ExperimentsPage } from './pages/Experiments'
import { EnginePage } from './pages/Engine'

const PAGES = [
  { id: 'start', label: 'Start here', Icon: Sparkles, group: 'Plan' },
  { id: 'plan', label: '90 day plan', Icon: CalendarRange, group: 'Plan' },
  { id: 'calls', label: 'Call list', Icon: Phone, group: 'Plan' },
  { id: 'experiments', label: 'Experiments', Icon: FlaskConical, group: 'Plan' },
  { id: 'engine', label: 'Lead engine', Icon: Cpu, group: 'Plan' },
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard, group: 'Market research' },
  { id: 'colleges', label: 'Colleges', Icon: Table2, group: 'Market research' },
  { id: 'opportunity', label: 'Opportunity', Icon: Target, group: 'Market research' },
  { id: 'method', label: 'Method', Icon: FileText, group: 'Market research' },
] as const
const GROUPS = ['Plan', 'Market research'] as const
type PageId = (typeof PAGES)[number]['id']

function currentPage(): PageId {
  const h = window.location.hash.replace(/^#\/?/, '')
  return PAGES.some((p) => p.id === h) ? (h as PageId) : 'start'
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
          <div className="text-xs text-white/70">Who runs what across 893 US public two-year colleges, and a 90 day plan to turn it into pipeline.</div>
        </div>
        <span className="text-xs text-white/80">Built by Arun Raju Nandyala · October 2026</span>
      </header>

      <nav className="fixed bottom-0 left-0 top-14 z-20 w-48 overflow-y-auto border-r border-line bg-white py-3">
        {GROUPS.map((g) => (
          <div key={g} className="mb-3">
            <div className="px-4 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">{g}</div>
        {PAGES.filter((p) => p.group === g).map((p) => (
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
          </div>
        ))}
      </nav>

      <div className="ml-48 flex min-w-0 flex-1 flex-col pt-14">
        <main className="flex-1 p-5">
          {page === 'colleges' && <CollegesPage />}
          {page === 'opportunity' && <OpportunityPage />}
          {page === 'overview' && <OverviewPage />}
          {page === 'method' && <MethodPage />}
          {page === 'start' && <StartPage />}
          {page === 'plan' && <PlanPage />}
          {page === 'calls' && <CallsPage />}
          {page === 'experiments' && <ExperimentsPage />}
          {page === 'engine' && <EnginePage />}
        </main>
        <footer className="border-t border-line px-5 py-3 text-xs text-stone-500">
          Independent analysis built from public sources: IPEDS HD2023 and public college websites. Not affiliated with, endorsed by, or produced by any software vendor named in this analysis.
        </footer>
      </div>
    </div>
  )
}
