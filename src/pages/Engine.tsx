import { colleges } from '../data'
import { excluded } from '../callList'
import { fmt } from '../lib'
import { Callout, Card, PageTitle } from '../Callout'

const merged = excluded.filter((e) => e.reason.startsWith('Merged')).length + 1 // plus Manchester, a merged competitor campus

const STAGES = [
  {
    stage: 'Find',
    v0: `Every US public two-year college (${fmt(colleges.length)}) from the federal IPEDS directory, with website, system and EIN.`,
    v1: 'Add four-year universities and community foundations from IPEDS and the IRS exempt organization file. Refresh every year.',
  },
  {
    stage: 'Verify',
    v0: 'Platform detection through a site crawl, a direct portal probe and an attribution check. Five false matches were caught and removed.',
    v1: 'Re-run every month, and flag any college that changes platform as an intent signal for SDRs.',
  },
  {
    stage: 'Enrich',
    v0: 'Enrollment size, locale, AwardSpring peers in the state, and the financial aid page.',
    v1: 'Named financial aid and foundation directors from public staff pages, with verified emails, written to HubSpot with source and date.',
  },
  {
    stage: 'Score',
    v0: 'A transparent points score sorted into tiers A, B and C. Anyone can read why an account ranks where it does.',
    v1: 'Refit the weights against which accounts actually took meetings, once experiment 1 reads.',
  },
  {
    stage: 'Route',
    v0: 'A ranked call list with a call-first flag, an opening line and a fixed holdout group.',
    v1: 'Ranked HubSpot tasks in every SDR queue each morning. Inbound foundation leads routed in under five minutes.',
  },
  {
    stage: 'Refresh',
    v0: 'A one-time snapshot, taken October 2026.',
    v1: 'A monthly re-crawl. Merged and closed colleges are dropped automatically using the IPEDS status field.',
  },
]

const RULES = [
  'A portal counts only when it names the college. Short web names like "ecc" and "mcc" caused five false matches before this rule existed.',
  'Absence is not evidence. "No platform" needs a negative check, such as the vendor sending a non-customer address to its marketing page.',
  'Count shared district portals once per portal when splitting test groups, and once per campus when measuring coverage.',
  `Directories go stale. ${merged} colleges in the 2023 directory had already merged into others, so status gets checked before anything is routed.`,
  'Every number a person writes gets recomputed from the data before it ships.',
]

const OWNERS = [
  { who: 'Head of Marketing & Demand Gen', what: 'Owns the rules, the scoring, the experiment design and the kill decisions. Reads the output every week.' },
  { who: 'GTM Engineer', what: 'Builds and runs the engine, owns data quality and the HubSpot integration.' },
  { who: 'SDRs', what: "Call, and log a reason on every disposition, so the score learns what a good account looks like." },
]

export function EnginePage() {
  return (
    <div className="max-w-[1150px]">
      <PageTitle
        title="Lead engine"
        sub="The spec I would hand the GTM Engineer on day 1. Version 0 already exists: it is the pipeline behind this site. Version 1 is what we build together."
      />
      <Callout big="Find, verify, enrich, score, route, refresh.">
        The posting asks for a system that finds, verifies, enriches and routes contacts to SDR queues. This is that system, with v0 already running for under $10 of compute.
      </Callout>

      <div className="mt-4 overflow-hidden border border-line bg-white">
        <table className="w-full border-collapse text-[13px] leading-relaxed">
          <thead className="bg-paper text-left text-[11px] uppercase tracking-wide text-stone-500">
            <tr>
              <th className="w-28 px-4 py-2">Stage</th>
              <th className="px-4 py-2">v0, built for this site</th>
              <th className="px-4 py-2">v1, for the GTM Engineer</th>
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
        <Card title="Rules already learned the hard way">
          <ul className="list-disc space-y-2 pl-5 text-[13px] leading-relaxed text-stone-700">
            {RULES.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </Card>
        <Card title="Who owns what">
          <table className="w-full text-[13px]">
            <tbody>
              {OWNERS.map((o) => (
                <tr key={o.who} className="border-b border-line align-top last:border-0">
                  <td className="w-48 py-2 pr-3 font-medium text-navy">{o.who}</td>
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
