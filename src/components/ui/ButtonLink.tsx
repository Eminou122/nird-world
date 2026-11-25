import type { ReactNode } from 'react'
import { Link, type To } from 'react-router'
import { buttonClass, type ButtonVariant } from './buttonClass'

interface ButtonLinkProps {
  to: To
  children: ReactNode
  variant?: ButtonVariant
  className?: string
  viewTransition?: boolean
}

export function ButtonLink({ to, children, variant = 'primary', className = '', viewTransition }: ButtonLinkProps) {
  return (
    <Link to={to} viewTransition={viewTransition} className={buttonClass(variant, className)}>
      {children}
    </Link>
  )
}
