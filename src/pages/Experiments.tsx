import { colleges } from '../data'
import { accounts, groupCount } from '../callList'
import { fmt } from '../lib'
import { Callout, PageTitle } from '../Callout'

// Manchester Community College (CT, 129695) merged into Connecticut State Community College during 2023.
const competitorLive = colleges.filter((c) => c.status === 'Competitor' && c.unitid !== '129695').length

const EXPERIMENTS = [
  {
    id: '1',
    name: 'Peer proof email before the call',
    rows: [
      ['Hypothesis', 'An email naming AwardSpring peers in the same state, sent two days before the SDR call, raises first meetings held.'],
      ['Audience', `The ${fmt(accounts.length)} operating colleges with no detectable platform. ${groupCount('Treatment')} treatment, ${groupCount('Holdout')} holdout, split at random within each tier.`],
      ['Treatment vs holdout', 'Treatment: email on day 0, call on day 2. Holdout: call on day 2, no email. Every account still gets called.'],
      ['Metric', 'First meetings held per 100 accounts.'],
      ['Read date', 'Day 21 after launch.'],
      ['Kill rule', 'Stop the email if treatment does not reach 1.5 times the holdout rate, or if unsubscribes pass 2%.'],
    ],
    note: 'About 240 accounts per group can only show a big lift. If it reads as a tie, it is reported as a tie.',
  },
  {
    id: '2',
    name: 'Switching offer for competitor campuses',
    rows: [
      ['Hypothesis', 'Campuses on another platform respond to a concrete switching offer (we move your scholarships and past data over) more than to a general product email.'],
      ['Audience', `The ${fmt(competitorLive)} operating campuses on a competitor. Split by portal, not campus, so a district sharing one portal is never in both groups.`],
      ['Treatment vs holdout', 'Treatment: switching offer email plus call. Holdout: standard product email plus call.'],
      ['Metric', 'First meetings held per 100 accounts.'],
      ['Read date', 'Day 45, because switching has a longer cycle.'],
      ['Kill rule', 'If there is no difference by day 45, drop the offer. SDRs then ask for renewal dates and the list is re-timed around those instead.'],
    ],
    note: 'The list comes from the Opportunity page, grouped by platform.',
  },
  {
    id: '3',
    name: 'Paid media with a state holdout',
    rows: [
      ['Hypothesis', 'Paid ads aimed at financial aid and foundation staff create meetings that would not have happened anyway.'],
      ['Audience', 'States paired by number of target accounts. In each pair one state gets ads and the other stays dark. A coin flip decides which.'],
      ['Treatment vs holdout', 'Same SDR effort in both arms. Only the ads differ.'],
      ['Metric', 'First meetings held per account, exposed states vs dark states. Platform-reported conversions are not used.'],
      ['Read date', 'Day 42.'],
      ['Kill rule', 'If exposed states do not beat dark states, the budget goes back to calling.'],
    ],
    note: 'This is the incrementality standard in the job description, applied to the channel it is hardest to prove.',
  },
]

export function ExperimentsPage() {
  return (
    <div className="max-w-[1150px]">
      <PageTitle
        title="Experiments"
        sub="The first three tests, written the way the posting asks: hypothesis, read date and kill rule set before launch. Each one has a holdout, so the result is a measured lift."
      />
      <Callout big="Lift against a holdout, or it didn't happen.">
        This census is what makes clean holdouts possible: because every college is already known, groups can be split at random instead of compared after the fact.
      </Callout>

      <div className="mt-4 space-y-4">
        {EXPERIMENTS.map((e) => (
          <section key={e.id} className="border border-line bg-white">
            <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">{e.id}</span>
              <h2 className="text-sm font-semibold text-navy">{e.name}</h2>
            </div>
            <dl className="grid grid-cols-[170px_1fr] text-[13px] leading-relaxed">
              {e.rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="border-b border-line bg-paper px-4 py-2 font-medium text-stone-600">{k}</dt>
                  <dd className="border-b border-line px-4 py-2 text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="px-4 py-2 text-xs text-stone-500">{e.note}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
