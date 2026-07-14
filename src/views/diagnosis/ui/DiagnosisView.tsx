import { Suspense } from 'react'
import { PageHero } from '@/widgets/page-hero'
import { SITE } from '@/shared/config'
import { DiagnosisImageSection } from './DiagnosisImageSection'
import { DiagnosisFormSection } from './DiagnosisFormSection'

export function DiagnosisView() {
  return (
    <main>
      <PageHero
        eyebrow={SITE.diagnosis.hero.label}
        headline={{ prefix: SITE.pages.diagnosis.title }}
        body={SITE.pages.diagnosis.description}
      />
      <Suspense fallback={<div className="min-h-[400px] bg-surface-white" />}>
        <DiagnosisImageSection />
      </Suspense>
      <DiagnosisFormSection />
    </main>
  )
}
