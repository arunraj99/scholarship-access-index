import { Bar, BarChart, Cell, LabelList, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { colleges, rankBy } from '../data'
import { fmt } from '../lib'
import { StatCard } from '../StatCard'

const onPlatform = colleges.filter((c) => c.status !== 'No platform found')
const noPlatform = colleges.filter((c) => c.status === 'No platform found')
const byVendor = rankBy(onPlatform, 'vendor')
const topStates = rankBy(noPlatform, 'state').slice(0, 15)

const VENDOR_COLORS: Record<string, string> = {
  AwardSpring: '#2E8B8B',
  'Blackbaud Award Management': '#B8860B',
  'NextGen Scholarship Manager': '#D4A84A',
  ScholarshipUniverse: '#E6CD8F',
}

const HOW_TO_READ = [
  'Every row is a US public 2-year college from IPEDS HD2023, the federal institutional directory.',
  "A college is marked as running a platform only when its own scholarship portal was found on that vendor's domain, or it shares a portal with other campuses in the same state or system.",
  `"No platform found" is based on confirmed negative evidence, not just absence: 435 direct portal probes were run, and a non-customer returns the vendor's own marketing page rather than a portal.`,
  'Private nonprofit and sub-2-year technical schools are excluded. The same method found 1 platform across 424 such campuses, so they are not in this market.',
]

const tooltipStyle = { border: '1px solid #E2E0DA', borderRadius: 4, boxShadow: 'none', fontSize: 12, fontVariantNumeric: 'tabular-nums' }

export function OverviewPage() {
  return (
    <div className="max-w-[1200px]">
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Total campuses" value={fmt(colleges.length)} note="US public 2-year, IPEDS HD2023" />
        <StatCard label="On a platform" value={fmt(onPlatform.length)} note="identifiable scholarship platform" />
        <StatCard label="No platform" value={fmt(noPlatform.length)} note="confirmed negative evidence" />
        <StatCard label="Estimated buying entities" value="~845" note="estimate, see Method" />
      </div>

      <p className="mt-3 text-sm text-stone-700">
        893 US public 2-year colleges. 485 of them run no identifiable scholarship platform.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <section className="border border-line bg-white p-4">
          <h2 className="text-sm font-semibold text-navy">The {fmt(onPlatform.length)} on a platform, by platform</h2>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <div className="relative h-[190px] w-[190px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byVendor}
                    dataKey="count"
                    nameKey="value"
                    innerRadius={54}
                    outerRadius={88}
                    paddingAngle={1}
                    stroke="#fff"
                    isAnimationActive={false}
                  >
                    {byVendor.map((v) => <Cell key={v.value} fill={VENDOR_COLORS[v.value] ?? '#64748B'} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(n) => [fmt(Number(n)), 'campuses']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-semibold text-navy">{fmt(onPlatform.length)}</span>
                <span className="text-[11px] text-stone-500">campuses</span>
              </div>
            </div>
            <ul className="min-w-[200px] flex-1 text-[13px]">
              {byVendor.map((v) => (
                <li key={v.value} className="flex items-center gap-2 border-b border-line py-1.5 last:border-b-0">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: VENDOR_COLORS[v.value] }} />
                  <span className="min-w-0 flex-1 leading-tight">{v.value}</span>
                  <span className="shrink-0 font-medium">{fmt(v.count)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3 border border-line bg-[#EFEDE8] p-3 text-[13px] leading-relaxed text-stone-700">
            <strong className="font-semibold text-ink">Detection floor.</strong> This analysis identifies 189 AwardSpring
            campuses. AwardSpring states publicly that it serves about 300 two-year colleges. Both can be true: this
            method only confirms a customer when its portal is reachable and verifiable from public pages, so it
            undercounts every vendor. 189 is a detection floor, not a customer count. The 485 'no platform' figure is
            the stronger number, because it rests on confirmed negative evidence rather than on absence of evidence.
          </div>
        </section>

        <section className="border border-line bg-white p-4">
          <h2 className="text-sm font-semibold text-navy">Top 15 states by colleges with no platform found</h2>
          <div className="mt-2 h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topStates} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 0 }} barCategoryGap={4}>
                <XAxis type="number" hide domain={[0, 'dataMax']} />
                <YAxis type="category" dataKey="value" width={36} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#1A1A1A' }} interval={0} />
                <Tooltip cursor={{ fill: '#F7F6F3' }} contentStyle={tooltipStyle} formatter={(n) => [fmt(Number(n)), 'No platform found']} />
                <Bar dataKey="count" fill="#64748B" isAnimationActive={false}>
                  <LabelList dataKey="count" position="right" style={{ fontSize: 12, fill: '#1A1A1A' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="mt-4 border border-line bg-white p-4">
        <h2 className="text-sm font-semibold text-navy">How to read this</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-stone-700">
          {HOW_TO_READ.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </section>
    </div>
  )
}
