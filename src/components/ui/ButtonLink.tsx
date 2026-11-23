import type { ReactNode } from 'react'
import { Link, type To } from 'react-router'

const variants = {
  primary: 'bg-gold-400 text-forest-900 hover:bg-gold-300 shadow-soft',
  'outline-light': 'text-ivory-50 ring-1 ring-inset ring-ivory-50/30 hover:bg-ivory-50/10',
  'outline-dark': 'text-forest-900 ring-1 ring-inset ring-forest-900/20 hover:bg-forest-900/5',
  dark: 'bg-forest-900 text-ivory-50 hover:bg-forest-800 shadow-soft',
  danger: 'bg-[#9c3f28] text-ivory-50 hover:bg-[#83331f] shadow-soft',
} as const

export type ButtonVariant = keyof typeof variants

/** Shared by links and <button>s so both look identical. */
export const buttonClass = (variant: ButtonVariant = 'primary', className = '') =>
  `inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.95rem] font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0 ${variants[variant]} ${className}`

interface ButtonLinkProps {
  to: To
  children: ReactNode
  variant?: ButtonVariant
  className?: string
}

export function ButtonLink({ to, children, variant = 'primary', className = '' }: ButtonLinkProps) {
  return (
    <Link to={to} className={buttonClass(variant, className)}>
      {children}
    </Link>
  )
}
