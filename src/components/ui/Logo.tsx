/** Isometric cube mark + wordmark. */
export function Logo({ onDark = true }: { onDark?: boolean }) {
  const text = onDark ? 'text-ivory-50' : 'text-forest-900'
  return (
    <span className={`inline-flex items-center gap-2.5 ${text}`}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
        <path d="M16 4 27 10 16 16 5 10Z" fill="#D6A85F" />
        <path d="M5 10 16 16V28L5 22Z" fill={onDark ? '#F3F1E9' : '#142D27'} />
        <path d="M27 10 16 16V28L27 22Z" fill="#28785B" />
      </svg>
      <span className="font-display text-lg leading-none font-semibold tracking-tight">
        NIRD <span className="font-sans text-[0.8em] font-medium tracking-[0.28em]">WORLD</span>
      </span>
    </span>
  )
}
