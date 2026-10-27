import { Children, isValidElement, useEffect, useState, type ReactNode } from 'react'
import Markdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import method from '../../METHOD.md?raw'

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((c) => (typeof c === 'string' || typeof c === 'number' ? String(c) : isValidElement<{ children?: ReactNode }>(c) ? textOf(c.props.children) : ''))
    .join('')
}

const HEADINGS = method
  .split('\n')
  .filter((l) => l.startsWith('## '))
  .map((l) => {
    const text = l.slice(3).replace(/[*_`]/g, '').trim()
    return { text, id: slug(text) }
  })

const components: Components = {
  h2: ({ children }) => <h2 id={slug(textOf(children))}>{children}</h2>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
  ),
}

function useActiveHeading(): string | null {
  const [active, setActive] = useState<string | null>(HEADINGS[0]?.id ?? null)
  useEffect(() => {
    const els = HEADINGS.map((h) => document.getElementById(h.id)).filter((e): e is HTMLElement => !!e)
    const onScroll = () => {
      let current = els[0]?.id ?? null
      for (const el of els) {
        if (el.getBoundingClientRect().top <= 120) current = el.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return active
}

export function MethodPage() {
  const active = useActiveHeading()

  return (
    <div className="flex items-start gap-8">
      <article className="doc min-w-0 max-w-[760px] flex-1 border border-line bg-white px-10 py-8">
        <Markdown remarkPlugins={[remarkGfm]} components={components}>
          {method}
        </Markdown>
      </article>

      <nav aria-label="On this page" className="sticky top-[76px] hidden w-56 shrink-0 text-[13px] lg:block">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-stone-500">On this page</div>
        <ul className="border-l border-line">
          {HEADINGS.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => document.getElementById(h.id)?.scrollIntoView({ block: 'start' })}
                className={`-ml-px block w-full border-l-2 py-1 pl-3 text-left leading-snug transition-colors duration-150 ${
                  active === h.id ? 'border-teal font-medium text-navy' : 'border-transparent text-stone-500 hover:text-navy'
                }`}
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
