import { accounts, callFirst } from '../callList'
import { fmt } from '../lib'
import { Callout, Card, PageTitle } from '../Callout'

const PHASES = [
  {
    when: 'Days 1 to 30',
    goal: 'Listen, instrument, start the first test',
    items: [
      'Sit in on at least five SDR and AE calls a week, and talk to ten customers before rewriting any segment message.',
      'Fix tracking: UTMs, campaign records and conversion events in GA4 and HubSpot, checked against real deals.',
      `Give SDRs the call list every morning, starting with the ${callFirst.length} call-first accounts.`,
      'Launch experiment 1 on the two-year list, with its holdout locked before launch.',
      'Day 30 AI review: list every SDR and contractor task, with what is automated, what is next, and what it costs.',
    ],
  },
  {
    when: 'Days 31 to 60',
    goal: 'Read, kill or scale, and turn on the engine',
    items: [
      'Read experiment 1 on day 21. Scale it to every account or kill it, and write down why.',
      'Launch experiment 2 (competitor campuses) and experiment 3 (paid media with a state holdout).',
      'GTM Engineer ships lead engine v1: verified contacts routed into SDR queues in HubSpot.',
      'Foundations: answer inbound in under five minutes, with written rules for who is not a fit.',
      'Four-year: a plan for one committee-focused event, built from customer interviews.',
    ],
  },
  {
    when: 'Days 61 to 90',
    goal: 'Run at full cadence',
    items: [
      'Eight experiments a month, each with a hypothesis, read date and kill rule written before launch.',
      'Move budget only to channels that showed lift against a holdout.',
      'Publish peer proof content for two-year colleges, one state at a time, every claim sourced and dated.',
      'Take the first Fund Platform category message to buyers, with proof from customers.',
      'Send three lines under the dashboard every week: what moved, why, and what changes next.',
    ],
  },
]

const NUMBERS = [
  { n: 'Pipeline dollars created', how: 'Monthly, company wide. Baseline set in week 2 from HubSpot.' },
  { n: 'First meetings held', how: 'Weekly, SDR and inbound booked. Experiment 1 reads directly on this.' },
  { n: 'New recurring revenue vs plan', how: 'Quarterly. The 90 day plan feeds the next quarter, not this one.' },
]

const SEGMENTS = [
  { s: 'Two-year colleges', play: `Call list plus peer proof. ${fmt(accounts.length)} accounts with no detectable platform, ranked. Built.` },
  { s: 'Four-year universities', play: 'Committees buy. Lead with events and thought leadership, not cold lists. Plan by day 60.' },
  { s: 'Foundations', play: 'Mostly inbound. Speed to first touch plus written disqualification rules. Live by day 45.' },
]

export function PlanPage() {
  return (
    <div className="max-w-[1150px]">
      <PageTitle
        title="90 day plan"
        sub="Written against the three numbers in the job description. Activity is listed only where it moves one of them."
      />

      <Callout big="One number first: pipeline dollars created.">
        No MQL targets, no rebrand. Every item below either feeds the SDR call list, tests a channel against a holdout, or removes manual work.
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
        <Card title="Scored against your three numbers">
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
          <p className="mt-2 text-xs text-stone-500">I don't know your current baselines, so targets get set with you by day 30, not guessed here.</p>
        </Card>
        <Card title="One play per segment">
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
