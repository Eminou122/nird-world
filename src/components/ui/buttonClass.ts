const variants = {
  primary: 'bg-gold-400 text-forest-900 hover:bg-gold-300 shadow-soft',
  'outline-dark': 'text-forest-900 ring-1 ring-inset ring-forest-900/25 hover:bg-forest-900/5',
  dark: 'bg-forest-900 text-ivory-50 hover:bg-forest-800 shadow-soft',
  danger: 'bg-[#9c3f28] text-ivory-50 hover:bg-[#83331f] shadow-soft',
} as const

export type ButtonVariant = keyof typeof variants

/** Shared by links and <button>s so both look identical. */
export const buttonClass = (variant: ButtonVariant = 'primary', className = '') =>
  `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-base font-semibold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0 ${variants[variant]} ${className}`
