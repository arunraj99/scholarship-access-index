import { Children, isValidElement, type ReactNode } from 'react'
import Markdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import numbersOfRecord from '../../NUMBERS_OF_RECORD.md?raw'
import reportNumbers from '../../REPORT_NUMBERS.md?raw'
import findingsFull from '../../data/full/FINDINGS_FULL.md?raw'

const DOCS = [
  { id: 'numbers-of-record', file: 'NUMBERS_OF_RECORD.md', source: numbersOfRecord },
  { id: 'report-numbers', file: 'REPORT_NUMBERS.md', source: reportNumbers },
  { id: 'findings-full', file: 'data/full/FINDINGS_FULL.md', source: findingsFull },
]

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((c) => (typeof c === 'string' || typeof c === 'number' ? String(c) : isValidElement<{ children?: ReactNode }>(c) ? textOf(c.props.children) : ''))
    .join('')
}

const stripMd = (s: string) => s.replace(/[*_`]/g, '').trim()

function subheadings(source: string): string[] {
  return source.split('\n').filter((l) => l.startsWith('## ')).map((l) => stripMd(l.slice(3)))
}

function components(docId: string): Components {
  return {
    h2: ({ children }) => <h2 id={`${docId}--${slug(textOf(children))}`}>{children}</h2>,
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
    ),
  }
}

function jump(id: string) {
  document.getElementById(id)?.scrollIntoView({ block: 'start' })
}

export function MethodPage() {
  return (
    <div className="max-w-[900px]">
      <nav className="mb-6 border border-line bg-white p-4 text-sm" aria-label="Contents">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-stone-500">Contents</div>
        <ol className="space-y-2">
          {DOCS.map((d, i) => (
            <li key={d.id}>
              <button type="button" onClick={() => jump(d.id)} className="font-medium text-navy hover:underline">
                {i + 1}. {d.file}
              </button>
              <ul className="mt-1 space-y-0.5 pl-5">
                {subheadings(d.source).map((h) => (
                  <li key={h}>
                    <button type="button" onClick={() => jump(`${d.id}--${slug(h)}`)} className="text-left text-stone-600 transition-colors duration-150 hover:text-teal hover:underline">
                      {h}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </nav>

      {DOCS.map((d, i) => (
        <section key={d.id} id={d.id} className="mb-8 scroll-mt-16 border border-line bg-white">
          <h2 className="border-b border-line bg-paper px-5 py-2 font-mono text-xs font-semibold text-stone-600">
            {i + 1}. {d.file}
          </h2>
          <div className="md px-5 py-4">
            <Markdown remarkPlugins={[remarkGfm]} components={components(d.id)}>
              {d.source}
            </Markdown>
          </div>
        </section>
      ))}
    </div>
  )
}
