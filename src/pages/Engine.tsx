import { colleges } from '../data'
import { excluded } from '../callList'
import { fmt } from '../lib'
import { Callout, Card, PageTitle } from '../Callout'

const merged = excluded.filter((e) => e.reason.startsWith('Merged')).length + 1 // plus Manchester, a merged competitor campus

const STAGES = [
  {
    stage: 'Find',
    v0: `Every US public two-year college (${fmt(colleges.length)}) from the federal IPEDS directory, with website, system and EIN.`,
    v1: 'Add four-year universities and community foundations from IPEDS and the IRS nonprofit file. Refresh every year.',
  },
  {
    stage: 'Verify',
    v0: 'I checked each college through a site crawl, a direct portal check and a name match. I caught and removed five false matches.',
    v1: 'Re-run every month, and flag any college that switches platform so SDRs can call while it is deciding.',
  },
  {
    stage: 'Enrich',
    v0: 'Enrollment size, location, AwardSpring colleges in the same state, and the financial aid page.',
    v1: 'Named financial aid and foundation directors from public staff pages, with verified emails, written to HubSpot with source and date.',
  },
  {
    stage: 'Score',
    v0: 'A simple points score with tiers A, B and C, so anyone can see why a college ranks where it does.',
    v1: 'Re-weight the score based on which colleges actually took meetings, once the first test is read.',
  },
  {
    stage: 'Route',
    v0: 'A ranked call list with a call-first flag, an opening line and a fixed control group.',
    v1: 'Ranked tasks in every SDR queue in HubSpot each morning. Inbound foundation leads routed in under five minutes.',
  },
  {
    stage: 'Refresh',
    v0: 'A one-time snapshot, taken October 2026.',
    v1: 'A monthly re-check. Merged and closed colleges drop off automatically using the IPEDS status field.',
  },
]

const RULES = [
  'A portal only counts when it names the college. Short web names like "ecc" and "mcc" got matched to the wrong college until I added this check.',
  "No result isn't proof. Before I mark a college as having no platform, I need a negative check, like the vendor redirecting a non-customer address to its marketing page.",
  'Districts that share one portal count once when splitting test groups, and once per campus when measuring coverage.',
  `The directory goes stale. ${merged} colleges in the 2023 list had already merged into others, so I check status before anything goes to an SDR.`,
  'I recompute every number from the data before it goes out.',
]

const OWNERS = [
  { who: 'Me', what: 'The rules, the scoring, the tests, and the call on what to stop. I read the output every week.' },
  { who: 'GTM Engineer', what: 'Builds and runs the engine, keeps the data clean, connects it to HubSpot.' },
  { who: 'SDRs', what: 'Make the calls and log why each one went the way it did, so the scoring gets smarter.' },
]

export function EnginePage() {
  return (
    <div className="max-w-[1150px]">
      <PageTitle
        title="Lead engine"
        sub="How I'd build the lead engine with your GTM Engineer. Version 0 already exists: it's what I used to build this site. Version 1 is what we'd build together."
      />
      <Callout big="Find, verify, enrich, score, route, refresh.">
        The goal: SDRs start every morning with verified, ranked contacts in HubSpot instead of researching them by hand. Version 0 cost under $10 to run.
      </Callout>

      <div className="mt-4 overflow-hidden border border-line bg-white">
        <table className="w-full border-collapse text-[13px] leading-relaxed">
          <thead className="bg-paper text-left text-[11px] uppercase tracking-wide text-stone-500">
            <tr>
              <th className="w-28 px-4 py-2">Stage</th>
              <th className="px-4 py-2">v0, what I built for this site</th>
              <th className="px-4 py-2">v1, what we'd build together</th>
            </tr>
          </thead>
          <tbody>
            {STAGES.map((s) => (
              <tr key={s.stage} className="border-t border-line align-top">
                <td className="px-4 py-2.5 font-semibold text-navy">{s.stage}</td>
                <td className="px-4 py-2.5 text-stone-700">{s.v0}</td>
                <td className="px-4 py-2.5 text-ink">{s.v1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card title="What I learned building it">
          <ul className="list-disc space-y-2 pl-5 text-[13px] leading-relaxed text-stone-700">
            {RULES.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </Card>
        <Card title="Who does what">
          <table className="w-full text-[13px]">
            <tbody>
              {OWNERS.map((o) => (
                <tr key={o.who} className="border-b border-line align-top last:border-0">
                  <td className="w-36 py-2 pr-3 font-medium text-navy">{o.who}</td>
                  <td className="py-2 text-stone-600">{o.what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
