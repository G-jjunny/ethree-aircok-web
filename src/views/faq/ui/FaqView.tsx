import { Suspense } from 'react'
import { HeroSection } from './HeroSection'
import { FaqSection } from './FaqSection'

export function FaqView() {
  return (
    <main>
      <HeroSection />
      <Suspense fallback={<div className="min-h-[600px] bg-surface-white" />}>
        <FaqSection />
      </Suspense>
    </main>
  )
}
