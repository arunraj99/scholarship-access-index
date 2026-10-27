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
  { href: '#/plan', label: '90 day plan', note: "What I'd do first, in order" },
  { href: '#/calls', label: 'Call list', note: `${fmt(accounts.length)} colleges ranked, ${callFirst.length} to call first, and what they could add to pipeline` },
  { href: '#/experiments', label: 'Experiments', note: "The first three tests I'd run" },
  { href: '#/engine', label: 'Lead engine', note: "How I'd work with your GTM Engineer" },
  { href: '#/overview', label: 'Market research', note: 'The census behind all of it, how I built it, and its limits' },
]

export function StartPage() {
  return (
    <div className="max-w-[1100px]">
      <PageTitle
        title="Start here"
        sub="I wanted to see how far AwardSpring's lead in community colleges could go, so I mapped every public two-year college in the US and found the ones with no scholarship platform. This is what I'd do with that in my first 90 days: who we call, what we say, and how we know it worked."
      />

      <div className="grid grid-cols-2 gap-3">
        <Callout big={<>{fmt(accounts.length)} operating colleges have no scholarship platform I could detect. I'd start calling {callFirst.length} of them on Monday.</>}>
          Each one comes with a line naming AwardSpring colleges near it, and the page to start from.
        </Callout>
        <Callout big="I'd hold back a control group on every campaign.">
          The {fmt(accounts.length)} are already split in two at random. That way we know what a campaign actually added, not just what happened while it ran.
        </Callout>
        <Callout big={<>I researched {fmt(colleges.length)} colleges in two days, for under $10 of compute.</>}>
          By hand, that's roughly 220 hours of SDR time at 15 minutes a college. I'd rather the team spent those hours on calls.
        </Callout>
        <Callout big="I wrote down how I'd build the lead engine with your GTM Engineer.">
          Find, verify, enrich, score, route and refresh, using the rules I learned the hard way building this.
        </Callout>
      </div>

      <Card title="Where things stand, in three lines" className="mt-4">
        <dl className="grid grid-cols-[150px_1fr] gap-y-2 text-[14px] leading-relaxed">
          <dt className="font-semibold text-navy">What moved</dt>
          <dd>
            I mapped {fmt(colleges.length)} public two-year colleges: {fmt(as)} on AwardSpring, {fmt(comp)} on a competitor, and {fmt(none)} with no
            platform I could detect. {fmt(accounts.length)} of those {fmt(none)} still operate as separate colleges today.
          </dd>
          <dt className="font-semibold text-navy">Why it matters</dt>
          <dd>
            Most of the gap sits where AwardSpring already has customers. {fmt(withPeer)} of the {fmt(accounts.length)} have an AwardSpring college in
            their own state, so every call can open with a peer they know.
          </dd>
          <dt className="font-semibold text-navy">What I'd do next</dt>
          <dd>Send a peer email before the SDR call to half the list, call the other half without it, and read the difference after three weeks.</dd>
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
