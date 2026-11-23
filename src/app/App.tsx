import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { RouterProvider } from 'react-router/dom'
import { router } from './routes'

export function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </LazyMotion>
  )
}
