import { ArrowRight } from 'lucide-react'
import { colleges } from '../data'
import { accounts, callFirst } from '../callList'
import { fmt } from '../lib'
import { Callout, Card, PageTitle } from '../Callout'

const as = colleges.filter((c) => c.status === 'AwardSpring customer').length
const comp = colleges.filter((c) => c.status === 'Competitor').length
const none = colleges.filter((c) => c.status === 'No platform found').length
const withPeer = accounts.filter((a) => Number(a.awardspring_peers_in_state) > 0).length

const GO = [
  { href: '#/plan', label: '90 day plan', note: 'What I would do, in order, against your three numbers' },
  { href: '#/calls', label: 'Call list', note: `${fmt(accounts.length)} accounts ranked, ${callFirst.length} to call first, pipeline model` },
  { href: '#/experiments', label: 'Experiments', note: 'Three tests written in your format, with holdouts' },
  { href: '#/engine', label: 'Lead engine', note: 'The spec I would hand the GTM Engineer' },
  { href: '#/overview', label: 'Market research', note: 'The census behind all of it, with method and limits' },
]

export function StartPage() {
  return (
    <div className="max-w-[1100px]">
      <PageTitle
        title="Start here"
        sub="I mapped every public two-year college in the US, found the ones running no scholarship platform, and turned that into the first 90 days of the Head of Marketing & Demand Gen role: who to call, what to say, and how to prove it worked."
      />

      <div className="grid grid-cols-2 gap-3">
        <Callout big={<>{fmt(accounts.length)} colleges run no detectable platform. {callFirst.length} are ranked to call Monday.</>}>
          Each one comes with a peer proof line and the financial aid page to start from.
        </Callout>
        <Callout big="Every campaign ships with a holdout.">
          The {fmt(accounts.length)} are already split into matched treatment and holdout groups, so lift in first meetings is measured, not claimed.
        </Callout>
        <Callout big={<>{fmt(colleges.length)} colleges researched in two days, for under $10 of compute.</>}>
          By hand, that is roughly 220 SDR hours at 15 minutes a college. That's the case for the day 30 AI review, made before day 1.
        </Callout>
        <Callout big="A lead engine spec, ready for the GTM Engineer.">
          Find, verify, enrich, score, route and refresh, with the rules this project already learned the hard way.
        </Callout>
      </div>

      <Card title="This week, in three lines" className="mt-4">
        <dl className="grid grid-cols-[150px_1fr] gap-y-2 text-[14px] leading-relaxed">
          <dt className="font-semibold text-navy">What moved</dt>
          <dd>
            Mapped {fmt(colleges.length)} public two-year colleges: {fmt(as)} on AwardSpring, {fmt(comp)} on a competitor, {fmt(none)} with
            no detectable platform ({fmt(accounts.length)} still operating as separate colleges).
          </dd>
          <dt className="font-semibold text-navy">Why</dt>
          <dd>
            Most of the gap is in states where AwardSpring already has customers: {fmt(withPeer)} of the {fmt(accounts.length)} have AwardSpring peers in
            their state, which gives every call a peer proof line.
          </dd>
          <dt className="font-semibold text-navy">What changes next</dt>
          <dd>Start experiment 1 on Monday: a peer proof email before the SDR call, against a call-only holdout. Read it on day 21.</dd>
        </dl>
      </Card>

      <Card title="Where to look" className="mt-4">
        <ul className="divide-y divide-line">
          {GO.map((g) => (
            <li key={g.href}>
              <a href={g.href} className="group flex items-center gap-3 py-2.5 text-sm">
                <span className="w-40 shrink-0 font-medium text-navy group-hover:underline">{g.label}</span>
                <span className="flex-1 text-stone-600">{g.note}</span>
                <ArrowRight size={16} className="text-stone-400 group-hover:text-teal" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
