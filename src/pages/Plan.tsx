import { accounts, callFirst } from '../callList'
import { fmt } from '../lib'
import { Callout, Card, PageTitle } from '../Callout'

const PHASES = [
  {
    when: 'Days 1 to 30',
    goal: 'Listen, fix tracking, start the first test',
    items: [
      "I'd sit in on SDR and AE calls every week, and talk to ten customers before rewriting any message.",
      "I'd fix tracking first, so every campaign and meeting traces back to a real deal in HubSpot.",
      `SDRs get a fresh call list every morning, starting with the ${callFirst.length} call-first colleges.`,
      "I'd launch the first test on the two-year list, with the control group set before it starts.",
      "By day 30, I'd list every manual SDR and contractor task, and which ones AI can take over.",
    ],
  },
  {
    when: 'Days 31 to 60',
    goal: 'Read the results, scale or stop, build the engine',
    items: [
      'At three weeks I read the first test, then scale it or stop it, and write down why.',
      'Then the next two tests: competitor campuses, and paid ads with a state control group.',
      'With the GTM Engineer, I ship the first version of the lead engine: verified contacts going straight into SDR queues.',
      "For foundations, I'd answer every inbound lead in under five minutes, with clear rules on who isn't a fit.",
      "For four-year schools, I'd plan one event for the committees that buy, built from customer conversations.",
    ],
  },
  {
    when: 'Days 61 to 90',
    goal: 'Run it every week',
    items: [
      'Around eight tests a month, each with the expected result, read date and stop rule written down first.',
      'Budget goes only to channels that beat their control group.',
      'Peer content for two-year colleges, one state at a time, with every claim sourced and dated.',
      'I take the Fund Platform message to buyers, backed by customer proof.',
      'Every week, three lines under the dashboard: what moved, why, and what changes next.',
    ],
  },
]

const NUMBERS = [
  { n: 'Pipeline dollars created', how: "Monthly. I'd set the baseline in week 2 from HubSpot." },
  { n: 'First meetings held', how: 'Weekly. The first test reads directly on this.' },
  { n: 'New recurring revenue', how: 'Quarterly. These 90 days build next quarter.' },
]

const SEGMENTS = [
  { s: 'Two-year colleges', play: `The call list and peer proof. ${fmt(accounts.length)} colleges, ranked and ready.` },
  { s: 'Four-year universities', play: "Committees buy here, so I'd lead with events and ideas, not cold lists. Plan by day 60." },
  { s: 'Foundations', play: "Mostly inbound. Fast first response and clear rules on who isn't a fit. Live by day 45." },
]

export function PlanPage() {
  return (
    <div className="max-w-[1150px]">
      <PageTitle title="90 day plan" sub="What I'd do in my first 90 days, and how I'd know it's working." />

      <Callout big="I'd judge everything by pipeline created.">
        If something doesn't fill the call list, prove itself against a control group, or save the team time, I wouldn't do it.
      </Callout>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {PHASES.map((p) => (
          <Card key={p.when}>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-teal">{p.when}</div>
            <div className="mt-1 text-base font-semibold text-navy">{p.goal}</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[13px] leading-relaxed text-stone-700">
              {p.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card title="How I'd measure it">
          <table className="w-full text-[13px]">
            <tbody>
              {NUMBERS.map((x) => (
                <tr key={x.n} className="border-b border-line last:border-0">
                  <td className="py-2 pr-3 font-medium text-navy">{x.n}</td>
                  <td className="py-2 text-stone-600">{x.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-stone-500">I don't know your baselines yet, so I'd set targets with you by day 30 rather than guess them here.</p>
        </Card>
        <Card title="Where I'd start in each segment">
          <table className="w-full text-[13px]">
            <tbody>
              {SEGMENTS.map((x) => (
                <tr key={x.s} className="border-b border-line last:border-0">
                  <td className="w-44 py-2 pr-3 font-medium text-navy">{x.s}</td>
                  <td className="py-2 text-stone-600">{x.play}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
