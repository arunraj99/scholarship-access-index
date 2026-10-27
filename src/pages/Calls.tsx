import { useMemo, useState } from 'react'
import Papa from 'papaparse'
import { accounts, callFirst, excluded, tierCount, groupCount, type Account } from '../callList'
import { fmt } from '../lib'
import { Callout, Card, PageTitle } from '../Callout'

const STATES = [...new Set(accounts.map((a) => a.state))].sort()
const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

function Input({ label, value, onChange, suffix, step = 1 }: { label: string; value: number; onChange: (n: number) => void; suffix?: string; step?: number }) {
  return (
    <label className="block text-[12px] text-stone-600">
      {label}
      <div className="mt-1 flex items-center border border-line bg-white focus-within:border-teal">
        {suffix === '$' && <span className="pl-2 text-stone-500">$</span>}
        <input
          type="number"
          min={0}
          step={step}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="w-full bg-transparent px-2 py-1.5 text-sm text-ink outline-none"
        />
        {suffix === '%' && <span className="pr-2 text-stone-500">%</span>}
      </div>
    </label>
  )
}

function PipelineModel() {
  const [scope, setScope] = useState<'all' | 'first'>('all')
  const [reach, setReach] = useState(40)
  const [meet, setMeet] = useState(15)
  const [opp, setOpp] = useState(50)
  const [acv, setAcv] = useState(4500)
  const n = scope === 'all' ? accounts.length : callFirst.length
  const meetings = n * (reach / 100) * (meet / 100)
  const opps = meetings * (opp / 100)
  const pipeline = opps * acv

  return (
    <Card title="Pipeline model">
      <div className="mb-3 flex gap-1 text-sm">
        {(['all', 'first'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setScope(s)}
            className={`rounded border px-3 py-1 ${scope === s ? 'border-teal bg-teal/10 font-medium text-navy' : 'border-line text-stone-600 hover:border-stone-400'}`}
          >
            {s === 'all' ? `All ${fmt(accounts.length)} accounts` : `Call first ${callFirst.length}`}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.3fr] items-end gap-3">
        <Input label="Reach a decision maker" value={reach} onChange={setReach} suffix="%" />
        <Input label="Reached who take a meeting" value={meet} onChange={setMeet} suffix="%" />
        <Input label="Meetings that become opportunities" value={opp} onChange={setOpp} suffix="%" />
        <Input label="Annual contract value" value={acv} onChange={setAcv} suffix="$" step={500} />
        <div className="border border-teal bg-teal/5 px-3 py-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">Pipeline created</div>
          <div className="text-2xl font-semibold text-navy">{money(pipeline)}</div>
          <div className="text-xs text-stone-500">{fmt(Math.round(meetings))} meetings · {fmt(Math.round(opps))} opportunities</div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-stone-500">
        The rates are placeholders, so replace them with your HubSpot funnel. The contract value default is AwardSpring's publicly listed Pro price of $4,500 a year
        (Capterra), which is probably below what a college pays. The model is here to show the method, not to forecast.
      </p>
    </Card>
  )
}

function exportRows(rows: Account[]) {
  const blob = new Blob([Papa.unparse(rows)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'call-list.csv'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const TIER_STYLE: Record<string, string> = {
  A: 'bg-teal text-white',
  B: 'bg-teal/15 text-navy',
  C: 'bg-stone-200 text-stone-700',
}

export function CallsPage() {
  const [firstOnly, setFirstOnly] = useState(true)
  const [tier, setTier] = useState<string>('')
  const [state, setState] = useState<string>('')
  const [showExcluded, setShowExcluded] = useState(false)

  const rows = useMemo(
    () => accounts.filter((a) => (!firstOnly || a.call_first === 'Yes') && (!tier || a.tier === tier) && (!state || a.state === state)),
    [firstOnly, tier, state],
  )

  return (
    <div className="max-w-[1300px]">
      <PageTitle
        title="Call list"
        sub={`Every operating college with no detectable scholarship platform, ranked by public signals. The top ${callFirst.length} are spread across states, at most eight per state, so the first week covers more than one territory.`}
      />

      <div className="grid grid-cols-3 gap-3">
        <Callout big={`${callFirst.length} accounts to call first`}>All Tier A. The biggest colleges in states where AwardSpring already has peers.</Callout>
        <Callout big={`Tier A ${tierCount('A')} · B ${tierCount('B')} · C ${tierCount('C')}`}>
          The score is size (0 to 3), plus 2 for an AwardSpring peer in the state, plus 1 if three or more campuses there already run a platform. A is 5 or more, B is 3 to 4, C is below 3.
        </Callout>
        <Callout big={`${groupCount('Treatment')} treatment · ${groupCount('Holdout')} holdout`}>
          Split at random within each tier, and fixed, so experiment 1 has a clean comparison. Holdout accounts are still called, just without the email first.
        </Callout>
      </div>

      <div className="mt-4">
        <PipelineModel />
      </div>

      <div className="mt-4 mb-3 flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={firstOnly} onChange={(e) => setFirstOnly(e.target.checked)} className="accent-teal" />
          Call first only
        </label>
        <select value={tier} onChange={(e) => setTier(e.target.value)} className="border border-line bg-white px-2 py-1">
          <option value="">All tiers</option>
          <option value="A">Tier A</option>
          <option value="B">Tier B</option>
          <option value="C">Tier C</option>
        </select>
        <select value={state} onChange={(e) => setState(e.target.value)} className="border border-line bg-white px-2 py-1">
          <option value="">All states</option>
          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="text-stone-600">
          Showing <strong className="text-ink">{fmt(rows.length)}</strong> of {fmt(accounts.length)}
        </span>
        <button
          type="button"
          onClick={() => exportRows(rows)}
          className="ml-auto rounded border border-navy px-3 py-1.5 font-medium text-navy hover:bg-navy hover:text-white"
        >
          Export view to CSV
        </button>
      </div>

      <div className="max-h-[70vh] overflow-auto border border-line bg-white">
        <table className="w-full border-collapse text-[13px]">
          <thead className="sticky top-0 bg-paper text-left text-[11px] uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-2 py-2">Tier</th>
              <th className="px-3 py-2">College</th>
              <th className="px-3 py-2">Enrollment</th>
              <th className="px-3 py-2">Opening line</th>
              <th className="px-3 py-2">Who to call</th>
              <th className="px-3 py-2">Group</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.unitid} className="border-t border-line align-top">
                <td className="px-3 py-2 text-stone-500">{a.rank}</td>
                <td className="px-2 py-2">
                  <span className={`inline-block w-6 rounded text-center text-xs font-semibold ${TIER_STYLE[a.tier]}`}>{a.tier}</span>
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium text-navy">{a.name}</div>
                  <div className="text-xs text-stone-500">{a.city}, {a.state}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-stone-600">{a.size}</td>
                <td className="max-w-[420px] px-3 py-2 text-stone-700">{a.first_touch}</td>
                <td className="px-3 py-2">
                  <div className="text-stone-700">{a.call_role}</div>
                  {a.financial_aid_page && (
                    <a href={a.financial_aid_page} target="_blank" rel="noreferrer" className="text-xs text-teal underline underline-offset-2">
                      Financial aid page
                    </a>
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-stone-600">{a.group}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-xs text-stone-500">
        <button type="button" onClick={() => setShowExcluded((v) => !v)} className="text-teal underline underline-offset-2">
          {showExcluded ? 'Hide' : 'Show'} the {excluded.length} no-platform colleges left off this list
        </button>
        {showExcluded && (
          <ul className="mt-2 list-disc space-y-0.5 pl-5">
            {excluded.map((e) => (
              <li key={e.unitid}>
                {e.name}, {e.state}: {e.reason}.
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
