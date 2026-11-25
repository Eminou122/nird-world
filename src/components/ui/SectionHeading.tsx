import type { ReactNode } from 'react'

export function SectionHeading({ id, title, children }: { id?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="max-w-2xl">
      <h2 id={id} className="text-3xl leading-[1.12] font-medium text-forest-900 sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {children && <div className="mt-4 text-lg leading-relaxed text-ink-muted">{children}</div>}
    </div>
  )
}
