import type { ReactNode } from 'react'

/** A headline message meant to be read at a glance. */
export function Callout({ big, children }: { big: ReactNode; children: ReactNode }) {
  return (
    <div className="border border-line border-l-4 border-l-teal bg-white px-4 py-3">
      <div className="text-lg font-semibold leading-snug text-navy">{big}</div>
      <div className="mt-1 text-[13px] leading-relaxed text-stone-600">{children}</div>
    </div>
  )
}

export function PageTitle({ title, sub }: { title: string; sub: ReactNode }) {
  return (
    <div className="mb-5">
      <h1 className="text-xl font-semibold tracking-tight text-navy">{title}</h1>
      <p className="mt-1 max-w-[760px] text-sm leading-relaxed text-stone-600">{sub}</p>
    </div>
  )
}

export function Card({ title, children, className = '' }: { title?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`border border-line bg-white p-4 ${className}`}>
      {title && <h2 className="mb-2 text-sm font-semibold text-navy">{title}</h2>}
      {children}
    </section>
  )
}
