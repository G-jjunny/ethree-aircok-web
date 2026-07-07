import { Suspense } from 'react'
import { PageHeroSection } from './PageHeroSection'
import { IntroSection } from './IntroSection'
import { TeamSection } from './TeamSection'
import { PartnersSection } from './PartnersSection'
import { HistorySection } from './HistorySection'

export function AboutView() {
  return (
    <main>
      <PageHeroSection />
      <Suspense fallback={<div className="min-h-[600px] bg-surface-white" />}>
        <IntroSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[500px] bg-surface-light" />}>
        <TeamSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[500px] bg-surface-light" />}>
        <PartnersSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[500px] bg-surface-white" />}>
        <HistorySection />
      </Suspense>
    </main>
  )
}
