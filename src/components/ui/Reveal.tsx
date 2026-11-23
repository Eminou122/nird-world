import * as m from 'motion/react-m'
import type { ReactNode } from 'react'

/** Fades content in once it scrolls into view. Movement is dropped for reduced-motion users (see MotionConfig). */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </m.div>
  )
}
