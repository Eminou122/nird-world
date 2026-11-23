import type { ReactNode } from 'react'

interface SectionHeadingProps {
  id?: string
  eyebrow: string
  title: ReactNode
  children?: ReactNode
  onDark?: boolean
}

export function SectionHeading({ id, eyebrow, title, children, onDark = false }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className={`text-xs font-semibold tracking-[0.18em] uppercase ${onDark ? 'text-gold-400' : 'text-emerald-700'}`}>
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`mt-3 text-3xl leading-[1.1] font-medium sm:text-4xl lg:text-[2.75rem] ${onDark ? 'text-ivory-50' : 'text-forest-900'}`}
      >
        {title}
      </h2>
      {children && (
        <div className={`mt-5 text-lg leading-relaxed ${onDark ? 'text-ivory-100/75' : 'text-ink-muted'}`}>{children}</div>
      )}
    </div>
  )
}
