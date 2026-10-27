import { colleges } from '../data'
import { accounts, groupCount } from '../callList'
import { fmt } from '../lib'
import { Callout, PageTitle } from '../Callout'

// Manchester Community College (CT, 129695) merged into Connecticut State Community College during 2023.
const competitorLive = colleges.filter((c) => c.status === 'Competitor' && c.unitid !== '129695').length

const EXPERIMENTS = [
  {
    id: '1',
    name: 'A peer email before the call',
    rows: [
      ['What I expect', 'An email naming nearby AwardSpring colleges, sent two days before the SDR call, will get more colleges to take a first meeting.'],
      ['Who', `The ${fmt(accounts.length)} operating colleges with no platform. ${groupCount('Treatment')} in the test group, ${groupCount('Holdout')} in the control group, split at random within each tier.`],
      ['Test vs control', 'Test group: email on day 0, call on day 2. Control group: call on day 2, no email. Every college still gets called.'],
      ['Measured by', 'First meetings held per 100 colleges.'],
      ['When I read it', 'Three weeks after launch.'],
      ['When I stop it', "I stop the email if the test group doesn't book at least 1.5 times as many meetings as the control group, or if unsubscribes pass 2%."],
    ],
    note: "With about 240 colleges in each group, only a big lift will show. If it comes out even, I'll say so.",
  },
  {
    id: '2',
    name: 'A switching offer for competitor campuses',
    rows: [
      ['What I expect', 'Colleges on another platform will respond more to a concrete switching offer (we move your scholarships and past data over for you) than to a general product email.'],
      ['Who', `The ${fmt(competitorLive)} operating campuses on a competitor. I'd split by portal, not campus, so a district sharing one portal never lands in both groups.`],
      ['Test vs control', 'Test group: switching offer plus call. Control group: standard email plus call.'],
      ['Measured by', 'First meetings held per 100 colleges.'],
      ['When I read it', 'Day 45, because switching takes longer to decide.'],
      ['When I stop it', "If there's no difference by day 45, I drop the offer. SDRs ask for renewal dates instead, and I re-time the list around them."],
    ],
    note: 'The full list is on the Opportunity page, grouped by platform.',
  },
  {
    id: '3',
    name: 'Paid ads, with states held back',
    rows: [
      ['What I expect', "Ads aimed at financial aid and foundation staff create meetings that wouldn't have happened anyway."],
      ['Who', "I'd pair states with similar numbers of target colleges. In each pair, a coin flip decides which state sees ads and which stays dark."],
      ['Test vs control', 'Same SDR effort in both. Only the ads differ.'],
      ['Measured by', "First meetings per college, ad states vs dark states. I wouldn't use the ad platforms' own conversion numbers."],
      ['When I read it', 'Six weeks after launch.'],
      ['When I stop it', "If the ad states don't beat the dark states, the budget goes back into calling."],
    ],
    note: 'Ad platforms report their own results generously. This shows what the ads really added.',
  },
]

export function ExperimentsPage() {
  return (
    <div className="max-w-[1150px]">
      <PageTitle
        title="Experiments"
        sub="The first three tests I'd run. Each one has a control group, so we see what the campaign added, not just what happened while it ran."
      />
      <Callout big="If it doesn't beat the control group, I'd stop it.">
        Because every college is already mapped, I can split groups at random before launch instead of comparing after the fact.
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
